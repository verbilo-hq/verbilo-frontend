import { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  getSession,
  login as authLogin,
  setPassword as authSetPassword,
  logout as authLogout,
} from "../services/auth.service";
import { persistSession } from "../services/session";

// Exported so other hooks (e.g. useTenant) can compose context values
// without re-throwing when used outside a provider.
export const AuthContext = createContext(null);

function resolveActiveSite(session) {
  const sites = session?.user?.sites ?? [];
  if (!sites.length) return null;
  const id = session?.activeSiteId ?? sites[0]?.id ?? null;
  return sites.find((s) => s.id === id) ?? sites[0] ?? null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const login = useCallback(async (username, password) => {
    const next = await authLogin(username, password);
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

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: !!session?.user,
    site,
    sites,
    setActiveSite,
    login,
    setPassword,
    logout,
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
