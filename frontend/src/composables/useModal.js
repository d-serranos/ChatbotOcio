import { ref } from 'vue'

/**
 * Composable for modal state management
 * Provides simple control over modal visibility
 * 
 * @param {boolean} initialState - Initial modal visibility state
 * @returns {Object} Modal control utilities
 */
export function useModal(initialState = false) {
  const showModal = ref(initialState)

  /**
   * Open the modal
   */
  const openModal = () => {
    showModal.value = true
  }

  /**
   * Close the modal
   */
  const closeModal = () => {
    showModal.value = false
  }

  /**
   * Toggle the modal visibility
   */
  const toggleModal = () => {
    showModal.value = !showModal.value
  }

  return {
    showModal,
    openModal,
    closeModal,
    toggleModal
  }
}
