import { simulateLatency } from "./delay";
import { putFile, downloadFile, deleteFile, formatSize, inferType } from "./clientFileStore";

const LS_SOPS    = "verbilo.governance.sops_v2";
const LS_MEETINGS = "verbilo.governance.meetings_v2";
const LS_RISKS    = "verbilo.governance.risks_v2";
const LS_ACTIONS  = "verbilo.governance.actions_v2";

const sopsSeed = [
  { id: 1,  category: "infection_control", name: "Decontamination Cycle SOP",            owner: "Dr. Amir Dentist",        version: "4.2", updated: "2026-03-12", status: "current"        },
  { id: 2,  category: "infection_control", name: "Hand Hygiene & PPE SOP",                owner: "Dr. Callum Lead",   version: "3.0", updated: "2026-02-04", status: "current"        },
  { id: 3,  category: "infection_control", name: "Sharps Management & Disposal",          owner: "Dr. Callum Lead",   version: "2.5", updated: "2025-12-01", status: "needs_review"   },
  { id: 4,  category: "clinical",          name: "Local Anaesthesia Administration",      owner: "Dr. Amir Dentist",  version: "5.1", updated: "2026-04-08", status: "current"        },
  { id: 5,  category: "clinical",          name: "Endodontic Irrigation Protocol",        owner: "Dr. Hannah Reed",   version: "3.2", updated: "2026-01-20", status: "current"        },
  { id: 6,  category: "clinical",          name: "Medical Emergency Drug Protocol",       owner: "Dr. Amir Dentist",  version: "6.0", updated: "2026-04-22", status: "current"        },
  { id: 7,  category: "emergency",         name: "Anaphylaxis Response SOP",              owner: "Dr. Callum Lead",   version: "2.0", updated: "2026-04-22", status: "current"        },
  { id: 8,  category: "emergency",         name: "Cardiac Arrest & BLS Procedure",        owner: "Dr. Amir Dentist",  version: "1.4", updated: "2026-03-18", status: "current"        },
  { id: 9,  category: "emergency",         name: "Fire Evacuation Plan",                  owner: "Maya Manager",      version: "2.1", updated: "2025-11-10", status: "needs_review"   },
  { id: 10, category: "patient",           name: "Informed Consent Process",              owner: "Dr. Hannah Reed",   version: "3.0", updated: "2026-02-28", status: "current"        },
  { id: 11, category: "patient",           name: "Safeguarding (Adults & Children)",      owner: "Sophie Bennett",    version: "4.0", updated: "2026-03-30", status: "current"        },
  { id: 12, category: "patient",           name: "Complaints Handling Procedure",         owner: "Maya Manager",      version: "2.3", updated: "2026-01-15", status: "current"        },
  { id: 13, category: "practice",          name: "Cash Handling & Banking",               owner: "Maya Manager",      version: "1.8", updated: "2025-09-05", status: "needs_review"   },
  { id: 14, category: "practice",          name: "Data Protection / GDPR SOP",            owner: "Maya Manager",      version: "3.1", updated: "2026-02-12", status: "current"        },
  { id: 15, category: "practice",          name: "Patient Records & Retention",           owner: "Sophie Bennett",    version: "2.4", updated: "2026-02-18", status: "current"        },
];

const meetingsSeed = [
  { id: 1, title: "Q1 Clinical Governance Meeting",  date: "2026-04-12", chair: "Dr. Amir Dentist", attendees: 9, actionsRaised: 5, minutesAvailable: true },
  { id: 2, title: "Practice Manager Huddle",          date: "2026-05-02", chair: "Maya Manager",     attendees: 4, actionsRaised: 2, minutesAvailable: true },
  { id: 3, title: "Significant Event Review — April", date: "2026-05-08", chair: "Dr. Callum Lead",  attendees: 7, actionsRaised: 3, minutesAvailable: false },
];

const risksSeed = [
  { id: 1, risk: "Autoclave failure during clinical session",      category: "Decontamination", likelihood: "Medium", impact: "High",   mitigation: "Secondary backup autoclave; daily Bowie-Dick test logged.", owner: "Dr. Amir Dentist",        status: "open"        },
  { id: 2, risk: "Patient anaphylaxis — antibiotic prescription",  category: "Clinical",        likelihood: "Low",    impact: "High",   mitigation: "Medical history flagged; emergency drug box weekly check.", owner: "Dr. Amir Dentist", status: "mitigated"   },
  { id: 3, risk: "GDPR breach — patient data exposed",             category: "Information",     likelihood: "Low",    impact: "High",   mitigation: "Quarterly access audit; encrypted backups; staff annual training.", owner: "Maya Manager", status: "mitigated"   },
  { id: 4, risk: "Staff sharps injury",                            category: "Infection Control", likelihood: "Medium", impact: "Medium", mitigation: "Single-handed recapping ban; hepatitis B status verified.",  owner: "Dr. Callum Lead", status: "monitoring"  },
];

const actionsSeed = [
  { id: 1, action: "Refresh BLS for all clinical staff",              owner: "Dr. Amir Dentist", due: "2026-06-30", source: "Q1 Clinical Governance",  status: "in_progress" },
  { id: 2, action: "Update fire evacuation plan — new floor layout",  owner: "Maya Manager",     due: "2026-06-15", source: "Practice Manager Huddle", status: "open"        },
  { id: 3, action: "Re-issue informed consent forms (v3.0)",          owner: "Sophie Bennett",   due: "2026-05-31", source: "Q1 Clinical Governance",  status: "done"        },
  { id: 4, action: "Investigate amoxicillin near-miss (incident #3)", owner: "Dr. Callum Lead",  due: "2026-05-22", source: "SER — April",             status: "in_progress" },
];

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  return fallback;
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

let sopsStore     = loadLS(LS_SOPS,     sopsSeed);
let meetingsStore = loadLS(LS_MEETINGS, meetingsSeed);
let risksStore    = loadLS(LS_RISKS,    risksSeed);
let actionsStore  = loadLS(LS_ACTIONS,  actionsSeed);

export const SOP_CATEGORIES = [
  { id: "infection_control", label: "Infection Control",     color: "#c62828", icon: "shield" },
  { id: "clinical",          label: "Clinical",               color: "#1565c0", icon: "clinical" },
  { id: "emergency",         label: "Emergency",              color: "#f57c00", icon: "alert" },
  { id: "patient",           label: "Patient Care",           color: "#2e7d32", icon: "heart" },
  { id: "practice",          label: "Practice Management",    color: "#6a1b9a", icon: "building" },
];

export const SOP_STATUS = {
  current:       { label: "Current",        color: "var(--success)", icon: "checkcircle" },
  needs_review:  { label: "Needs Review",   color: "var(--warning)", icon: "clock3"      },
  draft:         { label: "Draft",          color: "var(--primary)", icon: "edit"        },
};

export async function listSops() {
  await simulateLatency();
  return [...sopsStore];
}

export async function uploadSop({ file, category, name, owner }) {
  if (!file) throw new Error("uploadSop: missing file");
  const { key } = await putFile("governance", file, { category });
  const id = Math.max(0, ...sopsStore.map((s) => s.id)) + 1;
  const sop = {
    id,
    fileKey: key,
    name: name?.trim() || file.name.replace(/\.[^/.]+$/, ""),
    category,
    owner: owner?.trim() || "You",
    version: "1.0",
    updated: new Date().toISOString().split("T")[0],
    status: "draft",
    size: formatSize(file.size),
    type: inferType(file),
  };
  sopsStore = [sop, ...sopsStore];
  saveLS(LS_SOPS, sopsStore);
  return sop;
}

export async function downloadSop(id) {
  const sop = sopsStore.find((s) => s.id === id);
  if (!sop?.fileKey) return false;
  await downloadFile(sop.fileKey, sop.name);
  return true;
}

export async function deleteSop(id) {
  const sop = sopsStore.find((s) => s.id === id);
  sopsStore = sopsStore.filter((s) => s.id !== id);
  saveLS(LS_SOPS, sopsStore);
  if (sop?.fileKey) {
    try { await deleteFile(sop.fileKey); } catch { /* best effort */ }
  }
}

export async function updateSopStatus(id, status) {
  sopsStore = sopsStore.map((s) => (s.id === id ? { ...s, status } : s));
  saveLS(LS_SOPS, sopsStore);
}

export async function listMeetings() { await simulateLatency(); return [...meetingsStore]; }
export async function listRisks()    { await simulateLatency(); return [...risksStore];    }
export async function listActions()  { await simulateLatency(); return [...actionsStore];  }
