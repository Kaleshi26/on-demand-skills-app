// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        brand: {
          50:  '#effef7',
          100: '#d9fde9',
          200: '#b3f7d4',
          300: '#7eeeb6',
          400: '#42df95',
          500: '#16c47f',   // primary
          600: '#09a26b',
          700: '#0a8159',
          800: '#0c6448',
          900: '#0b513c'
        }
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
};