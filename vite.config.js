import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api-v2-amoy.lens.dev', // Fixed URL (removed dot between api-v2 and amoy)
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false // Added for dev environment
      }
    }
  },
  plugins: [
    react(),
    nodePolyfills({
      // Simplified and optimized polyfill configuration
      protocolImports: true,
      exclude: [
        'fs', // Browser doesn't need filesystem
        'http', // Handled by proxy
        'https' // Handled by proxy
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  define: {
    // Simplified global definitions
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  optimizeDeps: {
    esbuildOptions: {
      // Additional Node.js global definitions
      define: {
        global: 'globalThis'
      },
      // Add necessary plugins
      plugins: [
        {
          name: 'fix-node-globals-polyfill',
          setup(build) {
            build.onResolve({ filter: /^node:/ }, args => {
              return { path: args.path.slice(5), external: true }
            })
          }
        }
      ]
    },
    // Explicitly include required dependencies
    include: [
      'buffer',
      'process'
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true // For better CommonJS compatibility
    }
  }
});