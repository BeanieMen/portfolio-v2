<template>
  <div class="w-screen min-h-screen overflow-auto relative">
    <client-only>
      <Background />
    </client-only>

    <div class="max-w-2xl relative z-20 w-full mx-auto mt-20">

      <!-- Main -->
      <div class="flex flex-col items-start mb-20">
        <span class="text-white text-5xl font-manrope font-bold mb-5">Aarjav Jain</span>
        <span class="text-[#a0a0a0] text-2xl font-manrope mt-1">Infrastructure enthusiast.</span>
        <span class="text-[#a0a0a0] text-2xl font-manrope">
          Working on <a href="https://nexusplay.net" class="animated-underline text-white">@NexusPlay</a>
        </span>

        <div class="flex items-center gap-4 mt-6">
          <a href="/resume.pdf" download
            class="flex items-center gap-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition">
            <LucideDownload class="w-5 h-5" />
            <span class="font-semibold">Resume</span>
          </a>

          <a href="https://github.com/BeanieMen" target="_blank"
            class="p-2 bg-white rounded-lg hover:opacity-80 transition">
            <LucideGithub class="w-6 h-6 text-black" />
          </a>
        </div>
      </div>
      
      <!-- Skills -->
      <div>
        <h2 class="text-white text-5xl font-manrope font-semibold mb-6">Skills</h2>
        <div class="flex flex-wrap gap-4">
          <div v-for="skill in skills" :key="skill.name"
            class="flex items-center gap-1 px-2 py-1 border border-gray-500 rounded-md bg-[#212121] text-white shadow-md">
            <Icon :name="skill.icon" class="w-5 h-5" />
            <span class="font-manrope">{{ skill.name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const skills = ref([
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Nuxt', icon: 'logos:nuxt-icon' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'CI/CD', icon: 'logos:github-actions' },
  { name: 'REST APIs', icon: 'logos:rest' },
  { name: 'Git', icon: 'logos:git-icon' },
  { name: 'Bash', icon: 'logos:bash-icon' },
  { name: 'Linux', icon: 'logos:linux-tux' },
  { name: 'Three.js', icon: 'logos:threejs' },
  { name: 'DevOps', icon: 'logos:aws' }, // Example for DevOps
  { name: 'Vitest', icon: 'logos:vitest' },
  { name: 'WebGL', icon: 'mdi:cube-scan' },
  { name: 'Oracle', icon: 'simple-icons:oracle' }
]);
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700&display=swap');

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
  height: 2px;
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
