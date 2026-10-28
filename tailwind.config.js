/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4EE',
          50: '#FCFBF8',
          100: '#F7F4EE',
          200: '#EFECE6',
          300: '#E6E1D8',
          400: '#D9D2C5',
        },
        charcoal: {
          DEFAULT: '#20201D',
          50: '#F5F5F4',
          100: '#E7E7E5',
          200: '#CFCFCB',
          400: '#6E6E67',
          600: '#40403B',
          800: '#2A2A26',
          900: '#20201D',
          950: '#141412',
        },
        sand: {
          DEFAULT: '#B9A58A',
          light: '#D3C5B2',
          dark: '#937E64',
          subtle: '#E8E1D5',
        },
        accent: {
          border: '#E6E1D8',
          borderDark: '#20201D',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Didot', 'Bodoni MT', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.12em',
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(32, 32, 29, 0.08)',
        'drawer': '-10px 0 35px -5px rgba(32, 32, 29, 0.15)',
        'modal': '0 25px 50px -12px rgba(32, 32, 29, 0.25)',
      },
      maxWidth: {
        '8xl': '1440px',
      }
    },
  },
  plugins: [],
}
