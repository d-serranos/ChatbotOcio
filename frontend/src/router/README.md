# Vue Router Configuration

This directory contains the Vue Router configuration for the ChatbotOcio frontend application.

## Files

### `index.js`
Main router configuration file that defines all application routes and navigation guards.

## Routes

### Public Routes (No Authentication Required)

- **`/` (Home/Chat)** - Main landing page and chat interface
  - Alias: `/chat`
  - Component: `HomeView.vue`
  - Meta: `{ title: 'ChatbotOcio - Home' }`

- **`/catalog/movies`** - Public movie catalog browser
  - Component: `CatalogMoviesView.vue`
  - Meta: `{ title: 'Movies - ChatbotOcio' }`

- **`/catalog/videogames`** - Public videogame catalog browser
  - Component: `CatalogVideogamesView.vue`
  - Meta: `{ title: 'Videogames - ChatbotOcio' }`

### Guest Routes (Unauthenticated Users Only)

- **`/login`** - User login page
  - Component: `LoginView.vue`
  - Meta: `{ guest: true, title: 'Login - ChatbotOcio' }`
  - Authenticated users are redirected to home

- **`/register`** - User registration page
  - Component: `RegisterView.vue`
  - Meta: `{ guest: true, title: 'Register - ChatbotOcio' }`
  - Authenticated users are redirected to home

### Protected Routes (Authentication Required)

All admin routes require both authentication and admin role.

- **`/admin`** - Admin dashboard overview
  - Component: `AdminDashboardView.vue`
  - Meta: `{ requiresAuth: true, requiresAdmin: true, title: 'Admin Dashboard - ChatbotOcio' }`

- **`/admin/movies`** - Movie management interface
  - Component: `AdminMoviesView.vue`
  - Meta: `{ requiresAuth: true, requiresAdmin: true, title: 'Manage Movies - ChatbotOcio' }`

- **`/admin/videogames`** - Videogame management interface
  - Component: `AdminVideogamesView.vue`
  - Meta: `{ requiresAuth: true, requiresAdmin: true, title: 'Manage Videogames - ChatbotOcio' }`

- **`/admin/statistics`** - Token consumption and usage statistics
  - Component: `AdminStatisticsView.vue`
  - Meta: `{ requiresAuth: true, requiresAdmin: true, title: 'Statistics - ChatbotOcio' }`

### Catch-All Route

- **`/:pathMatch(.*)*`** - Catches all undefined routes
  - Redirects to: `/` (home)

## Navigation Guards

### `router.beforeEach`

The global navigation guard performs the following checks:

1. **Document Title**: Sets `document.title` from route meta
2. **Authentication Check**: 
   - If route has `meta.requiresAuth` and user is not authenticated
   - Redirects to `/login` with `query.redirect` parameter containing the original destination
3. **Authorization Check**:
   - If route has `meta.requiresAdmin` and user is not an admin
   - Redirects to `/` (home) with `query.error='admin_required'`
4. **Guest Route Protection**:
   - If route has `meta.guest` and user is authenticated
   - Redirects to `/` (home)

### Guard Flow Diagram

```
Route Navigation
      ↓
Set Document Title
      ↓
Is requiresAuth? ──No──→ Continue
      ↓ Yes
Is Authenticated? ──No──→ Redirect to /login?redirect=targetPath
      ↓ Yes
Is requiresAdmin? ──No──→ Continue
      ↓ Yes
Is Admin? ──No──→ Redirect to /?error=admin_required
      ↓ Yes
Is guest route? ──No──→ Continue
      ↓ Yes
Is Authenticated? ──Yes──→ Redirect to /
      ↓ No
Continue Navigation
```

## Router Configuration

- **History Mode**: `createWebHistory` (HTML5 history mode)
- **Base URL**: `import.meta.env.BASE_URL` (from Vite config)
- **Lazy Loading**: All views are lazy-loaded using dynamic imports for optimal performance

## Authentication Integration

The router integrates with the Pinia auth store (`useAuthStore`):

- **`authStore.isAuthenticated`**: Checks if user has valid token
- **`authStore.isAdmin`**: Checks if user has admin role

## Usage Examples

### Programmatic Navigation

```javascript
import { useRouter } from 'vue-router'

const router = useRouter()

// Navigate to a route
router.push('/catalog/movies')

// Navigate with query parameters
router.push({ 
  name: 'catalog-movies', 
  query: { genre: 'Action' } 
})

// Navigate to admin route (will redirect to login if not authenticated)
router.push('/admin/movies')
```

### Router Link in Templates

```vue
<template>
  <!-- Basic navigation -->
  <router-link to="/">Home</router-link>
  
  <!-- Named route -->
  <router-link :to="{ name: 'catalog-movies' }">Movies</router-link>
  
  <!-- With query parameters -->
  <router-link :to="{ name: 'admin-movies', query: { page: 2 } }">
    Manage Movies
  </router-link>
</template>
```

### Checking Route Meta in Components

```vue
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

// Check if current route requires authentication
const requiresAuth = route.meta.requiresAuth

// Check if current route requires admin
const requiresAdmin = route.meta.requiresAdmin
</script>
```

## Testing

### Manual Testing

1. **Test Public Routes**: Navigate to `/`, `/catalog/movies`, `/catalog/videogames`
2. **Test Guest Routes**: Navigate to `/login`, `/register`
3. **Test Protected Routes**: Navigate to `/admin` (should redirect to login)
4. **Test Admin Guard**: 
   - Login as regular user
   - Try to access `/admin` (should redirect to home with error)
5. **Test Return URL**: 
   - Try to access `/admin/movies` while logged out
   - Should redirect to `/login?redirect=/admin/movies`
   - After login, should redirect back to `/admin/movies`

### Using Browser Console

The router test utilities are loaded in development mode:

```javascript
// Simulate user login
window.routerTest.simulateUserLogin()

// Simulate admin login
window.routerTest.simulateAdminLogin()

// Simulate logout
window.routerTest.simulateLogout()

// Test routes
window.routerTest.testPublicRoutes()
window.routerTest.testAdminRoutes()
```

## Requirements Satisfied

This router configuration satisfies the following requirements from the spec:

- ✅ **Requirement 1.8**: Application SHALL use Vue Router with history mode
- ✅ **Requirement 3.1**: Route Guard SHALL check authentication status before navigating to Protected_Route
- ✅ **Requirement 3.2**: Anonymous_User attempting to access Protected_Route SHALL be redirected to /login with return URL
- ✅ **Requirement 3.3**: Authenticated_User accessing Protected_Route SHALL be allowed navigation
- ✅ **Requirement 3.4**: Non-admin user attempting to access Admin_Route SHALL be redirected to home with error message
- ✅ **Requirement 3.5**: Admin user accessing Admin_Route SHALL be allowed navigation
- ✅ **Requirement 3.6**: User logging out from Protected_Route SHALL be redirected to login page
- ✅ **Requirement 3.7**: JWT token expiration SHALL be detected and redirect to login (implemented in authStore.checkAuth)

## Future Enhancements

The following features will be added in later implementation phases:

1. **Toast Notifications**: Show error messages for authorization failures
2. **Loading States**: Show loading indicator during route transitions
3. **Route Transitions**: Add smooth animations between page transitions
4. **Breadcrumbs**: Add breadcrumb navigation for admin pages
5. **404 Page**: Create a proper 404 page instead of redirecting to home
