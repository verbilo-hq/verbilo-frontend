import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  getSession,
  login as authLogin,
  setPassword as authSetPassword,
  logout as authLogout,
} from "../services/auth.service";
import { fetchMyPermissions } from "../services/me.service.js";
import { persistSession } from "../services/session";
import { isDemoMode } from "../lib/mode";

// Exported so other hooks (e.g. useTenant) can compose context values
// without re-throwing when used outside a provider.
export const AuthContext = createContext(null);

// VER-39: synthetic auth identity for `demo.verbilo.co.uk`. The demo
// surface has no real session — useAuth.user would be null and the
// Sidebar / role-aware pages would crash on `user.displayName`. Inject
// this instead so the demo renders end-to-end.
const DEMO_AUTH_USER = {
  id: "demo-user",
  username: "demo.user",
  displayName: "Demo User",
  email: "demo@verbilo.co.uk",
  role: "practice_manager",
  isTempPassword: false,
  sites: [],
};

// All capabilities granted in demo so every UI control is visible —
// the demo is a feature tour, not a permissions test. Capability names
// must match what useCapability() consumers actually check for; see
// `verbilo-backend/src/common/capabilities.ts` for the canonical list.
const DEMO_CAPABILITIES = [
  "tenant.update_branding",
  "tenant.update_sites",
  "tenant.create",
  "tenant.archive",
  "users.list",
  "users.create",
  "users.update_role",
  "users.disable",
  "users.delete",
];

function resolveActiveSite(session) {
  const sites = session?.user?.sites ?? [];
  if (!sites.length) return null;
  const id = session?.activeSiteId ?? sites[0]?.id ?? null;
  return sites.find((s) => s.id === id) ?? sites[0] ?? null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  // VER-61: capability + scope payload from /users/me/permissions.
  // null = not yet loaded (or signed out). The shape matches the
  // backend's MePermissionsResponse:
  //   { role, capabilities[], scope, isPlatformAdmin }.
  // Fetched after sign-in / on initial load when a session exists.
  // Refetched when the username changes (different account signed in).
  const [permissions, setPermissions] = useState(null);
  const [permissionsStatus, setPermissionsStatus] = useState("idle");

  // Load permissions whenever we have a session token. The /users/me/
  // permissions call needs the bearer token, so we only fire it when
  // session?.token is present. fetchJson handles the auth header.
  useEffect(() => {
    if (!session?.token) {
      setPermissions(null);
      setPermissionsStatus("idle");
      return;
    }
    let cancelled = false;
    setPermissionsStatus("loading");
    fetchMyPermissions()
      .then((data) => {
        if (cancelled) return;
        setPermissions(data);
        setPermissionsStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        // Permissions fetch failed — fall back to an empty-cap state
        // so the UI hides everything rather than guessing. Backend
        // still enforces, so this is just degraded UX, not a hole.
        console.warn("Failed to load /users/me/permissions", err);
        setPermissions({ role: session?.user?.role ?? "", capabilities: [], scope: { kind: "none" }, isPlatformAdmin: false });
        setPermissionsStatus("error");
      });
    return () => { cancelled = true; };
  }, [session?.token, session?.user?.username]);

  const login = useCallback(async (username, password, options = {}) => {
    // `options.persistent` threads through to session storage selection
    // (localStorage vs sessionStorage). See VER-54 + services/session.js.
    const next = await authLogin(username, password, options);
    setSession(next);
    return next.user;
  }, []);

  const setPassword = useCallback(async (newPassword) => {
    if (!session?.user?.username) return null;
    const next = await authSetPassword(session.user.username, newPassword);
    setSession(next);
    return next?.user ?? null;
  }, [session]);

  const logout = useCallback(() => {
    authLogout();
    setSession(null);
    setPermissions(null);
    setPermissionsStatus("idle");
  }, []);

  const setActiveSite = useCallback((siteId) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, activeSiteId: siteId };
      persistSession(next);
      return next;
    });
  }, []);

  const sites = session?.user?.sites ?? [];
  const site = useMemo(() => resolveActiveSite(session), [session]);

  // Memoised capability set for O(1) `has` checks from useCapability().
  const capabilitySet = useMemo(
    () => new Set(permissions?.capabilities ?? []),
    [permissions?.capabilities],
  );

  // VER-39: on the demo subdomain, override the live session with a
  // synthetic identity + full capability set. Done at the value layer
  // rather than the state layer so logout/login plumbing stays inert —
  // demo mode just shadows whatever auth state happens to exist.
  const demo = isDemoMode();
  const demoCapabilitySet = useMemo(() => new Set(DEMO_CAPABILITIES), []);

  const value = demo
    ? {
        user: DEMO_AUTH_USER,
        token: null,
        isAuthenticated: true,
        site: null,
        sites: [],
        setActiveSite: () => {},
        login,
        setPassword,
        logout,
        permissions: { role: DEMO_AUTH_USER.role, capabilities: DEMO_CAPABILITIES, scope: { kind: "tenant" }, isPlatformAdmin: false },
        permissionsStatus: "ready",
        capabilitySet: demoCapabilitySet,
      }
    : {
        user: session?.user ?? null,
        token: session?.token ?? null,
        isAuthenticated: !!session?.user,
        site,
        sites,
        setActiveSite,
        login,
        setPassword,
        logout,
        permissions,
        permissionsStatus,
        capabilitySet,
      };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

/**
 * VER-61: returns whether the current actor has a given capability.
 *
 * Backend is still the source of truth — every protected endpoint
 * checks role + scope. This hook is for UX: hide controls the user
 * can't use rather than showing them and 403'ing on click.
 *
 * Returns `false` until permissions have loaded — pages should
 * either skeleton the affected controls or render them disabled
 * while `permissionsStatus === 'loading'`.
 *
 * Safe to call outside an AuthProvider — returns false rather than
 * throwing, so public pages don't need to know about auth.
 */
export function useCapability(capability) {
  const ctx = useContext(AuthContext);
  if (!ctx) return false;
  return ctx.capabilitySet.has(capability);
}

/**
 * Focused hook for the active-site selector — most pages only care about
 * which site they're scoped to and the list to switch between.
 *
 * Outside an AuthProvider (e.g. on the public landing page) this returns
 * harmless defaults rather than throwing, so it's safe to call anywhere.
 */
export function useActiveSite() {
  const ctx = useContext(AuthContext);
  return {
    site: ctx?.site ?? null,
    sites: ctx?.sites ?? [],
    setActiveSite: ctx?.setActiveSite ?? (() => {}),
  };
}
