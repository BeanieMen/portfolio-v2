import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      title: "Beanie's Portfolio",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'An absolute BANGING portfolio website made with nuxt'
        },
        // Open Graph meta tags (for social media sharing)
        { property: 'og:title', content: "Beanie's Portfolio" },
        { property: 'og:description', content: 'An absolute BANGING portfolio website made with nuxt' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://new.beanie.one' },
      ]
    }
  },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    'nuxt-lucide-icons',
    '@nuxt/icon'
  ],
  
})