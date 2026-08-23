/**
 * Demo-mode detector.
 *
 * The public demo (`demo.verbilo.co.uk`) has to behave exactly like a local
 * dev run: sign in as any of the fixture personas, switch roles, and drive
 * the whole product from the localStorage engine — with no mock-Cognito
 * server and no real user pool behind it.
 *
 * The previous gate was `import.meta.env.DEV && pool === devmockpool`, which
 * is false in every built bundle, so a deployed demo could never get past the
 * login screen. This widens it to an explicit, host-scoped signal instead.
 *
 * Precedence (mirrors the tenant app's `lib/mode.js`):
 *   1. `VITE_VERBILO_MODE` env var ("demo" | "tenant") — explicit override
 *   2. hostname starting with `demo.` — the public demo subdomain
 *   3. local dev against the placeholder pool
 *   4. otherwise false → real Cognito
 *
 * Anything NOT matching stays on the real Cognito path, so production
 * tenants are unaffected.
 */
export function isDemoMode() {
  const envMode = import.meta.env?.VITE_VERBILO_MODE;
  if (envMode === "demo") return true;
  if (envMode === "tenant") return false;

  if (typeof window !== "undefined" && window.location?.hostname?.startsWith("demo.")) {
    return true;
  }

  return Boolean(
    import.meta.env?.DEV &&
      import.meta.env?.VITE_COGNITO_USER_POOL_ID === "eu-north-1_devmockpool",
  );
}

/** True only where the local mock-Cognito server can plausibly be running. */
export function hasLocalMockCognito() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return Boolean(import.meta.env?.DEV) && (h === "localhost" || h === "127.0.0.1" || h === "[::1]");
}

/**
 * True on a deployed demo host, where demo mode is on but there is no
 * backend this bundle can authenticate against (the session token is minted
 * locally). Callers use this to skip pointless API round-trips that would
 * only 401/404. Local dev is deliberately excluded: the mock-Cognito stack
 * and the local API are both real there, so behaviour is unchanged.
 */
export function isOfflineDemo() {
  return isDemoMode() && !hasLocalMockCognito();
}
