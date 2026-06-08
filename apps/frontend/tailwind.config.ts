import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3"
        },
        ink: {
          900: "#0a0a0f",
          800: "#11121c",
          700: "#1a1b27",
          600: "#252738"
        },
        node: {
          agent:  { bg: "#eff6ff", border: "#3b82f6", text: "#1d4ed8" },
          llm:    { bg: "#faf5ff", border: "#a855f7", text: "#7e22ce" },
          http:   { bg: "#f0fdf4", border: "#22c55e", text: "#15803d" },
          condition: { bg: "#fffbeb", border: "#f59e0b", text: "#b45309" },
          webhook: { bg: "#fff7ed", border: "#f97316", text: "#c2410c" },
          cron:   { bg: "#f0f9ff", border: "#0ea5e9", text: "#0369a1" }
        }
      },
      boxShadow: {
        "node": "0 4px 20px rgba(0, 0, 0, 0.25)",
        "panel": "0 12px 40px rgba(0, 0, 0, 0.5)"
      },
      animation: {
        "pulse-slow": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "dash": "dash 1.5s linear infinite",
        "float-up": "floatUp 0.35s ease-out"
      },
      keyframes: {
        dash: { "0%": { strokeDashoffset: "100" }, "100%": { strokeDashoffset: "0" } }
      }
    }
  },
  plugins: []
}

export default config
