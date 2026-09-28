import { useToastStore } from '@/stores/toast'

/**
 * Composable for displaying toast notifications
 * Provides convenient methods for showing different types of toasts
 * 
 * @returns {Object} Toast notification methods
 */
export function useToast() {
  const toastStore = useToastStore()

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in ms (default: 5000)
   */
  const showToast = (message, type = 'info', duration = 5000) => {
    toastStore.show({ message, type, duration })
  }

  /**
   * Show a success toast
   * @param {string} message - Success message
   * @param {number} duration - Duration in ms
   */
  const success = (message, duration = 5000) => {
    toastStore.success(message, duration)
  }

  /**
   * Show an error toast
   * @param {string} message - Error message
   * @param {number} duration - Duration in ms
   */
  const error = (message, duration = 5000) => {
    toastStore.error(message, duration)
  }

  /**
   * Show a warning toast
   * @param {string} message - Warning message
   * @param {number} duration - Duration in ms
   */
  const warning = (message, duration = 5000) => {
    toastStore.warning(message, duration)
  }

  /**
   * Show an info toast
   * @param {string} message - Info message
   * @param {number} duration - Duration in ms
   */
  const info = (message, duration = 5000) => {
    toastStore.info(message, duration)
  }

  /**
   * Remove a specific toast
   * @param {string} id - Toast ID
   */
  const remove = (id) => {
    toastStore.remove(id)
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    remove
  }
}
