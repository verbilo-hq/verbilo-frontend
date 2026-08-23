import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import os from 'node:os'

// This workspace has previously run from Windows volumes where native file
// events were unreliable. These settings keep development stable there:
//   1. Keep the prebundle cache on a local C:\ path so reading 200+ tiny
//      cached dependency files stays off the workspace volume.
//   2. Polling is mandatory (native watch fails), but a default ~100ms
//      interval stats every source file 10x/sec and can saturate I/O.
//      A 2000ms interval drops that to manageable levels — HMR feels delayed
//      by up to 2s on save but page loads/clicks become snappy.
//   3. Warm up the governance + clinical entry trees so the first cold
//      navigation doesn't transform hundreds of modules sequentially.
const localCache = path.join(os.homedir(), '.cache', 'verbilo-frontend-vite')

export default defineConfig({
  plugins: [react()],
  cacheDir: localCache,
  // amazon-cognito-identity-js pulls in `buffer`, which references Node's
  // `global`. Browsers don't have it — alias to `globalThis` so the bundle
  // loads instead of throwing "global is not defined" at startup.
  define: {
    global: 'globalThis',
  },
  server: {
    // Bind dual-stack (IPv6 + IPv4) instead of Vite's default `localhost`,
    // which on this Windows box resolves to ::1 (IPv6) ONLY. Browsers that
    // resolve `localhost` to 127.0.0.1 (IPv4) couldn't reach the dev server
    // at all, so the page never loaded. `::` is dual-stack here (verified),
    // so the page is reachable however the browser resolves localhost.
    host: '::',
    watch: {
      usePolling: true,
      interval: 2000,
      binaryInterval: 5000,
    },
    warmup: {
      clientFiles: [
        './src/main.jsx',
        './src/App.jsx',
        './src/pages/governance/GovernanceShell.jsx',
        './src/pages/governance/PackHub.jsx',
        './src/pages/governance/ProtocolLibrary.jsx',
        './src/pages/CqcPage.jsx',
        // People & Development pages are large single-file pages (~1.4k lines)
        // that aren't reached until the user clicks into them. Without warmup,
        // the first navigation pays a multi-second cold transform.
        './src/pages/CpdPage.jsx',
        './src/pages/TrainingPage.jsx',
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep stable third-party code and the largest static catalogues out of
        // page implementation chunks. This improves browser caching and lets
        // the route payloads download in parallel without changing when any
        // route/component is mounted.
        manualChunks(id) {
          const normalized = id.replaceAll('\\', '/')
          if (normalized.includes('/node_modules/react/') || normalized.includes('/node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (normalized.includes('/node_modules/lucide-react/')) return 'vendor-icons'
          if (normalized.includes('/node_modules/amazon-cognito-identity-js/') || normalized.includes('/node_modules/@aws-crypto/')) {
            return 'vendor-auth'
          }
          if (normalized.includes('/services/fixtures/clinical-pils.fixture.js')) return 'clinical-pils'
          if (normalized.includes('/services/fixtures/clinical-referrals.fixture.js')) return 'clinical-referrals'
          if (normalized.includes('/services/fixtures/clinical-consents.fixture.js')) return 'clinical-consents'
          if (normalized.includes('/services/governance/masterTemplatesSeed.js')) return 'governance-templates'
          if (normalized.includes('/services/governance/auditTemplates.js')) return 'governance-audits'
          if (normalized.includes('/services/governance/protocols/')) return 'governance-protocols'
          if (normalized.includes('/services/governance/seed/')) return 'governance-seed'
          return undefined
        },
      },
    },
  },
})
