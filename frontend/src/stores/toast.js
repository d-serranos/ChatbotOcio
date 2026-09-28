import { defineStore } from 'pinia'

/**
 * Toast Store
 * 
 * Manages toast notifications for user feedback.
 * Supports different notification types: success, error, warning, info.
 * 
 * State:
 * - toasts: Array of toast notification objects
 *   Each toast: { id, message, type, duration }
 * 
 * Actions:
 * - show: Show a toast notification with custom configuration
 * - remove: Remove a toast by ID
 * - success: Show success toast (green)
 * - error: Show error toast (red)
 * - warning: Show warning toast (yellow)
 * - info: Show info toast (blue)
 */
export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    /**
     * Show a toast notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type: 'success'|'error'|'warning'|'info'
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    show(message, type = 'info', duration = 5000) {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
      
      const toast = {
        id,
        message,
        type,
        duration
      }

      this.toasts.push(toast)

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }

      return id
    },

    /**
     * Remove a toast notification by ID
     * @param {string} id - Toast ID to remove
     */
    remove(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    /**
     * Show success toast notification (green)
     * @param {string} message - Success message
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    success(message, duration = 5000) {
      return this.show(message, 'success', duration)
    },

    /**
     * Show error toast notification (red)
     * @param {string} message - Error message
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    error(message, duration = 5000) {
      return this.show(message, 'error', duration)
    },

    /**
     * Show warning toast notification (yellow)
     * @param {string} message - Warning message
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    warning(message, duration = 5000) {
      return this.show(message, 'warning', duration)
    },

    /**
     * Show info toast notification (blue)
     * @param {string} message - Info message
     * @param {number} duration - Duration in milliseconds (default: 5000)
     * @returns {string} Toast ID
     */
    info(message, duration = 5000) {
      return this.show(message, 'info', duration)
    }
  }
})
