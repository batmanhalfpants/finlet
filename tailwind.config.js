/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // Guarantee the core palette used for state colours & the AI glow is never purged.
  safelist: [
    { pattern: /^(bg|text|border|ring|from|to)-(emerald|rose|indigo)-(50|100|500|600)$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        ios: {
          bg: '#F2F2F7',
          label: '#1C1C1E',
          secondary: '#8E8E93',
          separator: 'rgba(60,60,67,0.12)',
          fill: 'rgba(118,118,128,0.12)',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -8px rgba(16,24,40,0.08)',
        sheet: '0 -12px 40px -12px rgba(15,23,42,0.25)',
        glow: '0 10px 30px -8px rgba(79,70,229,0.55), 0 0 0 1px rgba(99,102,241,0.25)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s linear infinite',
        pulseRing: 'pulseRing 1.6s cubic-bezier(0.2,0.6,0.3,1) infinite',
      },
    },
  },
  plugins: [],
}
