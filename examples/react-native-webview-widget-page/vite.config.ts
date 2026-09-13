import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // The RN app loads this page over the LAN, so bind beyond localhost.
    host: true,
    port: 5174,
  },
})
