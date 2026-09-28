import { defineStore } from 'pinia'
import mediaService from '@/services/media.service.js'

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000

/**
 * Catalog Store
 * 
 * Manages movies and videogames catalog data with caching support.
 * Provides both public and admin-level access to media catalog.
 * 
 * State:
 * - movies: Array of movie objects
 * - videogames: Array of videogame objects
 * - moviesCache: Cache object for movies data with timestamps
 * - videogamesCache: Cache object for videogames data with timestamps
 * - moviesPagination: Pagination metadata for movies
 * - videogamesPagination: Pagination metadata for videogames
 * - loading: Loading state for async operations
 * 
 * Actions:
 * - fetchMovies: Get movies with optional filters (public, cached)
 * - fetchVideogames: Get videogames with optional filters (public, cached)
 * - fetchMoviesAdmin: Get movies for admin management (not cached)
 * - fetchVideogamesAdmin: Get videogames for admin management (not cached)
 * - createMovie: Create new movie (admin)
 * - updateMovie: Update existing movie (admin)
 * - deleteMovie: Delete movie (admin)
 * - createVideogame: Create new videogame (admin)
 * - updateVideogame: Update existing videogame (admin)
 * - deleteVideogame: Delete videogame (admin)
 * 
 * Validates: Requirements 10.5, 10.6, 10.7
 */
export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    movies: [],
    videogames: [],
    moviesCache: {},
    videogamesCache: {},
    moviesPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    },
    videogamesPagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    },
    loading: false
  }),

  actions: {
    /**
     * Fetch movies with optional filters (public access, cached)
     * @param {object} params - Query parameters { genero, plataforma, anio_lanzamiento, page }
     */
    async fetchMovies(params = {}) {
      this.loading = true
      try {
        // Create cache key from params
        const cacheKey = JSON.stringify(params)
        
        // Check cache for valid data
        const cached = this.moviesCache[cacheKey]
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
          // Use cached data if not expired
          this.movies = cached.data
          this.moviesPagination = cached.pagination
          return
        }
        
        // Fetch from API
        const response = await mediaService.getMovies(params)
        
        // Store response in state
        this.movies = response.items || response
        
        // Update pagination metadata
        this.moviesPagination = {
          currentPage: response.page || params.page || 1,
          totalPages: response.total_pages || 1,
          totalItems: response.total || (response.items ? response.items.length : this.movies.length)
        }
        
        // Cache response with timestamp
        this.moviesCache[cacheKey] = {
          data: this.movies,
          pagination: this.moviesPagination,
          timestamp: Date.now()
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch videogames with optional filters (public access, cached)
     * @param {object} params - Query parameters { genero, plataforma, clasificacion, page }
     */
    async fetchVideogames(params = {}) {
      this.loading = true
      try {
        // Create cache key from params
        const cacheKey = JSON.stringify(params)
        
        // Check cache for valid data
        const cached = this.videogamesCache[cacheKey]
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
          // Use cached data if not expired
          this.videogames = cached.data
          this.videogamesPagination = cached.pagination
          return
        }
        
        // Fetch from API
        const response = await mediaService.getVideogames(params)
        
        // Store response in state
        this.videogames = response.items || response
        
        // Update pagination metadata
        this.videogamesPagination = {
          currentPage: response.page || params.page || 1,
          totalPages: response.total_pages || 1,
          totalItems: response.total || (response.items ? response.items.length : this.videogames.length)
        }
        
        // Cache response with timestamp
        this.videogamesCache[cacheKey] = {
          data: this.videogames,
          pagination: this.videogamesPagination,
          timestamp: Date.now()
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch movies for admin management (not cached)
     * @param {object} params - Query parameters { page, search }
     */
    async fetchMoviesAdmin(params = {}) {
      this.loading = true
      try {
        // Fetch from API (no caching for admin)
        const response = await mediaService.getMoviesAdmin(params)
        
        // Store response in state
        this.movies = response.items || response
        
        // Update pagination metadata
        this.moviesPagination = {
          currentPage: response.page || params.page || 1,
          totalPages: response.total_pages || 1,
          totalItems: response.total || (response.items ? response.items.length : this.movies.length)
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch videogames for admin management (not cached)
     * @param {object} params - Query parameters { page, search }
     */
    async fetchVideogamesAdmin(params = {}) {
      this.loading = true
      try {
        // Fetch from API (no caching for admin)
        const response = await mediaService.getVideogamesAdmin(params)
        
        // Store response in state
        this.videogames = response.items || response
        
        // Update pagination metadata
        this.videogamesPagination = {
          currentPage: response.page || params.page || 1,
          totalPages: response.total_pages || 1,
          totalItems: response.total || (response.items ? response.items.length : this.videogames.length)
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Create new movie (admin)
     * @param {object} movieData - Movie data to create
     * @returns {object} Created movie object
     */
    async createMovie(movieData) {
      const response = await mediaService.createMovie(movieData)
      
      // Clear moviesCache (invalidate cache)
      this.moviesCache = {}
      
      return response
    },

    /**
     * Update existing movie (admin)
     * @param {number} id - Movie ID
     * @param {object} movieData - Updated movie data
     * @returns {object} Updated movie object
     */
    async updateMovie(id, movieData) {
      const response = await mediaService.updateMovie(id, movieData)
      
      // Clear moviesCache (invalidate cache)
      this.moviesCache = {}
      
      return response
    },

    /**
     * Delete movie (admin)
     * @param {number} id - Movie ID to delete
     */
    async deleteMovie(id) {
      await mediaService.deleteMovie(id)
      
      // Clear moviesCache (invalidate cache)
      this.moviesCache = {}
    },

    /**
     * Create new videogame (admin)
     * @param {object} videogameData - Videogame data to create
     * @returns {object} Created videogame object
     */
    async createVideogame(videogameData) {
      const response = await mediaService.createVideogame(videogameData)
      
      // Clear videogamesCache (invalidate cache)
      this.videogamesCache = {}
      
      return response
    },

    /**
     * Update existing videogame (admin)
     * @param {number} id - Videogame ID
     * @param {object} videogameData - Updated videogame data
     * @returns {object} Updated videogame object
     */
    async updateVideogame(id, videogameData) {
      const response = await mediaService.updateVideogame(id, videogameData)
      
      // Clear videogamesCache (invalidate cache)
      this.videogamesCache = {}
      
      return response
    },

    /**
     * Delete videogame (admin)
     * @param {number} id - Videogame ID to delete
     */
    async deleteVideogame(id) {
      await mediaService.deleteVideogame(id)
      
      // Clear videogamesCache (invalidate cache)
      this.videogamesCache = {}
    }
  }
})
