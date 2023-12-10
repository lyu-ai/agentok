/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dim"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        box: '0px 2px 14px 0px rgba(32, 40, 45, 0.08)',
        'box-lg': '0px 4px 14px 0px rgba(32, 40, 45, 0.24)',
      },
      transitionProperty: {
        scale: 'transform',
      },
      transitionDuration: {
        '300': '300ms',
        '75': '75ms',
      },
      scale: {
        0: '0',
        80: '.8',
        100: '1',
      },
      minWidth: {
        '64': '16rem', // or '256px'
        '80': '20rem', // or '320px'
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dim', 'emerald'],
    darkTheme: 'dim',
  },
};
