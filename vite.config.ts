import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import preact from '@preact/preset-vite'

function copyCustomerConfig(): Plugin {
  return {
    name: 'copy-customer-config',
    closeBundle() {
      copyFileSync(
        resolve(__dirname, 'customer/raya.config.js'),
        resolve(__dirname, 'dist/raya.config.js'),
      )
      copyFileSync(
        resolve(__dirname, 'customer/embed.html'),
        resolve(__dirname, 'dist/embed.example.html'),
      )
    },
  }
}

export default defineConfig(({ command }) => ({
  plugins: [preact(), command === 'build' ? copyCustomerConfig() : undefined].filter(
    Boolean,
  ),
  optimizeDeps: {
    include: ['marked', 'dompurify'],
  },
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build:
    command === 'build'
      ? {
          lib: {
            entry: 'src/main.tsx',
            name: 'RayaWidget',
            fileName: 'raya.widget',
            formats: ['iife'],
          },
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              entryFileNames: 'raya.widget.js',
              assetFileNames: 'raya.css',
              inlineDynamicImports: true,
            },
          },
        }
      : undefined,
}))
