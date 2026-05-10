export const policiesFixture = [
  { name: "Maternity & Paternity", updated: "Updated Aug 2023" },
  { name: "Health & Safety", updated: "Updated Jan 2024" },
  { name: "Clinical Standards", updated: "Updated May 2023" },
  { name: "Disciplinary Code", updated: "Updated Dec 2023" },
  { name: "Expenses Policy", updated: "Updated Feb 2024" },
];

export const mandatoryTrainingFixture = [
  { name: "Fire Safety & Evacuation", due: "Aug 2025", status: "done"    },
  { name: "Infection Control (HCAI)", due: "Oct 2025", status: "done"    },
  { name: "Safeguarding Adults",      due: "Mar 2025", status: "overdue" },
  { name: "BLS / CPR",                due: "Jun 2025", status: "due"     },
  { name: "GDPR Awareness",           due: "Dec 2025", status: "done"    },
];

export const noticesFixture = [
  { title: "2025 Pay Review",        date: "28 Apr", tag: "Payroll",     desc: "Individual letters have been sent. New rates effective from 1 May 2025." },
  { title: "May Bank Holiday",       date: "22 Apr", tag: "Leave",       desc: "Practice closed Monday 5 May. All rotas have been adjusted." },
  { title: "Welcome — James Hart",   date: "15 Apr", tag: "New Starter", desc: "James joins Birmingham as a Dental Therapist. Please make him feel welcome." },
  { title: "Expenses Policy Update", date: "1 Apr",  tag: "Policy",      desc: "Revised mileage rates and receipt submission deadlines now in effect." },
];

export const hrQuickLinksFixture = [
  { icon: "file",       title: "Request a Referral", desc: "Fast-track clinical referrals for specialized cases through our internal hub.",       tint: "var(--primary)" },
  { icon: "heart",      title: "Mental Wellbeing",   desc: "Confidential support and resources to help you maintain a healthy work-life balance.", tint: "var(--secondary)" },
  { icon: "creditcard", title: "Payslip Portal",     desc: "Securely view and download your monthly salary statements and tax documents.",         tint: "var(--on-tertiary-container)" },
];
