import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    build: {
    outDir: ".",        // Put build output into root
    emptyOutDir: false, // Prevent Vite from deleting source files
    assetsDir: "assets" // Keep JS/CSS/images organized
  }
})
