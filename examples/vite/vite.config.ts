import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  esbuild: {
    target: 'esnext',
  },

  server: {
    port: 3000,
    open: true,
  },
});
