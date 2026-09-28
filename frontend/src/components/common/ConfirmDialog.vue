<template>
  <Modal
    :show="show"
    :title="title"
    size="sm"
    :close-on-backdrop="false"
    :close-on-escape="true"
    @close="handleCancel"
  >
    <!-- Message content -->
    <div class="mt-2">
      <p class="text-sm text-gray-500">
        {{ message }}
      </p>
    </div>
    
    <!-- Actions -->
    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          variant="secondary"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </Button>
        
        <Button
          :variant="confirmVariant"
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from './Modal.vue'
import Button from './Button.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmVariant: {
    type: String,
    default: 'danger',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:show'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>
