import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig(({ command }) => ({
  plugins: [preact()],
  build:
    command === 'build'
      ? {
          lib: {
            entry: 'src/main.tsx',
            name: 'RayaWidget',
            fileName: 'raya',
            formats: ['iife'],
          },
          cssCodeSplit: false,
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        }
      : undefined,
}))
