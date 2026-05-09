import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5D3FD3", // Deep Violet del Design.md
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#00677e",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F2F4F7",
          foreground: "#667085",
        },
        accent: {
          DEFAULT: "#5D3FD3",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "1.5rem", // Redondeado xl del Design.md
        md: "1rem",   // Redondeado lg del Design.md
        sm: "0.5rem",
      },
      boxShadow: {
        'soft': '0px 4px 12px rgba(0, 0, 0, 0.05)', // Shadow del Design.md
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;