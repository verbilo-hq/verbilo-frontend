/**
 * Dashboard persona resolver.
 *
 * The dashboard has 9 personas (Dentist, FD, Hygienist, Nurse, TN,
 * Receptionist, PM, AM, CD) which is finer-grained than the 5-role
 * devRole switcher. Production will resolve persona from a JWT claim
 * (`custom:dental_persona`) — until then, the dashboard ships its
 * own "viewing as" override:
 *
 *   1. If localStorage has `verbilo.dashboardPersona`, use it.
 *   2. Otherwise fall back to the devRole default below.
 *   3. Otherwise default to `dentist` (most representative clinician).
 *
 * The PersonaSwitcher chip in the dashboard header writes to this
 * localStorage key — invisible plumbing for the demo, swappable for
 * the JWT claim later.
 */

import { useEffect, useState } from "react";
import { useDevRole } from "../devRole";
import { useAuth } from "../../auth/AuthContext";
import { allPeople, clinicalStaffAtSite, personAtSiteByRole } from "../people";
import { siteName } from "../sites";

/* ─── Real-roster resolution ─────────────────────────────────────────
 * Each of the 9 dashboard personas is no longer an invented name +
 * "Brighton"/"Hove" — it resolves to a REAL roster person (the single
 * source of truth in services/people.js) chosen by capability role,
 * with a canonical `site` from services/sites.js.
 *
 * Resolution happens once at module load. The persona OBJECT SHAPE is
 * unchanged (id, label, stage, displayName, firstName, titleSuffix,
 * site) so every consumer — the welcome banner, PersonaSwitcher chip,
 * MyShiftsWidget (`persona.displayName`) — keeps working untouched.
 *
 * Clinician personas (dentist…receptionist) deliberately resolve to
 * Southall (practice-harley) people so MyShiftsWidget — which matches
 * `displayName` against the Southall rota roster — shows real shifts
 * rather than an empty state. */
const SITE_SOUTHALL = "site-southall";

const firstNameOf = (displayName) =>
  String(displayName ?? "")
    .replace(/^(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Miss)\s+/i, "") // drop honorific
    .trim()
    .split(/\s+/)[0] || "there";

/* First clinical person at Southall for a rota "kind" (Dentist | FD |
 * Hygienist | Nurse | Reception), with a safe fallback to anyone at the
 * site so a lightly-staffed kind never yields `undefined`. */
const southallClinician = (kind) =>
  clinicalStaffAtSite(SITE_SOUTHALL, kind)[0] ??
  clinicalStaffAtSite(SITE_SOUTHALL)[0] ??
  null;

/* First person in the whole roster matching any of the given org roles
 * — for org-wide / unbound people (e.g. the company owner) who aren't
 * tied to a single site. */
const personByRole = (roles) => {
  const wanted = Array.isArray(roles) ? roles : [roles];
  return allPeople().find((p) => wanted.includes(p.role)) ?? null;
};

/* Build one persona row: keep the fixed id/label/stage/titleSuffix the
 * UI reads, but fill displayName/firstName/site from the resolved real
 * person. Falls back gracefully to the previous static text if the
 * roster somehow can't satisfy a role. */
const makePersona = ({ id, label, stage, titleSuffix, person, siteId, site }) => {
  const displayName = person?.displayName ?? "—";
  const resolvedSiteId = siteId ?? person?.siteId ?? null;
  return {
    id,
    label,
    stage,
    titleSuffix,
    displayName,
    firstName: firstNameOf(displayName),
    /* Explicit `site` label wins (e.g. an area-scoped manager shows
     * their AREA, not a single site); else derive from the resolved
     * site id; else fall back to a group-wide label. */
    site: site ?? (resolvedSiteId ? siteName(resolvedSiteId) : "Group-wide"),
  };
};

/* Persona shape (id, label, stage, displayName, firstName, titleSuffix,
 * site) — names + sites now come from the real roster. Switching persona
 * still feels like switching login, but every name is a real colleague. */
export const DASHBOARD_PERSONAS = [
  makePersona({ id: "dentist",            label: "Dentist",               stage: "Qualified Clinician",
    titleSuffix: "Dentist",            person: personAtSiteByRole(SITE_SOUTHALL, "associateDentist") ?? southallClinician("Dentist"), siteId: SITE_SOUTHALL }),
  makePersona({ id: "foundation_dentist", label: "Foundation Dentist",    stage: "Trainee",
    titleSuffix: "Foundation Dentist", person: southallClinician("FD"),         siteId: SITE_SOUTHALL }),
  makePersona({ id: "hygienist",          label: "Hygienist / Therapist", stage: "Qualified DCP",
    titleSuffix: "Hygienist",          person: southallClinician("Hygienist"),  siteId: SITE_SOUTHALL }),
  makePersona({ id: "nurse",              label: "Dental Nurse",          stage: "Qualified DCP",
    titleSuffix: "Lead Nurse",         person: personAtSiteByRole(SITE_SOUTHALL, "leadNurse") ?? southallClinician("Nurse"), siteId: SITE_SOUTHALL }),
  makePersona({ id: "trainee_nurse",      label: "Trainee Nurse",         stage: "Trainee",
    titleSuffix: "Dental Nurse",       person: personAtSiteByRole(SITE_SOUTHALL, "dentalNurse") ?? southallClinician("Nurse"), siteId: SITE_SOUTHALL }),
  makePersona({ id: "receptionist",       label: "Receptionist",          stage: "Front Desk",
    titleSuffix: "Reception",          person: southallClinician("Reception"),  siteId: SITE_SOUTHALL }),
  makePersona({ id: "practice_manager",   label: "Practice Manager",      stage: "Operations",
    titleSuffix: "Practice Manager",   person: personAtSiteByRole(SITE_SOUTHALL, "practiceManager"), siteId: SITE_SOUTHALL }),
  makePersona({ id: "area_manager",       label: "Area Manager",          stage: "Multi-Site",
    titleSuffix: "Area Manager — Area 1", person: personByRole("areaManager"), site: "Area 1" }),
  makePersona({ id: "clinical_director",  label: "Clinical Director",     stage: "Governance",
    titleSuffix: "Clinical Director",  person: personAtSiteByRole(SITE_SOUTHALL, ["clinicalLead"]) ?? personByRole("clinicalLead"), siteId: SITE_SOUTHALL }),
];

export const PERSONA_BY_ID = Object.fromEntries(
  DASHBOARD_PERSONAS.map((p) => [p.id, p]),
);

/* Default persona from the LOGGED-IN user's granular org role — a dental
 * nurse gets the nurse lens, a receptionist the front-desk lens, so the
 * preview matches who they actually are. Executive roles have no natural
 * clinical lens and fall through to the capability-role default below. */
const ORG_ROLE_TO_PERSONA = {
  associateDentist:           "dentist",
  foundationDentist:          "foundation_dentist",
  clinicalLead:               "clinical_director",
  leadNurse:                  "nurse",
  dentalNurse:                "nurse",
  traineeDentalNurse:         "trainee_nurse",
  receptionist:               "receptionist",
  traineeReceptionist:        "receptionist",
  frontOfHouseLead:           "receptionist",
  treatmentCoordinator:       "receptionist",
  juniorTreatmentCoordinator: "receptionist",
  employee:                   "receptionist",
  supportAssistant:           "receptionist",
  practiceManager:            "practice_manager",
  deputyPracticeManager:      "practice_manager",
  areaManager:                "area_manager",
};

/* Default dashboard persona per devRole — pre-fills the dropdown to
 * something sensible when no override is set. group_admin defaults
 * to `practice_manager` because admins are usually wearing the ops
 * hat when they look at this page. */
const DEFAULT_BY_DEV_ROLE = {
  group_admin:       "practice_manager",
  clinical_director: "clinical_director",
  governance_lead:   "practice_manager",
  practice_manager:  "practice_manager",
  staff:             "dentist",
};

const KEY = "verbilo.dashboardPersona";

const subs = new Set();
function readStored() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function writeStored(personaId) {
  try {
    if (personaId == null) localStorage.removeItem(KEY);
    else                   localStorage.setItem(KEY, personaId);
  } catch { /* noop */ }
  subs.forEach((fn) => fn(personaId));
}

export function useDashboardPersona() {
  const [devRole] = useDevRole();
  const { user } = useAuth();
  const [override, setOverrideLocal] = useState(readStored);

  useEffect(() => {
    const fn = (next) => setOverrideLocal(next);
    subs.add(fn);
    return () => { subs.delete(fn); };
  }, []);

  const setPersona = (personaId) => {
    setOverrideLocal(personaId);
    writeStored(personaId);
  };
  const clearOverride = () => setPersona(null);

  // Resolution order: explicit override → the signed-in user's own org role
  // → the capability-role default → dentist.
  const personaId =
    override ??
    ORG_ROLE_TO_PERSONA[user?.orgRole] ??
    DEFAULT_BY_DEV_ROLE[devRole] ??
    "dentist";
  const persona   = PERSONA_BY_ID[personaId] ?? PERSONA_BY_ID.dentist;

  return [personaId, setPersona, { persona, isOverridden: !!override, clearOverride }];
}
