/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        todoist: {
          red: '#db4c3f',
          hover: '#c53727',
        }
      }
    },
  },
  plugins: [],
}
