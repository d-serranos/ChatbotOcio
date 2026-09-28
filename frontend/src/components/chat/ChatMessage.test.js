import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatMessage from './ChatMessage.vue'

describe('ChatMessage', () => {
  it('renders user message with correct styling', () => {
    const message = {
      rol: 'user',
      contenido: 'Hello, this is a test message',
      fecha: new Date().toISOString()
    }
    
    const wrapper = mount(ChatMessage, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain('Hello, this is a test message')
    expect(wrapper.find('.bg-blue-600').exists()).toBe(true)
  })
  
  it('renders assistant message with correct styling', () => {
    const message = {
      rol: 'assistant',
      contenido: 'I am the assistant',
      fecha: new Date().toISOString()
    }
    
    const wrapper = mount(ChatMessage, {
      props: { message }
    })
    
    expect(wrapper.text()).toContain('I am the assistant')
    expect(wrapper.find('.bg-gray-200').exists()).toBe(true)
  })
  
  it('converts URLs to links', async () => {
    const message = {
      rol: 'assistant',
      contenido: 'Check out https://example.com for more info',
      fecha: new Date().toISOString()
    }
    
    const wrapper = mount(ChatMessage, {
      props: { message }
    })
    
    // Check if link is rendered
    expect(wrapper.html()).toContain('<a href="https://example.com"')
  })
})
