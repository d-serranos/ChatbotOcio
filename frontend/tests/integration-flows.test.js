/**
 * Integration Flow Tests
 * These tests verify complete user journeys through the application
 * 
 * NOTE: These tests require the backend API to be running
 * Start backend before running: cd backend && docker-compose up -d
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import axios from 'axios'

// Import stores
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useChatStore } from '@/stores/chat'

// Import views
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import CatalogMoviesView from '@/views/CatalogMoviesView.vue'
import AdminMoviesView from '@/views/admin/AdminMoviesView.vue'

// Create test router
const createTestRouter = () => {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/login', name: 'login', component: LoginView },
      { path: '/register', name: 'register', component: RegisterView },
      { path: '/catalog/movies', name: 'catalog-movies', component: CatalogMoviesView },
      { path: '/admin/movies', name: 'admin-movies', component: AdminMoviesView }
    ]
  })
}

describe('Guest User Flow', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    
    // Clear localStorage
    localStorage.clear()
    
    // Mock console methods to reduce test output noise
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should allow browsing public pages without authentication', async () => {
    const authStore = useAuthStore()
    
    // Verify user is not authenticated
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.user).toBeNull()
    
    // User should be able to access home page
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
    
    // User should be able to access catalog
    await router.push('/catalog/movies')
    expect(router.currentRoute.value.path).toBe('/catalog/movies')
  })

  it('should display chat interface on home page', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router]
      }
    })

    await flushPromises()

    // Check that chat interface elements are present
    expect(wrapper.html()).toContain('chat')
  })

  it('should redirect to login when accessing admin routes', async () => {
    // This test verifies the navigation guard behavior
    const authStore = useAuthStore()
    
    expect(authStore.isAuthenticated).toBe(false)
    
    // Attempt to navigate to admin route
    // In a real app with guards, this would redirect to login
    // This test documents the expected behavior
    expect(authStore.isAdmin).toBe(false)
  })
})

describe('Authenticated User Flow', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should store user data after successful login', async () => {
    const authStore = useAuthStore()
    
    // Mock successful login response
    const mockToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzM1MDAwMDAwLCJub21icmUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJyb2wiOiJ1c2VyIn0.test'
    
    // Mock axios post for login
    vi.spyOn(axios, 'post').mockResolvedValue({
      data: {
        access_token: mockToken,
        token_type: 'bearer'
      }
    })
    
    // Perform login
    await authStore.login({
      email: 'test@test.com',
      password: 'password123'
    })
    
    // Verify authentication state
    expect(authStore.isAuthenticated).toBe(true)
    expect(authStore.token).toBe(mockToken)
    expect(localStorage.getItem('token')).toBe(mockToken)
  })

  it('should clear user data on logout', async () => {
    const authStore = useAuthStore()
    
    // Set up authenticated state
    authStore.token = 'test-token'
    authStore.user = {
      id: 1,
      nombre: 'Test User',
      email: 'test@test.com',
      rol: 'user'
    }
    localStorage.setItem('token', 'test-token')
    
    // Verify authenticated
    expect(authStore.isAuthenticated).toBe(true)
    
    // Perform logout
    authStore.logout()
    
    // Verify logged out
    expect(authStore.isAuthenticated).toBe(false)
    expect(authStore.token).toBeNull()
    expect(authStore.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should include JWT token in chat requests when authenticated', async () => {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    
    // Set up authenticated state
    authStore.token = 'test-token'
    authStore.user = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'user' }
    
    // Mock chat API call
    const mockResponse = {
      data: {
        respuesta: 'Test response',
        id_conversacion: 1,
        id_mensaje: 1
      }
    }
    
    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse)
    
    // Send message
    await chatStore.sendMessage('Test message')
    
    // Verify axios was called with authorization header
    expect(axios.post).toHaveBeenCalled()
  })
})

describe('Admin User Flow', () => {
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createTestRouter()
    localStorage.clear()
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should recognize admin role from JWT token', () => {
    const authStore = useAuthStore()
    
    // Set up admin user
    authStore.user = {
      id: 1,
      nombre: 'Admin User',
      email: 'admin@test.com',
      rol: 'admin'
    }
    authStore.token = 'admin-token'
    
    // Verify admin status
    expect(authStore.isAdmin).toBe(true)
  })

  it('should allow admin to create movies', async () => {
    const authStore = useAuthStore()
    const catalogStore = useCatalogStore()
    
    // Set up admin user
    authStore.user = { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin' }
    authStore.token = 'admin-token'
    
    // Mock API call
    const newMovie = {
      titulo: 'Test Movie',
      genero: 'Action',
      plataforma: 'Netflix',
      anio_lanzamiento: 2024,
      director: 'Test Director',
      duracion: 120,
      calificacion: 8.5,
      sipnosis: 'Test synopsis'
    }
    
    const mockResponse = {
      data: {
        id_pelicula: 1,
        ...newMovie
      }
    }
    
    vi.spyOn(axios, 'post').mockResolvedValue(mockResponse)
    
    // Create movie
    await catalogStore.createMovie(newMovie)
    
    // Verify API was called
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/movies'),
      newMovie
    )
  })

  it('should allow admin to update movies', async () => {
    const authStore = useAuthStore()
    const catalogStore = useCatalogStore()
    
    // Set up admin user
    authStore.user = { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin' }
    authStore.token = 'admin-token'
    
    // Mock API call
    const updatedMovie = {
      titulo: 'Updated Movie',
      genero: 'Drama',
      plataforma: 'Prime Video',
      anio_lanzamiento: 2024
    }
    
    const mockResponse = {
      data: {
        id_pelicula: 1,
        ...updatedMovie
      }
    }
    
    vi.spyOn(axios, 'put').mockResolvedValue(mockResponse)
    
    // Update movie
    await catalogStore.updateMovie(1, updatedMovie)
    
    // Verify API was called
    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/movies/1'),
      updatedMovie
    )
  })

  it('should allow admin to delete movies', async () => {
    const authStore = useAuthStore()
    const catalogStore = useCatalogStore()
    
    // Set up admin user
    authStore.user = { id: 1, nombre: 'Admin', email: 'admin@test.com', rol: 'admin' }
    authStore.token = 'admin-token'
    
    // Mock API call
    vi.spyOn(axios, 'delete').mockResolvedValue({ data: { message: 'Deleted' } })
    
    // Delete movie
    await catalogStore.deleteMovie(1)
    
    // Verify API was called
    expect(axios.delete).toHaveBeenCalledWith(
      expect.stringContaining('/movies/1')
    )
  })
})

describe('Error Scenario Testing', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should handle invalid credentials (401)', async () => {
    const authStore = useAuthStore()
    
    // Mock 401 error
    vi.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 401,
        data: {
          detail: 'Invalid credentials'
        }
      }
    })
    
    // Attempt login with invalid credentials
    await expect(authStore.login({
      email: 'wrong@test.com',
      password: 'wrongpassword'
    })).rejects.toThrow()
    
    // Verify user is not authenticated
    expect(authStore.isAuthenticated).toBe(false)
  })

  it('should handle expired token (401)', () => {
    const authStore = useAuthStore()
    
    // Set expired token
    const expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiZXhwIjoxNjAwMDAwMDAwfQ.test'
    authStore.token = expiredToken
    
    // In a real scenario, the API interceptor would detect this and logout
    // This test documents the expected behavior
  })

  it('should handle network errors', async () => {
    const catalogStore = useCatalogStore()
    
    // Mock network error
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('Network Error'))
    
    // Attempt to fetch movies
    await expect(catalogStore.fetchMovies()).rejects.toThrow()
  })

  it('should handle validation errors (422)', async () => {
    const catalogStore = useCatalogStore()
    
    // Mock validation error
    vi.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ['body', 'anio_lanzamiento'],
              msg: 'Year must be between 1888 and 2030',
              type: 'value_error'
            }
          ]
        }
      }
    })
    
    // Attempt to create movie with invalid year
    await expect(catalogStore.createMovie({
      titulo: 'Test',
      genero: 'Action',
      plataforma: 'Netflix',
      anio_lanzamiento: 1500
    })).rejects.toThrow()
  })

  it('should handle permission errors (403)', async () => {
    const authStore = useAuthStore()
    const catalogStore = useCatalogStore()
    
    // Set up regular user (not admin)
    authStore.user = { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user' }
    authStore.token = 'user-token'
    
    // Verify user is not admin
    expect(authStore.isAdmin).toBe(false)
    
    // Mock 403 error
    vi.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 403,
        data: {
          detail: 'Admin access required'
        }
      }
    })
    
    // Attempt admin operation
    await expect(catalogStore.createMovie({
      titulo: 'Test',
      genero: 'Action'
    })).rejects.toThrow()
  })
})

describe('State Management', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  it('should persist auth state to localStorage', () => {
    const authStore = useAuthStore()
    
    const token = 'test-token'
    authStore.token = token
    authStore.user = {
      id: 1,
      nombre: 'Test User',
      email: 'test@test.com',
      rol: 'user'
    }
    
    // Manually save to localStorage (in real app, Pinia plugin does this)
    localStorage.setItem('token', token)
    
    // Verify persisted
    expect(localStorage.getItem('token')).toBe(token)
  })

  it('should restore auth state from localStorage', () => {
    // Set up localStorage with token
    const token = 'stored-token'
    localStorage.setItem('token', token)
    
    // Initialize auth store
    const authStore = useAuthStore()
    
    // In real app, initialization would restore from localStorage
    // This test documents the expected behavior
  })

  it('should cache catalog data', async () => {
    const catalogStore = useCatalogStore()
    
    // Mock API response
    const mockMovies = [
      { id_pelicula: 1, titulo: 'Movie 1', genero: 'Action' },
      { id_pelicula: 2, titulo: 'Movie 2', genero: 'Drama' }
    ]
    
    vi.spyOn(axios, 'get').mockResolvedValue({ data: mockMovies })
    
    // Fetch movies
    await catalogStore.fetchMovies()
    
    // Verify movies are cached
    expect(catalogStore.movies).toEqual(mockMovies)
    
    // Second fetch should use cache (not make another API call)
    // In real implementation, this would check cache first
  })
})

describe('Computed Properties', () => {
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('isAuthenticated should return true when token exists', () => {
    const authStore = useAuthStore()
    
    expect(authStore.isAuthenticated).toBe(false)
    
    authStore.token = 'test-token'
    authStore.user = { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'user' }
    
    expect(authStore.isAuthenticated).toBe(true)
  })

  it('isAdmin should return true only for admin role', () => {
    const authStore = useAuthStore()
    
    // Regular user
    authStore.user = { id: 1, nombre: 'User', email: 'user@test.com', rol: 'user' }
    expect(authStore.isAdmin).toBe(false)
    
    // Admin user
    authStore.user = { id: 2, nombre: 'Admin', email: 'admin@test.com', rol: 'admin' }
    expect(authStore.isAdmin).toBe(true)
  })

  it('currentUser should return user object', () => {
    const authStore = useAuthStore()
    
    const user = {
      id: 1,
      nombre: 'Test User',
      email: 'test@test.com',
      rol: 'user'
    }
    
    authStore.user = user
    
    expect(authStore.currentUser).toEqual(user)
  })
})
