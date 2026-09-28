import { ref, computed } from 'vue'

/**
 * Composable for pagination state and logic
 * Provides pagination controls and computed properties
 * 
 * @param {number} initialPage - Initial page number (default: 1)
 * @param {number} initialTotalPages - Initial total pages (default: 1)
 * @returns {Object} Pagination utilities
 */
export function usePagination(initialPage = 1, initialTotalPages = 1) {
  const currentPage = ref(initialPage)
  const totalPages = ref(initialTotalPages)

  /**
   * Check if there is a next page
   */
  const hasNextPage = computed(() => {
    return currentPage.value < totalPages.value
  })

  /**
   * Check if there is a previous page
   */
  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  /**
   * Check if on first page
   */
  const isFirstPage = computed(() => {
    return currentPage.value === 1
  })

  /**
   * Check if on last page
   */
  const isLastPage = computed(() => {
    return currentPage.value === totalPages.value
  })

  /**
   * Go to a specific page
   * @param {number} page - Page number to go to
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Go to next page
   */
  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  /**
   * Go to previous page
   */
  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  /**
   * Go to first page
   */
  const firstPage = () => {
    currentPage.value = 1
  }

  /**
   * Go to last page
   */
  const lastPage = () => {
    currentPage.value = totalPages.value
  }

  /**
   * Handle page change event
   * @param {number} page - New page number
   */
  const handlePageChange = (page) => {
    goToPage(page)
  }

  /**
   * Set total pages
   * @param {number} total - Total number of pages
   */
  const setTotalPages = (total) => {
    totalPages.value = total
  }

  /**
   * Reset pagination to initial state
   */
  const reset = () => {
    currentPage.value = initialPage
    totalPages.value = initialTotalPages
  }

  /**
   * Generate array of page numbers to display
   * Includes ellipsis for large page counts
   * @param {number} maxVisible - Maximum number of page buttons to show
   * @returns {Array} Array of page numbers or 'ellipsis'
   */
  const getPageNumbers = (maxVisible = 7) => {
    const pages = []
    
    if (totalPages.value <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // Show subset with ellipsis
      const sidePages = Math.floor((maxVisible - 3) / 2)
      
      if (currentPage.value <= sidePages + 2) {
        // Near start
        for (let i = 1; i <= maxVisible - 2; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages.value)
      } else if (currentPage.value >= totalPages.value - sidePages - 1) {
        // Near end
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages.value - (maxVisible - 3); i <= totalPages.value; i++) {
          pages.push(i)
        }
      } else {
        // Middle
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage.value - sidePages; i <= currentPage.value + sidePages; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages.value)
      }
    }
    
    return pages
  }

  return {
    // State
    currentPage,
    totalPages,
    // Computed
    hasNextPage,
    hasPreviousPage,
    isFirstPage,
    isLastPage,
    // Methods
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    handlePageChange,
    setTotalPages,
    reset,
    getPageNumbers
  }
}
