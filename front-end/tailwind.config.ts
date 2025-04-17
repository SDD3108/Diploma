import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        screens: {
            '2lt': '256px',
            'lt': '384px',
            '2sm': '512px',
        },
    },
  },
  plugins: [],
}
export default config