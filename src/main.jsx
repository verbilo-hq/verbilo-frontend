import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./theme/tokens.css";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { TenantProvider, useTenant } from "./auth/TenantContext.jsx";
import { PublicLandingPage } from "./pages/PublicLandingPage.jsx";
import { TenantNotFoundPage } from "./pages/TenantNotFoundPage.jsx";

const TenantApp = lazy(() => import("./App.jsx"));
const AdminPortalApp = lazy(() => import("./pages/admin/AdminPortalApp.jsx"));

function SurfaceFallback() {
  return (
    <div style={{ padding: 32, fontFamily: "var(--font-body)" }}>Loading…</div>
  );
}

function SurfaceRoot() {
  const { surface, slug, status } = useTenant();

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
    <TenantProvider>
      <AuthProvider>
        <SurfaceRoot />
      </AuthProvider>
    </TenantProvider>
  </React.StrictMode>,
);
