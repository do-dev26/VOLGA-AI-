import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#09090b',
          secondary: '#111113',
          tertiary: '#141416',
          card: '#1a1a1e',
        },
        border: {
          DEFAULT: '#1f1f22',
          muted: '#27272a',
          subtle: '#3f3f46',
        },
        accent: {
          DEFAULT: '#00f5aa',
          dim: 'rgba(0,245,170,0.12)',
          glow: 'rgba(0,245,170,0.25)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
          faint: '#52525b',
          dim: '#3f3f46',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-accent': 'pulseAccent 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseAccent: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(0,245,170,0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(0,245,170,0.15)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
};

export default config;
