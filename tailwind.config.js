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
        "primary": "#4e4ee4",
        "accent": "#E3C54D",
        "background-light": "#f6f6f8",
        "background-dark": "#121221",
        "card-dark": "#1c1c2e",
        "border-dark": "#2d2d44",
        "surface-dark": "#1c1c2e"
      },
      fontFamily: {
        "display": ["Public Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}
