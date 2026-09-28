<template>
  <nav class="bg-white shadow-sm border-b mb-4">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex space-x-4">
          <router-link
            to="/"
            class="text-blue-600 hover:text-blue-800"
          >
            Home
          </router-link>
          <router-link
            to="/catalog/movies"
            class="text-blue-600 hover:text-blue-800"
          >
            Movies
          </router-link>
          <router-link
            to="/catalog/videogames"
            class="text-blue-600 hover:text-blue-800"
          >
            Videogames
          </router-link>
          <router-link
            to="/admin"
            class="text-blue-600 hover:text-blue-800"
          >
            Admin
          </router-link>
        </div>
        <div class="flex space-x-4">
          <router-link 
            v-if="!isAuthenticated" 
            to="/login" 
            class="text-blue-600 hover:text-blue-800"
          >
            Login
          </router-link>
          <router-link 
            v-if="!isAuthenticated" 
            to="/register" 
            class="text-blue-600 hover:text-blue-800"
          >
            Register
          </router-link>
          <button 
            v-if="isAuthenticated" 
            class="text-red-600 hover:text-red-800" 
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
      <div class="mt-2 text-sm text-gray-600">
        <span v-if="isAuthenticated">
          Logged in as: {{ userName }} ({{ isAdmin ? 'Admin' : 'User' }})
        </span>
        <span v-else>Not authenticated</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
