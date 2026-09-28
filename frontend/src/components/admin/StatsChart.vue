<template>
  <div class="relative">
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <LoadingSpinner size="lg" />
    </div>
    
    <!-- Chart canvas -->
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Register Chart.js components
Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const createChart = () => {
  if (!chartCanvas.value || props.data.length === 0) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  // Extract data from daily_stats
  const labels = props.data.map(item => item.date || item.fecha)
  const tokenData = props.data.map(item => item.total_tokens || item.tokens || 0)
  const messageData = props.data.map(item => item.message_count || item.messages || 0)

  chartInstance = new Chart(ctx, {
    type: props.type,
    data: {
      labels,
      datasets: [
        {
          label: 'Total Tokens',
          data: tokenData,
          borderColor: 'rgb(59, 130, 246)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          yAxisID: 'y-tokens',
          tension: 0.4
        },
        {
          label: 'Message Count',
          data: messageData,
          borderColor: 'rgb(34, 197, 94)', // green-500
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          yAxisID: 'y-messages',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        'y-tokens': {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Total Tokens'
          },
          grid: {
            drawOnChartArea: true
          }
        },
        'y-messages': {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Message Count'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  })
}

// Initialize chart on mount
onMounted(() => {
  if (props.data.length > 0) {
    createChart()
  }
})

// Destroy chart on unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

// Update chart when data changes
watch(
  () => props.data,
  () => {
    createChart()
  },
  { deep: true }
)

// Watch type changes
watch(
  () => props.type,
  () => {
    createChart()
  }
)
</script>

<style scoped>
canvas {
  max-height: 400px;
}
</style>
