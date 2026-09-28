# ChatbotOcio - Vue.js Frontend

A modern, responsive Vue.js 3 frontend application for the ChatbotOcio system. This application provides an interactive chat interface for entertainment recommendations, public media catalog browsing, and an administrative dashboard for content management.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Development Commands](#development-commands)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Component Documentation](#component-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

ChatbotOcio Frontend is a single-page application (SPA) built with Vue 3 Composition API that delivers:

- **Interactive Chat Interface**: ChatGPT-inspired UI for conversing with an AI assistant about movies and videogames
- **Public Catalog Browsing**: Browse movies and videogames without authentication
- **User Authentication**: JWT-based login and registration with role-based access control
- **Admin Dashboard**: Manage movies, videogames, and view usage statistics
- **Responsive Design**: Fully responsive UI supporting desktop, tablet, and mobile devices
- **Accessibility**: WCAG-compliant with ARIA labels and keyboard navigation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher

To check your current versions:

```bash
node --version
npm --version
```

If you need to install or update Node.js, visit [nodejs.org](https://nodejs.org/).

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChatbotOcio/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure the required variables (see [Environment Variables](#environment-variables) section).

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## 🔐 Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Base URL for the FastAPI backend | `http://localhost:8000` | Yes |

### Example `.env` File

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

**Important Notes:**
- All environment variables must be prefixed with `VITE_` to be accessible in the application
- Never commit the `.env` file to version control (it's in `.gitignore`)
- Use `.env.example` as a template for required variables
- Environment variables are embedded at build time, not runtime

## 💻 Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR). The app will automatically reload when you make changes to the code.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder. The build includes:
- Minified JavaScript and CSS
- Asset optimization and hashing
- Tree-shaking to remove unused code
- Source maps for debugging

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment. This allows you to verify the production build works correctly.

### Run Tests
```bash
npm run test
```
Runs unit tests with Vitest in watch mode.

```bash
npm run test:ui
```
Opens the Vitest UI for interactive test debugging.

### Lint Code
```bash
npm run lint
```
Runs ESLint to check for code quality issues and automatically fixes what it can.

### Format Code
```bash
npm run format
```
Runs Prettier to format all files in the `src/` directory according to the project's style guide.

## 📁 Project Structure

```
frontend/
├── public/                      # Static assets served as-is
│   ├── favicon.svg             # Application favicon
│   └── icons.svg               # SVG sprite sheet
│
├── src/                        # Source code
│   ├── main.js                 # Application entry point
│   ├── App.vue                 # Root component
│   │
│   ├── views/                  # Page-level components (routes)
│   │   ├── HomeView.vue        # Home/Landing page
│   │   ├── ChatView.vue        # Chat interface
│   │   ├── LoginView.vue       # Login page
│   │   ├── RegisterView.vue    # Registration page
│   │   ├── CatalogMoviesView.vue      # Movies catalog
│   │   ├── CatalogVideogamesView.vue  # Videogames catalog
│   │   ├── AdminDashboardView.vue     # Admin home
│   │   ├── AdminMoviesView.vue        # Movie management
│   │   ├── AdminVideogamesView.vue    # Videogame management
│   │   └── AdminStatisticsView.vue    # Statistics dashboard
│   │
│   ├── components/             # Reusable components
│   │   ├── layout/            # Layout components
│   │   │   ├── NavigationBar.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── Footer.vue
│   │   │
│   │   ├── chat/              # Chat-related components
│   │   │   ├── ChatMessage.vue
│   │   │   ├── ChatInput.vue
│   │   │   ├── ChatHistory.vue
│   │   │   └── TypingIndicator.vue
│   │   │
│   │   ├── catalog/           # Catalog components
│   │   │   ├── MovieCard.vue
│   │   │   ├── VideogameCard.vue
│   │   │   ├── MediaGrid.vue
│   │   │   ├── MediaFilters.vue
│   │   │   └── Pagination.vue
│   │   │
│   │   ├── admin/             # Admin components
│   │   │   ├── DataTable.vue
│   │   │   ├── MovieForm.vue
│   │   │   ├── VideogameForm.vue
│   │   │   ├── StatsChart.vue
│   │   │   └── StatsSummary.vue
│   │   │
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginForm.vue
│   │   │   ├── RegisterForm.vue
│   │   │   └── UserMenu.vue
│   │   │
│   │   └── common/            # Common UI components
│   │       ├── Modal.vue
│   │       ├── Toast.vue
│   │       ├── Button.vue
│   │       ├── Input.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ConfirmDialog.vue
│   │
│   ├── stores/                # Pinia state management
│   │   ├── index.js           # Store configuration
│   │   ├── auth.js            # Authentication state
│   │   ├── catalog.js         # Catalog data state
│   │   ├── chat.js            # Chat messages state
│   │   └── toast.js           # Toast notifications state
│   │
│   ├── router/                # Vue Router configuration
│   │   ├── index.js           # Route definitions
│   │   └── guards.js          # Navigation guards
│   │
│   ├── services/              # API integration
│   │   ├── api.js             # Axios client setup
│   │   ├── auth.service.js    # Authentication API
│   │   ├── media.service.js   # Movies/videogames API
│   │   ├── chat.service.js    # Chat API
│   │   └── statistics.service.js  # Statistics API
│   │
│   ├── composables/           # Reusable composition functions
│   │   ├── useAuth.js         # Auth helpers
│   │   ├── useToast.js        # Toast notifications
│   │   ├── useForm.js         # Form validation
│   │   ├── useModal.js        # Modal control
│   │   ├── usePagination.js   # Pagination logic
│   │   └── useDebounce.js     # Debounce utility
│   │
│   ├── utils/                 # Utility functions
│   │   ├── validation.js      # Form validators
│   │   ├── formatters.js      # Data formatters
│   │   ├── constants.js       # App constants
│   │   └── helpers.js         # Helper functions
│   │
│   └── assets/                # Static assets
│       ├── styles/
│       │   └── main.css       # Global styles + Tailwind
│       └── images/
│           └── hero.png
│
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── jsconfig.json              # JavaScript/IDE configuration
├── .eslintrc.cjs              # ESLint rules
├── .prettierrc                # Prettier formatting rules
├── vitest.config.js           # Vitest test configuration
└── README.md                  # This file
```

## 🛠 Key Technologies and Libraries

### Core Framework
- **Vue.js 3.5+**: Progressive JavaScript framework with Composition API
- **Vite 8.3+**: Next-generation frontend build tool with instant HMR

### State Management & Routing
- **Pinia 2.3+**: Intuitive, type-safe state management for Vue
- **Vue Router 4.6+**: Official router for Vue.js with navigation guards

### HTTP & Authentication
- **Axios 1.20+**: Promise-based HTTP client with interceptors
- **jwt-decode 4.0+**: JWT token decoder for extracting user data

### UI & Styling
- **Tailwind CSS 3.0+**: Utility-first CSS framework
- **@tailwindcss/forms 0.5+**: Form styling plugin
- **@heroicons/vue 2.2+**: Beautiful hand-crafted SVG icons
- **Chart.js 4.5+**: Data visualization library for statistics charts

### Development Tools
- **ESLint 8.57+**: JavaScript linting with Vue plugin
- **Prettier 3.9+**: Code formatter for consistent style
- **Vitest 5.0+**: Blazing fast unit test framework
- **@vue/test-utils 2.5+**: Official testing utilities for Vue
- **jsdom 30.1+**: JavaScript implementation of web standards for testing

### Build Optimizations
- **PostCSS**: CSS transformations with Autoprefixer
- **@vitejs/plugin-vue**: Official Vue 3 plugin for Vite

## 📚 Component Documentation

### Documentation Guidelines

All components follow these documentation standards:

#### 1. JSDoc Comments

Every component should include a JSDoc comment at the top of the `<script setup>` section:

```vue
<script setup>
/**
 * ChatMessage Component
 * 
 * Displays a single chat message with role-based styling and timestamp.
 * 
 * @component
 * @example
 * <ChatMessage 
 *   :message="{ role: 'user', content: 'Hello!', timestamp: '2024-01-01T12:00:00Z' }"
 * />
 */
</script>
```

#### 2. Props Documentation

Document all props with JSDoc comments:

```javascript
/**
 * Props for ChatMessage component
 */
const props = defineProps({
  /**
   * The message object to display
   * @type {{ role: 'user' | 'assistant', content: string, timestamp: string }}
   */
  message: {
    type: Object,
    required: true
  },
  
  /**
   * Whether the message is currently loading
   * @type {boolean}
   * @default false
   */
  loading: {
    type: Boolean,
    default: false
  }
})
```

#### 3. Emits Documentation

Document all emitted events:

```javascript
/**
 * Emits
 */
const emit = defineEmits({
  /**
   * Emitted when user clicks on the message
   * @param {number} messageId - The ID of the clicked message
   */
  click: (messageId) => typeof messageId === 'number',
  
  /**
   * Emitted when user deletes the message
   * @param {number} messageId - The ID of the deleted message
   */
  delete: (messageId) => typeof messageId === 'number'
})
```

#### 4. Slots Documentation

Document slots in the component comment:

```vue
<script setup>
/**
 * Modal Component
 * 
 * A reusable modal dialog with customizable content.
 * 
 * @component
 * @slot default - Main modal content
 * @slot header - Custom header content
 * @slot footer - Custom footer content
 * 
 * @example
 * <Modal v-model:show="isOpen">
 *   <template #header>
 *     <h2>Title</h2>
 *   </template>
 *   <p>Content goes here</p>
 *   <template #footer>
 *     <button>Close</button>
 *   </template>
 * </Modal>
 */
</script>
```

#### 5. Composable Documentation

Document composable functions with clear usage examples:

```javascript
/**
 * useAuth Composable
 * 
 * Provides authentication-related functionality and reactive state.
 * 
 * @returns {{
 *   user: ComputedRef<User | null>,
 *   isAuthenticated: ComputedRef<boolean>,
 *   isAdmin: ComputedRef<boolean>,
 *   login: (credentials: Credentials) => Promise<void>,
 *   logout: () => void
 * }}
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth()
 * 
 * // Check if user is authenticated
 * if (isAuthenticated.value) {
 *   console.log('User:', user.value.name)
 * }
 * 
 * // Login
 * await login({ email: 'user@example.com', password: 'password' })
 * 
 * // Logout
 * logout()
 */
export function useAuth() {
  // Implementation
}
```

### Key Component APIs

#### Common Components

##### Button
```vue
<Button 
  variant="primary|secondary|danger" 
  size="sm|md|lg"
  :loading="false"
  :disabled="false"
  @click="handleClick"
>
  Click me
</Button>
```

##### Input
```vue
<Input
  v-model="value"
  type="text|email|password|number"
  placeholder="Enter value"
  :error="errorMessage"
  :disabled="false"
/>
```

##### Modal
```vue
<Modal v-model:show="isOpen" :close-on-backdrop="true">
  <template #header>
    <h2>Modal Title</h2>
  </template>
  
  <p>Modal content</p>
  
  <template #footer>
    <Button @click="isOpen = false">Close</Button>
  </template>
</Modal>
```

##### Toast
Toasts are managed via the `useToast` composable:

```javascript
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

// Show success toast
showToast('Operation completed!', 'success')

// Show error toast
showToast('Something went wrong', 'error')

// Show info toast
showToast('Please note...', 'info')

// Show warning toast
showToast('Are you sure?', 'warning')
```

#### Chat Components

##### ChatMessage
```vue
<ChatMessage 
  :message="{
    role: 'user',
    content: 'Message text',
    timestamp: '2024-01-01T12:00:00Z'
  }"
/>
```

##### ChatInput
```vue
<ChatInput
  v-model="message"
  :disabled="false"
  :loading="false"
  placeholder="Type your message..."
  @send="handleSend"
/>
```

#### Catalog Components

##### MovieCard
```vue
<MovieCard
  :movie="{
    id_pelicula: 1,
    titulo: 'Movie Title',
    genero: 'Action',
    plataforma: 'Netflix',
    anio_lanzamiento: 2024,
    director: 'Director Name',
    puntuacion: 8.5
  }"
  @click="showDetail"
/>
```

##### MediaFilters
```vue
<MediaFilters
  :genres="['Action', 'Drama', 'Comedy']"
  :platforms="['Netflix', 'Prime Video']"
  :years="[2024, 2023, 2022]"
  @filter="handleFilter"
/>
```

#### Admin Components

##### DataTable
```vue
<DataTable
  :columns="[
    { key: 'title', label: 'Title' },
    { key: 'genre', label: 'Genre' },
    { key: 'actions', label: 'Actions' }
  ]"
  :data="items"
  :loading="false"
  @edit="handleEdit"
  @delete="handleDelete"
/>
```

##### StatsChart
```vue
<StatsChart
  :data="{
    labels: ['Mon', 'Tue', 'Wed'],
    datasets: [{
      label: 'Token Usage',
      data: [100, 200, 150]
    }]
  }"
  type="line|bar|pie"
  :loading="false"
/>
```

## 🚀 Deployment

### Build for Production

1. **Create Production Build**
   ```bash
   npm run build
   ```
   
   This creates an optimized production bundle in the `dist/` folder with:
   - Minified and compressed JavaScript
   - Optimized CSS with unused styles removed
   - Hashed filenames for cache busting
   - Compressed assets

2. **Test Production Build Locally**
   ```bash
   npm run preview
   ```
   
   Verify the production build works correctly before deploying.

### Static Hosting Requirements

The application is a Single Page Application (SPA) and requires proper server configuration:

#### SPA Routing Configuration

**Important**: All routes must redirect to `index.html` to support client-side routing.

### Deployment Platforms

#### Netlify

1. **Via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod --dir=dist
   ```

2. **Via Git Integration**
   
   Create a `netlify.toml` file in the project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [build.environment]
     NODE_VERSION = "18"
   ```
   
   Connect your repository to Netlify and configure environment variables in the Netlify dashboard.

#### Vercel

1. **Via Vercel CLI**
   ```bash
   npm install -g vercel
   npm run build
   vercel --prod
   ```

2. **Via Git Integration**
   
   Create a `vercel.json` file in the project root:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   
   Connect your repository to Vercel and configure environment variables in the Vercel dashboard.

#### Nginx

For self-hosted deployments with Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    # SPA routing - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Apache

For Apache deployments, create a `.htaccess` file in the `dist/` folder:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # SPA routing
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Environment Variables for Production

When deploying, configure these environment variables in your hosting platform:

- `VITE_API_BASE_URL`: Your production API URL (e.g., `https://api.yourdomain.com`)

**Important**: Never commit production environment variables to version control!

### Post-Deployment Checklist

- [ ] Verify all routes work correctly (test deep links)
- [ ] Check that API calls use the correct production URL
- [ ] Test authentication flow (login, logout, token refresh)
- [ ] Verify responsive design on mobile devices
- [ ] Test CRUD operations in admin panel
- [ ] Check browser console for errors
- [ ] Verify SSL certificate is active (HTTPS)
- [ ] Test performance with Lighthouse
- [ ] Verify error handling and user feedback

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot find module" errors after install

**Symptoms**: Import errors or module not found errors after running `npm install`

**Solution**:
```bash
# Clear npm cache and node_modules
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### Issue: Vite dev server won't start

**Symptoms**: Port already in use or server fails to start

**Solution**:
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173  # Windows
lsof -ti:5173                 # macOS/Linux

# Kill the process or use a different port
npm run dev -- --port 3000
```

#### Issue: API requests fail with CORS errors

**Symptoms**: Browser console shows "CORS policy" errors

**Solution**:
- Ensure `VITE_API_BASE_URL` in `.env` matches your backend URL exactly
- Verify the backend has CORS configured to allow your frontend origin
- Check that the backend is running and accessible
- In development, backend should allow `http://localhost:5173`

#### Issue: Environment variables not working

**Symptoms**: `import.meta.env.VITE_API_BASE_URL` is undefined

**Solution**:
- Ensure variable names start with `VITE_` prefix
- Restart the dev server after changing `.env` file
- Check that `.env` file is in the `frontend/` directory
- Verify `.env` file is not in `.gitignore` (`.env.example` should exist)

```bash
# Restart dev server
# Press Ctrl+C to stop, then:
npm run dev
```

#### Issue: Build fails with "Out of memory" error

**Symptoms**: Build process crashes with heap memory error

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"  # macOS/Linux
set NODE_OPTIONS=--max-old-space-size=4096       # Windows

npm run build
```

#### Issue: Authentication token expires immediately

**Symptoms**: User gets logged out right after logging in

**Solution**:
- Check JWT token expiration time in backend
- Verify system clock is synchronized
- Check browser localStorage for `auth_token`
- Verify token refresh logic in `authStore`

```javascript
// Debug token in browser console
localStorage.getItem('auth_token')
```

#### Issue: Styles not applied after build

**Symptoms**: Production build has no styling or partial styling

**Solution**:
- Ensure Tailwind CSS is properly configured in `tailwind.config.js`
- Check that `main.css` imports Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Verify PostCSS is configured in `postcss.config.js`
- Clear browser cache or test in incognito mode

#### Issue: Router navigation doesn't work after deployment

**Symptoms**: Direct URLs return 404 or page refresh breaks routing

**Solution**:
- Configure SPA routing on your server (see [Deployment](#deployment) section)
- Ensure `router/index.js` uses `createWebHistory()` not `createWebHashHistory()`
- Verify server redirects all routes to `index.html`

#### Issue: Images or assets not loading in production

**Symptoms**: Images show broken or 404 errors

**Solution**:
- Use Vite's asset handling: `new URL('./assets/image.png', import.meta.url)`
- Or place images in `public/` and reference as `/image.png`
- Check that asset paths don't start with `/src/`

```javascript
// ✅ Correct
import logoUrl from '@/assets/logo.svg'

// ✅ Also correct (for public folder)
<img src="/logo.svg" alt="Logo">

// ❌ Wrong
<img src="/src/assets/logo.svg" alt="Logo">
```

#### Issue: Tests fail with "Cannot find module" errors

**Symptoms**: Vitest can't resolve imports or components

**Solution**:
- Check `vitest.config.js` has correct path aliases
- Ensure test files are in `__tests__` or have `.test.js` suffix
- Verify `jsconfig.json` has path mappings

```javascript
// vitest.config.js
export default {
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}
```

#### Issue: Form validation not working

**Symptoms**: Forms submit invalid data or validation messages don't show

**Solution**:
- Check form schema in component
- Verify `useForm` composable is properly implemented
- Review validation rules in `utils/validation.js`
- Check browser console for validation errors

#### Issue: Mobile menu not working

**Symptoms**: Hamburger menu doesn't open on mobile

**Solution**:
- Check responsive breakpoints in Tailwind config
- Verify `NavigationBar.vue` mobile menu toggle logic
- Test in browser dev tools mobile emulation
- Check z-index conflicts with other elements

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**: Open DevTools (F12) and check for JavaScript errors
2. **Check Network Tab**: Verify API requests and responses
3. **Check Vite Logs**: Review terminal output for build/dev server errors
4. **Review Documentation**: Check Vue 3, Vite, and Tailwind CSS documentation
5. **Search Issues**: Look for similar issues in the project's issue tracker
6. **Ask for Help**: Create a detailed issue with error messages and steps to reproduce

### Debug Mode

Enable verbose logging by adding this to your `.env.local` (not committed):

```env
VITE_DEBUG=true
```

Then check console for detailed logs from services and stores.

---

## 📄 License

[Add your license information here]

## 👥 Contributors

[Add contributor information here]

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the main project README for additional resources


---

## 🧪 Testing

Comprehensive testing documentation ensures the application meets all requirements and performs optimally.

### Test Documentation Files

1. **FINAL_TESTING_REPORT.md** - Comprehensive testing plan and results documentation
2. **MANUAL_TESTING_CHECKLIST.md** - Detailed manual testing checklist for all user flows
3. **OPTIMIZATION_RECOMMENDATIONS.md** - Performance and optimization guidelines
4. **tests/integration-flows.test.js** - Automated integration tests for user flows
5. **tests/catalog.test.js** - Component tests for catalog functionality

### Running Tests

#### Unit and Component Tests

```bash
# Run tests in watch mode (default)
npm run test

# Run tests once (for CI/CD)
npm run test -- --run

# Run with coverage report
npm run test -- --coverage

# Open interactive test UI
npm run test:ui
```

#### Integration Tests

Integration tests verify complete user journeys:

```bash
# Run integration tests
npm run test tests/integration-flows.test.js

# Run all tests including integration
npm run test
```

**Prerequisites for integration tests:**
- Backend server must be running
- Test database should be populated with sample data
- Environment variables must be configured

#### Manual Testing

Follow the comprehensive manual testing checklist:

```bash
# 1. Start backend server
cd backend
docker-compose up -d

# 2. Start frontend dev server
cd frontend
npm run dev

# 3. Open the manual testing checklist
# View: frontend/MANUAL_TESTING_CHECKLIST.md

# 4. Execute each test suite systematically:
#    - Guest User Flow
#    - User Registration & Authentication
#    - Authenticated User Flow
#    - Admin User Flow
#    - Responsive Design
#    - Accessibility
#    - Performance
#    - Error Handling
#    - Security
#    - Edge Cases
```

### Performance Testing

#### Bundle Size Analysis

Check if the application meets the < 500KB gzipped target:

```bash
# Build the application
npm run build

# Run bundle analysis (PowerShell on Windows)
./analyze-bundle.ps1

# Or manually check dist/assets folder
ls -lh dist/assets
```

Expected output:
- Total JavaScript: < 500KB uncompressed
- Estimated gzipped: < 150KB
- Multiple route-based chunks (good code splitting)

#### Lighthouse Audit

Lighthouse provides comprehensive performance, accessibility, best practices, and SEO scores:

```bash
# 1. Build and preview production version
npm run build
npm run preview

# 2. Open Chrome and navigate to http://localhost:4173

# 3. Open Chrome DevTools (F12)

# 4. Navigate to "Lighthouse" tab

# 5. Select all categories:
#    - Performance
#    - Accessibility
#    - Best Practices
#    - SEO

# 6. Click "Analyze page load"

# 7. Wait for audit to complete
```

**Target Scores (all categories ≥ 90):**
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 90+

**Common issues and fixes:**
- Low contrast text → Use darker colors (e.g., text-gray-900 instead of text-gray-600)
- Missing alt text → Add alt attributes to all images
- Large bundle size → Enable lazy loading for heavy dependencies
- Blocking resources → Ensure code splitting is working

#### 3G Network Testing

Test performance on slow connections:

```bash
# 1. Start preview server
npm run preview

# 2. Open Chrome DevTools (F12)

# 3. Navigate to "Network" tab

# 4. Change throttling dropdown to "Slow 3G"

# 5. Hard refresh page (Ctrl+Shift+R)

# 6. Measure:
#    - DOMContentLoaded: should be < 5 seconds
#    - Load: should be < 10 seconds
#    - Time to Interactive: should be < 5 seconds
```

**Expected behavior:**
- Loading states should be visible
- Skeleton loaders appear before content
- No blank white screens
- Progressive content loading

### API Integration Testing

Verify all API endpoints work correctly:

```bash
# 1. Ensure backend is running
curl http://localhost:8000/docs

# 2. Start frontend
npm run dev

# 3. Test each endpoint:
```

**Authentication:**
- [ ] Register new user → Success toast + auto-login
- [ ] Login with valid credentials → Redirect to home
- [ ] Login with invalid credentials → Error message
- [ ] Logout → Token cleared + redirect to login

**Movies (Public):**
- [ ] GET /movies → Displays catalog
- [ ] Apply filters → Updates catalog
- [ ] Click pagination → Loads different page

**Movies (Admin):**
- [ ] POST /movies → Creates movie + success toast
- [ ] PUT /movies/{id} → Updates movie + success toast
- [ ] DELETE /movies/{id} → Deletes movie + confirmation

**Videogames:**
- [ ] Similar tests as movies
- [ ] Classification dropdown works
- [ ] Classification colors display correctly

**Chat:**
- [ ] Send message as guest → Response received
- [ ] Send message as authenticated user → Token included in request
- [ ] Long message → Handles gracefully
- [ ] Special characters → Displays correctly

**Statistics (Admin only):**
- [ ] GET /statistics → Charts and tables display
- [ ] Change date range → Data updates
- [ ] No data available → Empty state message

### Error Scenario Testing

Verify graceful error handling:

#### Network Errors

```bash
# Test with backend down
# 1. Stop backend server
# 2. Try to fetch movies → "Service unavailable" message
# 3. Try to login → "Unable to connect" message

# Test offline mode
# 1. Open DevTools > Network tab
# 2. Enable "Offline" mode
# 3. Try any API action → "No internet connection" message
```

#### Validation Errors

```bash
# Test form validation
# 1. Try to create movie with year 1500 → "Year must be between 1888 and 2030"
# 2. Try to register with invalid email → "Invalid email format"
# 3. Try to submit empty form → All field errors display
```

#### Permission Errors

```bash
# Test authorization
# 1. Login as regular user
# 2. Navigate to /admin/movies → Redirect + "Admin access required"
# 3. Try to create movie via API → 403 error handled gracefully
```

### Accessibility Testing

#### Keyboard Navigation

```bash
# Manual test with keyboard only (no mouse)
# 1. Press Tab to navigate through all interactive elements
# 2. Focus indicator should be visible
# 3. Press Enter/Space to activate buttons
# 4. Press Escape to close modals
# 5. Tab should trap inside modal (not escape)
```

#### Screen Reader Testing (Optional)

If you have a screen reader (NVDA, JAWS, VoiceOver):

```bash
# 1. Enable screen reader
# 2. Navigate through the app
# 3. All content should be announced
# 4. Form labels should be read
# 5. Button purposes should be clear
```

#### Color Contrast

```bash
# Use browser extension (e.g., axe DevTools)
# 1. Install axe DevTools extension
# 2. Open DevTools > axe DevTools tab
# 3. Click "Scan ALL of my page"
# 4. Review and fix any contrast issues
```

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities and composables
- **Component Tests**: 70%+ coverage for reusable components
- **Integration Tests**: All critical user flows covered
- **Manual Tests**: 100% of checklist items executed

### Continuous Integration

For CI/CD pipelines, add these commands:

```yaml
# .github/workflows/test.yml (example)
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test -- --run --coverage
      
      - name: Build application
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Maintenance

Keep tests up-to-date:

1. **Update tests when changing components**
2. **Add tests for new features**
3. **Remove tests for deleted features**
4. **Keep manual checklist current**
5. **Update integration tests when API changes**

### Testing Best Practices

1. **Write tests before fixing bugs** - Reproduce the bug in a test first
2. **Test user behavior, not implementation** - Focus on what users see and do
3. **Keep tests simple and readable** - Other developers should understand them
4. **Mock external dependencies** - Don't rely on real API calls in unit tests
5. **Use meaningful test descriptions** - Clearly state what is being tested
6. **Avoid test interdependence** - Each test should run independently
7. **Clean up after tests** - Reset state, clear mocks, etc.

### Debugging Tests

If tests fail:

```bash
# Run specific test file
npm run test tests/catalog.test.js

# Run tests matching pattern
npm run test -- --grep "MovieCard"

# Run with debugging
npm run test -- --inspect-brk
# Then open chrome://inspect in Chrome

# View test coverage
npm run test -- --coverage
# Open coverage/index.html in browser
```

### Performance Benchmarks

Document baseline performance metrics:

| Metric | Target | Current |
|--------|--------|---------|
| Initial Load (Desktop) | < 2s | ___ |
| Initial Load (3G) | < 5s | ___ |
| Bundle Size (gzipped) | < 500KB | ___ |
| Time to Interactive | < 3s | ___ |
| Lighthouse Performance | 90+ | ___ |
| Lighthouse Accessibility | 90+ | ___ |
| Lighthouse Best Practices | 90+ | ___ |
| Lighthouse SEO | 90+ | ___ |

Update these metrics after each major release.

---

**Testing Documentation:**
- 📋 [Final Testing Report](./FINAL_TESTING_REPORT.md)
- ✅ [Manual Testing Checklist](./MANUAL_TESTING_CHECKLIST.md)
- ⚡ [Optimization Recommendations](./OPTIMIZATION_RECOMMENDATIONS.md)

For detailed testing procedures and checklists, refer to the testing documentation files listed above.
