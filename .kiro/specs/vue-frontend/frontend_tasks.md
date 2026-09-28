# Implementation Plan: Vue.js 3 Frontend

## Overview

This implementation plan breaks down the Vue.js 3 Frontend feature into discrete coding tasks. The system provides a modern single-page application (SPA) with JWT-based authentication, role-based UI, real-time chat interface, public catalog browsing, and administrative dashboard for content management and analytics.

The implementation follows a layered architecture: API client configuration, Pinia stores for state management, Vue Router for navigation, reusable components, and view compositions. Each task builds incrementally on previous work, with checkpoints to validate functionality.

**Key Technologies:**
- Vue 3.4+ with Composition API and `<script setup>`
- Vite 5+ for fast development and optimized builds
- Pinia 2+ for reactive global state
- Vue Router 4+ with navigation guards
- Axios 1.6+ with interceptors
- Tailwind CSS 3.4+ for utility-first styling
- Heroicons for consistent iconography

## Tasks

### FASE 1: Setup & Configuration

- [x] 1. Initialize Vue 3 project with Vite
  - Create frontend/ directory in project root
  - Run `npm create vite@latest . -- --template vue` inside frontend/
  - Install core dependencies: `npm install vue-router@4 pinia@2 axios@1`
  - Install UI dependencies: `npm install @heroicons/vue@2 jwt-decode@4 chart.js@4`
  - Install dev dependencies: `npm install -D tailwindcss@3 postcss autoprefixer @tailwindcss/forms`
  - Configure package.json scripts: dev, build, preview, lint, format
  - Create .env.example with VITE_API_BASE_URL=http://localhost:8000
  - Create .gitignore (include .env, node_modules/, dist/)
  - Setup jsconfig.json with path aliases (@/ pointing to src/)
  - _Requirements: 1.1, 1.2, 1.3, 14.1, 14.6_

- [x] 2. Configure Tailwind CSS
  - Run `npx tailwindcss init -p` to create tailwind.config.js and postcss.config.js
  - Configure tailwind.config.js content paths: "./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"
  - Extend Tailwind theme with custom colors (primary, secondary scales)
  - Extend theme with custom font family (Inter)
  - Extend theme with custom spacing and border radius
  - Add @tailwindcss/forms plugin
  - Create src/assets/styles/main.css with @tailwind directives
  - Add custom @layer base, components, and utilities
  - Import main.css in src/main.js
  - _Requirements: 1.6, 11.1_

- [x] 3. Configure development tools
  - Install ESLint: `npm install -D eslint eslint-plugin-vue`
  - Create .eslintrc.js with Vue 3 recommended rules
  - Install Prettier: `npm install -D prettier`
  - Create .prettierrc with Vue formatting rules
  - Configure vite.config.js with @vitejs/plugin-vue
  - Add path resolver plugin for @/ alias
  - Configure development server port (5173)
  - Add proxy configuration for /api to backend
  - Create vitest.config.js (optional for future testing)
  - _Requirements: Non-functional requirement 4_

- [x] 4. Checkpoint - Verify project setup
  - Ensure `npm run dev` starts development server
  - Ensure Tailwind CSS classes work
  - Ensure path aliases (@/) work
  - Ask the user if questions arise

### FASE 2: Core Infrastructure

- [x] 5. Implement API client with Axios
  - Create src/services/api.js
  - Initialize Axios instance with baseURL from import.meta.env.VITE_API_BASE_URL
  - Set default headers: Content-Type: application/json
  - Set timeout to 30000ms (30 seconds)
  - Create request interceptor to add JWT token from authStore
  - Create response interceptor to handle 401 (logout and redirect)
  - Handle 403 (show "Permission denied" toast)
  - Handle 422 (parse validation errors)
  - Handle 500/502/503/504 (show generic error toast)
  - Handle network errors (show "Unable to connect" toast)
  - Prevent multiple redirects to login (use flag)
  - Export configured apiClient
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [x] 6. Create Pinia stores structure
  - Create src/stores/index.js with createPinia()
  - Create src/stores/auth.js with authStore skeleton
  - Define state: user (null), token (null), loading (false), initialized (false)
  - Define getters: isAuthenticated, isAdmin, currentUser, userName
  - Define actions: login, register, logout, setAuth, checkAuth
  - Create src/stores/catalog.js with catalogStore skeleton
  - Define state: movies ([]), videogames ([]), caches ({}), pagination, loading
  - Create src/stores/chat.js with chatStore skeleton
  - Define state: messages ([]), conversationId (null), loading (false)
  - Create src/stores/toast.js with toastStore skeleton
  - Define state: toasts ([])
  - Define actions: show, remove, success, error, warning, info
  - _Requirements: 10.1, 10.8, 10.9_

- [x] 7. Setup Vue Router
  - Create src/router/index.js with createRouter and createWebHistory
  - Define route for / (HomeView/ChatView)
  - Define route for /login (LoginView) with meta: { guest: true }
  - Define route for /register (RegisterView) with meta: { guest: true }
  - Define route for /catalog/movies (CatalogMoviesView)
  - Define route for /catalog/videogames (CatalogVideogamesView)
  - Define route for /admin (AdminDashboardView) with meta: { requiresAuth: true, requiresAdmin: true }
  - Define route for /admin/movies (AdminMoviesView) with meta: { requiresAuth: true, requiresAdmin: true }
  - Define route for /admin/videogames (AdminVideogamesView) with meta: { requiresAuth: true, requiresAdmin: true }
  - Define route for /admin/statistics (AdminStatisticsView) with meta: { requiresAuth: true, requiresAdmin: true }
  - Add catch-all route (404 redirect to /)
  - Create beforeEach navigation guard to check requiresAuth and requiresAdmin
  - Redirect unauthenticated users to /login with return URL
  - Redirect non-admin users to / with error message
  - Redirect authenticated users away from guest pages
  - Set document.title from route meta
  - _Requirements: 1.8, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 8. Create base composables
  - Create src/composables/useAuth.js
  - Expose isAuthenticated, isAdmin, currentUser, userName computed properties
  - Expose login, register, logout methods
  - Create src/composables/useToast.js
  - Expose showToast, success, error, warning, info methods
  - Create src/composables/useForm.js
  - Provide errors reactive object, submitting ref
  - Provide validate, clearErrors, setError methods
  - Create src/composables/useModal.js
  - Provide showModal ref, openModal, closeModal, toggleModal methods
  - Create src/composables/usePagination.js
  - Provide currentPage, totalPages, hasNextPage, hasPreviousPage
  - Provide goToPage, nextPage, previousPage, handlePageChange methods
  - Create src/composables/useDebounce.js
  - Return debounced function with configurable delay
  - _Requirements: Various reusable logic patterns_

- [x] 9. Create common components
  - Create src/components/common/Button.vue
  - Props: variant (primary/secondary/danger/ghost), size (sm/md/lg), disabled
  - Apply Tailwind classes based on variant and size
  - Create src/components/common/Input.vue
  - Props: modelValue, label, type, placeholder, error, required
  - Emit update:modelValue
  - Show error message below input
  - Create src/components/common/Select.vue
  - Props: modelValue, label, options, placeholder, error
  - Emit update:modelValue
  - Create src/components/common/Modal.vue
  - Props: title, size (sm/md/lg/xl)
  - Emit close event
  - Implement backdrop click to close
  - Add close button with X icon
  - Trap focus inside modal
  - Create src/components/common/Toast.vue
  - Props: message, type (success/error/warning/info), duration
  - Emit close event
  - Auto-close after duration
  - Show appropriate icon (CheckCircle, XCircle, ExclamationCircle, InformationCircle)
  - Apply type-based color classes
  - Add slide-in animation
  - Create src/components/common/LoadingSpinner.vue
  - Show animated spinning circle
  - Create src/components/common/SkeletonLoader.vue
  - Show pulsing gray boxes as placeholder
  - Create src/components/common/ConfirmDialog.vue
  - Props: title, message, confirmText, cancelText
  - Emit confirm and cancel events
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 10. Checkpoint - Verify core infrastructure
  - Ensure API client is configured
  - Ensure Pinia stores are registered
  - Ensure Vue Router navigation works
  - Ensure common components render
  - Ask the user if questions arise

### FASE 3: Authentication

- [x] 11. Implement authentication services
  - Create src/services/auth.service.js
  - Import apiClient from services/api.js
  - Implement async register(userData) method
  - Send POST /auth/register with { nombre, correo, contrasena }
  - Return response.data (JWT token response)
  - Implement async login(credentials) method
  - Send POST /auth/login with { correo, contrasena }
  - Return response.data (JWT token response)
  - Add error handling (let interceptor handle it)
  - Export authService object with methods
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 12. Complete authStore implementation
  - Import authService and jwtDecode in stores/auth.js
  - Implement login(credentials) action
  - Set loading = true
  - Call authService.login(credentials)
  - Call setAuth(response.access_token)
  - Set loading = false in finally block
  - Implement register(userData) action (similar to login)
  - Implement logout() action
  - Set user = null, token = null
  - Remove 'auth_token' and 'auth_user' from localStorage
  - Implement setAuth(token) action
  - Store token in state
  - Decode JWT using jwtDecode to extract user data
  - Extract sub (id_usuario) and role from decoded token
  - Store token and user in localStorage
  - Implement checkAuth() action
  - Attempt to restore token and user from localStorage
  - Verify token hasn't expired (check exp claim)
  - If expired, call logout()
  - Set initialized = true
  - _Requirements: 10.2, 10.3, 10.4, 10.10_

- [x] 13. Create authentication components
  - Create src/components/auth/LoginForm.vue
  - Props: loading
  - Emit submit(credentials) event
  - Create form with email and password inputs
  - Add form validation (required fields, email format)
  - Disable submit button when loading
  - Use Input component from common
  - Create src/components/auth/RegisterForm.vue
  - Props: loading
  - Emit submit(userData) event
  - Create form with name, email, password, confirmPassword
  - Add form validation (password min 8 chars, passwords match)
  - Add password strength indicator
  - Create src/components/auth/UserMenu.vue
  - Show user name from authStore
  - Show role badge (admin/user)
  - Add logout button
  - Use dropdown menu pattern
  - _Requirements: 2.1, 2.5, 2.9_

- [x] 14. Create authentication views
  - Create src/views/LoginView.vue
  - Import LoginForm component
  - Use useAuthStore and useToast composables
  - Handle form submit: call authStore.login(credentials)
  - On success: show success toast, redirect to home or previous page
  - On error: show error toast with message
  - Add "Create account" link to /register
  - Create src/views/RegisterView.vue
  - Import RegisterForm component
  - Handle form submit: call authStore.register(userData)
  - On success: automatically log in and redirect to home
  - On error: show error toast (e.g., "Email already registered")
  - Add "Sign in" link to /login
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 15. Checkpoint - Test authentication flow
  - Ensure registration works and stores token
  - Ensure login works and stores token
  - Ensure logout clears token and redirects
  - Ensure token restoration works on page refresh
  - Ask the user if questions arise

### FASE 4: Layout & Navigation

- [x] 16. Create layout components
  - Create src/components/layout/NavigationBar.vue
  - Show logo/brand on left
  - Show navigation links: Home, Movies, Videogames
  - Show UserMenu on right when authenticated
  - Show Login/Register buttons when not authenticated
  - Implement responsive hamburger menu for mobile (< 768px)
  - Highlight active route using router.currentRoute
  - Use Tailwind responsive classes (hidden md:flex)
  - Create src/components/layout/Sidebar.vue
  - Show admin navigation links: Dashboard, Movies, Videogames, Statistics
  - Highlight active route
  - Use vertical layout
  - Create src/components/layout/Footer.vue (optional)
  - Show copyright and links
  - _Requirements: 11.2, 12.11_

- [x] 17. Create App.vue and main.js
  - Update src/App.vue
  - Add <router-view> wrapped in conditional (authStore.initialized)
  - Show LoadingSpinner while !authStore.initialized
  - Add Toast notifications container (fixed top-right)
  - Render Toast component for each toast in toastStore
  - Import global CSS (assets/styles/main.css)
  - Update src/main.js
  - Import createApp from vue
  - Import createPinia from pinia
  - Import App from App.vue
  - Import router from router/index.js
  - Import useAuthStore
  - Create app instance
  - Use Pinia plugin
  - Use Router plugin
  - Call authStore.checkAuth() before mounting
  - Mount app to #app
  - _Requirements: 1.7, 10.9, 12.1_

- [~] 18. Checkpoint - Test navigation and layout
  - Ensure navigation bar shows correct links
  - Ensure hamburger menu works on mobile
  - Ensure user menu shows when authenticated
  - Ensure layout is responsive
  - Ask the user if questions arise

### FASE 5: Chat Interface

- [x] 19. Implement chat services
  - Create src/services/chat.service.js
  - Import apiClient
  - Implement async sendMessage(message) method
  - Send POST /chat with { message } body
  - Token automatically added by interceptor
  - Return response.data (ChatResponse)
  - Let interceptor handle 503, 504 errors
  - Export chatService object
  - _Requirements: 5.1, 5.2, 5.5, 5.6, 5.7_

- [x] 20. Complete chatStore implementation
  - Import chatService in stores/chat.js
  - Implement async sendMessage(content) action
  - Create user message object: { rol: 'user', contenido: content, fecha: new Date().toISOString() }
  - Push user message to messages array (optimistic update)
  - Set loading = true
  - Call chatService.sendMessage(content)
  - Create assistant message object: { rol: 'assistant', contenido: response.response, fecha: new Date().toISOString() }
  - Push assistant message to messages array
  - Store conversationId from response
  - On error: remove user message (messages.pop())
  - Set loading = false in finally block
  - Implement clearMessages() action
  - Reset messages = [] and conversationId = null
  - _Requirements: 4.4, 4.5, 4.6, 4.7, 4.8_

- [x] 21. Create chat components
  - Create src/components/chat/ChatMessage.vue
  - Props: message ({ rol, contenido, fecha })
  - Align user messages to right with blue background
  - Align assistant messages to left with gray background
  - Display formatted timestamp (formatTime utility)
  - Render URLs as clickable links (linkifyText utility)
  - Create src/components/chat/ChatInput.vue
  - Props: disabled
  - Emit send(message) event
  - Create textarea with v-model for message
  - Set maxlength to 10000
  - Show character count below textarea
  - Handle Enter key to send (without Shift)
  - Handle Shift+Enter to insert newline
  - Auto-resize textarea based on content
  - Disable send button when message is empty or disabled
  - Show LoadingSpinner in button when disabled
  - Clear input after sending
  - Create src/components/chat/ChatHistory.vue
  - Props: messages (array)
  - Render ChatMessage for each message
  - Implement auto-scroll to bottom on new message
  - Use ref to access scrollable container
  - Watch messages array and scroll on change
  - Create src/components/chat/TypingIndicator.vue
  - Show animated "..." dots
  - Create src/components/chat/WelcomeMessage.vue
  - Show welcome text explaining chatbot capabilities
  - Display only when messages.length === 0
  - _Requirements: 4.1, 4.3, 4.9, 4.10, 4.11, 4.12, 4.13_

- [x] 22. Create ChatView
  - Create src/views/ChatView.vue (or HomeView.vue as alias)
  - Import chat components and useChatStore
  - Use computed to get messages and loading from chatStore
  - Render WelcomeMessage when no messages
  - Render ChatHistory with messages
  - Render ChatInput at bottom
  - Handle send event: call chatStore.sendMessage(message)
  - Catch errors and show toast
  - Validate message max length (10000 chars)
  - Show inline error for validation failures
  - Use flex column layout with flex-1 for history
  - Clear history on component unmount (optional behavior)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

- [x] 23. Checkpoint - Test chat interface
  - Ensure messages are sent and displayed
  - Ensure assistant responses appear
  - Ensure auto-scroll works
  - Ensure loading indicator shows
  - Ask the user if questions arise

### FASE 6: Public Catalog

- [x] 24. Implement media services
  - Create src/services/media.service.js
  - Import apiClient
  - Implement async getMovies(params = {}) method
  - Send GET /movies with query params
  - Return response.data
  - Implement async getVideogames(params = {}) method
  - Send GET /videogames with query params
  - Return response.data
  - Implement async getMovie(id) method
  - Send GET /movies/{id}
  - Return response.data
  - Implement async getVideogame(id) method
  - Send GET /videogames/{id}
  - Return response.data
  - Export mediaService object
  - _Requirements: 5.3_

- [x] 25. Complete catalogStore (public methods)
  - Import mediaService in stores/catalog.js
  - Define CACHE_DURATION constant (5 minutes = 5 * 60 * 1000)
  - Implement async fetchMovies(params = {}) action
  - Create cache key from JSON.stringify(params)
  - Check moviesCache for valid cached data
  - If cached and not expired, return cached data
  - Set loading = true
  - Call mediaService.getMovies(params)
  - Store response in movies array
  - Update moviesPagination (currentPage, totalPages, totalItems)
  - Cache response with timestamp
  - Set loading = false in finally block
  - Implement async fetchVideogames(params = {}) action (similar logic)
  - Update videogames array and videogamesPagination
  - Cache in videogamesCache
  - _Requirements: 10.5, 10.6_

- [x] 26. Create catalog components
  - Create src/components/catalog/MovieCard.vue
  - Props: movie (object)
  - Emit click event
  - Display movie information in card format
  - Display title, genre, year, platform, rating
  - Add hover scale effect (hover:scale-105)
  - Use cursor-pointer
  - Create src/components/catalog/VideogameCard.vue
  - Similar to MovieCard but with videogame fields
  - Display classification, developer, players
  - Create src/components/catalog/MediaGrid.vue
  - Use CSS Grid with responsive columns
  - 1 column on mobile, 2-3 on tablet, 4+ on desktop
  - Use Tailwind grid classes: grid-cols-1 md:grid-cols-3 lg:grid-cols-4
  - Create src/components/catalog/MediaFilters.vue
  - Props: genres, platforms, years (arrays)
  - Emit filter(filters) event
  - Render Select components for genre, platform, year
  - Add "Clear Filters" button
  - Create src/components/catalog/MediaDetail.vue
  - Props: media (movie or videogame object)
  - Emit close event
  - Use Modal component to display full details
  - Show all fields in organized layout
  - Create src/components/catalog/Pagination.vue
  - Props: currentPage, totalPages
  - Emit change(page) event
  - Show Previous/Next buttons
  - Show page numbers (with ellipsis for many pages)
  - Disable Previous on page 1, disable Next on last page
  - _Requirements: 5.1, 5.2, 5.6, 5.7, 5.8_

- [x] 27. Create CatalogMoviesView
  - Create src/views/CatalogMoviesView.vue
  - Import catalog components and useCatalogStore
  - Initialize filters ref: { genero: null, plataforma: null, anio_lanzamiento: null }
  - Initialize selectedMovie ref for detail modal
  - Get movies from catalogStore computed
  - Implement fetchMovies() method
  - Call catalogStore.fetchMovies({ ...filters, page: currentPage })
  - Handle errors with toast
  - Implement handleFilter(newFilters) method
  - Update filters ref
  - Reset currentPage to 1
  - Call fetchMovies()
  - Implement handlePageChange(page) method
  - Update currentPage
  - Call fetchMovies()
  - Implement showDetail(movie) method
  - Set selectedMovie = movie
  - Render MediaFilters with computed unique values (genres, platforms, years)
  - Render SkeletonLoader when loading
  - Render MediaGrid with MovieCard components when loaded
  - Render "No movies found" message when empty
  - Render Pagination when totalPages > 1
  - Render MediaDetail modal when selectedMovie exists
  - Call fetchMovies() on mount
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_

- [x] 28. Create CatalogVideogamesView
  - Create src/views/CatalogVideogamesView.vue
  - Similar structure to CatalogMoviesView
  - Use videogame-specific filters (genero, plataforma, clasificacion)
  - Use VideogameCard component
  - Call catalogStore.fetchVideogames()
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_

- [~] 29. Checkpoint - Test public catalog
  - Ensure movies and videogames load
  - Ensure filters work
  - Ensure pagination works
  - Ensure detail modal opens
  - Ask the user if questions arise

### FASE 7: Admin Dashboard - Statistics

- [x] 30. Implement statistics services
  - Create src/services/statistics.service.js
  - Import apiClient
  - Implement async getStatistics(params = {}) method
  - Send GET /statistics with query params (start_date, end_date)
  - Token automatically added by interceptor
  - Return response.data
  - Export statisticsService object
  - _Requirements: 6.2, 6.5_

- [x] 31. Create admin statistics components
  - Create src/components/admin/StatsChart.vue
  - Props: data (array), type (line/bar), loading
  - Install Chart.js if not already: `npm install chart.js`
  - Import Chart and registerables from chart.js
  - Create canvas element with ref
  - Initialize Chart instance on mount
  - Render line chart with daily_stats data
  - Show two datasets: total_tokens (blue) and message_count (green)
  - Use dual Y-axes (tokens on left, messages on right)
  - Destroy chart on unmount
  - Update chart when data changes
  - Create src/components/admin/StatsSummary.vue
  - Props: title, value, icon
  - Display card with icon, title, and large value
  - Use Tailwind card styling
  - Create src/components/admin/UserStatsTable.vue
  - Props: users (array), loading
  - Display table with columns: User, Messages, Total Tokens
  - Show LoadingSpinner when loading
  - Show "No data" message when empty
  - Create src/components/admin/DateRangePicker.vue
  - Props: modelValue (object with start and end dates)
  - Emit update:modelValue event
  - Create two date inputs for start and end
  - Validate end date is not before start date
  - Add "Apply" button to trigger change event
  - _Requirements: 6.3, 6.4, 6.8_

- [x] 32. Create AdminStatisticsView
  - Create src/views/AdminStatisticsView.vue
  - Import statistics components and statisticsService
  - Initialize dateRange ref with last 30 days
  - Initialize stats ref for storing statistics data
  - Initialize loading ref
  - Implement async fetchStatistics() method
  - Set loading = true
  - Call statisticsService.getStatistics({ start_date, end_date })
  - Store response in stats ref
  - Handle errors with toast
  - Set loading = false in finally block
  - Implement handleDateChange() method
  - Call fetchStatistics() with new date range
  - Render NavigationBar and Sidebar
  - Render DateRangePicker at top
  - Render three StatsSummary cards: Total Tokens, Total Messages, Active Users
  - Extract totals from stats.daily_stats (sum of total_tokens, message_count)
  - Extract unique user count from stats.user_stats
  - Render StatsChart with stats.daily_stats
  - Render UserStatsTable with stats.user_stats
  - Show "No data available" message when stats is empty
  - Call fetchStatistics() on mount
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_

- [~] 33. Checkpoint - Test statistics dashboard
  - Ensure statistics load with default date range
  - Ensure date range picker updates data
  - Ensure chart displays correctly
  - Ensure user stats table displays
  - Ask the user if questions arise

### FASE 8: Admin Dashboard - Movie Management

- [x] 34. Implement admin media services
  - Update src/services/media.service.js
  - Add async getMoviesAdmin(params = {}) method
  - Send GET /movies with params and auth token
  - Return response.data
  - Add async createMovie(movieData) method
  - Send POST /movies with movieData and auth token
  - Return response.data
  - Add async updateMovie(id, movieData) method
  - Send PUT /movies/{id} with movieData
  - Return response.data
  - Add async deleteMovie(id) method
  - Send DELETE /movies/{id}
  - No return value (204 status)
  - Add similar methods for videogames: getVideogamesAdmin, createVideogame, updateVideogame, deleteVideogame
  - _Requirements: 7.2, 7.4, 7.8, 7.11_

- [x] 35. Complete catalogStore (admin methods)
  - Add async fetchMoviesAdmin(params = {}) action
  - Similar to fetchMovies but without caching
  - Call mediaService.getMoviesAdmin(params)
  - Add async createMovie(movieData) action
  - Call mediaService.createMovie(movieData)
  - Clear moviesCache (invalidate cache)
  - Return response
  - Add async updateMovie(id, movieData) action
  - Call mediaService.updateMovie(id, movieData)
  - Clear moviesCache
  - Return response
  - Add async deleteMovie(id) action
  - Call mediaService.deleteMovie(id)
  - Clear moviesCache
  - Add similar actions for videogames
  - _Requirements: 10.6, 10.7_

- [x] 36. Create admin movie components
  - Create src/components/admin/DataTable.vue (reusable)
  - Props: columns (array), data (array), loading
  - Emit edit(item), delete(item), sort(column) events
  - Render table with thead and tbody
  - Render column headers from columns array
  - Add sort button if column.sortable
  - Render rows with data
  - Render "actions" column with Edit and Delete buttons
  - Show LoadingSpinner when loading
  - Show "No data available" when empty
  - Make table horizontally scrollable on mobile
  - Create src/components/admin/MovieForm.vue
  - Props: movie (object or null), mode (create/edit)
  - Emit submit(movieData), cancel events
  - Create reactive formData object with all movie fields
  - Initialize formData with movie prop if mode is 'edit'
  - Use useForm composable for validation
  - Create form with Input components for all fields
  - Validate titulo (required, max 200 chars)
  - Validate anio_lanzamiento (required, 1888 to current year + 5)
  - Validate calificacion (0-10 range)
  - Validate duracion_minutos (1-1000 range)
  - Validate actores (max 10 comma-separated names)
  - Show validation errors below fields
  - Disable submit button during submission
  - Handle form submit: validate and emit submit event
  - Add Cancel and Submit buttons
  - _Requirements: 7.3, 7.6, 7.7, 7.15_

- [x] 37. Create validation utilities
  - Create src/utils/validation.js
  - Export validateMovie(data) function
  - Check all required fields
  - Check year range (1888 to current + 5)
  - Check rating range (0-10)
  - Check duration range (1-1000)
  - Check actors count (max 10)
  - Return errors object
  - Export validateVideogame(data) function
  - Check clasificacion enum (E, E10+, T, M, AO, RP)
  - Check jugadores pattern (digit, digit-digit, or digit+)
  - Return errors object
  - Create src/utils/formatters.js
  - Export formatTime(dateString) function
  - Format ISO date to readable time
  - Export linkifyText(text) function
  - Convert URLs in text to anchor tags
  - _Requirements: 7.15, 8.15_

- [x] 38. Create AdminMoviesView
  - Create src/views/AdminMoviesView.vue
  - Import admin components and useCatalogStore
  - Import useModal and useDebounce composables
  - Initialize searchQuery ref
  - Initialize selectedMovie ref for edit modal
  - Initialize formMode ref ('create' or 'edit')
  - Initialize showConfirmDialog ref
  - Initialize movieToDelete ref
  - Initialize currentPage ref
  - Get movies and pagination from catalogStore computed
  - Define columns array for DataTable
  - Implement async fetchMovies() method
  - Call catalogStore.fetchMoviesAdmin({ page: currentPage, search: searchQuery })
  - Handle errors with toast
  - Implement handleSearch() method (debounced)
  - Reset currentPage to 1
  - Call fetchMovies()
  - Implement openCreateModal() method
  - Set selectedMovie = null, formMode = 'create'
  - Call openModal()
  - Implement openEditModal(movie) method
  - Set selectedMovie = movie, formMode = 'edit'
  - Call openModal()
  - Implement async handleSubmit(movieData) method
  - If formMode is 'create': call catalogStore.createMovie(movieData)
  - If formMode is 'edit': call catalogStore.updateMovie(selectedMovie.id_pelicula, movieData)
  - Show success toast
  - Close modal
  - Refresh movies list
  - Handle errors with toast
  - Implement confirmDelete(movie) method
  - Set movieToDelete = movie
  - Set showConfirmDialog = true
  - Implement async handleDelete() method
  - Call catalogStore.deleteMovie(movieToDelete.id_pelicula)
  - Show success toast
  - Close confirm dialog
  - Refresh movies list
  - Implement handlePageChange(page) method
  - Update currentPage
  - Call fetchMovies()
  - Render NavigationBar and Sidebar
  - Render page header with "Manage Movies" title and "Add Movie" button
  - Render search Input with handleSearch
  - Render DataTable with movies, columns, loading
  - Render Pagination
  - Render Modal with MovieForm when showModal is true
  - Render ConfirmDialog when showConfirmDialog is true
  - Call fetchMovies() on mount
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 7.11, 7.12, 7.13, 7.14, 7.15_

- [~] 39. Checkpoint - Test movie management
  - Ensure movies list loads
  - Ensure search filters movies
  - Ensure create modal opens and creates movie
  - Ensure edit modal opens and updates movie
  - Ensure delete confirmation works
  - Ask the user if questions arise

### FASE 9: Admin Dashboard - Videogame Management

- [x] 40. Create admin videogame components
  - Create src/components/admin/VideogameForm.vue
  - Similar structure to MovieForm
  - Props: videogame (object or null), mode (create/edit)
  - Emit submit(videogameData), cancel events
  - Create reactive formData with videogame fields
  - Use useForm composable for validation
  - Create form with Input and Select components
  - Add Select for clasificacion with options: E, E10+, T, M, AO, RP
  - Validate clasificacion (required, must be in enum)
  - Validate jugadores pattern (e.g., "1", "1-4", "1+")
  - Show validation errors below fields
  - Disable submit button during submission
  - Handle form submit: validate and emit submit event
  - _Requirements: 8.3, 8.6, 8.7, 8.15_

- [x] 41. Create AdminVideogamesView
  - Create src/views/AdminVideogamesView.vue
  - Similar structure to AdminMoviesView
  - Use VideogameForm component instead of MovieForm
  - Define columns array with videogame-specific fields
  - Call catalogStore.fetchVideogamesAdmin(), createVideogame(), updateVideogame(), deleteVideogame()
  - Use id_videojuego for identification
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10, 8.11, 8.12, 8.13, 8.14, 8.15_

- [~] 42. Checkpoint - Test videogame management
  - Ensure videogames list loads
  - Ensure search filters videogames
  - Ensure CRUD operations work
  - Ensure classification dropdown works
  - Ask the user if questions arise

### FASE 10: Admin Dashboard - Overview

- [x] 43. Create AdminDashboardView
  - Create src/views/AdminDashboardView.vue
  - Import layout components and useCatalogStore
  - Initialize stats ref for summary data
  - Implement fetchSummary() method (optional)
  - Calculate totalMovies from catalogStore
  - Calculate totalVideogames from catalogStore
  - Calculate totalUsers (could fetch from statistics endpoint)
  - Render NavigationBar and Sidebar
  - Render page header with "Admin Dashboard" title
  - Render three StatsSummary cards: Total Movies, Total Videogames, Total Users
  - Render "Quick Actions" section with links
  - Add router-link to /admin/movies (Manage Movies)
  - Add router-link to /admin/videogames (Manage Videogames)
  - Add router-link to /admin/statistics (View Statistics)
  - Optionally render "Recent Activity" section
  - Call fetchSummary() on mount
  - _Requirements: Admin dashboard overview_

### FASE 11: Responsive Design

- [-] 44. Implement responsive design
  - Review all views on mobile breakpoint (< 768px)
  - Ensure NavigationBar collapses to hamburger menu
  - Test hamburger menu opens/closes correctly
  - Ensure menu links are vertical and full-width
  - Review ChatView on mobile
  - Ensure ChatInput is full-width
  - Ensure messages are readable
  - Ensure textarea resizes properly
  - Review catalog views on mobile
  - Ensure MediaGrid shows 1 column (grid-cols-1)
  - Ensure MovieCard/VideogameCard are touch-friendly
  - Review catalog views on tablet (768px - 1024px)
  - Ensure MediaGrid shows 2-3 columns (md:grid-cols-3)
  - Review catalog views on desktop (> 1024px)
  - Ensure MediaGrid shows 4+ columns (lg:grid-cols-4)
  - Review admin views on mobile
  - Ensure DataTable is horizontally scrollable (overflow-x-auto)
  - Ensure Sidebar collapses or becomes horizontal tabs
  - Review forms on mobile
  - Ensure Input fields are appropriately sized
  - Ensure tap targets are at least 44x44px
  - Ensure form buttons are full-width or large enough
  - Review modals on mobile
  - Ensure Modal takes full screen on small devices
  - Ensure Modal content is scrollable
  - Test touch interactions
  - Ensure buttons respond to touch
  - Ensure no hover-only interactions block functionality
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10_

### FASE 12: UX Enhancements

- [x] 45. Implement UX enhancements
  - Review all actions for visual feedback
  - Ensure buttons show loading spinner during API calls
  - Ensure successful actions show toast notifications
  - Review all loading states
  - Replace blank spaces with SkeletonLoader components
  - Add skeleton loaders for tables, grids, cards
  - Review all error messages
  - Ensure errors are user-friendly, not technical
  - Provide actionable suggestions (e.g., "Please try again")
  - Review all forms
  - Ensure submit buttons are disabled during submission
  - Prevent double-submission
  - Add page transitions
  - Add CSS transitions for router-view changes
  - Use Transition component with mode="out-in"
  - Add hover effects
  - Ensure buttons have hover:bg-* classes
  - Ensure cards have hover:shadow-lg
  - Change cursor to pointer on interactive elements
  - Review form validation
  - Ensure errors display immediately below input fields
  - Use red text and red border for error state
  - Ensure success messages are visible
  - Review icon usage
  - Ensure consistent icon library (Heroicons)
  - Use icons alongside text for clarity
  - Review color scheme
  - Ensure consistent use of Tailwind theme colors
  - Use primary colors for main actions
  - Use secondary colors for secondary actions
  - Use red for destructive actions
  - Highlight active navigation route
  - Add bg-blue-100 or border-l-4 border-blue-600 to active link
  - Use router.currentRoute to detect active route
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 12.10, 12.11_

### FASE 13: Accessibility

- [x] 46. Implement accessibility features
  - Review all interactive elements for ARIA labels
  - Add aria-label to icon-only buttons
  - Add aria-pressed to toggle buttons
  - Add aria-expanded to expandable sections
  - Review all form inputs
  - Ensure every input has associated label with for/id
  - Use <label for="email">Email</label> and <input id="email">
  - Review focus indicators
  - Ensure focus ring is visible (focus:ring-2 focus:ring-blue-500)
  - Don't remove focus outlines with outline-none without replacement
  - Test keyboard navigation
  - Tab through entire app
  - Ensure logical tab order
  - Ensure all interactive elements are reachable
  - Implement focus trap in modals
  - When modal opens, focus first input
  - Trap Tab key within modal
  - When modal closes, restore focus to trigger element
  - Review all images
  - Add alt text to all img elements
  - Use descriptive alt text (not just "image")
  - Review color usage
  - Don't rely on color alone to convey information
  - Add text labels or icons alongside color
  - Example: Error state uses both red color AND error icon
  - Test keyboard navigation for tab order
  - Ensure tab order follows visual layout
  - Ensure no keyboard traps (except intentional modal trap)
  - Use semantic HTML
  - Use <nav> for navigation
  - Use <main> for main content
  - Use <article> for independent content
  - Use <section> for thematic grouping
  - Add ARIA live regions for errors
  - Use role="alert" for critical errors
  - Use aria-live="polite" for non-critical updates
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_

### FASE 14: Testing & Documentation

- [x] 47. Create documentation
  - Create comprehensive frontend/README.md
  - Add project overview and description
  - Add prerequisites (Node.js 18+, npm 9+)
  - Add setup instructions (npm install, copy .env.example)
  - Document all environment variables (VITE_API_BASE_URL)
  - Add development commands (npm run dev, npm run build, npm run preview)
  - Add project structure overview
  - Document key technologies and libraries
  - Add component documentation guidelines
  - Ensure all components have JSDoc comments
  - Document props, emits, and slots
  - Add deployment instructions
  - Document build process (npm run build)
  - Document static hosting requirements (SPA routing)
  - Provide example configuration for Netlify, Vercel
  - Add troubleshooting section
  - Common issues and solutions
  - _Requirements: Non-functional requirement 8_

- [x] 48. Final testing and optimization
  - Test complete user flows end-to-end
  - Guest user: browse catalog, use chat
  - Authenticated user: login, use chat, logout
  - Admin user: login, manage movies, manage videogames, view statistics
  - Run Lighthouse audit in Chrome DevTools
  - Target Performance score: 90+
  - Target Accessibility score: 90+
  - Target Best Practices score: 90+
  - Target SEO score: 90+
  - Address any issues found
  - Optimize bundle size
  - Check dist/ folder size after build
  - Target JavaScript bundle < 500KB gzipped
  - Use code splitting if needed (dynamic imports)
  - Test on 3G connection
  - Use Chrome DevTools Network throttling
  - Target initial page load < 2 seconds
  - Optimize images if used
  - Verify all API integrations
  - Test with real backend
  - Verify all endpoints return expected data
  - Verify authentication works end-to-end
  - Test error scenarios
  - Test with invalid credentials
  - Test with expired token
  - Test with network disconnected
  - Test with backend down (503)
  - Verify error messages are shown correctly
  - Fix any issues found
  - _Requirements: Non-functional requirements 1, 2, 3_

## Notes

- All code should be in the `frontend/` directory within the project root
- Use Vue 3 Composition API with `<script setup>` syntax consistently
- Use Tailwind CSS utility classes for styling (avoid custom CSS when possible)
- Follow mobile-first responsive design approach
- All API calls should go through the centralized apiClient (services/api.js)
- Authentication token is automatically added by the API client interceptor
- Store global state in Pinia stores, not in components
- Use composables for reusable logic across components
- Follow the design document (frontend_design.md) for implementation details
- JWT tokens contain user data (id, role) - decode them for authorization checks
- Cache catalog data for 5 minutes to reduce API calls
- Clear cache after mutations (create, update, delete)
- Anonymous chat users are automatically assigned to user ID 1 by the backend
- All timestamps should be in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
- Error handling is centralized in the API client response interceptor
- Toast notifications are managed through the toastStore
- Modal state is managed using the useModal composable
- Form validation is handled using the useForm composable with utility validators
- Pagination state is managed using the usePagination composable
- Search inputs should be debounced (300ms) to avoid excessive API calls
- All admin routes require authentication and admin role verification
- Guest routes (login, register) redirect to home if already authenticated
- The app checks for existing auth token on startup (main.js calls checkAuth)
- The router navigation guard handles authentication and authorization checks
- Loading spinners should be shown during all async operations
- Skeleton loaders should be shown when fetching data for the first time
- All forms should disable submit buttons during submission
- All modals should trap focus and restore focus on close
- All images should have alt text for accessibility
- All interactive elements should have visible focus indicators
- Testing is optional but highly recommended for production deployment
- Environment variables must be prefixed with VITE_ to be accessible
- The backend API base URL is configured in .env file (VITE_API_BASE_URL)

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2", "3"]
    },
    {
      "id": 2,
      "tasks": ["5"]
    },
    {
      "id": 3,
      "tasks": ["6", "7", "8", "9"]
    },
    {
      "id": 4,
      "tasks": ["11", "12", "13"]
    },
    {
      "id": 5,
      "tasks": ["14", "16"]
    },
    {
      "id": 6,
      "tasks": ["17", "19", "20"]
    },
    {
      "id": 7,
      "tasks": ["21", "24", "25"]
    },
    {
      "id": 8,
      "tasks": ["22", "26", "30", "34"]
    },
    {
      "id": 9,
      "tasks": ["23", "27", "35", "36", "37"]
    },
    {
      "id": 10,
      "tasks": ["28", "31", "38", "40"]
    },
    {
      "id": 11,
      "tasks": ["32", "41", "43"]
    },
    {
      "id": 12,
      "tasks": ["44"]
    },
    {
      "id": 13,
      "tasks": ["45"]
    },
    {
      "id": 14,
      "tasks": ["46"]
    },
    {
      "id": 15,
      "tasks": ["47", "48"]
    }
  ]
}
```
