<template>
  <main id="main-content" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold">
          Create your account
        </h1>
        <p class="mt-2 text-gray-600">
          Already have an account? 
          <router-link
            to="/login"
            class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Sign in
          </router-link>
        </p>
      </div>
      <div class="bg-white p-8 rounded-lg shadow">
        <RegisterForm
          :loading="loading"
          @submit="handleRegister"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const loading = ref(false)

/**
 * Handle registration form submission
 * @param {Object} userData - User registration data { nombre, correo, contrasena }
 */
const handleRegister = async (userData) => {
  loading.value = true
  try {
    // Register the user
    await authStore.register(userData)
    
    // Show success toast
    showToast('Account created successfully! Welcome to ChatbotOcio.', 'success')
    
    // Redirect to home page (user is automatically logged in after registration)
    router.push('/')
  } catch (error) {
    // Display error message from backend or generic error
    let errorMessage = 'Registration failed. Please try again.'
    
    if (error.response?.data?.detail) {
      // Handle backend error messages
      const detail = error.response.data.detail
      
      // Check for specific error types
      if (typeof detail === 'string') {
        errorMessage = detail
      } else if (Array.isArray(detail)) {
        // Handle validation errors array
        errorMessage = detail.map(err => err.msg).join(', ')
      }
      
      // Specific error message for email already registered
      if (detail.includes('correo') || detail.includes('email') || detail.includes('already')) {
        errorMessage = 'Email already registered. Please use a different email or sign in.'
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showToast(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}
</script>
