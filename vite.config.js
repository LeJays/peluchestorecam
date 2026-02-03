import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import optionnel selon ta version

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})