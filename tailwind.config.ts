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
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          DEFAULT: "#F59E0B",
        },
        accent: {
          orange: {
            DEFAULT: "#F97316",
            light: "#FB923C",
          },
          amber: {
            DEFAULT: "#F59E0B",
            light: "#FCD34D",
          },
          cyan: {
            DEFAULT: "#06B6D4",
            light: "#67E8F9",
          },
          emerald: {
            DEFAULT: "#10B981",
            light: "#6EE7B7",
          },
          purple: {
            DEFAULT: "#8B5CF6",
            light: "#C4B5FD",
          },
          pink: {
            DEFAULT: "#EC4899",
            light: "#F9A8D4",
          },
          red: {
            DEFAULT: "#EF4444",
            light: "#F87171",
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
          active: "rgba(245, 158, 11, 0.5)",
        }
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)",
        "gradient-hero": "linear-gradient(135deg, #F59E0B 0%, #F97316 50%, #EC4899 100%)",
        "gradient-card-border": "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(249,115,22,0.08))",
      },
      animation: {
        "fade-in-down": "fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulseSubtle 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
