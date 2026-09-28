<template>
  <nav class="bg-white shadow-md sticky top-0 z-50" aria-label="Main navigation">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="ChatbotOcio Home"
          >
            <svg
              class="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span>ChatbotOcio</span>
          </router-link>
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-8" role="menubar">
          <router-link
            to="/"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            :class="{ 'text-blue-600': isActiveRoute('/') }"
            role="menuitem"
            :aria-current="isActiveRoute('/') ? 'page' : undefined"
          >
            Home
            <span
              v-if="isActiveRoute('/')"
              class="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-blue-600 rounded-t-md"
              aria-hidden="true"
            />
          </router-link>

          <router-link
            to="/catalog/movies"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            :class="{ 'text-blue-600': isActiveRoute('/catalog/movies') }"
            role="menuitem"
            :aria-current="isActiveRoute('/catalog/movies') ? 'page' : undefined"
          >
            Movies
            <span
              v-if="isActiveRoute('/catalog/movies')"
              class="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-blue-600 rounded-t-md"
              aria-hidden="true"
            />
          </router-link>

          <router-link
            to="/catalog/videogames"
            class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            :class="{ 'text-blue-600': isActiveRoute('/catalog/videogames') }"
            role="menuitem"
            :aria-current="isActiveRoute('/catalog/videogames') ? 'page' : undefined"
          >
            Videogames
            <span
              v-if="isActiveRoute('/catalog/videogames')"
              class="absolute bottom-[-1.5rem] left-0 w-full h-1 bg-blue-600 rounded-t-md"
              aria-hidden="true"
            />
          </router-link>
        </div>

        <!-- Desktop User Menu / Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <UserMenu v-if="isAuthenticated" />
          <div
            v-else
            class="flex items-center space-x-3"
          >
            <router-link
              to="/login"
              class="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </router-link>
          </div>
        </div>

        <!-- Mobile Hamburger Menu Button -->
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle mobile menu"
          @click="toggleMobileMenu"
        >
          <!-- Hamburger Icon -->
          <svg
            v-if="!isMobileMenuOpen"
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <!-- Close Icon -->
          <svg
            v-else
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div
          v-if="isMobileMenuOpen"
          id="mobile-menu"
          class="md:hidden pb-4 border-t border-gray-200 mt-2"
        >
          <!-- Mobile Navigation Links -->
          <nav class="space-y-2 pt-4" aria-label="Mobile navigation">
            <router-link
              to="/"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-50 text-blue-600': isActiveRoute('/') }"
              :aria-current="isActiveRoute('/') ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              Home
            </router-link>

            <router-link
              to="/catalog/movies"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-50 text-blue-600': isActiveRoute('/catalog/movies') }"
              :aria-current="isActiveRoute('/catalog/movies') ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              Movies
            </router-link>

            <router-link
              to="/catalog/videogames"
              class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'bg-blue-50 text-blue-600': isActiveRoute('/catalog/videogames') }"
              :aria-current="isActiveRoute('/catalog/videogames') ? 'page' : undefined"
              @click="closeMobileMenu"
            >
              Videogames
            </router-link>
          </nav>

          <!-- Mobile User Menu / Auth Buttons -->
          <div class="mt-4 pt-4 border-t border-gray-200">
            <!-- Authenticated User Menu -->
            <div
              v-if="isAuthenticated"
              class="space-y-2"
            >
              <!-- User Info -->
              <div class="px-4 py-2 bg-gray-50 rounded-lg" role="status" aria-label="Current user">
                <p class="text-sm font-medium text-gray-900">
                  {{ userName }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ userRole }}
                </p>
              </div>

              <!-- Admin Dashboard Link (only for admins) -->
              <router-link
                v-if="isAdmin"
                to="/admin"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="closeMobileMenu"
              >
                Admin Dashboard
              </router-link>

              <!-- Logout Button -->
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                @click="handleLogout"
              >
                Sign out
              </button>
            </div>

            <!-- Unauthenticated Auth Buttons -->
            <div
              v-else
              class="space-y-2"
            >
              <router-link
                to="/login"
                class="block w-full px-4 py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                @click="closeMobileMenu"
              >
                Login
              </router-link>
              <router-link
                to="/register"
                class="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="closeMobileMenu"
              >
                Register
              </router-link>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Mobile Menu Backdrop -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
      aria-hidden="true"
      @click="closeMobileMenu"
    />
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserMenu from '@/components/auth/UserMenu.vue'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName || 'User')
const userRole = computed(() => authStore.isAdmin ? 'Admin' : 'User')

/**
 * Check if a route is currently active
 * @param {string} path - The path to check
 * @returns {boolean} True if the route is active
 */
const isActiveRoute = (path) => {
  const currentPath = router.currentRoute.value.path
  
  // Exact match for home
  if (path === '/' || path === '/chat') {
    return currentPath === '/' || currentPath === '/chat'
  }
  
  // Starts with match for other routes
  return currentPath.startsWith(path)
}

/**
 * Toggle mobile menu open/close
 */
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * Close mobile menu
 */
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

/**
 * Handle user logout
 */
const handleLogout = async () => {
  closeMobileMenu()
  await authStore.logout()
  router.push('/login')
}
</script>
