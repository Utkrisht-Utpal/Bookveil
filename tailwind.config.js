/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        turna: {
          bg: '#F5F1E8',
          parchment: '#EDE8DC',
          charcoal: '#252525',
          muted: '#706D65',
          sage: '#6F8068',
          'sage-dark': '#566650',
          'sage-light': '#8E9F87',
          gold: '#B79B68',
          'gold-light': '#D4BD8D',
          dark: '#171916',
          'dark-surface': '#22251F',
          'dark-text': '#E8E3D7',
          'dark-muted': '#9C988D',
          sepia: '#F4ECD8',
          'sepia-text': '#433422',
          forest: '#1B241C',
          'forest-surface': '#253026',
          'forest-text': '#E2E8DF'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        lora: ['"Lora"', 'Georgia', 'serif'],
        merriweather: ['"Merriweather"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Geist"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'book': '0 20px 45px -10px rgba(37, 37, 37, 0.18), 0 5px 15px -3px rgba(37, 37, 37, 0.1)',
        'book-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 5px 20px -3px rgba(0, 0, 0, 0.4)',
        'page-left': 'inset -15px 0 25px -10px rgba(0, 0, 0, 0.07), -4px 0 10px rgba(0,0,0,0.03)',
        'page-right': 'inset 15px 0 25px -10px rgba(0, 0, 0, 0.07), 4px 0 10px rgba(0,0,0,0.03)',
        'spine': '0 0 30px rgba(0, 0, 0, 0.25)',
        'paper-elevation': '0 10px 30px -5px rgba(50, 45, 35, 0.12), 0 4px 6px -2px rgba(50, 45, 35, 0.04)',
      },
      transitionProperty: {
        'book': 'background-color, color, border-color, box-shadow, transform, filter',
      }
    },
  },
  plugins: [],
}
