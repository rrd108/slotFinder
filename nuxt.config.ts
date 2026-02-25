export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    'nuxt-users'
  ],

  nuxtUsers: {
    connector: { 
      name: 'sqlite', 
      options: { path: './data/users.db' } 
    },
    auth: { 
      whitelist: ['/login', '/register'],
      permissions: { 
        user: ['*'], 
        admin: ['*'] 
      }
    }
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'slotFinder',
      htmlAttrs: { lang: 'hu' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})
