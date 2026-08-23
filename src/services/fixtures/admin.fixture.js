import { personName } from "../people";

export const adminSectionsFixture = [
  { id: "clinical",  label: "Clinical Resources", icon: "clinical",  color: "var(--primary)" },
  { id: "staff",     label: "Staff Directory",    icon: "staff",     color: "var(--secondary)" },
  { id: "marketing", label: "Marketing Hub",      icon: "marketing", color: "var(--on-tertiary-container)" },
  { id: "training",  label: "Training Hub",       icon: "training",  color: "var(--success)" },
  { id: "cpd",       label: "CPD Tracker",        icon: "chart",     color: "var(--warning)" },
];

/* Doc author / approver / reviewer names resolve to REAL roster people
 * (services/people.js) instead of invented staff. Each invented name maps to
 * a roster person whose role fits the document type:
 *   • clinicalLead  (Dr. Callum Lead)   — clinical author & approver of record
 *   • companyOwner  (Olivia Owner)       — group-level approver
 *   • London clinical lead (Dr. Marcus Webb) — second senior clinical approver
 *   • associateDentist (Dr. Amir Dentist) / south-dentist-2 (Dr. Hannah Reed) — clinical authors
 *   • leadNurse (Nina Nurse Lead)        — staff / CPD document author
 *   • practiceManager (Maya Manager)     — staff / marketing document author
 * Doc fields, statuses and shape are unchanged — only the people values move
 * onto the shared roster. */
const clinicalLead  = personName("clinical-lead");        // Dr. Callum Lead
const groupOwner    = personName("company-owner");        // Olivia Owner
const seniorClinical = personName("london-clinical-lead"); // Dr. Marcus Webb
const dentistA      = personName("associate-dentist");     // Dr. Amir Dentist
const dentistB      = personName("south-dentist-2");       // Dr. Hannah Reed
const leadNurse     = personName("lead-nurse");            // Nina Nurse Lead
const practiceMgr   = personName("manager");               // Maya Manager

export const adminDocsFixture = [
  { id: 1,  name: "Infection Control Policy v3.2",            section: "clinical",  status: "approved",  uploadedBy: clinicalLead,    date: "2024-01-15", size: "2.4 MB",  type: "PDF",  approvedBy: groupOwner,        approvedDate: "2024-01-16", version: "3.2", downloads: 47  },
  { id: 2,  name: "Emergency Drug Dosage Chart",              section: "clinical",  status: "approved",  uploadedBy: seniorClinical,  date: "2024-01-08", size: "890 KB",  type: "PDF",  approvedBy: clinicalLead,      approvedDate: "2024-01-09", version: "5.1", downloads: 112 },
  { id: 3,  name: "Radiography Audit Checklist",              section: "clinical",  status: "in_review", uploadedBy: dentistA,        date: "2024-02-25", size: "1.8 MB",  type: "PDF",  reviewer: clinicalLead,        version: "4.0",  downloads: 0  },
  { id: 4,  name: "Sedation Monitoring Standards",            section: "clinical",  status: "pending",   uploadedBy: dentistB,        date: "2024-02-22", size: "1.2 MB",  type: "PDF",  version: "2.0",  downloads: 0  },
  { id: 5,  name: "Endodontic Irrigation Protocol",           section: "clinical",  status: "approved",  uploadedBy: dentistA,        date: "2024-01-20", size: "640 KB",  type: "PDF",  approvedBy: seniorClinical,    approvedDate: "2024-01-21", version: "3.0", downloads: 38  },
  { id: 6,  name: "Staff Onboarding Checklist 2024",          section: "staff",     status: "approved",  uploadedBy: leadNurse,       date: "2024-02-01", size: "1.1 MB",  type: "DOCX", approvedBy: groupOwner,        approvedDate: "2024-02-02", version: "1.0", downloads: 24  },
  { id: 7,  name: "Organisation Chart - Q1 2024",             section: "staff",     status: "approved",  uploadedBy: groupOwner,      date: "2024-01-10", size: "420 KB",  type: "PDF",  approvedBy: seniorClinical,    approvedDate: "2024-01-11", version: "2.1", downloads: 56  },
  { id: 8,  name: "New Starter Bio Template",                 section: "staff",     status: "pending",   uploadedBy: practiceMgr,     date: "2024-02-28", size: "280 KB",  type: "DOCX", version: "1.0",  downloads: 0  },
  { id: 9,  name: "Team Photo Guidelines",                    section: "staff",     status: "approved",  uploadedBy: leadNurse,       date: "2024-01-05", size: "350 KB",  type: "PDF",  approvedBy: groupOwner,        approvedDate: "2024-01-06", version: "1.2", downloads: 15  },
  { id: 10, name: "Brand Guidelines - Summer Campaign",       section: "marketing", status: "rejected",  uploadedBy: practiceMgr,     date: "2024-02-18", size: "5.7 MB",  type: "PDF",  rejectedBy: groupOwner,        rejectedReason: "Logo usage on pg.4 doesn't meet brand standards.", version: "1.0", downloads: 0 },
  { id: 11, name: "Social Media Template Pack",               section: "marketing", status: "approved",  uploadedBy: practiceMgr,     date: "2024-01-25", size: "12.4 MB", type: "ZIP",  approvedBy: groupOwner,        approvedDate: "2024-01-26", version: "3.0", downloads: 31  },
  { id: 12, name: "Patient Testimonial Release Form",         section: "marketing", status: "approved",  uploadedBy: leadNurse,       date: "2024-01-12", size: "180 KB",  type: "DOCX", approvedBy: groupOwner,        approvedDate: "2024-01-13", version: "2.1", downloads: 22  },
  { id: 13, name: "Whitening Campaign Assets",                section: "marketing", status: "in_review", uploadedBy: practiceMgr,     date: "2024-02-26", size: "8.3 MB",  type: "ZIP",  reviewer: groupOwner,          version: "1.0",  downloads: 0  },
  { id: 14, name: "CPR Refresher Slides 2024",                section: "training",  status: "approved",  uploadedBy: seniorClinical,  date: "2024-01-18", size: "4.2 MB",  type: "PPTX", approvedBy: clinicalLead,      approvedDate: "2024-01-19", version: "6.0", downloads: 67  },
  { id: 15, name: "Safeguarding Level 2 Certificate Template",section: "training",  status: "pending",   uploadedBy: dentistB,        date: "2024-02-22", size: "340 KB",  type: "DOCX", version: "2.0",  downloads: 0  },
  { id: 16, name: "Infection Control E-Learning Module",      section: "training",  status: "approved",  uploadedBy: clinicalLead,    date: "2024-02-05", size: "18.6 MB", type: "ZIP",  approvedBy: seniorClinical,    approvedDate: "2024-02-06", version: "4.1", downloads: 89  },
  { id: 17, name: "New Composite Technique Masterclass",      section: "training",  status: "approved",  uploadedBy: dentistA,        date: "2024-02-10", size: "2.8 MB",  type: "PDF",  approvedBy: clinicalLead,      approvedDate: "2024-02-11", version: "1.0", downloads: 43  },
  { id: 18, name: "GDC CPD Requirements 2024 Guide",          section: "cpd",       status: "approved",  uploadedBy: clinicalLead,    date: "2024-01-02", size: "1.6 MB",  type: "PDF",  approvedBy: seniorClinical,    approvedDate: "2024-01-03", version: "2.0", downloads: 74  },
  { id: 19, name: "CPD Activity Log Template",                section: "cpd",       status: "approved",  uploadedBy: leadNurse,       date: "2024-01-08", size: "220 KB",  type: "XLSX", approvedBy: groupOwner,        approvedDate: "2024-01-09", version: "3.2", downloads: 52  },
  { id: 20, name: "Reflective Practice Worksheet",            section: "cpd",       status: "pending",   uploadedBy: dentistA,        date: "2024-02-27", size: "380 KB",  type: "DOCX", version: "1.0",  downloads: 0  },
  { id: 21, name: "Enhanced CPD Compliance Checklist",        section: "cpd",       status: "in_review", uploadedBy: dentistB,        date: "2024-02-24", size: "290 KB",  type: "PDF",  reviewer: clinicalLead,        version: "1.5",  downloads: 0  },
];
