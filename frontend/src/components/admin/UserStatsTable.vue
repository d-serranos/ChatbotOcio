<template>
  <div class="overflow-x-auto">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- No data state -->
    <div 
      v-else-if="!users || users.length === 0" 
      class="text-center py-12 text-gray-500"
    >
      <p class="text-lg">No data available</p>
    </div>

    <!-- Table -->
    <table v-else class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th 
            scope="col" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            User
          </th>
          <th 
            scope="col" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Messages
          </th>
          <th 
            scope="col" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Total Tokens
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(user, index) in users" 
          :key="user.user_name || user.nombre || index"
          class="hover:bg-gray-50 transition-colors"
        >
          <!-- User name -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium text-sm">
                  {{ getUserInitials(user.user_name || user.nombre) }}
                </span>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.user_name || user.nombre }}
                </div>
              </div>
            </div>
          </td>

          <!-- Messages count -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ formatNumber(user.message_count || user.mensajes || 0) }}
            </div>
          </td>

          <!-- Total tokens -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ formatNumber(user.total_tokens || user.tokens || 0) }}
            </div>
            <div class="text-xs text-gray-500">
              {{ formatAverage(user.total_tokens || user.tokens || 0, user.message_count || user.mensajes || 1) }} avg/msg
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

/**
 * Get user initials from name
 */
const getUserInitials = (name) => {
  if (!name) return '?'
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Format numbers with thousand separators
 */
const formatNumber = (num) => {
  return num.toLocaleString()
}

/**
 * Calculate and format average tokens per message
 */
const formatAverage = (tokens, messages) => {
  if (messages === 0) return '0'
  const avg = tokens / messages
  return avg.toFixed(1)
}
</script>
