# Vue 3 Composables

This directory contains reusable Vue 3 Composition API composables that provide common functionality across the application.

## Available Composables

### 1. useAuth

Provides authentication state and methods from the auth store.

**Usage:**
```javascript
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, isAdmin, currentUser, userName, login, logout } = useAuth()
```

**Returns:**
- `isAuthenticated` - Computed boolean indicating if user is logged in
- `isAdmin` - Computed boolean indicating if user has admin role
- `currentUser` - Computed object with current user data
- `userName` - Computed string with user's name
- `loading` - Computed boolean for loading state
- `login(credentials)` - Async function to log in
- `register(userData)` - Async function to register
- `logout()` - Function to log out
- `checkAuth()` - Async function to verify auth state

### 2. useToast

Provides methods for displaying toast notifications.

**Usage:**
```javascript
import { useToast } from '@/composables/useToast'

const { showToast, success, error, warning, info } = useToast()

// Show different types of toasts
success('Operation successful!')
error('An error occurred')
warning('Please check your input')
info('Here is some information')
```

**Methods:**
- `showToast(message, type, duration)` - Generic toast method
- `success(message, duration)` - Show success toast (green)
- `error(message, duration)` - Show error toast (red)
- `warning(message, duration)` - Show warning toast (yellow)
- `info(message, duration)` - Show info toast (blue)
- `remove(id)` - Remove a specific toast by ID

### 3. useForm

Provides form validation and state management.

**Usage:**
```javascript
import { useForm } from '@/composables/useForm'

const { errors, submitting, validate, setError, clearErrors } = useForm()

// Validate form fields
const isValid = validate({
  email: () => {
    if (!email.value) return 'Email is required'
    if (!isValidEmail(email.value)) return 'Invalid email format'
    return null
  },
  password: () => {
    if (!password.value) return 'Password is required'
    if (password.value.length < 8) return 'Password must be at least 8 characters'
    return null
  }
})
```

**Returns:**
- `errors` - Reactive object with field errors
- `submitting` - Ref boolean for submission state
- `validate(validators)` - Validate multiple fields
- `validateField(field, validator)` - Validate single field
- `setError(field, message)` - Set error for field
- `setErrors(errors)` - Set multiple errors
- `clearErrors()` - Clear all errors
- `clearError(field)` - Clear specific field error
- `hasErrors()` - Check if any errors exist
- `getError(field)` - Get error for specific field
- `handleSubmit(handler)` - Wrap submit handler with automatic submitting state

### 4. useModal

Provides simple modal state management.

**Usage:**
```javascript
import { useModal } from '@/composables/useModal'

const { showModal, openModal, closeModal, toggleModal } = useModal()

// Control modal visibility
<button @click="openModal">Open Modal</button>
<Modal v-if="showModal" @close="closeModal">
  <!-- Modal content -->
</Modal>
```

**Returns:**
- `showModal` - Ref boolean for modal visibility
- `openModal()` - Function to show modal
- `closeModal()` - Function to hide modal
- `toggleModal()` - Function to toggle modal visibility

### 5. usePagination

Provides pagination state and logic.

**Usage:**
```javascript
import { usePagination } from '@/composables/usePagination'

const { 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPreviousPage,
  nextPage, 
  previousPage, 
  goToPage,
  getPageNumbers 
} = usePagination(1, 10)

// Set total pages after fetching data
setTotalPages(response.totalPages)

// Navigate pages
<button @click="previousPage" :disabled="!hasPreviousPage">Previous</button>
<button @click="nextPage" :disabled="!hasNextPage">Next</button>
```

**Returns:**
- `currentPage` - Ref with current page number
- `totalPages` - Ref with total pages count
- `hasNextPage` - Computed boolean for next page availability
- `hasPreviousPage` - Computed boolean for previous page availability
- `isFirstPage` - Computed boolean if on first page
- `isLastPage` - Computed boolean if on last page
- `goToPage(page)` - Navigate to specific page
- `nextPage()` - Go to next page
- `previousPage()` - Go to previous page
- `firstPage()` - Go to first page
- `lastPage()` - Go to last page
- `handlePageChange(page)` - Handle page change event
- `setTotalPages(total)` - Update total pages
- `reset()` - Reset to initial state
- `getPageNumbers(maxVisible)` - Get array of page numbers for display

### 6. useDebounce

Provides debouncing functionality for optimizing performance.

**Usage:**
```javascript
import { useDebounce, useDebouncedRef, useDebouncedWatch } from '@/composables/useDebounce'

// Option 1: Debounce a function
const debouncedSearch = useDebounce((query) => {
  // API call
  searchAPI(query)
}, 500)

// Option 2: Debounced ref value
const { value: searchQuery, debouncedValue: debouncedQuery } = useDebouncedRef('', 300)
watch(debouncedQuery, (newValue) => {
  // This only fires 300ms after user stops typing
  searchAPI(newValue)
})

// Option 3: Debounced watch
const searchQuery = ref('')
const { cancel } = useDebouncedWatch(searchQuery, (newValue) => {
  searchAPI(newValue)
}, 500)
```

**Functions:**
- `useDebounce(fn, delay)` - Returns debounced function
- `useDebouncedRef(initialValue, delay)` - Returns object with value and debouncedValue refs
- `useDebouncedWatch(watchSource, callback, delay)` - Debounced watcher with cancel method

## Best Practices

1. **Import from index**: Use the barrel export for cleaner imports
   ```javascript
   import { useAuth, useToast, useForm } from '@/composables'
   ```

2. **Destructure only what you need**: Extract only the properties and methods you'll use
   ```javascript
   const { isAuthenticated, login } = useAuth()
   ```

3. **Cleanup**: Composables handle their own cleanup (via `onUnmounted`), but be mindful of watchers and timers

4. **Type safety**: Consider adding JSDoc comments for better IDE support

5. **Testing**: Test composables in isolation by importing and calling them in test files

## Integration with Stores

Several composables integrate with Pinia stores:
- `useAuth` → `authStore`
- `useToast` → `toastStore`

Ensure these stores are properly initialized before using these composables.

## Requirements Coverage

These composables support the following requirements:
- **Requirement 10**: State Management - centralized access patterns
- **Requirement 12**: User Experience - reusable UI patterns
- Various requirements throughout the spec for reusable logic

## Future Enhancements

Consider adding:
- `useAsync` - For async operation state management
- `useLocalStorage` - For persistent local storage
- `useKeyboard` - For keyboard shortcuts
- `useClickOutside` - For click-outside detection
