
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sg-smile-saver/',
  server: {
    port: 8080
  },
  esbuild: {
    jsx: 'automatic'
  }
})
