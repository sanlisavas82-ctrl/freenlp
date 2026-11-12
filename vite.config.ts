import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Basis-Pfad für GitHub Pages (Projekt-Seite unter /freenlp/).
  base: '/freenlp/',
  plugins: [react()],
})
