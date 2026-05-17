/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cargo-blue': '#1e3a8a',
        'cargo-dark': '#0f172a',
        'cargo-light': '#f8fafc',
        'cargo-gray': '#e2e8f0',
        'cargo-orange': '#ea580c',
      },
    },
  },
  plugins: [],
};
