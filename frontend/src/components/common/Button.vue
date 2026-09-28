<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <LoadingSpinner
      v-if="loading"
      class="mr-2"
      :size="spinnerSize"
    />
    <slot />
  </button>
</template>

<script setup>
/**
 * Button Component
 * 
 * A reusable, accessible button component with multiple variants, sizes, and loading states.
 * Follows accessibility best practices with proper touch targets (minimum 44px) and keyboard navigation.
 * 
 * @component
 * @example
 * <Button variant="primary" size="md" @click="handleClick">
 *   Click me
 * </Button>
 * 
 * @example
 * <Button variant="danger" :loading="isLoading" @click="deleteItem">
 *   Delete
 * </Button>
 */
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

/**
 * Component props
 */
const props = defineProps({
  /**
   * Visual style variant of the button
   * @type {'primary' | 'secondary' | 'danger' | 'ghost' | 'success'}
   * @default 'primary'
   */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'success'].includes(value)
  },
  /**
   * Size of the button (affects padding and minimum touch target)
   * @type {'sm' | 'md' | 'lg'}
   * @default 'md'
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  /**
   * Whether the button is disabled
   * @type {boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Whether the button is in loading state (shows spinner and disables interaction)
   * @type {boolean}
   * @default false
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * HTML button type attribute
   * @type {'button' | 'submit' | 'reset'}
   * @default 'button'
   */
  type: {
    type: String,
    default: 'button'
  }
})

/**
 * Component emits
 */
const emit = defineEmits({
  /**
   * Emitted when the button is clicked (not emitted if disabled or loading)
   * @param {MouseEvent} event - The click event
   */
  click: (event) => event instanceof MouseEvent
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Size classes - ensuring minimum 44px touch targets on mobile
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[44px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]'
  }
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${variantClasses[props.variant]}`
})

const spinnerSize = computed(() => {
  const sizeMap = {
    sm: 'sm',
    md: 'sm',
    lg: 'md'
  }
  return sizeMap[props.size]
})
</script>
