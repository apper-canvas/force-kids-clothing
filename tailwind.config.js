export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B9D",
        secondary: "#4ECDC4",
        accent: "#FFD93D",
        surface: "#FFFFFF",
        background: "#FFF9F5",
        success: "#6BCF7F",
        warning: "#FFB84D",
        error: "#FF6B6B",
        info: "#5DADE2"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.12)"
      }
    },
  },
  plugins: [],
};