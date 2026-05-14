export const labContactsFixture = [
  { name: "Dental Arts Laboratory",        specialty: "Crowns, bridges, veneers",         phone: "020 7946 1234", turnaround: "5–7 working days"  },
  { name: "OrthoLab London",               specialty: "Removable appliances, retainers",   phone: "020 7946 5678", turnaround: "7–10 working days" },
  { name: "Align Technology (Invisalign)", specialty: "Clear aligners",                    phone: "0800 012 0200", turnaround: "3–4 weeks"         },
  { name: "3M Oral Care Lab Services",     specialty: "Digital impressions, CEREC",        phone: "0800 626 578",  turnaround: "3–5 working days"  },
];

export const digitalGuidesFixture = [
  { name: "Lab Prescription & Docket Completion Guide",      reviewed: "Mar 2025" },
  { name: "Intraoral Scanner — Daily Setup & Calibration",   reviewed: "Feb 2025" },
  { name: "Digital Case Submission to Laboratory",           reviewed: "Jan 2025" },
  { name: "Shade Selection & Clinical Photography Protocol", reviewed: "Jan 2025" },
  { name: "Invisalign Case Submission Checklist",            reviewed: "Dec 2024" },
];

export const labCasesFixture = [
  { id: 1, patient: "Mr. James Powell",  clinician: "Dr. Sarah Jenkins", lab: "Dental Arts Laboratory",    workType: "Crown (PFM) — UR4",         sentDate: "2026-04-28", dueDate: "2026-05-07", status: "At Lab",   notes: "Shade A2, standard occlusion"  },
  { id: 2, patient: "Mrs. Clara Hughes", clinician: "Dr. Sarah Jenkins", lab: "Dental Arts Laboratory",    workType: "3-Unit Bridge — LL4–6",     sentDate: "2026-04-22", dueDate: "2026-04-29", status: "Returned", notes: "Check contacts carefully"      },
  { id: 3, patient: "Mr. Tom Bradley",   clinician: "Leo Vance",         lab: "3M Oral Care Lab Services", workType: "Implant Crown — LR6",       sentDate: "2026-04-25", dueDate: "2026-04-30", status: "At Lab",   notes: "Abutment sent separately"      },
  { id: 4, patient: "Miss Priya Shah",   clinician: "Dr. Sarah Jenkins", lab: "OrthoLab London",           workType: "Upper Hawley Retainer",     sentDate: "2026-05-01", dueDate: "2026-05-12", status: "Sent",     notes: ""                              },
  { id: 5, patient: "Mr. David Moore",   clinician: "Leo Vance",         lab: "Dental Arts Laboratory",    workType: "Porcelain Veneers — UL1–2", sentDate: "2026-04-20", dueDate: "2026-04-27", status: "Fitted",   notes: "Fitted 29 Apr — patient happy" },
];
