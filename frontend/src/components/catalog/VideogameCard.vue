<template>
  <article
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg focus-within:ring-2 focus-within:ring-blue-500"
    @click="handleClick"
  >
    <button
      class="w-full text-left focus:outline-none"
      :aria-label="`View details for ${videogame.titulo}`"
      @click="handleClick"
    >
      <!-- Videogame Cover Placeholder -->
      <div 
        class="bg-gradient-to-br from-green-500 to-teal-600 h-48 flex items-center justify-center"
        role="img"
        :aria-label="`${videogame.titulo} cover`"
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
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      </div>
      
      <!-- Videogame Info -->
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 truncate">
          {{ videogame.titulo }}
        </h3>
        
        <dl class="space-y-1 text-sm text-gray-600">
          <div class="flex items-center">
            <dt class="font-medium mr-2">Genre:</dt>
            <dd class="truncate">{{ videogame.genero }}</dd>
          </div>
          
          <div class="flex items-center">
            <dt class="font-medium mr-2">Year:</dt>
            <dd>{{ videogame.anio_lanzamiento }}</dd>
          </div>
          
          <div class="flex items-center">
            <dt class="font-medium mr-2">Platform:</dt>
            <dd class="truncate">{{ videogame.plataforma }}</dd>
          </div>
          
          <div v-if="videogame.clasificacion" class="flex items-center">
            <dt class="font-medium mr-2">Rating:</dt>
            <dd
              :class="classificationClasses"
              class="px-2 py-0.5 rounded text-xs font-semibold"
            >
              {{ videogame.clasificacion }}
            </dd>
          </div>
          
          <div v-if="videogame.desarrollador" class="flex items-center">
            <dt class="font-medium mr-2">Developer:</dt>
            <dd class="truncate">{{ videogame.desarrollador }}</dd>
          </div>
          
          <div v-if="videogame.numero_jugadores" class="flex items-center mt-2">
            <dt class="font-medium mr-2">Players:</dt>
            <dd>{{ videogame.numero_jugadores }}</dd>
          </div>
        </dl>
      </div>
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'

/**
 * VideogameCard Component
 * 
 * Displays a videogame in card format with key information.
 * Emits click event when user interacts with the card.
 * 
 * Props:
 * - videogame: Videogame object with titulo, genero, anio_lanzamiento, plataforma, 
 *   clasificacion, desarrollador, numero_jugadores
 * 
 * Emits:
 * - click: When card is clicked
 * 
 * Validates: Requirements 5.1, 5.2
 */

const props = defineProps({
  videogame: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.titulo === 'string'
    }
  }
})

const emit = defineEmits(['click'])

// Color coding for ESRB classifications
const classificationClasses = computed(() => {
  const classification = props.videogame.clasificacion
  
  const colorMap = {
    'E': 'bg-green-100 text-green-800',       // Everyone
    'E10+': 'bg-blue-100 text-blue-800',      // Everyone 10+
    'T': 'bg-yellow-100 text-yellow-800',     // Teen
    'M': 'bg-orange-100 text-orange-800',     // Mature
    'AO': 'bg-red-100 text-red-800',          // Adults Only
    'RP': 'bg-gray-100 text-gray-800'         // Rating Pending
  }
  
  return colorMap[classification] || 'bg-gray-100 text-gray-800'
})

const handleClick = () => {
  emit('click', props.videogame)
}
</script>
