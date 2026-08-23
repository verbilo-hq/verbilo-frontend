/**
 * Governance pack users — now sourced from the SHARED ROSTER.
 *
 * Historically this file invented ~30 Dental Group staff (Dr Sarah Johnson,
 * Sophie Patel, Rebecca Lewis…) on a separate Brighton/Hove/Worthing/Crawley/
 * Guildford/Portsmouth site set. The app now has one people/scope layer:
 *   • services/people.js  — the canonical roster (Staff Directory + clinical
 *     expansion). Every displayName below resolves to a REAL roster person.
 *   • services/sites.js   — canonical sites + resolveSiteId(), which folds the
 *     old governance site ids onto the canonical six (brighton→southall,
 *     hove→reading, worthing→new-cross, crawley→london, guildford→manchester,
 *     portsmouth→birmingham).
 *
 * What is PRESERVED (the governance store + users.service.js depend on it):
 *   • every user `id` (referenced by index.js / radiography.js /
 *     medical-emergencies.js / documents.js / equipment.js — DO NOT rename)
 *   • the record shape: { id, role, secondaryRoles?, displayName, username,
 *     email, siteId, jobTitle? }
 *   • the governance `role` (UserRole.*) + secondaryRoles — these drive the
 *     per-site lead / RPS / IRMER / operator-entitlement wiring unchanged.
 *
 * What CHANGED — only VALUES:
 *   • `displayName` → a real roster person (via personName(rosterId))
 *   • `siteId`      → canonical site id (via resolveSiteId(legacyId))
 *
 * Roster reality: only Southall (practice-harley) and London (practice-camden)
 * carry a full roster. The canonical sites the other governance sites fold onto
 * (reading / new-cross / manchester / birmingham) have no bound roster people,
 * so per-site leads there are mapped to real roster people picked deterministic-
 * ally from the group/area pool. Names may therefore recur across sites — that
 * is expected for the demo dataset and keeps every name real (no inventions).
 *
 * Auth note: the cognito dev login user is added separately in seed/index.js
 * with role group_admin (overridable via `localStorage.verbilo.demo.role`).
 */

import { UserRole } from "../types";
import { personName, personAtSiteByRole, peopleAtSite } from "../../people";
import { resolveSiteId } from "../../sites";

/* ── Roster name resolver ──────────────────────────────────────────────────
 * Resolve a roster person's displayName by id, with a graceful fallback so a
 * future roster edit can never blank a governance name. */
const nm = (rosterId, fallback = "—") => personName(rosterId) || fallback;

/* Pick a real roster person AT a canonical site by org role, falling back to a
 * named roster id when that site has no roster people bound (reading /
 * new-cross / manchester / birmingham). Returns a displayName string. */
const siteLeadName = (legacySiteId, orgRoles, fallbackRosterId) => {
  const sid = resolveSiteId(legacySiteId);
  const p = personAtSiteByRole(sid, orgRoles);
  if (p?.displayName) return p.displayName;
  const any = peopleAtSite(sid)[0];
  return any?.displayName || nm(fallbackRosterId);
};

/* Canonical site ids for the six legacy governance sites. resolveSiteId is the
 * single source of truth for the fold; we evaluate once here for readability. */
const SITE = {
  brighton:   resolveSiteId("site-brighton"),   // → site-southall
  hove:       resolveSiteId("site-hove"),        // → site-reading
  worthing:   resolveSiteId("site-worthing"),    // → site-new-cross
  crawley:    resolveSiteId("site-crawley"),      // → site-london
  guildford:  resolveSiteId("site-guildford"),    // → site-manchester
  portsmouth: resolveSiteId("site-portsmouth"),   // → site-birmingham
};

export const DEMO_USERS = [
  // ── Group-level roles ──────────────────────────────────────────────────────
  // Clinical Director → the group's clinical lead figure (company owner is the
  // most senior real person; Southall clinical lead doubles for clinical sign-off
  // surfaces). We use the company owner as the named Clinical Director.
  { id: "user-cd",         role: UserRole.clinical_director,    displayName: nm("clinical-lead"),  username: "sarah.johnson",  email: "sarah.johnson@dentalgroup.example",  siteId: null },
  // Group IPC Lead AND Group IRMER Lead (per spec) — the Southall Lead Nurse owns
  // sterilisation/IPC compliance in the roster, so she's the natural fit.
  { id: "user-ipc-group",  role: UserRole.ipc_lead,             displayName: nm("lead-nurse"),      username: "emma.williams",  email: "emma.williams@dentalgroup.example",  siteId: null,
    secondaryRoles: [UserRole.irmer_lead] },
  { id: "user-decon-group",role: UserRole.decontamination_lead, displayName: nm("london-lead-nurse"), username: "sophie.patel",   email: "sophie.patel@dentalgroup.example",   siteId: null },
  { id: "user-gov",        role: UserRole.governance_lead,      displayName: nm("right-hand"),      username: "mark.davies",    email: "mark.davies@dentalgroup.example",    siteId: null },
  { id: "user-auditor",    role: UserRole.auditor,              displayName: nm("managers-manager"), username: "leo.vance",      email: "leo.vance@dentalgroup.example",      siteId: null, jobTitle: "External Auditor" },

  // ── Practice Managers (also serve as the site RPS where assigned) ──────────
  // Per spec: Brighton/Hove/Worthing/Crawley RPSs are the PMs; Guildford RPS is
  // deliberately unassigned (configuration gap demo); Portsmouth is onboarding.
  { id: "user-pm-brighton",  role: UserRole.practice_manager, displayName: siteLeadName("site-brighton",  [UserRole.practice_manager, "practiceManager"], "manager"),                  username: "priya.shah",     email: "priya.shah@dentalgroup.example",    siteId: SITE.brighton,
    secondaryRoles: [UserRole.radiation_protection_supervisor] },
  { id: "user-pm-hove",      role: UserRole.practice_manager, displayName: siteLeadName("site-hove",      [UserRole.practice_manager, "practiceManager"], "managers-manager"),         username: "amir.khan",      email: "amir.khan@dentalgroup.example",     siteId: SITE.hove,
    secondaryRoles: [UserRole.radiation_protection_supervisor] },
  { id: "user-pm-worthing",  role: UserRole.practice_manager, displayName: siteLeadName("site-worthing",  [UserRole.practice_manager, "practiceManager"], "area-manager-1"),           username: "laura.bennett",  email: "laura.bennett@dentalgroup.example", siteId: SITE.worthing,
    secondaryRoles: [UserRole.radiation_protection_supervisor] },
  { id: "user-pm-crawley",   role: UserRole.practice_manager, displayName: siteLeadName("site-crawley",   [UserRole.practice_manager, "practiceManager"], "practice-manager-area-2"),  username: "tom.evans",      email: "tom.evans@dentalgroup.example",     siteId: SITE.crawley,
    secondaryRoles: [UserRole.radiation_protection_supervisor] },
  // Guildford PM is recorded; RPS deliberately not assigned to show config gap.
  { id: "user-pm-guildford", role: UserRole.practice_manager, displayName: siteLeadName("site-guildford", [UserRole.practice_manager, "practiceManager"], "area-manager-2"),           username: "rebecca.lewis",  email: "rebecca.lewis@dentalgroup.example", siteId: SITE.guildford },

  // ── Site Decontamination + IPC Leads (decon pack) ──────────────────────────
  { id: "user-decon-brighton", role: UserRole.decontamination_lead, displayName: nm("lead-nurse"),        username: "jamie.osei",    email: "jamie.osei@dentalgroup.example",    siteId: SITE.brighton  },
  { id: "user-decon-hove",     role: UserRole.decontamination_lead, displayName: nm("south-nurse-2"),     username: "hannah.liu",    email: "hannah.liu@dentalgroup.example",    siteId: SITE.hove      },
  { id: "user-decon-worthing", role: UserRole.decontamination_lead, displayName: nm("london-nurse-1"),    username: "yusuf.aziz",    email: "yusuf.aziz@dentalgroup.example",    siteId: SITE.worthing  },
  { id: "user-decon-crawley",  role: UserRole.decontamination_lead, displayName: nm("london-lead-nurse"), username: "naomi.brookes", email: "naomi.brookes@dentalgroup.example", siteId: SITE.crawley   },

  { id: "user-ipc-brighton",   role: UserRole.ipc_lead, displayName: nm("south-hyg-1"),   username: "olivia.hart",     email: "olivia.hart@dentalgroup.example",     siteId: SITE.brighton },
  { id: "user-ipc-hove",       role: UserRole.ipc_lead, displayName: nm("south-hyg-2"),   username: "daniel.park",     email: "daniel.park@dentalgroup.example",     siteId: SITE.hove     },
  { id: "user-ipc-worthing",   role: UserRole.ipc_lead, displayName: nm("london-hyg-1"),  username: "maya.khalid",     email: "maya.khalid@dentalgroup.example",     siteId: SITE.worthing },
  { id: "user-ipc-crawley",    role: UserRole.ipc_lead, displayName: nm("london-nurse-2"), username: "connor.wright",   email: "connor.wright@dentalgroup.example",   siteId: SITE.crawley  },

  // ── Site Leads (additional) ────────────────────────────────────────────────
  { id: "user-sl-brighton", role: UserRole.site_lead, displayName: nm("deputy-practice-manager"), username: "alex.carter",    email: "alex.carter@dentalgroup.example",    siteId: SITE.brighton },
  { id: "user-sl-worthing", role: UserRole.site_lead, displayName: nm("london-tco-1"),            username: "charlotte.pope", email: "charlotte.pope@dentalgroup.example", siteId: SITE.worthing },

  // ── Clinicians + nurses across sites (also act as IRMER duty-holders via
  // secondaryRoles where appropriate) ────────────────────────────────────────
  // Brighton → Southall (real clinical roster bound to this site)
  { id: "user-bn-1",  role: UserRole.staff, displayName: nm("clinical-lead"),     username: "alex.chen",    email: "alex.chen@dentalgroup.example",    siteId: SITE.brighton, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-bn-2",  role: UserRole.staff, displayName: nm("associate-dentist"), username: "maya.patel",   email: "maya.patel@dentalgroup.example",   siteId: SITE.brighton, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-bn-3",  role: UserRole.staff, displayName: nm("dental-nurse"),      username: "amy.clarke",   email: "amy.clarke@dentalgroup.example",   siteId: SITE.brighton, jobTitle: "Dental Nurse",
    secondaryRoles: [UserRole.operator] },
  { id: "user-bn-4",  role: UserRole.staff, displayName: nm("south-hyg-1"),       username: "james.hart",   email: "james.hart@dentalgroup.example",   siteId: SITE.brighton, jobTitle: "Hygienist" },
  { id: "user-bn-5",  role: UserRole.staff, displayName: nm("receptionist"),      username: "sophie.brown", email: "sophie.brown@dentalgroup.example", siteId: SITE.brighton, jobTitle: "Receptionist" },
  { id: "user-bn-6",  role: UserRole.staff, displayName: nm("south-nurse-2"),     username: "riya.mistry",  email: "riya.mistry@dentalgroup.example",  siteId: SITE.brighton, jobTitle: "Trainee Dental Nurse",
    secondaryRoles: [UserRole.operator] },

  // Hove → Reading (no bound roster — map to real people from the group pool)
  { id: "user-hv-1",  role: UserRole.staff, displayName: nm("south-dentist-2"),   username: "leo.dentist",   email: "leo.dentist@dentalgroup.example",   siteId: SITE.hove, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-hv-2",  role: UserRole.staff, displayName: nm("south-fd-1"),        username: "jessica.wu",    email: "jessica.wu@dentalgroup.example",    siteId: SITE.hove, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-hv-3",  role: UserRole.staff, displayName: nm("south-nurse-2"),     username: "tom.edwards",   email: "tom.edwards@dentalgroup.example",   siteId: SITE.hove, jobTitle: "Dental Nurse",
    secondaryRoles: [UserRole.operator] },
  { id: "user-hv-4",  role: UserRole.staff, displayName: nm("south-hyg-2"),       username: "niamh.oconnor", email: "niamh.oconnor@dentalgroup.example", siteId: SITE.hove, jobTitle: "Trainee Dental Nurse" },
  { id: "user-hv-5",  role: UserRole.staff, displayName: nm("treatment-coordinator"), username: "karen.wright",  email: "karen.wright@dentalgroup.example",  siteId: SITE.hove, jobTitle: "Receptionist" },

  // Worthing → New Cross (the imaging hub — most IRMER duty-holders)
  { id: "user-wo-1",  role: UserRole.staff, displayName: nm("london-dentist-1"),  username: "hassan.ahmed",   email: "hassan.ahmed@dentalgroup.example",   siteId: SITE.worthing, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-wo-2",  role: UserRole.staff, displayName: nm("london-nurse-1"),    username: "liam.park",      email: "liam.park@dentalgroup.example",      siteId: SITE.worthing, jobTitle: "Dental Nurse",
    secondaryRoles: [UserRole.operator] },
  { id: "user-wo-3",  role: UserRole.staff, displayName: nm("london-hyg-1"),      username: "grace.holloway", email: "grace.holloway@dentalgroup.example", siteId: SITE.worthing, jobTitle: "Hygienist" },
  { id: "user-wo-4",  role: UserRole.staff, displayName: nm("london-reception-1"), username: "ben.whitfield",  email: "ben.whitfield@dentalgroup.example",  siteId: SITE.worthing, jobTitle: "Receptionist" },

  // Crawley → London (real clinical roster bound to this site)
  { id: "user-cr-1",  role: UserRole.staff, displayName: nm("london-dentist-2"),  username: "aisha.bashir",  email: "aisha.bashir@dentalgroup.example",  siteId: SITE.crawley, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-cr-2",  role: UserRole.staff, displayName: nm("london-nurse-2"),    username: "eve.mason",     email: "eve.mason@dentalgroup.example",     siteId: SITE.crawley, jobTitle: "Dental Nurse",
    secondaryRoles: [UserRole.operator] },
  { id: "user-cr-3",  role: UserRole.staff, displayName: nm("london-fd-1"),       username: "harvey.long",   email: "harvey.long@dentalgroup.example",   siteId: SITE.crawley, jobTitle: "Trainee Dental Nurse" },

  // Guildford → Manchester (partially configured; no bound roster)
  { id: "user-gu-1",  role: UserRole.staff, displayName: nm("london-dentist-1"),  username: "mia.townsend",  email: "mia.townsend@dentalgroup.example",  siteId: SITE.guildford, jobTitle: "Dentist",
    secondaryRoles: [UserRole.referrer, UserRole.practitioner] },
  { id: "user-gu-2",  role: UserRole.staff, displayName: nm("london-nurse-1"),    username: "faye.singh",    email: "faye.singh@dentalgroup.example",    siteId: SITE.guildford, jobTitle: "Dental Nurse",
    secondaryRoles: [UserRole.operator] },

  // ── Additional IRMER-specific duty-holders (kept after the rewrite) ────────
  // Worthing extras — practitioners + operators for the OPG / CBCT suite
  { id: "user-prac-worthing-2", role: UserRole.practitioner, displayName: nm("london-hyg-2"), username: "sienna.owens", email: "sienna.owens@dentalgroup.example", siteId: SITE.worthing, jobTitle: "Practitioner (IRMER) — CBCT reporting" },
  { id: "user-op-worthing-2",   role: UserRole.operator,     displayName: nm("london-nurse-2"), username: "ravi.chand",   email: "ravi.chand@dentalgroup.example",   siteId: SITE.worthing, jobTitle: "Operator (IRMER) — OPG/CBCT" },
];

/* The cognito dev login user is added separately in seed/index.js so it stays
 * as group_admin (the role override is handled in GovernanceShell). */
