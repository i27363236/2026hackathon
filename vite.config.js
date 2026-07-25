import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    // Compresses images at build time only (npm run build). Source files in
    // src/img/* are never modified; dev server serves originals.
    ViteImageOptimizer({
      png: { quality: 80 }, // tune after visual check on the photo backgrounds
    }),
  ],
})
