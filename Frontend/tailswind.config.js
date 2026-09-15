/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1220',
          900: '#0F1A2E',
          800: '#152238',
          700: '#1C2C47',
        },
        risk: {
          low: '#16A34A',
          moderate: '#EAB308',
          high: '#F97316',
          veryhigh: '#DC2626',
        },
        brand: {
          teal: '#0D9488',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 10px 0 rgba(15, 26, 46, 0.06), 0 1px 2px 0 rgba(15, 26, 46, 0.04)',
        cardHover: '0 8px 24px 0 rgba(15, 26, 46, 0.10)',
      },
    },
  },
  plugins: [],
}
 
