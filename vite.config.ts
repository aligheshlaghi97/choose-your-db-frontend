import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/choose-your-db-frontend/',
  server: {
    port: 3000
  }
})
