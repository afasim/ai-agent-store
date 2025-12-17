/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable optimizations for App Router
    esmExternals: true,
  },
  // Ensure proper handling of dynamic routes
  staticPageGenerationTimeout: 60,
};

module.exports = nextConfig;
