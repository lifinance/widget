export interface ExampleConfig {
  /** Playwright project name, CI matrix key, human label */
  name: string
  /** pnpm --filter value */
  pkg: string
  /** Server port */
  port: number
  /** 'build' = package.json build script; 'vite-build' = exec vite build (bypasses tsc) */
  buildCmd: 'build' | 'vite-build'
  /** pnpm script name to start the dev server (preview / start) */
  serveCmd: string
  /** Extra env vars for serve command (e.g. PORT for remix/react-router) */
  serveEnv?: Record<string, string>
  /** Test profile that covers this example */
  profile: 'standard' | 'routed' | 'iframe' | 'nft'
  /** URL path where the widget is mounted. Defaults to '/'. */
  mountPath: string
  status: 'active' | 'broken'
  brokenReason?: string
}

export const examples: ExampleConfig[] = [
  // ── Standard profile (widget at /, Exchange heading) ──────────────────
  {
    name: 'vite',
    pkg: 'vite-project',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'connectkit',
    pkg: 'connectkit',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'privy',
    pkg: 'privy',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'privy-ethers',
    pkg: 'privy-ethers-example',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'rainbowkit',
    pkg: 'rainbowkit',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'reown',
    pkg: 'reown',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'svelte',
    pkg: 'svelte',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'zustand-widget-config',
    pkg: 'zustand-widget-config',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'vue',
    pkg: 'vue',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'nextjs',
    pkg: 'nextjs',
    port: 3000,
    buildCmd: 'build',
    serveCmd: 'start',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'nextjs15',
    pkg: 'nextjs15',
    port: 3000,
    buildCmd: 'build',
    serveCmd: 'start',
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'remix',
    pkg: 'remix',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'start',
    serveEnv: { PORT: '4173' },
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'react-router-7',
    pkg: 'react-router-7',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'start',
    serveEnv: { PORT: '4173' },
    profile: 'standard',
    mountPath: '/',
    status: 'active',
  },
  // ── Routed profile (widget at custom mountPath) ────────────────────────
  {
    name: 'tanstack-router',
    pkg: 'tanstack-router-example',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'routed',
    mountPath: '/widget',
    status: 'active',
  },
  // ── iframe profile (LiFiWidgetLight renders an <iframe>) ──────────────
  {
    name: 'vite-iframe',
    pkg: 'vite-iframe',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'iframe',
    mountPath: '/',
    status: 'active',
  },
  {
    name: 'vite-iframe-wagmi',
    pkg: 'vite-iframe-wagmi',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'iframe',
    mountPath: '/',
    status: 'active',
  },
  // ── NFT profile (subvariant NFT checkout UI) ──────────────────────────
  {
    name: 'nft-checkout',
    pkg: 'nft-checkout',
    port: 4173,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'nft',
    mountPath: '/',
    status: 'active',
  },
  // ── Broken (excluded from project generation) ─────────────────────────
  {
    name: 'deposit-flow',
    pkg: 'deposit-flow',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'broken',
    brokenReason:
      'Widget error boundary triggers at runtime — widgetRoot never mounts. Likely subvariant config issue with current widget version.',
  },
  {
    name: 'dynamic',
    pkg: 'dynamic',
    port: 4173,
    buildCmd: 'vite-build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'broken',
    brokenReason:
      'vite-plugin-env-compatible only transforms process.env.* at build time and does not shim process globally. Dynamic SDK crashes at runtime with "process is not defined". Fix: replace with vite-plugin-node-polyfills.',
  },
  {
    name: 'nuxt',
    pkg: 'nuxt-app',
    port: 3000,
    buildCmd: 'build',
    serveCmd: 'preview',
    profile: 'standard',
    mountPath: '/',
    status: 'broken',
    brokenReason:
      'veaury (applyPureReactInVue) breaks in Nuxt SSR production build — "R is not a function". Vue CSR works fine. Needs veaury SSR fix or ClientOnly wrapper that actually works.',
  },
]

export const activeExamples = examples.filter((e) => e.status === 'active')
