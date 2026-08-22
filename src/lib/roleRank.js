// VER-65: mirror of the backend's `ROLE_RANK` in
// `src/common/capabilities.ts`. Backend is the source of truth — this
// table just drives the role-picker filter in the "Add user" modal so
// we don't offer a role the backend will 403 on.
//
// Keep these numbers in sync with the backend. Higher rank = more
// powerful. A user can only create someone with rank ≤ their own.
const ROLE_RANK = Object.freeze({
  employee:            10,
  practice_manager:    20,
  area_manager:        30,
  company_admin:       40,
  company_owner:       50,
  verbilo_support:     80,
  verbilo_super_admin: 100,
});

// Customer-side roles only — `verbilo_*` are platform roles, not
// assignable inside a tenant via this UX. Keep in sync with
// `CUSTOMER_ROLE_IDS` in `AdminTenantUsersSection.jsx`.
export const CUSTOMER_ROLE_IDS = Object.freeze([
  "employee",
  "practice_manager",
  "area_manager",
  "company_admin",
  "company_owner",
]);

// Returns the subset of customer role ids the actor is allowed to
// create (rank ≤ actor's rank). Unknown actor role → empty list, so
// the UI hides "Add user" entirely until permissions are loaded.
export function assignableCustomerRoles(actorRole) {
  const actorRank = ROLE_RANK[actorRole];
  if (actorRank == null) return [];
  return CUSTOMER_ROLE_IDS.filter((id) => ROLE_RANK[id] <= actorRank);
}
