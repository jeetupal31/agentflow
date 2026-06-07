import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50: "#f0f4ff", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca" },
        node: {
          agent:  { bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8" },
          llm:    { bg: "#faf5ff", border: "#a855f7", text: "#7e22ce" },
          http:   { bg: "#f0fdf4", border: "#22c55e", text: "#15803d" },
          condition: { bg: "#fffbeb", border: "#f59e0b", text: "#b45309" },
          webhook: { bg: "#fff7ed", border: "#f97316", text: "#c2410c" },
          cron:   { bg: "#f0f9ff", border: "#0ea5e9", text: "#0369a1" }
        }
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dash": "dash 1.5s linear infinite"
      },
      keyframes: {
        dash: { "0%": { strokeDashoffset: "100" }, "100%": { strokeDashoffset: "0" } }
      }
    }
  },
  plugins: []
}

export default config
