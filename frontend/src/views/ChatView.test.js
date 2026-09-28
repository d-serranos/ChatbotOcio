import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChatView from './ChatView.vue'
import { useChatStore } from '@/stores/chat'
import { useToast } from '@/composables/useToast'

// Mock the useToast composable
vi.mock('@/composables/useToast', () => ({
  useToast: vi.fn(() => ({
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }))
}))

// Mock child components
vi.mock('@/components/chat/WelcomeMessage.vue', () => ({
  default: {
    name: 'WelcomeMessage',
    template: '<div>Welcome Message</div>'
  }
}))

vi.mock('@/components/chat/ChatHistory.vue', () => ({
  default: {
    name: 'ChatHistory',
    props: ['messages'],
    template: '<div>Chat History</div>'
  }
}))

vi.mock('@/components/chat/ChatInput.vue', () => ({
  default: {
    name: 'ChatInput',
    props: ['disabled'],
    emits: ['send'],
    template: '<div @click="$emit(\'send\', \'test message\')">Chat Input</div>'
  }
}))

describe('ChatView', () => {
  let wrapper
  let chatStore
  let toast

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia())
    
    // Get the chat store
    chatStore = useChatStore()
    
    // Get the toast mock
    toast = useToast()
    
    // Mount the component
    wrapper = mount(ChatView, {
      global: {
        stubs: {
          WelcomeMessage: true,
          ChatHistory: true,
          ChatInput: true
        }
      }
    })
  })

  describe('Component Rendering', () => {
    it('should render the chat view container', () => {
      expect(wrapper.find('.flex.flex-col.h-screen').exists()).toBe(true)
    })

    it('should render WelcomeMessage when there are no messages', () => {
      chatStore.messages = []
      wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'WelcomeMessage' }).exists()).toBe(true)
    })

    it('should render ChatHistory when there are messages', async () => {
      chatStore.messages = [
        { rol: 'user', contenido: 'Hello', fecha: new Date().toISOString() }
      ]
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent({ name: 'ChatHistory' }).exists()).toBe(true)
    })

    it('should always render ChatInput', () => {
      expect(wrapper.findComponent({ name: 'ChatInput' }).exists()).toBe(true)
    })
  })

  describe('Message Validation', () => {
    it('should show validation error for empty message', async () => {
      const vm = wrapper.vm
      
      // Call validateMessage directly
      const result = vm.validateMessage('')
      
      expect(result).toBe(false)
      expect(vm.validationError).toBe('Message cannot be empty')
    })

    it('should show validation error for message exceeding max length', async () => {
      const vm = wrapper.vm
      const longMessage = 'a'.repeat(10001) // 10001 characters
      
      const result = vm.validateMessage(longMessage)
      
      expect(result).toBe(false)
      expect(vm.validationError).toContain('too long')
      expect(vm.validationError).toContain('10000')
    })

    it('should pass validation for valid message', async () => {
      const vm = wrapper.vm
      const validMessage = 'This is a valid message'
      
      const result = vm.validateMessage(validMessage)
      
      expect(result).toBe(true)
      expect(vm.validationError).toBe('')
    })

    it('should display inline error when validation fails', async () => {
      const vm = wrapper.vm
      vm.validationError = 'Test error message'
      await wrapper.vm.$nextTick()
      
      const errorDiv = wrapper.find('.bg-red-50')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toContain('Test error message')
    })
  })

  describe('Message Sending', () => {
    it('should call chatStore.sendMessage with valid message', async () => {
      const sendMessageSpy = vi.spyOn(chatStore, 'sendMessage').mockResolvedValue()
      const vm = wrapper.vm
      
      await vm.handleSendMessage('Hello, world!')
      
      expect(sendMessageSpy).toHaveBeenCalledWith('Hello, world!')
      expect(vm.validationError).toBe('')
    })

    it('should not call chatStore.sendMessage with invalid message', async () => {
      const sendMessageSpy = vi.spyOn(chatStore, 'sendMessage')
      const vm = wrapper.vm
      
      await vm.handleSendMessage('')
      
      expect(sendMessageSpy).not.toHaveBeenCalled()
      expect(vm.validationError).toBe('Message cannot be empty')
    })

    it('should show error toast when sendMessage fails', async () => {
      const error = new Error('Network error')
      vi.spyOn(chatStore, 'sendMessage').mockRejectedValue(error)
      
      const vm = wrapper.vm
      await vm.handleSendMessage('Test message')
      
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })

    it('should show generic error toast when error has no message', async () => {
      const error = {}
      vi.spyOn(chatStore, 'sendMessage').mockRejectedValue(error)
      
      const vm = wrapper.vm
      await vm.handleSendMessage('Test message')
      
      expect(toast.error).toHaveBeenCalledWith('Failed to send message. Please try again.')
    })

    it('should handle API error response', async () => {
      const error = {
        response: {
          data: {
            detail: 'Service unavailable'
          }
        }
      }
      vi.spyOn(chatStore, 'sendMessage').mockRejectedValue(error)
      
      const vm = wrapper.vm
      await vm.handleSendMessage('Test message')
      
      expect(toast.error).toHaveBeenCalledWith('Service unavailable')
    })
  })

  describe('Loading State', () => {
    it('should pass loading state to ChatInput', async () => {
      chatStore.loading = true
      await wrapper.vm.$nextTick()
      
      const chatInput = wrapper.findComponent({ name: 'ChatInput' })
      expect(chatInput.props('disabled')).toBe(true)
    })

    it('should not disable ChatInput when not loading', async () => {
      chatStore.loading = false
      await wrapper.vm.$nextTick()
      
      const chatInput = wrapper.findComponent({ name: 'ChatInput' })
      expect(chatInput.props('disabled')).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should reactively update messages from store', async () => {
      chatStore.messages = []
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.messages).toEqual([])
      
      chatStore.messages = [
        { rol: 'user', contenido: 'Hello', fecha: new Date().toISOString() }
      ]
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.messages).toHaveLength(1)
    })

    it('should reactively update loading from store', async () => {
      chatStore.loading = false
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.loading).toBe(false)
      
      chatStore.loading = true
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.loading).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle message with only whitespace', async () => {
      const vm = wrapper.vm
      const result = vm.validateMessage('   ')
      
      expect(result).toBe(false)
      expect(vm.validationError).toBe('Message cannot be empty')
    })

    it('should accept message at exactly max length', async () => {
      const vm = wrapper.vm
      const maxLengthMessage = 'a'.repeat(10000)
      
      const result = vm.validateMessage(maxLengthMessage)
      
      expect(result).toBe(true)
      expect(vm.validationError).toBe('')
    })

    it('should clear validation error on successful send', async () => {
      vi.spyOn(chatStore, 'sendMessage').mockResolvedValue()
      const vm = wrapper.vm
      
      // First, set a validation error
      vm.validationError = 'Previous error'
      
      // Then send a valid message
      await vm.handleSendMessage('Valid message')
      
      expect(vm.validationError).toBe('')
    })
  })
})
