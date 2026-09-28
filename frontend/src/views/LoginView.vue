<template>
  <main id="main-content" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold">
          Sign in to ChatbotOcio
        </h1>
        <p class="mt-2 text-gray-600">
          Or 
          <router-link
            to="/register"
            class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            create a new account
          </router-link>
        </p>
      </div>
      <div class="bg-white p-8 rounded-lg shadow">
        <LoginForm
          :loading="loading"
          @submit="handleLogin"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

const loading = ref(false)

/**
 * Handle login form submission
 * @param {Object} credentials - User credentials { correo, contrasena }
 */
const handleLogin = async (credentials) => {
  loading.value = true
  try {
    await authStore.login(credentials)
    
    // Show success toast
    showToast('Login successful! Welcome back.', 'success')
    
    // Redirect to previous page or home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    // Display error message from backend or generic error
    const errorMessage = error.response?.data?.detail || error.message || 'Login failed. Please check your credentials.'
    showToast(errorMessage, 'error')
  } finally {
    loading.value = false
  }
}
</script>
