<script setup>
import { ref } from 'vue'

const message = ref('Vue 3 + Vite + Tailwind CSS is working!')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="card max-w-2xl mx-4">
      <div class="card-body text-center">
        <h1 class="text-4xl font-bold text-primary-600 mb-4">
          ✅ Project Setup Verified
        </h1>
        <p class="text-lg text-gray-700 mb-6">
          {{ message }}
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div class="text-2xl mb-2">
              ⚡
            </div>
            <div class="font-semibold text-green-800">
              Vite
            </div>
            <div class="text-sm text-green-600">
              Fast dev server
            </div>
          </div>
          
          <div class="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div class="text-2xl mb-2">
              🎨
            </div>
            <div class="font-semibold text-blue-800">
              Tailwind CSS
            </div>
            <div class="text-sm text-blue-600">
              Utility classes
            </div>
          </div>
          
          <div class="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div class="text-2xl mb-2">
              📁
            </div>
            <div class="font-semibold text-purple-800">
              Path Aliases
            </div>
            <div class="text-sm text-purple-600">
              @/ imports work
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <button class="btn btn-primary">
            Primary Button
          </button>
          <button class="btn btn-secondary ml-2">
            Secondary Button
          </button>
        </div>
        
        <div class="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <strong>✓ Checkpoint 4 Complete:</strong> npm run dev works, Tailwind CSS is functional, and path aliases are configured correctly.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional component-specific styles if needed */
</style>
