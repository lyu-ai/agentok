const withNextIntl = require('next-intl/plugin')();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // for Docker build
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'docs.flowgen.app',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
