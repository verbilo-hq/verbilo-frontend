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

export async function checkTenantSlug(slug) {
  return fetchJson(
    `/admin/tenants/check-slug?slug=${encodeURIComponent(slug)}`,
  );
}
