import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/invoices/',
  plugins: [react()],
  server: {
    // Trello only redirects auth back to origins on the app key.
    // 8080 is already taken by other apps here; 5173 is on that list.
    port: 5173,
  },
})
