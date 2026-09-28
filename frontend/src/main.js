import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

// Import global CSS
import './assets/styles/main.css'

// Create Vue app instance
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Install plugins
app.use(pinia)
app.use(router)

// Initialize authentication state before mounting
const authStore = useAuthStore()
authStore.checkAuth()

// Mount app to #app
app.mount('#app')
