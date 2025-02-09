<template>
  <div ref="backgroundRef" class="absolute inset-0 w-full bg-black">
    <div class="grid grid-cols-10 md:grid-cols-12 w-full" :style="{ height: gridHeight + 'px' }">
      <div
        v-for="n in boxCount"
        :key="n"
        class="aspect-square bg-[#161616] border border-[#262626] box-border 
               transition-colors hover:bg-[#333333] 
               duration-700 hover:duration-75"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const boxCount = ref(0)
const gridHeight = ref(window.innerHeight) // Default to viewport height
const backgroundRef = ref(null)

const calculateBoxes = () => {
  if (!backgroundRef.value) return

  const contentHeight = document.body.scrollHeight // Get total page height
  gridHeight.value = Math.max(contentHeight, window.innerHeight) // Ensure grid height matches content
  const boxSize = window.innerWidth / (window.innerWidth < 768 ? 10 : 12)
  const rows = Math.ceil(gridHeight.value / boxSize)
  boxCount.value = rows * (window.innerWidth < 768 ? 10 : 12)
}

onMounted(() => {
  nextTick(() => calculateBoxes()) // Wait for content to be rendered
  window.addEventListener('resize', calculateBoxes)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateBoxes)
})
</script>
