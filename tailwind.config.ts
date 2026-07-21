import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand surfaces
        ink: {
          DEFAULT: '#000204', // true ink — deepest hero / footer
          950: '#000204',
          900: '#0A0C12',
          800: '#2E2E2E', // charcoal — elevated dark surface
          700: '#3A3A3A',
          600: '#4A4A4A',
        },
        charcoal: '#2E2E2E', // direct alias for the brand charcoal
        paper: {
          DEFAULT: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F4F5F7', // neutral section bg
          200: '#E5E7EB', // dividers / borders
          300: '#D1D5DB',
        },
        // Brand secondary — Deep Navy / electric royal blue ("BENEFITS OF 10X" section)
        brand: {
          blue: {
            DEFAULT: '#0821D2',
            dark: '#040F66',
            light: '#1F3CE0',
            soft: '#E5E9F8',
          },
        },
        // Hero accent — brand Lawn Green ("power up")
        accent: {
          DEFAULT: '#6DE325',
          hover: '#5BC91D',
          pressed: '#4EA310',
          glow: '#D4FE4C',
          ink: '#000204', // text color when on accent bg
        },
        // Brand sub colours — product / campaign specific (kit pg 27)
        sunglow: '#FFCE1C', // power up
        'power-cyan': '#13EAED', // power down
        'power-purple': '#A467F7', // power down
        // Pastel category cards (Pour / Mix / Drink)
        pastel: {
          lime: '#E8F5C0',
          lavender: '#E4DDF2',
          blush: '#F4DDE3',
        },
        // Text tokens
        fg: {
          DEFAULT: '#000204',
          muted: '#6B7280',
          subtle: '#9CA3AF',
          inverse: '#FFFFFF',
          'inverse-muted': '#B0B5C0',
        },
        // Status (kept minimal)
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        // `system-ui, -apple-system` before Arial = clean fallback for any glyph
        // the branded latin-subset webfonts lack (e.g. ₹ from San Francisco).
        // Body / default → Nebula Sans
        sans: ['var(--font-nebula)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        nebula: ['var(--font-nebula)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        // Primary display / headlines → Quantico
        display: ['var(--font-quantico)', 'var(--font-nebula)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        condensed: ['var(--font-quantico)', 'var(--font-nebula)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        quantico: ['var(--font-quantico)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
        pt: ['var(--font-pt-sans)', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Display scale tuned for "THE BRAIN BATTERY" / "TAKE CHARGE" hero type
        'display-2xl': ['clamp(3.5rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.02', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        // Body scale
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.55' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'overline': ['0.75rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '700' }],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.16em',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0, 2, 4, 0.04), 0 4px 16px rgba(0, 2, 4, 0.06)',
        elevated: '0 8px 32px rgba(0, 2, 4, 0.10)',
        glow: '0 0 32px rgba(109, 227, 37, 0.40)',
        'glow-soft': '0 0 16px rgba(109, 227, 37, 0.22)',
        'glow-blue': '0 0 32px rgba(8, 33, 210, 0.35)',
      },
      spacing: {
        section: '6rem', // vertical rhythm between major sections
        'section-sm': '4rem',
        gutter: '1.5rem',
      },
      maxWidth: {
        container: '1280px',
        prose: '68ch',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        slow: '400ms',
      },
    },
  },
  plugins: [],
};

export default config;
