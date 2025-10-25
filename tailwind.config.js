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
          50: '#fff0f5',
          100: '#ffe0ec',
          200: '#ffc1d9',
          300: '#ff91bd',
          400: '#ff51a0',
          500: '#ff0080',
          600: '#e6006b',
          700: '#cc0056',
          800: '#b30042',
          900: '#99002e',
        },
        neon: {
          pink: '#ff006e',
          lime: '#c0ff00',
          cyan: '#00f5ff',
          orange: '#ff6b00',
          purple: '#9d00ff',
          yellow: '#ffea00',
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
        sans: ['Righteous', 'system-ui', 'sans-serif'],
        serif: ['Creepster', 'Georgia', 'serif'],
        bangers: ['Bangers', 'cursive'],
        monoton: ['Monoton', 'cursive'],
        shrikhand: ['Shrikhand', 'cursive'],
        pixel: ['Press Start 2P', 'cursive'],
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
