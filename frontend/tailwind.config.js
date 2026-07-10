/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#162032",
        slatewash: "#3D4A5C",
        paper: "#F6F4EF",
        gold: "#D6A24C",
        rust: "#B6562F",
        teal: "#2F6E63",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
