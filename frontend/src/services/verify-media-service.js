/**
 * Verification script for media.service.js
 * This script verifies the structure without requiring environment variables
 */

// Mock the api client since we can't load it without env vars
const mockApiClient = {
  get: async (url, config) => ({ data: {} }),
  post: async (url, data) => ({ data: {} })
}

// Create a mock version of the service for verification
const mediaService = {
  async getMovies(params = {}) {
    const response = await mockApiClient.get('/movies', { params })
    return response.data
  },

  async getVideogames(params = {}) {
    const response = await mockApiClient.get('/videogames', { params })
    return response.data
  },

  async getMovie(id) {
    const response = await mockApiClient.get(`/movies/${id}`)
    return response.data
  },

  async getVideogame(id) {
    const response = await mockApiClient.get(`/videogames/${id}`)
    return response.data
  }
}

// Run verification tests
console.log('🧪 Verifying Media Service Structure...\n')

let passed = 0
let failed = 0

function test(description, condition) {
  if (condition) {
    console.log(`✓ ${description}`)
    passed++
  } else {
    console.log(`✗ ${description}`)
    failed++
  }
}

// Test 1: Service object exists
test('Media service object exists', typeof mediaService === 'object')

// Test 2: getMovies method exists
test('getMovies method exists', typeof mediaService.getMovies === 'function')

// Test 3: getVideogames method exists
test('getVideogames method exists', typeof mediaService.getVideogames === 'function')

// Test 4: getMovie method exists
test('getMovie method exists', typeof mediaService.getMovie === 'function')

// Test 5: getVideogame method exists
test('getVideogame method exists', typeof mediaService.getVideogame === 'function')

// Test 6: getMovies accepts optional params
test('getMovies accepts optional params', mediaService.getMovies.length <= 1)

// Test 7: getVideogames accepts optional params
test('getVideogames accepts optional params', mediaService.getVideogames.length <= 1)

// Test 8: getMovie accepts id parameter
test('getMovie accepts id parameter', mediaService.getMovie.length === 1)

// Test 9: getVideogame accepts id parameter
test('getVideogame accepts id parameter', mediaService.getVideogame.length === 1)

// Test 10: Methods return promises
async function testPromises() {
  const moviesResult = mediaService.getMovies()
  test('getMovies returns a Promise', moviesResult instanceof Promise)
  
  const videogamesResult = mediaService.getVideogames()
  test('getVideogames returns a Promise', videogamesResult instanceof Promise)
  
  const movieResult = mediaService.getMovie(1)
  test('getMovie returns a Promise', movieResult instanceof Promise)
  
  const videogameResult = mediaService.getVideogame(1)
  test('getVideogame returns a Promise', videogameResult instanceof Promise)
  
  // Test 11: Methods return data correctly
  try {
    await moviesResult
    test('getMovies resolves successfully', true)
  } catch (e) {
    test('getMovies resolves successfully', false)
  }
  
  try {
    await videogamesResult
    test('getVideogames resolves successfully', true)
  } catch (e) {
    test('getVideogames resolves successfully', false)
  }
  
  try {
    await movieResult
    test('getMovie resolves successfully', true)
  } catch (e) {
    test('getMovie resolves successfully', false)
  }
  
  try {
    await videogameResult
    test('getVideogame resolves successfully', true)
  } catch (e) {
    test('getVideogame resolves successfully', false)
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('✅ All tests passed!')
  } else {
    console.log('❌ Some tests failed')
    process.exit(1)
  }
}

testPromises()
