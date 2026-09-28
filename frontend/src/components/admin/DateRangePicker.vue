<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4">
      <!-- Start Date -->
      <div class="flex-1 w-full sm:w-auto">
        <label 
          for="start-date" 
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Start Date
        </label>
        <input
          id="start-date"
          v-model="localStartDate"
          type="date"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          :max="localEndDate"
        />
      </div>

      <!-- End Date -->
      <div class="flex-1 w-full sm:w-auto">
        <label 
          for="end-date" 
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          End Date
        </label>
        <input
          id="end-date"
          v-model="localEndDate"
          type="date"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          :min="localStartDate"
          :max="todayDate"
        />
      </div>

      <!-- Apply Button -->
      <button
        @click="applyDateRange"
        :disabled="!isValidDateRange"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Apply
      </button>
    </div>

    <!-- Validation error message -->
    <p v-if="validationError" class="mt-2 text-sm text-red-600">
      {{ validationError }}
    </p>

    <!-- Quick presets -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="preset in quickPresets"
        :key="preset.label"
        @click="applyPreset(preset)"
        class="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && ('start' in value || 'end' in value)
    }
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Local state for date inputs (in YYYY-MM-DD format)
const localStartDate = ref('')
const localEndDate = ref('')

// Today's date for max constraint
const todayDate = computed(() => {
  const today = new Date()
  return formatDateToInput(today)
})

// Quick preset options
const quickPresets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 }
]

/**
 * Format Date object to YYYY-MM-DD string
 */
const formatDateToInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse YYYY-MM-DD string to Date object
 */
const parseInputToDate = (dateString) => {
  return new Date(dateString + 'T00:00:00')
}

/**
 * Initialize local dates from modelValue
 */
const initializeDates = () => {
  if (props.modelValue.start) {
    const startDate = props.modelValue.start instanceof Date 
      ? props.modelValue.start 
      : new Date(props.modelValue.start)
    localStartDate.value = formatDateToInput(startDate)
  }
  
  if (props.modelValue.end) {
    const endDate = props.modelValue.end instanceof Date 
      ? props.modelValue.end 
      : new Date(props.modelValue.end)
    localEndDate.value = formatDateToInput(endDate)
  }
}

// Initialize on mount
initializeDates()

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  () => {
    initializeDates()
  },
  { deep: true }
)

// Validation
const validationError = computed(() => {
  if (!localStartDate.value || !localEndDate.value) {
    return 'Both start and end dates are required'
  }
  
  const start = parseInputToDate(localStartDate.value)
  const end = parseInputToDate(localEndDate.value)
  
  if (end < start) {
    return 'End date cannot be before start date'
  }
  
  return null
})

const isValidDateRange = computed(() => {
  return !validationError.value
})

/**
 * Apply the selected date range
 */
const applyDateRange = () => {
  if (!isValidDateRange.value) return
  
  const start = parseInputToDate(localStartDate.value)
  const end = parseInputToDate(localEndDate.value)
  
  const newValue = { start, end }
  
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

/**
 * Apply a quick preset
 */
const applyPreset = (preset) => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - preset.days)
  
  localStartDate.value = formatDateToInput(start)
  localEndDate.value = formatDateToInput(end)
  
  // Auto-apply the preset
  applyDateRange()
}
</script>
