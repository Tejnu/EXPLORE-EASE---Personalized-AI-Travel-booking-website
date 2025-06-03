/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: '**.same-assets.com',
        },
        {
          protocol: 'https',
          hostname: '**.netlify.app',
        },
        {
          protocol: 'https',
          hostname: '**.wikimedia.org',
        },
      ],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;
  