/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@lifi/widget', '@lifi/wallet-management'],
};

module.exports = nextConfig;
