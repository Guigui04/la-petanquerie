/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // App background scale (light)
        bg: {
          DEFAULT: '#F3F4F6',
          soft: '#EDEFF3',
          surface: '#FFFFFF',
        },
        // Navy "ink" — used for the dark hero card AND for dark text on light/accent
        ink: {
          950: '#0A1322',
          900: '#0F1A2E',
          800: '#16223A',
          700: '#243049',
          600: '#33415B',
          500: '#475571',
          400: '#5E6C88',
          300: '#7C8696',
        },
        // Primary brand blue (signature)
        brand: {
          DEFAULT: '#2F6BF6',
          50: '#EFF4FF',
          100: '#DCE7FF',
          200: '#BBD0FF',
          300: '#8FB1FF',
          400: '#5C8BFA',
          500: '#2F6BF6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        // Accent yellow (the "Lancer un match" card, stars). Repurposed gold token.
        gold: {
          DEFAULT: '#FFD12E',
          50: '#FFFBEB',
          100: '#FFF3C4',
          200: '#FFE48A',
          300: '#FFDD5C',
          400: '#FFD12E',
          500: '#F5C200',
          600: '#E0AC00',
          700: '#B88B00',
        },
        // Secondary accents
        emerald: {
          DEFAULT: '#22C55E',
          glow: 'rgba(34,197,94,0.12)',
        },
        coral: {
          DEFAULT: '#FB923C',
          glow: 'rgba(251,146,60,0.12)',
        },
        sky: {
          DEFAULT: '#2F6BF6',
          glow: 'rgba(47,107,246,0.10)',
        },
        rose: {
          DEFAULT: '#EF4444',
          glow: 'rgba(239,68,68,0.10)',
        },
        // Text on light surfaces
        fg: {
          DEFAULT: '#0F1A2E',
          muted: '#7C8696',
          subtle: '#A9B1BE',
          ghost: '#C4CAD4',
        },
        line: '#E8EAEE',
        chip: '#F1F2F4',
        star: '#FBBF24',
        // Legacy aliases (repointed to the light theme so existing pages don't break)
        pastis: {
          DEFAULT: '#FFD12E',
          light: 'rgba(255,209,46,0.16)',
          dark: '#E0AC00',
        },
        marseille: '#0F1A2E',
        ciel: '#2F6BF6',
        nuit: '#0F1A2E',
        ocre: '#FB923C',
        sable: '#F3F4F6',
        gravier: '#7C8696',
        olive: '#22C55E',
        provence: '#EF4444',
        charbon: '#0F1A2E',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)',
        elevated: '0 4px 12px rgba(16,24,40,0.08), 0 20px 48px rgba(16,24,40,0.12)',
        glow: '0 8px 24px rgba(47,107,246,0.32)',
        'glow-blue': '0 8px 24px rgba(47,107,246,0.32)',
        'glow-gold': '0 8px 24px rgba(255,209,46,0.40)',
        'glow-emerald': '0 8px 24px rgba(34,197,94,0.30)',
        nav: '0 -2px 16px rgba(16,24,40,0.06)',
      },
      borderRadius: {
        card: '22px',
        '2.5xl': '22px',
        '4xl': '28px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #3D78FF 0%, #2563EB 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFDD5C 0%, #FFD12E 100%)',
        'navy-gradient': 'linear-gradient(135deg, #16223A 0%, #0F1A2E 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(47,107,246,0.0)' },
          '50%': { boxShadow: '0 8px 28px rgba(47,107,246,0.45)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
