/**
 * Dev role switcher.
 *
 * Until Cognito is wired with real `cognito:groups` / `custom:role` claims,
 * the front-end has no source of truth for the current user's role — the
 * mock-cognito JWKS issues tokens without one. To design role-aware UX
 * properly today, this hook gives the dev a manual "viewing as" override
 * that:
 *   - persists across reloads (localStorage)
 *   - feeds every role-gated UI gate (`hasCap(role, capability)`)
 *   - is exposed via a small switcher chip in the sidebar
 *
 * When real auth lands, swap the initial state for the JWT claim and drop
 * the switcher UI — the capability map stays as the single source of truth.
 */

import { useEffect, useState } from "react";

const KEY = "verbilo.devRole";

/* ─── Roles ───────────────────────────────────────────────────────────────── */

export const ROLES = [
  { id: "group_admin",        label: "Group Admin",         description: "Sees everything. Configures org settings, master templates, all packs." },
  { id: "company_management", label: "Company Management",  description: "Group-wide business oversight — cross-practice KPIs, exceptions and exec reporting across every site. No system-config powers." },
  { id: "clinical_director",  label: "Clinical Director",   description: "Approves clinical packs + documents; reads everything else." },
  { id: "governance_lead",    label: "Governance Lead",     description: "Edits governance, manages audits and evidence, reviews documents." },
  { id: "area_manager",       label: "Area Manager",        description: "Oversees a cluster/region of practices — roll-up KPIs and exceptions for their sites; drills into each practice." },
  { id: "practice_manager",   label: "Practice Manager",    description: "Site profile + equipment + staff onboarding at their own site." },
  { id: "staff",              label: "Staff",               description: "Read-only published SOPs and own acknowledgements." },
];

export const ROLE_BY_ID = Object.fromEntries(ROLES.map((r) => [r.id, r]));

/* Canonical page-level access matrix. Capability roles remain the broad
 * authorization profile. Frontline staff are deliberately fail-closed here;
 * the granular organisation-role matrix below adds only the workspaces needed
 * for that person's job. Backend APIs must independently enforce equivalent
 * capability + data-scope boundaries. */
const ALL_CAPABILITY_ROLES = ROLES.map((role) => role.id);
const OPERATIONAL_ROLES = ALL_CAPABILITY_ROLES.filter((role) => role !== "staff");

export const PAGE_ACCESS = Object.freeze({
  dashboard:          ALL_CAPABILITY_ROLES,
  manager:            ["group_admin", "practice_manager"],
  management:         ["group_admin", "company_management", "area_manager"],
  lab:                OPERATIONAL_ROLES,
  marketing:          ALL_CAPABILITY_ROLES,
  clinical:           OPERATIONAL_ROLES,
  governance:         ALL_CAPABILITY_ROLES,
  clinical_protocols: OPERATIONAL_ROLES,
  logbooks:           OPERATIONAL_ROLES,
  audit_evidence:     OPERATIONAL_ROLES,
  cqc:                OPERATIONAL_ROLES,
  staff:              ALL_CAPABILITY_ROLES,
  hr:                 ALL_CAPABILITY_ROLES,
  training:           ALL_CAPABILITY_ROLES,
  supervision_hub:    [
    "group_admin", "company_management", "clinical_director",
    "governance_lead", "area_manager", "practice_manager",
  ],
  cpd:                ALL_CAPABILITY_ROLES,
  admin:              ["group_admin", "governance_lead"],
});

const STAFF_CORE_PAGES = Object.freeze([
  "dashboard", "marketing", "governance", "staff", "hr", "training", "cpd",
]);
const CLINICAL_STAFF_PAGES = Object.freeze([
  ...STAFF_CORE_PAGES, "lab", "clinical", "clinical_protocols", "logbooks",
]);
const FRONT_OF_HOUSE_PAGES = Object.freeze([
  ...STAFF_CORE_PAGES, "lab", "logbooks",
]);
const TREATMENT_COORDINATOR_PAGES = Object.freeze([
  ...STAFF_CORE_PAGES, "lab", "clinical", "logbooks",
]);
const LEAD_NURSE_PAGES = Object.freeze([
  ...CLINICAL_STAFF_PAGES, "audit_evidence", "cqc",
]);

/* Granular frontline visibility. These roles all project to the deliberately
 * low-privilege `staff` capability role, so page visibility can be tailored
 * without granting write/approve/export capabilities. Missing or unknown org
 * roles fall back to PAGE_ACCESS and therefore receive only STAFF_CORE_PAGES. */
export const ORG_ROLE_PAGE_ACCESS = Object.freeze({
  leadNurse: LEAD_NURSE_PAGES,
  dentalNurse: CLINICAL_STAFF_PAGES,
  traineeDentalNurse: CLINICAL_STAFF_PAGES,
  associateDentist: CLINICAL_STAFF_PAGES,
  foundationDentist: CLINICAL_STAFF_PAGES,
  frontOfHouseLead: FRONT_OF_HOUSE_PAGES,
  receptionist: FRONT_OF_HOUSE_PAGES,
  traineeReceptionist: FRONT_OF_HOUSE_PAGES,
  treatmentCoordinator: TREATMENT_COORDINATOR_PAGES,
  juniorTreatmentCoordinator: TREATMENT_COORDINATOR_PAGES,
  employee: STAFF_CORE_PAGES,
  traineeEmployee: STAFF_CORE_PAGES,
  supportAssistant: STAFF_CORE_PAGES,
});

export function canViewPage(role, pageId, orgRole) {
  if (!role || !PAGE_ACCESS[pageId]) return false;
  const orgPages = ORG_ROLE_PAGE_ACCESS[orgRole];
  if (role === "staff" && orgPages) return orgPages.includes(pageId);
  return PAGE_ACCESS[pageId].includes(role);
}

/* ─── Org-role → capability-role bridge ──────────────────────────────────────
 * The HR Hub / Staff Directory identity model (see auth/demoUsers.js) is the
 * canonical org role for a logged-in user (companyOwner, areaManager,
 * practiceManager, leadNurse, …). The rest of the site still gates on the
 * capability roles below (group_admin, company_management, area_manager,
 * practice_manager, clinical_director, governance_lead, staff). This map
 * projects the granular org role onto the capability role so existing RBAC
 * (sidebar gating, Management Hub, hasCap()) keeps working unchanged.
 *
 * In production Cognito proves identity and `/users/me` hydrates the
 * authoritative role/scope assignment from the application database. This map
 * is the local-development projection for fixture identities. */
const ORG_ROLE_TO_CAPABILITY = {
  companyOwner:              "group_admin",        // founder/owner — sees everything
  chiefOfStaff:              "company_management",
  operationsDirector:        "company_management",
  secondInCharge:            "company_management",
  areaManager:               "area_manager",
  practiceManager:           "practice_manager",
  deputyPracticeManager:     "practice_manager",
  clinicalLead:              "clinical_director",
  leadNurse:                 "staff",
  dentalNurse:               "staff",
  traineeDentalNurse:        "staff",
  frontOfHouseLead:          "staff",
  receptionist:              "staff",
  traineeReceptionist:       "staff",
  employee:                  "staff",
  traineeEmployee:           "staff",
  supportAssistant:          "staff",
  associateDentist:          "staff",
  foundationDentist:         "staff",
  treatmentCoordinator:      "staff",
  juniorTreatmentCoordinator:"staff",
};

/** Project a granular HR/org role onto the site's capability role. Falls back
 *  to the org role itself if it's already a capability role (e.g. the seed
 *  `group_admin` dev user), else to `staff`. */
export function capabilityRoleFor(orgRole) {
  if (!orgRole) return DEFAULT_ROLE;
  if (ORG_ROLE_TO_CAPABILITY[orgRole]) return ORG_ROLE_TO_CAPABILITY[orgRole];
  if (CAPS[orgRole]) return orgRole;            // already a capability role
  return "staff";
}

/* ─── Capabilities matrix ────────────────────────────────────────────────── */
/* Every gate in the app keys off one of these. Add a new capability here
 * rather than scattering role checks across components. */
const CAPS = {
  group_admin: {
    sidebar_admin_centre:   true,
    master_template_lib:    true,
    org_settings_edit:      true,
    staff_directory_add:    true,
    staff_directory_edit:   true,
    pack_setup:             true,
    pack_submit_approval:   true,
    pack_approve_live:      true,
    pack_reset_for_demo:    true,
    lab_log_case:           true,
    lab_drawer_actions:     true,
    cpd_view_all_users:     true,
    cpd_export:             true,
    sop_library_read:       true,
    sop_library_manage:     true,
    evidence_upload:        true,
    evidence_review:        true,
    audit_complete:         true,
    view_practice_manager_hub: true,   // superuser — sees both hubs
    view_management_hub:    true,
    view_supervision_hub:   true,
  },
  /* Company Management — group-wide oversight. Reads + exports across all
   * practices and owns the Management Hub, but holds NO system-config powers
   * (that's group_admin's job). Cannot see the single-practice PM Hub in the
   * sidebar — drills into a practice from the Management Hub league table. */
  company_management: {
    sidebar_admin_centre:   false,
    master_template_lib:    false,
    org_settings_edit:      false,
    staff_directory_add:    false,
    staff_directory_edit:   false,
    pack_setup:             false,
    pack_submit_approval:   false,
    pack_approve_live:      false,
    pack_reset_for_demo:    false,
    lab_log_case:           false,
    lab_drawer_actions:     false,
    cpd_view_all_users:     true,
    cpd_export:             true,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        false,
    evidence_review:        true,
    audit_complete:         false,
    view_practice_manager_hub: false,
    view_management_hub:    true,
    view_supervision_hub:   true,
  },
  clinical_director: {
    sidebar_admin_centre:   false,
    master_template_lib:    false,
    org_settings_edit:      false,
    staff_directory_add:    false,
    staff_directory_edit:   false,
    pack_setup:             false,
    pack_submit_approval:   false,
    pack_approve_live:      true,
    pack_reset_for_demo:    false,
    lab_log_case:           true,
    lab_drawer_actions:     true,
    cpd_view_all_users:     true,
    cpd_export:             true,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        true,
    evidence_review:        true,
    audit_complete:         true,
    view_practice_manager_hub: false,
    view_management_hub:    false,
    view_supervision_hub:   true,
  },
  governance_lead: {
    sidebar_admin_centre:   true,  // can edit org settings (not master tpl)
    master_template_lib:    false,
    org_settings_edit:      true,
    staff_directory_add:    false,
    staff_directory_edit:   false,
    pack_setup:             true,
    pack_submit_approval:   true,
    pack_approve_live:      false,
    pack_reset_for_demo:    true,
    lab_log_case:           true,
    lab_drawer_actions:     true,
    cpd_view_all_users:     true,
    cpd_export:             true,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        true,
    evidence_review:        true,
    audit_complete:         true,
    view_practice_manager_hub: false,
    view_management_hub:    false,
    view_supervision_hub:   true,
  },
  /* Area Manager — same oversight surface as Company Management but scoped to
   * their assigned cluster of practices. Owns the Management Hub (regional
   * scope); no single-practice PM Hub in the sidebar (drills in instead). */
  area_manager: {
    sidebar_admin_centre:   false,
    master_template_lib:    false,
    org_settings_edit:      false,
    staff_directory_add:    false,
    staff_directory_edit:   false,
    pack_setup:             false,
    pack_submit_approval:   false,
    pack_approve_live:      false,
    pack_reset_for_demo:    false,
    lab_log_case:           false,
    lab_drawer_actions:     false,
    cpd_view_all_users:     true,
    cpd_export:             false,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        false,
    evidence_review:        true,
    audit_complete:         false,
    view_practice_manager_hub: false,
    view_management_hub:    true,
    view_supervision_hub:   true,
  },
  practice_manager: {
    sidebar_admin_centre:   false,
    master_template_lib:    false,
    org_settings_edit:      false,
    staff_directory_add:    true,
    staff_directory_edit:   true,
    pack_setup:             false,
    pack_submit_approval:   false,
    pack_approve_live:      false,
    pack_reset_for_demo:    false,
    lab_log_case:           true,
    lab_drawer_actions:     true,
    cpd_view_all_users:     false,
    cpd_export:             false,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        true,
    evidence_review:        false,
    audit_complete:         true,
    view_practice_manager_hub: true,
    view_management_hub:    false,
    view_supervision_hub:   true,
  },
  staff: {
    sidebar_admin_centre:   false,
    master_template_lib:    false,
    org_settings_edit:      false,
    staff_directory_add:    false,
    staff_directory_edit:   false,
    pack_setup:             false,
    pack_submit_approval:   false,
    pack_approve_live:      false,
    pack_reset_for_demo:    false,
    lab_log_case:           false,
    lab_drawer_actions:     false,
    cpd_view_all_users:     false,
    cpd_export:             false,
    sop_library_read:       true,
    sop_library_manage:     false,
    evidence_upload:        false,
    evidence_review:        false,
    audit_complete:         false,
    view_practice_manager_hub: false,
    view_management_hub:    false,
    // Trainee portfolios, competency records and supervision notes are
    // sensitive personnel data — general staff don't get the hub at all.
    view_supervision_hub:   false,
  },
};

/** Returns true if the given role has the named capability. */
export function hasCap(role, cap) {
  return !!CAPS[role]?.[cap];
}

/* ─── Hook ────────────────────────────────────────────────────────────────── */

// Preserve the full-access demo experience locally, but fail closed in a
// production build until the authenticated user's role has been applied.
const DEFAULT_ROLE = import.meta.env?.DEV ? "group_admin" : "staff";

/* Module-level subscribers — so the switcher in one place updates every
 * subscriber instantly (without a global state library). */
const subs = new Set();
function readStored() {
  try { return localStorage.getItem(KEY) ?? DEFAULT_ROLE; } catch { return DEFAULT_ROLE; }
}
function writeStored(role) {
  try { localStorage.setItem(KEY, role); } catch { /* noop */ }
  subs.forEach((fn) => fn(role));
}

export function useDevRole() {
  const [role, setRoleLocal] = useState(readStored);
  useEffect(() => {
    const fn = (next) => setRoleLocal(next);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);
  const setRole = (next) => {
    setRoleLocal(next);
    writeStored(next);
  };
  return [role, setRole];
}

/** Convenience — just read the cap without subscribing for re-renders. */
export function useCap(cap) {
  const [role] = useDevRole();
  return hasCap(role, cap);
}

/** Push the capability role derived from a logged-in user's granular org role
 *  into the shared store (updates localStorage + notifies live subscribers).
 *  Called by the auth layer on sign-in so every capability gate reflects the
 *  authenticated user. Stand-in for reading a Cognito group claim. */
export function applyCapabilityRole(orgRole) {
  writeStored(capabilityRoleFor(orgRole));
}
