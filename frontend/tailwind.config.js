/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        restaurant: {
          cream: '#faf8f5',     // Warm luxury background
          dark: '#111518',      // Deep charcoal/slate
          darkCard: '#1a1f24',  // Card background for dark modes
          gold: '#c5a059',      // Sleek gold accent
          goldLight: '#e4d2b1', // Soft cream gold
          accent: '#b93c25',    // Rich dark red for main highlights
          accentHover: '#9e2d19',
          muted: '#717b84'      // Slate gray text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' }
        }
      }
    },
  },
  plugins: [],
}
