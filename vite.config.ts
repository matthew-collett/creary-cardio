import path from 'path'
import { fileURLToPath } from 'url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'mantine': [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/form',
            '@mantine/dates',
            '@mantine/notifications',
          ],
          'schedule-x': [
            '@schedule-x/calendar',
            '@schedule-x/react',
            '@schedule-x/theme-default',
            '@schedule-x/drag-and-drop',
            '@schedule-x/event-recurrence',
            '@schedule-x/resize',
            '@schedule-x/current-time',
            '@schedule-x/events-service',
          ],
          'icons': ['@tabler/icons-react', 'lucide-react'],
        },
      },
    },
  },
})
