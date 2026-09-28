import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatInput from './ChatInput.vue'

describe('ChatInput', () => {
  it('renders textarea and send button', () => {
    const wrapper = mount(ChatInput)
    
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })
  
  it('disables send button when message is empty', async () => {
    const wrapper = mount(ChatInput)
    
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(true)
  })
  
  it('enables send button when message is entered', async () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test message')
    
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(false)
  })
  
  it('emits send event when Enter is pressed', async () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test message')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: false })
    
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')[0]).toEqual(['Test message'])
  })
  
  it('does not emit send event when Shift+Enter is pressed', async () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test message')
    await textarea.trigger('keydown', { key: 'Enter', shiftKey: true })
    
    expect(wrapper.emitted('send')).toBeFalsy()
  })
  
  it('clears input after sending', async () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test message')
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(textarea.element.value).toBe('')
  })
  
  it('shows character count', async () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Hello')
    
    expect(wrapper.text()).toContain('5/10000')
  })
  
  it('respects maxlength of 10000 characters', () => {
    const wrapper = mount(ChatInput)
    
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('maxlength')).toBe('10000')
  })
  
  it('shows loading spinner when disabled', () => {
    const wrapper = mount(ChatInput, {
      props: { disabled: true }
    })
    
    expect(wrapper.findComponent({ name: 'LoadingSpinner' }).exists()).toBe(true)
  })
})
