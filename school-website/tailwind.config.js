/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        themeBg: 'var(--bg-primary)',
        themeBgSec: 'var(--bg-secondary)',
        themeBgTert: 'var(--bg-tertiary)',
        themeText: 'var(--text-primary)',
        themeTextSec: 'var(--text-secondary)',
        themeBorder: 'var(--border-color)',
        themeCard: 'var(--card-bg)',
      },
    },
  },
  plugins: [],
}
