import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        clinical: {
          dark: "#0b1329",      // Navy slate dark background
          darker: "#050a14",    // Even darker navy
          light: "#faf9f6",     // Warm cream background
          lighter: "#fcfbf9",   // Extra light warm cream
          navy: "#0f2537",      // Clinical navy text/borders
          slate: "#334155",     // Slate gray
          clay: "#a82020",      // Terracotta/crimson accent
          gold: "#d4af37",      // Muted gold highlights
          teal: "#0d9488",      // Medical teal
          green: "#15803d",     // Emerald correct
          red: "#b91c1c",       // Critical incorrect/safety
        }
      },
      fontFamily: {
        sans: ["var(--font-vazir)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
