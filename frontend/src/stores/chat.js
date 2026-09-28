import { defineStore } from 'pinia'
import chatService from '@/services/chat.service.js'

/**
 * Chat Store
 * 
 * Manages chat messages and conversation state.
 * Provides methods for sending messages and managing chat history.
 * 
 * State:
 * - messages: Array of message objects { rol: 'user'|'assistant', contenido: string, fecha: string }
 * - conversationId: Current conversation ID from backend
 * - loading: Loading state for async operations (message sending)
 * 
 * Actions:
 * - sendMessage: Send a message to the chatbot
 * - clearMessages: Clear all messages and reset conversation
 */
export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    conversationId: null,
    loading: false
  }),

  actions: {
    /**
     * Send a message to the chatbot
     * @param {string} content - Message content to send
     * @throws {Error} When message sending fails
     */
    async sendMessage(content) {
      // Create user message object
      const userMessage = {
        rol: 'user',
        contenido: content,
        fecha: new Date().toISOString()
      }

      // Add user message immediately (optimistic update)
      this.messages.push(userMessage)
      this.loading = true

      try {
        // Call chatService to send message
        const response = await chatService.sendMessage(content)
        
        // Create assistant message object from response
        const assistantMessage = {
          rol: 'assistant',
          contenido: response.response,
          fecha: new Date().toISOString()
        }
        
        // Push assistant message to messages array
        this.messages.push(assistantMessage)
        
        // Store conversationId from response
        this.conversationId = response.conversation_id
      } catch (error) {
        // Remove user message on error (rollback optimistic update)
        this.messages.pop()
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear all messages and reset conversation state
     */
    clearMessages() {
      this.messages = []
      this.conversationId = null
    }
  }
})
