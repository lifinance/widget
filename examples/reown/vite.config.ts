import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvCompatible from 'vite-plugin-env-compatible'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), EnvCompatible()],
})
