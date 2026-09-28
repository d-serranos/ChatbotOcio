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
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">
            Manage Movies
          </h1>
          <Button
            variant="primary"
            @click="openCreateModal"
          >
            Add Movie
          </Button>
        </div>
        
        <!-- Search Input -->
        <div class="mb-6">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies by title..."
            label=""
            @input="handleSearch"
          />
        </div>
        
        <!-- Data Table -->
        <SkeletonLoader v-if="catalogStore.loading" type="table" :columns="5" :rows="10" />
        <DataTable
          v-else
          :columns="columns"
          :data="movies"
          :loading="false"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
        
        <!-- Pagination -->
        <div v-if="!catalogStore.loading && movies.length > 0" class="mt-6">
          <Pagination
            :current-page="currentPage"
            :total-pages="pagination.totalPages"
            @change="handlePageChange"
          />
        </div>
        
        <!-- Movie Form Modal -->
        <Modal
          :show="showModal"
          :title="formMode === 'create' ? 'Add New Movie' : 'Edit Movie'"
          size="lg"
          @close="closeModal"
        >
          <MovieForm
            :movie="selectedMovie"
            :mode="formMode"
            @submit="handleSubmit"
            @cancel="closeModal"
          />
        </Modal>
        
        <!-- Confirm Delete Dialog -->
        <ConfirmDialog
          :show="showConfirmDialog"
          title="Delete Movie"
          :message="`Are you sure you want to delete '${movieToDelete?.titulo}'? This action cannot be undone.`"
          confirm-text="Delete"
          cancel-text="Cancel"
          confirm-variant="danger"
          :loading="deleting"
          @confirm="handleDelete"
          @cancel="closeConfirmDialog"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { useModal } from '@/composables/useModal'
import { useDebounce } from '@/composables/useDebounce'
import { useToast } from '@/composables/useToast'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import DataTable from '@/components/admin/DataTable.vue'
import MovieForm from '@/components/admin/MovieForm.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Pagination from '@/components/catalog/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

/**
 * AdminMoviesView
 * 
 * Admin interface for managing movies in the catalog.
 * Provides full CRUD operations (Create, Read, Update, Delete) with
 * search, pagination, and form validation.
 * 
 * Features:
 * - Search movies by title (debounced)
 * - Create new movies with form validation
 * - Edit existing movies
 * - Delete movies with confirmation dialog
 * - Paginated table display
 * - Responsive design with mobile bottom navigation
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 7.13, 7.14, 7.15
 */

// Initialize stores and composables
const router = useRouter()
const catalogStore = useCatalogStore()
const { showModal, openModal, closeModal } = useModal()
const toast = useToast()

// State
const searchQuery = ref('')
const selectedMovie = ref(null)
const formMode = ref('create') // 'create' or 'edit'
const showConfirmDialog = ref(false)
const movieToDelete = ref(null)
const currentPage = ref(1)
const deleting = ref(false)

// Computed
const movies = computed(() => catalogStore.movies)
const pagination = computed(() => catalogStore.moviesPagination)

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

// Define columns for DataTable
const columns = [
  { key: 'titulo', label: 'Title', sortable: true },
  { key: 'genero', label: 'Genre', sortable: true },
  { key: 'plataforma', label: 'Platform', sortable: false },
  { key: 'anio_lanzamiento', label: 'Year', sortable: true },
  { key: 'director', label: 'Director', sortable: false }
]

/**
 * Fetch movies from the API
 * Sends request with current page and search query
 */
const fetchMovies = async () => {
  try {
    await catalogStore.fetchMoviesAdmin({
      page: currentPage.value,
      search: searchQuery.value || undefined
    })
  } catch (error) {
    console.error('Error fetching movies:', error)
    toast.error('Failed to load movies. Please try again.')
  }
}

/**
 * Handle search input (debounced)
 * Resets to page 1 and fetches filtered results
 */
const handleSearch = useDebounce(() => {
  currentPage.value = 1
  fetchMovies()
}, 500)

/**
 * Open modal for creating a new movie
 */
const openCreateModal = () => {
  selectedMovie.value = null
  formMode.value = 'create'
  openModal()
}

/**
 * Open modal for editing an existing movie
 * @param {Object} movie - Movie object to edit
 */
const openEditModal = (movie) => {
  selectedMovie.value = movie
  formMode.value = 'edit'
  openModal()
}

/**
 * Handle form submission (create or update)
 * @param {Object} movieData - Movie data from form
 */
const handleSubmit = async (movieData) => {
  try {
    if (formMode.value === 'create') {
      await catalogStore.createMovie(movieData)
      toast.success('Movie created successfully!')
    } else if (formMode.value === 'edit') {
      await catalogStore.updateMovie(selectedMovie.value.id_pelicula, movieData)
      toast.success('Movie updated successfully!')
    }
    
    closeModal()
    await fetchMovies() // Refresh the list
  } catch (error) {
    console.error('Error saving movie:', error)
    
    // Extract error message from API response
    const errorMessage = error.response?.data?.detail || 'Failed to save movie. Please try again.'
    toast.error(errorMessage)
  }
}

/**
 * Show confirmation dialog before deleting a movie
 * @param {Object} movie - Movie object to delete
 */
const confirmDelete = (movie) => {
  movieToDelete.value = movie
  showConfirmDialog.value = true
}

/**
 * Close confirmation dialog
 */
const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  movieToDelete.value = null
}

/**
 * Handle movie deletion after confirmation
 */
const handleDelete = async () => {
  if (!movieToDelete.value) return
  
  deleting.value = true
  
  try {
    await catalogStore.deleteMovie(movieToDelete.value.id_pelicula)
    toast.success('Movie deleted successfully!')
    closeConfirmDialog()
    
    // If current page becomes empty after deletion, go to previous page
    if (movies.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    
    await fetchMovies() // Refresh the list
  } catch (error) {
    console.error('Error deleting movie:', error)
    
    // Extract error message from API response
    const errorMessage = error.response?.data?.detail || 'Failed to delete movie. Please try again.'
    toast.error(errorMessage)
  } finally {
    deleting.value = false
  }
}

/**
 * Handle page change from pagination
 * @param {number} page - New page number
 */
const handlePageChange = (page) => {
  currentPage.value = page
  fetchMovies()
}

// Fetch movies on component mount
onMounted(() => {
  fetchMovies()
})
</script>
