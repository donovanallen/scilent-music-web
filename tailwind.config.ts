import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        '2xs': ['0.7rem', '1rem'],
        // font-size: 0.75rem/* 12px */;
        // line-height: 1rem/* 16px */;
      },
      fontFamily: {
        primary: ['TT-Hoves', ...defaultTheme.fontFamily.sans],
        secondary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        light: '#d6d6d6',
        dark: '#121212',
        brand: {
          primary: '#f9d3b4',
          light: '#fef4ec',
          dark: '#756456',
        },
        cta: {
          primary: '#7edbf0',
          light: '#e2f6fb',
          dark: '#406870',
        },
        danger: {
          primary: '#ff5f59',
          light: '#ffd9d3',
          dark: '#79332e',
        },
        success: {
          primary: '#76ea5e',
          light: '#e1fbd8',
          dark: '#3d6e32',
        },
        spotify: {
          primary: '#1db954',
        },
      },
      // keyframes: {
      //   flicker: {
      //     '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
      //       opacity: '0.99',
      //       filter:
      //         'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
      //     },
      //     '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
      //       opacity: '0.4',
      //       filter: 'none',
      //     },
      //   },
      //   shimmer: {
      //     '0%': {
      //       backgroundPosition: '-700px 0',
      //     },
      //     '100%': {
      //       backgroundPosition: '700px 0',
      //     },
      //   },
      // },
      // animation: {
      //   flicker: 'flicker 3s linear infinite',
      //   shimmer: 'shimmer 1.3s linear infinite',
      // },
    },
  },
  // plugins: [require('@tailwindcss/forms')],
} satisfies Config;
