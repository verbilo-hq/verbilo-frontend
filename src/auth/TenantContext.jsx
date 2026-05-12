import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { resolveSurface } from "../lib/host";
import { getPublicTenant } from "../services/tenants.service";
import { AuthContext } from "./AuthContext";

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

  // VER-59: inject tenant branding as CSS custom properties on the
  // document root whenever the tenant payload (or its branding fields)
  // changes. Null/empty values clear the property, letting the global
  // stylesheet's :root defaults kick back in.
  //
  // We only do this on the tenant surface — admin.verbilo.co.uk keeps
  // Verbilo's own brand regardless of which tenant the operator is
  // currently editing.
  useEffect(() => {
    if (surface.surface !== "tenant") return;
    const root = typeof document !== "undefined" ? document.documentElement : null;
    if (!root) return;

    const apply = (varName, value) => {
      if (value) root.style.setProperty(varName, value);
      else       root.style.removeProperty(varName);
    };

    apply("--tenant-primary",   tenant?.primaryColor);
    apply("--tenant-secondary", tenant?.secondaryColor);
    apply("--tenant-accent",    tenant?.accentColor);

    // Cleanup on unmount / tenant change — leave defaults in place.
    return () => {
      apply("--tenant-primary", null);
      apply("--tenant-secondary", null);
      apply("--tenant-accent", null);
    };
  }, [
    surface.surface,
    tenant?.primaryColor,
    tenant?.secondaryColor,
    tenant?.accentColor,
  ]);

  const value = useMemo(
    () => ({
      surface: surface.surface,
      slug: surface.slug,
      // Surface the resolved environment so consumers (e.g. AdminTenantsPage
      // building tenant URLs) don't have to call resolveSurface again. One
      // of "production" | "staging" | "development".
      environment: surface.environment,
      tenant,
      status,
      error,
    }),
    [surface.surface, surface.slug, surface.environment, tenant, status, error],
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  // Pull in site state from AuthContext so consumers get a single
  // { tenant, site, sites, setActiveSite } surface per VER-22.
  const auth = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return {
    ...ctx,
    site: auth?.site ?? null,
    sites: auth?.sites ?? [],
    setActiveSite: auth?.setActiveSite ?? (() => {}),
  };
}
