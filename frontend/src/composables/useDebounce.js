import { ref, watch, onUnmounted } from 'vue'

/**
 * Composable for debouncing function calls
 * Delays function execution until after a specified delay has elapsed
 * since the last time it was invoked
 * 
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Function} Debounced function
 */
export function useDebounce(fn, delay = 300) {
  let timeoutId = null

  // Cleanup on unmount
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Composable for creating a debounced ref value
 * Returns a ref that updates only after the specified delay
 * 
 * @param {any} initialValue - Initial value
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Object} Object with value and debouncedValue refs
 */
export function useDebouncedRef(initialValue, delay = 300) {
  const value = ref(initialValue)
  const debouncedValue = ref(initialValue)
  let timeoutId = null

  // Watch for changes and debounce updates
  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
      timeoutId = null
    }, delay)
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return {
    value,
    debouncedValue
  }
}

/**
 * Composable for debouncing a reactive value with a callback
 * Executes callback after value stops changing for the specified delay
 * 
 * @param {Ref} watchSource - Ref or reactive value to watch
 * @param {Function} callback - Callback to execute after debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Object} Object with cancel method
 */
export function useDebouncedWatch(watchSource, callback, delay = 300) {
  let timeoutId = null

  const stopWatch = watch(watchSource, (newValue, oldValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback(newValue, oldValue)
      timeoutId = null
    }, delay)
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    stopWatch()
  })

  /**
   * Cancel pending debounced callback
   */
  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return {
    cancel
  }
}
