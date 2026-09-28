/**
 * Catalog Store Tests
 * 
 * Tests for the catalog store public methods (fetchMovies and fetchVideogames)
 * Validates caching behavior and pagination updates
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCatalogStore } from './catalog.js'
import mediaService from '@/services/media.service.js'

// Mock the media service
vi.mock('@/services/media.service.js', () => ({
  default: {
    getMovies: vi.fn(),
    getVideogames: vi.fn()
  }
}))

describe('catalogStore - Public Methods', () => {
  let store

  beforeEach(() => {
    // Create a fresh pinia instance before each test
    setActivePinia(createPinia())
    store = useCatalogStore()
    
    // Clear all mocks
    vi.clearAllMocks()
  })

  describe('fetchMovies', () => {
    const mockMoviesResponse = {
      items: [
        { id_pelicula: 1, titulo: 'Movie 1', genero: 'Action' },
        { id_pelicula: 2, titulo: 'Movie 2', genero: 'Drama' }
      ],
      page: 1,
      total_pages: 3,
      total: 30
    }

    it('should fetch movies from API and update state', async () => {
      mediaService.getMovies.mockResolvedValue(mockMoviesResponse)

      await store.fetchMovies({ page: 1 })

      expect(mediaService.getMovies).toHaveBeenCalledWith({ page: 1 })
      expect(store.movies).toEqual(mockMoviesResponse.items)
      expect(store.moviesPagination).toEqual({
        currentPage: 1,
        totalPages: 3,
        totalItems: 30
      })
      expect(store.loading).toBe(false)
    })

    it('should cache movies response with timestamp', async () => {
      mediaService.getMovies.mockResolvedValue(mockMoviesResponse)

      const params = { genero: 'Action', page: 1 }
      await store.fetchMovies(params)

      const cacheKey = JSON.stringify(params)
      expect(store.moviesCache[cacheKey]).toBeDefined()
      expect(store.moviesCache[cacheKey].data).toEqual(mockMoviesResponse.items)
      expect(store.moviesCache[cacheKey].timestamp).toBeGreaterThan(0)
    })

    it('should return cached data when cache is valid', async () => {
      mediaService.getMovies.mockResolvedValue(mockMoviesResponse)

      const params = { genero: 'Action' }
      
      // First call - should fetch from API
      await store.fetchMovies(params)
      expect(mediaService.getMovies).toHaveBeenCalledTimes(1)

      // Second call - should use cache
      await store.fetchMovies(params)
      expect(mediaService.getMovies).toHaveBeenCalledTimes(1) // Still only 1 call
    })

    it('should fetch new data when cache is expired', async () => {
      mediaService.getMovies.mockResolvedValue(mockMoviesResponse)

      const params = { genero: 'Action' }
      
      // First call
      await store.fetchMovies(params)
      
      // Manually expire the cache
      const cacheKey = JSON.stringify(params)
      store.moviesCache[cacheKey].timestamp = Date.now() - (6 * 60 * 1000) // 6 minutes ago
      
      // Second call - should fetch from API again
      await store.fetchMovies(params)
      expect(mediaService.getMovies).toHaveBeenCalledTimes(2)
    })

    it('should handle API response without pagination metadata', async () => {
      const simpleResponse = [
        { id_pelicula: 1, titulo: 'Movie 1' },
        { id_pelicula: 2, titulo: 'Movie 2' }
      ]
      mediaService.getMovies.mockResolvedValue(simpleResponse)

      await store.fetchMovies()

      expect(store.movies).toEqual(simpleResponse)
      expect(store.moviesPagination).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 2
      })
    })

    it('should set loading to false on error', async () => {
      mediaService.getMovies.mockRejectedValue(new Error('API Error'))

      try {
        await store.fetchMovies()
      } catch (error) {
        // Expected to throw
      }

      expect(store.loading).toBe(false)
    })
  })

  describe('fetchVideogames', () => {
    const mockVideogamesResponse = {
      items: [
        { id_videojuego: 1, titulo: 'Game 1', genero: 'RPG' },
        { id_videojuego: 2, titulo: 'Game 2', genero: 'Action' }
      ],
      page: 1,
      total_pages: 2,
      total: 20
    }

    it('should fetch videogames from API and update state', async () => {
      mediaService.getVideogames.mockResolvedValue(mockVideogamesResponse)

      await store.fetchVideogames({ page: 1 })

      expect(mediaService.getVideogames).toHaveBeenCalledWith({ page: 1 })
      expect(store.videogames).toEqual(mockVideogamesResponse.items)
      expect(store.videogamesPagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalItems: 20
      })
      expect(store.loading).toBe(false)
    })

    it('should cache videogames response with timestamp', async () => {
      mediaService.getVideogames.mockResolvedValue(mockVideogamesResponse)

      const params = { clasificacion: 'T', page: 1 }
      await store.fetchVideogames(params)

      const cacheKey = JSON.stringify(params)
      expect(store.videogamesCache[cacheKey]).toBeDefined()
      expect(store.videogamesCache[cacheKey].data).toEqual(mockVideogamesResponse.items)
      expect(store.videogamesCache[cacheKey].timestamp).toBeGreaterThan(0)
    })

    it('should return cached data when cache is valid', async () => {
      mediaService.getVideogames.mockResolvedValue(mockVideogamesResponse)

      const params = { genero: 'RPG' }
      
      // First call - should fetch from API
      await store.fetchVideogames(params)
      expect(mediaService.getVideogames).toHaveBeenCalledTimes(1)

      // Second call - should use cache
      await store.fetchVideogames(params)
      expect(mediaService.getVideogames).toHaveBeenCalledTimes(1) // Still only 1 call
    })

    it('should fetch new data when cache is expired', async () => {
      mediaService.getVideogames.mockResolvedValue(mockVideogamesResponse)

      const params = { plataforma: 'PlayStation' }
      
      // First call
      await store.fetchVideogames(params)
      
      // Manually expire the cache
      const cacheKey = JSON.stringify(params)
      store.videogamesCache[cacheKey].timestamp = Date.now() - (6 * 60 * 1000) // 6 minutes ago
      
      // Second call - should fetch from API again
      await store.fetchVideogames(params)
      expect(mediaService.getVideogames).toHaveBeenCalledTimes(2)
    })
  })

  describe('Cache behavior', () => {
    it('should use different cache entries for different parameters', async () => {
      const response1 = { items: [{ id_pelicula: 1 }], page: 1, total_pages: 1, total: 1 }
      const response2 = { items: [{ id_pelicula: 2 }], page: 2, total_pages: 2, total: 2 }
      
      mediaService.getMovies.mockResolvedValueOnce(response1).mockResolvedValueOnce(response2)

      await store.fetchMovies({ page: 1 })
      await store.fetchMovies({ page: 2 })

      // Both should have been called since params are different
      expect(mediaService.getMovies).toHaveBeenCalledTimes(2)
      
      // Check that both are cached separately
      expect(Object.keys(store.moviesCache)).toHaveLength(2)
    })
  })
})
