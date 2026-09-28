<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Main chat container -->
    <main id="main-content" class="flex-1 flex flex-col overflow-hidden" aria-label="Chat interface">
      <!-- Welcome message when no messages -->
      <WelcomeMessage v-if="messages.length === 0" />
      
      <!-- Chat history with messages -->
      <ChatHistory 
        v-else
        :messages="messages" 
        class="flex-1"
      />
      
      <!-- Inline error message for validation failures -->
      <div 
        v-if="validationError" 
        class="px-4 py-2 bg-red-50 border-t border-red-200"
        role="alert"
        aria-live="assertive"
      >
        <div class="container mx-auto max-w-4xl">
          <div class="flex items-center gap-2 text-red-700 text-sm">
            <svg 
              class="w-4 h-4 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fill-rule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clip-rule="evenodd" 
              />
            </svg>
            <span>{{ validationError }}</span>
          </div>
        </div>
      </div>
      
      <!-- Chat input at bottom -->
      <ChatInput 
        :disabled="loading"
        @send="handleSendMessage"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useToast } from '@/composables/useToast'
import WelcomeMessage from '@/components/chat/WelcomeMessage.vue'
import ChatHistory from '@/components/chat/ChatHistory.vue'
import ChatInput from '@/components/chat/ChatInput.vue'

// Constants
const MAX_MESSAGE_LENGTH = 10000

// Store and composables
const chatStore = useChatStore()
const { error: showErrorToast } = useToast()

// Computed properties from store
const messages = computed(() => chatStore.messages)
const loading = computed(() => chatStore.loading)

// Local state
const validationError = ref('')

/**
 * Validate message before sending
 * @param {string} message - Message to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateMessage = (message) => {
  // Clear previous validation error
  validationError.value = ''
  
  // Check if message is empty
  if (!message || message.trim().length === 0) {
    validationError.value = 'Message cannot be empty'
    return false
  }
  
  // Check message length
  if (message.length > MAX_MESSAGE_LENGTH) {
    validationError.value = `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
    return false
  }
  
  return true
}

/**
 * Handle sending a message
 * @param {string} message - Message content to send
 */
const handleSendMessage = async (message) => {
  // Validate message
  if (!validateMessage(message)) {
    return
  }
  
  // Clear validation error
  validationError.value = ''
  
  try {
    // Send message through store
    await chatStore.sendMessage(message)
  } catch (error) {
    // Show error toast with appropriate message
    const errorMessage = error?.response?.data?.detail 
      || error?.message 
      || 'Failed to send message. Please try again.'
    
    showErrorToast(errorMessage)
  }
}

/**
 * Clear chat history when component unmounts (optional behavior)
 * This ensures fresh conversations on each visit
 */
onUnmounted(() => {
  // Optional: Clear messages on unmount
  // Uncomment the line below if you want to clear history on page leave
  // chatStore.clearMessages()
})
</script>

<style scoped>
/* Ensure the view takes full viewport height */
div.flex.flex-col.h-screen {
  height: 100vh;
  max-height: 100vh;
}
</style>
