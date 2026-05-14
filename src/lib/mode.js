/**
 * VER-83: tenant-mode vs demo-mode detector.
 *
 * "Demo mode" means: services return the rich, hypothetical-practice
 * fixture content under `src/fixtures/demo/` — used by the eventual
 * `demo.verbilo.co.uk` public demo subdomain (VER-39).
 *
 * "Tenant mode" means: services return honest empty state + sector
 * starter templates appropriate for a real tenant on
 * `{slug}.verbilo.co.uk`. This is what VER-82's subsequent tickets
 * (VER-86 dashboard, VER-87 clinical, VER-88 hr/training, etc.) are
 * progressively building.
 *
 * Until every module's tenant-mode branch exists, the default returns
 * `true` so existing tenant pages keep rendering demo content (no
 * regression). When the last module ships its tenant-mode branch,
 * this default flips to `false`.
 *
 * Detection precedence:
 *   1. `VITE_VERBILO_MODE` env var ("demo" | "tenant") — explicit override
 *   2. Hostname starting with `demo.` — subdomain heuristic for the
 *      eventual demo site
 *   3. Default `true` (see note above)
 */
export function isDemoMode() {
  const envMode = import.meta.env?.VITE_VERBILO_MODE;
  if (envMode === "demo") return true;
  if (envMode === "tenant") return false;
  if (typeof window !== "undefined" && window.location.hostname.startsWith("demo.")) {
    return true;
  }
  return true;
}
