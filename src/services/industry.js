/**
 * Healthcare-vertical config for the demo site.
 *
 * Each industry has a brand name + tagline (shown in the sidebar header) and
 * its own nav-item list (id → label/icon). IDs are stable across industries
 * so React state keyed on page id keeps working when switching; only labels,
 * icons and presence change per vertical.
 */

/* Sidebar items carry a `section` so the Sidebar component can group them
 * under static section labels. SECTION_ORDER is the canonical render order;
 * unknown sections (none today) fall through at the end. */
const BASE = (overrides = {}) => ({
  dashboard:  { id: "dashboard",  label: "Dashboard",            icon: "dashboard",   section: "HOME"                   },
  manager:    { id: "manager",    label: "Practice Manager Hub", icon: "layers",      section: "PRACTICE OPERATIONS",    cap: "view_practice_manager_hub" },
  management: { id: "management", label: "Management Hub",       icon: "barchart",    section: "PRACTICE OPERATIONS",    cap: "view_management_hub" },
  lab:        { id: "lab",        label: "Lab Work Hub",         icon: "clipboard",   section: "PRACTICE OPERATIONS"    },
  marketing:  { id: "marketing",  label: "Brand Hub",            icon: "marketing",   section: "PRACTICE OPERATIONS"    },
  clinical:          { id: "clinical",          label: "Clinical Resources", icon: "clinical",    section: "CLINICAL & COMPLIANCE"  },
  governance:        { id: "governance",        label: "Governance & SOPs",  icon: "shield",      section: "CLINICAL & COMPLIANCE"  },
  clinical_protocols:{ id: "clinical_protocols",label: "Clinical Protocols", icon: "file",        section: "CLINICAL & COMPLIANCE"  },
  cqc:               { id: "cqc",               label: "CQC Compliance Hub", icon: "checksquare", section: "CLINICAL & COMPLIANCE"  },
  /* Top-level cross-pack orchestration dashboard for Area / Practice Managers.
   * Distinct from CQC Compliance Hub (which is the inspection-prep workspace);
   * this one aggregates audit schedules + corrective actions across every
   * Live governance pack and serves as the launchpad for evidence-pack
   * exports. */
  audit_evidence:    { id: "audit_evidence",    label: "Audit & Evidence",   icon: "checksquare", section: "CLINICAL & COMPLIANCE"  },
  /* Recurring equipment + environment data entry across daily / weekly /
   * monthly cadence. Renamed from "Daily Logbooks" since templates span
   * multiple frequencies. The route key stays `logbooks` for stability. */
  logbooks:          { id: "logbooks",          label: "Operational Logs",   icon: "clipboard",   section: "CLINICAL & COMPLIANCE"  },
  staff:      { id: "staff",      label: "Staff Directory",      icon: "staff",       section: "PEOPLE & DEVELOPMENT"   },
  hr:         { id: "hr",         label: "HR Hub",               icon: "building",    section: "PEOPLE & DEVELOPMENT"   },
  training:   { id: "training",   label: "Training Hub",         icon: "training",    section: "PEOPLE & DEVELOPMENT"   },
  /* Supervision Hub — separate destination from Training Hub.
   * Training Hub = staff's own learning library + CPD;
   * Supervision Hub = mentor / educational supervisor's view of
   * trainees they oversee (FDs, student nurses). Both stay under
   * People & Development so the distinction is clear from the
   * sidebar grouping. */
  supervision_hub: { id: "supervision_hub", label: "Supervision Hub",      icon: "shield",      section: "PEOPLE & DEVELOPMENT",   cap: "view_supervision_hub" },
  cpd:        { id: "cpd",        label: "CPD Hub",              icon: "award",       section: "PEOPLE & DEVELOPMENT"   },
  admin:      { id: "admin",      label: "Admin Centre",         icon: "settings",    section: "SYSTEM",                 cap: "sidebar_admin_centre" },
  ...overrides,
});

export const SECTION_ORDER = [
  "HOME",
  "PRACTICE OPERATIONS",
  "CLINICAL & COMPLIANCE",
  "PEOPLE & DEVELOPMENT",
  "SYSTEM",
];

const order = (b, ids) => ids.map((id) => b[id]).filter(Boolean);

export const INDUSTRIES = [
  {
    id: "dental",
    label: "Dental",
    brand: "Dental Group",
    tagline: "Clinical Sanctuary",
    icon: "tooth",
    navItems: (() => { const b = BASE(); return order(b, ["dashboard","manager","management","lab","marketing","clinical","governance","clinical_protocols","logbooks","audit_evidence","cqc","staff","hr","training","supervision_hub","cpd","admin"]); })(),
  },
  {
    id: "gp",
    label: "GP",
    brand: "GP Practice",
    tagline: "Family Healthcare",
    icon: "clinical",
    navItems: (() => {
      const b = BASE({
        manager:  { id: "manager",  label: "Practice Manager Hub", icon: "layers", roles: ["manager"] },
        clinical: { id: "clinical", label: "Clinical Guidelines",  icon: "clinical" },
        staff:    { id: "staff",    label: "Team Directory",        icon: "staff" },
        marketing:{ id: "marketing",label: "Patient Comms",         icon: "marketing" },
        cpd:      { id: "cpd",      label: "Appraisal & Revalidation", icon: "award" },
      });
      return order(b, ["dashboard","manager","clinical","staff","marketing","hr","training","cpd","cqc"]);
    })(),
  },
  {
    id: "vet",
    label: "Vet",
    brand: "Vet Group",
    tagline: "Animal Care",
    icon: "heart",
    navItems: (() => {
      const b = BASE({
        manager:  { id: "manager",  label: "Practice Manager Hub", icon: "layers", roles: ["manager"] },
        clinical: { id: "clinical", label: "Clinical Protocols",   icon: "clinical" },
        staff:    { id: "staff",    label: "Team Directory",        icon: "staff" },
        cqc:      { id: "cqc",      label: "RCVS Compliance Hub",   icon: "checksquare" },
        lab:      { id: "lab",      label: "Diagnostics Hub",       icon: "clipboard" },
      });
      return order(b, ["dashboard","manager","clinical","staff","marketing","hr","training","cpd","cqc","lab"]);
    })(),
  },
  {
    id: "optical",
    label: "Optical",
    brand: "Optical Group",
    tagline: "Vision Care",
    icon: "eye",
    navItems: (() => {
      const b = BASE({
        manager:  { id: "manager",  label: "Practice Manager Hub", icon: "layers", roles: ["manager"] },
        cpd:      { id: "cpd",      label: "CET / CPD Hub",         icon: "award" },
        cqc:      { id: "cqc",      label: "GOC Compliance Hub",    icon: "checksquare" },
        lab:      { id: "lab",      label: "Dispensing Hub",        icon: "clipboard" },
      });
      return order(b, ["dashboard","manager","clinical","staff","marketing","hr","training","cpd","cqc","lab"]);
    })(),
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    brand: "Pharmacy Group",
    tagline: "Community Pharmacy",
    icon: "plus",
    navItems: (() => {
      const b = BASE({
        manager:  { id: "manager",  label: "Pharmacy Manager Hub",  icon: "layers", roles: ["manager"] },
        clinical: { id: "clinical", label: "Clinical Services",     icon: "clinical" },
        staff:    { id: "staff",    label: "Team Directory",         icon: "staff" },
        cqc:      { id: "cqc",      label: "GPhC Compliance Hub",    icon: "checksquare" },
        lab:      { id: "lab",      label: "Dispensary Hub",         icon: "clipboard" },
      });
      return order(b, ["dashboard","manager","clinical","staff","marketing","hr","training","cpd","cqc","lab"]);
    })(),
  },
  {
    id: "care",
    label: "Care Home",
    brand: "Care Home Group",
    tagline: "Resident Care",
    icon: "building",
    navItems: (() => {
      const b = BASE({
        manager:  { id: "manager",  label: "Care Manager Hub", icon: "layers", roles: ["manager"] },
        clinical: { id: "clinical", label: "Care Plans",       icon: "clinical" },
      });
      return order(b, ["dashboard","manager","clinical","staff","marketing","hr","training","cpd","cqc"]);
    })(),
  },
];

/**
 * Sectors enabled for THIS deployment.
 *
 * Verbilo is multi-sector by design — the full INDUSTRIES registry above
 * stays intact so tenant provisioning (admin.verbilo.co.uk) can place a
 * tenant on any sector later. The demo build enables dental only: add ids
 * here to bring a sector back, and the dashboard sector switcher reappears
 * automatically once more than one is enabled.
 */
export const ENABLED_INDUSTRY_IDS = ["dental"];

export const enabledIndustries = (() => {
  const list = INDUSTRIES.filter((i) => ENABLED_INDUSTRY_IDS.includes(i.id));
  // Misconfig guard — never boot with zero sectors.
  return list.length > 0 ? list : [INDUSTRIES[0]];
})();

export const INDUSTRY_LS_KEY = "verbilo.industry";

export const getInitialIndustry = () => {
  try {
    const saved = localStorage.getItem(INDUSTRY_LS_KEY);
    // Resolve against ENABLED sectors only — a stale saved id from when
    // more sectors were selectable coerces back to the default.
    return enabledIndustries.find((i) => i.id === saved) ?? enabledIndustries[0];
  } catch {
    return enabledIndustries[0];
  }
};
