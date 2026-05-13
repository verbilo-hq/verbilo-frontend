import { useCallback, useEffect, useState } from "react";
import { useTenant } from "../auth/TenantContext";
import { useCapability } from "../auth/AuthContext";
import { getPublicTenant } from "../services/tenants.service";
import { AdminTenantBrandingSection } from "./admin/AdminTenantBrandingSection";
import { AdminTenantUsersSection } from "./admin/AdminTenantUsersSection";
import styles from "./TenantSettingsPage.module.css";

// VER-63: Settings page on the tenant surface ({slug}.verbilo.co.uk).
// Lets a Company Admin (or any user with the right capability) manage
// their tenant's branding + see/edit users from their own subdomain,
// rather than needing to ask a Verbilo Admin to do it in the admin
// portal. Capability-gated section-by-section so a Practice Manager
// (who can edit users but not branding) sees the users section only.
//
// The two child sections (`<AdminTenantBrandingSection>`,
// `<AdminTenantUsersSection>`) were built reuse-friendly in VER-59 and
// VER-53 — they don't care which surface they're mounted on, only that
// they're given a tenant payload + onSaved/canEdit callbacks.
export const TenantSettingsPage = () => {
  const { tenant: contextTenant, slug } = useTenant();

  // VER-63: branding payload comes from the public-tenant endpoint via
  // TenantContext. We re-fetch after a branding save so the form
  // reflects the latest server-side state (and CSS custom properties
  // re-apply via the TenantContext effect).
  const [tenant, setTenant] = useState(contextTenant);
  useEffect(() => setTenant(contextTenant), [contextTenant]);

  const refetchTenant = useCallback(() => {
    if (!slug) return;
    getPublicTenant(slug)
      .then((next) => setTenant(next))
      .catch(() => {});
  }, [slug]);

  // Capability gates — backend enforces, this just hides UI a user
  // can't use anyway. Loading state from AuthContext is a no-op here:
  // useCapability returns false until /users/me/permissions resolves,
  // so sections stay hidden until then.
  const canEditBranding = useCapability("tenant.update_branding");
  const canListUsers    = useCapability("users.list");
  const canEditUsers    = useCapability("users.update_role");

  if (!tenant) {
    return (
      <section>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.muted}>Loading tenant…</p>
      </section>
    );
  }

  return (
    <section>
      <header className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </header>

      {canEditBranding && (
        <AdminTenantBrandingSection
          tenant={tenant}
          onSaved={refetchTenant}
        />
      )}

      {canListUsers && (
        <AdminTenantUsersSection
          tenantId={tenant.id}
          canEdit={canEditUsers}
          sector={tenant.sector}
        />
      )}

      {!canEditBranding && !canListUsers && (
        <p className={styles.muted}>
          You don't have permission to manage settings for this tenant.
        </p>
      )}
    </section>
  );
};
