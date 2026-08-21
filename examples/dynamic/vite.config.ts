import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// The Dynamic SDK reads a bare `process` global (nextTick/versions/emit) and its own
// polyfills.js imports `buffer/index.js`, so it needs real Node shims — build-time
// `process.env.*` substitution is not enough. nodePolyfills() supplies them, but it
// aliases its own shims by bare specifier, and its exports map still carries legacy
// trailing-slash keys that resolve to files. Rolldown (Vite 8) rejects those with
// "Expecting folder to folder mapping". 0.28.0 ships an identical exports map and
// fails the same way, so bumping the plugin does not help; the upstream fixes are
// open but unreleased (davidmyersdev/vite-plugin-node-polyfills#161 and #154).
//
// Resolving the shims to their real files keeps rolldown out of that exports map.
// This fixes `vite build` and `vite preview`, which is what the e2e suite covers.
// `vite dev` still fails: dependency pre-bundling resolves the plugin's injected
// banner in a separate plugin container that this hook cannot reach.
const require = createRequire(import.meta.url)
const pkgRoot = resolve(
  dirname(require.resolve('vite-plugin-node-polyfills')),
  '..'
)
const SHIM_RE =
  /^(?:node:)?(?:vite-plugin-node-polyfills\/shims\/)?(buffer|global|process)(?:\/.*)?$/

function resolveNodePolyfillShims(): Plugin {
  return {
    name: 'resolve-node-polyfill-shims',
    enforce: 'pre',
    resolveId(id) {
      const match = SHIM_RE.exec(id)
      return match ? join(pkgRoot, 'shims', match[1], 'dist', 'index.js') : null
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), resolveNodePolyfillShims()],
  server: {
    port: 3000,
    open: true,
  },
})
