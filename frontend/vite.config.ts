// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Config } from 'tailwindcss' // 1. Import the 'Config' type

// 2. Define our Tailwind configuration as a constant with the correct type
const tailwindConfig: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#375466',
        'secondary': '#ada687',
        'light': '#ffffff',
        'dark': '#1F2937',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 3. Pass the correctly typed configuration object to the plugin
    tailwindcss(tailwindConfig),
    react()
  ],
})