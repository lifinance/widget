/* eslint-disable import/no-default-export */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import veauryVitePlugins from 'veaury/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Turn off vue and vuejsx plugins
    // vue(),
    // vueJsx(),
    // When the type of veauryVitePlugins is set to vue,
    // only jsx in files in the directory named 'react_app' will be parsed with react jsx,
    // and jsx in other files will be parsed with vue jsx
    veauryVitePlugins({
      type: 'vue',
      // Configuration of @vitejs/plugin-vue
      // vueOptions: {...},
      // Configuration of @vitejs/plugin-react
      // reactOptions: {...},
      // Configuration of @vitejs/plugin-vue-jsx
      // vueJsxOptions: {...}
    }),
  ],
  esbuild: {
    target: 'esnext',
  },
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
    open: true,
  },
});
