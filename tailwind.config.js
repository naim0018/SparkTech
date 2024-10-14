/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a1a',
          text: '#e0e0e0',
          accent: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
