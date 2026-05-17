// Session storage abstraction.
//
// Two storage backends:
//   - `sessionStorage` (default) — tab-scoped, evaporates when the tab
//     closes. Used for normal sign-ins.
//   - `localStorage` (opt-in) — persists across tabs/restarts. Used when
//     the operator ticks "Remember my session" on the login form (VER-54).
//
// Originally the key was `inspire_session` (leftover from an earlier
// project). VER-17 renames it to `verbilo_session`. To avoid logging
// out anyone with an existing tab open, the first read after the
// rename migrates the legacy key transparently:
//
//   1. If `verbilo_session` is set, use it.
//   2. Else if `inspire_session` is set, copy it to `verbilo_session`
//      in the SAME storage backend (so a persistent legacy session
//      stays persistent) and delete the old key.
//   3. Else, no session.
//
// Once a few weeks have passed and active tabs have cycled, the
// `LEGACY_KEY` branch can be ripped out (tracked as a follow-up in
// the VER-17 ticket).
//
// Security note: `localStorage` is XSS-readable. The trade-off is
// intentional and documented in VER-54 — CSP from VER-21 mitigates
// most XSS vectors, and the value persisted here is a 1-hour Cognito
// ID token, not raw credentials.

const SESSION_KEY = "verbilo_session";
const LEGACY_KEY = "inspire_session";

// Resolve a Web Storage backend safely. Returns `null` when the global
// isn't available (SSR, Node tests without polyfill, or a browser that
// has disabled it for the origin / Safari private mode).
function safeStorage(name) {
  try {
    const store = globalThis[name];
    return store ?? null;
  } catch {
    return null;
  }
}

function safeGet(storage, key) {
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    /* quota / permission — session lives only as long as the JS heap */
  }
}

function safeRemove(storage, key) {
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    /* noop */
  }
}

// Legacy migration. The old `inspire_session` value might live in
// either backend, so walk both. Migrate INSIDE the same backend so a
// persistent legacy session stays persistent.
function migrateLegacy() {
  for (const name of ["localStorage", "sessionStorage"]) {
    const store = safeStorage(name);
    const legacy = safeGet(store, LEGACY_KEY);
    if (legacy && !safeGet(store, SESSION_KEY)) {
      safeSet(store, SESSION_KEY, legacy);
    }
    if (legacy) {
      safeRemove(store, LEGACY_KEY);
    }
  }
}

// Which storage currently holds the session? localStorage wins if
// both somehow have it — "persistent" trumps "tab-scoped" on conflict.
function findStorageWithSession() {
  const local = safeStorage("localStorage");
  if (safeGet(local, SESSION_KEY) !== null) return local;
  const session = safeStorage("sessionStorage");
  if (safeGet(session, SESSION_KEY) !== null) return session;
  return null;
}

export function readSession() {
  migrateLegacy();
  // localStorage first so a "Remember me" session beats any stray
  // sessionStorage entry (shouldn't happen — persistSession clears the
  // other backend on a switch — but defensive).
  const raw =
    safeGet(safeStorage("localStorage"), SESSION_KEY) ??
    safeGet(safeStorage("sessionStorage"), SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Persist a session payload.
 *
 *   persistSession(payload)
 *     Preserve whichever backend currently holds the session. Brand-new
 *     sign-ins with no existing session default to sessionStorage (the
 *     safer "expires with the tab" behaviour).
 *
 *   persistSession(payload, { persistent: true })
 *     Switch to localStorage ("Remember my session" ticked). Clears the
 *     other backend so we don't end up with two stale sessions racing.
 *
 *   persistSession(payload, { persistent: false })
 *     Switch to sessionStorage ("Remember my session" unticked). Clears
 *     the localStorage entry on the same grounds.
 *
 * The "preserve existing backend" default matters for follow-up writes
 * like `enrichSession` (after `/users/me`) and `setActiveSite` — they
 * shouldn't accidentally demote a persistent session to tab-scope.
 */
export function persistSession(session, options = {}) {
  const json = JSON.stringify(session);
  const local = safeStorage("localStorage");
  const sessionStore = safeStorage("sessionStorage");

  if (options.persistent === true) {
    safeSet(local, SESSION_KEY, json);
    safeRemove(sessionStore, SESSION_KEY);
    return;
  }

  if (options.persistent === false) {
    safeSet(sessionStore, SESSION_KEY, json);
    safeRemove(local, SESSION_KEY);
    return;
  }

  const existing = findStorageWithSession();
  const target = existing ?? sessionStore ?? local;
  safeSet(target, SESSION_KEY, json);
}

export function clearSession() {
  // Wipe both backends + their legacy entries — leaves the user truly
  // signed out regardless of which path their session took on sign-in.
  for (const name of ["localStorage", "sessionStorage"]) {
    const store = safeStorage(name);
    safeRemove(store, SESSION_KEY);
    safeRemove(store, LEGACY_KEY);
  }
}

export function getToken() {
  const session = readSession();
  return session?.token ?? null;
}

// Cross-subdomain session bridge for the Verbilo Admin → tenant
// "Open as admin" flow (VER-62 follow-up).
//
// localStorage / sessionStorage are per-origin, so a session on
// `admin.verbilo.co.uk` isn't visible on `{slug}.verbilo.co.uk`. The
// admin portal builds a `#vb_session=…` fragment on the outbound link;
// the receiving tab calls `importBridgeSession()` before React mounts,
// parses the fragment, persists the session (sessionStorage — tab-
// scoped, doesn't leak into other tenant tabs the operator might
// open later), and scrubs the fragment so it doesn't sit in the URL.
//
// Fragment vs query string: fragments don't reach the server, so the
// raw Cognito JWT doesn't appear in access logs. Browser history still
// keeps it; that's the same XSS-exposed footprint as localStorage, so
// no new exposure beyond what the existing session model already
// accepts (VER-54 documents the trade-off).
const BRIDGE_FRAGMENT_KEY = "vb_session";

export function importBridgeSession() {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash;
  if (!hash) return false;
  const params = new URLSearchParams(hash.slice(1));
  const raw = params.get(BRIDGE_FRAGMENT_KEY);
  if (!raw) return false;
  try {
    const session = JSON.parse(decodeURIComponent(raw));
    // Cross-tenant bridge is always tab-scoped — we never want a
    // platform admin's full-scope token to outlive the inspection tab.
    persistSession(session, { persistent: false });
  } catch {
    /* malformed fragment — drop silently */
  }
  // Scrub the fragment regardless of parse success so a malformed
  // bridge doesn't sit in the URL bar.
  params.delete(BRIDGE_FRAGMENT_KEY);
  const remaining = params.toString();
  const newHash = remaining ? `#${remaining}` : "";
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search + newHash,
  );
  return true;
}

export function buildBridgeUrl(targetUrl, session) {
  if (!session) return targetUrl;
  const encoded = encodeURIComponent(JSON.stringify(session));
  const sep = targetUrl.includes("#") ? "&" : "#";
  return `${targetUrl}${sep}${BRIDGE_FRAGMENT_KEY}=${encoded}`;
}

// Exposed for testing / debugging only.
export const __INTERNAL__ = { SESSION_KEY, LEGACY_KEY, BRIDGE_FRAGMENT_KEY };
