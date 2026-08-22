import { clinicalStaffAtSite } from "../people";

export const snapshotActionsFixture = [
  { priority: "critical", icon: "shieldalert", category: "Registration", text: "Daisy Nurse — GDC registration expired Feb 2026",     nav: "staff" },
  { priority: "critical", icon: "alert",       category: "Incident",     text: "Needlestick incident — High severity, under review",  nav: "cqc"   },
  { priority: "critical", icon: "alert",       category: "Training",     text: "Safeguarding Adults — Daisy Nurse overdue",            nav: "hr"    },
  { priority: "warning",  icon: "shieldalert", category: "Registration", text: "Megan Hughes — GDC renewal due 30 Jun 2026 (56 days)",  nav: "staff" },
  { priority: "warning",  icon: "calendar",    category: "Leave",        text: "Dr. Hannah Reed — 5 days annual leave requested (1–5 Jun)", nav: null    },
];

export const leaveRequestsFixture = [
  { id: 1, name: "Dr. Hannah Reed",   role: "Dentist",      type: "Annual Leave",        dates: "1–5 Jun 2026",   days: 5, status: "pending"  },
  { id: 2, name: "Daisy Nurse",  role: "Dental Nurse", type: "Annual Leave",        dates: "16–17 Jun 2026", days: 2, status: "pending"  },
  { id: 3, name: "Sophie Bennett", role: "Hygienist",    type: "Annual Leave",        dates: "7–11 Jul 2026",  days: 5, status: "approved" },
  { id: 4, name: "Megan Hughes",  role: "Hygienist",    type: "Study Leave",         dates: "20 May 2026",    days: 1, status: "approved" },
  { id: 5, name: "Dr. Amir Dentist",  role: "Dentist",      type: "Compassionate Leave", dates: "12 May 2026",    days: 1, status: "pending"  },
];

export const gdcRecordsFixture = [
  { name: "Dr. Callum Lead", role: "Dentist",             gdc: "123456", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Dr. Hannah Reed",         role: "Dentist",             gdc: "345678", expiry: "30 Jun 2026", status: "warning" },
  { name: "Dr. Amir Dentist",        role: "Dentist",             gdc: "456789", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Sophie Bennett",       role: "Hygienist/Therapist", gdc: "234567", expiry: "30 Sep 2026", status: "ok"      },
  { name: "Megan Hughes",        role: "Hygienist/Therapist", gdc: "678901", expiry: "30 Jun 2026", status: "warning" },
  { name: "Daisy Nurse",        role: "Dental Nurse",        gdc: "567890", expiry: "28 Feb 2026", status: "expired" },
  { name: "Ria Reception",      role: "Receptionist",        gdc: "—",      expiry: "—",           status: "na"      },
];

export const trainingRecordsFixture = [
  { name: "Dr. Callum Lead", bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Dr. Hannah Reed",         bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Dr. Amir Dentist",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Sophie Bennett",       bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Megan Hughes",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Daisy Nurse",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "overdue", gdpr: "ok" },
  { name: "Ria Reception",      bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
];

export const managerIncidentsFixture = [
  { id: 1, type: "Needlestick / Sharps Injury", severity: "High",   date: "20 Apr 2026", status: "Under Review", staff: "Daisy Nurse"     },
  { id: 2, type: "Equipment Failure or Defect", severity: "Medium", date: "28 Apr 2026", status: "Open",         staff: "Maya Manager"  },
  { id: 3, type: "Near Miss",                   severity: "Low",    date: "15 Mar 2026", status: "Closed",       staff: "Dr. Amir Dentist" },
];

export const cqcSummaryFixture = { complete: 4, total: 13, lastAudit: "2 May 2026" };

export const udaTotalFixture = {
  contracted: 4800, delivered: 2340,
  period: "Apr 2025 – Mar 2026", monthsElapsed: 7, totalMonths: 12,
};

/* UDA contract year runs April–March. Each clinician carries two
 * 12-element arrays (one for the agreed monthly target, one for
 * what was actually delivered). Month order: Apr → Mar.
 *
 * `contracted` + `delivered` are derived totals (sum of arrays) —
 * computed live in `listUdaDentists()` so the UI never has to
 * maintain them in two places. */
export const UDA_MONTHS = [
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec", "Jan", "Feb", "Mar",
];

/* Real, DISTINCT Southall (practice-harley) clinicians who carry a UDA
 * line — the three dentists, the foundation dentist, and the senior
 * hygiene/therapy clinician — pulled live from the shared people roster.
 * Indexed WITHOUT wrap-around, so the same person can never land on two
 * rows (the old `i % length` recycled a 3-person list across 5 rows and
 * showed Callum/Amir twice). Only the NAME is sourced live; every UDA
 * metric below is the original hand-tuned demo data, preserved verbatim. */
const southallUdaClinicians = [
  ...clinicalStaffAtSite("site-southall", "Dentist"),    // Callum, Amir, Hannah
  ...clinicalStaffAtSite("site-southall", "FD"),         // Leo Marsh
  ...clinicalStaffAtSite("site-southall", "Hygienist"),  // Sophie Bennett, Megan Hughes
];
const udaName = (i) => southallUdaClinicians[i]?.displayName ?? "—";

export const udaDentistsFixture = [
  {
    name: udaName(0),
    /* index aligns with UDA_MONTHS — element [0] = April */
    monthlyTargets: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200],
    monthlyActuals: [195, 210, 175, 180, 175, 165, 80,  0,   0,   0,   0,   0  ],
  },
  {
    name: udaName(1),
    monthlyTargets: [117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 117, 113],
    monthlyActuals: [105, 110, 115, 95,  100, 105, 90,  0,   0,   0,   0,   0  ],
  },
  {
    name: udaName(2),
    monthlyTargets: [83,  83,  83,  83,  84,  84,  84,  84,  83,  83,  83,  83 ],
    monthlyActuals: [70,  65,  72,  60,  68,  60,  45,  0,   0,   0,   0,   0  ],
  },
  /* Extras for scroll-overflow demo */
  {
    name: udaName(3),
    monthlyTargets: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
    monthlyActuals: [160, 165, 155, 150, 155, 160, 140, 0,   0,   0,   0,   0  ],
  },
  {
    name: udaName(4),
    monthlyTargets: [133, 133, 133, 133, 133, 133, 133, 133, 133, 133, 133, 137],
    monthlyActuals: [100, 95,  120, 110, 115, 105, 100, 0,   0,   0,   0,   0  ],
  },
];

/** Sum helper — used by listUdaDentists() to derive contracted/delivered. */
export function udaTotals(dentist) {
  const sum = (arr) => arr.reduce((n, v) => n + (Number(v) || 0), 0);
  return {
    contracted: sum(dentist.monthlyTargets),
    delivered:  sum(dentist.monthlyActuals),
  };
}
