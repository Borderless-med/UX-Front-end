
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/sg-smile-saver/',
  plugins: [react()],
  server: {
    port: 8080
  }
})
