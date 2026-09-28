# Catalog Components

This directory contains reusable components for displaying and filtering media catalog (movies and videogames).

## Components

### MovieCard.vue

Displays a movie in card format with hover effects.

**Props:**
- `movie` (Object, required) - Movie object with the following fields:
  - `titulo` (string) - Movie title
  - `genero` (string) - Movie genre
  - `anio_lanzamiento` (number) - Release year
  - `plataforma` (string) - Streaming platform
  - `director` (string, optional) - Director name
  - `calificacion` (number, optional) - Rating (0-10)

**Events:**
- `click` - Emitted when card is clicked, passes movie object

**Example:**
```vue
<MovieCard 
  :movie="movie" 
  @click="showMovieDetails" 
/>
```

**Features:**
- Responsive card layout
- Hover scale effect (scale-105)
- Cursor pointer
- Displays rating with star icon
- Keyboard accessible (Enter and Space keys)

---

### VideogameCard.vue

Displays a videogame in card format with hover effects.

**Props:**
- `videogame` (Object, required) - Videogame object with the following fields:
  - `titulo` (string) - Game title
  - `genero` (string) - Game genre
  - `anio_lanzamiento` (number) - Release year
  - `plataforma` (string) - Gaming platform
  - `clasificacion` (string, optional) - ESRB rating (E, E10+, T, M, AO, RP)
  - `desarrollador` (string, optional) - Developer name
  - `numero_jugadores` (string, optional) - Number of players

**Events:**
- `click` - Emitted when card is clicked, passes videogame object

**Example:**
```vue
<VideogameCard 
  :videogame="game" 
  @click="showGameDetails" 
/>
```

**Features:**
- Color-coded ESRB ratings
- Hover scale effect
- Keyboard accessible

---

### MediaGrid.vue

Responsive grid container for media cards.

**Props:** None (uses slot)

**Slots:**
- Default slot - Place MovieCard or VideogameCard components here

**Example:**
```vue
<MediaGrid>
  <MovieCard 
    v-for="movie in movies" 
    :key="movie.id_pelicula"
    :movie="movie"
    @click="handleMovieClick"
  />
</MediaGrid>
```

**Features:**
- Responsive columns:
  - Mobile (< 768px): 1 column
  - Tablet (768px - 1024px): 3 columns
  - Desktop (> 1024px): 4 columns
- CSS Grid with gap-6

---

### MediaFilters.vue

Filter controls for catalog browsing with genre, platform, and year dropdowns.

**Props:**
- `genres` (Array, optional) - Array of available genres
- `platforms` (Array, optional) - Array of available platforms
- `years` (Array, optional) - Array of available years

**Events:**
- `filter(filters)` - Emitted when filters change, passes filter object with keys:
  - `genero` (string, optional)
  - `plataforma` (string, optional)
  - `anio_lanzamiento` (number, optional)

**Example:**
```vue
<MediaFilters 
  :genres="availableGenres"
  :platforms="availablePlatforms"
  :years="availableYears"
  @filter="applyFilters"
/>
```

**Features:**
- Select components for each filter
- "Clear Filters" button
- Responsive grid layout (4 columns on desktop, stacks on mobile)
- Only emits non-empty filter values

---

### MediaDetail.vue

Modal displaying full details of a movie or videogame.

**Props:**
- `media` (Object, required) - Movie or videogame object with full details

**Events:**
- `close` - Emitted when modal is closed

**Example:**
```vue
<MediaDetail 
  v-if="selectedMedia"
  :media="selectedMedia"
  @close="selectedMedia = null"
/>
```

**Features:**
- Automatically detects media type (movie vs videogame)
- Displays all relevant fields
- Formatted duration (for movies)
- Formatted date display
- Color-coded ESRB ratings (for videogames)
- Uses Modal component (size: lg)

---

### Pagination.vue

Pagination controls with page numbers and Previous/Next buttons.

**Props:**
- `currentPage` (Number, required) - Current page number (1-based)
- `totalPages` (Number, required) - Total number of pages

**Events:**
- `change(page)` - Emitted when page changes, passes new page number

**Example:**
```vue
<Pagination 
  :current-page="currentPage"
  :total-pages="totalPages"
  @change="handlePageChange"
/>
```

**Features:**
- Responsive design (simple on mobile, full on desktop)
- Ellipsis for many pages (e.g., 1, 2, 3, '...', 20)
- Disabled Previous on first page
- Disabled Next on last page
- Active page highlighted
- Keyboard accessible

**Pagination Algorithm:**
- Shows all pages if 7 or fewer
- Near start: 1, 2, 3, 4, '...', last
- Middle: 1, '...', current-1, current, current+1, '...', last
- Near end: 1, '...', last-3, last-2, last-1, last

---

## Usage Pattern

Complete example of using catalog components together:

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Movies Catalog</h1>
    
    <!-- Filters -->
    <MediaFilters 
      :genres="genres"
      :platforms="platforms"
      :years="years"
      @filter="handleFilter"
    />
    
    <!-- Loading State -->
    <SkeletonLoader v-if="loading" />
    
    <!-- Media Grid -->
    <MediaGrid v-else-if="movies.length > 0">
      <MovieCard 
        v-for="movie in movies" 
        :key="movie.id_pelicula"
        :movie="movie"
        @click="showDetail"
      />
    </MediaGrid>
    
    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500">No movies found</p>
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      @change="handlePageChange"
    />
    
    <!-- Detail Modal -->
    <MediaDetail 
      v-if="selectedMovie"
      :media="selectedMovie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalog'
import { 
  MediaFilters, 
  MediaGrid, 
  MovieCard, 
  Pagination, 
  MediaDetail 
} from '@/components/catalog'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

const catalogStore = useCatalogStore()
const loading = ref(false)
const selectedMovie = ref(null)
const currentPage = ref(1)
const filters = ref({})

const movies = computed(() => catalogStore.movies)
const totalPages = computed(() => catalogStore.moviesPagination.totalPages)

const genres = computed(() => [...new Set(movies.value.map(m => m.genero))])
const platforms = computed(() => [...new Set(movies.value.map(m => m.plataforma))])
const years = computed(() => [...new Set(movies.value.map(m => m.anio_lanzamiento))])

const fetchMovies = async () => {
  loading.value = true
  try {
    await catalogStore.fetchMovies({
      ...filters.value,
      page: currentPage.value
    })
  } finally {
    loading.value = false
  }
}

const handleFilter = (newFilters) => {
  filters.value = newFilters
  currentPage.value = 1
  fetchMovies()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchMovies()
}

const showDetail = (movie) => {
  selectedMovie.value = movie
}

onMounted(() => {
  fetchMovies()
})
</script>
```

## Accessibility

All catalog components follow accessibility best practices:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **ARIA Labels**: Proper ARIA labels on pagination controls
- **Focus Management**: Modal traps focus when open
- **Color Contrast**: Sufficient contrast ratios for text
- **Semantic HTML**: Proper use of semantic elements (nav, button, etc.)

## Styling

Components use Tailwind CSS utility classes with:
- Responsive breakpoints (sm, md, lg)
- Consistent color scheme (blue for primary actions)
- Hover effects (scale, background color changes)
- Smooth transitions (duration-200)

## Requirements Validation

These components validate the following requirements:
- **5.1**: Display movie and videogame cards with key information
- **5.2**: Display genre, platform, year, and media-specific fields
- **5.6**: Responsive grid with 1/3/4 columns, detail modal
- **5.7**: Pagination with Previous/Next and page numbers
- **5.8**: Filter dropdowns for genre, platform, year with Clear button
