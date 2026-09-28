<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Toast from '@/components/common/Toast.vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()

// Initialize authentication state
onMounted(async () => {
  await authStore.checkAuth()
})

// Show loading spinner while initializing auth state
const isInitialized = computed(() => authStore.initialized)
const toasts = computed(() => toastStore.toasts)

// Handle toast removal
const handleToastClose = (id) => {
  toastStore.remove(id)
}
</script>

<style scoped>
/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>

<template>
  <div id="app">
    <!-- Skip to content link for keyboard users -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>

    <!-- Show loading spinner while checking authentication -->
    <div
      v-if="!isInitialized"
      class="min-h-screen flex items-center justify-center bg-gray-50"
      role="status"
      aria-live="polite"
    >
      <div class="text-center">
        <LoadingSpinner size="xl" color="blue" aria-hidden="true" />
        <p class="mt-4 text-gray-600">
          Loading application...
        </p>
      </div>
    </div>

    <!-- App content (once initialized) -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Navigation Bar -->
      <NavigationBar />

      <!-- Render router views with transition -->
      <router-view v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
    </div>

    <!-- Toast notifications container (fixed top-right) -->
    <div
      aria-live="assertive"
      aria-atomic="true"
      class="fixed top-0 right-0 z-50 flex flex-col items-end space-y-4 p-4 pointer-events-none"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <Toast
          :message="toast.message"
          :type="toast.type"
          :duration="toast.duration"
          @close="handleToastClose(toast.id)"
        />
      </div>
    </div>
  </div>
</template>
