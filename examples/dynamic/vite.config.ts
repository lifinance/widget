import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import EnvCompatible from 'vite-plugin-env-compatible'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvCompatible()],
  server: {
    port: 3000,
    open: true,
  },
})
