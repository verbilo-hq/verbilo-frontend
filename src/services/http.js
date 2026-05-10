import { resolveSurface } from "../lib/host";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "";
const SESSION_KEY = "inspire_session";

let cachedTenantSlug = null;

function detectTenantSlug() {
  if (cachedTenantSlug !== null) return cachedTenantSlug;
  if (typeof window === "undefined") {
    cachedTenantSlug = "";
    return cachedTenantSlug;
  }
  const surface = resolveSurface({
    hostname: window.location.hostname,
    search: window.location.search,
    env: import.meta.env,
  });
  cachedTenantSlug = surface.surface === "tenant" && surface.slug ? surface.slug : "";
  return cachedTenantSlug;
}

function getToken() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

export async function fetchJson(path, { method = "GET", body, signal } = {}) {
  const token = getToken();
  const tenantSlug = detectTenantSlug();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantSlug ? { "X-Tenant-Slug": tenantSlug } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.code = res.status === 401 ? "UNAUTHORIZED"
      : res.status === 403 ? "FORBIDDEN"
      : res.status === 404 ? "NOT_FOUND"
      : res.status === 409 ? "CONFLICT"
      : res.status === 422 ? "VALIDATION"
      : "REQUEST_FAILED";
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}
