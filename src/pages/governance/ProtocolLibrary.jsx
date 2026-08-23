/**
 * Protocol Library — list of all controlled protocols inside the Clinical
 * Governance pack. Rows are grouped by clinical category (Periodontal,
 * Endodontics, future Implants / Whitening etc.) so a Clinical Director
 * scanning the library can scope to a specialty at a glance.
 *
 * Each row is a button into the structured viewer where the protocol can be
 * read, adopted by the Clinical Director on behalf of the group, and
 * acknowledged by clinicians.
 */

import { useState, useMemo } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BackButton, formatDate } from "./Shared";
import { getAdoption, listAcknowledgements } from "../../services/governance/protocolSignatures.service";
import { PERIO_01 } from "../../services/governance/protocols/perio-01";
import { PERIO_02 } from "../../services/governance/protocols/perio-02";
import { PERIO_03 } from "../../services/governance/protocols/perio-03";
import { PERIO_04 } from "../../services/governance/protocols/perio-04";
import { PERIO_05 } from "../../services/governance/protocols/perio-05";
import { PERIO_06 } from "../../services/governance/protocols/perio-06";
import { PERIO_07 } from "../../services/governance/protocols/perio-07";
import { PERIO_08 } from "../../services/governance/protocols/perio-08";
import { PERIO_09 } from "../../services/governance/protocols/perio-09";
import { PERIO_10 } from "../../services/governance/protocols/perio-10";
import { ENDO_01 } from "../../services/governance/protocols/endo-01";
import { ENDO_02 } from "../../services/governance/protocols/endo-02";
import { ENDO_03 } from "../../services/governance/protocols/endo-03";
import { ENDO_04 } from "../../services/governance/protocols/endo-04";
import { ENDO_05 } from "../../services/governance/protocols/endo-05";
import { ENDO_06 } from "../../services/governance/protocols/endo-06";
import { ENDO_07 } from "../../services/governance/protocols/endo-07";
import { ENDO_08 } from "../../services/governance/protocols/endo-08";
import { ENDO_09 } from "../../services/governance/protocols/endo-09";
import { ENDO_10 } from "../../services/governance/protocols/endo-10";
import { IOS_01 } from "../../services/governance/protocols/ios-01";
import { IOS_02 } from "../../services/governance/protocols/ios-02";
import { IOS_03 } from "../../services/governance/protocols/ios-03";
import { IOS_04 } from "../../services/governance/protocols/ios-04";
import { IOS_05 } from "../../services/governance/protocols/ios-05";
import { IOS_06 } from "../../services/governance/protocols/ios-06";
import { IOS_07 } from "../../services/governance/protocols/ios-07";
import { IOS_08 } from "../../services/governance/protocols/ios-08";
import { IOS_09 } from "../../services/governance/protocols/ios-09";
import { IOS_10 } from "../../services/governance/protocols/ios-10";
import { WH_CP_01 } from "../../services/governance/protocols/wh-cp-01";
import { WH_CP_02 } from "../../services/governance/protocols/wh-cp-02";
import { WH_CP_03 } from "../../services/governance/protocols/wh-cp-03";
import { WH_CP_04 } from "../../services/governance/protocols/wh-cp-04";
import { RES_01 } from "../../services/governance/protocols/res-01";
import { RES_02 } from "../../services/governance/protocols/res-02";
import { RES_03 } from "../../services/governance/protocols/res-03";
import { RES_04 } from "../../services/governance/protocols/res-04";
import { RES_05 } from "../../services/governance/protocols/res-05";
import { RES_06 } from "../../services/governance/protocols/res-06";
import { RES_07 } from "../../services/governance/protocols/res-07";
import { RES_08 } from "../../services/governance/protocols/res-08";
import { RES_09 } from "../../services/governance/protocols/res-09";
import { RES_10 } from "../../services/governance/protocols/res-10";
import { PROS_01 } from "../../services/governance/protocols/pros-01";
import { PROS_02 } from "../../services/governance/protocols/pros-02";
import { PROS_03 } from "../../services/governance/protocols/pros-03";
import { PROS_04 } from "../../services/governance/protocols/pros-04";
import { PROS_05 } from "../../services/governance/protocols/pros-05";
import { PROS_06 } from "../../services/governance/protocols/pros-06";
import { PROS_07 } from "../../services/governance/protocols/pros-07";
import { PROS_08 } from "../../services/governance/protocols/pros-08";
import { PROS_09 } from "../../services/governance/protocols/pros-09";
import { PROS_10 } from "../../services/governance/protocols/pros-10";
import { PAED_01 } from "../../services/governance/protocols/paed-01";
import { PAED_02 } from "../../services/governance/protocols/paed-02";
import { PAED_03 } from "../../services/governance/protocols/paed-03";
import { PAED_04 } from "../../services/governance/protocols/paed-04";
import { PAED_05 } from "../../services/governance/protocols/paed-05";
import { PAED_06 } from "../../services/governance/protocols/paed-06";
import { PAED_07 } from "../../services/governance/protocols/paed-07";
import { PAED_08 } from "../../services/governance/protocols/paed-08";
import { PAED_09 } from "../../services/governance/protocols/paed-09";
import { PAED_10 } from "../../services/governance/protocols/paed-10";
import { OMED_01 } from "../../services/governance/protocols/omed-01";
import { OMED_02 } from "../../services/governance/protocols/omed-02";
import { OMED_03 } from "../../services/governance/protocols/omed-03";
import { OMED_04 } from "../../services/governance/protocols/omed-04";
import { OMED_05 } from "../../services/governance/protocols/omed-05";
import { OMED_06 } from "../../services/governance/protocols/omed-06";
import { OMED_07 } from "../../services/governance/protocols/omed-07";
import { OMED_08 } from "../../services/governance/protocols/omed-08";
import { TRAU_01 } from "../../services/governance/protocols/trau-01";
import { TRAU_02 } from "../../services/governance/protocols/trau-02";
import { TRAU_03 } from "../../services/governance/protocols/trau-03";
import { TRAU_04 } from "../../services/governance/protocols/trau-04";
import { TRAU_05 } from "../../services/governance/protocols/trau-05";
import { TRAU_06 } from "../../services/governance/protocols/trau-06";
import { TRAU_07 } from "../../services/governance/protocols/trau-07";
import { TRAU_08 } from "../../services/governance/protocols/trau-08";
import { SED_01 } from "../../services/governance/protocols/sed-01";
import { SED_02 } from "../../services/governance/protocols/sed-02";
import { SED_03 } from "../../services/governance/protocols/sed-03";
import { SED_04 } from "../../services/governance/protocols/sed-04";
import { SED_05 } from "../../services/governance/protocols/sed-05";
import { SED_06 } from "../../services/governance/protocols/sed-06";
import { SCD_01 } from "../../services/governance/protocols/scd-01";
import { SCD_02 } from "../../services/governance/protocols/scd-02";
import { SCD_03 } from "../../services/governance/protocols/scd-03";
import { SCD_04 } from "../../services/governance/protocols/scd-04";
import { SCD_05 } from "../../services/governance/protocols/scd-05";
import { SCD_06 } from "../../services/governance/protocols/scd-06";
import { TMD_01 } from "../../services/governance/protocols/tmd-01";
import { TMD_02 } from "../../services/governance/protocols/tmd-02";
import { TMD_03 } from "../../services/governance/protocols/tmd-03";
import { TMD_04 } from "../../services/governance/protocols/tmd-04";
import { TMD_05 } from "../../services/governance/protocols/tmd-05";
import { TMD_06 } from "../../services/governance/protocols/tmd-06";
import { CORE_01 } from "../../services/governance/protocols/core-01";
import { CORE_02 } from "../../services/governance/protocols/core-02";
import { CORE_03 } from "../../services/governance/protocols/core-03";
import { CORE_04 } from "../../services/governance/protocols/core-04";
import { CORE_05 } from "../../services/governance/protocols/core-05";
import { CORE_06 } from "../../services/governance/protocols/core-06";
import { CORE_07 } from "../../services/governance/protocols/core-07";
import { CORE_08 } from "../../services/governance/protocols/core-08";
import { CORE_09 } from "../../services/governance/protocols/core-09";
import { CORE_10 } from "../../services/governance/protocols/core-10";
import { CORE_11 } from "../../services/governance/protocols/core-11";
import { CORE_12 } from "../../services/governance/protocols/core-12";
import { CORE_13 } from "../../services/governance/protocols/core-13";
import {
  TIER_META, STATUS_META,
  effectiveStatus, getTier, isGovernanceUser,
  filterProtocols, tierCounts,
  protocolApplicabilitySummary,
} from "../../services/governance/protocolMeta";
import styles from "./Governance.module.css";
import { SearchBar } from "../../components/ui/SearchBar";

/* All authored protocols, in the order they appear inside their category.
 * Exported so the Compliance dashboard and other views can iterate the same
 * canonical list without duplicating it. */
export const PROTOCOLS = [
  // Core Clinical Protocols — cross-cutting governance documents shown first
  // on the layered library. See protocols/core-common.js for editorial rationale.
  { reference: CORE_01.reference,  title: CORE_01.title,  data: CORE_01  },
  { reference: CORE_02.reference,  title: CORE_02.title,  data: CORE_02  },
  { reference: CORE_03.reference,  title: CORE_03.title,  data: CORE_03  },
  { reference: CORE_04.reference,  title: CORE_04.title,  data: CORE_04  },
  { reference: CORE_05.reference,  title: CORE_05.title,  data: CORE_05  },
  { reference: CORE_06.reference,  title: CORE_06.title,  data: CORE_06  },
  { reference: CORE_07.reference,  title: CORE_07.title,  data: CORE_07  },
  { reference: CORE_08.reference,  title: CORE_08.title,  data: CORE_08  },
  { reference: CORE_09.reference,  title: CORE_09.title,  data: CORE_09  },
  { reference: CORE_10.reference,  title: CORE_10.title,  data: CORE_10  },
  { reference: CORE_11.reference,  title: CORE_11.title,  data: CORE_11  },
  { reference: CORE_12.reference,  title: CORE_12.title,  data: CORE_12  },
  { reference: CORE_13.reference,  title: CORE_13.title,  data: CORE_13  },

  // Specialty + Advanced/Optional protocols — tier derived by protocolMeta.js.
  { reference: PERIO_01.reference, title: PERIO_01.title, data: PERIO_01 },
  { reference: PERIO_02.reference, title: PERIO_02.title, data: PERIO_02 },
  { reference: PERIO_03.reference, title: PERIO_03.title, data: PERIO_03 },
  { reference: PERIO_04.reference, title: PERIO_04.title, data: PERIO_04 },
  { reference: PERIO_05.reference, title: PERIO_05.title, data: PERIO_05 },
  { reference: PERIO_06.reference, title: PERIO_06.title, data: PERIO_06 },
  { reference: PERIO_07.reference, title: PERIO_07.title, data: PERIO_07 },
  { reference: PERIO_08.reference, title: PERIO_08.title, data: PERIO_08 },
  { reference: PERIO_09.reference, title: PERIO_09.title, data: PERIO_09 },
  { reference: PERIO_10.reference, title: PERIO_10.title, data: PERIO_10 },
  { reference: ENDO_01.reference,  title: ENDO_01.title,  data: ENDO_01  },
  { reference: ENDO_02.reference,  title: ENDO_02.title,  data: ENDO_02  },
  { reference: ENDO_03.reference,  title: ENDO_03.title,  data: ENDO_03  },
  { reference: ENDO_04.reference,  title: ENDO_04.title,  data: ENDO_04  },
  { reference: ENDO_05.reference,  title: ENDO_05.title,  data: ENDO_05  },
  { reference: ENDO_06.reference,  title: ENDO_06.title,  data: ENDO_06  },
  { reference: ENDO_07.reference,  title: ENDO_07.title,  data: ENDO_07  },
  { reference: ENDO_08.reference,  title: ENDO_08.title,  data: ENDO_08  },
  { reference: ENDO_09.reference,  title: ENDO_09.title,  data: ENDO_09  },
  { reference: ENDO_10.reference,  title: ENDO_10.title,  data: ENDO_10  },
  { reference: IOS_01.reference,   title: IOS_01.title,   data: IOS_01   },
  { reference: IOS_02.reference,   title: IOS_02.title,   data: IOS_02   },
  { reference: IOS_03.reference,   title: IOS_03.title,   data: IOS_03   },
  { reference: IOS_04.reference,   title: IOS_04.title,   data: IOS_04   },
  { reference: IOS_05.reference,   title: IOS_05.title,   data: IOS_05   },
  { reference: IOS_06.reference,   title: IOS_06.title,   data: IOS_06   },
  { reference: IOS_07.reference,   title: IOS_07.title,   data: IOS_07   },
  { reference: IOS_08.reference,   title: IOS_08.title,   data: IOS_08   },
  { reference: IOS_09.reference,   title: IOS_09.title,   data: IOS_09   },
  { reference: IOS_10.reference,   title: IOS_10.title,   data: IOS_10   },
  { reference: WH_CP_01.reference, title: WH_CP_01.title, data: WH_CP_01 },
  { reference: WH_CP_02.reference, title: WH_CP_02.title, data: WH_CP_02 },
  { reference: WH_CP_03.reference, title: WH_CP_03.title, data: WH_CP_03 },
  { reference: WH_CP_04.reference, title: WH_CP_04.title, data: WH_CP_04 },
  { reference: RES_01.reference,   title: RES_01.title,   data: RES_01   },
  { reference: RES_02.reference,   title: RES_02.title,   data: RES_02   },
  { reference: RES_03.reference,   title: RES_03.title,   data: RES_03   },
  { reference: RES_04.reference,   title: RES_04.title,   data: RES_04   },
  { reference: RES_05.reference,   title: RES_05.title,   data: RES_05   },
  { reference: RES_06.reference,   title: RES_06.title,   data: RES_06   },
  { reference: RES_07.reference,   title: RES_07.title,   data: RES_07   },
  { reference: RES_08.reference,   title: RES_08.title,   data: RES_08   },
  { reference: RES_09.reference,   title: RES_09.title,   data: RES_09   },
  { reference: RES_10.reference,   title: RES_10.title,   data: RES_10   },
  { reference: PROS_01.reference,  title: PROS_01.title,  data: PROS_01  },
  { reference: PROS_02.reference,  title: PROS_02.title,  data: PROS_02  },
  { reference: PROS_03.reference,  title: PROS_03.title,  data: PROS_03  },
  { reference: PROS_04.reference,  title: PROS_04.title,  data: PROS_04  },
  { reference: PROS_05.reference,  title: PROS_05.title,  data: PROS_05  },
  { reference: PROS_06.reference,  title: PROS_06.title,  data: PROS_06  },
  { reference: PROS_07.reference,  title: PROS_07.title,  data: PROS_07  },
  { reference: PROS_08.reference,  title: PROS_08.title,  data: PROS_08  },
  { reference: PROS_09.reference,  title: PROS_09.title,  data: PROS_09  },
  { reference: PROS_10.reference,  title: PROS_10.title,  data: PROS_10  },
  { reference: PAED_01.reference,  title: PAED_01.title,  data: PAED_01  },
  { reference: PAED_02.reference,  title: PAED_02.title,  data: PAED_02  },
  { reference: PAED_03.reference,  title: PAED_03.title,  data: PAED_03  },
  { reference: PAED_04.reference,  title: PAED_04.title,  data: PAED_04  },
  { reference: PAED_05.reference,  title: PAED_05.title,  data: PAED_05  },
  { reference: PAED_06.reference,  title: PAED_06.title,  data: PAED_06  },
  { reference: PAED_07.reference,  title: PAED_07.title,  data: PAED_07  },
  { reference: PAED_08.reference,  title: PAED_08.title,  data: PAED_08  },
  { reference: PAED_09.reference,  title: PAED_09.title,  data: PAED_09  },
  { reference: PAED_10.reference,  title: PAED_10.title,  data: PAED_10  },
  { reference: OMED_01.reference,  title: OMED_01.title,  data: OMED_01  },
  { reference: OMED_02.reference,  title: OMED_02.title,  data: OMED_02  },
  { reference: OMED_03.reference,  title: OMED_03.title,  data: OMED_03  },
  { reference: OMED_04.reference,  title: OMED_04.title,  data: OMED_04  },
  { reference: OMED_05.reference,  title: OMED_05.title,  data: OMED_05  },
  { reference: OMED_06.reference,  title: OMED_06.title,  data: OMED_06  },
  { reference: OMED_07.reference,  title: OMED_07.title,  data: OMED_07  },
  { reference: OMED_08.reference,  title: OMED_08.title,  data: OMED_08  },
  { reference: TRAU_01.reference,  title: TRAU_01.title,  data: TRAU_01  },
  { reference: TRAU_02.reference,  title: TRAU_02.title,  data: TRAU_02  },
  { reference: TRAU_03.reference,  title: TRAU_03.title,  data: TRAU_03  },
  { reference: TRAU_04.reference,  title: TRAU_04.title,  data: TRAU_04  },
  { reference: TRAU_05.reference,  title: TRAU_05.title,  data: TRAU_05  },
  { reference: TRAU_06.reference,  title: TRAU_06.title,  data: TRAU_06  },
  { reference: TRAU_07.reference,  title: TRAU_07.title,  data: TRAU_07  },
  { reference: TRAU_08.reference,  title: TRAU_08.title,  data: TRAU_08  },
  { reference: SED_01.reference,   title: SED_01.title,   data: SED_01   },
  { reference: SED_02.reference,   title: SED_02.title,   data: SED_02   },
  { reference: SED_03.reference,   title: SED_03.title,   data: SED_03   },
  { reference: SED_04.reference,   title: SED_04.title,   data: SED_04   },
  { reference: SED_05.reference,   title: SED_05.title,   data: SED_05   },
  { reference: SED_06.reference,   title: SED_06.title,   data: SED_06   },
  { reference: SCD_01.reference,   title: SCD_01.title,   data: SCD_01   },
  { reference: SCD_02.reference,   title: SCD_02.title,   data: SCD_02   },
  { reference: SCD_03.reference,   title: SCD_03.title,   data: SCD_03   },
  { reference: SCD_04.reference,   title: SCD_04.title,   data: SCD_04   },
  { reference: SCD_05.reference,   title: SCD_05.title,   data: SCD_05   },
  { reference: SCD_06.reference,   title: SCD_06.title,   data: SCD_06   },
  { reference: TMD_01.reference,   title: TMD_01.title,   data: TMD_01   },
  { reference: TMD_02.reference,   title: TMD_02.title,   data: TMD_02   },
  { reference: TMD_03.reference,   title: TMD_03.title,   data: TMD_03   },
  { reference: TMD_04.reference,   title: TMD_04.title,   data: TMD_04   },
  { reference: TMD_05.reference,   title: TMD_05.title,   data: TMD_05   },
  { reference: TMD_06.reference,   title: TMD_06.title,   data: TMD_06   },
];

/* Category display metadata — color and slug. Color is used everywhere a
 * category surface appears (library tabs, library section accents, viewer
 * category pill, viewer top accent band) so a clinician scanning the UI
 * knows at a glance which specialty they're in. Future categories slot in
 * by appending to this map. */
export const CATEGORY_META = {
  "Core":                     { color: "#0d7280", slug: "core" },
  "Periodontal":              { color: "#16a34a", slug: "periodontal" },
  "Restorative":              { color: "#be123c", slug: "restorative" },
  "Endodontics":              { color: "#b36000", slug: "endodontics" },
  "Prosthodontics":           { color: "#4338ca", slug: "prosthodontics" },
  "Implants & Oral Surgery":  { color: "#0277bd", slug: "implants-oral-surgery" },
  "Whitening & Aesthetics":   { color: "#8e3aa0", slug: "whitening-aesthetics" },
  "Paediatric":               { color: "#2e7d32", slug: "paediatric" },
  "Oral Medicine":            { color: "#7c2d12", slug: "oral-medicine" },
  "Trauma Management":        { color: "#dc2626", slug: "trauma" },
  "Sedation":                 { color: "#1e3a8a", slug: "sedation" },
  "Special Care":             { color: "#db2777", slug: "special-care" },
  "TMD & Occlusion":          { color: "#525b76", slug: "tmd-occlusion" },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? { color: "#6b7280", slug: "other" };
}

const CATEGORY_ORDER = Object.keys(CATEGORY_META);

/* ── Role-centric filtering ──────────────────────────────────────────────
 *
 * Replaces the older Core / Specialty / Optional tier chips with
 * department-flavoured chips that match how Dental Group staff actually
 * mentally bucket their protocols. The mapping is reference + category
 * driven (we don't yet have a `roleAudience` field on the protocol
 * data), with sensible defaults:
 *
 *   • All Protocols     → every visible protocol
 *   • Dentist Pack      → Core + every clinical specialty category
 *   • Nursing Team      → Core only (medical emergencies, IPC,
 *                         prescribing, etc. — the cross-cutting
 *                         chairside protocols)
 *   • Reception & Admin → Selected Core items (records, consent,
 *                         complaints) — overridden per-reference
 *   • Management        → Selected Core items (records, prescribing
 *                         audit, governance) — overridden per-reference
 *
 * Specialty / Sedation / Trauma etc. live only on the Dentist Pack
 * because they describe procedural work owned by a clinician. */

/* Role chips render with low-weight monochrome line icons (from the
 * shared Icon set) instead of emojis — keeps the page consistent
 * with the upper KPI tiles and the wider enterprise aesthetic. */
export const ROLE_OPTIONS = [
  { key: "all",        label: "All Protocols",     icon: "file"      },
  { key: "dentist",    label: "Dentist Pack",      icon: "person"    },
  { key: "nursing",    label: "Nursing Team",      icon: "plus"      },
  { key: "reception",  label: "Reception & Admin", icon: "clipboard" },
  { key: "management", label: "Management",        icon: "building"  },
];

/* Per-reference role overrides. References not listed fall through to
 * the category-default rules in `rolesForProtocol`. Hand-tuned so the
 * cross-cutting protocols (Medical Emergencies, Record Keeping, etc.)
 * surface under every role rather than only the clinical ones. */
const REFERENCE_ROLE_OVERRIDES = {
  "CORE-01": ["dentist", "nursing", "reception", "management"], // Medical Emergencies — chairside response for all
  "CORE-03": ["dentist", "management"],                          // Antimicrobial prescribing + stewardship audit
  "CORE-04": ["dentist", "nursing", "reception", "management"], // Clinical Record Keeping — everyone needs to know
  "CORE-08": ["dentist", "nursing", "reception", "management"], // Consent / chaperoning (typical CORE-08 territory)
  "CORE-11": ["dentist", "nursing", "reception", "management"], // Complaints handling (typical CORE-11 territory)
};

/** Returns the Set of role keys that should see this protocol. */
export function rolesForProtocol(p) {
  const override = REFERENCE_ROLE_OVERRIDES[p?.reference];
  if (override) return new Set(override);
  if (p?.category === "Core") return new Set(["dentist", "nursing", "management"]);
  return new Set(["dentist"]); // every clinical specialty is dentist-owned by default
}

/** Live count per role across the supplied visible protocols. Drives
 *  the badge number on each role chip. */
export function roleCounts(visibleProtocols) {
  const counts = { all: 0, dentist: 0, nursing: 0, reception: 0, management: 0 };
  for (const p of visibleProtocols) {
    counts.all += 1;
    const roles = rolesForProtocol(p);
    for (const r of roles) counts[r] = (counts[r] ?? 0) + 1;
  }
  return counts;
}

/* ── Chapter-based folder structure ──────────────────────────────────────
 *
 * When a role filter is active the library renders as a stack of
 * collapsed accordion sections instead of a flat grid of cards.
 * Each section groups protocols by a coarser "clinical chapter"
 * (broader than the per-category buckets) so the page reads as a
 * structured book rather than 90+ cards scattered across the page.
 *
 * Chapters are deliberately small in number (5) — large enough to
 * keep each accordion bar's count meaningful, small enough to fit
 * the whole table of contents above the fold. */

export const CHAPTERS = [
  { id: "ch1", title: "Medical Emergencies & Urgent Care",    icon: "alert"     },
  { id: "ch2", title: "Diagnostics, Records & Radiography",   icon: "file"      },
  { id: "ch3", title: "Clinical Procedures",                  icon: "clipboard" },
  { id: "ch4", title: "Pharmacology, Sedation & Prescribing", icon: "plus"      },
  { id: "ch5", title: "Clinical Governance & Compliance",     icon: "shield"    },
];

/* Per-reference chapter overrides. The Core protocols straddle
 * several chapters (emergencies, records, prescribing, governance)
 * so the category default isn't enough on its own. */
const REFERENCE_CHAPTER_OVERRIDES = {
  "CORE-01": "ch1",   // Medical Emergencies — Clinical Response
  "CORE-02": "ch1",   // Urgent Dental Care — Pain & Swelling
  "CORE-03": "ch4",   // Antimicrobial & Analgesic Prescribing
  "CORE-04": "ch2",   // Clinical Record Keeping
  "CORE-08": "ch5",   // Typical consent / chaperoning territory
  "CORE-11": "ch5",   // Typical complaints territory
};

/** Returns the chapter id this protocol belongs to. */
export function chapterForProtocol(p) {
  const explicit = REFERENCE_CHAPTER_OVERRIDES[p?.reference];
  if (explicit) return explicit;
  const cat = p?.category;
  if (cat === "Trauma Management") return "ch1";
  if (cat === "Oral Medicine")     return "ch2";
  if (cat === "Sedation")          return "ch4";
  if (cat === "Core")              return "ch5";   // remaining Core → governance
  return "ch3";                                    // every clinical specialty
}

/** Groups protocols into the canonical CHAPTERS ordering. Empty
 *  chapters are dropped so the accordion never renders a "0 Protocols"
 *  expander. */
export function groupByChapter(protocols) {
  const buckets = new Map(CHAPTERS.map((c) => [c.id, []]));
  for (const p of protocols) {
    const ch = chapterForProtocol(p);
    if (buckets.has(ch)) buckets.get(ch).push(p);
  }
  return CHAPTERS
    .map((c, idx) => ({ ...c, index: idx + 1, items: buckets.get(c.id) ?? [] }))
    .filter((c) => c.items.length > 0);
}

function groupByCategory(protocols) {
  const groups = new Map();
  for (const p of protocols) {
    const cat = p.data?.category ?? "Other";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push(p);
  }
  return CATEGORY_ORDER
    .map((cat) => ({ category: cat, items: groups.get(cat) ?? [] }))
    .filter((g) => g.items.length > 0);
}

export function getProtocolByReference(reference) {
  return PROTOCOLS.find((p) => p.reference === reference)?.data ?? null;
}

/** Smooth-scroll to an element by id, accounting for the sticky header
 *  height via the element's `scroll-margin-top` CSS. */
function scrollToSection(id) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── KPI tile (v2) — number + label + optional "● LIVE" pill ─────────── */
const KpiTileV2 = ({ icon, iconColor, iconBg, num, label, showLive }) => (
  <div className={styles.kpiV2}>
    <span className={styles.kpiV2Icon} style={{ background: iconBg }}>
      <I name={icon} size={14} color={iconColor} />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className={styles.kpiV2Num}>{num}</div>
      <div className={styles.kpiV2Lbl}>{label}</div>
    </div>
    {showLive && (
      <span className={styles.kpiV2Live} title="Live count — updates as protocols are added or archived.">
        <span className={styles.kpiV2LiveDot} /> LIVE
      </span>
    )}
  </div>
);

/* ── Protocol card — the layered library's standard item ───────────────── */

/* Categories that render with their category colour as a solid card
 * background ("themed cards"). All other categories render as white cards.
 * Mirrors the mock — Core / generic categories stay neutral, specialties
 * get their colour. Update CATEGORY_META.color elsewhere to retheme.
 */
const THEMED_CARD_CATEGORIES = new Set([
  "Periodontal", "Endodontics", "Endodontic", "Implants & Oral Surgery",
  "Implants", "Prosthodontics", "Paediatric", "Paediatrics",
  "Whitening & Aesthetics", "Whitening", "Oral Medicine", "Restorative",
  "TMD", "Trauma", "Sedation", "Special Care", "Safeguarding",
]);

const ProtocolCard = ({ user, p, onOpenProtocol }) => {
  const ready = !!p.data;
  const status = ready ? effectiveStatus(p.data) : "published";
  const statusMeta = STATUS_META[status] ?? STATUS_META.published;
  const categoryMeta = getCategoryMeta(p.data?.category);
  const adoption = ready
    ? getAdoption(user.tenantId, p.data.id, p.data.version.number)
    : null;
  const ackCount = ready
    ? listAcknowledgements(user.tenantId, p.data.id, p.data.version.number).length
    : 0;
  const v = p.data?.version ?? {};

  // Themed categories get a SOFT category-colour tint (not a loud solid fill)
  // so specialty groups stay distinguishable without shouting. Text + badges
  // keep the normal dark/colour treatment for readability on the light tint.
  const isThemed = ready && THEMED_CARD_CATEGORIES.has(p.data?.category);
  const themedBg = `color-mix(in srgb, ${categoryMeta.color} 10%, var(--surface-lowest))`;

  return (
    <button
      className={styles.pcV2}
      onClick={() => ready && onOpenProtocol(p.reference)}
      disabled={!ready}
      style={
        isThemed
          ? { background: themedBg }
          : ready ? undefined : { opacity: 0.55, cursor: "not-allowed" }
      }
    >
      <div className={styles.pcV2Top}>
        <span
          className={styles.pcV2Ref}
          style={{ background: categoryMeta.color, color: "#fff" }}
        >
          {p.reference}
        </span>
        <span
          className={styles.pcV2StatusPill}
          style={{ color: statusMeta.color, background: `color-mix(in srgb, ${statusMeta.color} 12%, transparent)` }}
        >
          <span
            className={styles.pcV2StatusDot}
            style={{ background: statusMeta.color }}
          />
          {statusMeta.label}
        </span>
      </div>

      <div className={styles.pcV2Title}>{p.title}</div>
      {/* Description prose intentionally suppressed in the grid view —
       * the brief calls for compact cards optimised for vertical
       * scanability. The full subtitle still renders inside the
       * ProtocolViewer when the user opens the card. */}

      {ready && (
        <div className={styles.pcV2Meta}>
          <I name="person" size={10} color="var(--on-surface-variant)" />
          <span title={v.ownerRole ? `${v.ownerName} — ${v.ownerRole}` : v.ownerName}>{v.ownerName}</span>
          <span className={styles.pcV2Dot}>·</span>
          <span>v{v.number}</span>
          {v.nextReviewDate && (
            <>
              <span className={styles.pcV2Dot}>·</span>
              <span>Review {formatDate(v.nextReviewDate)}</span>
            </>
          )}
        </div>
      )}

      {/* Bottom action — pill-shaped status badge that flips between
       * Adopted (green) and Awaiting Sign-off (amber). Replaces the
       * old low-contrast text link so state reads at a glance. */}
      {ready && (
        <div className={styles.pcV2Action}>
          <span
            className={`${styles.adoptionPill} ${adoption ? styles.adoptionPillOk : styles.adoptionPillWarn}`}
          >
            {adoption ? (
              <>
                <I name="check" size={11} />
                Adopted{ackCount > 0 ? ` · ${ackCount} ack` : ""}
              </>
            ) : (
              <>
                <I name="clock3" size={11} />
                Awaiting Sign-off
              </>
            )}
          </span>
        </div>
      )}
    </button>
  );
};

/* ── Compact list row for the Specialty & Other panel ──────────────────── */

const ProtocolListRow = ({ user, p, onOpenProtocol }) => {
  const ready = !!p.data;
  const status = ready ? effectiveStatus(p.data) : "published";
  const statusMeta = STATUS_META[status] ?? STATUS_META.published;
  const categoryMeta = getCategoryMeta(p.data?.category);
  const adoption = ready ? getAdoption(user.tenantId, p.data.id, p.data.version.number) : null;
  const v = p.data?.version ?? {};
  return (
    <button
      type="button"
      className={styles.pcRow}
      onClick={() => ready && onOpenProtocol(p.reference)}
      disabled={!ready}
    >
      <span className={styles.pcRowRef} style={{ background: `color-mix(in srgb, ${categoryMeta.color} 14%, transparent)`, color: categoryMeta.color }}>
        {p.reference}
      </span>
      <span className={styles.pcRowTitle}>{p.title}</span>
      <span className={styles.pcRowStatus} style={{ color: statusMeta.color, background: `color-mix(in srgb, ${statusMeta.color} 12%, transparent)` }}>
        {statusMeta.label}
      </span>
      <span className={styles.pcRowVer}>v{v.number}</span>
      <span className={styles.pcRowReview}>
        {v.nextReviewDate ? `Review ${formatDate(v.nextReviewDate)}` : "—"}
      </span>
      <span className={adoption ? styles.pcRowAdoptOk : styles.pcRowAdoptWarn}>
        {adoption ? <><I name="check" size={10} /> Adopted</> : <><I name="clock3" size={10} /> Awaiting adoption</>}
      </span>
      <I name="arrow" size={11} color="var(--outline)" />
    </button>
  );
};

/* ── Summary card on the header strip ─────────────────────────────────── */

const SummaryCard = ({ label, count, color, onClick, active }) => (
  <button
    type="button"
    className={`${styles.protoSummaryCard} ${active ? styles.protoSummaryCardActive : ""}`}
    style={active
      ? { borderColor: color, background: `color-mix(in srgb, ${color} 8%, transparent)` }
      : undefined}
    onClick={onClick}
  >
    <div className={styles.protoSummaryCount} style={{ color }}>{count}</div>
    <div className={styles.protoSummaryLabel}>{label}</div>
  </button>
);

/* ── Specialty card for the Specialty / Optional tab grid ──────────────── */

const SpecialtyCard = ({ category, count, statusSummary, onView }) => {
  const meta = getCategoryMeta(category);
  return (
    <button
      type="button"
      className={styles.protoSpecCard}
      onClick={onView}
      style={{ borderLeftColor: meta.color }}
    >
      <div className={styles.protoSpecCardHead}>
        <span className={styles.protoSpecCardDot} style={{ background: meta.color }} />
        <span className={styles.protoSpecCardTitle} style={{ color: meta.color }}>{category}</span>
      </div>
      <div className={styles.protoSpecCardCount}>{count} protocol{count === 1 ? "" : "s"}</div>
      <div className={styles.protoSpecCardSummary}>{statusSummary}</div>
      <div className={styles.protoSpecCardCta}>
        View protocols
        <I name="arrow" size={12} />
      </div>
    </button>
  );
};

/* ── Empty state for tabs with no content ─────────────────────────────── */

const EmptyState = ({ icon, title, body }) => (
  <Card hover={false} className={styles.protoEmpty}>
    <I name={icon} size={28} color="var(--on-surface-variant)" />
    <div className={styles.protoEmptyTitle}>{title}</div>
    <div className={styles.protoEmptyBody}>{body}</div>
  </Card>
);

/* ── Main library page ────────────────────────────────────────────────── */

export const ProtocolLibrary = ({
  user, onBack, onOpenProtocol, onOpenCompliance,
  activeCategory: controlledCategory, onChangeCategory,
  // Standalone = mounted as a top-level page via the sidebar's Clinical
  // Protocols shortcut, not as a sub-view inside Governance & SOPs. Hides
  // the "Governance & SOPs > Clinical Governance > …" breadcrumb so the
  // page chrome doesn't pretend it lives in another area.
  standalone = false,
}) => {
  const totalCount = PROTOCOLS.length;
  const isGov = isGovernanceUser(user);

  /* Tab state — defaults to "core" so everyday clinical users see Core first. */
  const [tab, setTab] = useState("core");

  /* Role chip state — drives the lower filter row and (when not
   * "all") narrows the visible protocols to the role's audience.
   * Layered ON TOP of the tier tab so existing tab-specific
   * rendering keeps working unchanged. */
  const [role, setRole] = useState("all");

  /* Search + status filter state. */
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(null); // null = all statuses in current tab

  /* Specialty / Optional tab can drill into a single category. */
  const [localCategory, setLocalCategory] = useState(null);
  const activeCategory = controlledCategory !== undefined ? controlledCategory : localCategory;
  const setActiveCategory = onChangeCategory ?? setLocalCategory;

  /* Build the working set: protocols visible to this user. */
  const visibleProtocols = useMemo(
    () => PROTOCOLS.filter((p) => p.data && (isGov || !["draft","in_review","archived","rejected"].includes(effectiveStatus(p.data)))),
    [user, isGov],
  );

  const counts = useMemo(() => tierCounts(visibleProtocols.map((p) => p.data), user), [visibleProtocols, user]);

  /* When the search query is non-empty, ignore the active tab and search all
   * visible protocols. The matching protocols are grouped by their tier so the
   * user keeps situational awareness. */
  const searching = query.trim().length > 0;

  /* Live count per role across the visible protocols. Drives the
   * badge number on each role chip. */
  const rCounts = useMemo(
    () => roleCounts(visibleProtocols.map((p) => p.data)),
    [visibleProtocols],
  );

  /* Protocols for the currently-active tab + filters. The role chip
   * is layered on AFTER the existing tier/status/query filter so the
   * tier-specific body branches keep working. When role === "all" it
   * passes through every protocol unchanged. */
  const tabProtocols = useMemo(() => {
    const items = visibleProtocols.map((p) => p.data);
    const filtered = filterProtocols(items, {
      user,
      tier: searching ? null : tab,
      statuses: statusFilter ? [statusFilter] : null,
      query,
    });
    if (role === "all") return filtered;
    return filtered.filter((p) => rolesForProtocol(p).has(role));
  }, [visibleProtocols, user, tab, statusFilter, query, searching, role]);

  /* "🚨 Urgent Actions for Your Role" feed — top 2 protocols visible
   * to the current role that are either still awaiting adoption (no
   * acknowledgement for this user) or carry a `review_due` status.
   * Picked from the full visible set (not the current tab) so the
   * banner is always grounded in the user's actual workload. */
  const urgentActions = useMemo(() => {
    const all = visibleProtocols.map((p) => p.data);
    const candidates = all.filter((p) => {
      if (role !== "all" && !rolesForProtocol(p).has(role)) return false;
      const status = effectiveStatus(p);
      if (status === "review_due") return true;
      // "Awaiting adoption" = no adoption record for the current user
      // against this version. Resolved at render-time inside the card.
      const adoption = getAdoption(user.tenantId, p.id, p.version.number);
      return !adoption;
    });
    return candidates.slice(0, 2);
  }, [visibleProtocols, role, user]);

  /* Group tab content by category for Specialty / Optional / Archived tabs. */
  const tabGroups = useMemo(() => {
    const groups = new Map();
    for (const p of tabProtocols) {
      const cat = p.category ?? "Other";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push({ reference: p.reference, title: p.title, data: p });
    }
    return [...groups.entries()].map(([category, items]) => ({ category, items }));
  }, [tabProtocols]);

  const setTabAndReset = (next) => {
    setTab(next);
    setActiveCategory(null);
    setStatusFilter(null);
  };
  const PageTitle = standalone ? "h1" : "h2";

  return (
    <div>
      {/* Breadcrumb on its own line — only shown when nested under
          Governance & SOPs; the standalone Clinical Protocols page hides it. */}
      {!standalone && (
        <div className={styles.protoBreadcrumb}>
          <span>Governance &amp; SOPs</span>
          <I name="arrow" size={11} color="var(--on-surface-variant)" />
          <span>Clinical Governance</span>
          <I name="arrow" size={11} color="var(--on-surface-variant)" />
          <span className={styles.protoBreadcrumbCurrent}>Clinical Protocols</span>
        </div>
      )}

      {/* Search bar + Compliance dashboard CTA share one row so the search
          sits level with the CTA pill on the right. */}
      <div className={styles.protoTopRow}>
        <SearchBar
          placeholder={`Search all ${totalCount} protocols by reference, title, category…`}
          value={query}
          onChange={setQuery}
        />
        {onOpenCompliance && (
          <button className={styles.complianceCTA} onClick={onOpenCompliance}>
            <I name="usercheck" size={13} /> Compliance dashboard
          </button>
        )}
      </div>

      <div className={styles.pvDocHeaderRow}>
        <div className={styles.pvDocHeader}>
          <PageTitle className={styles.pvDocTitle}>Clinical Protocols</PageTitle>
          <p className={styles.pvDocSubtitle}>
            Controlled clinical protocols organised by core use, specialty and optional services.
            Use the filters to quickly find the protocols most relevant to your practice.
          </p>
        </div>
        <div className={styles.kpiStripV2}>
          <KpiTileV2 icon="file"   iconColor="#006974" iconBg="rgba(0,105,116,0.10)"   num={totalCount}      label="Total controlled protocols" />
          <KpiTileV2 icon="star"   iconColor="#006974" iconBg="rgba(0,105,116,0.10)"   num={counts.core}     label="Core protocols"             showLive />
          <KpiTileV2 icon="layers" iconColor="#6a1b9a" iconBg="rgba(106,27,154,0.10)"  num={counts.specialty} label="Specialty protocols"        showLive />
          <KpiTileV2 icon="award"  iconColor="#f57c00" iconBg="rgba(245,124,0,0.10)"   num={counts.advanced}  label="Optional services protocols" showLive />
        </div>
      </div>

      {/* ── 🚨 Urgent Actions for Your Role ─────────────────────────
       * High-emphasis banner above the chip filter rows. Renders
       * only when the current role has up to 2 protocols still
       * awaiting adoption OR carrying a review_due status. Empty
       * state hides the section entirely so the filter row stays at
       * the top — no "0 urgent" placeholder noise. */}
      {!searching && urgentActions.length > 0 && (
        <section className={styles.urgentSection} aria-labelledby="urgent-heading">
          <header className={styles.urgentHead}>
            <span className={styles.urgentEyebrow} aria-hidden="true">🚨</span>
            <h3 id="urgent-heading" className={styles.urgentTitle}>
              Urgent Actions for Your Role
            </h3>
            <span className={styles.urgentCount}>
              {urgentActions.length} pending
            </span>
          </header>
          <div className={styles.urgentList}>
            {urgentActions.map((p) => {
              const status   = effectiveStatus(p);
              const adoption = getAdoption(user.tenantId, p.id, p.version.number);
              const reason   = !adoption
                ? "Awaiting your sign-off"
                : status === "review_due"
                  ? "Review window open — verify still current"
                  : "Action required";
              const catMeta = getCategoryMeta(p.category);
              return (
                <button
                  key={p.reference}
                  type="button"
                  className={styles.urgentCard}
                  onClick={() => onOpenProtocol?.(p.reference)}
                >
                  <span
                    className={styles.urgentRef}
                    style={{ background: catMeta.color, color: "#fff" }}
                  >
                    {p.reference}
                  </span>
                  <div className={styles.urgentBody}>
                    <div className={styles.urgentCardTitle}>{p.title}</div>
                    <div className={styles.urgentReason}>{reason}</div>
                  </div>
                  <span className={styles.urgentCta}>
                    <span aria-hidden="true">🖋️</span>
                    Read &amp; Sign Protocol
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Role chip row — drives `role` state. Sits above the
       *    existing tier chips so the user picks "who am I?" first
       *    and then narrows by tier. */}
      {!searching && (
        <div className={`${styles.pcFilterRow} ${styles.pcRoleRow}`}>
          <div className={styles.pcFilterLeft}>
            <span className={styles.pcFilterGroupLabel}>Team</span>
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`${styles.pcFilterChip} ${styles.pcRoleChip} ${role === opt.key ? styles.pcFilterChipActive : ""}`}
                onClick={() => setRole(opt.key)}
                aria-pressed={role === opt.key}
              >
                <I name={opt.icon} size={12} color="currentColor" />
                {opt.label}
                <span className={styles.pcFilterCount}>{rCounts[opt.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chip-row filter — tier chips on left, status chips on right. */}
      {!searching && (
        <div className={styles.pcFilterRow}>
          <div className={styles.pcFilterLeft}>
            <span className={styles.pcFilterGroupLabel}>Type</span>
            <button type="button" className={`${styles.pcFilterChip} ${tab === "core" ? styles.pcFilterChipActive : ""}`} onClick={() => setTabAndReset("core")}>
              <I name="star" size={11} /> Core <span className={styles.pcFilterCount}>{counts.core}</span>
            </button>
            <button type="button" className={`${styles.pcFilterChip} ${tab === "specialty" ? styles.pcFilterChipActive : ""}`} onClick={() => setTabAndReset("specialty")}>
              <I name="layers" size={11} /> Specialty <span className={styles.pcFilterCount}>{counts.specialty}</span>
            </button>
            <button type="button" className={`${styles.pcFilterChip} ${tab === "advanced" ? styles.pcFilterChipActive : ""}`} onClick={() => setTabAndReset("advanced")}>
              <I name="award" size={11} /> Optional services <span className={styles.pcFilterCount}>{counts.advanced}</span>
            </button>
            <button type="button" className={`${styles.pcFilterChip} ${tab === "site_specific" ? styles.pcFilterChipActive : ""}`} onClick={() => setTabAndReset("site_specific")}>
              <I name="building" size={11} /> Site-specific <span className={styles.pcFilterCount}>{counts.site_specific}</span>
            </button>
            {isGov && (
              <button type="button" className={`${styles.pcFilterChip} ${tab === "archived" ? styles.pcFilterChipActive : ""}`} onClick={() => setTabAndReset("archived")}>
                <I name="archive" size={11} /> Archived <span className={styles.pcFilterCount}>{counts.archived}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Body — depends on active tab, search mode, role filter and
       *  contents.
       *
       *  Render order:
       *   1. Search query active  → flat grouped grid (search results)
       *   2. Role chip non-"all" → chapter accordion (collapsed by
       *                            default — clinicians click to
       *                            expand the relevant section)
       *   3. else (role = "all")  → existing tier-organised render
       *                            (Core SectionCard + Specialty
       *                            preview, etc.) */}
      {!searching && role !== "all" && (
        tabProtocols.length === 0 ? (
          <EmptyState icon="folder" title="No protocols match this role" body="Try a different role chip, or switch to All Protocols." />
        ) : (
          <ChapterAccordion
            chapters={groupByChapter(tabProtocols)}
            user={user}
            onOpenProtocol={onOpenProtocol}
          />
        )
      )}

      {/* Tier-organised body — only renders when no role filter is
       *  active (role === "all"). Search still wins above this. */}
      {role === "all" && (
      <>{searching ? (
        tabProtocols.length === 0 ? (
          <EmptyState icon="search" title="No protocols match" body={`No protocols match "${query}". Try a different reference, title or category.`} />
        ) : (
          <SectionGrid title={`Search results — ${tabProtocols.length} match${tabProtocols.length === 1 ? "" : "es"}`} groups={tabGroups} user={user} onOpenProtocol={onOpenProtocol} />
        )
      ) : tab === "core" ? (
        tabProtocols.length === 0 ? (
          <EmptyState icon="file" title="No Core protocols match the current filter" body="Try clearing the status filter or returning to the Core tab default view." />
        ) : (
          <>
            {/* Core grid wrapped in a section card */}
            <SectionCard
              icon="star"
              accent="#006974"
              title="Core Protocols"
              subtitle="Everyday protocols used across the group."
              cta={{ label: "View all core protocols", onClick: () => setTabAndReset("core") }}
            >
              <div className={styles.protoCardGrid}>
                {tabProtocols.map((p) => (
                  <ProtocolCard key={p.reference} user={user} p={{ reference: p.reference, title: p.title, data: p }} onOpenProtocol={onOpenProtocol} />
                ))}
              </div>
            </SectionCard>

            {/* Specialty & Other preview list */}
            <SpecialtyAndOtherSection
              user={user}
              visibleProtocols={visibleProtocols}
              onOpenProtocol={onOpenProtocol}
              onViewAll={() => setTabAndReset("specialty")}
            />
          </>
        )
      ) : tab === "site_specific" ? (
        tabProtocols.length === 0 ? (
          <EmptyState icon="building" title="No site-specific protocols yet" body="Local clinical pathways that apply only to specific practices will appear here. The Clinical Director or Governance Lead can add a site-specific protocol from the Pack management area." />
        ) : (
          <SectionGrid title="Site-specific protocols" groups={tabGroups} user={user} onOpenProtocol={onOpenProtocol} />
        )
      ) : (
        // specialty / advanced / archived — render specialty cards if a category isn't selected,
        // or the protocols within the selected category.
        activeCategory ? (
          <FlatGrid items={tabProtocols.filter((p) => p.category === activeCategory)} user={user} onOpenProtocol={onOpenProtocol} headerNode={
            <button type="button" className={styles.protoBackToSpecs} onClick={() => setActiveCategory(null)}>
              <I name="back" size={12} /> Back to all {tab === "specialty" ? "specialties" : tab === "advanced" ? "optional services" : "archived"}
            </button>
          } />
        ) : (
          tabGroups.length === 0 ? (
            <EmptyState icon="file" title="Nothing here yet" body={`No protocols in this tier match your filters.`} />
          ) : (
            <div className={styles.protoSpecGrid}>
              {tabGroups.map((g) => (
                <SpecialtyCard
                  key={g.category}
                  category={g.category}
                  count={g.items.length}
                  statusSummary={summariseStatuses(g.items.map((i) => i.data))}
                  onView={() => setActiveCategory(g.category)}
                />
              ))}
            </div>
          )
        )
      )}</>
      )}

    </div>
  );
};

/* ── Section wrapper card used by both Core grid and Specialty list ───── */
const SectionCard = ({ icon, accent, title, subtitle, cta, children }) => (
  <div className={styles.pcSection}>
    {/* Simplified section header per mock — plain title only, no icon /
        subtitle / View-all CTA. Keeps the grid the focus. */}
    <div className={styles.pcSectionHead}>
      <div className={styles.pcSectionTitleWrap}>
        <div className={styles.pcSectionTitle}>{title}</div>
      </div>
    </div>
    {children}
  </div>
);

/* ── Specialty & Other preview — list rows below the Core grid ────────── */
const SpecialtyAndOtherSection = ({ user, visibleProtocols, onOpenProtocol, onViewAll }) => {
  // Take a small preview from Specialty + Optional + Site-specific (no Archived)
  const items = visibleProtocols
    .map((p) => p.data)
    .filter((d) => d && (d.tier === "specialty" || d.tier === "advanced" || d.tier === "site_specific"))
    .slice(0, 6);
  if (items.length === 0) return null;
  return (
    <SectionCard
      icon="layers"
      accent="#6a1b9a"
      title="Specialty & Other Protocols"
      subtitle="Specialty, optional services and site-specific protocols."
      cta={{ label: "View all specialty & other protocols", onClick: onViewAll }}
    >
      <div className={styles.pcRowList}>
        {items.map((p) => (
          <ProtocolListRow
            key={p.reference}
            user={user}
            p={{ reference: p.reference, title: p.title, data: p }}
            onOpenProtocol={onOpenProtocol}
          />
        ))}
      </div>
    </SectionCard>
  );
};

/* Helper for the specialty card status summary line. */
function summariseStatuses(items) {
  const c = { published: 0, review_due: 0, draft: 0, in_review: 0, archived: 0, expired: 0 };
  for (const it of items) c[effectiveStatus(it)] = (c[effectiveStatus(it)] ?? 0) + 1;
  const parts = [];
  if (c.published)  parts.push(`${c.published} published`);
  if (c.review_due) parts.push(`${c.review_due} review due`);
  if (c.in_review)  parts.push(`${c.in_review} in review`);
  if (c.draft)      parts.push(`${c.draft} draft`);
  if (c.archived)   parts.push(`${c.archived} archived`);
  return parts.join(" · ");
}

/* Chapter accordion — renders the role-filtered protocol set as a
 * stack of collapsed expanders, one per CHAPTERS entry. Multi-
 * expand (any number of chapters can be open at once). Empty
 * chapters are pre-filtered by groupByChapter. */
const ChapterAccordion = ({ chapters, user, onOpenProtocol }) => {
  const [openIds, setOpenIds] = useState(() => new Set());
  const toggle = (id) => setOpenIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  return (
    <div className={styles.chapterAccordion}>
      {chapters.map((ch) => {
        const isOpen = openIds.has(ch.id);
        return (
          <section key={ch.id} className={`${styles.chapterSection} ${isOpen ? styles.chapterSectionOpen : ""}`}>
            <button
              type="button"
              className={styles.chapterBar}
              onClick={() => toggle(ch.id)}
              aria-expanded={isOpen}
              aria-controls={`chapter-body-${ch.id}`}
            >
              <I name={ch.icon} size={14} color="var(--on-surface-variant)" />
              <span className={styles.chapterTitle}>
                <span className={styles.chapterIndex}>Chapter {ch.index}:</span> {ch.title}
              </span>
              <span className={styles.chapterCount}>
                {ch.items.length} Protocol{ch.items.length === 1 ? "" : "s"}
              </span>
              <I
                name="chevrondown"
                size={14}
                color="var(--on-surface-variant)"
                /* Inline rotate so the chevron flips up when expanded
                 * without needing a second .chapterChevronOpen class. */
                {...(isOpen ? { } : { })}
              />
            </button>
            {isOpen && (
              <div id={`chapter-body-${ch.id}`} className={styles.chapterBody}>
                <div className={styles.protoCardGrid}>
                  {ch.items.map((p) => (
                    <ProtocolCard
                      key={p.reference}
                      user={user}
                      p={{ reference: p.reference, title: p.title, data: p }}
                      onOpenProtocol={onOpenProtocol}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

/* Flat grid — Core / single-category drill-in. */
const FlatGrid = ({ items, user, onOpenProtocol, headerNode }) => (
  <div>
    {headerNode}
    <div className={styles.protoCardGrid}>
      {items.map((p) => (
        <ProtocolCard
          key={p.reference}
          user={user}
          p={{ reference: p.reference, title: p.title, data: p }}
          onOpenProtocol={onOpenProtocol}
        />
      ))}
    </div>
  </div>
);

/* Section grid — search results and site-specific tab, grouped by category. */
const SectionGrid = ({ title, groups, user, onOpenProtocol }) => (
  <div>
    {title && <div className={styles.protoSectionTitle}>{title}</div>}
    {groups.map((g) => {
      const meta = getCategoryMeta(g.category);
      return (
        <div key={g.category} className={styles.pvCategoryBlock}>
          <div className={styles.pvCategoryHead} style={{ borderLeftColor: meta.color }}>
            <h3 className={styles.pvCategoryTitle} style={{ color: meta.color }}>{g.category}</h3>
            <span className={styles.pvCategoryCount}>{g.items.length} protocol{g.items.length === 1 ? "" : "s"}</span>
          </div>
          <div className={styles.protoCardGrid}>
            {g.items.map((p) => (
              <ProtocolCard key={p.reference} user={user} p={p} onOpenProtocol={onOpenProtocol} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);
