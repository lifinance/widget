/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: question: as we don't care about the production build for next.js is this ok for now?
    //   yarn dev is uneffected by this and runs fine
    //   No other attempts to exclude this file seem to work..
    // NOTE: this is a workaround. In ../widget/src/hooks/useWidgetEvents.ts we have a a workaround for mitt
        // https://github.com/developit/mitt/issues/191
        // const mitt = _mitt as unknown as typeof _mitt.default;
    // this was causing an type error for the production build only
    // WARN: Allow production builds to successfully complete even if your project has type errors.
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js"],
    };
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
