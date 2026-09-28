import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatHistory from './ChatHistory.vue'

describe('ChatHistory', () => {
  it('renders all messages', () => {
    const messages = [
      { rol: 'user', contenido: 'Hello', fecha: new Date().toISOString() },
      { rol: 'assistant', contenido: 'Hi there', fecha: new Date().toISOString() },
      { rol: 'user', contenido: 'How are you?', fecha: new Date().toISOString() }
    ]
    
    const wrapper = mount(ChatHistory, {
      props: { messages }
    })
    
    expect(wrapper.findAllComponents({ name: 'ChatMessage' })).toHaveLength(3)
  })
  
  it('renders empty when no messages', () => {
    const wrapper = mount(ChatHistory, {
      props: { messages: [] }
    })
    
    expect(wrapper.findAllComponents({ name: 'ChatMessage' })).toHaveLength(0)
  })
})
