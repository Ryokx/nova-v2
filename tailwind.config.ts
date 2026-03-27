import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deepForest: "#0A4030",
        forest: "#1B6B4E",
        sage: "#2D9B6E",
        lightSage: "#8ECFB0",
        gold: "#F5A623",
        sunny: "#FACC15",
        navy: "#0A1628",
        red: "#E8302A",
        success: "#22C88A",
        bgPage: "#F5FAF7",
        surface: "#E8F5EE",
        border: "#D4EBE0",
        grayText: "#6B7280",
      },
      fontFamily: {
        heading: ["'Manrope'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "8px",
        DEFAULT: "12px",
        md: "14px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(10, 22, 40, 0.04)",
        md: "0 4px 16px rgba(10, 22, 40, 0.06)",
        lg: "0 8px 32px rgba(10, 22, 40, 0.1)",
      },
      keyframes: {
        pageIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
        "slide-right": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        pageIn: "pageIn 600ms ease-out both",
        fadeIn: "fadeIn 400ms ease-out both",
        slideUp: "slideUp 500ms ease-out both",
        shimmer: "shimmer 1.5s infinite",
        float: "float 5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-right": "slide-right 1.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
