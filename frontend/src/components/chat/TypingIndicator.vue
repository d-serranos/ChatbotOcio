<template>
  <div class="flex justify-start mb-4">
    <div class="bg-gray-200 text-gray-900 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
      <div class="flex items-center gap-1">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed - purely visual component
</script>

<style scoped>
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #6b7280;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
