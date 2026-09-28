import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * useAuth Composable
 * 
 * Provides authentication-related functionality and reactive state.
 * Wraps the authStore to provide a convenient API for components.
 * 
 * @returns {{
 *   isAuthenticated: import('vue').ComputedRef<boolean>,
 *   isAdmin: import('vue').ComputedRef<boolean>,
 *   currentUser: import('vue').ComputedRef<Object | null>,
 *   userName: import('vue').ComputedRef<string>,
 *   loading: import('vue').ComputedRef<boolean>,
 *   login: (credentials: {email: string, password: string}) => Promise<void>,
 *   register: (userData: {name: string, email: string, password: string}) => Promise<void>,
 *   logout: () => void,
 *   checkAuth: () => Promise<boolean>
 * }} Authentication utilities
 * 
 * @example
 * // In a component
 * import { useAuth } from '@/composables/useAuth'
 * 
 * const { isAuthenticated, currentUser, login, logout } = useAuth()
 * 
 * // Check authentication status
 * if (isAuthenticated.value) {
 *   console.log('Logged in as:', currentUser.value.name)
 * }
 * 
 * // Login
 * try {
 *   await login({ email: 'user@example.com', password: 'password123' })
 * } catch (error) {
 *   console.error('Login failed:', error.message)
 * }
 * 
 * // Logout
 * logout()
 */
export function useAuth() {
  const authStore = useAuthStore()

  // Computed properties from store
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isAdmin = computed(() => authStore.isAdmin)
  const currentUser = computed(() => authStore.currentUser)
  const userName = computed(() => authStore.userName)
  const loading = computed(() => authStore.loading)

  // Action methods
  const login = async (credentials) => {
    return await authStore.login(credentials)
  }

  const register = async (userData) => {
    return await authStore.register(userData)
  }

  const logout = () => {
    authStore.logout()
  }

  const checkAuth = async () => {
    return await authStore.checkAuth()
  }

  return {
    // State
    isAuthenticated,
    isAdmin,
    currentUser,
    userName,
    loading,
    // Actions
    login,
    register,
    logout,
    checkAuth
  }
}
