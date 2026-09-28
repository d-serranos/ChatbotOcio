/**
 * Statistics Service
 * 
 * Handles API calls for admin statistics and usage analytics.
 * Provides methods for fetching token consumption and user activity data.
 * 
 * Validates: Requirements 6.2, 6.5
 */

import apiClient from './api.js'

const statisticsService = {
  /**
   * Get statistics data with optional date range filters
   * @param {Object} params - Query parameters for filtering
   * @param {string} params.start_date - Start date in YYYY-MM-DD format (optional)
   * @param {string} params.end_date - End date in YYYY-MM-DD format (optional)
   * @returns {Promise<Object>} Statistics response with token consumption and user data
   * @throws {Error} When request fails (handled by API interceptor)
   * 
   * Response format:
   * {
   *   totalTokens: number,
   *   totalMessages: number,
   *   totalUsers: number,
   *   dailyStats: Array<{ date: string, tokens: number, messages: number }>,
   *   userStats: Array<{ user_name: string, message_count: number, total_tokens: number }>
   * }
   */
  async getStatistics(params = {}) {
    const response = await apiClient.get('/statistics', { params })
    return response.data
  }
}

export default statisticsService
