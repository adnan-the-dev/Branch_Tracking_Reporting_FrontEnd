/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f0',
          100: '#ffe6d9',
          200: '#ffc9ab',
          300: '#ffa877',
          400: '#ff7f3f',
          500: '#f4611a', // primary
          600: '#d94c0f',
          700: '#b23b0c',
          800: '#8c2f0e',
          900: '#712910',
        },
        ink: {
          900: '#12131a',
          800: '#1b1d29',
          700: '#242737',
          600: '#343850',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(18, 19, 26, 0.08)',
        card: '0 2px 10px rgba(18, 19, 26, 0.06)',
      },
    },
  },
  plugins: [],
};
