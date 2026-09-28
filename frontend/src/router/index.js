import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-load views for better performance
const HomeView = () => import('@/views/HomeView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const CatalogMoviesView = () => import('@/views/CatalogMoviesView.vue')
const CatalogVideogamesView = () => import('@/views/CatalogVideogamesView.vue')
const AdminDashboardView = () => import('@/views/AdminDashboardView.vue')
const AdminMoviesView = () => import('@/views/AdminMoviesView.vue')
const AdminVideogamesView = () => import('@/views/AdminVideogamesView.vue')
const AdminStatisticsView = () => import('@/views/AdminStatisticsView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    alias: '/chat',
    meta: {
      title: 'ChatbotOcio - Home'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      guest: true,
      title: 'Login - ChatbotOcio'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: {
      guest: true,
      title: 'Register - ChatbotOcio'
    }
  },
  {
    path: '/catalog/movies',
    name: 'catalog-movies',
    component: CatalogMoviesView,
    meta: {
      title: 'Movies - ChatbotOcio'
    }
  },
  {
    path: '/catalog/videogames',
    name: 'catalog-videogames',
    component: CatalogVideogamesView,
    meta: {
      title: 'Videogames - ChatbotOcio'
    }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboardView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard - ChatbotOcio'
    }
  },
  {
    path: '/admin/movies',
    name: 'admin-movies',
    component: AdminMoviesView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Manage Movies - ChatbotOcio'
    }
  },
  {
    path: '/admin/videogames',
    name: 'admin-videogames',
    component: AdminVideogamesView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Manage Videogames - ChatbotOcio'
    }
  },
  {
    path: '/admin/statistics',
    name: 'admin-statistics',
    component: AdminStatisticsView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Statistics - ChatbotOcio'
    }
  },
  {
    // Catch-all route - redirect to home
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for authentication and authorization
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login with return URL
      return next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Redirect to home with error message
      // Error message will be handled by the view or a toast notification
      console.warn('Admin access required')
      return next({
        name: 'home',
        query: { error: 'admin_required' }
      })
    }
  }

  // Redirect authenticated users away from guest pages (login, register)
  if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }

  // Allow navigation
  next()
})

export default router
