<template>
  <article
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
    @click="handleClick"
  >
    <button
      class="w-full text-left focus:outline-none"
      :aria-label="`View details for ${movie.titulo}`"
      @click="handleClick"
    >
      <!-- Movie Poster Placeholder -->
      <div 
        class="bg-gradient-to-br from-blue-500 to-purple-600 h-48 flex items-center justify-center"
        role="img"
        :aria-label="`${movie.titulo} poster`"
      >
        <svg
          class="w-16 h-16 text-white opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
      </div>
      
      <!-- Movie Info -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">
          {{ movie.titulo }}
        </h3>
        
        <dl class="space-y-1 text-sm text-gray-600">
          <div class="flex items-center">
            <dt class="font-medium mr-2">Genre:</dt>
            <dd class="truncate">{{ movie.genero }}</dd>
          </div>
          
          <div class="flex items-center">
            <dt class="font-medium mr-2">Year:</dt>
            <dd>{{ movie.anio_lanzamiento }}</dd>
          </div>
          
          <div class="flex items-center">
            <dt class="font-medium mr-2">Platform:</dt>
            <dd class="truncate">{{ movie.plataforma }}</dd>
          </div>
          
          <div v-if="movie.director" class="flex items-center">
            <dt class="font-medium mr-2">Director:</dt>
            <dd class="truncate">{{ movie.director }}</dd>
          </div>
          
          <div v-if="movie.calificacion" class="flex items-center mt-2">
            <dt class="font-medium mr-2">Rating:</dt>
            <dd class="flex items-center">
              <svg
                class="w-4 h-4 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
              <span class="ml-1">{{ movie.calificacion }} out of 10</span>
            </dd>
          </div>
        </dl>
      </div>
    </button>
  </article>
</template>

<script setup>
/**
 * MovieCard Component
 * 
 * Displays a movie in card format with key information.
 * Emits click event when user interacts with the card.
 * 
 * Props:
 * - movie: Movie object with titulo, genero, anio_lanzamiento, plataforma, director, calificacion
 * 
 * Emits:
 * - click: When card is clicked
 * 
 * Validates: Requirements 5.1, 5.2
 */

const props = defineProps({
  movie: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.titulo === 'string'
    }
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.movie)
}
</script>
