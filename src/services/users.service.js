import { isDemoMode } from "../lib/mode";
import { fetchJson } from "./http";

// VER-53: admin-portal user management — operating on customer users of a
// given tenant. Platform admins (verbilo_super_admin / verbilo_support)
// are tenantId=null (post-VER-51) and are naturally excluded from these
// endpoints since the backend filters by tenantId in the URL.

// VER-39 follow-up: in-memory synthetic users for the demo subdomain.
// Mutates in place across listTenantUsers / updateRole / disable / enable
// / create / delete so the Users panel behaves coherently inside a
// session. Each visitor's tab gets a fresh copy of the seed list on
// page load (module reload), so cross-visitor isolation is the page
// boundary, not anything we enforce here.
const DEMO_USERS_SEED = [
  {
    id: "demo-u-1",
    username: "demo.user",
    role: "practice_manager",
    siteName: "London Flagship",
    deletedAt: null,
    createdAt: "2026-02-04T09:00:00.000Z",
  },
  {
    id: "demo-u-2",
    username: "sarah.patel",
    role: "area_manager",
    siteName: "—",
    deletedAt: null,
    createdAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "demo-u-3",
    username: "tom.brennan",
    role: "employee",
    siteName: "London Flagship",
    deletedAt: null,
    createdAt: "2026-02-18T09:00:00.000Z",
  },
  {
    id: "demo-u-4",
    username: "emma.collins",
    role: "practice_manager",
    siteName: "Bristol Clifton",
    deletedAt: null,
    createdAt: "2026-01-22T09:00:00.000Z",
  },
  {
    id: "demo-u-5",
    username: "olivia.davies",
    role: "company_admin",
    siteName: "—",
    deletedAt: null,
    createdAt: "2025-11-30T09:00:00.000Z",
  },
  {
    id: "demo-u-6",
    username: "james.wright",
    role: "employee",
    siteName: "Manchester Spinningfields",
    deletedAt: null,
    createdAt: "2026-03-08T09:00:00.000Z",
  },
  {
    id: "demo-u-7",
    username: "aisha.khan",
    role: "employee",
    siteName: "London Flagship",
    deletedAt: "2026-04-22T11:24:00.000Z",
    createdAt: "2025-09-14T09:00:00.000Z",
  },
];

let demoUsers = DEMO_USERS_SEED.map((u) => ({ ...u }));

function findDemoUser(id) {
  return demoUsers.find((u) => u.id === id) ?? null;
}

export async function listTenantUsers(tenantId) {
  if (isDemoMode()) return demoUsers.map((u) => ({ ...u }));
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users`,
  );
}

// VER-65: replaces the manual Cognito-console + Prisma-Studio flow.
// Backend creates the Cognito user + DB row + audit-log entry in one
// request.
//
// VER-74: response is a discriminated union driven by
// `payload.sendInvitationEmail`:
//   - `{ user, temporaryPassword }` — manual-share path. Operator
//     must display the temp password to the new user once; backend
//     doesn't store it in plaintext and won't return it again.
//   - `{ user, invitationEmailedTo }` — email-invite path. Cognito
//     emailed the temp password directly to the user; no password
//     comes back in the response body.
// Backend 400s if sendInvitationEmail is true without an email field.
export async function createTenantUser(tenantId, payload) {
  if (isDemoMode()) {
    const newUser = {
      id: `demo-u-${Date.now()}`,
      username: payload.username,
      role: payload.role,
      siteName: payload.siteName ?? "—",
      deletedAt: null,
      createdAt: new Date().toISOString(),
    };
    demoUsers = [...demoUsers, newUser];
    // Mirror the manual-share response shape (AddUserModal accepts both
    // shapes; this one shows a copy-the-temp-password panel which best
    // demonstrates the real flow).
    return { user: newUser, temporaryPassword: "DemoTemp" + Math.floor(Math.random() * 9000 + 1000) + "!" };
  }
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users`,
    { method: "POST", body: payload },
  );
}

export async function updateTenantUserRole(tenantId, userId, role) {
  if (isDemoMode()) {
    const u = findDemoUser(userId);
    if (u) u.role = role;
    return u;
  }
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}`,
    { method: "PATCH", body: { role } },
  );
}

// Soft-delete (sets User.deletedAt). The user keeps their Cognito account
// but RolesGuard rejects them on the next request, so any in-flight JWT
// stops working within seconds.
export async function disableTenantUser(tenantId, userId) {
  if (isDemoMode()) {
    const u = findDemoUser(userId);
    if (u) u.deletedAt = new Date().toISOString();
    return u;
  }
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}/disable`,
    { method: "POST" },
  );
}

export async function enableTenantUser(tenantId, userId) {
  if (isDemoMode()) {
    const u = findDemoUser(userId);
    if (u) u.deletedAt = null;
    return u;
  }
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}/enable`,
    { method: "POST" },
  );
}

// VER-67: hard delete a tenant user. Backend rejects with 409 if the
// user isn't already disabled — disable must happen first. Removes
// the Cognito identity AND the DB row (UserSiteAssignment cascades).
// Audit log keeps the trail.
export async function deleteTenantUser(tenantId, userId) {
  if (isDemoMode()) {
    demoUsers = demoUsers.filter((u) => u.id !== userId);
    return { id: userId };
  }
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}`,
    { method: "DELETE" },
  );
}
