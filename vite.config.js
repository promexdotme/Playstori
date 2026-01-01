import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'fonts/**'],
      manifest: {
        name: 'Playstori Kids Launcher',
        short_name: 'Playstori',
        description: 'Offline kids game launcher for Playstori.',
        theme_color: '#1a1b4b',
        background_color: '#f6f1e4',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['games/**'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallbackDenylist: [/^\/games\//],
        runtimeCaching: [
          {
            urlPattern: /\/appstorage\/games\.json$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'playstori-data',
              expiration: { maxEntries: 5, maxAgeSeconds: 10 }
            }
          },
          {
            urlPattern: /\/appstorage\/icons\/.*\.(png|jpg|jpeg|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'playstori-icons',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /^https:\/\/playstori\.org\/appstorage\/games\/.*\.zip$/i,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ]
});
