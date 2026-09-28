<template>
  <!-- Mobile: Hidden by default, can be toggled -->
  <!-- Desktop: Always visible as sidebar -->
  <aside class="hidden lg:block lg:w-64 bg-white border-r border-gray-200 min-h-screen">
    <div class="p-6">
      <!-- Sidebar Header -->
      <div class="mb-8">
        <h2 class="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your content</p>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-2">
        <!-- Dashboard -->
        <router-link
          to="/admin"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          :class="{ 'bg-blue-50 text-blue-600 hover:bg-blue-50': isActiveRoute('/admin', true) }"
        >
          <svg
            class="h-5 w-5 mr-3"
            :class="isActiveRoute('/admin', true) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span class="font-medium">Dashboard</span>
        </router-link>

        <!-- Movies -->
        <router-link
          to="/admin/movies"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          :class="{ 'bg-blue-50 text-blue-600 hover:bg-blue-50': isActiveRoute('/admin/movies') }"
        >
          <svg
            class="h-5 w-5 mr-3"
            :class="isActiveRoute('/admin/movies') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          <span class="font-medium">Movies</span>
        </router-link>

        <!-- Videogames -->
        <router-link
          to="/admin/videogames"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          :class="{ 'bg-blue-50 text-blue-600 hover:bg-blue-50': isActiveRoute('/admin/videogames') }"
        >
          <svg
            class="h-5 w-5 mr-3"
            :class="isActiveRoute('/admin/videogames') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
          <span class="font-medium">Videogames</span>
        </router-link>

        <!-- Statistics -->
        <router-link
          to="/admin/statistics"
          class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          :class="{ 'bg-blue-50 text-blue-600 hover:bg-blue-50': isActiveRoute('/admin/statistics') }"
        >
          <svg
            class="h-5 w-5 mr-3"
            :class="isActiveRoute('/admin/statistics') ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          <span class="font-medium">Statistics</span>
        </router-link>
      </nav>

      <!-- Divider -->
      <div class="my-6 border-t border-gray-200"></div>

      <!-- Additional Links -->
      <div class="space-y-2">
        <!-- Back to Main Site -->
        <router-link
          to="/"
          class="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
        >
          <svg
            class="h-5 w-5 mr-3 text-gray-400 group-hover:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm">Back to Main Site</span>
        </router-link>
      </div>

      <!-- Admin Info Footer -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex items-center space-x-3 px-4">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Logged in as</p>
            <p class="text-sm font-medium text-gray-900">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Check if a route is currently active
 * @param {string} path - The path to check
 * @param {boolean} exact - Whether to match exactly (for dashboard)
 * @returns {boolean} True if the route is active
 */
const isActiveRoute = (path, exact = false) => {
  const currentPath = router.currentRoute.value.path
  
  if (exact) {
    return currentPath === path
  }
  
  return currentPath.startsWith(path)
}
</script>
