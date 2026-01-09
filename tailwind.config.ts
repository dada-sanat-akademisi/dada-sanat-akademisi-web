import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Core palette: Charcoal, Ivory, Gold
        charcoal: {
          DEFAULT: '#0E0E0E',
          50: '#1A1A1A',
          100: '#262626',
          200: '#333333',
        },
        ivory: {
          DEFAULT: '#F6F4EF',
          50: '#FAF9F6',
          100: '#F0EDE5',
          200: '#E8E4DA',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#F5E6B8',
          100: '#E8D494',
          200: '#DBC270',
          300: '#CEB04C',
          400: '#C19E28',
          500: '#B48C04',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Musical timing animations
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow-gold': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'glow-gold': 'glow-gold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      // Musical timing scale
      transitionDuration: {
        'beat': '300ms', // Quarter note feel
        'half-beat': '150ms', // Eighth note
        'whole-beat': '600ms', // Half note
        '240': '240ms', // Standard hover transition
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

