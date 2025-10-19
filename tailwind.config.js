/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7f4',
          100: '#e8ece5',
          200: '#d4dccf',
          300: '#b5c4aa',
          400: '#92a582',
          500: '#738a65',
          600: '#5a6e4f',
          700: '#495841',
          800: '#3d4837',
          900: '#343d2f',
        },
        zen: {
          cream: '#faf8f3',
          sand: '#f0ebe3',
          stone: '#d9d3c7',
          sage: '#a8b5a0',
          moss: '#738a65',
          earth: '#8b7355',
          bark: '#5d4e37',
        }
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
