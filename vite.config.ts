import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// PrimeVue
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'

// ESLint
// import eslint from 'vite-plugin-eslint'

// PWA
import { VitePWA } from 'vite-plugin-pwa'

// Unplugin Icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver(),
        IconsResolver(),
      ] 
    }),
    // eslint(),
    Icons({
      autoInstall: true, 
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      // includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Open Data Gunungkidul',
        short_name: 'Open Data Gunungkidul',
        description: 'Open Data Kabupaten Gunungkidul',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'resources/images/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'resources/images/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
