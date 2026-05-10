import { accountsFixture } from "./fixtures/accounts.fixture";
import { simulateLatency } from "./delay";
// import { fetchJson } from "./http";

const SESSION_KEY = "inspire_session";

let accountsStore = [...accountsFixture];

function makeToken() {
  // Browser-native UUID where available; falls back to a random 16-byte hex string.
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const buf = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

function persistSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* sessionStorage unavailable — session lives in memory only this tab */
  }
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function publicUserOf(account) {
  if (!account) return null;
  // Never return password to the client surface beyond the auth boundary.
  const { password, ...safe } = account;
  void password;
  return safe;
}

export function getSession() {
  return readSession();
}

export async function login(username, password) {
  await simulateLatency();
  const account = accountsStore.find(
    (a) => a.username === username && a.password === password
  );
  if (!account) {
    const err = new Error("Invalid username or password");
    err.code = "UNAUTHORIZED";
    throw err;
  }
  const session = { token: makeToken(), user: publicUserOf(account) };
  persistSession(session);
  return session;
  // return fetchJson("/auth/login", { method: "POST", body: { username, password } });
}

export async function setPassword(username, newPassword) {
  await simulateLatency();
  accountsStore = accountsStore.map((a) =>
    a.username === username
      ? { ...a, password: newPassword, isTempPassword: false }
      : a
  );
  const updated = accountsStore.find((a) => a.username === username);
  if (!updated) {
    const err = new Error("Account not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  const session = readSession();
  if (session?.user?.username === username) {
    const next = { ...session, user: publicUserOf(updated) };
    persistSession(next);
    return next;
  }
  return readSession();
  // return fetchJson("/auth/password", { method: "POST", body: { newPassword } });
}

export async function registerAccount(account) {
  await simulateLatency();
  if (accountsStore.some((a) => a.username === account.username)) {
    const err = new Error("Username already exists");
    err.code = "VALIDATION";
    throw err;
  }
  accountsStore = [...accountsStore, { ...account }];
  return publicUserOf(account);
  // return fetchJson("/auth/accounts", { method: "POST", body: account });
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}

/** List accounts (manager-only call site today; backend will enforce). */
export async function listAccounts() {
  await simulateLatency();
  return accountsStore.map(publicUserOf);
  // return fetchJson("/auth/accounts");
}
