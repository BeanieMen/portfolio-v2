<template>
  <div ref="backgroundRef" class="absolute inset-0 w-full bg-black z-0">
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';

const backgroundRef = ref(null);
const boxCount = ref(0);
const gridHeight = ref(0);

const { width: windowWidth } = useWindowSize();

const columns = computed(() => (windowWidth.value < 768 ? 10 : 12));

const calculateBoxes = () => {
  if (!backgroundRef.value || typeof window === 'undefined') return;
  const contentHeight = document.body.scrollHeight;
  gridHeight.value = Math.max(contentHeight, window.innerHeight);
  const boxSize = windowWidth.value / columns.value;
  const rows = Math.ceil(gridHeight.value / boxSize);
  boxCount.value = rows * columns.value;
};

let resizeTimeout;
const onResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    calculateBoxes();
  }, 100);
};

onMounted(() => {
  calculateBoxes();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>
