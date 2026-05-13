import { fetchJson } from "./http";

// VER-53: admin-portal user management — operating on customer users of a
// given tenant. Platform admins (verbilo_super_admin / verbilo_support)
// are tenantId=null (post-VER-51) and are naturally excluded from these
// endpoints since the backend filters by tenantId in the URL.

export async function listTenantUsers(tenantId) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users`,
  );
}

// VER-65: replaces the manual Cognito-console + Prisma-Studio flow.
// Backend creates the Cognito user + DB row + audit-log entry in one
// request and returns `{ user, temporaryPassword }`. The temp password
// must be displayed to the inviter once — the backend doesn't store it
// in plaintext and won't return it again.
export async function createTenantUser(tenantId, payload) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users`,
    { method: "POST", body: payload },
  );
}

export async function updateTenantUserRole(tenantId, userId, role) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}`,
    { method: "PATCH", body: { role } },
  );
}

// Soft-delete (sets User.deletedAt). The user keeps their Cognito account
// but RolesGuard rejects them on the next request, so any in-flight JWT
// stops working within seconds.
export async function disableTenantUser(tenantId, userId) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}/disable`,
    { method: "POST" },
  );
}

export async function enableTenantUser(tenantId, userId) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/users/${encodeURIComponent(userId)}/enable`,
    { method: "POST" },
  );
}
