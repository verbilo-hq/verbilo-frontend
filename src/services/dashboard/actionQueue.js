/**
 * MyActionQueue library — what each persona needs to act on TODAY.
 *
 * Strict rule: every queue item must be backed by Verbilo-native data
 * sources (CPD Hub, Protocols, Audits, Operational Logs, Training Hub,
 * Supervision Hub, Document Library, HR Hub, Suggestion Box, Lab Hub,
 * Governance packs). PMS-coupled data (appointments, treatment plans,
 * UDAs, claims, call rates) is OUT of scope here.
 *
 * Mock fixture for now — production replaces this with a per-persona
 * provider that aggregates live counts from the underlying modules.
 *
 * Item shape: { id, label, due, severity, ctaLabel, ctaNav }
 *   id       — stable per persona
 *   label    — single-line action description
 *   due      — short due-by string (`'5d'`, `'14d'`, `'today'`)
 *   severity — 'urgent' | 'warning' | 'info' (drives the left rail)
 *   ctaLabel — short button text
 *   ctaNav   — App.jsx page id to navigate to on click
 */

export const ACTION_QUEUE = {
  dentist: [
    { id: "d-act-1", label: "1 CPD reflection due",                                                due: "5d",   severity: "warning", ctaLabel: "Open CPD",       ctaNav: "cpd" },
    { id: "d-act-2", label: "2 protocol acknowledgements outstanding (CORE-01, RAD-01)",           due: "today",severity: "urgent",  ctaLabel: "Read & Sign",    ctaNav: "clinical_protocols" },
    { id: "d-act-3", label: "Radiation Protection mandatory training expiring",                    due: "14d",  severity: "warning", ctaLabel: "Open Training",  ctaNav: "training" },
    { id: "d-act-4", label: "Antimicrobial Audit scheduled — your participation expected",         due: "Next week", severity: "info", ctaLabel: "View Audit",   ctaNav: "audit_evidence" },
    { id: "d-act-5", label: "1 lab case requires your conformity check",                            due: "today",severity: "warning", ctaLabel: "Open Lab Hub",   ctaNav: "lab" },
  ],

  foundation_dentist: [
    { id: "fd-act-1", label: "DOPS observation to schedule — book 2 more by 30 Jun",               due: "30 Jun", severity: "warning", ctaLabel: "Open Supervision", ctaNav: "supervision_hub" },
    { id: "fd-act-2", label: "PDP goal evidence to attach (molar endo case)",                       due: "7d",     severity: "warning", ctaLabel: "Open PDP",         ctaNav: "supervision_hub" },
    { id: "fd-act-3", label: "Audit submission due — Image Quality Q1",                             due: "10d",    severity: "warning", ctaLabel: "Open Audit",       ctaNav: "audit_evidence" },
    { id: "fd-act-4", label: "Reflection due on last supervision case discussion",                  due: "3d",     severity: "warning", ctaLabel: "Open CPD",         ctaNav: "cpd" },
    { id: "fd-act-5", label: "2 protocol acknowledgements outstanding (CORE-01, FD-Induction-3)",   due: "today",  severity: "urgent",  ctaLabel: "Read & Sign",      ctaNav: "clinical_protocols" },
  ],

  hygienist: [
    { id: "h-act-1", label: "CPD reflection due — DCP requirement",                                 due: "7d",   severity: "warning", ctaLabel: "Open CPD",       ctaNav: "cpd" },
    { id: "h-act-2", label: "Direct Access SOP signature outstanding",                              due: "today",severity: "urgent",  ctaLabel: "Read & Sign",    ctaNav: "clinical_protocols" },
    { id: "h-act-3", label: "BLS mandatory training expiring",                                       due: "30d",  severity: "warning", ctaLabel: "Open Training",  ctaNav: "training" },
    { id: "h-act-4", label: "Perio pathway SOP version updated — acknowledge re-read",              due: "14d",  severity: "info",    ctaLabel: "Open Library",   ctaNav: "clinical_protocols" },
    { id: "h-act-5", label: "Hand instrument sharpness audit slot booked",                           due: "tomorrow", severity: "info", ctaLabel: "Open Audit",   ctaNav: "audit_evidence" },
  ],

  nurse: [
    { id: "n-act-1", label: "Today's operational logs due: Autoclave 1, Vaccine Fridge",            due: "today",severity: "urgent",  ctaLabel: "Open Logs",      ctaNav: "logbooks" },
    { id: "n-act-2", label: "CPD reflection due — DCP requirement",                                  due: "7d",   severity: "warning", ctaLabel: "Open CPD",       ctaNav: "cpd" },
    { id: "n-act-3", label: "Weekly IPC audit",                                                      due: "Friday",severity: "warning", ctaLabel: "Open Audit",     ctaNav: "audit_evidence" },
    { id: "n-act-4", label: "HTM 01-05 training certificate renewal",                                due: "60d",  severity: "info",    ctaLabel: "Open Training",  ctaNav: "training" },
    { id: "n-act-5", label: "Decontamination Pathway SOP — acknowledge updated version",            due: "5d",   severity: "warning", ctaLabel: "Read & Sign",    ctaNav: "clinical_protocols" },
  ],

  trainee_nurse: [
    { id: "tn-act-1", label: "Today's operational logs you're assigned: Decon Pathway, Surgery 2",  due: "today",severity: "urgent",  ctaLabel: "Open Logs",         ctaNav: "logbooks" },
    { id: "tn-act-2", label: "Tick today's induction milestone — Decon Pathway briefing",            due: "today",severity: "warning", ctaLabel: "Open Induction",    ctaNav: "supervision_hub" },
    { id: "tn-act-3", label: "Evidence to upload for RoE Module 4",                                  due: "5d",   severity: "warning", ctaLabel: "Open Portfolio",    ctaNav: "supervision_hub" },
    { id: "tn-act-4", label: "Mentor tutorial prep for tomorrow — Nina Nurse Lead",                   due: "1d",   severity: "info",    ctaLabel: "Open Supervision",  ctaNav: "supervision_hub" },
    { id: "tn-act-5", label: "NEBDN reading task — Materials Module 4",                              due: "Sunday",severity: "info",   ctaLabel: "Open Training",     ctaNav: "training" },
  ],

  receptionist: [
    { id: "r-act-1", label: "Safeguarding Adults mandatory training expiring",                       due: "21d",  severity: "warning", ctaLabel: "Open Training",      ctaNav: "training" },
    { id: "r-act-2", label: "GDPR Phone-Script SOP awaiting acknowledgement",                        due: "today",severity: "urgent",  ctaLabel: "Read & Sign",        ctaNav: "clinical_protocols" },
    { id: "r-act-3", label: "1 complaint awaiting log follow-up",                                    due: "3d",   severity: "warning", ctaLabel: "Open Complaints",    ctaNav: "governance" },
    { id: "r-act-4", label: "2 SOPs version-updated — re-read needed",                                due: "7d",   severity: "info",    ctaLabel: "Open Library",       ctaNav: "clinical_protocols" },
    { id: "r-act-5", label: "Anonymous suggestion ready for management review",                       due: "today",severity: "info",    ctaLabel: "Open Suggestions",   ctaNav: "manager" },
  ],

  practice_manager: [
    { id: "pm-act-1", label: "2 leave requests pending approval",                                    due: "today",severity: "urgent",  ctaLabel: "Open Manager Hub",   ctaNav: "manager" },
    { id: "pm-act-2", label: "4 staff outstanding on CORE-01 acknowledgement — nudge required",     due: "3d",   severity: "warning", ctaLabel: "Open Roster",        ctaNav: "manager" },
    { id: "pm-act-3", label: "2 DBS certificates expiring",                                          due: "30d",  severity: "warning", ctaLabel: "Open HR Hub",        ctaNav: "hr" },
    { id: "pm-act-4", label: "Pre-CQC inspection checklist — items overdue",                         due: "45d",  severity: "info",    ctaLabel: "Open CQC Hub",       ctaNav: "cqc" },
    { id: "pm-act-5", label: "1 audit awaiting your sign-off",                                       due: "today",severity: "urgent",  ctaLabel: "Open Audit & Evidence", ctaNav: "audit_evidence" },
  ],

  area_manager: [
    { id: "am-act-1", label: "3 sites below 90% compliance threshold",                               due: "today",severity: "urgent",  ctaLabel: "Open CQC Hub",       ctaNav: "cqc" },
    { id: "am-act-2", label: "2 Practice Manager escalations pending review",                         due: "2d",   severity: "warning", ctaLabel: "Open Manager Hub",   ctaNav: "manager" },
    { id: "am-act-3", label: "Q2 governance report due",                                              due: "14d",  severity: "warning", ctaLabel: "Open Evidence Centre", ctaNav: "audit_evidence" },
    { id: "am-act-4", label: "1 cross-site audit commissioning decision pending",                     due: "5d",   severity: "info",    ctaLabel: "Open Audit Centre",  ctaNav: "audit_evidence" },
    { id: "am-act-5", label: "Cohort PDP review (Supervision Hub)",                                   due: "7d",   severity: "info",    ctaLabel: "Open Supervision",   ctaNav: "supervision_hub" },
  ],

  clinical_director: [
    { id: "cd-act-1", label: "2 clinical audits awaiting your sign-off",                             due: "today",severity: "urgent",  ctaLabel: "Open Audit Centre",  ctaNav: "audit_evidence" },
    { id: "cd-act-2", label: "1 Significant Event Audit (SEA) to investigate",                       due: "48h",  severity: "urgent",  ctaLabel: "Open Governance",    ctaNav: "governance" },
    { id: "cd-act-3", label: "Trainee cohort PDP — 2 goals awaiting sign-off",                       due: "5d",   severity: "warning", ctaLabel: "Open Supervision",   ctaNav: "supervision_hub" },
    { id: "cd-act-4", label: "Protocol update to approve — CORE-03 revision",                        due: "7d",   severity: "warning", ctaLabel: "Open Protocols",     ctaNav: "clinical_protocols" },
    { id: "cd-act-5", label: "Antimicrobial Audit cohort results ready for review",                   due: "3d",   severity: "info",    ctaLabel: "Open Audit Centre",  ctaNav: "audit_evidence" },
  ],
};

export function getActionQueue(personaId) {
  return ACTION_QUEUE[personaId] ?? ACTION_QUEUE.dentist;
}
