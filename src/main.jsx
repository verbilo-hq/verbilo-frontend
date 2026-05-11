import "./instrument";
import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./theme/tokens.css";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { TenantProvider, useTenant } from "./auth/TenantContext.jsx";
import { PublicLandingPage } from "./pages/PublicLandingPage.jsx";
import { TenantNotFoundPage } from "./pages/TenantNotFoundPage.jsx";
import { SentryErrorBoundary } from "./instrument.js";

// Keep `document.title` in sync with the current surface so the browser tab
// (and any bookmark / unfurl preview) reads e.g. "Verbilo · SmileCo" while
// on a tenant subdomain. Static title in index.html is the pre-mount default.
function useDocumentTitle() {
  const { surface, slug, tenant, status } = useTenant();
  useEffect(() => {
    let title = "Verbilo";
    if (surface === "admin") title = "Verbilo · Admin";
    else if (surface === "tenant") {
      if (tenant?.name) title = `Verbilo · ${tenant.name}`;
      else if (status === "not_found") title = "Verbilo · Tenant not found";
      else if (slug) title = `Verbilo · ${slug}`;
    }
    document.title = title;
  }, [surface, slug, tenant?.name, status]);
}

const TenantApp = lazy(() => import("./App.jsx"));
const AdminPortalApp = lazy(() => import("./pages/admin/AdminPortalApp.jsx"));

function SurfaceFallback() {
  return (
    <div style={{ padding: 32, fontFamily: "var(--font-body)" }}>Loading…</div>
  );
}

function CrashCard({ error, resetError }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          padding: 24,
          border: "1px solid var(--outline-variant)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface-lowest)",
        }}
      >
        <h1 style={{ marginBottom: 8 }}>Something went wrong.</h1>
        <p style={{ color: "var(--on-surface-variant)", marginBottom: 16 }}>
          The error was reported to the Verbilo team. Try refreshing the page,
          or hit the button below.
        </p>
        <button
          onClick={resetError}
          style={{
            background: "var(--primary)",
            color: "var(--on-primary)",
            border: 0,
            padding: "10px 18px",
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
        {error?.message && (
          <pre
            style={{
              marginTop: 16,
              padding: 12,
              background: "var(--surface-low)",
              borderRadius: "var(--radius-md)",
              fontSize: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {error.message}
          </pre>
        )}
      </div>
    </div>
  );
}

function SurfaceRoot() {
  const { surface, slug, status } = useTenant();
  useDocumentTitle();

  if (surface === "public") return <PublicLandingPage />;
  if (surface === "admin") {
    return (
      <Suspense fallback={<SurfaceFallback />}>
        <AdminPortalApp />
      </Suspense>
    );
  }

  // tenant
  if (status === "loading") return <SurfaceFallback />;
  if (status === "not_found" || status === "error") {
    return <TenantNotFoundPage slug={slug} />;
  }
  return (
    <Suspense fallback={<SurfaceFallback />}>
      <TenantApp />
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={CrashCard}>
      <TenantProvider>
        <AuthProvider>
          <SurfaceRoot />
        </AuthProvider>
      </TenantProvider>
    </SentryErrorBoundary>
  </React.StrictMode>,
);
