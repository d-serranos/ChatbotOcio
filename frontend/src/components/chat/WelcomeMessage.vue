<template>
  <div class="flex items-center justify-center min-h-[400px] px-4">
    <div class="max-w-2xl text-center space-y-6">
      <!-- Icon or Logo -->
      <div class="flex justify-center">
        <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            class="w-10 h-10 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      
      <!-- Welcome Title -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Welcome to ChatbotOcio
        </h1>
        <p class="text-lg text-gray-600">
          Your AI assistant for movie and videogame recommendations
        </p>
      </div>
      
      <!-- Capabilities List -->
      <div class="bg-white rounded-lg shadow-sm p-6 text-left">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          What I can help you with:
        </h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <svg 
              class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <div>
              <strong class="text-gray-900">Movie Recommendations</strong>
              <p class="text-sm text-gray-600">Get personalized movie suggestions based on your preferences</p>
            </div>
          </li>
          
          <li class="flex items-start gap-3">
            <svg 
              class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
            <div>
              <strong class="text-gray-900">Videogame Suggestions</strong>
              <p class="text-sm text-gray-600">Discover games that match your interests and gaming style</p>
            </div>
          </li>
          
          <li class="flex items-start gap-3">
            <svg 
              class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <strong class="text-gray-900">Information & Details</strong>
              <p class="text-sm text-gray-600">Ask about movies, games, genres, directors, and more</p>
            </div>
          </li>
          
          <li class="flex items-start gap-3">
            <svg 
              class="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <div>
              <strong class="text-gray-900">Casual Conversation</strong>
              <p class="text-sm text-gray-600">Chat naturally about entertainment and leisure activities</p>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Getting Started -->
      <div class="text-gray-600">
        <p class="text-sm">
          Start by typing a message below. Try asking:
        </p>
        <div class="mt-3 flex flex-wrap justify-center gap-2">
          <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            "Recommend a sci-fi movie"
          </span>
          <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            "Best RPG games"
          </span>
          <span class="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            "Action movies from 2020"
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this component
</script>

<style scoped>
/* Add any additional styling if needed */
</style>
