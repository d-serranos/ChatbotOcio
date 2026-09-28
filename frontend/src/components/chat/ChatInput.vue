<template>
  <div class="border-t bg-white p-4">
    <div class="container mx-auto max-w-4xl">
      <form @submit.prevent="handleSend">
        <div class="relative">
          <label for="chat-input" class="sr-only">Type your message</label>
          <textarea
            id="chat-input"
            ref="textareaRef"
            v-model="message"
            :disabled="disabled"
            :maxlength="10000"
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            rows="1"
            class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-24 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            :aria-label="ariaLabel"
            aria-describedby="character-count"
            @keydown="handleKeydown"
            @input="adjustHeight"
          ></textarea>
          
          <div class="absolute right-2 bottom-2 flex items-center gap-2">
            <span 
              id="character-count"
              :class="[
                'text-xs',
                characterCount > 9500 ? 'text-red-500 font-semibold' : 'text-gray-500'
              ]"
              aria-live="polite"
              :aria-label="`${characterCount} of 10000 characters used`"
            >
              {{ characterCount }}/10000
            </span>
            
            <button
              type="submit"
              :disabled="!canSend"
              :aria-label="disabled ? 'Sending message' : 'Send message'"
              class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <LoadingSpinner v-if="disabled" class="w-4 h-4" aria-hidden="true" />
              <span v-else>Send</span>
            </button>
          </div>
        </div>
      </form>
      
      <div class="mt-2 text-xs text-gray-500" aria-hidden="true">
        {{ characterCount }}/10000 characters
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ChatInput Component
 * 
 * Multi-line text input for chat messages with auto-resizing textarea,
 * character counter, and keyboard shortcuts.
 * Supports Enter to send and Shift+Enter for new lines.
 * 
 * @component
 * @example
 * <ChatInput 
 *   :disabled="isSending"
 *   @send="handleSendMessage"
 * />
 */
import { ref, computed, nextTick, onMounted } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

/**
 * Component props
 */
const props = defineProps({
  /**
   * Whether the input is disabled (e.g., while sending a message)
   * @type {boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false
  }
})

/**
 * Component emits
 */
const emit = defineEmits({
  /**
   * Emitted when user sends a message
   * @param {string} message - The trimmed message text
   */
  send: (message) => typeof message === 'string' && message.length > 0
})

const message = ref('')
const textareaRef = ref(null)

const characterCount = computed(() => message.value.length)

const ariaLabel = computed(() => {
  return `Type your message. ${characterCount.value} of 10000 characters used.`
})

const canSend = computed(() => {
  return message.value.trim().length > 0 && !props.disabled
})

const handleKeydown = (event) => {
  // Send message on Enter (without Shift)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (canSend.value) {
      handleSend()
    }
  }
  // Allow Shift+Enter for new line (default behavior)
}

const handleSend = () => {
  if (!canSend.value) return
  
  const trimmedMessage = message.value.trim()
  if (trimmedMessage) {
    emit('send', trimmedMessage)
    message.value = ''
    
    // Reset textarea height
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.style.height = 'auto'
      }
    })
  }
}

const adjustHeight = () => {
  if (!textareaRef.value) return
  
  // Reset height to auto to get the correct scrollHeight
  textareaRef.value.style.height = 'auto'
  
  // Set height based on content, with a maximum of 200px
  const scrollHeight = textareaRef.value.scrollHeight
  const maxHeight = 200
  textareaRef.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`
}

onMounted(() => {
  // Focus the textarea when component mounts
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
})
</script>

<style scoped>
textarea {
  min-height: 44px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.5;
}

textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
