// Tests for src/services/session.js — covers the legacy `inspire_session`
// → `verbilo_session` migration (VER-17), the basic read/write/clear
// surface, AND the dual-backend (sessionStorage / localStorage)
// behaviour added by VER-54 for the "Remember my session" checkbox.
//
// Neither sessionStorage nor localStorage exists in Node, so we polyfill
// tiny in-memory stand-ins on globalThis before importing the module.

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k)        { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v)     { this.map.set(k, String(v)); }
  removeItem(k)     { this.map.delete(k); }
  clear()           { this.map.clear(); }
}

globalThis.sessionStorage = new MemoryStorage();
globalThis.localStorage = new MemoryStorage();

const {
  readSession,
  persistSession,
  clearSession,
  getToken,
  __INTERNAL__: { SESSION_KEY, LEGACY_KEY },
} = await import("./session.js");

beforeEach(() => {
  globalThis.sessionStorage.clear();
  globalThis.localStorage.clear();
});

// ---------- Basic read/write (default sessionStorage backend) ----------

test("persistSession + readSession round-trip (default → sessionStorage)", () => {
  persistSession({ token: "abc", user: { username: "owen" } });
  assert.deepEqual(readSession(), { token: "abc", user: { username: "owen" } });
  assert.ok(globalThis.sessionStorage.getItem(SESSION_KEY));
  assert.equal(globalThis.localStorage.getItem(SESSION_KEY), null);
});

test("readSession returns null when no session is set", () => {
  assert.equal(readSession(), null);
});

test("getToken returns the token from the persisted session", () => {
  persistSession({ token: "tok-123", user: { username: "x" } });
  assert.equal(getToken(), "tok-123");
});

test("getToken returns null when no session is set", () => {
  assert.equal(getToken(), null);
});

test("clearSession wipes the session", () => {
  persistSession({ token: "abc", user: { username: "x" } });
  clearSession();
  assert.equal(readSession(), null);
});

// ---------- Persistent backend (VER-54) ----------

test("persistSession({ persistent: true }) writes to localStorage and clears sessionStorage", () => {
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "stale-tab" }));

  persistSession({ token: "remembered", user: { username: "owen" } }, { persistent: true });

  assert.ok(globalThis.localStorage.getItem(SESSION_KEY));
  assert.equal(
    globalThis.sessionStorage.getItem(SESSION_KEY),
    null,
    "switching to persistent should clear sessionStorage to avoid two stale sessions",
  );
  assert.deepEqual(readSession(), { token: "remembered", user: { username: "owen" } });
});

test("persistSession({ persistent: false }) writes to sessionStorage and clears localStorage", () => {
  globalThis.localStorage.setItem(SESSION_KEY, JSON.stringify({ token: "stale-remembered" }));

  persistSession({ token: "tab-only", user: { username: "owen" } }, { persistent: false });

  assert.ok(globalThis.sessionStorage.getItem(SESSION_KEY));
  assert.equal(
    globalThis.localStorage.getItem(SESSION_KEY),
    null,
    "switching to non-persistent should clear localStorage too",
  );
  assert.deepEqual(readSession(), { token: "tab-only", user: { username: "owen" } });
});

test("persistSession without options preserves the existing backend", () => {
  // Start with a persistent session (Remember my session was ticked at sign-in).
  persistSession({ token: "v1" }, { persistent: true });
  assert.ok(globalThis.localStorage.getItem(SESSION_KEY));

  // A follow-up write (e.g. enrichSession adding /users/me data) must
  // stay in localStorage — not silently demote to sessionStorage.
  persistSession({ token: "v1", user: { username: "owen", id: "u-1" } });

  assert.ok(
    globalThis.localStorage.getItem(SESSION_KEY),
    "subsequent writes should preserve the persistent backend",
  );
  assert.equal(globalThis.sessionStorage.getItem(SESSION_KEY), null);
});

test("persistSession with no existing session defaults to sessionStorage", () => {
  persistSession({ token: "fresh" });
  assert.ok(
    globalThis.sessionStorage.getItem(SESSION_KEY),
    "brand-new write with no options defaults to tab-scoped sessionStorage",
  );
  assert.equal(globalThis.localStorage.getItem(SESSION_KEY), null);
});

test("readSession prefers localStorage when both backends somehow have a session", () => {
  // Shouldn't happen in practice (persistSession clears the other backend
  // on a switch), but defensive: persistent beats tab-scoped on conflict.
  globalThis.localStorage.setItem(SESSION_KEY, JSON.stringify({ token: "persistent-wins" }));
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "tab-loses" }));

  assert.equal(readSession()?.token, "persistent-wins");
});

test("clearSession wipes both backends", () => {
  globalThis.localStorage.setItem(SESSION_KEY, JSON.stringify({ token: "p" }));
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "t" }));

  clearSession();

  assert.equal(globalThis.localStorage.getItem(SESSION_KEY), null);
  assert.equal(globalThis.sessionStorage.getItem(SESSION_KEY), null);
});

// ---------- Legacy migration (VER-17 + VER-54 expanded for localStorage) ----------

test("readSession migrates legacy `inspire_session` in sessionStorage to `verbilo_session`", () => {
  const legacy = JSON.stringify({ token: "legacy-tok", user: { username: "legacy-user" } });
  globalThis.sessionStorage.setItem(LEGACY_KEY, legacy);

  const result = readSession();
  assert.deepEqual(result, { token: "legacy-tok", user: { username: "legacy-user" } });

  assert.equal(globalThis.sessionStorage.getItem(SESSION_KEY), legacy);
  assert.equal(globalThis.sessionStorage.getItem(LEGACY_KEY), null);
});

test("readSession migrates legacy `inspire_session` in localStorage too (VER-54)", () => {
  // A persistent legacy session should stay persistent after migration —
  // we don't want to silently demote a user from "Remember me" to tab-scope.
  const legacy = JSON.stringify({ token: "legacy-persistent" });
  globalThis.localStorage.setItem(LEGACY_KEY, legacy);

  const result = readSession();
  assert.deepEqual(result, { token: "legacy-persistent" });

  assert.equal(globalThis.localStorage.getItem(SESSION_KEY), legacy);
  assert.equal(globalThis.localStorage.getItem(LEGACY_KEY), null);
});

test("migration prefers the new key when both are present", () => {
  globalThis.sessionStorage.setItem(LEGACY_KEY, JSON.stringify({ token: "old" }));
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "new" }));

  const result = readSession();
  assert.equal(result.token, "new");
  assert.equal(globalThis.sessionStorage.getItem(LEGACY_KEY), null);
});

test("clearSession also removes the legacy key in BOTH backends as belt-and-braces", () => {
  globalThis.localStorage.setItem(LEGACY_KEY, "x");
  globalThis.localStorage.setItem(SESSION_KEY, "y");
  globalThis.sessionStorage.setItem(LEGACY_KEY, "a");
  globalThis.sessionStorage.setItem(SESSION_KEY, "b");

  clearSession();

  assert.equal(globalThis.localStorage.getItem(LEGACY_KEY), null);
  assert.equal(globalThis.localStorage.getItem(SESSION_KEY), null);
  assert.equal(globalThis.sessionStorage.getItem(LEGACY_KEY), null);
  assert.equal(globalThis.sessionStorage.getItem(SESSION_KEY), null);
});

test("readSession returns null when the persisted payload is unparseable", () => {
  globalThis.sessionStorage.setItem(SESSION_KEY, "not-json{");
  assert.equal(readSession(), null);
});

test("__INTERNAL__ exposes the canonical key names", () => {
  assert.equal(SESSION_KEY, "verbilo_session");
  assert.equal(LEGACY_KEY, "inspire_session");
});
