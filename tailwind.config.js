//** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#6366F1',
        accent: '#10B981',
        background: '#F9FAFB',
        text: '#111827',
      },
      
    },
    fontFamily: {
        header: 'Lato',
        body: ['Source Sans 3', 'sans-serif'],
      },
  },
  plugins: [],
}
