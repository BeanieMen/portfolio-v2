<template>
  <div>
    <Head>
      <link
        rel="preload"
        href="/fonts/Manrope-Regular.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Manrope-Bold.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
      />
    </Head>

    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<style>
html {
  overflow: auto; 
  scrollbar-width: none;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
