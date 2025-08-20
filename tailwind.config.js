/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00a3d9",
        "primary-hover": "#0088bb",
        "primary-light": "#00c4ff",
        surface: "#f8f9fa",
        "text-primary": "#1a1a1a",
        "text-secondary": "#6b7280",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
}