/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primColor: "#787486",
        secColor: "#0D062D",
      },
    },
  },
  plugins: [],
};