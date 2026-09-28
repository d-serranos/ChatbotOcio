<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
      >*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="ariaDescribedBy"
        @change="handleChange"
        @blur="handleBlur"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
          :selected="!modelValue"
        >
          {{ placeholder }}
        </option>
        
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </div>
    </div>
    
    <p
      v-if="error"
      :id="`${selectId}-error`"
      class="mt-1 text-sm text-red-600"
    >
      {{ error }}
    </p>
    
    <p
      v-else-if="hint"
      :id="`${selectId}-hint`"
      class="mt-1 text-sm text-gray-500"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    required: true,
    // Array of strings, numbers, or objects with { value, label }
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'blur'])

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const ariaDescribedBy = computed(() => {
  const descriptions = []
  if (props.error) {
    descriptions.push(`${selectId.value}-error`)
  } else if (props.hint) {
    descriptions.push(`${selectId.value}-hint`)
  }
  return descriptions.length > 0 ? descriptions.join(' ') : undefined
})

// Normalize options to always have { value, label } format
const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return {
        value: option.value ?? option.id ?? option,
        label: option.label ?? option.name ?? option.value ?? option
      }
    }
    return {
      value: option,
      label: option
    }
  })
})

const selectClasses = computed(() => {
  const baseClasses = 'block w-full rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm appearance-none'
  
  if (props.error) {
    return `${baseClasses} border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500`
  }
  
  if (props.disabled) {
    return `${baseClasses} border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed`
  }
  
  return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
})

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = (event) => {
  emit('blur', event)
}
</script>
