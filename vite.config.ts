import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE is set by the GitHub Actions workflow to '/math/' for Pages.
// Falls back to '/' for local dev and Surge deploys.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
