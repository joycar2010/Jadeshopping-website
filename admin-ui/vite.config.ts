import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    strictPort: true,
    open: '/admin',
    proxy: {
      '/admin/api': {
        target: 'http://localhost:18080',
        changeOrigin: true,
      },
    },
  },
  base: '/',
})