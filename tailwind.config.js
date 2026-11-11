/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paz: {
          navy: '#1a2f4e',
          blue: '#2d3e61',
          accent: '#3d6bb3',
          light: '#f4f6fa',
          muted: '#6b7c94',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
