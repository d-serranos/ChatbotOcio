/**
 * Chat Service
 * Handles communication with the chat endpoint
 */

import apiClient from './api.js'

const chatService = {
  /**
   * Send a message to the chatbot
   * @param {string} message - The message content to send
   * @returns {Promise<Object>} Chat response with { response, conversation_id, message_id }
   */
  async sendMessage(message) {
    const response = await apiClient.post('/chat', { message })
    return response.data
  }
}

export default chatService
