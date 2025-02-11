<template>
  <div class="w-screen min-h-screen overflow-auto relative bg-[#161616]">
    <client-only v-if="showLazyBackground">
      <LazyBackground />
    </client-only>
    <div class="mx-5">
      <div class="max-w-2xl relative z-20 w-full mx-auto mt-20">
        <!-- Main Content -->
        <div class="flex flex-col items-start mb-20 relative z-30">
          <span class="text-white text-5xl font-manrope font-bold mb-5">Aarjav Jain</span>
          <span class="text-[#a0a0a0] text-2xl font-manrope mt-1">Infrastructure enthusiast.</span>
          <span class="text-[#a0a0a0] text-2xl font-manrope">
            Working on <a href="https://nexusplay.net" class="animated-underline text-white">@NexusPlay</a>
          </span>

          <!-- Location and Time -->
          <div class="flex items-center gap-2 mt-6 text-[#a0a0a0] text-sm font-manrope">
            <span class="flex flex-row items-center gap-3 text-lg">
              <LucideMapPin /> Delhi, India
            </span>
            <span>•</span>
            <span class="text-lg">{{ currentTime }}</span>
          </div>

          <!-- Resume Download Button -->
          <div class="flex items-center gap-4 mt-4">
            <a href="/resume.pdf" download
              class="flex items-center gap-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
              <LucideDownload class="w-5 h-5" />
              <span class="font-semibold">Resume</span>
            </a>
            <a href="https://github.com/BeanieMen" target="_blank"
              class="p-2 bg-white rounded-lg hover:opacity-80 transition" aria-label="Visit BeanieMen's GitHub profile">
              <LucideGithub class="w-6 h-6 text-black" />
            </a>
          </div>
        </div>

        <!-- Skills -->
        <div class="relative z-30">
          <h2 class="text-white text-5xl font-manrope font-semibold mb-6">Skills</h2>
          <div class="flex flex-wrap gap-4">
            <a v-for="skill in skills" :key="skill.name" :href="skill.url" target="_blank"
              class="flex items-center gap-1 px-2 py-1 border border-gray-500 rounded-md bg-[#212121] text-white shadow-md hover:bg-[#333333] transition">
              <Icon :name="skill.icon" class="w-5 h-5" />
              <span class="font-manrope">{{ skill.name }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';

const showLazyBackground = ref(false);
const LazyBackground = defineAsyncComponent(() =>
  import('~/components/Background.vue')
);

const skills = ref([
  { name: 'TypeScript', icon: 'logos:typescript-icon', url: 'https://www.typescriptlang.org/' },
  { name: 'Nuxt', icon: 'logos:nuxt-icon', url: 'https://nuxt.com/' },
  { name: 'Docker', icon: 'logos:docker-icon', url: 'https://www.docker.com/' },
  { name: 'CI/CD', icon: 'logos:github-actions', url: 'https://github.com/features/actions' },
  { name: 'REST APIs', icon: 'logos:rest', url: 'https://restfulapi.net/' },
  { name: 'Git', icon: 'logos:git-icon', url: 'https://git-scm.com/' },
  { name: 'Bash', icon: 'logos:bash-icon', url: 'https://www.gnu.org/software/bash/' },
  { name: 'Linux', icon: 'logos:linux-tux', url: 'https://www.linux.org/' },
  { name: 'Three.js', icon: 'logos:threejs', url: 'https://threejs.org/' },
  { name: 'Vitest', icon: 'logos:vitest', url: 'https://vitest.dev/' },
  { name: 'WebGL', icon: 'mdi:cube-scan', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API' },
  { name: 'Oracle', icon: 'simple-icons:oracle', url: 'https://www.oracle.com/' }
]);

const currentTime = ref('');

const updateTime = () => {
  const options = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  currentTime.value = new Intl.DateTimeFormat('en-US', options).format(new Date());
};

let interval;
onMounted(() => {
  updateTime();
  interval = setInterval(updateTime, 1000);

  // Use two successive requestAnimationFrame calls to wait until after the first paint.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      showLazyBackground.value = true;
    });
  });
});

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style>
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400;
  src: url('@/assets/fonts/Manrope-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  src: url('@/assets/fonts/Manrope-Bold.woff2') format('woff2');
}

.font-manrope {
  font-family: 'Manrope', sans-serif;
}

.animated-underline {
  position: relative;
  text-decoration: none;
}

.animated-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed, #6d28d9, #5b21b6, #6d28d9, #7c3aed, #8b5cf6);
  background-size: 200% auto;
  animation: gradientScroll 3s linear infinite;
}

@keyframes gradientScroll {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: -200% center;
  }
}
</style>
