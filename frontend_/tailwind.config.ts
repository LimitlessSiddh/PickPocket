module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: "#0D0D0D", // Black
        accent1: "#00A878", // Green 1 (Bold)
        accent2: "#75D99F", // Green 2 (Light)
        secondary: "#1A1A1A", // Dark Grey
      },
    },
  },
  plugins: [],
};