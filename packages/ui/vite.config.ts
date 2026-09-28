import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Used by Storybook (via @storybook/react-vite). The library itself is built
// by build.ts (esbuild) + tsc for types + the Tailwind CLI for CSS.
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
