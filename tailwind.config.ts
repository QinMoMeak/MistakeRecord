import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        mist: "#f8fbff",
        line: "#d8e3f4",
      },
      fontFamily: {
        sans: ["MiSans", "HarmonyOS Sans SC", "PingFang SC", "Noto Sans SC", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 45px -24px rgba(37, 99, 235, 0.28)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 400ms ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;

