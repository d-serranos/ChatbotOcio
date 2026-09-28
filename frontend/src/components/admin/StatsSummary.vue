<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {{ title }}
        </p>
        <p class="mt-2 text-3xl font-bold text-gray-900">
          {{ formattedValue }}
        </p>
      </div>
      
      <!-- Icon -->
      <div 
        class="flex-shrink-0 p-3 rounded-full"
        :class="iconBackgroundClass"
      >
        <component 
          :is="iconComponent" 
          class="h-8 w-8"
          :class="iconColorClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  FilmIcon,
  PuzzlePieceIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  },
  icon: {
    type: String,
    default: 'chart',
    validator: (value) => ['cpu', 'chat', 'users', 'film', 'puzzle', 'chart'].includes(value)
  }
})

// Map icon name to component
const iconComponent = computed(() => {
  const iconMap = {
    cpu: CpuChipIcon,
    chat: ChatBubbleLeftRightIcon,
    users: UsersIcon,
    film: FilmIcon,
    puzzle: PuzzlePieceIcon,
    chart: ChartBarIcon
  }
  return iconMap[props.icon] || ChartBarIcon
})

// Icon color classes
const iconColorClass = computed(() => {
  const colorMap = {
    cpu: 'text-blue-600',
    chat: 'text-green-600',
    users: 'text-purple-600',
    film: 'text-red-600',
    puzzle: 'text-yellow-600',
    chart: 'text-indigo-600'
  }
  return colorMap[props.icon] || 'text-gray-600'
})

// Icon background color classes
const iconBackgroundClass = computed(() => {
  const bgMap = {
    cpu: 'bg-blue-100',
    chat: 'bg-green-100',
    users: 'bg-purple-100',
    film: 'bg-red-100',
    puzzle: 'bg-yellow-100',
    chart: 'bg-indigo-100'
  }
  return bgMap[props.icon] || 'bg-gray-100'
})

// Format large numbers with commas
const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})
</script>
