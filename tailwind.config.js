/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wmg: {
          pink: '#E91E63',
          'pink-hover': '#D81B60',
          'pink-light': '#FCE4EC',
          'pink-subtle': '#FFF0F5',
          green: '#00A651',
          'green-hover': '#008c44',
          'green-light': '#E8F5E9',
          gold: '#F5A623',
          dark: '#1A1A1A',
          gray: '#555555',
          border: '#E0E0E0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'float': '0 10px 30px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
