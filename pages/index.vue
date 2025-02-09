<template>
  <div class="w-screen min-h-screen overflow-auto relative">
    <client-only>
      <Background />
    </client-only>
    <div class="max-w-2xl relative z-20 w-full mx-auto mt-20">
      <div class="flex flex-col">
        <span class="text-white text-5xl font-manrope font-bold mb-5">Aarjav Jain</span>
        <span class="text-[#a0a0a0] text-2xl font-manrope mt-1">Infrastructure enthusiast.</span>
        <span class="text-[#a0a0a0] text-2xl font-manrope">Working on <a href="https://nexusplay.net"
          class="animated-underline">@NexusPlay</a></span>
      </div>
    </div>
  </div>
</template>

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
  background: linear-gradient(90deg,
      #8b5cf6,
      #7c3aed,
      #6d28d9,
      #5b21b6,
      #6d28d9,
      #7c3aed,
      #8b5cf6);
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