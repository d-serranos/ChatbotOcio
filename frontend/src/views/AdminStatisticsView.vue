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
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">
            Usage Statistics
          </h1>
          <p class="text-gray-600 mt-2">
            Monitor token consumption and system usage
          </p>
        </div>
        
        <!-- Date Range Picker -->
        <div class="mb-6">
          <DateRangePicker
            v-model="dateRange"
            @change="handleDateChange"
          />
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
        
        <!-- No Data State -->
        <div 
          v-else-if="!stats || (!stats.daily_stats || stats.daily_stats.length === 0) && (!stats.user_stats || stats.user_stats.length === 0)"
          class="bg-white rounded-lg shadow-md p-12 text-center"
        >
          <p class="text-lg text-gray-600">No data available for the selected period</p>
          <p class="text-sm text-gray-500 mt-2">Try selecting a different date range</p>
        </div>
        
        <!-- Statistics Content -->
        <div v-else class="space-y-6">
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsSummary
              title="Total Tokens"
              :value="totalTokens"
              icon="cpu"
            />
            <StatsSummary
              title="Total Messages"
              :value="totalMessages"
              icon="chat"
            />
            <StatsSummary
              title="Active Users"
              :value="activeUsers"
              icon="users"
            />
          </div>
          
          <!-- Chart Section -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Daily Token Consumption
            </h2>
            <StatsChart
              :data="stats.daily_stats || []"
              :loading="loading"
            />
          </div>
          
          <!-- User Statistics Table -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Top Users by Token Consumption
            </h2>
            <UserStatsTable
              :users="stats.user_stats || []"
              :loading="loading"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import DateRangePicker from '@/components/admin/DateRangePicker.vue'
import StatsSummary from '@/components/admin/StatsSummary.vue'
import StatsChart from '@/components/admin/StatsChart.vue'
import UserStatsTable from '@/components/admin/UserStatsTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import statisticsService from '@/services/statistics.service.js'

/**
 * AdminStatisticsView
 * 
 * Admin interface for viewing usage statistics and token consumption.
 * Displays daily token consumption charts, summary metrics, and user statistics.
 * 
 * Features:
 * - Date range filtering with quick presets (last 7/30/90 days)
 * - Summary cards showing total tokens, messages, and active users
 * - Line chart showing daily token consumption over time
 * - User statistics table with token usage per user
 * - Error handling with toast notifications
 * - Responsive design with mobile bottom navigation
 * 
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10
 */

const router = useRouter()
const toast = useToast()

// State
const loading = ref(false)
const stats = ref(null)

// Initialize dateRange with last 30 days
const dateRange = ref({
  start: getDateDaysAgo(30),
  end: new Date()
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
 * Helper function to get date N days ago
 * @param {number} days - Number of days to subtract from today
 * @returns {Date} Date object
 */
function getDateDaysAgo(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

/**
 * Format date to YYYY-MM-DD for API
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
function formatDateForAPI(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Computed: Total tokens from daily stats
 */
const totalTokens = computed(() => {
  if (!stats.value || !stats.value.daily_stats) return 0
  
  return stats.value.daily_stats.reduce((sum, day) => {
    return sum + (day.total_tokens || day.tokens || 0)
  }, 0)
})

/**
 * Computed: Total messages from daily stats
 */
const totalMessages = computed(() => {
  if (!stats.value || !stats.value.daily_stats) return 0
  
  return stats.value.daily_stats.reduce((sum, day) => {
    return sum + (day.message_count || day.messages || 0)
  }, 0)
})

/**
 * Computed: Number of unique active users
 */
const activeUsers = computed(() => {
  if (!stats.value || !stats.value.user_stats) return 0
  
  return stats.value.user_stats.length
})

/**
 * Fetch statistics data from the API
 * 
 * Sends GET request to /statistics with start_date and end_date parameters.
 * Updates stats ref with response data and handles errors with toast notifications.
 */
const fetchStatistics = async () => {
  loading.value = true
  
  try {
    const params = {
      start_date: formatDateForAPI(dateRange.value.start),
      end_date: formatDateForAPI(dateRange.value.end)
    }
    
    const response = await statisticsService.getStatistics(params)
    stats.value = response
  } catch (error) {
    console.error('Error fetching statistics:', error)
    
    // Extract error message from API response
    const errorMessage = error.response?.data?.detail || 'Failed to load statistics. Please try again.'
    toast.error(errorMessage)
    
    // Set stats to empty state
    stats.value = {
      daily_stats: [],
      user_stats: []
    }
  } finally {
    loading.value = false
  }
}

/**
 * Handle date range change from DateRangePicker
 * 
 * Called when user selects new date range or applies quick preset.
 * Fetches fresh statistics data for the new date range.
 * 
 * @param {Object} newRange - New date range { start: Date, end: Date }
 */
const handleDateChange = (newRange) => {
  dateRange.value = newRange
  fetchStatistics()
}

// Fetch statistics on component mount
onMounted(() => {
  fetchStatistics()
})
</script>
