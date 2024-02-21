import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        "brand-1": "#222222", // Custom brand color
        "accent-1": "#666666",
        "accent-2": "#8E8E8E",
        "accent-3": "#FCFCFC",
        "color-1": "#E06C5C",
        "color-2": "#908C64",
        "color-3": "#709064",
        "color-4": "#224772",
        "color-5": "#DFAD27",
      },
      boxShadow: {
        "1": "0px 4px 16px 4px rgba(0, 0, 0, 0.05)",
        tldr: "0px 10px 24px 2px rgba(237, 141, 53, 0.15)",
        event: "0px 3.1px 6.2px 0px #0704921A",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  darkMode: ["class"],
  plugins: [require("tailwindcss-animate")],
};
export default config;
