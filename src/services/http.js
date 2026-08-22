import { resolveSurface } from "../lib/host";
import { getToken } from "./session.js";

const BASE_URL = import.meta.env.VITE_API_BASE ?? "";

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

function statusCode(status) {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  if (status === 415) return "UNSUPPORTED_MEDIA";
  if (status === 422) return "VALIDATION";
  if (status === 503) return "SERVICE_UNAVAILABLE";
  return "REQUEST_FAILED";
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
    err.code = statusCode(res.status);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

// VER-69: multipart upload (file inputs). Browser sets the
// Content-Type with a boundary itself — we MUST NOT set it manually,
// or it'll override and miss the boundary.
export async function fetchMultipart(path, formData, { method = "POST", signal } = {}) {
  const token = getToken();
  const tenantSlug = detectTenantSlug();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantSlug ? { "X-Tenant-Slug": tenantSlug } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.code = statusCode(res.status);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}
