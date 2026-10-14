import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        // Brand blue, anchored to the logo: 400 = circle (#78ceff),
        // 600 = bright wolf stripe, 900 = wolf navy
        primary: {
          50: "#f0f8ff",
          100: "#e1f2fe",
          200: "#c3e6fe",
          300: "#9ddaff",
          400: "#78ceff",
          500: "#3fb3f6",
          600: "#08a1ee",
          700: "#0e6cab",
          800: "#115685",
          900: "#14436b",
          950: "#0c2a44",
        },
        // Warm gold, kept for star ratings and small highlights
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // WhatsApp / award green
        wa: {
          500: "#25d366",
          600: "#1eb457",
          700: "#00aa6c",
          800: "#03824f",
        },
        // Sky-tinted section background
        blush: "#e8f3fb",
        ink: "#111111",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Geist", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(12, 42, 68, 0.07), 0 10px 28px -12px rgba(12, 42, 68, 0.16)",
        "card-hover": "0 2px 6px rgba(12, 42, 68, 0.09), 0 22px 44px -12px rgba(12, 42, 68, 0.26)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "float-slow": "float-slow 7s ease-in-out infinite",
      },
      maxWidth: {
        "7.5xl": "84rem",
      },
    },
  },
  plugins: [],
};
export default config;
