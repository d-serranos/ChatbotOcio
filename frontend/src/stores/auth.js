import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import authService from '@/services/auth.service.js'

/**
 * Authentication Store
 * 
 * Manages user authentication state including login, registration, and token management.
 * 
 * State:
 * - user: Current authenticated user data (null when not authenticated)
 * - token: JWT authentication token
 * - loading: Loading state for async operations
 * - initialized: Whether the store has been initialized (checked for stored tokens)
 * 
 * Getters:
 * - isAuthenticated: Boolean indicating if user is logged in
 * - isAdmin: Boolean indicating if user has admin role
 * - currentUser: Current user object
 * - userName: Current user's name
 * 
 * Actions:
 * - login: Authenticate user with credentials
 * - register: Create new user account
 * - logout: Clear authentication state
 * - setAuth: Set authentication token and decode user data
 * - checkAuth: Restore authentication state from localStorage
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    initialized: false
  }),

  getters: {
    /**
     * Check if user is authenticated
     * @returns {boolean} True if user has valid token
     */
    isAuthenticated: (state) => !!state.token && !!state.user,

    /**
     * Check if user has admin role
     * @returns {boolean} True if user role is 'admin'
     */
    isAdmin: (state) => state.user?.role === 'admin',

    /**
     * Get current user object
     * @returns {object|null} User object or null
     */
    currentUser: (state) => state.user,

    /**
     * Get current user's name
     * @returns {string|null} User name or null
     */
    userName: (state) => state.user?.nombre || null
  },

  actions: {
    /**
     * Authenticate user with credentials
     * @param {object} credentials - User credentials { correo, contrasena }
     * @throws {Error} When login fails
     */
    async login(credentials) {
      this.loading = true
      try {
        const response = await authService.login(credentials)
        this.setAuth(response.access_token)
      } finally {
        this.loading = false
      }
    },

    /**
     * Register new user account
     * @param {object} userData - User registration data { nombre, correo, contrasena }
     * @throws {Error} When registration fails
     */
    async register(userData) {
      this.loading = true
      try {
        const response = await authService.register(userData)
        this.setAuth(response.access_token)
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear authentication state and logout user
     */
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    /**
     * Set authentication token and decode user data
     * @param {string} token - JWT authentication token
     */
    setAuth(token) {
      this.token = token
      
      try {
        // Decode JWT to extract user data
        const decoded = jwtDecode(token)
        
        // Extract user information from token
        // The JWT contains: sub (id_usuario), role, exp
        this.user = {
          id_usuario: decoded.sub,
          role: decoded.role
        }
        
        // Store token and user in localStorage
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      } catch (error) {
        console.error('Failed to decode JWT token:', error)
        this.logout()
      }
    },

    /**
     * Restore authentication state from localStorage
     * Checks for stored token and validates expiration
     */
    async checkAuth() {
      try {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        
        if (!token || !userStr) {
          return
        }
        
        // Decode token to check expiration
        const decoded = jwtDecode(token)
        
        // Check if token has expired (exp is in seconds, Date.now() is in milliseconds)
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('Token expired, logging out')
          this.logout()
          return
        }
        
        // Token is valid, restore authentication state
        this.token = token
        this.user = JSON.parse(userStr)
      } catch (error) {
        console.error('Failed to restore authentication state:', error)
        this.logout()
      } finally {
        this.initialized = true
      }
    }
  }
})
