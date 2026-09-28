<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Genre Filter -->
      <Select
        v-model="localFilters.genre"
        label="Genre"
        :options="genreOptions"
        placeholder="All Genres"
        @change="handleFilterChange"
      />
      
      <!-- Platform Filter -->
      <Select
        v-model="localFilters.platform"
        label="Platform"
        :options="platformOptions"
        placeholder="All Platforms"
        @change="handleFilterChange"
      />
      
      <!-- Classification Filter (for videogames) -->
      <Select
        v-if="classifications && classifications.length > 0"
        v-model="localFilters.classification"
        label="Classification"
        :options="classificationOptions"
        placeholder="All Classifications"
        @change="handleFilterChange"
      />
      
      <!-- Year Filter -->
      <Select
        v-model="localFilters.year"
        label="Year"
        :options="yearOptions"
        placeholder="All Years"
        @change="handleFilterChange"
      />
      
      <!-- Clear Filters Button -->
      <div class="flex items-end">
        <Button
          variant="secondary"
          class="w-full"
          @click="clearFilters"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Select from '@/components/common/Select.vue'
import Button from '@/components/common/Button.vue'

/**
 * MediaFilters Component
 * 
 * Provides filter controls for catalog browsing.
 * Renders Select components for genre, platform, classification (videogames only), and year filtering.
 * Emits filter event when selections change.
 * 
 * Props:
 * - genres: Array of available genres
 * - platforms: Array of available platforms
 * - classifications: Array of available classifications (optional, for videogames)
 * - years: Array of available years
 * 
 * Emits:
 * - filter(filters): When filters change with { genero, plataforma, clasificacion?, anio_lanzamiento }
 * 
 * Validates: Requirements 5.8
 */

const props = defineProps({
  genres: {
    type: Array,
    default: () => []
  },
  platforms: {
    type: Array,
    default: () => []
  },
  classifications: {
    type: Array,
    default: () => []
  },
  years: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter'])

const localFilters = ref({
  genre: '',
  platform: '',
  classification: '',
  year: ''
})

// Prepare options for Select components
const genreOptions = computed(() => {
  return props.genres.filter(Boolean).map(genre => ({
    value: genre,
    label: genre
  }))
})

const platformOptions = computed(() => {
  return props.platforms.filter(Boolean).map(platform => ({
    value: platform,
    label: platform
  }))
})

const classificationOptions = computed(() => {
  return props.classifications.filter(Boolean).map(classification => ({
    value: classification,
    label: classification
  }))
})

const yearOptions = computed(() => {
  return props.years
    .filter(Boolean)
    .sort((a, b) => b - a) // Sort years descending
    .map(year => ({
      value: year,
      label: year.toString()
    }))
})

const handleFilterChange = () => {
  // Emit filters object with only non-empty values
  const filters = {}
  
  if (localFilters.value.genre) {
    filters.genero = localFilters.value.genre
  }
  
  if (localFilters.value.platform) {
    filters.plataforma = localFilters.value.platform
  }
  
  if (localFilters.value.classification) {
    filters.clasificacion = localFilters.value.classification
  }
  
  if (localFilters.value.year) {
    filters.anio_lanzamiento = parseInt(localFilters.value.year)
  }
  
  emit('filter', filters)
}

const clearFilters = () => {
  localFilters.value = {
    genre: '',
    platform: '',
    classification: '',
    year: ''
  }
  
  // Emit empty filters to reset
  emit('filter', {})
}
</script>
