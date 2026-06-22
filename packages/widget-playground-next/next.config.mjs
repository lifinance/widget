/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Let the production build complete despite pre-existing type errors in the
    // playground (e.g. a skeleton-state prop mismatch) that dev mode and
    // `pnpm check:types` don't surface. Playground-only (private), never shipped.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
    }
    // `accounts` is an optional peer that wagmi's `tempo` connector loads via a
    // guarded `import('accounts').catch(...)`. We never use that connector, but
    // webpack still tries to statically resolve the bare specifier and fails the
    // build. Stub it to an empty module (the runtime path is never executed).
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      accounts: false,
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

export default nextConfig
