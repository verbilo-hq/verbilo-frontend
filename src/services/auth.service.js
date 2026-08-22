import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { accountsFixture } from "./fixtures/accounts.fixture";
import { simulateLatency } from "./delay";
import { userPool } from "./cognito.client";
import { fetchMe } from "./me.service.js";
import { readTimeOffState, ROLE_LABELS } from "./timeOff.service.js";
import { applyCapabilityRole, capabilityRoleFor } from "./devRole.js";
// import { fetchJson } from "./http";

const SESSION_KEY = "inspire_session";

// In dev, bypass real Cognito and mint tokens from the local mock when the
// configured pool ID is the placeholder one. Production builds keep going
// through amazon-cognito-identity-js.
const USE_MOCK_COGNITO =
  import.meta.env.DEV &&
  import.meta.env.VITE_COGNITO_USER_POOL_ID === "eu-north-1_devmockpool";
const MOCK_COGNITO_URL =
  import.meta.env.VITE_MOCK_COGNITO_URL ?? "http://localhost:9229";

// Mint a real RS256 JWT from the local mock-Cognito for `account`. We pass the
// stable id as `sub` and carry the granular org role in custom claims +
// `cognito:groups` — mirroring how the real Cognito pool will shape the token,
// so production is a config swap (point at the real issuer), not a rewrite.
async function mintMockToken(account) {
  const res = await fetch(`${MOCK_COGNITO_URL}/dev-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: account.username,
      sub: account.id ?? account.username,
      extra: {
        "custom:role": account.role,
        "cognito:groups": account.role ? [account.role] : [],
      },
    }),
  });
  if (!res.ok) {
    const err = new Error(`mock-cognito returned ${res.status}`);
    err.code = "REQUEST_FAILED";
    throw err;
  }
  const { access_token } = await res.json();
  return access_token;
}

// The canonical, LIVE account list. Once the HR engine has mutated state
// (hires, edits, entitlement changes), its `users` array supersedes the static
// demoUsers fixture — so newly-created staff can sign in and edits persist.
// In production this whole resolver is replaced by `/users/me` off the JWT.
function liveAccounts() {
  try {
    const stateUsers = readTimeOffState()?.users;
    if (Array.isArray(stateUsers) && stateUsers.length) return stateUsers;
  } catch {
    /* fall through to fixture */
  }
  return accountsFixture;
}

let accountsStore = [...accountsFixture];
const tempPasswordUsers = new Map();

function persistSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* sessionStorage unavailable — session lives in memory only this tab */
  }
  // "Remember my session" — when the user opted in at sign-in, mirror every
  // session update to localStorage so signing in survives closing the tab.
  try {
    if (localStorage.getItem(SESSION_KEY) !== null) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch { /* noop */ }
}

function clearPersistedSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
  try { localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  // No tab session — restore a remembered one (opted in via the login
  // checkbox) and re-seed sessionStorage so the rest of the app is unchanged.
  try {
    const persisted = localStorage.getItem(SESSION_KEY);
    if (!persisted) return null;
    sessionStorage.setItem(SESSION_KEY, persisted);
    return JSON.parse(persisted);
  } catch {
    return null;
  }
}

function tokenIsExpired(token) {
  if (!token) return false;
  try {
    const segment = token.split(".")[1];
    if (!segment) return true;
    const unpadded = segment.replace(/-/g, "+").replace(/_/g, "/");
    const encoded = unpadded.padEnd(Math.ceil(unpadded.length / 4) * 4, "=");
    const payload = JSON.parse(atob(encoded));
    return Number.isFinite(payload.exp) && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function publicUserOf(account) {
  if (!account) return null;
  // Never return password to the client surface beyond the auth boundary.
  const { password, ...safe } = account;
  void password;
  // The HR/org model carries a granular role (companyOwner, areaManager,
  // leadNurse, …). We keep that as `orgRole` (used by the HR Hub / Staff
  // Directory and the org identity going forward), and project it onto the
  // site's existing capability vocabulary as `role` (group_admin /
  // company_management / area_manager / practice_manager / clinical_director /
  // staff) so every legacy role-gated screen keeps working unchanged. The HR
  // engine itself resolves org role/scope/hierarchy from its own state by
  // `user.id`, so it never needs `role`.
  const orgRole = safe.role;
  const capabilityRole = capabilityRoleFor(orgRole);
  // Human-readable label for the granular org role (e.g. "Lead Nurse"), used
  // for identity display in the header/sidebar. Falls back to the role id.
  const orgRoleLabel = ROLE_LABELS[orgRole] ?? safe.hrProfile?.jobTitle ?? orgRole;
  return { ...safe, orgRole, orgRoleLabel, role: capabilityRole, capabilityRole };
}

export function getSession() {
  const session = readSession();
  if (!session?.user?.username) return session;
  if (tokenIsExpired(session.token)) {
    userPool.getCurrentUser()?.signOut();
    clearPersistedSession();
    return null;
  }
  // In dev, re-resolve the user from the LIVE account list on every load so HR
  // edits (entitlements, profile, moves) survive a refresh, and re-sync the
  // capability role. Production reads this off `/users/me` instead.
  if (USE_MOCK_COGNITO) {
    const account = liveAccounts().find((a) => a.username === session.user.username);
    if (account) {
      const user = publicUserOf(account);
      applyCapabilityRole(account.role);
      return { ...session, user };
    }
  }
  // A production session is only trusted after `/users/me` supplied its
  // authoritative tenancy and role. Temporary-password sessions are the one
  // expected exception because they have no ID token yet.
  if (!session.user.isTempPassword && (!session.user.tenantId || !session.user.role)) {
    clearPersistedSession();
    return null;
  }
  return session;
}

async function enrichSession(session) {
  const me = await fetchMe();
  const next = {
    token: session.token,
    user: { ...session.user, ...me },
  };
  applyCapabilityRole(me.orgRole ?? me.role);
  persistSession(next);
  return next;
}

function accountValidationError(err) {
  console.error("Failed to validate authenticated account with /users/me", err);
  userPool.getCurrentUser()?.signOut();
  clearPersistedSession();
  const next = new Error("Your account could not be validated. Please sign in again.");
  next.code = err?.code === "UNAUTHORIZED" || err?.code === "NOT_FOUND"
    ? "UNAUTHORIZED"
    : "REQUEST_FAILED";
  return next;
}

export async function login(username, password, { remember = false } = {}) {
  // Arm (or clear) the localStorage mirror BEFORE the session is persisted:
  // persistSession keeps mirroring for as long as the marker key exists.
  try {
    if (remember) localStorage.setItem(SESSION_KEY, "null");
    else localStorage.removeItem(SESSION_KEY);
  } catch { /* noop */ }

  if (USE_MOCK_COGNITO) {
    await simulateLatency();
    // Validate username + password against the live account list (the 18 demo
    // users / any staff later created via the HR engine). Real Cognito does
    // this server-side; here we check the fixture password.
    const account = liveAccounts().find(
      (a) => a.username === username && a.password === password,
    );
    if (!account) {
      const err = new Error("Invalid username or password");
      err.code = "UNAUTHORIZED";
      throw err;
    }
    const token = await mintMockToken(account);
    const user = publicUserOf(account);     // rich org profile (orgRole/scope/hierarchy/HR)
    applyCapabilityRole(account.role);       // sync capability gates to this user's org role
    const next = { token, user };
    persistSession(next);
    // NOTE: no `/users/me` enrich in dev — the rich profile is resolved locally
    // (localStorage stand-in). Production restores enrichSession() below.
    return next;
  }

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      async onSuccess(session) {
        try {
          const token = session.getIdToken().getJwtToken();
          const next = {
            token,
            user: { username, isTempPassword: false },
          };
          resolve(await enrichSession(next));
        } catch (err) {
          reject(accountValidationError(err));
        }
      },
      newPasswordRequired() {
        tempPasswordUsers.set(username, cognitoUser);
        const next = {
          token: null,
          user: { username, isTempPassword: true },
        };
        persistSession(next);
        resolve(next);
      },
      onFailure(err) {
        const next = new Error(err?.message ?? "Sign-in failed");
        next.code =
          err?.code === "NotAuthorizedException" ||
          err?.code === "UserNotFoundException"
            ? "UNAUTHORIZED"
            : "REQUEST_FAILED";
        reject(next);
      },
    });
  });
}

export async function setPassword(username, newPassword) {
  const cognitoUser = tempPasswordUsers.get(username);
  if (!cognitoUser) {
    const err = new Error("Temporary password session expired");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  return new Promise((resolve, reject) => {
    cognitoUser.completeNewPasswordChallenge(newPassword, {}, {
      async onSuccess(session) {
        try {
          const token = session.getIdToken().getJwtToken();
          const next = {
            token,
            user: { username, isTempPassword: false },
          };
          tempPasswordUsers.delete(username);
          resolve(await enrichSession(next));
        } catch (err) {
          reject(accountValidationError(err));
        }
      },
      onFailure(err) {
        const next = new Error(err?.message ?? "Password update failed");
        next.code =
          err?.code === "NotAuthorizedException" ||
          err?.code === "UserNotFoundException"
            ? "UNAUTHORIZED"
            : "REQUEST_FAILED";
        reject(next);
      },
    });
  });
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
  userPool.getCurrentUser()?.signOut();
  clearPersistedSession();
}

/** List accounts (manager-only call site today; backend will enforce). */
export async function listAccounts() {
  await simulateLatency();
  return accountsStore.map(publicUserOf);
  // return fetchJson("/auth/accounts");
}
