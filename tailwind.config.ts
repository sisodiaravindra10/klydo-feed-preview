import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        klydo: {
          pink: "#EC2D7C",
          magenta: "#F0157F",
          violet: "#8B5CF6",
          ink: "#0F1117",
          paper: "#FFFFFF",
          mute: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-raleway)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        phone: "0 30px 60px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
