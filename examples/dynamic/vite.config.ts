import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// The Dynamic SDK reads a bare `process` global (nextTick/versions/emit) and its own
// polyfills.js imports `buffer/index.js`, so it needs real Node shims — build-time
// `process.env.*` substitution is not enough.
//
// nodePolyfills() supplies those shims, but it points at them by bare specifier, and
// its exports map still carries legacy trailing-slash keys that resolve to files.
// Rolldown (Vite 8) rejects that with "Expecting folder to folder mapping", which
// breaks both `vite build` and dev dependency pre-bundling. 0.28.0 ships an identical
// exports map and fails the same way, so bumping the plugin does not help — the
// upstream fixes are open but unreleased (davidmyersdev/vite-plugin-node-polyfills#161
// and #154).
//
// So we resolve the shims to their real files, which keeps rolldown out of the exports
// map. Two places need it, because pre-bundling runs its own resolver:
//   - the module graph, via resolveId (also covers subpaths like `buffer/index.js`)
//   - the plugin's own returned config, patched before Vite merges it, which is where
//     the pre-bundle alias maps and injected banner come from
// Both become deletable once upstream ships.
const require = createRequire(import.meta.url)
const pkgRoot = resolve(
  dirname(require.resolve('vite-plugin-node-polyfills')),
  '..'
)
const SHIM_PREFIX = 'vite-plugin-node-polyfills/shims/'
const SHIM_RE =
  /^(?:node:)?(?:vite-plugin-node-polyfills\/shims\/)?(buffer|global|process)(?:\/.*)?$/
const QUOTED_SHIM_RE =
  /(['"])vite-plugin-node-polyfills\/shims\/(buffer|global|process)\1/g
// Alias values point at the shim *directory*: aliases substitute by prefix, so a
// directory keeps both `buffer` and `buffer/index.js` resolvable. Import specifiers
// (the injected banner) get the file itself.
const shimDir = (name: string) => join(pkgRoot, 'shims', name, 'dist')
const shimPath = (name: string) => join(shimDir(name), 'index.js')

/** Rewrite every bare shim specifier in a value tree to an absolute path. */
function absolutizeShims<T>(value: T): T {
  if (typeof value === 'string') {
    const exact = value.startsWith(SHIM_PREFIX)
      ? shimDir(value.slice(SHIM_PREFIX.length))
      : value.replace(
          QUOTED_SHIM_RE,
          (_, quote: string, name: string) =>
            `${quote}${shimPath(name)}${quote}`
        )
    return exact as unknown as T
  }
  if (Array.isArray(value)) return value.map(absolutizeShims) as unknown as T
  if (value && typeof value === 'object') {
    for (const [key, inner] of Object.entries(value)) {
      ;(value as Record<string, unknown>)[key] = absolutizeShims(inner)
    }
  }
  return value
}

/** nodePolyfills() with every bare shim reference resolved to a real file. */
function nodePolyfillsResolved(): Plugin[] {
  const plugins = [nodePolyfills()].flat() as Plugin[]
  for (const plugin of plugins) {
    const original = plugin.config
    if (typeof original !== 'function') continue
    plugin.config = async function config(
      this: ThisParameterType<typeof original>,
      ...args: Parameters<typeof original>
    ) {
      return absolutizeShims(await original.apply(this, args))
    }
  }
  return [
    {
      name: 'resolve-node-polyfill-shims',
      enforce: 'pre',
      resolveId(id) {
        const match = SHIM_RE.exec(id)
        return match ? shimPath(match[1]) : null
      },
    },
    ...plugins,
  ]
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfillsResolved()],
  server: {
    port: 3000,
    open: true,
  },
})
