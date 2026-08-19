import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080A0E",
        surface: {
          base: "#0E1118",
          elevated: "#141824",
          card: "#111520",
          hover: "#1A2030",
          inset: "#0A0D13",
        },
        primary: {
          50:  "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          DEFAULT: "#22C55E",
        },
        green: {
          50:  "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        accent: {
          cyan: {
            DEFAULT: "#06B6D4",
            light: "#67E8F9",
          },
          pink: {
            DEFAULT: "#EC4899",
            light: "#F9A8D4",
          },
          emerald: {
            DEFAULT: "#10B981",
            light: "#6EE7B7",
          },
          amber: {
            DEFAULT: "#F59E0B",
            light: "#FCD34D",
          },
          purple: {
            DEFAULT: "#8B5CF6",
            light: "#C4B5FD",
          },
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255, 255, 255, 0.78)",
          tertiary: "rgba(255, 255, 255, 0.52)",
          muted: "rgba(255, 255, 255, 0.35)",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.18)",
          active: "rgba(34, 197, 94, 0.5)",
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        display: ["Manrope", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2ED66B 0%, #22C55E 50%, #16A34A 100%)",
        "gradient-hero": "linear-gradient(135deg, #22C55E 0%, #06B6D4 50%, #8B5CF6 100%)",
        "gradient-card-border": "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(6,182,212,0.1))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s infinite",
        "shimmer": "shimmer 2s infinite linear",
        "fade-in-down": "fadeInDown 0.6s ease forwards",
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "pulse-slow": "pulse 2s ease-in-out infinite",
        "blob-float-1": "blobFloat1 8s ease-in-out infinite",
        "blob-float-2": "blobFloat2 10s ease-in-out infinite",
        "blob-float-3": "blobFloat3 12s ease-in-out infinite",
        "gradient-shift": "gradientShift 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,197,94,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34,197,94,0.6), 0 0 80px rgba(34,197,94,0.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blobFloat1: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(40px,-30px) scale(1.1)" },
        },
        blobFloat2: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(-30px,40px) scale(1.05)" },
        },
        blobFloat3: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(20px,-20px) scale(1.08)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
