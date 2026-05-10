const BASE_URL = import.meta.env.VITE_API_BASE ?? "";
const SESSION_KEY = "inspire_session";

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
    const err = new Error(`Request failed: ${res.status}`);
    err.code = res.status === 401 ? "UNAUTHORIZED"
      : res.status === 404 ? "NOT_FOUND"
      : res.status === 422 ? "VALIDATION"
      : "REQUEST_FAILED";
    throw err;
  }
  return res.status === 204 ? null : res.json();
}
