// Sanity test: importing `./instrument` without a DSN must not throw.
//
// The module reads `import.meta.env.VITE_SENTRY_DSN`, which is undefined
// outside of Vite — perfect for the no-op path we want to lock in.

import { test } from "node:test";
import assert from "node:assert/strict";

test("instrument.js loads without throwing when VITE_SENTRY_DSN is unset", async () => {
  // Dynamic import so a top-level throw would still fail the test cleanly.
  const mod = await import("./instrument.js");
  assert.equal(typeof mod, "object");
  assert.equal(typeof mod.captureException, "function");
  // ErrorBoundary is a React component class/function — both are objects/functions.
  assert.ok(mod.SentryErrorBoundary);
});
