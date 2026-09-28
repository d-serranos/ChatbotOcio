<template>
  <div
    v-if="error"
    :class="errorClasses"
    role="alert"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <svg
          class="h-5 w-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      
      <div class="ml-3">
        <h3
          v-if="title"
          class="text-sm font-medium text-red-800"
        >
          {{ title }}
        </h3>
        
        <div
          class="text-sm text-red-700"
          :class="{ 'mt-2': title }"
        >
          <p v-if="typeof error === 'string'">
            {{ error }}
          </p>
          
          <ul
            v-else-if="Array.isArray(error)"
            class="list-disc list-inside space-y-1"
          >
            <li
              v-for="(err, index) in error"
              :key="index"
            >
              {{ err }}
            </li>
          </ul>
          
          <div v-else-if="typeof error === 'object'">
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(value, key) in error"
                :key="key"
              >
                <span class="font-medium">{{ key }}:</span> {{ value }}
              </li>
            </ul>
          </div>
        </div>
        
        <div
          v-if="retryable"
          class="mt-4"
        >
          <Button
            variant="secondary"
            size="sm"
            @click="handleRetry"
          >
            Try Again
          </Button>
        </div>
      </div>
      
      <div
        v-if="dismissible"
        class="ml-auto pl-3"
      >
        <button
          type="button"
          class="inline-flex rounded-md text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          @click="handleDismiss"
        >
          <span class="sr-only">Dismiss</span>
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Button from './Button.vue'

const props = defineProps({
  error: {
    type: [String, Array, Object],
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  retryable: {
    type: Boolean,
    default: false
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry', 'dismiss'])

const errorClasses = computed(() => {
  return 'rounded-md bg-red-50 p-4 border border-red-200'
})

const handleRetry = () => {
  emit('retry')
}

const handleDismiss = () => {
  emit('dismiss')
}
</script>
