// Tests for src/services/session.js — covers the legacy `inspire_session`
// → `verbilo_session` migration (VER-17) and the basic read/write/clear
// surface. Runs under Node's built-in test runner.
//
// sessionStorage doesn't exist in Node, so we polyfill a tiny in-memory
// stand-in on globalThis before importing the module.

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

const {
  readSession,
  persistSession,
  clearSession,
  getToken,
  __INTERNAL__: { SESSION_KEY, LEGACY_KEY },
} = await import("./session.js");

beforeEach(() => {
  globalThis.sessionStorage.clear();
});

// ---------- Basic read/write ----------

test("persistSession + readSession round-trip", () => {
  persistSession({ token: "abc", user: { username: "owen" } });
  assert.deepEqual(readSession(), { token: "abc", user: { username: "owen" } });
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

// ---------- Legacy migration (VER-17) ----------

test("readSession migrates legacy `inspire_session` to `verbilo_session`", () => {
  const legacy = JSON.stringify({ token: "legacy-tok", user: { username: "legacy-user" } });
  globalThis.sessionStorage.setItem(LEGACY_KEY, legacy);

  const result = readSession();
  assert.deepEqual(result, { token: "legacy-tok", user: { username: "legacy-user" } });

  // New key now holds the migrated value; legacy key is gone.
  assert.equal(globalThis.sessionStorage.getItem(SESSION_KEY), legacy);
  assert.equal(globalThis.sessionStorage.getItem(LEGACY_KEY), null);
});

test("migration prefers the new key when both are present", () => {
  globalThis.sessionStorage.setItem(LEGACY_KEY, JSON.stringify({ token: "old" }));
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "new" }));

  const result = readSession();
  assert.equal(result.token, "new");
  // Legacy key is still cleared so we don't read it again on next call.
  assert.equal(globalThis.sessionStorage.getItem(LEGACY_KEY), null);
});

test("clearSession also removes the legacy key as belt-and-braces", () => {
  globalThis.sessionStorage.setItem(LEGACY_KEY, JSON.stringify({ token: "x" }));
  globalThis.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: "y" }));
  clearSession();
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
