import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,html}',
    './components/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
        screens: {
          '2lt': '256px',
          'lt': '384px',
          '2sm': '512px',  
        },
        boxShadow: {
          // shadow-[0_0_15px_-3px_rgba(0,0,0,0.1),0_0_6px_-4px_rgba(0,0,0,0.1)]
          'equal-lg': '0 0 15px -3px rgba(0, 0, 0, 0.1), 0 0 6px -4px rgba(0, 0, 0, 0.1)',
        }
    },
  },
  plugins: [],
}
export default config