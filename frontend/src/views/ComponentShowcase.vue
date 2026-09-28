<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">
        Component Showcase
      </h1>
      <p class="text-gray-600 mb-12">
        A preview of all common reusable components in the application.
      </p>

      <!-- Buttons Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Buttons
        </h2>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">
              Variants
            </h3>
            <div class="flex flex-wrap gap-3">
              <Button variant="primary">
                Primary
              </Button>
              <Button variant="secondary">
                Secondary
              </Button>
              <Button variant="danger">
                Danger
              </Button>
              <Button variant="success">
                Success
              </Button>
              <Button variant="ghost">
                Ghost
              </Button>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">
              Sizes
            </h3>
            <div class="flex flex-wrap items-center gap-3">
              <Button size="sm">
                Small
              </Button>
              <Button size="md">
                Medium
              </Button>
              <Button size="lg">
                Large
              </Button>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">
              States
            </h3>
            <div class="flex flex-wrap gap-3">
              <Button :disabled="true">
                Disabled
              </Button>
              <Button :loading="true">
                Loading
              </Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Inputs Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Inputs
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            v-model="demoInputs.text"
            label="Text Input"
            placeholder="Enter text"
            hint="This is a hint message"
          />
          
          <Input
            v-model="demoInputs.email"
            label="Email Input"
            type="email"
            placeholder="your@email.com"
            :required="true"
          />
          
          <Input
            v-model="demoInputs.number"
            label="Number Input"
            type="number"
            :min="0"
            :max="100"
          />
          
          <Input
            v-model="demoInputs.error"
            label="Input with Error"
            placeholder="This has an error"
            error="This field is required"
          />
          
          <Input
            label="Disabled Input"
            :disabled="true"
            model-value="Cannot edit this"
          />
        </div>
      </section>

      <!-- Select Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Select Dropdowns
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            v-model="demoInputs.select1"
            label="Simple Select"
            :options="['Option 1', 'Option 2', 'Option 3']"
            placeholder="Choose an option"
          />
          
          <Select
            v-model="demoInputs.select2"
            label="Object Options"
            :options="[
              { value: '1', label: 'First Option' },
              { value: '2', label: 'Second Option' },
              { value: '3', label: 'Third Option' }
            ]"
          />
          
          <Select
            v-model="demoInputs.select3"
            label="Select with Error"
            :options="['Option A', 'Option B']"
            error="Please select a valid option"
          />
        </div>
      </section>

      <!-- Loading States Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Loading States
        </h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              Loading Spinners
            </h3>
            <div class="flex flex-wrap items-center gap-6">
              <div class="text-center">
                <LoadingSpinner size="sm" />
                <p class="text-xs text-gray-500 mt-2">
                  Small
                </p>
              </div>
              <div class="text-center">
                <LoadingSpinner size="md" />
                <p class="text-xs text-gray-500 mt-2">
                  Medium
                </p>
              </div>
              <div class="text-center">
                <LoadingSpinner size="lg" />
                <p class="text-xs text-gray-500 mt-2">
                  Large
                </p>
              </div>
              <div class="text-center">
                <LoadingSpinner size="xl" />
                <p class="text-xs text-gray-500 mt-2">
                  Extra Large
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              Skeleton Loaders
            </h3>
            <div class="space-y-3">
              <SkeletonLoader
                type="text"
                :count="3"
              />
              <SkeletonLoader type="title" />
              <SkeletonLoader type="card" />
              <div class="flex gap-3">
                <SkeletonLoader type="circle" />
                <SkeletonLoader type="circle" />
                <SkeletonLoader type="circle" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Error Messages Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Error Messages
        </h2>
        
        <div class="space-y-4">
          <ErrorMessage error="This is a simple error message" />
          
          <ErrorMessage
            title="Validation Failed"
            :error="['Email is required', 'Password must be at least 8 characters']"
          />
          
          <ErrorMessage
            :error="{ email: 'Invalid email format', password: 'Too weak' }"
          />
          
          <ErrorMessage
            error="Failed to load data from server"
            :retryable="true"
            @retry="handleRetry"
          />
          
          <ErrorMessage
            error="This is a dismissible error"
            :dismissible="true"
            @dismiss="handleDismiss"
          />
        </div>
      </section>

      <!-- Dialogs Section -->
      <section class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-4">
          Modals & Dialogs
        </h2>
        
        <div class="flex flex-wrap gap-3">
          <Button @click="showDemoModal = true">
            Open Modal
          </Button>
          <Button
            variant="danger"
            @click="showConfirmDialog = true"
          >
            Show Confirm Dialog
          </Button>
          <Button
            variant="success"
            @click="showSuccessToast"
          >
            Show Success Toast
          </Button>
          <Button
            variant="danger"
            @click="showErrorToast"
          >
            Show Error Toast
          </Button>
          <Button @click="showInfoToast">
            Show Info Toast
          </Button>
        </div>
      </section>
    </div>

    <!-- Demo Modal -->
    <Modal
      v-model:show="showDemoModal"
      title="Demo Modal"
      size="md"
    >
      <p class="text-gray-700">
        This is a demo modal with some content. You can close it by clicking the X button,
        clicking outside the modal, or pressing the Escape key.
      </p>
      
      <div class="mt-4">
        <Input
          v-model="modalInput"
          label="Input in Modal"
          placeholder="Type something"
        />
      </div>
      
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            variant="secondary"
            @click="showDemoModal = false"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            @click="showDemoModal = false"
          >
            Save
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-model:show="showConfirmDialog"
      title="Confirm Action"
      message="Are you sure you want to perform this action? This cannot be undone."
      confirm-text="Yes, Continue"
      cancel-text="No, Cancel"
      @confirm="handleConfirm"
      @cancel="showConfirmDialog = false"
    />

    <!-- Toast Container -->
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Button,
  Input,
  Select,
  Modal,
  Toast,
  LoadingSpinner,
  SkeletonLoader,
  ConfirmDialog,
  ErrorMessage
} from '@/components/common'

// Demo state
const demoInputs = ref({
  text: '',
  email: '',
  number: 0,
  error: '',
  select1: '',
  select2: '',
  select3: ''
})

const showDemoModal = ref(false)
const showConfirmDialog = ref(false)
const modalInput = ref('')

// Toast management
const toasts = ref([])
let toastId = 0

const addToast = (message, type = 'info', duration = 5000) => {
  const id = toastId++
  toasts.value.push({ id, message, type, duration })
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

const showSuccessToast = () => {
  addToast('Operation completed successfully!', 'success')
}

const showErrorToast = () => {
  addToast('An error occurred. Please try again.', 'error')
}

const showInfoToast = () => {
  addToast('This is an informational message.', 'info')
}

const handleConfirm = () => {
  addToast('Action confirmed!', 'success')
  showConfirmDialog.value = false
}

const handleRetry = () => {
  addToast('Retrying...', 'info')
}

const handleDismiss = () => {
  addToast('Error dismissed', 'info')
}
</script>
