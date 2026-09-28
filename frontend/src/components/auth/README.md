# Authentication Components

This directory contains Vue 3 components for user authentication in the ChatbotOcio application.

## Components

### LoginForm.vue

A form component for user login with email and password fields.

**Props:**
- `loading` (Boolean, default: `false`) - Indicates if login request is in progress

**Events:**
- `submit(credentials)` - Emitted when form is valid and submitted
  - `credentials.correo` - User email
  - `credentials.contrasena` - User password

**Features:**
- Email validation (format check)
- Required field validation
- "Remember me" checkbox
- "Forgot password" link (placeholder)
- Disabled state during loading
- Real-time error display

**Usage:**
```vue
<LoginForm 
  :loading="loading"
  @submit="handleLogin"
/>
```

---

### RegisterForm.vue

A form component for new user registration with validation and password strength indicator.

**Props:**
- `loading` (Boolean, default: `false`) - Indicates if registration request is in progress

**Events:**
- `submit(userData)` - Emitted when form is valid and submitted
  - `userData.nombre` - User's full name
  - `userData.correo` - User email
  - `userData.contrasena` - User password

**Features:**
- Name validation (min 2 characters)
- Email validation (format check)
- Password strength indicator with visual feedback
- Password confirmation matching
- Terms and conditions acceptance checkbox
- Real-time validation and error display
- Disabled state during loading

**Password Strength Levels:**
- Very Weak (0) - Less than 8 characters
- Weak (1) - 8+ characters
- Fair (2) - 12+ characters or mixed case
- Good (3) - Mixed case + numbers
- Strong (4) - Mixed case + numbers + special characters

**Usage:**
```vue
<RegisterForm 
  :loading="loading"
  @submit="handleRegister"
/>
```

---

### UserMenu.vue

A dropdown menu component showing user information and navigation options.

**Features:**
- User avatar with initials
- User name and email display
- Role badge (Admin/User) with visual distinction
- Dropdown menu with navigation links:
  - Profile (placeholder)
  - Settings (placeholder)
  - Admin Dashboard (visible only to admins)
  - Sign out
- Responsive design (collapsed on mobile)
- Click outside to close
- Escape key to close
- Smooth transitions

**Usage:**
```vue
<UserMenu />
```

The component automatically reads user data from the auth store and handles logout functionality.

**Admin Features:**
- Purple badge for admin users
- "Admin Dashboard" link visible only to admins
- Admin shield icon

**User Features:**
- Blue badge for regular users
- Standard user icon

---

## Dependencies

All components use:
- `@/components/common/Input.vue` - Styled input component
- `@/components/common/Button.vue` - Styled button component
- `@/stores/auth` - Pinia authentication store

## Validation Rules

### Email
- Must not be empty
- Must match email format regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Password (Login)
- Must not be empty

### Password (Registration)
- Must not be empty
- Must be at least 8 characters long
- Strength calculated based on:
  - Length (8+, 12+)
  - Character variety (lowercase, uppercase, numbers, special characters)

### Name (Registration)
- Must not be empty
- Must be at least 2 characters long

### Terms Acceptance (Registration)
- Must be checked

## Styling

All components use Tailwind CSS utility classes and follow the application's design system:
- Primary color: Blue (600-700)
- Error color: Red (500-600)
- Success color: Green (500-600)
- Text colors: Gray scale (500-900)
- Rounded corners: `rounded-lg`
- Transitions: 200ms duration
- Focus rings: 2px with primary color

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Error messages associated with inputs
- Semantic HTML

## Related Files

- `/src/views/LoginView.vue` - Uses LoginForm
- `/src/views/RegisterView.vue` - Uses RegisterForm
- `/src/components/layout/NavigationBar.vue` - Uses UserMenu
- `/src/stores/auth.js` - Authentication state management
- `/src/services/auth.service.js` - Authentication API calls
