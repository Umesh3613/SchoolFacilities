import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8FAFC',
        ink: '#102A43',
        sky: '#0F766E',
        warm: '#C2410C',
        moss: '#4D7C0F'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(16, 42, 67, 0.14)'
      }
    }
  },
  plugins: []
} satisfies Config;
