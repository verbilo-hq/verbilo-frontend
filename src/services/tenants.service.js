import { fetchJson, fetchMultipart } from "./http";

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

// VER-69: upload a tenant logo file. Backend validates magic bytes
// (PNG / JPG / SVG / WebP), enforces a 2 MB cap, uploads to S3, and
// updates `tenant.logoUrl` to the new public URL atomically. Returns
// `{ logoUrl }`. Common errors:
//   413 PAYLOAD_TOO_LARGE → file > 2 MB
//   415 UNSUPPORTED_MEDIA → format not in whitelist
//   503 SERVICE_UNAVAILABLE → S3 not configured (local dev)
export async function uploadTenantLogo(id, file) {
  const form = new FormData();
  form.append("file", file);
  return fetchMultipart(
    `/admin/tenants/${encodeURIComponent(id)}/branding/logo`,
    form,
  );
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
