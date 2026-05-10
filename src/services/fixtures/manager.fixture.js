export const snapshotActionsFixture = [
  { priority: "critical", icon: "shieldalert", category: "Registration", text: "Amy Clarke — GDC registration expired Feb 2026",     nav: "staff" },
  { priority: "critical", icon: "alert",       category: "Incident",     text: "Needlestick incident — High severity, under review",  nav: "cqc"   },
  { priority: "critical", icon: "alert",       category: "Training",     text: "Safeguarding Adults — Amy Clarke overdue",            nav: "hr"    },
  { priority: "warning",  icon: "shieldalert", category: "Registration", text: "James Hart — GDC renewal due 30 Jun 2026 (56 days)",  nav: "staff" },
  { priority: "warning",  icon: "calendar",    category: "Leave",        text: "Leo Vance — 5 days annual leave requested (1–5 Jun)", nav: null    },
];

export const leaveRequestsFixture = [
  { id: 1, name: "Leo Vance",   role: "Dentist",      type: "Annual Leave",        dates: "1–5 Jun 2026",   days: 5, status: "pending"  },
  { id: 2, name: "Amy Clarke",  role: "Dental Nurse", type: "Annual Leave",        dates: "16–17 Jun 2026", days: 2, status: "pending"  },
  { id: 3, name: "Elena Rossi", role: "Hygienist",    type: "Annual Leave",        dates: "7–11 Jul 2026",  days: 5, status: "approved" },
  { id: 4, name: "James Hart",  role: "Hygienist",    type: "Study Leave",         dates: "20 May 2026",    days: 1, status: "approved" },
  { id: 5, name: "Jessica Wu",  role: "Dentist",      type: "Compassionate Leave", dates: "12 May 2026",    days: 1, status: "pending"  },
];

export const gdcRecordsFixture = [
  { name: "Dr. Sarah Jenkins", role: "Dentist",             gdc: "123456", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Leo Vance",         role: "Dentist",             gdc: "345678", expiry: "30 Jun 2026", status: "warning" },
  { name: "Jessica Wu",        role: "Dentist",             gdc: "456789", expiry: "31 Dec 2026", status: "ok"      },
  { name: "Elena Rossi",       role: "Hygienist/Therapist", gdc: "234567", expiry: "30 Sep 2026", status: "ok"      },
  { name: "James Hart",        role: "Hygienist/Therapist", gdc: "678901", expiry: "30 Jun 2026", status: "warning" },
  { name: "Amy Clarke",        role: "Dental Nurse",        gdc: "567890", expiry: "28 Feb 2026", status: "expired" },
  { name: "Sophie Brown",      role: "Receptionist",        gdc: "—",      expiry: "—",           status: "na"      },
];

export const trainingRecordsFixture = [
  { name: "Dr. Sarah Jenkins", bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Leo Vance",         bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Jessica Wu",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Elena Rossi",       bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "James Hart",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
  { name: "Amy Clarke",        bls: "ok", fire: "ok", ipc: "ok", safeguarding: "overdue", gdpr: "ok" },
  { name: "Sophie Brown",      bls: "ok", fire: "ok", ipc: "ok", safeguarding: "ok",      gdpr: "ok" },
];

export const managerIncidentsFixture = [
  { id: 1, type: "Needlestick / Sharps Injury", severity: "High",   date: "20 Apr 2026", status: "Under Review", staff: "Amy Clarke"     },
  { id: 2, type: "Equipment Failure or Defect", severity: "Medium", date: "28 Apr 2026", status: "Open",         staff: "Mark Thompson"  },
  { id: 3, type: "Near Miss",                   severity: "Low",    date: "15 Mar 2026", status: "Closed",       staff: "Dr. S. Jenkins" },
];

export const cqcSummaryFixture = { complete: 4, total: 13, lastAudit: "2 May 2026" };

export const udaTotalFixture = {
  contracted: 4800, delivered: 2340,
  period: "Apr 2025 – Mar 2026", monthsElapsed: 7, totalMonths: 12,
};

export const udaDentistsFixture = [
  { name: "Dr. Sarah Jenkins", contracted: 2400, delivered: 1180 },
  { name: "Leo Vance",         contracted: 1400, delivered:  720 },
  { name: "Jessica Wu",        contracted: 1000, delivered:  440 },
];
