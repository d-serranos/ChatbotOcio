/**
 * Authentication Service
 * 
 * Handles authentication API calls for user registration and login.
 * Uses the configured API client with error handling.
 */

import apiClient from './api.js'

const authService = {
  /**
   * Register a new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.nombre - User's name
   * @param {string} userData.correo - User's email
   * @param {string} userData.contrasena - User's password
   * @returns {Promise<Object>} JWT token response { access_token, token_type }
   * @throws {Error} When registration fails (handled by API interceptor)
   */
  async register(userData) {
    // Map contrasena to clave for backend compatibility
    const response = await apiClient.post('/auth/register', {
      nombre: userData.nombre,
      correo: userData.correo,
      clave: userData.contrasena,
      rol: userData.rol || 'user'
    })
    return response.data
  },

  /**
   * Authenticate user with credentials
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.correo - User's email
   * @param {string} credentials.contrasena - User's password
   * @returns {Promise<Object>} JWT token response { access_token, token_type }
   * @throws {Error} When login fails (handled by API interceptor)
   */
  async login(credentials) {
    // Map contrasena to clave for backend compatibility
    const response = await apiClient.post('/auth/login', {
      correo: credentials.correo,
      clave: credentials.contrasena
    })
    return response.data
  }
}

export default authService
