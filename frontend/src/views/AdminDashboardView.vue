<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <NavigationBar />
    
    <div class="flex">
      <!-- Sidebar - Desktop only -->
      <Sidebar />
      
      <!-- Mobile Navigation Tabs -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div class="flex justify-around items-center h-16">
          <router-link
            to="/admin"
            class="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium"
            :class="isActiveRoute('/admin', true) ? 'text-blue-600' : 'text-gray-500'"
          >
            <svg class="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Dashboard
          </router-link>
          
          <router-link
            to="/admin/movies"
            class="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium"
            :class="isActiveRoute('/admin/movies') ? 'text-blue-600' : 'text-gray-500'"
          >
            <svg class="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            Movies
          </router-link>
          
          <router-link
            to="/admin/videogames"
            class="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium"
            :class="isActiveRoute('/admin/videogames') ? 'text-blue-600' : 'text-gray-500'"
          >
            <svg class="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            Games
          </router-link>
          
          <router-link
            to="/admin/statistics"
            class="flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium"
            :class="isActiveRoute('/admin/statistics') ? 'text-blue-600' : 'text-gray-500'"
          >
            <svg class="h-6 w-6 mb-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Stats
          </router-link>
        </div>
      </div>
      
      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p class="mt-2 text-gray-600">
            Welcome to your admin dashboard. Manage your content and view statistics.
          </p>
        </div>
        
        <!-- Stats Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Total Movies Card -->
          <StatsSummary
            title="Total Movies"
            :value="totalMovies"
            icon="film"
          />
          
          <!-- Total Videogames Card -->
          <StatsSummary
            title="Total Videogames"
            :value="totalVideogames"
            icon="puzzle"
          />
          
          <!-- Total Users Card -->
          <StatsSummary
            title="Total Users"
            :value="totalUsers"
            icon="users"
          />
        </div>
        
        <!-- Quick Actions Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Manage Movies -->
            <router-link
              to="/admin/movies"
              class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div class="flex-shrink-0 p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors duration-200">
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  Manage Movies
                </h3>
                <p class="text-sm text-gray-600">
                  Add, edit, or delete movies
                </p>
              </div>
            </router-link>
            
            <!-- Manage Videogames -->
            <router-link
              to="/admin/videogames"
              class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div class="flex-shrink-0 p-3 bg-yellow-100 rounded-full group-hover:bg-yellow-200 transition-colors duration-200">
                <svg
                  class="h-6 w-6 text-yellow-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  Manage Videogames
                </h3>
                <p class="text-sm text-gray-600">
                  Add, edit, or delete videogames
                </p>
              </div>
            </router-link>
            
            <!-- View Statistics -->
            <router-link
              to="/admin/statistics"
              class="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div class="flex-shrink-0 p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-200">
                <svg
                  class="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  View Statistics
                </h3>
                <p class="text-sm text-gray-600">
                  Monitor usage and analytics
                </p>
              </div>
            </router-link>
          </div>
        </div>
        
        <!-- Recent Activity Section (Optional) -->
        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div class="text-center py-8">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="mt-2 text-gray-500">
              Activity tracking will be available soon
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import StatsSummary from '@/components/admin/StatsSummary.vue'

const router = useRouter()
const catalogStore = useCatalogStore()

// Stats refs
const totalUsers = ref(0)

// Computed properties for catalog stats
const totalMovies = computed(() => {
  return catalogStore.movies.length || 0
})

const totalVideogames = computed(() => {
  return catalogStore.videogames.length || 0
})

/**
 * Check if a route is currently active
 * @param {string} path - The path to check
 * @param {boolean} exact - Whether to match exactly
 * @returns {boolean} True if the route is active
 */
const isActiveRoute = (path, exact = false) => {
  const currentPath = router.currentRoute.value.path
  
  if (exact) {
    return currentPath === path
  }
  
  return currentPath.startsWith(path)
}

/**
 * Fetch summary data on component mount
 * Loads movies and videogames to calculate totals
 */
const fetchSummary = async () => {
  try {
    // Fetch movies and videogames from catalog store
    await Promise.all([
      catalogStore.fetchMoviesAdmin(),
      catalogStore.fetchVideogamesAdmin()
    ])
    
    // TODO: Fetch total users from statistics endpoint when available
    // For now, set a placeholder value
    totalUsers.value = 0
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
  }
}

// Fetch summary data on mount
onMounted(() => {
  fetchSummary()
})
</script>
