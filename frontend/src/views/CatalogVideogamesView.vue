<template>
  <div class="min-h-screen bg-gray-50">
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">Videogames Catalog</h1>
        <MediaFilters
          :genres="genres"
          :platforms="platforms"
          :years="years"
          :classifications="classifications"
          @filter="handleFilter"
        />
      </div>

      <SkeletonLoader v-if="loading" type="card-grid" :count="8" />

      <MediaGrid v-else-if="videogames.length > 0">
        <VideogameCard
          v-for="videogame in videogames"
          :key="videogame.id_videojuego"
          :videogame="videogame"
          @click="showDetail(videogame)"
        />
      </MediaGrid>

      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">No videogames found</p>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="handlePageChange"
      />
    </main>

    <MediaDetail
      v-if="selectedVideogame"
      :media="selectedVideogame"
      type="videogame"
      @close="selectedVideogame = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useToast } from '@/composables/useToast'
import {
  VideogameCard,
  MediaGrid,
  MediaFilters,
  MediaDetail,
  Pagination
} from '@/components/catalog'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

/**
 * CatalogVideogamesView
 * 
 * Public-facing view for browsing the videogame catalog.
 * Provides filtering, pagination, and detail viewing capabilities.
 * 
 * Features:
 * - Filter by genre, platform, classification, and year
 * - Paginated results
 * - Videogame detail modal
 * - Skeleton loading states
 * - Error handling with toast notifications
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11
 */

const catalogStore = useCatalogStore()
const { error: showErrorToast } = useToast()

// Local state
const selectedVideogame = ref(null)
const filters = ref({
  genero: null,
  plataforma: null,
  clasificacion: null,
  anio_lanzamiento: null
})

// Computed state from store
const videogames = computed(() => catalogStore.videogames)
const loading = computed(() => catalogStore.loading)
const currentPage = computed(() => catalogStore.videogamesPagination.currentPage)
const totalPages = computed(() => catalogStore.videogamesPagination.totalPages)

// Computed unique values for filters
const genres = computed(() => {
  const allGenres = videogames.value.map(v => v.genero).filter(Boolean)
  return [...new Set(allGenres)].sort()
})

const platforms = computed(() => {
  const allPlatforms = videogames.value.map(v => v.plataforma).filter(Boolean)
  return [...new Set(allPlatforms)].sort()
})

const classifications = computed(() => {
  const allClassifications = videogames.value.map(v => v.clasificacion).filter(Boolean)
  return [...new Set(allClassifications)].sort()
})

const years = computed(() => {
  const allYears = videogames.value.map(v => v.anio_lanzamiento).filter(Boolean)
  return [...new Set(allYears)].sort((a, b) => b - a)
})

/**
 * Fetch videogames from the API with current filters and page
 * Validates: Requirements 5.3, 5.4, 5.5
 */
const fetchVideogames = async () => {
  try {
    await catalogStore.fetchVideogames({
      ...filters.value,
      page: currentPage.value
    })
  } catch (err) {
    showErrorToast('Failed to load videogames. Please try again.')
  }
}

/**
 * Handle filter changes from MediaFilters component
 * Resets to page 1 and fetches with new filters
 * Validates: Requirements 5.8, 5.9
 * @param {object} newFilters - New filter values
 */
const handleFilter = (newFilters) => {
  filters.value = { ...newFilters }
  // Reset to page 1 when filters change
  catalogStore.videogamesPagination.currentPage = 1
  fetchVideogames()
}

/**
 * Handle page changes from Pagination component
 * Validates: Requirement 5.7
 * @param {number} page - New page number
 */
const handlePageChange = (page) => {
  catalogStore.videogamesPagination.currentPage = page
  fetchVideogames()
}

/**
 * Show videogame detail modal
 * Validates: Requirement 5.6
 * @param {object} videogame - Videogame object to display
 */
const showDetail = (videogame) => {
  selectedVideogame.value = videogame
}

// Fetch videogames on component mount
// Validates: Requirement 5.1, 5.2
onMounted(() => {
  fetchVideogames()
})
</script>
