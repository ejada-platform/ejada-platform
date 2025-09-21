// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//import type { Config } from 'tailwindcss' // 1. Import the 'Config' type

// 2. Define our Tailwind configuration as a constant with the correct type

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // 3. Pass the correctly typed configuration object to the plugin. The tailwindcss plugin for Vite does not accept a configuration object directly.
    tailwindcss(),
    react()
  ],
})