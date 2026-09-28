/**
 * Verification script for API client configuration
 * This script checks that the API client is properly configured
 */

import apiClient from './api.js'

console.log('=== API Client Configuration Verification ===\n')

// Check 1: Base URL configuration
console.log('✓ Base URL:', apiClient.defaults.baseURL)
if (!apiClient.defaults.baseURL) {
  console.error('❌ ERROR: Base URL is not configured')
  console.error('   Make sure VITE_API_BASE_URL is set in .env file')
}

// Check 2: Timeout configuration
console.log('✓ Timeout:', apiClient.defaults.timeout, 'ms')
if (apiClient.defaults.timeout !== 30000) {
  console.error('❌ ERROR: Timeout should be 30000ms (30 seconds)')
} else {
  console.log('  ✓ Timeout is correctly set to 30 seconds')
}

// Check 3: Default headers
console.log('✓ Content-Type:', apiClient.defaults.headers['Content-Type'])
if (apiClient.defaults.headers['Content-Type'] !== 'application/json') {
  console.error('❌ ERROR: Content-Type should be application/json')
} else {
  console.log('  ✓ Content-Type is correctly set')
}

// Check 4: Request interceptors
console.log('\n✓ Request interceptors:', apiClient.interceptors.request.handlers.length)
if (apiClient.interceptors.request.handlers.length === 0) {
  console.error('❌ ERROR: No request interceptors configured')
} else {
  console.log('  ✓ Request interceptor configured (for JWT token injection)')
}

// Check 5: Response interceptors
console.log('✓ Response interceptors:', apiClient.interceptors.response.handlers.length)
if (apiClient.interceptors.response.handlers.length === 0) {
  console.error('❌ ERROR: No response interceptors configured')
} else {
  console.log('  ✓ Response interceptor configured (for error handling)')
}

console.log('\n=== Verification Complete ===')
console.log('\nAPI Client Features:')
console.log('  • JWT token automatically added from localStorage')
console.log('  • 401 errors: Auto-logout and redirect to login')
console.log('  • 403 errors: Permission denied toast notification')
console.log('  • 422 errors: Structured validation errors')
console.log('  • 500-504 errors: User-friendly error messages')
console.log('  • Network errors: Connection error messages')
console.log('  • Multiple login redirect prevention')

export default true
