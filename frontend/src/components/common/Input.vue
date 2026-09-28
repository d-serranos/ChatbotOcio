<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :maxlength="maxlength"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        :aria-invalid="error && showError ? 'true' : 'false'"
        :aria-describedby="ariaDescribedBy"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      >
      
      <div
        v-if="error && showError"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    
    <p
      v-if="error && showError"
      :id="`${inputId}-error`"
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </p>
    
    <p
      v-else-if="hint"
      :id="`${inputId}-hint`"
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
/**
 * Input Component
 * 
 * An accessible form input component with label, error states, hints, and validation support.
 * Implements proper ARIA attributes and follows accessibility best practices.
 * Ensures minimum 44px touch targets for mobile accessibility.
 * 
 * @component
 * @example
 * <Input
 *   v-model="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   :required="true"
 *   :error="emailError"
 *   hint="We'll never share your email"
 * />
 */
import { computed, ref } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /**
   * Input value (v-model binding)
   * @type {string | number}
   * @default ''
   */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /**
   * Input label text
   * @type {string}
   * @default ''
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * HTML input type
   * @type {string}
   * @default 'text'
   */
  type: {
    type: String,
    default: 'text'
  },
  /**
   * Placeholder text
   * @type {string}
   * @default ''
   */
  placeholder: {
    type: String,
    default: ''
  },
  /**
   * Error message to display
   * @type {string}
   * @default ''
   */
  error: {
    type: String,
    default: ''
  },
  /**
   * Hint text to display below input
   * @type {string}
   * @default ''
   */
  hint: {
    type: String,
    default: ''
  },
  /**
   * Whether the input is required
   * @type {boolean}
   * @default false
   */
  required: {
    type: Boolean,
    default: false
  },
  /**
   * Whether the input is disabled
   * @type {boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * Maximum character length
   * @type {number}
   * @default undefined
   */
  maxlength: {
    type: Number,
    default: undefined
  },
  /**
   * Minimum value (for number inputs)
   * @type {number | string}
   * @default undefined
   */
  min: {
    type: [Number, String],
    default: undefined
  },
  /**
   * Maximum value (for number inputs)
   * @type {number | string}
   * @default undefined
   */
  max: {
    type: [Number, String],
    default: undefined
  },
  /**
   * Step value (for number inputs)
   * @type {number | string}
   * @default undefined
   */
  step: {
    type: [Number, String],
    default: undefined
  }
})

/**
 * Component emits
 */
const emit = defineEmits({
  /**
   * Emitted when input value changes
   * @param {string | number} value - New input value
   */
  'update:modelValue': (value) => true,
  /**
   * Emitted when input loses focus
   * @param {FocusEvent} event - Blur event
   */
  blur: (event) => event instanceof FocusEvent,
  /**
   * Emitted when input gains focus
   * @param {FocusEvent} event - Focus event
   */
  focus: (event) => event instanceof FocusEvent
})

const showError = ref(false)
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const ariaDescribedBy = computed(() => {
  const descriptions = []
  if (props.error && showError.value) {
    descriptions.push(`${inputId.value}-error`)
  } else if (props.hint) {
    descriptions.push(`${inputId.value}-hint`)
  }
  return descriptions.length > 0 ? descriptions.join(' ') : undefined
})

const inputClasses = computed(() => {
  const baseClasses = 'block w-full rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 px-4 py-3 sm:text-sm min-h-[44px]'
  
  if (props.error && showError.value) {
    return `${baseClasses} border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500`
  }
  
  if (props.disabled) {
    return `${baseClasses} border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed`
  }
  
  return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
  // Show error on input if there's an error
  if (props.error) {
    showError.value = true
  }
}

const handleBlur = (event) => {
  showError.value = true
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>
