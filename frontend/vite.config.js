import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    headers: {
      'Content-Security-Policy': "connect-src 'self' http://localhost:5001 https://router.project-osrm.org ws://localhost:5001;"
    }
  }
})
