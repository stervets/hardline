import config from './config';

export default defineNuxtConfig({
  ssr: false,

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 3001
  },

  plugins: [
    {src: './plugins/hardline.client.ts', mode: 'client'},
    {src: './plugins/event-bus.ts', mode: 'client'},
    {src: './plugins/dark-theme.ts', mode: 'client'},
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
  ],

  runtimeConfig: {
    public: {
      ...config
    },
  },
})
