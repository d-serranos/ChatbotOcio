<template>
  <div class="min-h-screen bg-gray-50">
    <main id="main-content" class="container mx-auto px-4 py-8" aria-label="Movies catalog">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">Movies Catalog</h1>
        <MediaFilters
          :genres="genres"
          :platforms="platforms"
          :years="years"
          @filter="handleFilter"
        />
      </div>

      <div v-if="loading" role="status" aria-live="polite" aria-label="Loading movies">
        <SkeletonLoader type="card-grid" :count="8" />
        <span class="sr-only">Loading movies...</span>
      </div>

      <MediaGrid v-else-if="movies.length > 0" role="list" aria-label="Movie results">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id_pelicula"
          :movie="movie"
          role="listitem"
          @click="showDetail(movie)"
        />
      </MediaGrid>

      <div v-else class="text-center py-12" role="status">
        <p class="text-gray-500 text-lg">No movies found</p>
      </div>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="handlePageChange"
      />
    </main>

    <MediaDetail
      v-if="selectedMovie"
      :media="selectedMovie"
      type="movie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useToast } from '@/composables/useToast'
import {
  MovieCard,
  MediaGrid,
  MediaFilters,
  MediaDetail,
  Pagination
} from '@/components/catalog'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

/**
 * CatalogMoviesView
 * 
 * Public-facing view for browsing the movie catalog.
 * Provides filtering, pagination, and detail viewing capabilities.
 * 
 * Features:
 * - Filter by genre, platform, and year
 * - Paginated results
 * - Movie detail modal
 * - Skeleton loading states
 * - Error handling with toast notifications
 * 
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11
 */

const catalogStore = useCatalogStore()
const { error: showErrorToast } = useToast()

// Local state
const selectedMovie = ref(null)
const filters = ref({
  genero: null,
  plataforma: null,
  anio_lanzamiento: null
})

// Computed state from store
const movies = computed(() => catalogStore.movies)
const loading = computed(() => catalogStore.loading)
const currentPage = computed(() => catalogStore.moviesPagination.currentPage)
const totalPages = computed(() => catalogStore.moviesPagination.totalPages)

// Computed unique values for filters
const genres = computed(() => {
  const allGenres = movies.value.map(m => m.genero).filter(Boolean)
  return [...new Set(allGenres)].sort()
})

const platforms = computed(() => {
  const allPlatforms = movies.value.map(m => m.plataforma).filter(Boolean)
  return [...new Set(allPlatforms)].sort()
})

const years = computed(() => {
  const allYears = movies.value.map(m => m.anio_lanzamiento).filter(Boolean)
  return [...new Set(allYears)].sort((a, b) => b - a)
})

/**
 * Fetch movies from the API with current filters and page
 * Validates: Requirements 5.3, 5.4, 5.5
 */
const fetchMovies = async () => {
  try {
    await catalogStore.fetchMovies({
      ...filters.value,
      page: currentPage.value
    })
  } catch (err) {
    showErrorToast('Failed to load movies. Please try again.')
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
  catalogStore.moviesPagination.currentPage = 1
  fetchMovies()
}

/**
 * Handle page changes from Pagination component
 * Validates: Requirement 5.7
 * @param {number} page - New page number
 */
const handlePageChange = (page) => {
  catalogStore.moviesPagination.currentPage = page
  fetchMovies()
}

/**
 * Show movie detail modal
 * Validates: Requirement 5.6
 * @param {object} movie - Movie object to display
 */
const showDetail = (movie) => {
  selectedMovie.value = movie
}

// Fetch movies on component mount
// Validates: Requirement 5.1, 5.2
onMounted(() => {
  fetchMovies()
})
</script>
