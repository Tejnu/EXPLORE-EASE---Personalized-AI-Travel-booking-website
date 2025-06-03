/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
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
        fontFamily: {
          lato: ['"Lato"', 'sans-serif'],
        },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
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
          // ExploreEase custom theme colors - Ash and Orange
          'ee-ash-100': '#F5F5F5',
          'ee-ash-200': '#E5E5E5',
          'ee-ash-300': '#D4D4D4',
          'ee-ash-400': '#A3A3A3',
          'ee-ash-500': '#737373',
          'ee-ash-600': '#525252',
          'ee-ash-700': '#404040',
          'ee-ash-800': '#262626',
          'ee-ash-900': '#171717',
          'ee-orange-100': '#FFEDD5',
          'ee-orange-200': '#FED7AA',
          'ee-orange-300': '#FDBA74',
          'ee-orange-400': '#FB923C',
          'ee-orange-500': '#F97316',
          'ee-orange-600': '#EA580C',
          'ee-orange-700': '#C2410C',
          'ee-orange-800': '#9A3412',
          'ee-orange-900': '#7C2D12',
          'ee-bg': '#F5F5F5',
          'ee-text-primary': '#262626',
          'ee-text-secondary': '#525252',
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  