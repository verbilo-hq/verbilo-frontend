// Surface detection from hostname (or dev overrides).
// Surfaces:
//   public — verbilo.co.uk (apex / www)         → marketing landing page
//   admin  — admin.verbilo.co.uk                → Verbilo internal portal
//   tenant — {slug}.verbilo.co.uk               → tenant intranet app
//
// Local dev fallback: hostnames that aren't *.verbilo.co.uk fall back to a
// query string or env override so a single Vite dev server can render any
// surface — e.g. http://localhost:5173/?surface=admin or
// http://localhost:5173/?surface=tenant&slug=companyx.

const VERBILO_DOMAIN = "verbilo.co.uk";

const RESERVED_SUBDOMAINS = new Set([
  "admin", "www", "api", "verbilo", "app", "mail", "ftp", "dev", "staging",
  "prod", "production", "static", "cdn", "assets", "docs", "support", "help",
  "auth", "login", "signup", "public", "internal",
]);

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;
const PURE_NUMERIC = /^\d+$/;

export function isValidSlug(slug) {
  return (
    typeof slug === "string" &&
    slug.length >= 3 &&
    slug.length <= 32 &&
    SLUG_PATTERN.test(slug) &&
    !PURE_NUMERIC.test(slug)
  );
}

export function isReservedSubdomain(slug) {
  return RESERVED_SUBDOMAINS.has(slug);
}

function parseProductionSurface(hostname) {
  const host = hostname.toLowerCase();
  if (host === VERBILO_DOMAIN) return { surface: "public", slug: null };
  if (!host.endsWith(`.${VERBILO_DOMAIN}`)) return null;

  const sub = host.slice(0, -1 - VERBILO_DOMAIN.length);
  if (!sub || sub.includes(".")) return { surface: "public", slug: null };
  if (sub === "www") return { surface: "public", slug: null };
  if (sub === "admin") return { surface: "admin", slug: null };
  if (RESERVED_SUBDOMAINS.has(sub)) return { surface: "public", slug: null };
  if (!isValidSlug(sub)) return { surface: "public", slug: null };
  return { surface: "tenant", slug: sub };
}

function parseDevOverride(searchString, env) {
  const params = new URLSearchParams(searchString || "");
  const overrideSurface = params.get("surface") || env?.VITE_DEV_SURFACE || null;
  const overrideSlug = params.get("slug") || env?.VITE_DEV_TENANT_SLUG || null;

  if (overrideSurface === "public") return { surface: "public", slug: null };
  if (overrideSurface === "admin") return { surface: "admin", slug: null };
  if (overrideSurface === "tenant" && overrideSlug && isValidSlug(overrideSlug)) {
    return { surface: "tenant", slug: overrideSlug };
  }
  return null;
}

export function resolveSurface({ hostname, search, env } = {}) {
  const productionMatch = parseProductionSurface(hostname || "");
  if (productionMatch) return productionMatch;

  const devOverride = parseDevOverride(search, env);
  if (devOverride) return devOverride;

  // Default for unrecognised hosts (localhost without overrides, preview URLs).
  return { surface: "public", slug: null };
}

export function tenantUrl(slug) {
  return `https://${slug}.${VERBILO_DOMAIN}`;
}
