import axios from 'axios'

// Flag to prevent multiple redirects to login
let isRedirectingToLogin = false

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add JWT token from authStore
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (authStore persists it there)
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Reset redirect flag on successful response
    isRedirectingToLogin = false
    return response
  },
  (error) => {
    const { response } = error
    
    // Handle network errors (no response from server)
    if (!response) {
      showToastNotification('Unable to connect to the server. Please check your connection.', 'error')
      return Promise.reject(error)
    }
    
    const { status, data } = response
    
    // Handle 401 Unauthorized - logout and redirect to login
    if (status === 401) {
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true
        
        // Clear authentication data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        
        // Get current path for redirect after login
        const currentPath = window.location.pathname
        const redirectPath = currentPath !== '/login' && currentPath !== '/register' 
          ? `?redirect=${encodeURIComponent(currentPath)}` 
          : ''
        
        // Redirect to login
        window.location.href = `/login${redirectPath}`
      }
      return Promise.reject(error)
    }
    
    // Handle 403 Forbidden - permission denied
    if (status === 403) {
      showToastNotification('You do not have permission to access this resource.', 'error')
      return Promise.reject(error)
    }
    
    // Handle 422 Unprocessable Entity - validation errors
    if (status === 422) {
      // Parse and return validation errors in structured format
      const validationErrors = {}
      
      if (data.detail && Array.isArray(data.detail)) {
        // FastAPI validation error format
        data.detail.forEach((err) => {
          const field = err.loc ? err.loc[err.loc.length - 1] : 'general'
          validationErrors[field] = err.msg
        })
      } else if (data.detail && typeof data.detail === 'string') {
        validationErrors.general = data.detail
      }
      
      // Attach validation errors to error object
      error.validationErrors = validationErrors
      return Promise.reject(error)
    }
    
    // Handle 500, 502, 503, 504 - server errors
    if (status >= 500 && status <= 504) {
      const errorMessages = {
        500: 'An error occurred on the server. Please try again later.',
        502: 'Bad gateway. The server is temporarily unavailable.',
        503: 'Service temporarily unavailable. Please try again later.',
        504: 'Gateway timeout. The server is taking too long to respond.'
      }
      
      const message = errorMessages[status] || 'An error occurred. Please try again later.'
      showToastNotification(message, 'error')
      return Promise.reject(error)
    }
    
    // For other errors, show generic message if available
    if (data && data.detail) {
      showToastNotification(data.detail, 'error')
    }
    
    return Promise.reject(error)
  }
)

// Helper function to show toast notifications
// This will be called by the interceptor, but the actual implementation
// will be handled by the toast store when it's available
function showToastNotification(message, type) {
  // Try to get toast store if available
  if (window.__TOAST_STORE__) {
    window.__TOAST_STORE__.show(message, type)
  } else {
    // Fallback to console if toast store not initialized yet
    console.warn(`[${type.toUpperCase()}]`, message)
  }
}

// Export configured API client
export default apiClient
