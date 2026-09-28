<template>
  <div 
    ref="scrollContainer"
    class="flex-1 overflow-y-auto px-4 py-6 bg-gray-50"
  >
    <div class="container mx-auto max-w-4xl">
      <ChatMessage 
        v-for="(message, index) in messages" 
        :key="message.id || index"
        :message="message"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

const scrollContainer = ref(null)

/**
 * Scroll to the bottom of the chat container
 */
const scrollToBottom = () => {
  if (!scrollContainer.value) return
  
  nextTick(() => {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

/**
 * Watch for changes in messages array and auto-scroll
 */
watch(
  () => props.messages,
  (newMessages, oldMessages) => {
    // Only scroll if a new message was added
    if (newMessages.length > (oldMessages?.length || 0)) {
      scrollToBottom()
    }
  },
  { deep: true }
)

/**
 * Check if user is at the bottom of the scroll container
 */
const isAtBottom = () => {
  if (!scrollContainer.value) return true
  
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
  // Consider "at bottom" if within 100px of the bottom
  return scrollHeight - scrollTop - clientHeight < 100
}

// Expose scrollToBottom for parent components if needed
defineExpose({
  scrollToBottom,
  isAtBottom
})
</script>

<style scoped>
/* Custom scrollbar styling */
div::-webkit-scrollbar {
  width: 8px;
}

div::-webkit-scrollbar-track {
  background: #f1f1f1;
}

div::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

div::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Smooth scrolling */
div {
  scroll-behavior: smooth;
}
</style>
