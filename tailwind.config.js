/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#080D1A',
        midnight: '#0E172F',
        graphite: '#151B29',
        cyber: {
          DEFAULT: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.25)',
          deep: '#0284C7',
        },
        violet: {
          DEFAULT: '#6366F1',
          glow: 'rgba(99, 102, 241, 0.25)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-gradient': 'linear-gradient(135deg, #38BDF8 0%, #6366F1 100%)',
        'brushed-metal': 'linear-gradient(145deg, rgba(21, 27, 41, 0.92) 0%, rgba(14, 23, 47, 0.78) 48%, rgba(8, 13, 26, 0.95) 100%)',
      },
      boxShadow: {
        'cyber-sm': '0 0 15px rgba(56, 189, 248, 0.15)',
        'cyber-md': '0 0 30px rgba(56, 189, 248, 0.25)',
        'cyber-lg': '0 0 50px rgba(56, 189, 248, 0.35)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
