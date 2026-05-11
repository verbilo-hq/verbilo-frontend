// Session storage abstraction.
//
// Originally the key was `inspire_session` (leftover from an earlier
// project). VER-17 renames it to `verbilo_session`. To avoid logging
// out anyone with an existing tab open, the first read after the
// rename migrates the legacy key transparently:
//
//   1. If `verbilo_session` is set, use it.
//   2. Else if `inspire_session` is set, copy it to `verbilo_session`
//      and delete the old key.
//   3. Else, no session.
//
// Once a few weeks have passed and active tabs have cycled, the
// `LEGACY_KEY` branch can be ripped out (tracked as a follow-up in
// the VER-17 ticket).

const SESSION_KEY = "verbilo_session";
const LEGACY_KEY = "inspire_session";

function safeGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* sessionStorage unavailable — session lives in memory only this tab */
  }
}

function safeRemove(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

function migrateLegacy() {
  const legacy = safeGet(LEGACY_KEY);
  if (legacy && !safeGet(SESSION_KEY)) {
    safeSet(SESSION_KEY, legacy);
  }
  // Always clear the legacy key after a read attempt so the migration
  // is one-shot per tab; subsequent writes go to the new key only.
  if (legacy) {
    safeRemove(LEGACY_KEY);
  }
}

export function readSession() {
  migrateLegacy();
  const raw = safeGet(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function persistSession(session) {
  safeSet(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  safeRemove(SESSION_KEY);
  // Belt and braces: nuke the legacy key too on logout.
  safeRemove(LEGACY_KEY);
}

export function getToken() {
  const session = readSession();
  return session?.token ?? null;
}

// Exposed for testing / debugging only.
export const __INTERNAL__ = { SESSION_KEY, LEGACY_KEY };
