# Common Components Documentation

This directory contains reusable UI components that are used throughout the application. All components follow Vue 3 Composition API patterns and are styled with Tailwind CSS.

## Components

### Button.vue

A flexible button component with multiple variants and sizes.

**Props:**
- `variant` (String): 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' - Default: 'primary'
- `size` (String): 'sm' | 'md' | 'lg' - Default: 'md'
- `disabled` (Boolean): Disables the button - Default: false
- `loading` (Boolean): Shows loading spinner - Default: false
- `type` (String): HTML button type - Default: 'button'

**Events:**
- `@click`: Emitted when button is clicked (if not disabled or loading)

**Usage:**
```vue
<Button variant="primary" size="md" @click="handleClick">
  Click Me
</Button>

<Button variant="danger" :loading="isSubmitting">
  Delete
</Button>
```

---

### Input.vue

A form input component with label, error display, and validation feedback.

**Props:**
- `modelValue` (String | Number): Input value (v-model)
- `label` (String): Label text
- `type` (String): HTML input type - Default: 'text'
- `placeholder` (String): Placeholder text
- `error` (String): Error message to display
- `hint` (String): Hint text to display below input
- `required` (Boolean): Marks field as required - Default: false
- `disabled` (Boolean): Disables input - Default: false
- `maxlength` (Number): Maximum character length
- `min` (Number | String): Minimum value (for number inputs)
- `max` (Number | String): Maximum value (for number inputs)
- `step` (Number | String): Step value (for number inputs)

**Events:**
- `@update:modelValue`: Emitted when value changes
- `@blur`: Emitted when input loses focus
- `@focus`: Emitted when input gains focus

**Usage:**
```vue
<Input
  v-model="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  :error="emailError"
  required
/>
```

---

### Select.vue

A styled select dropdown component with label and error display.

**Props:**
- `modelValue` (String | Number | Boolean): Selected value (v-model)
- `label` (String): Label text
- `options` (Array): Array of options (strings, numbers, or objects with { value, label })
- `placeholder` (String): Placeholder option text
- `error` (String): Error message to display
- `hint` (String): Hint text to display below select
- `required` (Boolean): Marks field as required - Default: false
- `disabled` (Boolean): Disables select - Default: false

**Events:**
- `@update:modelValue`: Emitted when selection changes
- `@change`: Emitted when selection changes (with new value)
- `@blur`: Emitted when select loses focus

**Usage:**
```vue
<Select
  v-model="selectedGenre"
  label="Genre"
  :options="['Action', 'Comedy', 'Drama']"
  placeholder="Select a genre"
/>

<Select
  v-model="selectedYear"
  :options="[
    { value: 2023, label: '2023' },
    { value: 2024, label: '2024' }
  ]"
/>
```

---

### Modal.vue

A modal dialog component with backdrop, close button, and focus trap.

**Props:**
- `show` (Boolean): Controls modal visibility - Default: false
- `title` (String): Modal title
- `size` (String): 'sm' | 'md' | 'lg' | 'xl' | 'full' - Default: 'md'
- `closeOnBackdrop` (Boolean): Allow closing by clicking backdrop - Default: true
- `closeOnEscape` (Boolean): Allow closing with Escape key - Default: true

**Events:**
- `@close`: Emitted when modal should close
- `@update:show`: Emitted to update show prop (v-model compatible)

**Slots:**
- Default slot: Modal content
- `footer`: Optional footer content

**Usage:**
```vue
<Modal
  v-model:show="showModal"
  title="Edit Movie"
  size="lg"
  @close="handleClose"
>
  <p>Modal content goes here</p>
  
  <template #footer>
    <Button @click="handleSave">Save</Button>
  </template>
</Modal>
```

---

### Toast.vue

A toast notification component with auto-dismiss and different types.

**Props:**
- `message` (String): Toast message - Required
- `type` (String): 'success' | 'error' | 'warning' | 'info' - Default: 'info'
- `duration` (Number): Auto-close duration in ms - Default: 5000
- `autoClose` (Boolean): Enable auto-close - Default: true

**Events:**
- `@close`: Emitted when toast is closed

**Usage:**
```vue
<Toast
  message="Operation successful!"
  type="success"
  :duration="3000"
  @close="handleToastClose"
/>
```

**Note:** Toasts are typically managed by a toast store and rendered in a container. See the toast store implementation for proper usage.

---

### LoadingSpinner.vue

An animated loading spinner component.

**Props:**
- `size` (String): 'sm' | 'md' | 'lg' | 'xl' - Default: 'md'
- `color` (String): Color name or 'current' - Default: 'current'
- `center` (Boolean): Center the spinner - Default: false

**Usage:**
```vue
<LoadingSpinner size="lg" color="blue" />

<div class="flex justify-center">
  <LoadingSpinner />
</div>
```

---

### SkeletonLoader.vue

A skeleton placeholder for loading states.

**Props:**
- `type` (String): 'text' | 'title' | 'card' | 'circle' | 'custom' - Default: 'text'
- `count` (Number): Number of skeleton elements - Default: 1
- `width` (String): Custom width (CSS value)
- `height` (String): Custom height (CSS value)
- `className` (String): Additional CSS classes

**Usage:**
```vue
<!-- Text skeleton -->
<SkeletonLoader type="text" :count="3" />

<!-- Card skeleton -->
<SkeletonLoader type="card" />

<!-- Custom skeleton -->
<SkeletonLoader type="custom" width="200px" height="100px" />
```

---

### ConfirmDialog.vue

A confirmation dialog for destructive actions.

**Props:**
- `show` (Boolean): Controls dialog visibility - Default: false
- `title` (String): Dialog title - Default: 'Confirm Action'
- `message` (String): Confirmation message - Required
- `confirmText` (String): Confirm button text - Default: 'Confirm'
- `cancelText` (String): Cancel button text - Default: 'Cancel'
- `confirmVariant` (String): Confirm button variant - Default: 'danger'
- `loading` (Boolean): Shows loading state on confirm button - Default: false

**Events:**
- `@confirm`: Emitted when confirm button is clicked
- `@cancel`: Emitted when cancel button is clicked
- `@update:show`: Emitted to update show prop

**Usage:**
```vue
<ConfirmDialog
  v-model:show="showDeleteDialog"
  title="Delete Movie"
  message="Are you sure you want to delete this movie? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  :loading="isDeleting"
  @confirm="handleDelete"
  @cancel="showDeleteDialog = false"
/>
```

---

### ErrorMessage.vue

An error message component with various display formats.

**Props:**
- `error` (String | Array | Object): Error message(s) - Default: null
- `title` (String): Error title
- `retryable` (Boolean): Show retry button - Default: false
- `dismissible` (Boolean): Show dismiss button - Default: false

**Events:**
- `@retry`: Emitted when retry button is clicked
- `@dismiss`: Emitted when dismiss button is clicked

**Usage:**
```vue
<!-- Simple error -->
<ErrorMessage error="Something went wrong" />

<!-- Multiple errors -->
<ErrorMessage
  title="Validation Errors"
  :error="['Email is required', 'Password is too short']"
/>

<!-- Object errors -->
<ErrorMessage
  :error="{ email: 'Invalid format', password: 'Too weak' }"
/>

<!-- With retry -->
<ErrorMessage
  error="Failed to load data"
  :retryable="true"
  @retry="fetchData"
/>
```

---

## Importing Components

### Individual Import
```vue
<script setup>
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
</script>
```

### Bulk Import
```vue
<script setup>
import { Button, Input, Select, Modal } from '@/components/common'
</script>
```

## Accessibility Features

All components include:
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Semantic HTML structure

## Requirements Coverage

These components fulfill the following requirements from the spec:

- **Requirement 12.1**: Visual feedback with loading spinners and success/error toasts
- **Requirement 12.2**: Skeleton loaders for loading states
- **Requirement 12.3**: User-friendly error messages with ErrorMessage component
- **Requirement 12.4**: Disabled states during submissions to prevent double submission
- **Requirement 12.6**: Hover effects and cursor changes on interactive elements
- **Requirement 12.7**: Form validation error messages displayed below inputs
- **Requirement 13.1-13.8**: Comprehensive accessibility features

## Styling

All components use Tailwind CSS utility classes for styling. The color scheme follows the default Tailwind palette with primary (blue), secondary (gray), danger (red), and success (green) variants.

Custom animations are defined in component-scoped styles where needed (Toast, Modal, SkeletonLoader).
