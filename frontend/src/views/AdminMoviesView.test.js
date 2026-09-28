import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AdminMoviesView from './AdminMoviesView.vue'

/**
 * Unit tests for AdminMoviesView component
 * 
 * Tests:
 * - Component renders correctly
 * - Imports are valid
 * - Basic structure is present
 */

describe('AdminMoviesView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the component without errors', () => {
    const wrapper = mount(AdminMoviesView, {
      global: {
        stubs: {
          NavigationBar: true,
          Sidebar: true,
          DataTable: true,
          Modal: true,
          ConfirmDialog: true,
          Button: true,
          Input: true,
          Pagination: true,
          MovieForm: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render the page title', () => {
    const wrapper = mount(AdminMoviesView, {
      global: {
        stubs: {
          NavigationBar: true,
          Sidebar: true,
          DataTable: true,
          Modal: true,
          ConfirmDialog: true,
          Button: true,
          Input: true,
          Pagination: true,
          MovieForm: true
        }
      }
    })

    expect(wrapper.text()).toContain('Manage Movies')
  })

  it('should render Add Movie button', () => {
    const wrapper = mount(AdminMoviesView, {
      global: {
        stubs: {
          NavigationBar: true,
          Sidebar: true,
          DataTable: true,
          Modal: true,
          ConfirmDialog: true,
          Button: true,
          Input: true,
          Pagination: true,
          MovieForm: true
        }
      }
    })

    expect(wrapper.text()).toContain('Add Movie')
  })
})
