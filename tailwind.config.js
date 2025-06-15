/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f1ff',
          100: '#ede9fe',
          500: '#6B46C1',
          600: '#5b21b6',
          700: '#4c1d95',
          900: '#1e1b4b'
        },
        secondary: {
          500: '#EC4899',
          600: '#db2777',
          700: '#be185d'
        },
        accent: {
          500: '#3B82F6',
          600: '#2563eb'
        },
        dark: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          800: '#1F2937',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(236, 72, 153, 0.8)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backgroundSize: {
        '300%': '300%'
      }
    },
  },
  plugins: [],
};