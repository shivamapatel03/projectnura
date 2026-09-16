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
        brand: {
          DEFAULT: "#0A2AFF",
          hover: "#0821CC",
          light: "#EEF2FF",
          dark: "#051380",
        },
        buttonBlue: {
          DEFAULT: "#4D4AE8",
          hover: "#3733E5",
          active: "#3E3BBA",
          focus: "#413FC5",
        }
      },
      fontFamily: {
        sans: ["'Mona Sans'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'Mona Sans'", "monospace"],
      },
      boxShadow: {
        none: "none",
        flat: "0 0 0 1px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
