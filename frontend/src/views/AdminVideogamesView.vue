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
            Manage Videogames
          </h1>
          <Button
            variant="primary"
            @click="openCreateModal"
          >
            Add Videogame
          </Button>
        </div>
        
        <!-- Search Input -->
        <div class="mb-6">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search videogames by title..."
            label=""
            @input="handleSearch"
          />
        </div>
        
        <!-- Data Table -->
        <SkeletonLoader v-if="catalogStore.loading" type="table" :columns="6" :rows="10" />
        <DataTable
          v-else
          :columns="columns"
          :data="videogames"
          :loading="false"
          @edit="openEditModal"
          @delete="confirmDelete"
        />
        
        <!-- Pagination -->
        <div v-if="!catalogStore.loading && videogames.length > 0" class="mt-6">
          <Pagination
            :current-page="currentPage"
            :total-pages="pagination.totalPages"
            @change="handlePageChange"
          />
        </div>
        
        <!-- Videogame Form Modal -->
        <Modal
          :show="showModal"
          :title="formMode === 'create' ? 'Add New Videogame' : 'Edit Videogame'"
          size="lg"
          @close="closeModal"
        >
          <VideogameForm
            :videogame="selectedVideogame"
            :mode="formMode"
            @submit="handleSubmit"
            @cancel="closeModal"
          />
        </Modal>
        
        <!-- Confirm Delete Dialog -->
        <ConfirmDialog
          :show="showConfirmDialog"
          title="Delete Videogame"
          :message="`Are you sure you want to delete '${videogameToDelete?.titulo}'? This action cannot be undone.`"
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
import VideogameForm from '@/components/admin/VideogameForm.vue'
import Modal from '@/components/common/Modal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import Pagination from '@/components/catalog/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

/**
 * AdminVideogamesView
 * 
 * Admin interface for managing videogames in the catalog.
 * Provides full CRUD operations (Create, Read, Update, Delete) with
 * search, pagination, and form validation.
 * 
 * Features:
 * - Search videogames by title (debounced)
 * - Create new videogames with form validation
 * - Edit existing videogames
 * - Delete videogames with confirmation dialog
 * - Paginated table display
 * - Responsive design with mobile bottom navigation
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15
 */

// Initialize stores and composables
const router = useRouter()
const catalogStore = useCatalogStore()
const { showModal, openModal, closeModal } = useModal()
const toast = useToast()

// State
const searchQuery = ref('')
const selectedVideogame = ref(null)
const formMode = ref('create') // 'create' or 'edit'
const showConfirmDialog = ref(false)
const videogameToDelete = ref(null)
const currentPage = ref(1)
const deleting = ref(false)

// Computed
const videogames = computed(() => catalogStore.videogames)
const pagination = computed(() => catalogStore.videogamesPagination)

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
  { key: 'clasificacion', label: 'Classification', sortable: false }
]

/**
 * Fetch videogames from the API
 * Sends request with current page and search query
 */
const fetchVideogames = async () => {
  try {
    await catalogStore.fetchVideogamesAdmin({
      page: currentPage.value,
      search: searchQuery.value || undefined
    })
  } catch (error) {
    console.error('Error fetching videogames:', error)
    toast.error('Failed to load videogames. Please try again.')
  }
}

/**
 * Handle search input (debounced)
 * Resets to page 1 and fetches filtered results
 */
const handleSearch = useDebounce(() => {
  currentPage.value = 1
  fetchVideogames()
}, 500)

/**
 * Open modal for creating a new videogame
 */
const openCreateModal = () => {
  selectedVideogame.value = null
  formMode.value = 'create'
  openModal()
}

/**
 * Open modal for editing an existing videogame
 * @param {Object} videogame - Videogame object to edit
 */
const openEditModal = (videogame) => {
  selectedVideogame.value = videogame
  formMode.value = 'edit'
  openModal()
}

/**
 * Handle form submission (create or update)
 * @param {Object} videogameData - Videogame data from form
 */
const handleSubmit = async (videogameData) => {
  try {
    if (formMode.value === 'create') {
      await catalogStore.createVideogame(videogameData)
      toast.success('Videogame created successfully!')
    } else if (formMode.value === 'edit') {
      await catalogStore.updateVideogame(selectedVideogame.value.id_videojuego, videogameData)
      toast.success('Videogame updated successfully!')
    }
    
    closeModal()
    await fetchVideogames() // Refresh the list
  } catch (error) {
    console.error('Error saving videogame:', error)
    
    // Extract error message from API response
    const errorMessage = error.response?.data?.detail || 'Failed to save videogame. Please try again.'
    toast.error(errorMessage)
  }
}

/**
 * Show confirmation dialog before deleting a videogame
 * @param {Object} videogame - Videogame object to delete
 */
const confirmDelete = (videogame) => {
  videogameToDelete.value = videogame
  showConfirmDialog.value = true
}

/**
 * Close confirmation dialog
 */
const closeConfirmDialog = () => {
  showConfirmDialog.value = false
  videogameToDelete.value = null
}

/**
 * Handle videogame deletion after confirmation
 */
const handleDelete = async () => {
  if (!videogameToDelete.value) return
  
  deleting.value = true
  
  try {
    await catalogStore.deleteVideogame(videogameToDelete.value.id_videojuego)
    toast.success('Videogame deleted successfully!')
    closeConfirmDialog()
    
    // If current page becomes empty after deletion, go to previous page
    if (videogames.value.length === 1 && currentPage.value > 1) {
      currentPage.value--
    }
    
    await fetchVideogames() // Refresh the list
  } catch (error) {
    console.error('Error deleting videogame:', error)
    
    // Extract error message from API response
    const errorMessage = error.response?.data?.detail || 'Failed to delete videogame. Please try again.'
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
  fetchVideogames()
}

// Fetch videogames on component mount
onMounted(() => {
  fetchVideogames()
})
</script>
