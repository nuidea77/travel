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
        primary: {
          50: "#effefb",
          100: "#c8fff4",
          200: "#92fdea",
          300: "#53f4dd",
          400: "#20e0ca",
          500: "#07c4b1",
          600: "#029e91",
          700: "#077d75",
          800: "#0b635e",
          900: "#0e524e",
          950: "#013231",
        },
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
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 60, 58, 0.08), 0 12px 32px -12px rgba(15, 60, 58, 0.18)",
        "card-hover": "0 2px 6px rgba(15, 60, 58, 0.1), 0 24px 48px -12px rgba(15, 60, 58, 0.3)",
        glow: "0 0 0 1px rgba(7, 196, 177, 0.15), 0 8px 40px -8px rgba(7, 196, 177, 0.35)",
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
