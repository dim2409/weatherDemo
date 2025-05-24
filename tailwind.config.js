/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,css,scss}",
    "./src/app/components/**/*.{html,ts,css,scss}",
    "./src/app/pages/**/*.{html,ts,css,scss}",
    '*.{html,js}',
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    './src/**/*.html',
    './src/**/*.js',
    './public/**/*.html',
    './public/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

