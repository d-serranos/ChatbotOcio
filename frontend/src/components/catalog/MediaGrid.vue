<template>
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <slot />
  </div>
</template>

<script setup>
/**
 * MediaGrid Component
 * 
 * Responsive grid layout container for media cards.
 * Uses CSS Grid with Tailwind responsive breakpoints:
 * - Mobile (< 768px): 1 column
 * - Tablet (768px - 1024px): 3 columns
 * - Desktop (> 1024px): 4 columns
 * 
 * Usage:
 * <MediaGrid>
 *   <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
 * </MediaGrid>
 * 
 * Validates: Requirements 5.6
 */
</script>
