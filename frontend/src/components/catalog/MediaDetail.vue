<template>
  <Modal
    :show="true"
    :title="mediaTitle"
    size="lg"
    @close="handleClose"
  >
    <div class="space-y-4">
      <!-- Media Type Badge -->
      <div class="flex items-center justify-between">
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-semibold',
            isMovie ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          ]"
        >
          {{ isMovie ? 'Movie' : 'Videogame' }}
        </span>
        
        <span v-if="media.anio_lanzamiento" class="text-gray-600">
          {{ media.anio_lanzamiento }}
        </span>
      </div>
      
      <!-- Media Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailItem label="Genre" :value="media.genero" />
        <DetailItem label="Platform" :value="media.plataforma" />
        
        <!-- Movie-specific fields -->
        <template v-if="isMovie">
          <DetailItem label="Director" :value="media.director" />
          <DetailItem label="Duration" :value="formatDuration(media.duracion_minutos)" />
          <DetailItem label="Rating" :value="formatRating(media.calificacion)" />
        </template>
        
        <!-- Videogame-specific fields -->
        <template v-else>
          <DetailItem label="Developer" :value="media.desarrollador" />
          <DetailItem label="Classification">
            <span
              v-if="media.clasificacion"
              :class="classificationClasses"
              class="px-2 py-1 rounded text-xs font-semibold"
            >
              {{ media.clasificacion }}
            </span>
          </DetailItem>
          <DetailItem label="Players" :value="media.numero_jugadores" />
        </template>
      </div>
      
      <!-- Description -->
      <div v-if="media.descripcion" class="pt-4 border-t border-gray-200">
        <h4 class="text-sm font-semibold text-gray-700 mb-2">Description</h4>
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ media.descripcion }}
        </p>
      </div>
      
      <!-- Additional Info -->
      <div class="pt-4 border-t border-gray-200 space-y-2">
        <DetailItem
          v-if="media.fecha_agregado"
          label="Added on"
          :value="formatDate(media.fecha_agregado)"
        />
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end">
        <Button variant="secondary" @click="handleClose">
          Close
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'

/**
 * MediaDetail Component
 * 
 * Displays full details of a movie or videogame in a modal dialog.
 * Automatically detects media type based on available fields.
 * 
 * Props:
 * - media: Movie or videogame object with full details
 * 
 * Emits:
 * - close: When modal is closed
 * 
 * Validates: Requirements 5.6
 */

const props = defineProps({
  media: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Detect if this is a movie or videogame based on fields
const isMovie = computed(() => {
  return props.media.hasOwnProperty('director') || 
         props.media.hasOwnProperty('calificacion') ||
         props.media.hasOwnProperty('duracion_minutos')
})

const mediaTitle = computed(() => {
  return props.media.titulo || 'Media Details'
})

// Color coding for ESRB classifications
const classificationClasses = computed(() => {
  const classification = props.media.clasificacion
  
  const colorMap = {
    'E': 'bg-green-100 text-green-800',
    'E10+': 'bg-blue-100 text-blue-800',
    'T': 'bg-yellow-100 text-yellow-800',
    'M': 'bg-orange-100 text-orange-800',
    'AO': 'bg-red-100 text-red-800',
    'RP': 'bg-gray-100 text-gray-800'
  }
  
  return colorMap[classification] || 'bg-gray-100 text-gray-800'
})

const formatDuration = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const formatRating = (rating) => {
  if (!rating) return 'N/A'
  return `${rating}/10`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<script>
// Helper component for displaying detail items
const DetailItem = {
  name: 'DetailItem',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  template: `
    <div>
      <dt class="text-sm font-medium text-gray-500 mb-1">{{ label }}</dt>
      <dd class="text-sm text-gray-900">
        <slot>{{ value || 'N/A' }}</slot>
      </dd>
    </div>
  `
}
</script>
