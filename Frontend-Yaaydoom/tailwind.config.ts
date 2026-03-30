import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        terracotta: {
          DEFAULT: '#E07856',
          light: '#F09070',
          dark: '#D06846',
        },
        sage: {
          DEFAULT: '#2D5F5D',
          light: '#3D7F7D',
          dark: '#1A3635',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;