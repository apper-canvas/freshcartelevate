/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6F3E",
        secondary: "#F4A460", 
        accent: "#FF6B35",
        background: "#F8FAF5",
        surface: "#FFFFFF",
        success: "#4CAF50",
        warning: "#FFA726",
        error: "#EF5350",
        info: "#29B6F6"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      animation: {
        "bounce-subtle": "bounce 0.6s ease-out",
        "scale-up": "scaleUp 0.2s ease-out",
        "cart-bounce": "cartBounce 0.3s ease-out"
      },
      keyframes: {
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.02)" }
        },
        cartBounce: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" }
        }
      }
    },
  },
  plugins: [],
}