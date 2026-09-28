/**
 * Unit tests for chatStore
 * Tests the chat store actions and state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from './chat.js'
import chatService from '@/services/chat.service.js'

// Mock the chatService
vi.mock('@/services/chat.service.js', () => ({
  default: {
    sendMessage: vi.fn()
  }
}))

describe('chatStore', () => {
  let store

  beforeEach(() => {
    // Create a new pinia instance for each test
    setActivePinia(createPinia())
    store = useChatStore()
    
    // Reset mocks
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have empty messages array', () => {
      expect(store.messages).toEqual([])
    })

    it('should have null conversationId', () => {
      expect(store.conversationId).toBeNull()
    })

    it('should not be loading initially', () => {
      expect(store.loading).toBe(false)
    })
  })

  describe('sendMessage', () => {
    it('should add user message and assistant response on success', async () => {
      const mockResponse = {
        response: 'This is the assistant response',
        conversation_id: 'conv-123',
        message_id: 'msg-456',
        tokens_used: 50
      }
      
      chatService.sendMessage.mockResolvedValue(mockResponse)

      await store.sendMessage('Hello, chatbot!')

      // Should have 2 messages: user and assistant
      expect(store.messages).toHaveLength(2)
      
      // Check user message
      expect(store.messages[0]).toMatchObject({
        rol: 'user',
        contenido: 'Hello, chatbot!'
      })
      expect(store.messages[0].fecha).toBeDefined()
      
      // Check assistant message
      expect(store.messages[1]).toMatchObject({
        rol: 'assistant',
        contenido: 'This is the assistant response'
      })
      expect(store.messages[1].fecha).toBeDefined()
      
      // Check conversationId was stored
      expect(store.conversationId).toBe('conv-123')
      
      // Check loading is false
      expect(store.loading).toBe(false)
      
      // Check service was called correctly
      expect(chatService.sendMessage).toHaveBeenCalledWith('Hello, chatbot!')
    })

    it('should set loading to true during request', async () => {
      let loadingDuringRequest = false
      
      chatService.sendMessage.mockImplementation(async () => {
        loadingDuringRequest = store.loading
        return {
          response: 'Response',
          conversation_id: 'conv-123'
        }
      })

      await store.sendMessage('Test message')

      expect(loadingDuringRequest).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('should remove user message and rethrow error on failure', async () => {
      const mockError = new Error('API request failed')
      chatService.sendMessage.mockRejectedValue(mockError)

      await expect(
        store.sendMessage('This will fail')
      ).rejects.toThrow('API request failed')
      
      // User message should be removed (rollback optimistic update)
      expect(store.messages).toHaveLength(0)
      
      // Loading should be false
      expect(store.loading).toBe(false)
    })

    it('should handle multiple messages in sequence', async () => {
      chatService.sendMessage
        .mockResolvedValueOnce({
          response: 'First response',
          conversation_id: 'conv-123'
        })
        .mockResolvedValueOnce({
          response: 'Second response',
          conversation_id: 'conv-123'
        })

      await store.sendMessage('First message')
      await store.sendMessage('Second message')

      expect(store.messages).toHaveLength(4) // 2 user + 2 assistant
      expect(store.messages[0].contenido).toBe('First message')
      expect(store.messages[1].contenido).toBe('First response')
      expect(store.messages[2].contenido).toBe('Second message')
      expect(store.messages[3].contenido).toBe('Second response')
    })

    it('should update conversationId from response', async () => {
      chatService.sendMessage.mockResolvedValue({
        response: 'Response',
        conversation_id: 'new-conv-id'
      })

      expect(store.conversationId).toBeNull()

      await store.sendMessage('Message')

      expect(store.conversationId).toBe('new-conv-id')
    })
  })

  describe('clearMessages', () => {
    it('should clear all messages', () => {
      store.messages = [
        { rol: 'user', contenido: 'Test 1', fecha: new Date().toISOString() },
        { rol: 'assistant', contenido: 'Test 2', fecha: new Date().toISOString() }
      ]

      store.clearMessages()

      expect(store.messages).toEqual([])
    })

    it('should reset conversationId', () => {
      store.conversationId = 'conv-123'

      store.clearMessages()

      expect(store.conversationId).toBeNull()
    })

    it('should reset both messages and conversationId', () => {
      store.messages = [
        { rol: 'user', contenido: 'Test', fecha: new Date().toISOString() }
      ]
      store.conversationId = 'conv-123'

      store.clearMessages()

      expect(store.messages).toEqual([])
      expect(store.conversationId).toBeNull()
    })
  })

  describe('message format', () => {
    it('should create messages with correct structure', async () => {
      chatService.sendMessage.mockResolvedValue({
        response: 'Assistant response',
        conversation_id: 'conv-123'
      })

      await store.sendMessage('User message')

      const userMessage = store.messages[0]
      const assistantMessage = store.messages[1]

      // Verify user message structure
      expect(userMessage).toHaveProperty('rol', 'user')
      expect(userMessage).toHaveProperty('contenido', 'User message')
      expect(userMessage).toHaveProperty('fecha')
      expect(new Date(userMessage.fecha)).toBeInstanceOf(Date)

      // Verify assistant message structure
      expect(assistantMessage).toHaveProperty('rol', 'assistant')
      expect(assistantMessage).toHaveProperty('contenido', 'Assistant response')
      expect(assistantMessage).toHaveProperty('fecha')
      expect(new Date(assistantMessage.fecha)).toBeInstanceOf(Date)
    })

    it('should use ISO string format for dates', async () => {
      chatService.sendMessage.mockResolvedValue({
        response: 'Response',
        conversation_id: 'conv-123'
      })

      await store.sendMessage('Test')

      const userMessage = store.messages[0]
      // ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
      expect(userMessage.fecha).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
  })
})
