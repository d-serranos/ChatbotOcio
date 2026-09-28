<template>
  <Transition name="toast">
    <div
      v-if="show"
      :class="toastClasses"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="flex items-start">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <component
            :is="iconComponent"
            :class="iconClasses"
          />
        </div>
        
        <!-- Message -->
        <div class="ml-3 flex-1 pt-0.5">
          <p
            class="text-sm font-medium"
            :class="textClasses"
          >
            {{ message }}
          </p>
        </div>
        
        <!-- Close button -->
        <div class="ml-4 flex flex-shrink-0">
          <button
            type="button"
            :class="closeButtonClasses"
            @click="handleClose"
          >
            <span class="sr-only">Close</span>
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
  </Transition>
</template>

<script setup>
import { computed, ref, onMounted, h } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000 // 5 seconds
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const show = ref(true)
let timeoutId = null

const toastClasses = computed(() => {
  const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
  return `${baseClasses} p-4`
})

const iconClasses = computed(() => {
  const sizeClass = 'h-6 w-6'
  const colorClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return `${sizeClass} ${colorClasses[props.type]}`
})

const textClasses = computed(() => {
  const colorClasses = {
    success: 'text-gray-900',
    error: 'text-gray-900',
    warning: 'text-gray-900',
    info: 'text-gray-900'
  }
  return colorClasses[props.type]
})

const closeButtonClasses = computed(() => {
  const baseClasses = 'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  const colorClasses = {
    success: 'text-green-500 hover:text-green-600 focus:ring-green-500',
    error: 'text-red-500 hover:text-red-600 focus:ring-red-500',
    warning: 'text-yellow-500 hover:text-yellow-600 focus:ring-yellow-500',
    info: 'text-blue-500 hover:text-blue-600 focus:ring-blue-500'
  }
  return `${baseClasses} ${colorClasses[props.type]}`
})

// Icon components based on type
const iconComponent = computed(() => {
  const icons = {
    success: () => h('svg', {
      class: 'h-6 w-6',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'aria-hidden': 'true'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    error: () => h('svg', {
      class: 'h-6 w-6',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'aria-hidden': 'true'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ]),
    warning: () => h('svg', {
      class: 'h-6 w-6',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'aria-hidden': 'true'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      })
    ]),
    info: () => h('svg', {
      class: 'h-6 w-6',
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      'aria-hidden': 'true'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  }
  
  return icons[props.type]
})

const handleClose = () => {
  show.value = false
  clearTimeout(timeoutId)
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for animation to complete
}

onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
