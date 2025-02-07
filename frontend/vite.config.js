import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(), 
  ],
  server: {
    proxy:{
      "/api": {
        target: "http://localhost:5002",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true
      },
      "/odd_api": {
        target: "https://api.the-odds-api.com/v4/sports/upcoming/odds",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/odd_api/, ''),
        //secure: true  test with and without
      }
    }
  }


  
})
