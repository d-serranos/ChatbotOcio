/**
 * Media Service
 * 
 * Handles API calls for movies and videogames catalog.
 * Provides methods for fetching media lists and individual items.
 * Provides admin CRUD methods for managing movies and videogames.
 * 
 * Validates: Requirements 5.3, 7.2, 7.4, 7.8, 7.11
 */

import apiClient from './api.js'

const mediaService = {
  // ==================== Public Methods ====================
  
  /**
   * Get list of movies with optional filters
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.genre - Filter by genre
   * @param {string} params.platform - Filter by streaming platform
   * @param {number} params.year - Filter by release year
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Movies list response
   * @throws {Error} When request fails (handled by API interceptor)
   */
  async getMovies(params = {}) {
    const response = await apiClient.get('/movies', { params })
    return response.data
  },

  /**
   * Get list of videogames with optional filters
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.genre - Filter by genre
   * @param {string} params.platform - Filter by gaming platform
   * @param {number} params.year - Filter by release year
   * @param {string} params.classification - Filter by age classification (E, E10+, T, M, AO, RP)
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Videogames list response
   * @throws {Error} When request fails (handled by API interceptor)
   */
  async getVideogames(params = {}) {
    const response = await apiClient.get('/videogames', { params })
    return response.data
  },

  /**
   * Get a single movie by ID
   * @param {number|string} id - Movie ID
   * @returns {Promise<Object>} Movie object with full details
   * @throws {Error} When movie not found or request fails
   */
  async getMovie(id) {
    const response = await apiClient.get(`/movies/${id}`)
    return response.data
  },

  /**
   * Get a single videogame by ID
   * @param {number|string} id - Videogame ID
   * @returns {Promise<Object>} Videogame object with full details
   * @throws {Error} When videogame not found or request fails
   */
  async getVideogame(id) {
    const response = await apiClient.get(`/videogames/${id}`)
    return response.data
  },

  // ==================== Admin Methods - Movies ====================
  
  /**
   * Get list of movies for admin management (requires authentication)
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.genre - Filter by genre
   * @param {string} params.platform - Filter by streaming platform
   * @param {number} params.year - Filter by release year
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search by title
   * @returns {Promise<Object>} Movies list response with auth token
   * @throws {Error} When request fails or user is not authenticated
   * 
   * Validates: Requirement 7.2
   */
  async getMoviesAdmin(params = {}) {
    const response = await apiClient.get('/movies', { params })
    return response.data
  },

  /**
   * Create a new movie (requires admin authentication)
   * @param {Object} movieData - Movie data matching MovieCreate schema
   * @param {string} movieData.titulo - Movie title
   * @param {string} movieData.genero - Movie genre
   * @param {string} movieData.plataforma - Streaming platform
   * @param {number} movieData.anio_lanzamiento - Release year (1888-2030)
   * @param {string} movieData.director - Director name
   * @param {number} [movieData.puntuacion] - Rating (0-10)
   * @returns {Promise<Object>} Created movie object
   * @throws {Error} When validation fails or user lacks permission
   * 
   * Validates: Requirement 7.4
   */
  async createMovie(movieData) {
    const response = await apiClient.post('/movies', movieData)
    return response.data
  },

  /**
   * Update an existing movie (requires admin authentication)
   * @param {number|string} id - Movie ID
   * @param {Object} movieData - Updated movie data
   * @param {string} [movieData.titulo] - Movie title
   * @param {string} [movieData.genero] - Movie genre
   * @param {string} [movieData.plataforma] - Streaming platform
   * @param {number} [movieData.anio_lanzamiento] - Release year (1888-2030)
   * @param {string} [movieData.director] - Director name
   * @param {number} [movieData.puntuacion] - Rating (0-10)
   * @returns {Promise<Object>} Updated movie object
   * @throws {Error} When movie not found, validation fails, or user lacks permission
   * 
   * Validates: Requirement 7.8
   */
  async updateMovie(id, movieData) {
    const response = await apiClient.put(`/movies/${id}`, movieData)
    return response.data
  },

  /**
   * Delete a movie (requires admin authentication)
   * @param {number|string} id - Movie ID
   * @returns {Promise<void>} No return value (204 status)
   * @throws {Error} When movie not found or user lacks permission
   * 
   * Validates: Requirement 7.11
   */
  async deleteMovie(id) {
    await apiClient.delete(`/movies/${id}`)
  },

  // ==================== Admin Methods - Videogames ====================
  
  /**
   * Get list of videogames for admin management (requires authentication)
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.genre - Filter by genre
   * @param {string} params.platform - Filter by gaming platform
   * @param {number} params.year - Filter by release year
   * @param {string} params.classification - Filter by age classification
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search by title
   * @returns {Promise<Object>} Videogames list response with auth token
   * @throws {Error} When request fails or user is not authenticated
   * 
   * Validates: Requirement 7.2 (adapted for videogames)
   */
  async getVideogamesAdmin(params = {}) {
    const response = await apiClient.get('/videogames', { params })
    return response.data
  },

  /**
   * Create a new videogame (requires admin authentication)
   * @param {Object} videogameData - Videogame data matching VideogameCreate schema
   * @param {string} videogameData.titulo - Videogame title
   * @param {string} videogameData.genero - Game genre
   * @param {string} videogameData.plataforma - Gaming platform
   * @param {number} videogameData.anio_lanzamiento - Release year (1958-2030)
   * @param {string} videogameData.clasificacion - Age classification (E, E10+, T, M, AO, RP)
   * @param {string} videogameData.desarrollador - Developer name
   * @returns {Promise<Object>} Created videogame object
   * @throws {Error} When validation fails or user lacks permission
   * 
   * Validates: Requirement 7.4 (adapted for videogames)
   */
  async createVideogame(videogameData) {
    const response = await apiClient.post('/videogames', videogameData)
    return response.data
  },

  /**
   * Update an existing videogame (requires admin authentication)
   * @param {number|string} id - Videogame ID
   * @param {Object} videogameData - Updated videogame data
   * @param {string} [videogameData.titulo] - Videogame title
   * @param {string} [videogameData.genero] - Game genre
   * @param {string} [videogameData.plataforma] - Gaming platform
   * @param {number} [videogameData.anio_lanzamiento] - Release year (1958-2030)
   * @param {string} [videogameData.clasificacion] - Age classification (E, E10+, T, M, AO, RP)
   * @param {string} [videogameData.desarrollador] - Developer name
   * @returns {Promise<Object>} Updated videogame object
   * @throws {Error} When videogame not found, validation fails, or user lacks permission
   * 
   * Validates: Requirement 7.8 (adapted for videogames)
   */
  async updateVideogame(id, videogameData) {
    const response = await apiClient.put(`/videogames/${id}`, videogameData)
    return response.data
  },

  /**
   * Delete a videogame (requires admin authentication)
   * @param {number|string} id - Videogame ID
   * @returns {Promise<void>} No return value (204 status)
   * @throws {Error} When videogame not found or user lacks permission
   * 
   * Validates: Requirement 7.11 (adapted for videogames)
   */
  async deleteVideogame(id) {
    await apiClient.delete(`/videogames/${id}`)
  }
}

export default mediaService
