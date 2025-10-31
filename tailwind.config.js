/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a8a",
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#1e3a8a",
        },
        whatsapp: "#25D366",
      },
      boxShadow: { glow: "0 0 60px rgba(37,211,102,0.25)" },
      keyframes: {
        pulseRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.6)" },
          "50%": { boxShadow: "0 0 0 16px rgba(37,211,102,0)" },
        },
      },
      animation: { pulseRing: "pulseRing 2s infinite" },
      fontFamily: { changa: ["var(--font-changa)"], gsc: ["var(--font-gsc)"], zilla: ['var(--font-zilla)']},
      
    },
  },
  plugins: [],
};
