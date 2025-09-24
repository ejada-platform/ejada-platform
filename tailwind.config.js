/** @type {import('tailwindcss').Config} */
export default {
    // This line is essential for dark mode to work
    darkMode: 'class',
  
    // Make sure this path correctly points to your source files
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }