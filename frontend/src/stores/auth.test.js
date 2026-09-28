/**
 * Unit tests for authStore
 * Tests the authentication store actions and getters
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth.js'
import authService from '@/services/auth.service.js'

// Mock the authService
vi.mock('@/services/auth.service.js', () => ({
  default: {
    login: vi.fn(),
    register: vi.fn()
  }
}))

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token) => {
    // Simulate decoding a JWT token
    if (token === 'valid-token') {
      return {
        sub: 'user-123',
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
      }
    }
    if (token === 'admin-token') {
      return {
        sub: 'admin-456',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + 3600
      }
    }
    if (token === 'expired-token') {
      return {
        sub: 'user-789',
        role: 'user',
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      }
    }
    throw new Error('Invalid token')
  })
}))

describe('authStore', () => {
  let store

  beforeEach(() => {
    // Create a new pinia instance for each test
    setActivePinia(createPinia())
    store = useAuthStore()
    
    // Clear localStorage
    localStorage.clear()
    
    // Reset mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have null user and token', () => {
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.initialized).toBe(false)
    })

    it('should not be authenticated initially', () => {
      expect(store.isAuthenticated).toBe(false)
    })

    it('should not be admin initially', () => {
      expect(store.isAdmin).toBe(false)
    })
  })

  describe('setAuth', () => {
    it('should set token and decode user data', () => {
      store.setAuth('valid-token')

      expect(store.token).toBe('valid-token')
      expect(store.user).toEqual({
        id_usuario: 'user-123',
        role: 'user'
      })
      expect(localStorage.getItem('auth_token')).toBe('valid-token')
      expect(localStorage.getItem('auth_user')).toBe(
        JSON.stringify({ id_usuario: 'user-123', role: 'user' })
      )
    })

    it('should set admin role correctly', () => {
      store.setAuth('admin-token')

      expect(store.user.role).toBe('admin')
      expect(store.isAdmin).toBe(true)
    })

    it('should call logout on invalid token', () => {
      const logoutSpy = vi.spyOn(store, 'logout')
      store.setAuth('invalid-token')

      expect(logoutSpy).toHaveBeenCalled()
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('login', () => {
    it('should call authService.login and setAuth', async () => {
      authService.login.mockResolvedValue({
        access_token: 'valid-token',
        token_type: 'bearer'
      })

      await store.login({ correo: 'test@example.com', contrasena: 'password' })

      expect(authService.login).toHaveBeenCalledWith({
        correo: 'test@example.com',
        contrasena: 'password'
      })
      expect(store.token).toBe('valid-token')
      expect(store.user).toEqual({
        id_usuario: 'user-123',
        role: 'user'
      })
      expect(store.loading).toBe(false)
    })

    it('should set loading to false on error', async () => {
      authService.login.mockRejectedValue(new Error('Login failed'))

      await expect(
        store.login({ correo: 'test@example.com', contrasena: 'wrong' })
      ).rejects.toThrow('Login failed')
      
      expect(store.loading).toBe(false)
    })
  })

  describe('register', () => {
    it('should call authService.register and setAuth', async () => {
      authService.register.mockResolvedValue({
        access_token: 'valid-token',
        token_type: 'bearer'
      })

      await store.register({
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena: 'password'
      })

      expect(authService.register).toHaveBeenCalledWith({
        nombre: 'Test User',
        correo: 'test@example.com',
        contrasena: 'password'
      })
      expect(store.token).toBe('valid-token')
      expect(store.user).toEqual({
        id_usuario: 'user-123',
        role: 'user'
      })
      expect(store.loading).toBe(false)
    })

    it('should set loading to false on error', async () => {
      authService.register.mockRejectedValue(new Error('Registration failed'))

      await expect(
        store.register({
          nombre: 'Test User',
          correo: 'test@example.com',
          contrasena: 'password'
        })
      ).rejects.toThrow('Registration failed')
      
      expect(store.loading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user, token, and localStorage', () => {
      store.setAuth('valid-token')
      expect(store.isAuthenticated).toBe(true)

      store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('auth_user')).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('should restore authentication state from localStorage', async () => {
      localStorage.setItem('auth_token', 'valid-token')
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ id_usuario: 'user-123', role: 'user' })
      )

      await store.checkAuth()

      expect(store.token).toBe('valid-token')
      expect(store.user).toEqual({
        id_usuario: 'user-123',
        role: 'user'
      })
      expect(store.isAuthenticated).toBe(true)
      expect(store.initialized).toBe(true)
    })

    it('should logout if token is expired', async () => {
      localStorage.setItem('auth_token', 'expired-token')
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ id_usuario: 'user-789', role: 'user' })
      )

      await store.checkAuth()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.initialized).toBe(true)
    })

    it('should do nothing if no token in localStorage', async () => {
      await store.checkAuth()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.initialized).toBe(true)
    })

    it('should logout on invalid token', async () => {
      localStorage.setItem('auth_token', 'invalid-token')
      localStorage.setItem(
        'auth_user',
        JSON.stringify({ id_usuario: 'user-123', role: 'user' })
      )

      await store.checkAuth()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(store.initialized).toBe(true)
    })
  })

  describe('getters', () => {
    it('isAuthenticated should return true when token and user exist', () => {
      store.setAuth('valid-token')
      expect(store.isAuthenticated).toBe(true)
    })

    it('isAuthenticated should return false when token or user is missing', () => {
      expect(store.isAuthenticated).toBe(false)
      
      store.token = 'some-token'
      expect(store.isAuthenticated).toBe(false)
      
      store.token = null
      store.user = { id_usuario: '123', role: 'user' }
      expect(store.isAuthenticated).toBe(false)
    })

    it('isAdmin should return true for admin role', () => {
      store.setAuth('admin-token')
      expect(store.isAdmin).toBe(true)
    })

    it('isAdmin should return false for non-admin role', () => {
      store.setAuth('valid-token')
      expect(store.isAdmin).toBe(false)
    })

    it('currentUser should return user object', () => {
      store.setAuth('valid-token')
      expect(store.currentUser).toEqual({
        id_usuario: 'user-123',
        role: 'user'
      })
    })

    it('userName should return null when user has no nombre', () => {
      store.setAuth('valid-token')
      expect(store.userName).toBeNull()
    })
  })
})
