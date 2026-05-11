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
