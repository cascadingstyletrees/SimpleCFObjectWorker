/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}", "!./src/generated-css.ts"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#1f2937',
          900: '#111827',
          950: '#0B0F19',
        }
      }
    }
  },
  plugins: [],
}
