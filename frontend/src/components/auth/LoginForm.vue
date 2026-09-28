<template>
  <form
    class="space-y-6"
    @submit.prevent="handleSubmit"
  >
    <Input
      v-model="formData.correo"
      label="Email"
      type="email"
      placeholder="Enter your email"
      :error="errors.correo"
      :required="true"
      :disabled="loading"
    />

    <Input
      v-model="formData.contrasena"
      label="Password"
      type="password"
      placeholder="Enter your password"
      :error="errors.contrasena"
      :required="true"
      :disabled="loading"
    />

    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input
          id="remember-me"
          v-model="formData.rememberMe"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        >
        <label
          for="remember-me"
          class="ml-2 block text-sm text-gray-900"
        >
          Remember me
        </label>
      </div>

      <div class="text-sm">
        <a
          href="#"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          Forgot password?
        </a>
      </div>
    </div>

    <Button
      type="submit"
      variant="primary"
      size="lg"
      :loading="loading"
      :disabled="!isFormValid || loading"
      class="w-full"
    >
      Sign in
    </Button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const formData = ref({
  correo: '',
  contrasena: '',
  rememberMe: false
})

const errors = ref({
  correo: '',
  contrasena: ''
})

const isFormValid = computed(() => {
  return (
    formData.value.correo.trim() !== '' &&
    formData.value.contrasena.trim() !== '' &&
    validateEmail(formData.value.correo)
  )
})

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate form fields
 * @returns {boolean} True if form is valid
 */
const validateForm = () => {
  let isValid = true
  errors.value = {
    correo: '',
    contrasena: ''
  }

  // Validate email
  if (!formData.value.correo.trim()) {
    errors.value.correo = 'Email is required'
    isValid = false
  } else if (!validateEmail(formData.value.correo)) {
    errors.value.correo = 'Please enter a valid email address'
    isValid = false
  }

  // Validate password
  if (!formData.value.contrasena.trim()) {
    errors.value.contrasena = 'Password is required'
    isValid = false
  }

  return isValid
}

/**
 * Handle form submission
 */
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }

  const credentials = {
    correo: formData.value.correo.trim(),
    contrasena: formData.value.contrasena
  }

  emit('submit', credentials)
}
</script>
