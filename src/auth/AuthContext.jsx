import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getSession,
  login as authLogin,
  setPassword as authSetPassword,
  logout as authLogout,
} from "../services/auth.service";
import { AUTH_INVALIDATED_EVENT } from "../services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const login = useCallback(async (username, password, opts) => {
    const next = await authLogin(username, password, opts);
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

  useEffect(() => {
    const handleInvalidated = () => {
      authLogout();
      setSession(null);
    };
    window.addEventListener(AUTH_INVALIDATED_EVENT, handleInvalidated);
    return () => window.removeEventListener(AUTH_INVALIDATED_EVENT, handleInvalidated);
  }, []);

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: !!session?.user,
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
