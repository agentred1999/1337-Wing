import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['1337wing.taila4d3fb.ts.net'],
  },
})
