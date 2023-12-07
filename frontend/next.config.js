const withNextIntl = require('next-intl/plugin')();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // for Docker build
  reactStrictMode: true,
};

module.exports = withNextIntl(nextConfig);
