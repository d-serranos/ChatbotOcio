/**
 * Vitest setup file
 * This file runs before all tests
 */

import { config } from '@vue/test-utils'

// Configure Vue Test Utils globally
config.global.stubs = {
  // Add global component stubs here if needed
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
})
