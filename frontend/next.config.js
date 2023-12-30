const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
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

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
