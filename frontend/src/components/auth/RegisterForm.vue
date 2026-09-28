<template>
  <form
    class="space-y-6"
    @submit.prevent="handleSubmit"
  >
    <Input
      v-model="formData.nombre"
      label="Name"
      type="text"
      placeholder="Enter your full name"
      :error="errors.nombre"
      :required="true"
      :disabled="loading"
    />

    <Input
      v-model="formData.correo"
      label="Email"
      type="email"
      placeholder="Enter your email"
      :error="errors.correo"
      :required="true"
      :disabled="loading"
    />

    <div>
      <Input
        v-model="formData.contrasena"
        label="Password"
        type="password"
        placeholder="Create a password (min. 8 characters)"
        :error="errors.contrasena"
        :required="true"
        :disabled="loading"
      />
      
      <!-- Password strength indicator -->
      <div
        v-if="formData.contrasena"
        class="mt-2"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-gray-600">Password strength:</span>
          <span
            class="text-xs font-medium"
            :class="passwordStrengthColor"
          >
            {{ passwordStrengthText }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full transition-all duration-300"
            :class="passwordStrengthBarColor"
            :style="{ width: `${passwordStrength * 25}%` }"
          />
        </div>
      </div>
    </div>

    <Input
      v-model="formData.confirmarContrasena"
      label="Confirm Password"
      type="password"
      placeholder="Re-enter your password"
      :error="errors.confirmarContrasena"
      :required="true"
      :disabled="loading"
    />

    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input
          id="terms"
          v-model="formData.acceptTerms"
          type="checkbox"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        >
      </div>
      <div class="ml-3 text-sm">
        <label
          for="terms"
          class="text-gray-700"
        >
          I agree to the
          <a
            href="#"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Terms of Service
          </a>
          and
          <a
            href="#"
            class="font-medium text-blue-600 hover:text-blue-500"
          >
            Privacy Policy
          </a>
        </label>
        <p
          v-if="errors.acceptTerms"
          class="text-red-600 mt-1"
        >
          {{ errors.acceptTerms }}
        </p>
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
      Create Account
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
  nombre: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  acceptTerms: false
})

const errors = ref({
  nombre: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  acceptTerms: ''
})

const isFormValid = computed(() => {
  return (
    formData.value.nombre.trim() !== '' &&
    formData.value.correo.trim() !== '' &&
    formData.value.contrasena.trim() !== '' &&
    formData.value.confirmarContrasena.trim() !== '' &&
    formData.value.acceptTerms &&
    validateEmail(formData.value.correo) &&
    formData.value.contrasena.length >= 8 &&
    formData.value.contrasena === formData.value.confirmarContrasena
  )
})

/**
 * Calculate password strength (0-4 scale)
 */
const passwordStrength = computed(() => {
  const password = formData.value.contrasena
  if (!password) return 0

  let strength = 0
  
  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // Character variety checks
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
})

const passwordStrengthText = computed(() => {
  const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  return texts[passwordStrength.value] || 'Very Weak'
})

const passwordStrengthColor = computed(() => {
  const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600', 'text-green-700']
  return colors[passwordStrength.value] || 'text-red-600'
})

const passwordStrengthBarColor = computed(() => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
  return colors[passwordStrength.value] || 'bg-red-500'
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
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    acceptTerms: ''
  }

  // Validate name
  if (!formData.value.nombre.trim()) {
    errors.value.nombre = 'Name is required'
    isValid = false
  } else if (formData.value.nombre.trim().length < 2) {
    errors.value.nombre = 'Name must be at least 2 characters'
    isValid = false
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
  } else if (formData.value.contrasena.length < 8) {
    errors.value.contrasena = 'Password must be at least 8 characters'
    isValid = false
  }

  // Validate password confirmation
  if (!formData.value.confirmarContrasena.trim()) {
    errors.value.confirmarContrasena = 'Please confirm your password'
    isValid = false
  } else if (formData.value.contrasena !== formData.value.confirmarContrasena) {
    errors.value.confirmarContrasena = 'Passwords do not match'
    isValid = false
  }

  // Validate terms acceptance
  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
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

  const userData = {
    nombre: formData.value.nombre.trim(),
    correo: formData.value.correo.trim(),
    contrasena: formData.value.contrasena
  }

  emit('submit', userData)
}
</script>
