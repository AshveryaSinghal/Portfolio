import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // Light mode
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7F7F7",
          tertiary: "#EFEFEF",
        },
        // Semantic
        ink: {
          DEFAULT: "#0A0A0A",
          secondary: "#3F3F3F",
          tertiary: "#6B6B6B",
          muted: "#9B9B9B",
        },
        rule: "#E5E5E5",
        accent: "#0070F3",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        snug: "-0.01em",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
