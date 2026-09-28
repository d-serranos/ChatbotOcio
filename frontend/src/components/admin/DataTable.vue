<template>
  <div class="w-full">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="lg" aria-hidden="true" />
      <span class="sr-only">Loading table data...</span>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!data || data.length === 0"
      class="text-center py-12"
      role="status"
    >
      <p class="text-gray-500 text-lg">No data available</p>
    </div>

    <!-- Table -->
    <div
      v-else
      class="overflow-x-auto"
      role="region"
      aria-label="Data table"
      tabindex="0"
    >
      <table class="min-w-full divide-y divide-gray-200" role="table">
        <thead class="bg-gray-50">
          <tr role="row">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              role="columnheader"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div class="flex items-center space-x-2">
                <span>{{ column.label }}</span>
                <button
                  v-if="column.sortable"
                  type="button"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  @click="handleSort(column.key)"
                  :aria-label="`Sort by ${column.label}`"
                >
                  <svg
                    class="w-4 h-4"
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
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </button>
              </div>
            </th>
            <th
              scope="col"
              role="columnheader"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(item, index) in data"
            :key="item.id || index"
            role="row"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              role="cell"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ item[column.key] }}
            </td>
            <td role="cell" class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  type="button"
                  class="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  @click="handleEdit(item)"
                  :aria-label="`Edit ${getItemDescription(item)}`"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                  @click="handleDelete(item)"
                  :aria-label="`Delete ${getItemDescription(item)}`"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '../common/LoadingSpinner.vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    // Expected format: [{ key: 'field', label: 'Label', sortable: true/false }]
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'sort'])

/**
 * Get a descriptive label for an item (for screen readers)
 * @param {object} item - The data item
 * @returns {string} Description of the item
 */
const getItemDescription = (item) => {
  // Try to find a descriptive field (titulo, name, etc.)
  return item.titulo || item.name || item.title || 'item'
}

const handleEdit = (item) => {
  emit('edit', item)
}

const handleDelete = (item) => {
  emit('delete', item)
}

const handleSort = (column) => {
  emit('sort', column)
}
</script>

<style scoped>
/* Make table horizontally scrollable on mobile */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
