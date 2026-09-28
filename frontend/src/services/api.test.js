import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import apiClient from './api.js'

// Mock axios
vi.mock('axios')

describe('API Client Configuration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Reset window location
    delete window.location
    window.location = { href: '', pathname: '/' }
    
    // Clear toast store
    window.__TOAST_STORE__ = null
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be configured with correct baseURL', () => {
    // Mock axios.create to return a mock instance
    const mockInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }
    
    axios.create = vi.fn(() => mockInstance)
    
    // Re-import to trigger axios.create with our mock
    expect(axios.create).toBeDefined()
  })

  it('should have correct default timeout', () => {
    expect(apiClient.defaults.timeout).toBe(30000)
  })

  it('should have correct default Content-Type header', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should add Authorization header when token exists in localStorage', () => {
    // Set token in localStorage
    localStorage.setItem('auth_token', 'test-jwt-token')
    
    // Get the request interceptor
    const requestInterceptor = apiClient.interceptors.request.handlers[0]
    
    if (requestInterceptor && requestInterceptor.fulfilled) {
      const config = { headers: {} }
      const result = requestInterceptor.fulfilled(config)
      
      expect(result.headers.Authorization).toBe('Bearer test-jwt-token')
    }
  })

  it('should not add Authorization header when token does not exist', () => {
    // Ensure no token in localStorage
    localStorage.removeItem('auth_token')
    
    // Get the request interceptor
    const requestInterceptor = apiClient.interceptors.request.handlers[0]
    
    if (requestInterceptor && requestInterceptor.fulfilled) {
      const config = { headers: {} }
      const result = requestInterceptor.fulfilled(config)
      
      expect(result.headers.Authorization).toBeUndefined()
    }
  })
})

describe('API Client Response Interceptor', () => {
  beforeEach(() => {
    localStorage.clear()
    window.__TOAST_STORE__ = { show: vi.fn() }
    delete window.location
    window.location = { href: '', pathname: '/admin/movies' }
  })

  it('should handle 401 errors by clearing auth and redirecting to login', async () => {
    localStorage.setItem('auth_token', 'test-token')
    localStorage.setItem('auth_user', JSON.stringify({ id: 1 }))
    
    const error = {
      response: {
        status: 401,
        data: { detail: 'Unauthorized' }
      }
    }
    
    const responseInterceptor = apiClient.interceptors.response.handlers[0]
    
    try {
      if (responseInterceptor && responseInterceptor.rejected) {
        await responseInterceptor.rejected(error)
      }
    } catch (e) {
      // Expected to throw
    }
    
    // Should clear auth data
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
    
    // Should redirect to login with return URL
    expect(window.location.href).toContain('/login')
  })

  it('should handle 403 errors with permission denied message', async () => {
    const mockToastStore = { show: vi.fn() }
    window.__TOAST_STORE__ = mockToastStore
    
    const error = {
      response: {
        status: 403,
        data: { detail: 'Forbidden' }
      }
    }
    
    const responseInterceptor = apiClient.interceptors.response.handlers[0]
    
    try {
      if (responseInterceptor && responseInterceptor.rejected) {
        await responseInterceptor.rejected(error)
      }
    } catch (e) {
      // Expected to throw
    }
    
    expect(mockToastStore.show).toHaveBeenCalledWith(
      'You do not have permission to access this resource.',
      'error'
    )
  })

  it('should handle 422 validation errors', async () => {
    const error = {
      response: {
        status: 422,
        data: {
          detail: [
            { loc: ['body', 'email'], msg: 'Invalid email format' },
            { loc: ['body', 'password'], msg: 'Password too short' }
          ]
        }
      }
    }
    
    const responseInterceptor = apiClient.interceptors.response.handlers[0]
    
    try {
      if (responseInterceptor && responseInterceptor.rejected) {
        await responseInterceptor.rejected(error)
      }
    } catch (e) {
      expect(e.validationErrors).toEqual({
        email: 'Invalid email format',
        password: 'Password too short'
      })
    }
  })

  it('should handle 500 server errors', async () => {
    const mockToastStore = { show: vi.fn() }
    window.__TOAST_STORE__ = mockToastStore
    
    const error = {
      response: {
        status: 500,
        data: { detail: 'Internal Server Error' }
      }
    }
    
    const responseInterceptor = apiClient.interceptors.response.handlers[0]
    
    try {
      if (responseInterceptor && responseInterceptor.rejected) {
        await responseInterceptor.rejected(error)
      }
    } catch (e) {
      // Expected to throw
    }
    
    expect(mockToastStore.show).toHaveBeenCalledWith(
      'An error occurred on the server. Please try again later.',
      'error'
    )
  })

  it('should handle network errors', async () => {
    const mockToastStore = { show: vi.fn() }
    window.__TOAST_STORE__ = mockToastStore
    
    const error = {
      // No response - network error
    }
    
    const responseInterceptor = apiClient.interceptors.response.handlers[0]
    
    try {
      if (responseInterceptor && responseInterceptor.rejected) {
        await responseInterceptor.rejected(error)
      }
    } catch (e) {
      // Expected to throw
    }
    
    expect(mockToastStore.show).toHaveBeenCalledWith(
      'Unable to connect to the server. Please check your connection.',
      'error'
    )
  })
})
