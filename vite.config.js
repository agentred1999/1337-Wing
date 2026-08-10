import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/1337-Wing/',
  preview: {
    host: true,
    port: 5173,
    allowedHosts: ['YOUR-DOMAIN-HERE.ts.net'],
  },
})
