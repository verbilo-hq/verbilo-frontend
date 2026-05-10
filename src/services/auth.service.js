import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { accountsFixture } from "./fixtures/accounts.fixture";
import { simulateLatency } from "./delay";
import { userPool } from "./cognito.client";
import { fetchMe } from "./me.service.js";
// import { fetchJson } from "./http";

const SESSION_KEY = "inspire_session";

let accountsStore = [...accountsFixture];
const tempPasswordUsers = new Map();

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

async function enrichSession(session) {
  try {
    const me = await fetchMe();
    const next = {
      token: session.token,
      user: { ...session.user, ...me },
    };
    persistSession(next);
    return next;
  } catch (err) {
    console.error("Failed to enrich session from /users/me", err);
    return session;
  }
}

export async function login(username, password) {
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
        const token = session.getIdToken().getJwtToken();
        const next = {
          token,
          user: { username, isTempPassword: false },
        };
        persistSession(next);
        resolve(await enrichSession(next));
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
        const token = session.getIdToken().getJwtToken();
        const next = {
          token,
          user: { username, isTempPassword: false },
        };
        tempPasswordUsers.delete(username);
        persistSession(next);
        resolve(await enrichSession(next));
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
