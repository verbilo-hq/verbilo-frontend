// Sector-aware UI helpers (VER-47).
//
// Verbilo is a multi-tenant intranet for UK multi-site healthcare operators
// — dental groups, GP federations, vet groups, optical chains, physiotherapy
// networks. The brand chrome (icon, tenant-type label, staff-role labels)
// adapts to the active tenant's `sector` so a vets tenant doesn't see a
// tooth in their sidebar.
//
// The canonical sector set lives on the backend: `dental`, `gp`, `vets`,
// `physio`, `optometry`, `other`, `healthcare`. The last is a sector-agnostic
// fallback; everything in here treats it as "show generic glyph + label".

export const SECTORS = Object.freeze([
  "dental",
  "gp",
  "vets",
  "physio",
  "optometry",
  "other",
  "healthcare",
]);

/**
 * Labelled sector options for form `<select>` controls in the admin portal.
 * Order is the operator-facing order shown to admins picking a sector when
 * creating/editing a tenant — `healthcare` (the sector-agnostic fallback)
 * sits last because it should rarely be the deliberate choice. The `id`
 * matches the backend `Tenant.sector` enum value exactly; keep this list and
 * the backend `@IsIn(...)` in `CreateTenantDto` in sync.
 */
export const SECTOR_OPTIONS = Object.freeze([
  { id: "dental",     label: "Dental" },
  { id: "optometry",  label: "Optometry / Opticians" },
  { id: "vets",       label: "Veterinary" },
  { id: "physio",     label: "Physiotherapy" },
  { id: "gp",         label: "GP / primary care" },
  { id: "other",      label: "Other" },
  { id: "healthcare", label: "Healthcare (sector-agnostic)" },
]);

/**
 * Brand glyph for the tenant sidebar / login / set-password screens.
 * Falls back to `heart` (generic medical) when sector is unknown or absent.
 */
export function sectorIcon(sector) {
  switch (sector) {
    case "dental":    return "tooth";
    case "gp":        return "shield";
    case "vets":      return "heart";
    case "physio":    return "zap";
    case "optometry": return "eye";
    case "other":
    case "healthcare":
    default:          return "heart";
  }
}

/**
 * Human-readable sector label for the sidebar subtitle, dashboard tagline, etc.
 */
export function sectorLabel(sector) {
  switch (sector) {
    case "dental":    return "Dental Practice";
    case "gp":        return "GP Practice";
    case "vets":      return "Veterinary Practice";
    case "physio":    return "Physiotherapy Practice";
    case "optometry": return "Optometry Practice";
    case "other":     return "Healthcare Practice";
    case "healthcare":
    default:          return "Healthcare Operator";
  }
}

// Sector-specific labels for the generic StaffRole enum.
// Backend stores generic roles (admin / manager / clinician / clinical_support
// / reception / admin_support); the UI renders them with the appropriate
// sector vocabulary. `clinicalSpecialty` on the StaffMember row overrides
// the default clinician/clinical_support label when set.
const ROLE_LABELS = {
  dental: {
    admin:            "Administrator",
    manager:          "Practice Manager",
    clinician:        "Dentist",
    clinical_support: "Dental Nurse",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
  gp: {
    admin:            "Practice Administrator",
    manager:          "Practice Manager",
    clinician:        "GP",
    clinical_support: "Practice Nurse",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
  vets: {
    admin:            "Practice Administrator",
    manager:          "Practice Manager",
    clinician:        "Veterinarian",
    clinical_support: "Veterinary Nurse",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
  physio: {
    admin:            "Practice Administrator",
    manager:          "Practice Manager",
    clinician:        "Physiotherapist",
    clinical_support: "Physiotherapy Assistant",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
  optometry: {
    admin:            "Practice Administrator",
    manager:          "Practice Manager",
    clinician:        "Optometrist",
    clinical_support: "Optical Assistant",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
  // Generic fallback used for `other` and `healthcare` sectors.
  generic: {
    admin:            "Administrator",
    manager:          "Practice Manager",
    clinician:        "Clinician",
    clinical_support: "Clinical Support",
    reception:        "Receptionist",
    admin_support:    "Admin Support",
  },
};

/**
 * Render a StaffRole for the given sector. If a per-row `clinicalSpecialty`
 * is provided (free-text override from the backend) it wins over the
 * sector-default label.
 */
export function roleLabel(role, sector, clinicalSpecialty) {
  if (clinicalSpecialty) return clinicalSpecialty;
  const table = ROLE_LABELS[sector] ?? ROLE_LABELS.generic;
  return table[role] ?? role ?? "";
}

// VER-60: sector-aware labels for the User-row role enum (not to be
// confused with `ROLE_LABELS` above which is for the StaffMember enum).
// The User.role values are platform-level admin / org-level admin /
// org-level manager etc., not clinical job titles. Customer-side roles
// adapt to the tenant's sector vocabulary; platform roles
// (`verbilo_super_admin`, `verbilo_support`) are sector-agnostic.
const USER_ROLE_LABELS = {
  dental: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Area Manager",
    practice_manager:    "Practice Manager",
    employee:            "Employee",
  },
  gp: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Area Manager",
    practice_manager:    "Practice Manager",
    employee:            "Employee",
  },
  vets: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Regional Manager",
    practice_manager:    "Practice Manager",
    employee:            "Employee",
  },
  physio: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Area Manager",
    practice_manager:    "Practice Manager",
    employee:            "Employee",
  },
  optometry: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Area Manager",
    practice_manager:    "Branch Manager",
    employee:            "Employee",
  },
  // Generic fallback used for `other` / `healthcare` sectors and any
  // unknown sector string.
  generic: {
    company_owner:       "Company Owner",
    company_admin:       "Company Admin",
    area_manager:        "Area Manager",
    practice_manager:    "Site Manager",
    employee:            "Employee",
  },
};

// Platform admin roles are sector-agnostic — they're Verbilo employees,
// not customer-side staff, so the tenant's sector doesn't apply.
const PLATFORM_USER_ROLE_LABELS = {
  verbilo_super_admin: "Verbilo Admin",
  verbilo_support:     "Verbilo Support",
};

/**
 * Render a User-row role for the given sector. Sector-agnostic for
 * platform roles; sector-aware for customer-side roles (Company Admin,
 * Area Manager, Practice/Branch/Site Manager, Employee).
 *
 * Falls back to the raw role string if the role isn't in any mapping
 * — defensive against legacy / hand-edited data.
 */
export function userRoleLabel(role, sector) {
  if (!role) return "";
  if (role in PLATFORM_USER_ROLE_LABELS) {
    return PLATFORM_USER_ROLE_LABELS[role];
  }
  const table = USER_ROLE_LABELS[sector] ?? USER_ROLE_LABELS.generic;
  return table[role] ?? role;
}
