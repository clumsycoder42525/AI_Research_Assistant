/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B0F1A',
          900: '#111827',
          800: '#1F2937'
        },
        brand: {
          violet: '#7C3AED',
          indigo: '#4F46E5',
          cyan: '#06B6D4',
          lime: '#CAFF33',
          dark: '#0B0F1A',
          gray: {
            primary: '#E5E7EB',
            secondary: '#9CA3AF',
            muted: '#6B7280'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
        'mesh': 'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(6, 182, 212, 0.1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(202, 255, 51, 0.1) 0, transparent 50%)',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' },
          '50%': { opacity: .5, boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
