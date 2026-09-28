# Composables Usage Examples

This document provides practical examples of using the composables in real components.

## Example 1: Login Form Component

```vue
<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        :class="{ 'border-red-500': errors.email }"
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
    </div>

    <div>
      <label for="password" class="block text-sm font-medium">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        :class="{ 'border-red-500': errors.password }"
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <button
      type="submit"
      :disabled="submitting"
      class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {{ submitting ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth, useToast, useForm } from '@/composables'

const router = useRouter()
const { login } = useAuth()
const { success, error } = useToast()
const { errors, submitting, validate, clearErrors, handleSubmit } = useForm()

const email = ref('')
const password = ref('')

const handleLogin = handleSubmit(async () => {
  clearErrors()
  
  // Validate form
  const isValid = validate({
    email: () => {
      if (!email.value) return 'Email is required'
      if (!/\S+@\S+\.\S+/.test(email.value)) return 'Invalid email format'
      return null
    },
    password: () => {
      if (!password.value) return 'Password is required'
      if (password.value.length < 6) return 'Password must be at least 6 characters'
      return null
    }
  })
  
  if (!isValid) return
  
  try {
    await login({
      correo: email.value,
      contrasena: password.value
    })
    
    success('Login successful!')
    router.push('/')
  } catch (err) {
    error(err.response?.data?.message || 'Login failed')
  }
})
</script>
```

## Example 2: Admin Movies View with Pagination

```vue
<template>
  <div class="p-8">
    <div class="mb-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Movies</h1>
      <button @click="openModal" class="bg-blue-600 text-white px-4 py-2 rounded-md">
        Add Movie
      </button>
    </div>

    <!-- Search with debounce -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        @input="debouncedSearch"
        type="text"
        placeholder="Search movies..."
        class="w-full px-4 py-2 border rounded-md"
      />
    </div>

    <!-- Movies list -->
    <div v-if="loading" class="text-center py-8">Loading...</div>
    
    <div v-else-if="movies.length === 0" class="text-center py-8 text-gray-500">
      No movies found
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="movie in movies" :key="movie.id_pelicula" class="border p-4 rounded-md">
        <h3 class="font-bold">{{ movie.titulo }}</h3>
        <p class="text-sm text-gray-600">{{ movie.genero }} | {{ movie.anio_lanzamiento }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
      <button
        @click="previousPage"
        :disabled="!hasPreviousPage"
        class="px-4 py-2 border rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      
      <button
        v-for="page in getPageNumbers()"
        :key="page"
        @click="page !== 'ellipsis' && goToPage(page)"
        :class="[
          'px-4 py-2 border rounded-md',
          page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100',
          page === 'ellipsis' && 'cursor-default'
        ]"
        :disabled="page === 'ellipsis'"
      >
        {{ page === 'ellipsis' ? '...' : page }}
      </button>
      
      <button
        @click="nextPage"
        :disabled="!hasNextPage"
        class="px-4 py-2 border rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>

    <!-- Modal for adding movie -->
    <Modal v-if="showModal" @close="closeModal">
      <h2 class="text-xl font-bold mb-4">Add Movie</h2>
      <!-- Movie form here -->
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { useToast, usePagination, useModal, useDebounce } from '@/composables'

const catalogStore = useCatalogStore()
const { success, error } = useToast()
const { showModal, openModal, closeModal } = useModal()
const {
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  goToPage,
  setTotalPages,
  getPageNumbers
} = usePagination()

const movies = ref([])
const loading = ref(false)
const searchQuery = ref('')

const fetchMovies = async () => {
  loading.value = true
  try {
    const response = await catalogStore.fetchMovies({
      page: currentPage.value,
      search: searchQuery.value
    })
    movies.value = response.data
    setTotalPages(response.totalPages)
  } catch (err) {
    error('Failed to load movies')
  } finally {
    loading.value = false
  }
}

// Debounce search input
const debouncedSearch = useDebounce(() => {
  currentPage.value = 1 // Reset to first page on search
  fetchMovies()
}, 500)

onMounted(() => {
  fetchMovies()
})

// Watch for page changes
watch(currentPage, () => {
  fetchMovies()
})
</script>
```

## Example 3: Chat Interface with Auto-scroll

```vue
<template>
  <div class="flex flex-col h-screen">
    <div ref="chatHistory" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex',
          message.rol === 'user' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-[70%] px-4 py-2 rounded-lg',
            message.rol === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-900'
          ]"
        >
          {{ message.contenido }}
        </div>
      </div>
      
      <div v-if="loading" class="flex justify-start">
        <div class="bg-gray-200 px-4 py-2 rounded-lg">
          <span class="animate-pulse">Typing...</span>
        </div>
      </div>
    </div>

    <div class="border-t p-4">
      <form @submit.prevent="handleSend" class="flex gap-2">
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message..."
          :disabled="loading"
          class="flex-1 px-4 py-2 border rounded-md disabled:opacity-50"
        />
        <button
          type="submit"
          :disabled="!messageInput.trim() || loading"
          class="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useToast } from '@/composables'

const chatStore = useChatStore()
const { error } = useToast()

const chatHistory = ref(null)
const messageInput = ref('')
const messages = ref([])
const loading = ref(false)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  })
}

const handleSend = async () => {
  if (!messageInput.value.trim()) return
  
  const message = messageInput.value
  messageInput.value = ''
  loading.value = true
  
  try {
    // Add user message
    messages.value.push({
      rol: 'user',
      contenido: message,
      fecha: new Date().toISOString()
    })
    scrollToBottom()
    
    // Send to API
    await chatStore.sendMessage(message)
    
    // Add assistant response
    messages.value.push({
      rol: 'assistant',
      contenido: chatStore.lastResponse,
      fecha: new Date().toISOString()
    })
    scrollToBottom()
  } catch (err) {
    error('Failed to send message')
  } finally {
    loading.value = false
  }
}

// Auto-scroll on new messages
watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>
```

## Example 4: Form with Complex Validation

```vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium">Movie Title</label>
      <input
        v-model="formData.titulo"
        @blur="() => validateField('titulo', validateTitle)"
        :class="{ 'border-red-500': errors.titulo }"
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      <p v-if="errors.titulo" class="mt-1 text-sm text-red-600">{{ errors.titulo }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium">Release Year</label>
      <input
        v-model.number="formData.anio_lanzamiento"
        @blur="() => validateField('anio_lanzamiento', validateYear)"
        type="number"
        :class="{ 'border-red-500': errors.anio_lanzamiento }"
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      <p v-if="errors.anio_lanzamiento" class="mt-1 text-sm text-red-600">
        {{ errors.anio_lanzamiento }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium">Rating (0-10)</label>
      <input
        v-model.number="formData.calificacion"
        @blur="() => validateField('calificacion', validateRating)"
        type="number"
        step="0.1"
        :class="{ 'border-red-500': errors.calificacion }"
        class="mt-1 block w-full rounded-md border-gray-300"
      />
      <p v-if="errors.calificacion" class="mt-1 text-sm text-red-600">
        {{ errors.calificacion }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="submitting || hasErrors()"
      class="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
    >
      {{ submitting ? 'Saving...' : 'Save Movie' }}
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import { useForm, useToast } from '@/composables'
import { useCatalogStore } from '@/stores/catalog'

const catalogStore = useCatalogStore()
const { success, error } = useToast()
const { errors, submitting, validate, validateField, hasErrors, clearErrors } = useForm()

const formData = reactive({
  titulo: '',
  anio_lanzamiento: new Date().getFullYear(),
  calificacion: 0
})

// Individual field validators
const validateTitle = () => {
  if (!formData.titulo) return 'Title is required'
  if (formData.titulo.length > 200) return 'Title must be less than 200 characters'
  return null
}

const validateYear = () => {
  const currentYear = new Date().getFullYear()
  if (!formData.anio_lanzamiento) return 'Year is required'
  if (formData.anio_lanzamiento < 1888) return 'Year must be 1888 or later'
  if (formData.anio_lanzamiento > currentYear + 5) return `Year cannot be more than ${currentYear + 5}`
  return null
}

const validateRating = () => {
  if (formData.calificacion < 0) return 'Rating must be at least 0'
  if (formData.calificacion > 10) return 'Rating cannot exceed 10'
  return null
}

const handleSubmit = async () => {
  clearErrors()
  
  // Validate all fields
  const isValid = validate({
    titulo: validateTitle,
    anio_lanzamiento: validateYear,
    calificacion: validateRating
  })
  
  if (!isValid) return
  
  submitting.value = true
  try {
    await catalogStore.createMovie(formData)
    success('Movie created successfully!')
    // Reset form
    Object.keys(formData).forEach(key => formData[key] = '')
  } catch (err) {
    error('Failed to create movie')
  } finally {
    submitting.value = false
  }
}
</script>
```

## Example 5: Multi-Modal Management

```vue
<template>
  <div>
    <button @click="openCreateModal" class="bg-blue-600 text-white px-4 py-2 rounded-md">
      Create
    </button>
    
    <button @click="openEditModal" class="bg-green-600 text-white px-4 py-2 rounded-md">
      Edit
    </button>
    
    <button @click="openDeleteModal" class="bg-red-600 text-white px-4 py-2 rounded-md">
      Delete
    </button>

    <!-- Create Modal -->
    <Modal v-if="createModalOpen" @close="closeCreateModal">
      <h2>Create New Item</h2>
      <!-- Create form -->
    </Modal>

    <!-- Edit Modal -->
    <Modal v-if="editModalOpen" @close="closeEditModal">
      <h2>Edit Item</h2>
      <!-- Edit form -->
    </Modal>

    <!-- Delete Confirmation -->
    <Modal v-if="deleteModalOpen" @close="closeDeleteModal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this item?</p>
      <div class="flex gap-2 mt-4">
        <button @click="confirmDelete" class="bg-red-600 text-white px-4 py-2 rounded-md">
          Delete
        </button>
        <button @click="closeDeleteModal" class="bg-gray-300 px-4 py-2 rounded-md">
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { useModal, useToast } from '@/composables'

const { success, error } = useToast()

// Separate modal state for each modal
const {
  showModal: createModalOpen,
  openModal: openCreateModal,
  closeModal: closeCreateModal
} = useModal()

const {
  showModal: editModalOpen,
  openModal: openEditModal,
  closeModal: closeEditModal
} = useModal()

const {
  showModal: deleteModalOpen,
  openModal: openDeleteModal,
  closeModal: closeDeleteModal
} = useModal()

const confirmDelete = async () => {
  try {
    // Perform delete operation
    success('Item deleted successfully')
    closeDeleteModal()
  } catch (err) {
    error('Failed to delete item')
  }
}
</script>
```

## Tips and Best Practices

1. **Combine composables**: Use multiple composables together for powerful functionality
2. **Destructure wisely**: Only extract what you need to keep code clean
3. **Handle errors**: Always wrap async operations in try-catch and show user feedback
4. **Validate early**: Validate on blur for better UX, then on submit for final check
5. **Debounce searches**: Use `useDebounce` for search inputs to reduce API calls
6. **Reset state**: Clear errors and forms after successful operations
7. **Loading states**: Always show loading indicators during async operations
