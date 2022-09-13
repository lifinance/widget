import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          include: null,
        }),
      ],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  server: {
    port: 3000,
  },
});
