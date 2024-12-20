// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from 'vite-plugin-node-polyfills'
export default defineNuxtConfig({
  devtools: { enabled: true },

  hooks: {
    'vite:extendConfig': (config) => {
      config.plugins!.push(nodePolyfills())
    },
  },

  compatibilityDate: '2024-12-20',
})
