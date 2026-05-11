// Surface detection from hostname (or dev overrides).
//
// Production surfaces (under `verbilo.co.uk`):
//   public — verbilo.co.uk (apex / www)         → marketing landing page
//   admin  — admin.verbilo.co.uk                → Verbilo internal portal
//   tenant — {slug}.verbilo.co.uk               → tenant intranet app
//
// Staging surfaces (under `staging.verbilo.co.uk`, mirrors production):
//   public — staging.verbilo.co.uk              → marketing landing page (staging build)
//   admin  — admin.staging.verbilo.co.uk        → admin portal on staging
//   tenant — {slug}.staging.verbilo.co.uk       → tenant app on staging
//
// Local dev fallback: hostnames that aren't *.verbilo.co.uk fall back to a
// query string or env override so a single Vite dev server can render any
// surface — e.g. http://localhost:5173/?surface=admin or
// http://localhost:5173/?surface=tenant&slug=companyx.

const VERBILO_DOMAIN = "verbilo.co.uk";
const STAGING_SUFFIX = "staging.verbilo.co.uk";

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

// Map a single leading subdomain label to a surface descriptor.
// Shared between production and staging parsing so both environments
// follow exactly the same rules (admin / tenant / reserved / invalid).
function classifyLeadingLabel(sub, environment) {
  if (sub === "www") return { surface: "public", slug: null, environment };
  if (sub === "admin") return { surface: "admin", slug: null, environment };
  if (RESERVED_SUBDOMAINS.has(sub)) return { surface: "public", slug: null, environment };
  if (!isValidSlug(sub)) return { surface: "public", slug: null, environment };
  return { surface: "tenant", slug: sub, environment };
}

function parseProductionSurface(hostname) {
  const host = hostname.toLowerCase();

  // Apex.
  if (host === VERBILO_DOMAIN) {
    return { surface: "public", slug: null, environment: "production" };
  }
  if (!host.endsWith(`.${VERBILO_DOMAIN}`)) return null;

  // Staging mirror: `staging.verbilo.co.uk` and any single-label below it.
  if (host === STAGING_SUFFIX) {
    return { surface: "public", slug: null, environment: "staging" };
  }
  if (host.endsWith(`.${STAGING_SUFFIX}`)) {
    const sub = host.slice(0, -1 - STAGING_SUFFIX.length);
    // Reject nested-under-staging (e.g. `x.y.staging.verbilo.co.uk`).
    if (!sub || sub.includes(".")) {
      return { surface: "public", slug: null, environment: "staging" };
    }
    return classifyLeadingLabel(sub, "staging");
  }

  // Plain production subdomain (single label below `verbilo.co.uk`).
  const sub = host.slice(0, -1 - VERBILO_DOMAIN.length);
  if (!sub || sub.includes(".")) {
    return { surface: "public", slug: null, environment: "production" };
  }
  return classifyLeadingLabel(sub, "production");
}

function parseDevOverride(searchString, env) {
  const params = new URLSearchParams(searchString || "");
  const overrideSurface = params.get("surface") || env?.VITE_DEV_SURFACE || null;
  const overrideSlug = params.get("slug") || env?.VITE_DEV_TENANT_SLUG || null;

  if (overrideSurface === "public") {
    return { surface: "public", slug: null, environment: "development" };
  }
  if (overrideSurface === "admin") {
    return { surface: "admin", slug: null, environment: "development" };
  }
  if (overrideSurface === "tenant" && overrideSlug && isValidSlug(overrideSlug)) {
    return { surface: "tenant", slug: overrideSlug, environment: "development" };
  }
  return null;
}

export function resolveSurface({ hostname, search, env } = {}) {
  const productionMatch = parseProductionSurface(hostname || "");
  if (productionMatch) return productionMatch;

  const devOverride = parseDevOverride(search, env);
  if (devOverride) return devOverride;

  // Default for unrecognised hosts (localhost without overrides, preview URLs).
  return { surface: "public", slug: null, environment: "development" };
}

export function tenantUrl(slug, environment = "production") {
  const domain = environment === "staging" ? STAGING_SUFFIX : VERBILO_DOMAIN;
  return `https://${slug}.${domain}`;
}
