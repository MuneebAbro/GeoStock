import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/newsapi': {
        target: 'https://newsapi.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/newsapi/, ''),
      },
      '/yahoo-finance': {
        target: 'https://query1.finance.yahoo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yahoo-finance/, ''),
      },
      '/finnhub': {
        target: 'https://finnhub.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/finnhub/, ''),
      },
      '/psx-api': {
        target: 'https://psxterminal.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/psx-api/, ''),
      },
    },
  },
})
