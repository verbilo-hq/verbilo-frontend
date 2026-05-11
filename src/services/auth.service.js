import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { userPool } from "./cognito.client";
import { fetchMe } from "./me.service.js";
import {
  readSession,
  persistSession,
  clearSession,
} from "./session.js";

const tempPasswordUsers = new Map();

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

// Account provisioning (Cognito user + StaffMember link) lives behind a
// dedicated backend endpoint that isn't built yet — tracked separately.
// Until then this is a no-op so the StaffPage "Add staff" flow doesn't
// blow up; the staff record is still created via createStaff().
export async function registerAccount(_account) {
  return null;
}

export function logout() {
  userPool.getCurrentUser()?.signOut();
  clearSession();
}
