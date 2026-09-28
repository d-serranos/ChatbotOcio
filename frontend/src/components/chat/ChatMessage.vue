<template>
  <div 
    :class="[
      'flex mb-4 animate-fade-in',
      message.rol === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <div 
      :class="[
        'max-w-[70%] rounded-lg px-4 py-3 shadow-sm',
        message.rol === 'user' 
          ? 'bg-blue-600 text-white rounded-br-none' 
          : 'bg-gray-200 text-gray-900 rounded-bl-none'
      ]"
    >
      <div 
        class="text-sm whitespace-pre-wrap break-words"
        v-html="formattedContent"
      ></div>
      <div 
        :class="[
          'text-xs mt-1',
          message.rol === 'user' ? 'text-blue-100' : 'text-gray-500'
        ]"
      >
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ChatMessage Component
 * 
 * Displays a single chat message with role-based styling, timestamp, and URL linkification.
 * Supports both user and assistant messages with distinct visual treatments.
 * 
 * @component
 * @example
 * <ChatMessage 
 *   :message="{
 *     rol: 'user',
 *     contenido: 'Hello, how are you?',
 *     fecha: '2024-01-15T10:30:00Z'
 *   }"
 * />
 */
import { computed } from 'vue'
import { formatTime, linkifyText } from '@/utils/formatters'

/**
 * Component props
 */
const props = defineProps({
  /**
   * The message object to display
   * @type {{ rol: 'user' | 'assistant', contenido: string, fecha: string }}
   */
  message: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value &&
        typeof value === 'object' &&
        ['user', 'assistant'].includes(value.rol) &&
        typeof value.contenido === 'string'
      )
    }
  }
})

const formattedTime = computed(() => {
  return formatTime(props.message.fecha)
})

const formattedContent = computed(() => {
  return linkifyText(props.message.contenido)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Style for links in messages */
:deep(a) {
  color: inherit;
  text-decoration: underline;
  transition: opacity 0.2s;
}

:deep(a:hover) {
  opacity: 0.8;
}
</style>
