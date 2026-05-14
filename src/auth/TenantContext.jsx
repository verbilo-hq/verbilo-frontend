import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { resolveSurface } from "../lib/host";
import { isDemoMode } from "../lib/mode";
import { getPublicTenant } from "../services/tenants.service";
import { AuthContext } from "./AuthContext";

// VER-39: synthetic tenant injected on `demo.verbilo.co.uk`. No backend
// fetch, no auth gate — the demo subdomain is the public sales tour.
// Sector "dental" picks the richest fixture set; all modules enabled so
// every nav link resolves. Colours left null so the default Verbilo
// palette renders (tokens.css :root defaults).
const DEMO_TENANT = {
  id: "demo-tenant",
  slug: "demo",
  name: "Verbilo Demo Practice",
  sector: "dental",
  enabledModules: [
    "dashboard",
    "clinical",
    "hr",
    "cpd",
    "training",
    "cqc",
    "marketing",
    "lab",
  ],
  logoUrl: null,
  primaryColor: null,
  secondaryColor: null,
  accentColor: null,
  createdAt: null,
  archivedAt: null,
};

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

// VER-81: perceived-luminance check on `#rrggbb`. Returns true for
// light colours (where we want dark foreground), false for dark
// (where white foreground reads). Threshold 140 picks middle-grey
// as the boundary. Used to decide sidebar text colour when a tenant
// has overridden the sidebar bg via `secondaryColor`.
function isHexLight(hex) {
  if (typeof hex !== "string") return false;
  const match = /^#([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!match) return false;
  const v = match[1];
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  // Rec. 601 luma — perceived brightness, 0-255.
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return luma > 140;
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
    // VER-39: demo subdomain short-circuits the network — no backend
    // tenant row exists for "demo", so we inject the synthetic one and
    // mark ready immediately.
    if (surface.slug === "demo" && isDemoMode()) {
      setTenant(DEMO_TENANT);
      setStatus("ready");
      return;
    }
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
    const secondary = tenant?.secondaryColor || null;
    const accent = tenant?.accentColor || null;

    apply("--primary",      primary);
    apply("--primary-dim",  primaryDim);
    apply("--brand-active", primary); // sidebar wordmark + active nav text
    apply("--secondary",    secondary);
    apply("--accent",       accent);

    // VER-81: when the tenant has overridden --secondary, drive the
    // semantic sidebar tokens too — sidebar bg becomes the tenant
    // secondary, foreground flips to white/dark based on luminance,
    // and the per-card / active-state highlights become semi-translucent
    // whites so they read against the new fill regardless of hue.
    if (secondary) {
      const sidebarLight = isHexLight(secondary);
      const sidebarFg = sidebarLight ? "#0e1313" : "#ffffff";
      const sidebarFgMuted = sidebarLight
        ? "rgba(14, 19, 19, 0.65)"
        : "rgba(255, 255, 255, 0.72)";
      const sidebarCardBg = sidebarLight
        ? "rgba(0, 0, 0, 0.06)"
        : "rgba(255, 255, 255, 0.10)";
      const sidebarActiveBg = sidebarLight
        ? "rgba(0, 0, 0, 0.10)"
        : "rgba(255, 255, 255, 0.18)";
      const sidebarTrackBg = sidebarLight
        ? "rgba(0, 0, 0, 0.12)"
        : "rgba(255, 255, 255, 0.20)";

      apply("--sidebar-bg",          secondary);
      apply("--sidebar-fg",          sidebarFg);
      apply("--sidebar-fg-muted",    sidebarFgMuted);
      apply("--sidebar-card-bg",     sidebarCardBg);
      apply("--sidebar-active-bg",   sidebarActiveBg);
      apply("--sidebar-active-fg",   sidebarFg);
      apply("--sidebar-brand-color", sidebarFg);
      apply("--sidebar-track-bg",    sidebarTrackBg);
    } else {
      // No secondary override → unset the semantic tokens so the
      // tokens.css defaults (var(--surface-low) etc.) kick back in.
      apply("--sidebar-bg",          null);
      apply("--sidebar-fg",          null);
      apply("--sidebar-fg-muted",    null);
      apply("--sidebar-card-bg",     null);
      apply("--sidebar-active-bg",   null);
      apply("--sidebar-active-fg",   null);
      apply("--sidebar-brand-color", null);
      apply("--sidebar-track-bg",    null);
    }

    // VER-81: tenant.accentColor tints the body background.
    apply("--accent-bg", accent);

    // Cleanup on unmount / tenant change — leave defaults in place.
    return () => {
      apply("--primary", null);
      apply("--primary-dim", null);
      apply("--brand-active", null);
      apply("--secondary", null);
      apply("--accent", null);
      apply("--sidebar-bg", null);
      apply("--sidebar-fg", null);
      apply("--sidebar-fg-muted", null);
      apply("--sidebar-card-bg", null);
      apply("--sidebar-active-bg", null);
      apply("--sidebar-active-fg", null);
      apply("--sidebar-brand-color", null);
      apply("--sidebar-track-bg", null);
      apply("--accent-bg", null);
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
    // VER-39: on the demo subdomain there's no backend tenant row to
    // re-fetch — the branding panel already updates the in-memory
    // tenant via setLocalBranding, so there's nothing to do here.
    if (surface.slug === "demo" && isDemoMode()) return;
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

  // VER-39 follow-up: merge a partial branding patch into the in-memory
  // tenant. Used by the demo subdomain so visitors can play with the
  // branding panel without round-tripping to a backend they have no
  // session for — each visitor gets their own client-only preview, no
  // shared state. Pages elsewhere should keep using updateTenantBranding
  // + refreshTenant; this is the demo escape hatch.
  const setLocalBranding = useCallback((patch) => {
    setTenant((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

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
      setLocalBranding,
    }),
    [
      surface.surface,
      surface.slug,
      surface.environment,
      tenant,
      status,
      error,
      refreshTenant,
      setLocalBranding,
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
