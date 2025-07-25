import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  //Configuramos origen del backend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Dirección deL backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  } //Fin config
})
