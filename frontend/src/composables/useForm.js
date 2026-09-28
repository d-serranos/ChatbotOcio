import { ref, reactive } from 'vue'

/**
 * Composable for form validation and state management
 * Provides error tracking, validation, and submission state
 * 
 * @param {Object} initialErrors - Initial errors object (optional)
 * @returns {Object} Form utilities
 */
export function useForm(initialErrors = {}) {
  // Form state
  const errors = reactive({ ...initialErrors })
  const submitting = ref(false)

  /**
   * Validate a single field
   * @param {string} field - Field name
   * @param {Function} validator - Validation function that returns error message or null
   * @returns {boolean} True if valid, false if invalid
   */
  const validateField = (field, validator) => {
    const errorMessage = validator()
    if (errorMessage) {
      errors[field] = errorMessage
      return false
    } else {
      delete errors[field]
      return true
    }
  }

  /**
   * Validate multiple fields
   * @param {Object} validators - Object mapping field names to validator functions
   * @returns {boolean} True if all valid, false if any invalid
   */
  const validate = (validators) => {
    let isValid = true
    Object.entries(validators).forEach(([field, validator]) => {
      const valid = validateField(field, validator)
      if (!valid) isValid = false
    })
    return isValid
  }

  /**
   * Clear all errors
   */
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      delete errors[key]
    })
  }

  /**
   * Clear error for a specific field
   * @param {string} field - Field name
   */
  const clearError = (field) => {
    delete errors[field]
  }

  /**
   * Set error for a specific field
   * @param {string} field - Field name
   * @param {string} message - Error message
   */
  const setError = (field, message) => {
    errors[field] = message
  }

  /**
   * Set multiple errors at once
   * @param {Object} newErrors - Object mapping field names to error messages
   */
  const setErrors = (newErrors) => {
    Object.entries(newErrors).forEach(([field, message]) => {
      errors[field] = message
    })
  }

  /**
   * Check if form has any errors
   * @returns {boolean} True if has errors, false otherwise
   */
  const hasErrors = () => {
    return Object.keys(errors).length > 0
  }

  /**
   * Get error message for a field
   * @param {string} field - Field name
   * @returns {string|undefined} Error message or undefined
   */
  const getError = (field) => {
    return errors[field]
  }

  /**
   * Set submitting state
   * @param {boolean} value - Submitting state
   */
  const setSubmitting = (value) => {
    submitting.value = value
  }

  /**
   * Wrap an async submit handler with automatic submitting state management
   * @param {Function} handler - Async submit handler
   * @returns {Function} Wrapped handler
   */
  const handleSubmit = (handler) => {
    return async (...args) => {
      submitting.value = true
      try {
        await handler(...args)
      } finally {
        submitting.value = false
      }
    }
  }

  return {
    // State
    errors,
    submitting,
    // Methods
    validate,
    validateField,
    clearErrors,
    clearError,
    setError,
    setErrors,
    hasErrors,
    getError,
    setSubmitting,
    handleSubmit
  }
}
