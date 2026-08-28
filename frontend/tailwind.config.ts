import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand red (reference design accent)
        primary: {
          50: "#fdf3f3",
          100: "#fbe6e6",
          200: "#f6d0d0",
          300: "#eeadae",
          400: "#e17d7f",
          500: "#cf5254",
          600: "#b93438",
          700: "#a02a2e",
          800: "#832628",
          900: "#6e2527",
          950: "#3b0f10",
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
        // Rose-tinted section background
        blush: "#f9ecec",
        ink: "#111111",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(30, 20, 20, 0.07), 0 10px 28px -12px rgba(30, 20, 20, 0.16)",
        "card-hover": "0 2px 6px rgba(30, 20, 20, 0.09), 0 22px 44px -12px rgba(30, 20, 20, 0.26)",
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
