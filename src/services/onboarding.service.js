import { fetchJson } from "./http";

/**
 * VER-91: Tenant onboarding state.
 *
 * Three endpoints:
 *   - getTenantOnboarding(tenantId): admin/operator read (verbilo admin
 *     portal Onboarding section). Returns the full 4-flag derived state +
 *     handover trio.
 *   - markHandoverComplete(tenantId): operator action — toggles the
 *     handoverComplete flag + audit-logs. Idempotent: throws 409 if
 *     already complete.
 *   - getMyOnboardingActions(): user-facing next-action list for the
 *     signed-in user. Returns [] for platform actors (no tenant context).
 *     Used by the tenant Dashboard's SetupChecklist widget.
 */

export async function getTenantOnboarding(tenantId) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/onboarding`,
  );
}

export async function markHandoverComplete(tenantId) {
  return fetchJson(
    `/admin/tenants/${encodeURIComponent(tenantId)}/onboarding/handover-complete`,
    { method: "POST" },
  );
}

export async function getMyOnboardingActions() {
  return fetchJson("/users/me/onboarding-actions");
}
