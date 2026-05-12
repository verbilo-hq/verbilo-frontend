import { fetchJson } from "./http";

export async function getPublicTenant(slug) {
  return fetchJson(`/tenants/by-slug/${encodeURIComponent(slug)}`);
}

export async function listTenants() {
  return fetchJson("/admin/tenants");
}

export async function createTenant(payload) {
  return fetchJson("/admin/tenants", { method: "POST", body: payload });
}

export async function getTenant(id) {
  return fetchJson(`/admin/tenants/${encodeURIComponent(id)}`);
}

export async function updateTenant(id, patch) {
  return fetchJson(`/admin/tenants/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: patch,
  });
}

// VER-59: tenant branding (logo + primary/secondary/accent hex colours).
// Backend rejects no-op requests with 400; the form is expected to send
// only the fields that actually changed. Pass null to clear a field;
// omit it to leave it unchanged.
export async function updateTenantBranding(id, payload) {
  return fetchJson(`/admin/tenants/${encodeURIComponent(id)}/branding`, {
    method: "PATCH",
    body: payload,
  });
}

// VER-50: hard-delete a tenant. Backend returns 204 No Content; fetchJson
// resolves to null on 204. Cascade-wipes Sites/Users/Patients/Appointments/
// StaffMembers; AuditLog rows survive (no FK relation to Tenant). On prod
// the backend also removes the `{slug}.verbilo.co.uk` Vercel domain
// best-effort. The admin UI must double-confirm before calling this.
export async function deleteTenant(id) {
  return fetchJson(`/admin/tenants/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function checkTenantSlug(slug) {
  return fetchJson(
    `/admin/tenants/check-slug?slug=${encodeURIComponent(slug)}`,
  );
}
