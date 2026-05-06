/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Primary palette – Deep Blue
        primary: {
          DEFAULT: '#0F172A',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#070b14',
        },
        // Secondary – Teal action color
        teal: {
          DEFAULT: '#0D9488',
          light: '#ccfbf1',
          dark:  '#0f766e',
        },
        // Tertiary – Info blue
        info: {
          DEFAULT: '#3B82F6',
          light:   '#dbeafe',
          dark:    '#1d4ed8',
        },
        // Semantic status chips
        success: {
          bg:   '#d1fae5',
          text: '#065f46',
        },
        warning: {
          bg:   '#fef3c7',
          text: '#92400e',
        },
        rental: {
          bg:   '#dbeafe',
          text: '#1e40af',
        },
        // Named colors from design system
        surface: '#f8f9ff',
        'on-surface': '#0b1c30',
      },
      boxShadow: {
        card:    '0px 1px 3px rgba(0,0,0,0.10)',
        modal:   '0px 10px 15px -3px rgba(0,0,0,0.10)',
        lifted:  '0px 8px 24px rgba(15,23,42,0.12)',
        glass:   '0 4px 30px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        card:    '0.5rem',
        badge:   '9999px',
      },
      letterSpacing: {
        caps: '0.05em',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
