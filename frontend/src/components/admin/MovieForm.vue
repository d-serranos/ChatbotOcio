<template>
  <div class="bg-white rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">
      {{ mode === 'create' ? 'Add New Movie' : 'Edit Movie' }}
    </h2>

    <form
      @submit.prevent="handleSubmit"
      class="space-y-4"
    >
      <!-- Title -->
      <Input
        v-model="formData.titulo"
        label="Title"
        type="text"
        placeholder="Enter movie title"
        required
        maxlength="200"
        :error="errors.titulo"
      />

      <!-- Production Company -->
      <Input
        v-model="formData.productora"
        label="Production Company"
        type="text"
        placeholder="Enter production company"
        required
        maxlength="200"
        :error="errors.productora"
      />

      <!-- Genre -->
      <Input
        v-model="formData.genero"
        label="Genre"
        type="text"
        placeholder="Enter genre (e.g., Action, Drama, Comedy)"
        required
        maxlength="100"
        :error="errors.genero"
      />

      <!-- Platform -->
      <Input
        v-model="formData.plataforma"
        label="Platform"
        type="text"
        placeholder="Enter platform (e.g., Netflix, Disney+, Amazon Prime)"
        required
        maxlength="100"
        :error="errors.plataforma"
      />

      <!-- Release Year -->
      <Input
        v-model.number="formData.anio_lanzamiento"
        label="Release Year"
        type="number"
        placeholder="Enter release year"
        required
        :min="1888"
        :max="currentYear + 5"
        :error="errors.anio_lanzamiento"
      />

      <!-- Rating -->
      <Input
        v-model.number="formData.calificacion"
        label="Rating"
        type="number"
        placeholder="Enter rating (0-10)"
        min="0"
        max="10"
        step="0.1"
        :error="errors.calificacion"
        hint="Optional: Rating between 0 and 10"
      />

      <!-- Director -->
      <Input
        v-model="formData.director"
        label="Director"
        type="text"
        placeholder="Enter director name"
        required
        maxlength="200"
        :error="errors.director"
      />

      <!-- Actors -->
      <Input
        v-model="formData.actores"
        label="Actors"
        type="text"
        placeholder="Enter actor names separated by commas"
        :error="errors.actores"
        hint="Optional: Maximum 10 actors, separated by commas"
      />

      <!-- Duration -->
      <Input
        v-model.number="formData.duracion_minutos"
        label="Duration (minutes)"
        type="number"
        placeholder="Enter duration in minutes"
        required
        min="1"
        max="1000"
        :error="errors.duracion_minutos"
      />

      <!-- Classification -->
      <Input
        v-model="formData.clasificacion"
        label="Classification"
        type="text"
        placeholder="Enter classification (e.g., PG, PG-13, R)"
        required
        maxlength="10"
        :error="errors.clasificacion"
      />

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          @click="handleCancel"
          :disabled="submitting"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          :loading="submitting"
          :disabled="submitting"
        >
          {{ mode === 'create' ? 'Create Movie' : 'Update Movie' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useForm } from '@/composables/useForm'
import { validateMovie } from '@/utils/validation'
import Input from '../common/Input.vue'
import Button from '../common/Button.vue'

const props = defineProps({
  movie: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    required: true,
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['submit', 'cancel'])

const currentYear = new Date().getFullYear()

// Initialize form with useForm composable
const { errors, submitting, setSubmitting, setErrors, clearErrors } = useForm()

// Create reactive form data
const formData = reactive({
  titulo: '',
  productora: '',
  genero: '',
  plataforma: '',
  anio_lanzamiento: currentYear,
  calificacion: null,
  director: '',
  actores: '',
  duracion_minutos: null,
  clasificacion: ''
})

// Initialize form data if in edit mode
if (props.mode === 'edit' && props.movie) {
  Object.assign(formData, {
    titulo: props.movie.titulo || '',
    productora: props.movie.productora || '',
    genero: props.movie.genero || '',
    plataforma: props.movie.plataforma || '',
    anio_lanzamiento: props.movie.anio_lanzamiento || currentYear,
    calificacion: props.movie.calificacion,
    director: props.movie.director || '',
    actores: props.movie.actores || '',
    duracion_minutos: props.movie.duracion_minutos,
    clasificacion: props.movie.clasificacion || ''
  })
}

// Watch for movie prop changes (when switching between edit items)
watch(() => props.movie, (newMovie) => {
  if (props.mode === 'edit' && newMovie) {
    Object.assign(formData, {
      titulo: newMovie.titulo || '',
      productora: newMovie.productora || '',
      genero: newMovie.genero || '',
      plataforma: newMovie.plataforma || '',
      anio_lanzamiento: newMovie.anio_lanzamiento || currentYear,
      calificacion: newMovie.calificacion,
      director: newMovie.director || '',
      actores: newMovie.actores || '',
      duracion_minutos: newMovie.duracion_minutos,
      clasificacion: newMovie.clasificacion || ''
    })
    clearErrors()
  }
})

const handleSubmit = async () => {
  // Clear previous errors
  clearErrors()

  // Prepare data for validation (handle empty values)
  const dataToValidate = {
    ...formData,
    calificacion: formData.calificacion === '' ? null : formData.calificacion,
    actores: formData.actores || '',
    duracion_minutos: formData.duracion_minutos === '' ? null : formData.duracion_minutos
  }

  // Validate form data
  const validationErrors = validateMovie(dataToValidate)
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors)
    return
  }

  // Set submitting state
  setSubmitting(true)

  try {
    // Prepare final data for submission
    const submitData = {
      titulo: formData.titulo.trim(),
      productora: formData.productora.trim(),
      genero: formData.genero.trim(),
      plataforma: formData.plataforma.trim(),
      anio_lanzamiento: Number(formData.anio_lanzamiento),
      calificacion: formData.calificacion === null || formData.calificacion === '' 
        ? null 
        : Number(formData.calificacion),
      director: formData.director.trim(),
      actores: formData.actores ? formData.actores.trim() : null,
      duracion_minutos: Number(formData.duracion_minutos),
      clasificacion: formData.clasificacion.trim()
    }

    // Emit submit event with prepared data
    emit('submit', submitData)
  } catch (error) {
    console.error('Form submission error:', error)
  } finally {
    setSubmitting(false)
  }
}

const handleCancel = () => {
  clearErrors()
  emit('cancel')
}
</script>
