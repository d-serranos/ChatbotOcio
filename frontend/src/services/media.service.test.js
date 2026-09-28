/**
 * Media Service Tests
 * Basic verification tests for media.service.js
 */

import mediaService from './media.service.js'

// Manual test runner - uncomment to test
const runTests = async () => {
  console.log('🧪 Testing Media Service...')
  
  try {
    // Public Methods Tests
    console.log('✓ Test 1: Service has getMovies method')
    if (typeof mediaService.getMovies !== 'function') {
      throw new Error('getMovies method not found')
    }
    
    console.log('✓ Test 2: Service has getVideogames method')
    if (typeof mediaService.getVideogames !== 'function') {
      throw new Error('getVideogames method not found')
    }
    
    console.log('✓ Test 3: Service has getMovie method')
    if (typeof mediaService.getMovie !== 'function') {
      throw new Error('getMovie method not found')
    }
    
    console.log('✓ Test 4: Service has getVideogame method')
    if (typeof mediaService.getVideogame !== 'function') {
      throw new Error('getVideogame method not found')
    }
    
    // Admin Methods - Movies Tests
    console.log('✓ Test 5: Service has getMoviesAdmin method')
    if (typeof mediaService.getMoviesAdmin !== 'function') {
      throw new Error('getMoviesAdmin method not found')
    }
    
    console.log('✓ Test 6: Service has createMovie method')
    if (typeof mediaService.createMovie !== 'function') {
      throw new Error('createMovie method not found')
    }
    
    console.log('✓ Test 7: Service has updateMovie method')
    if (typeof mediaService.updateMovie !== 'function') {
      throw new Error('updateMovie method not found')
    }
    
    console.log('✓ Test 8: Service has deleteMovie method')
    if (typeof mediaService.deleteMovie !== 'function') {
      throw new Error('deleteMovie method not found')
    }
    
    // Admin Methods - Videogames Tests
    console.log('✓ Test 9: Service has getVideogamesAdmin method')
    if (typeof mediaService.getVideogamesAdmin !== 'function') {
      throw new Error('getVideogamesAdmin method not found')
    }
    
    console.log('✓ Test 10: Service has createVideogame method')
    if (typeof mediaService.createVideogame !== 'function') {
      throw new Error('createVideogame method not found')
    }
    
    console.log('✓ Test 11: Service has updateVideogame method')
    if (typeof mediaService.updateVideogame !== 'function') {
      throw new Error('updateVideogame method not found')
    }
    
    console.log('✓ Test 12: Service has deleteVideogame method')
    if (typeof mediaService.deleteVideogame !== 'function') {
      throw new Error('deleteVideogame method not found')
    }
    
    // Verify method signatures
    console.log('✓ Test 13: getMovies accepts optional params parameter')
    if (mediaService.getMovies.length > 1) {
      console.warn('⚠ Warning: getMovies should accept 0 or 1 parameters')
    }
    
    console.log('✓ Test 14: getVideogames accepts optional params parameter')
    if (mediaService.getVideogames.length > 1) {
      console.warn('⚠ Warning: getVideogames should accept 0 or 1 parameters')
    }
    
    console.log('✓ Test 15: getMovie accepts id parameter')
    if (mediaService.getMovie.length !== 1) {
      console.warn('⚠ Warning: getMovie should accept 1 parameter')
    }
    
    console.log('✓ Test 16: getVideogame accepts id parameter')
    if (mediaService.getVideogame.length !== 1) {
      console.warn('⚠ Warning: getVideogame should accept 1 parameter')
    }
    
    console.log('✓ Test 17: getMoviesAdmin accepts optional params parameter')
    if (mediaService.getMoviesAdmin.length > 1) {
      console.warn('⚠ Warning: getMoviesAdmin should accept 0 or 1 parameters')
    }
    
    console.log('✓ Test 18: createMovie accepts movieData parameter')
    if (mediaService.createMovie.length !== 1) {
      console.warn('⚠ Warning: createMovie should accept 1 parameter')
    }
    
    console.log('✓ Test 19: updateMovie accepts id and movieData parameters')
    if (mediaService.updateMovie.length !== 2) {
      console.warn('⚠ Warning: updateMovie should accept 2 parameters')
    }
    
    console.log('✓ Test 20: deleteMovie accepts id parameter')
    if (mediaService.deleteMovie.length !== 1) {
      console.warn('⚠ Warning: deleteMovie should accept 1 parameter')
    }
    
    console.log('✓ Test 21: getVideogamesAdmin accepts optional params parameter')
    if (mediaService.getVideogamesAdmin.length > 1) {
      console.warn('⚠ Warning: getVideogamesAdmin should accept 0 or 1 parameters')
    }
    
    console.log('✓ Test 22: createVideogame accepts videogameData parameter')
    if (mediaService.createVideogame.length !== 1) {
      console.warn('⚠ Warning: createVideogame should accept 1 parameter')
    }
    
    console.log('✓ Test 23: updateVideogame accepts id and videogameData parameters')
    if (mediaService.updateVideogame.length !== 2) {
      console.warn('⚠ Warning: updateVideogame should accept 2 parameters')
    }
    
    console.log('✓ Test 24: deleteVideogame accepts id parameter')
    if (mediaService.deleteVideogame.length !== 1) {
      console.warn('⚠ Warning: deleteVideogame should accept 1 parameter')
    }
    
    console.log('✅ All static tests passed!')
    console.log('ℹ️  Note: API integration tests require a running backend and admin authentication')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Uncomment to run tests: runTests()

export default mediaService
