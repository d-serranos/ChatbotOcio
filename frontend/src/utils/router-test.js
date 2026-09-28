/**
 * Router Test Utilities
 * 
 * These functions help test the router configuration without a backend.
 * They can be used in the browser console for manual testing.
 */

/**
 * Simulate login as a regular user
 */
export function simulateUserLogin() {
  localStorage.setItem('auth_token', 'test-user-token')
  localStorage.setItem('auth_user', JSON.stringify({
    id_usuario: 1,
    nombre: 'Test User',
    correo: 'user@test.com',
    role: 'user'
  }))
  console.log('✅ Simulated user login. Please refresh the page.')
}

/**
 * Simulate login as an admin user
 */
export function simulateAdminLogin() {
  localStorage.setItem('auth_token', 'test-admin-token')
  localStorage.setItem('auth_user', JSON.stringify({
    id_usuario: 2,
    nombre: 'Test Admin',
    correo: 'admin@test.com',
    role: 'admin'
  }))
  console.log('✅ Simulated admin login. Please refresh the page.')
}

/**
 * Simulate logout
 */
export function simulateLogout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
  console.log('✅ Simulated logout. Please refresh the page.')
}

/**
 * Test all public routes
 */
export function testPublicRoutes() {
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/catalog/movies',
    '/catalog/videogames'
  ]
  
  console.log('🧪 Testing public routes:')
  publicRoutes.forEach(route => {
    console.log(`  - ${route} (should be accessible)`)
  })
}

/**
 * Test all admin routes
 */
export function testAdminRoutes() {
  const adminRoutes = [
    '/admin',
    '/admin/movies',
    '/admin/videogames',
    '/admin/statistics'
  ]
  
  console.log('🧪 Testing admin routes:')
  adminRoutes.forEach(route => {
    console.log(`  - ${route} (requires auth + admin role)`)
  })
}

// Make functions available in window for console testing
if (typeof window !== 'undefined') {
  window.routerTest = {
    simulateUserLogin,
    simulateAdminLogin,
    simulateLogout,
    testPublicRoutes,
    testAdminRoutes
  }
  
  console.log('🧪 Router test utilities loaded! Use:')
  console.log('  - window.routerTest.simulateUserLogin()')
  console.log('  - window.routerTest.simulateAdminLogin()')
  console.log('  - window.routerTest.simulateLogout()')
  console.log('  - window.routerTest.testPublicRoutes()')
  console.log('  - window.routerTest.testAdminRoutes()')
}
