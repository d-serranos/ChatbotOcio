<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
        />
        
        <!-- Modal panel -->
        <div class="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            ref="modalRef"
            :class="modalClasses"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
            @click.stop
            @keydown="handleKeyDown"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3
                :id="titleId"
                class="text-lg font-semibold text-gray-900"
              >
                {{ title }}
              </h3>
              
              <button
                type="button"
                class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="handleClose"
              >
                <span class="sr-only">Close</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div class="mt-4">
              <slot />
            </div>
            
            <!-- Footer (optional slot) -->
            <div
              v-if="$slots.footer"
              class="mt-6 border-t border-gray-200 pt-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * Modal Component
 * 
 * A fully accessible modal dialog with focus trap, backdrop, and escape key handling.
 * Implements ARIA best practices and prevents body scroll when open.
 * Supports multiple sizes and customizable footer slot.
 * 
 * @component
 * @slot default - Main modal content
 * @slot footer - Optional footer content (usually for action buttons)
 * 
 * @example
 * <Modal 
 *   v-model:show="isOpen" 
 *   title="Confirm Action"
 *   size="md"
 *   :close-on-backdrop="true"
 * >
 *   <p>Are you sure you want to proceed?</p>
 *   
 *   <template #footer>
 *     <Button @click="handleConfirm">Confirm</Button>
 *     <Button variant="secondary" @click="isOpen = false">Cancel</Button>
 *   </template>
 * </Modal>
 */
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * Component props
 */
const props = defineProps({
  /**
   * Controls modal visibility (supports v-model)
   * @type {boolean}
   * @default false
   */
  show: {
    type: Boolean,
    default: false
  },
  /**
   * Modal title displayed in header
   * @type {string}
   * @default ''
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * Modal size variant
   * @type {'sm' | 'md' | 'lg' | 'xl' | 'full'}
   * @default 'md'
   */
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  /**
   * Whether clicking the backdrop closes the modal
   * @type {boolean}
   * @default true
   */
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  /**
   * Whether pressing Escape key closes the modal
   * @type {boolean}
   * @default true
   */
  closeOnEscape: {
    type: Boolean,
    default: true
  }
})

/**
 * Component emits
 */
const emit = defineEmits({
  /**
   * Emitted when modal should close
   */
  close: null,
  /**
   * Emitted to update v-model:show binding
   * @param {boolean} value - New show value
   */
  'update:show': (value) => typeof value === 'boolean'
})

const modalRef = ref(null)
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)

const modalClasses = computed(() => {
  const baseClasses = 'relative bg-white rounded-lg shadow-xl p-6 w-full transition-all'
  
  // On mobile, make the modal full screen or nearly full screen
  const mobileClasses = 'sm:rounded-lg rounded-none max-h-screen overflow-y-auto'
  
  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-full sm:mx-4'
  }
  
  return `${baseClasses} ${mobileClasses} ${sizeClasses[props.size]}`
})

const handleClose = () => {
  emit('close')
  emit('update:show', false)
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscape = (event) => {
  if (props.closeOnEscape && event.key === 'Escape' && props.show) {
    handleClose()
  }
}

// Focus trap implementation
let previousActiveElement = null

/**
 * Handle keyboard navigation within modal
 * @param {KeyboardEvent} event - Keyboard event
 */
const handleKeyDown = (event) => {
  if (event.key !== 'Tab' || !modalRef.value) return
  
  const focusableElements = modalRef.value.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (event.shiftKey) {
    // Shift + Tab - going backwards
    if (document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
  } else {
    // Tab - going forwards
    if (document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

// Watch for show prop changes to manage body scroll and focus
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Store current active element
    previousActiveElement = document.activeElement
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    
    // Focus first focusable element in modal
    setTimeout(() => {
      if (modalRef.value) {
        const firstFocusable = modalRef.value.querySelector(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (firstFocusable) {
          firstFocusable.focus()
        }
      }
    }, 100)
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
    
    // Restore focus to previous element
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus()
      previousActiveElement = null
    }
  }
})

onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
