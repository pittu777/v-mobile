/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Add this line to change the strategy from 'media' to 'class'
  darkMode: "class",

  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
