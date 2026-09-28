<template>
  <nav class="flex items-center justify-between px-4 py-3 sm:px-0" aria-label="Pagination">
    <!-- Mobile: Simple Previous/Next -->
    <div class="flex flex-1 justify-between sm:hidden">
      <Button
        variant="secondary"
        size="sm"
        :disabled="isPreviousDisabled"
        @click="goToPrevious"
      >
        Previous
      </Button>
      
      <span class="text-sm text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      
      <Button
        variant="secondary"
        size="sm"
        :disabled="isNextDisabled"
        @click="goToNext"
      >
        Next
      </Button>
    </div>
    
    <!-- Desktop: Full pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Page <span class="font-medium">{{ currentPage }}</span> of
          <span class="font-medium">{{ totalPages }}</span>
        </p>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Previous Button -->
        <Button
          variant="secondary"
          size="sm"
          :disabled="isPreviousDisabled"
          @click="goToPrevious"
          aria-label="Previous page"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
        
        <!-- Page Numbers -->
        <div class="flex items-center space-x-1" role="group" aria-label="Pagination pages">
          <button
            v-for="page in pageNumbers"
            :key="page"
            type="button"
            :class="pageButtonClasses(page)"
            :aria-current="page === currentPage ? 'page' : undefined"
            :aria-label="page !== '...' ? `Go to page ${page}` : 'More pages'"
            :disabled="page === '...'"
            @click="page !== '...' && goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
        
        <!-- Next Button -->
        <Button
          variant="secondary"
          size="sm"
          :disabled="isNextDisabled"
          @click="goToNext"
          aria-label="Next page"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import Button from '@/components/common/Button.vue'

/**
 * Pagination Component
 * 
 * Provides pagination controls with Previous/Next buttons and page numbers.
 * Shows ellipsis for many pages to keep UI compact.
 * Disables Previous on first page and Next on last page.
 * 
 * Props:
 * - currentPage: Current page number (1-based)
 * - totalPages: Total number of pages
 * 
 * Emits:
 * - change(page): When page is changed
 * 
 * Validates: Requirements 5.7
 */

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  },
  totalPages: {
    type: Number,
    required: true,
    validator: (value) => value > 0
  }
})

const emit = defineEmits(['change'])

const isPreviousDisabled = computed(() => {
  return props.currentPage <= 1
})

const isNextDisabled = computed(() => {
  return props.currentPage >= props.totalPages
})

/**
 * Generate array of page numbers with ellipsis for large ranges
 * Example: [1, 2, 3, '...', 10] or [1, '...', 5, 6, 7, '...', 20]
 */
const pageNumbers = computed(() => {
  const pages = []
  const current = props.currentPage
  const total = props.totalPages
  
  // Always show first page
  pages.push(1)
  
  if (total <= 7) {
    // If 7 or fewer pages, show all
    for (let i = 2; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current with ellipsis
    if (current <= 3) {
      // Near start: 1, 2, 3, 4, '...', last
      for (let i = 2; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // Near end: 1, '...', last-3, last-2, last-1, last
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // Middle: 1, '...', current-1, current, current+1, '...', last
      pages.push('...')
      pages.push(current - 1)
      pages.push(current)
      pages.push(current + 1)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const pageButtonClasses = (page) => {
  const baseClasses = 'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  
  if (page === '...') {
    return `${baseClasses} text-gray-700 cursor-default`
  }
  
  if (page === props.currentPage) {
    return `${baseClasses} bg-blue-600 text-white`
  }
  
  return `${baseClasses} text-gray-700 bg-white border border-gray-300 hover:bg-gray-50`
}

const goToPrevious = () => {
  if (!isPreviousDisabled.value) {
    emit('change', props.currentPage - 1)
  }
}

const goToNext = () => {
  if (!isNextDisabled.value) {
    emit('change', props.currentPage + 1)
  }
}

const goToPage = (page) => {
  if (page !== props.currentPage && page !== '...') {
    emit('change', page)
  }
}
</script>
