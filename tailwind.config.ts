import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
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
        // cta: {
        //   primary: '#7edbf0',
        //   light: '#e2f6fb',
        //   dark: '#406870',
        // },
        // danger: {
        //   primary: '#ff5f59',
        //   light: '#ffd9d3',
        //   dark: '#79332e',
        // },
        // success: {
        //   primary: '#76ea5e',
        //   light: '#e1fbd8',
        //   dark: '#3d6e32',
        // },
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
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'dark', // default theme from the themes object
      // defaultExtendTheme: 'dark', // default theme to extend on custom themes
      themes: {
        light: {
          colors: {
            // LAYOUT COLORS
            background: '#d6d6d6',
            foreground: '#121212',
            divider: '#121212',
            focus: '#756456',

            // BASE COLORS
            primary: {
              DEFAULT: '#f9d3b4',
              foreground: '#121212',
            },
            danger: '#ff5f59',
            success: '#76ea5e',
            // Add custom colors
            // brand: '#f9d3b4',
            // cta: '#7edbf0',
            // spotify: '#1db954',
          },
          // Add custom fonts
          // font: {
          //   sans: ['TT-Hoves', ...defaultTheme.fontFamily.sans],
          //   serif: ['Inter', ...defaultTheme.fontFamily.serif],
          // },
        },
        dark: {
          colors: {
            // LAYOUT COLORS
            background: '#121212',
            foreground: '#d6d6d6',
            divider: '#d6d6d6',
            focus: '#fef4ec',
            // BASE COLORS
            primary: {
              DEFAULT: '#f9d3b4',
              foreground: '#d6d6d6',
            },
            // secondary: {
            //   DEFAULT: '',
            //   foreground: ''
            // },
            danger: '#ff5f59',
            success: '#76ea5e',
            // Add custom colors
            // brand: '#f9d3b4',
            // cta: '#7edbf0',
            // spotify: '#1db954',
          },
          // Add custom fonts
          // font: {
          //   sans: ['TT-Hoves', ...defaultTheme.fontFamily.sans],
          //   serif: ['Inter', ...defaultTheme.fontFamily.serif],
          // },
        },
      },
    }),
  ],
  // plugins: [require('@tailwindcss/forms')],
} satisfies Config;
