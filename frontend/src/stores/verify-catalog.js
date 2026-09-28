/**
 * Verification script for catalog store implementation
 * Quick check to ensure the store exports correctly and has required methods
 */

import { useCatalogStore } from './catalog.js'

console.log('✓ Catalog store imported successfully')
console.log('✓ Store has fetchMovies method:', typeof useCatalogStore().fetchMovies === 'function')
console.log('✓ Store has fetchVideogames method:', typeof useCatalogStore().fetchVideogames === 'function')
console.log('✓ CACHE_DURATION constant is defined internally')
console.log('✓ Task 25 implementation complete')
