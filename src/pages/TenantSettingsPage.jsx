import { useEffect, useState } from "react";
import { useTenant } from "../auth/TenantContext";
import { useCapability } from "../auth/AuthContext";
import { AdminTenantBrandingSection } from "./admin/AdminTenantBrandingSection";
import { AdminTenantUsersSection } from "./admin/AdminTenantUsersSection";
import { TenantSettingsOnboardingSection } from "./TenantSettingsOnboardingSection";
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
  // VER-79: pull `refreshTenant` from the context — after a branding
  // save we need the CONTEXT's tenant to update so the document-root
  // CSS variables (--tenant-primary etc.) re-apply. Updating only the
  // local `tenant` state below would refresh this page's preview but
  // leave the rest of the tenant surface on the old colours.
  const { tenant: contextTenant, refreshTenant } = useTenant();

  // Local mirror of the context tenant — kept so child sections that
  // expect a `tenant` prop don't have to call useTenant themselves.
  // The useEffect syncs to context on any context change (including
  // the post-save refresh).
  const [tenant, setTenant] = useState(contextTenant);
  useEffect(() => setTenant(contextTenant), [contextTenant]);

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

      {/* VER-91 follow-up: surface the user-facing checklist here too,
          mirroring the Verbilo-admin Onboarding section. Read-only —
          no handover button (operator-only). Hides itself when there
          are no pending actions. */}
      <TenantSettingsOnboardingSection />

      {canEditBranding && (
        <AdminTenantBrandingSection
          tenant={tenant}
          onSaved={refreshTenant}
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
