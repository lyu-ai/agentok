const withNextIntl = require('next-intl/plugin')();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // i18n: {
  //   locales: ['en', 'zh'],
  //   defaultLocale: 'en',
  //   localeDetection: false, // disable automatic locale detection
  // },
  webpack(config, { isServer, dev }) {
    // @dqbd/tiktoken: enable asynchronous WebAssembly
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
