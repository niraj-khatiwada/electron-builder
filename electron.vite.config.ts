import { resolve } from 'path'

import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  main: {
    build: {
      bytecode: true
    }
  },
  preload: {
    build: {
      bytecode: true
    }
  },
  renderer: {
    resolve: {
      alias: {
        '~': resolve('src/renderer')
      }
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({ target: 'react', autoCodeSplitting: true }),
      react(),
      svgr()
    ]
  }
})
