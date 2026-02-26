export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    'nuxt-users'
  ],

  runtimeConfig: {
    public: {
      googleCalendarServiceEmail: 'slotfinder@webmania-383615.iam.gserviceaccount.com'
    },
    googleCalendarServiceKey: 'webmania-383615-ef4510e17e0f.json',
    nuxtUsers: {
      connector: {
        name: 'sqlite',
        options: { path: './data/users.db' }
      },
      auth: {
        whitelist: ['/register'],
        permissions: {
          user: ['*'],
          admin: ['*'],// TODO
        },
        google: {
          successRedirect: '/',
          allowAutoRegistration: true,
          errorRedirect: '/login?error=oauth_failed',
          scopes: ['openid', 'profile', 'email'],
          clientId: process.env.NUXT_NUXT_USERS_GOOGLE_CLIENT_ID || '',
          clientSecret: process.env.NUXT_NUXT_USERS_GOOGLE_CLIENT_SECRET || ''
        }
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
