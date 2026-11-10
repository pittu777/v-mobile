/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-foreground": "hsl(var(--surface-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        paper: "hsl(var(--background))",
        ink: "hsl(var(--primary))",
        "ink-foreground": "hsl(var(--primary-foreground))",
        coral: "hsl(var(--destructive))",
        "coral-foreground": "hsl(var(--destructive-foreground))",
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        headline: ["1.875rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        title: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        body: ["1rem", { lineHeight: "1.5" }],
        label: ["0.875rem", { lineHeight: "1" }],
      },
      borderRadius: {
        md: "var(--radius)",
      },
    },
  },
  plugins: [],
};
