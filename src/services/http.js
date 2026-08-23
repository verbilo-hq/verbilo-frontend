const BASE_URL = import.meta.env.VITE_API_BASE ?? "";
const SESSION_KEY = "inspire_session";
export const AUTH_INVALIDATED_EVENT = "verbilo:auth-invalidated";

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
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    // Try to pull the backend's error message off the response body so
    // the UI shows something useful ("Template X not found") instead of
    // a bare "Request failed: 404". Falls back gracefully if the body
    // isn't JSON or is empty.
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.message
        ? (Array.isArray(body.message) ? body.message.join("; ") : String(body.message))
        : "";
    } catch { /* not json or empty */ }
    const err = new Error(
      detail
        ? `Request failed: ${res.status} - ${detail}`
        : `Request failed: ${res.status}`,
    );
    err.code = res.status === 401 ? "UNAUTHORIZED"
      : res.status === 404 ? "NOT_FOUND"
      : res.status === 422 ? "VALIDATION"
      : res.status === 400 ? "BAD_REQUEST"
      : "REQUEST_FAILED";
    err.status = res.status;
    err.detail = detail;
    if (res.status === 401) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
      try { localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
      window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT));
    }
    throw err;
  }
  return res.status === 204 ? null : res.json();
}
