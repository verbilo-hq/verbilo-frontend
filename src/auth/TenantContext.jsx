import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveSurface } from "../lib/host";
import { getPublicTenant } from "../services/tenants.service";
import { AuthContext } from "./AuthContext";

const TenantContext = createContext(null);

// VER-80: darken a `#rrggbb` hex toward black by `amount` (0–1) in
// linear RGB. Used to derive `--primary-dim` from `tenant.primaryColor`
// so the existing `--gradient-primary` token still has internal
// contrast after a tenant override. Returns null for malformed input
// — caller treats that as "leave default in place."
function darkenHex(hex, amount) {
  if (typeof hex !== "string") return null;
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!match) return null;
  const v = match[1];
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  const f = 1 - Math.max(0, Math.min(1, amount));
  const toHex = (c) => Math.round(c * f).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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

  // VER-59 / VER-80: inject tenant branding as CSS custom properties
  // on the document root whenever the tenant payload (or its branding
  // fields) changes. Null/empty values clear the property, letting the
  // :root defaults in tokens.css kick back in.
  //
  // We override the ACTUAL design tokens (`--primary`, `--brand-active`,
  // `--secondary`, `--accent`) rather than inventing `--tenant-*` names
  // — that was the VER-80 bug, where stylesheets never read the
  // `--tenant-*` variants and branding silently no-op'd. The existing
  // `--gradient-primary` token in tokens.css is composed via
  // `var(--primary)` + `var(--primary-dim)`, so overriding those two
  // automatically re-themes every gradient consumer.
  //
  // Only on the tenant surface — admin.verbilo.co.uk keeps Verbilo's
  // own brand regardless of which tenant the operator is editing.
  useEffect(() => {
    if (surface.surface !== "tenant") return;
    const root = typeof document !== "undefined" ? document.documentElement : null;
    if (!root) return;

    const apply = (varName, value) => {
      if (value) root.style.setProperty(varName, value);
      else       root.style.removeProperty(varName);
    };

    // VER-80: primary drives a few derived tokens. We compute
    // --primary-dim ourselves (linear RGB darken) rather than letting
    // CSS color-mix do it, because the hardcoded --primary-dim in
    // tokens.css (#005c66) doesn't exactly match what color-mix would
    // produce for Verbilo's default #006974 — using color-mix would
    // shift untenanted appearance slightly. Computing on override
    // means defaults stay byte-identical to before.
    const primary = tenant?.primaryColor || null;
    const primaryDim = primary ? darkenHex(primary, 0.12) : null;

    apply("--primary",      primary);
    apply("--primary-dim",  primaryDim);
    apply("--brand-active", primary); // sidebar wordmark + active nav text
    apply("--secondary",    tenant?.secondaryColor || null);
    apply("--accent",       tenant?.accentColor || null); // new token; consumers opt in via var(--accent, fallback)

    // Cleanup on unmount / tenant change — leave defaults in place.
    return () => {
      apply("--primary", null);
      apply("--primary-dim", null);
      apply("--brand-active", null);
      apply("--secondary", null);
      apply("--accent", null);
    };
  }, [
    surface.surface,
    tenant?.primaryColor,
    tenant?.secondaryColor,
    tenant?.accentColor,
  ]);

  // VER-79: callers (e.g. TenantSettingsPage after a branding save) need
  // a way to force the context's tenant payload to refresh — otherwise
  // the CSS-vars effect below keeps applying stale colours and the
  // sidebar/topbar/etc. don't visibly update until a hard reload.
  const refreshTenant = useCallback(async () => {
    if (surface.surface !== "tenant" || !surface.slug) return;
    try {
      const next = await getPublicTenant(surface.slug);
      setTenant(next);
    } catch (err) {
      // Don't crash the page on a transient refresh failure — the user
      // already got a 200 from the underlying save, and the next route
      // change / mount will re-fetch anyway.
      setError(err);
    }
  }, [surface.surface, surface.slug]);

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
      refreshTenant,
    }),
    [
      surface.surface,
      surface.slug,
      surface.environment,
      tenant,
      status,
      error,
      refreshTenant,
    ],
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
