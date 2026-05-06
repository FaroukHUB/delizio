/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        delizio: {
          red: '#E11D2E',
          'red-dark': '#A8101F',
          'red-light': '#FF3D4F',
          black: '#0A0A0A',
          gray: '#1A1A1A',
          'gray-soft': '#2A2A2A'
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['Tajawal', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 16px rgba(225,29,46,0.18)'
      }
    }
  },
  plugins: []
};
