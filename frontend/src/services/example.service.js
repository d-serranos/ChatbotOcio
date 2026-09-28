/**
 * Example Service
 * Demonstrates how to use the API client for making requests
 */

import apiClient from './api.js'

const exampleService = {
  /**
   * Example GET request
   * @returns {Promise<Array>} List of movies
   */
  async getMovies() {
    const response = await apiClient.get('/movies')
    return response.data
  },

  /**
   * Example GET request with query parameters
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Filtered list of movies
   */
  async getMoviesWithFilters(params = {}) {
    const response = await apiClient.get('/movies', { params })
    return response.data
  },

  /**
   * Example GET request with path parameter
   * @param {number} id - Movie ID
   * @returns {Promise<Object>} Movie details
   */
  async getMovieById(id) {
    const response = await apiClient.get(`/movies/${id}`)
    return response.data
  },

  /**
   * Example POST request
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} Authentication response
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  /**
   * Example POST request with error handling
   * @param {Object} movieData - Movie data
   * @returns {Promise<Object>} Created movie
   */
  async createMovie(movieData) {
    try {
      const response = await apiClient.post('/movies', movieData)
      return response.data
    } catch (error) {
      // Handle validation errors
      if (error.validationErrors) {
        console.error('Validation errors:', error.validationErrors)
        throw new Error('Validation failed')
      }
      throw error
    }
  },

  /**
   * Example PUT request
   * @param {number} id - Movie ID
   * @param {Object} movieData - Updated movie data
   * @returns {Promise<Object>} Updated movie
   */
  async updateMovie(id, movieData) {
    const response = await apiClient.put(`/movies/${id}`, movieData)
    return response.data
  },

  /**
   * Example DELETE request
   * @param {number} id - Movie ID
   * @returns {Promise<void>}
   */
  async deleteMovie(id) {
    await apiClient.delete(`/movies/${id}`)
  },

  /**
   * Example request with custom headers
   * @returns {Promise<Object>}
   */
  async customHeaderRequest() {
    const response = await apiClient.get('/movies', {
      headers: {
        'X-Custom-Header': 'custom-value'
      }
    })
    return response.data
  },

  /**
   * Example request with timeout override
   * @returns {Promise<Object>}
   */
  async slowRequest() {
    const response = await apiClient.get('/slow-endpoint', {
      timeout: 60000 // Override default 30s timeout
    })
    return response.data
  }
}

export default exampleService
