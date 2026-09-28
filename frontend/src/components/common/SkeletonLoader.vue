<template>
  <!-- Card Grid Skeleton -->
  <div v-if="type === 'card-grid'" :class="gridContainerClasses">
    <div
      v-for="index in count"
      :key="index"
      class="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div class="bg-gray-300 h-48 animate-pulse" />
      <div class="p-4 space-y-3">
        <div class="h-6 bg-gray-300 rounded animate-pulse w-3/4" />
        <div class="h-4 bg-gray-300 rounded animate-pulse w-full" />
        <div class="h-4 bg-gray-300 rounded animate-pulse w-2/3" />
        <div class="h-4 bg-gray-300 rounded animate-pulse w-1/2" />
      </div>
    </div>
  </div>

  <!-- Table Skeleton -->
  <div v-else-if="type === 'table'" class="bg-white rounded-lg shadow overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col"
              class="px-6 py-3 text-left"
            >
              <div class="h-4 bg-gray-300 rounded animate-pulse w-20" />
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="row in rows" :key="row">
            <td
              v-for="col in columns"
              :key="col"
              class="px-6 py-4"
            >
              <div class="h-4 bg-gray-300 rounded animate-pulse" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Default Skeleton Types -->
  <div v-else :class="containerClasses">
    <div
      v-for="index in count"
      :key="index"
      :class="skeletonClasses"
      :style="skeletonStyle"
    >
      <div class="animate-pulse bg-gray-300 h-full w-full rounded" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'title', 'card', 'card-grid', 'table', 'circle', 'custom'].includes(value)
  },
  count: {
    type: Number,
    default: 1
  },
  columns: {
    type: Number,
    default: 5
  },
  rows: {
    type: Number,
    default: 5
  },
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
})

const gridContainerClasses = computed(() => {
  return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${props.className}`
})

const containerClasses = computed(() => {
  return `space-y-3 ${props.className}`
})

const skeletonClasses = computed(() => {
  const typeClasses = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-48 w-full rounded-lg',
    circle: 'h-12 w-12 rounded-full',
    custom: ''
  }
  
  return typeClasses[props.type]
})

const skeletonStyle = computed(() => {
  const style = {}
  
  if (props.width) {
    style.width = props.width
  }
  
  if (props.height) {
    style.height = props.height
  }
  
  return style
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
