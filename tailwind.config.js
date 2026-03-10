/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#d4f0ed',
          200: '#a8e6de',
          300: '#7cd9ce',
          400: '#50cbbe',
          500: '#24bdb4',
          600: '#1a9b8a',
          700: '#127a73',
          800: '#0a585c',
          900: '#034d48',
        },
      },
    },
  },
  plugins: [],
}
