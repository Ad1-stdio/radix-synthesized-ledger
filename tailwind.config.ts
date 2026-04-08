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
        background: "var(--background)",
        foreground: "var(--foreground)",
        'deep-navy': '#08081a',
        'radix-blue': 'rgb(var(--radix-blue-rgb, 0 102 255) / <alpha-value>)',
        'staking-green': '#3cd5af',
        'panel-bg': '#18182f', // A deeper, richer panel background match
        'panel-border': '#2a2a4a', // Border match
        'text-muted': '#8a8ca8', // Muted text color match
      },
      dropShadow: {
        'glow-blue': '0 0 20px rgb(var(--radix-blue-rgb, 0 102 255) / 0.3)',
        'glow-green': '0 0 20px rgba(60, 213, 175, 0.3)'
      },
      boxShadow: {
        'glow-blue': '0 0 15px rgb(var(--radix-blue-rgb, 0 102 255) / 0.5)',
        'glow-green': '0 0 15px rgba(60, 213, 175, 0.5)'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      }
    },
  },
  plugins: [],
};
export default config;
