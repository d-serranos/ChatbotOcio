<template>
  <div class="bg-white rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">
      {{ mode === 'create' ? 'Add New Videogame' : 'Edit Videogame' }}
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
        placeholder="Enter videogame title"
        required
        maxlength="200"
        :error="errors.titulo"
      />

      <!-- Genre -->
      <Input
        v-model="formData.genero"
        label="Genre"
        type="text"
        placeholder="Enter genre (e.g., Action, RPG, Strategy)"
        required
        maxlength="100"
        :error="errors.genero"
      />

      <!-- Platform -->
      <Input
        v-model="formData.plataforma"
        label="Platform"
        type="text"
        placeholder="Enter platform (e.g., PlayStation, Xbox, PC)"
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
        :min="1958"
        :max="currentYear + 5"
        :error="errors.anio_lanzamiento"
      />

      <!-- Classification -->
      <Select
        v-model="formData.clasificacion"
        label="Classification"
        :options="clasificacionOptions"
        placeholder="Select classification"
        required
        :error="errors.clasificacion"
        hint="ESRB rating for the videogame"
      />

      <!-- Developer -->
      <Input
        v-model="formData.desarrollador"
        label="Developer"
        type="text"
        placeholder="Enter developer name"
        required
        maxlength="200"
        :error="errors.desarrollador"
      />

      <!-- Players -->
      <Input
        v-model="formData.jugadores"
        label="Players"
        type="text"
        placeholder="Enter player count (e.g., 1, 1-4, 1+)"
        :error="errors.jugadores"
        hint="Optional: Use format '1', '1-4', or '1+'"
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
          {{ mode === 'create' ? 'Create Videogame' : 'Update Videogame' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useForm } from '@/composables/useForm'
import { validateVideogame } from '@/utils/validation'
import Input from '../common/Input.vue'
import Select from '../common/Select.vue'
import Button from '../common/Button.vue'

const props = defineProps({
  videogame: {
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

// Classification options (ESRB ratings)
const clasificacionOptions = [
  { value: 'E', label: 'E - Everyone' },
  { value: 'E10+', label: 'E10+ - Everyone 10+' },
  { value: 'T', label: 'T - Teen' },
  { value: 'M', label: 'M - Mature 17+' },
  { value: 'AO', label: 'AO - Adults Only' },
  { value: 'RP', label: 'RP - Rating Pending' }
]

// Initialize form with useForm composable
const { errors, submitting, setSubmitting, setErrors, clearErrors } = useForm()

// Create reactive form data
const formData = reactive({
  titulo: '',
  genero: '',
  plataforma: '',
  anio_lanzamiento: currentYear,
  clasificacion: '',
  desarrollador: '',
  jugadores: ''
})

// Initialize form data if in edit mode
if (props.mode === 'edit' && props.videogame) {
  Object.assign(formData, {
    titulo: props.videogame.titulo || '',
    genero: props.videogame.genero || '',
    plataforma: props.videogame.plataforma || '',
    anio_lanzamiento: props.videogame.anio_lanzamiento || currentYear,
    clasificacion: props.videogame.clasificacion || '',
    desarrollador: props.videogame.desarrollador || '',
    jugadores: props.videogame.jugadores || ''
  })
}

// Watch for videogame prop changes (when switching between edit items)
watch(() => props.videogame, (newVideogame) => {
  if (props.mode === 'edit' && newVideogame) {
    Object.assign(formData, {
      titulo: newVideogame.titulo || '',
      genero: newVideogame.genero || '',
      plataforma: newVideogame.plataforma || '',
      anio_lanzamiento: newVideogame.anio_lanzamiento || currentYear,
      clasificacion: newVideogame.clasificacion || '',
      desarrollador: newVideogame.desarrollador || '',
      jugadores: newVideogame.jugadores || ''
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
    jugadores: formData.jugadores || ''
  }

  // Validate form data
  const validationErrors = validateVideogame(dataToValidate)
  
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
      genero: formData.genero.trim(),
      plataforma: formData.plataforma.trim(),
      anio_lanzamiento: Number(formData.anio_lanzamiento),
      clasificacion: formData.clasificacion.trim(),
      desarrollador: formData.desarrollador.trim(),
      jugadores: formData.jugadores ? formData.jugadores.trim() : null
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
