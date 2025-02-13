/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#212121",
        blue: "",
      },
      fontFamily: {
        times: ['Times New Roman"', "serif"],
      },
    },
  },
};
