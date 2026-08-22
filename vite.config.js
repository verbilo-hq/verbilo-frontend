import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // amazon-cognito-identity-js references the Node-style `global` object.
  // Vite doesn't define it in browser builds, so any module that touches
  // Cognito at import time crashes with "ReferenceError: global is not defined".
  define: {
    global: 'globalThis',
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
