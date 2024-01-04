/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        black: '#111111',
        background: '#ffffff',
        red: '#e60023',
        grey: '#5f5f5f',
        lightGrey: '#e9e9e9',
      },
      fontFamily: {
        Roboto: ['"Roboto", sans-serif'],
      },
    },
  },
  plugins: [],
};
