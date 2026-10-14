// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },

  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      // Base URL of the Laravel API (no trailing slash)
      apiBase: "http://localhost:8000/api",
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },

  tailwindcss: {
    cssPath: false, // main.css already carries the @tailwind directives
    configPath: "~~/tailwind.config.ts",
  },
})
