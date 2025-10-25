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
          50: '#fef5f0',
          100: '#fdeae0',
          200: '#F9DBBD',
          300: '#FFA5AB',
          400: '#DA627D',
          500: '#A53860',
          600: '#8a2e50',
          700: '#6f2440',
          800: '#5a1d34',
          900: '#450920',
        },
        peach: '#F9DBBD',
        pink: {
          light: '#FFA5AB',
          DEFAULT: '#DA627D',
        },
        burgundy: {
          light: '#A53860',
          DEFAULT: '#450920',
        }
      },
      fontFamily: {
        sans: ['Lexend', 'system-ui', 'sans-serif'],
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
