// Sentry initialisation for the React app.
//
// Imported as the very first line of `main.jsx` so the SDK can hook
// into the React + browser lifecycle before anything else loads.
//
// No-ops cleanly when `VITE_SENTRY_DSN` is unset, so local dev and CI
// builds without a DSN don't try to ship events.

import * as Sentry from "@sentry/react";

// Vite replaces `import.meta.env.<KEY>` at build time. When this file is
// executed outside a Vite build (Node tests, SSR experiments) the object
// doesn't exist — guard accordingly so the module no-ops cleanly.
const env = (typeof import.meta !== "undefined" && import.meta.env) || {};
const dsn = env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Release tag set from the commit SHA Vercel injects.
    release: env.VITE_VERCEL_GIT_COMMIT_SHA || undefined,
    environment: env.MODE,
    // Performance + replay are nice-to-haves; defaults are conservative.
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Mask everything by default — Verbilo handles PHI/PII.
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}

// Export a couple of utilities for the rest of the app to use without
// pulling in the full SDK surface.
export const SentryErrorBoundary = Sentry.ErrorBoundary;
export const captureException = Sentry.captureException;
