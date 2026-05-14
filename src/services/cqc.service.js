import { fetchJson } from "./http";

// VER-89: starter-template for CQC Compliance Hub — returns the 5
// KLOE domain buckets (Safe / Effective / Caring / Responsive /
// Well-led) per VER-85's fixtures. Dental + GP only; other sectors
// get an empty items array.
export async function listCqcStarterTemplates(tenantId) {
  if (!tenantId) return { items: [] };
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/starter-templates?module=cqc`,
  );
}
