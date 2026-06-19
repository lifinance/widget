/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // NOTE: this is a workaround. In ../widget/src/hooks/useWidgetEvents.ts we have a workaround for mitt
    // https://github.com/developit/mitt/issues/191
    // const mitt = _mitt as unknown as typeof _mitt.default;
    // this was causing a type error for the production build only
    // No other attempts to exclude this file seem to work. Once the mitt package has fixed its types we should be able to remove this
    // WARN: Allow production builds to successfully complete even if your project has type errors.
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
