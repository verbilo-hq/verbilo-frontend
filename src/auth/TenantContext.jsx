import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { resolveSurface } from "../lib/host";
import { getPublicTenant } from "../services/tenants.service";

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [surface] = useState(() =>
    resolveSurface({
      hostname: typeof window !== "undefined" ? window.location.hostname : "",
      search: typeof window !== "undefined" ? window.location.search : "",
      env: import.meta.env,
    }),
  );

  const [tenant, setTenant] = useState(null);
  const [status, setStatus] = useState(
    surface.surface === "tenant" ? "loading" : "ready",
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (surface.surface !== "tenant" || !surface.slug) return;
    let cancelled = false;
    setStatus("loading");
    getPublicTenant(surface.slug)
      .then((data) => {
        if (cancelled) return;
        setTenant(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus(err.code === "NOT_FOUND" ? "not_found" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [surface.surface, surface.slug]);

  const value = useMemo(
    () => ({
      surface: surface.surface,
      slug: surface.slug,
      tenant,
      status,
      error,
    }),
    [surface.surface, surface.slug, tenant, status, error],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return ctx;
}
