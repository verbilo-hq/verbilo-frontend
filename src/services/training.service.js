import { fetchJson } from "./http";

// VER-88: starter-template library for Training Hub. Backed by
// /admin/tenants/:id/starter-templates?module=training from VER-85.
// TrainingPage's other (inline) fixtures still live in TrainingPage.jsx
// and will move to src/fixtures/demo/training/ during the eventual
// demo subdomain build (VER-39).
export async function listTrainingStarterTemplates(tenantId) {
  if (!tenantId) return { items: [] };
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/starter-templates?module=training`,
  );
}
