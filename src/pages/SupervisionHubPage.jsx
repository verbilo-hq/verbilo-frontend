/**
 * SupervisionHubPage — Training & Supervision Hub for Dental Group.
 *
 * SESSION A REFACTOR: single source of truth.
 *
 * All previously-duplicated fixtures (Liam's meetings appeared in two
 * arrays, Liam's PDP in two arrays, etc.) collapsed into ONE
 * trainee-keyed store wrapped in a React Context. Every tab now reads
 * the same data and every mutation (sign an audit, log a meeting,
 * modify a restriction, sign off a PDP goal) propagates everywhere
 * the touched data is rendered. No more "switch tabs and the change
 * is lost." No more "Liam's PDP signed off in ES View but his own
 * Learning Plan still shows pending."
 *
 * Naming resolves from the shared roster (services/people.js) + canonical
 * sites (services/sites.js) — no invented names. The two trainees are real
 * roster trainees at the two staffed sites:
 *   • the Foundation Dentist @ Southall, supervised by the Southall
 *     Clinical Lead.
 *   • the Trainee Nurse @ London, mentored by the London Lead Nurse.
 *
 * RBAC: NOT YET WIRED (Session B). All users still see every tab —
 * the gating + restricted state ships in the next slice.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { I } from "../components/Icon";
import { useDevRole } from "../services/devRole";
import { personName } from "../services/people";
import { siteName } from "../services/sites";
import { Avatar } from "../components/ui/Avatar";
import { useModalA11y } from "../hooks/useModalA11y";
import styles from "./SupervisionHubPage.module.css";

/* ────────────────────────────────────────────────────────────────────
 * People + sites resolve from the shared roster (services/people.js) and
 * canonical site model (services/sites.js) — no invented names. The two
 * trainees are real roster trainees at the two staffed sites:
 *   • FOUNDATION DENTIST  → Dr. Leo Marsh (south-fd-1) @ Southall,
 *       educational supervisor = the Southall Clinical Lead (Dr. Callum Lead).
 *   • TRAINEE NURSE       → Ella Brooks (london-nurse-1) @ London,
 *       mentor = the London Lead Nurse (Grace Adeyemi).
 * Supervisors in the sign-off log / personas are roster people too. The
 * store SHAPE every tab reads is unchanged — only the name/site values move
 * onto the roster. */
const FD_TRAINEE   = { id: "liam",  name: personName("south-fd-1"),   site: "site-southall" }; // Dr. Leo Marsh
const NURSE_TRAINEE = { id: "chloe", name: personName("london-nurse-1"), site: "site-london" };  // Ella Brooks

const FD_SUPERVISOR   = personName("clinical-lead");        // Dr. Callum Lead (Southall Clinical Lead)
const NURSE_MENTOR    = personName("london-lead-nurse");    // Grace Adeyemi (London Lead Nurse)
const SECOND_REVIEWER = personName("london-clinical-lead"); // Dr. Marcus Webb (reviewing clinician)
const GROUP_ADMIN     = personName("company-owner");        // Olivia Owner
const GROUP_PM        = personName("manager");              // Maya Manager (Practice Manager)

const ROLES = [
  { id: "liam",  name: FD_TRAINEE.name,    stage: "Foundation Dentist", capability: "educational_supervisor" },
  { id: "chloe", name: NURSE_TRAINEE.name, stage: "Trainee Nurse",       capability: "student_nurse_mentor"  },
  { id: "es",    name: "Educational Supervisor View", stage: null,    capability: "any_supervisor"        },
];

const SUB_TABS = [
  { id: "overview",   label: "Overview" },
  { id: "induction",  label: "Induction Checklist" },
  { id: "competency", label: "Competency Tracker" },
  { id: "meetings",   label: "Supervision Meetings" },
  { id: "evidence",   label: "Evidence Portfolio" },
  { id: "learning",   label: "Learning Plan & PDP" },
];

const COMP_TONE_META = {
  ontrack:    { emoji: "🟢", label: "On Track" },
  complete:   { emoji: "🟢", label: "Complete" },
  review:     { emoji: "🟡", label: "Needs Review" },
  progress:   { emoji: "🟡", label: "In Progress" },
  supervised: { emoji: "🟠", label: "Supervised Only" },
  restricted: { emoji: "🔴", label: "Restricted" },
};

const PDP_STATUS_META = {
  in_progress:  { emoji: "🔵", label: "In Progress" },
  needs_review: { emoji: "🟡", label: "Needs Review" },
  complete:     { emoji: "🟢", label: "Complete" },
  blocked:      { emoji: "🔴", label: "Blocked" },
  signed_off:   { emoji: "🟢", label: "Signed Off" },
};

const ES_PDP_STATUS_META = {
  awaiting_signoff:   { emoji: "🟡", label: "Awaiting Supervisor Sign-off" },
  in_progress:        { emoji: "🟢", label: "In Progress" },
  awaiting_practical: { emoji: "🟡", label: "Awaiting Practical Assessment" },
  signed_off:         { emoji: "🟢", label: "Signed Off" },
  witnessed:          { emoji: "🟢", label: "Witnessed & Authorised" },
  needs_review:       { emoji: "🟡", label: "Needs Review" },
};

/* ════════════════════════════════════════════════════════════════════
 * SUPERVISION_STORE_SEED — the single source of truth
 * ════════════════════════════════════════════════════════════════════ */

const SUPERVISION_STORE_SEED = {
  trainees: {
    liam: {
      id:            "liam",
      name:          FD_TRAINEE.name,
      stage:         "Foundation Dentist",
      year:          "2026/27",
      practice:      `Dental Group — ${siteName(FD_TRAINEE.site)} Practice`,
      site:          siteName(FD_TRAINEE.site),
      supervisorId:  "sarah_patel",
      supervisorName: FD_SUPERVISOR,
      startDate:     "1 Sept 2026",
      profileStatus: "on_track",
      dops:          { logged: 3, required: 5 },
      msf:           { logged: 1, required: 3 },
      mandatoryTraining: { completed: 7, required: 9 },

      induction: [
        { id: "in1",  label: "Practice Orientation",                done: true,  date: "01 Sep", evidence: ["evidence-in1-1.pdf"], stamped: true  },
        { id: "in2",  label: "NHS Claims / Admin Overview",          done: true,  date: "01 Sep", evidence: ["evidence-in2-1.pdf"], stamped: true  },
        { id: "in3",  label: "Software System Training",            done: true,  date: "02 Sep", evidence: ["evidence-in3-1.pdf"], stamped: true  },
        { id: "in4",  label: "Medical Emergencies",                 done: true,  date: "02 Sep", evidence: [],                       stamped: true  },
        { id: "in5",  label: "Safeguarding",                         done: true,  date: "08 Sep", evidence: [],                       stamped: false },
        { id: "in6",  label: "Radiography Workflow",                 done: false, date: null,     evidence: [],                       stamped: false, overdue: true },
        { id: "in7",  label: "Decontamination / IPC",                done: false, date: null,     evidence: [],                       stamped: false },
        { id: "in8",  label: "Referral Process",                     done: true,  date: "10 Sep", evidence: [],                       stamped: false },
        { id: "in9",  label: "Consent & Record Keeping",             done: false, date: null,     evidence: [],                       stamped: false },
        { id: "in10", label: "Complaints & Incident Reporting",      done: true,  date: "12 Sep", evidence: [],                       stamped: false },
        { id: "in11", label: "Escalation Pathways",                  done: false, date: null,     evidence: [],                       stamped: false },
      ],

      safetyGates: [
        {
          ref:         "PROS-04",
          title:       "Molar Endodontics & Crowns",
          status:      "chaperone",
          restriction: "Chaperone Mandate Active",
          detail:      "Supervisor must be physically present in the surgery for the duration of any molar endodontic or crown preparation procedure carried out by the trainee. Required until competency milestone DOPS-04 is signed off.",
          signOffLog:  [
            { date: "12 May 2026", supervisor: FD_SUPERVISOR,    action: "Restriction added — flagged after Q1 case review" },
            { date: "18 May 2026", supervisor: SECOND_REVIEWER, action: "Reviewed — restriction maintained pending DOPS-04" },
          ],
        },
        {
          ref:         "RAD-03",
          title:       "Radiograph Justification (IR(ME)R 2017)",
          status:      "unrestricted",
          restriction: null,
          detail:      "Trainee may justify, request, and act on dental radiographs unsupervised under IR(ME)R Employer's Procedures. Periodic image-quality review remains mandatory.",
          signOffLog:  [
            { date: "04 May 2026", supervisor: FD_SUPERVISOR,    action: "Authorised — IR(ME)R Operator status confirmed" },
          ],
        },
      ],

      competencyAreas: [
        { id: "c1", area: "Diagnosis & Treatment Planning",   signed: 4, total: 5, tone: "ontrack",    lastDate: "20 May 2026" },
        { id: "c2", area: "Restorative Dentistry — Direct",   signed: 3, total: 4, tone: "review",     lastDate: "14 May 2026" },
        { id: "c3", area: "Endodontics",                       signed: 2, total: 4, tone: "supervised", lastDate: "08 May 2026" },
        { id: "c4", area: "Extractions",                       signed: 1, total: 4, tone: "restricted", lastDate: "02 May 2026" },
        { id: "c5", area: "Periodontal Care",                  signed: 3, total: 4, tone: "ontrack",    lastDate: "18 May 2026" },
        { id: "c6", area: "Medical Emergencies",               signed: 1, total: 1, tone: "complete",   lastDate: "11 Apr 2026" },
      ],

      meetings: [
        { id: "m1", date: "15 May 2026", type: "Monthly Review",    duration: "45 min", actions: "Review Q1 audit feedback; agree DOPS-4 chairside observation date",                       comments: "Strong reflective approach. Continue documenting case complexity." },
        { id: "m2", date: "30 Apr 2026", type: "Case Discussion",   duration: "30 min", actions: "Discussed molar endo case #4521; chaperone mandate maintained pending DOPS-4 sign-off",  comments: "Awareness of own limitations is appropriate. Escalation handled well." },
        { id: "m3", date: "10 Apr 2026", type: "Monthly Review",    duration: "45 min", actions: "Set Q2 development objectives; book MSF feedback panel",                                 comments: "On track for term-end portfolio submission." },
        { id: "m4", date: "20 Mar 2026", type: "Initial Term Plan", duration: "60 min", actions: "Establish supervision cadence; agree induction completion deadline of 30 Sept",          comments: `Engaged, well-prepared. Welcome to the Dental Group ${siteName(FD_TRAINEE.site)} team.` },
      ],

      audits: [
        { id: "audit-1", title: "An Audit on Digital Radiographic Image Quality (Q1)", submittedDate: "20 May 2026", status: "awaiting", signedBy: null, signedDate: null },
      ],

      portfolio: [
        {
          id: "lp-folder-1", label: "Clinical Case Reflections", accent: "#1565c0",
          files: [
            { id: "f1", name: "Molar Access Reflection",             kind: "PDF",  size: "1.2 MB", uploadedAt: "22 May 2026", verifiedBy: FD_SUPERVISOR },
            { id: "f2", name: "Premolar Composite Layering Analysis", kind: "DOCX", size: "640 KB", uploadedAt: "15 May 2026", verifiedBy: FD_SUPERVISOR },
            { id: "f3", name: "Case #4521 — Pulpitis Differential",   kind: "PDF",  size: "880 KB", uploadedAt: "08 May 2026", verifiedBy: null              },
          ],
        },
        {
          id: "lp-folder-2", label: "Regulatory Certificates & Compliance", accent: "#6a1b9a",
          files: [
            { id: "f4", name: "Verifiable CPD Log Q1 2026",            kind: "PDF", size: "320 KB", uploadedAt: "01 May 2026", verifiedBy: FD_SUPERVISOR },
            { id: "f5", name: "Core Radiation Protection Update Cert", kind: "PDF", size: "210 KB", uploadedAt: "12 Apr 2026", verifiedBy: FD_SUPERVISOR },
            { id: "f6", name: "Safeguarding Level 2 Certificate",      kind: "PDF", size: "280 KB", uploadedAt: "02 Apr 2026", verifiedBy: FD_SUPERVISOR },
          ],
        },
        {
          id: "lp-folder-3", label: "Observed Audits & Procedures", accent: "#00838f",
          files: [
            { id: "f7", name: "Digital Radiographic Quality Audit (Q1)", kind: "PDF", size: "1.4 MB", uploadedAt: "20 May 2026", verifiedBy: null              },
            { id: "f8", name: "Clinical Photography Sampling",            kind: "ZIP", size: "8.2 MB", uploadedAt: "10 May 2026", verifiedBy: FD_SUPERVISOR },
          ],
        },
        {
          id: "lp-folder-4", label: "Stakeholder Feedback Loops", accent: "#ef6c00",
          files: [
            { id: "f9",  name: "Multi-Source Feedback Form — Peer 1", kind: "PDF",  size: "180 KB", uploadedAt: "05 May 2026", verifiedBy: FD_SUPERVISOR },
            { id: "f10", name: "Patient Satisfaction Survey (April)", kind: "XLSX", size: "92 KB",  uploadedAt: "30 Apr 2026", verifiedBy: FD_SUPERVISOR },
          ],
        },
      ],

      pdpGoals: [
        {
          id: "pdp-1", goal: "Improve molar endodontic access and instrumentation confidence.",
          goalShort: "molar endo access", evidence: "2 cases, 1 written reflection", due: "14 Jun 2026",
          feedback: "Showing strong operational improvement in canal identification; continue on-site chaperone validation.",
          status: "in_progress", esStatus: "awaiting_signoff", esDetail: "2 cases · 1 reflection attached",
        },
        {
          id: "pdp-2", goal: "Strengthen consistency of radiograph justification entries in baseline charting.",
          goalShort: "radiograph justification", evidence: "Audit Sample (Q1)", due: "30 Jun 2026",
          feedback: "Requires closer adherence to FGDP template standards.",
          status: "needs_review", esStatus: "in_progress", esDetail: "Audit sample under review",
        },
      ],

      upcomingEvents: [
        { id: "u1", type: "Supervisor Meeting", when: "In 2 days",  date: "Friday, 29 May 2026" },
        { id: "u2", type: "Deanery Review",     when: "In 7 weeks", date: "12 July 2026" },
        { id: "u3", type: "PDP Review",         when: "In 5 weeks", date: "30 June 2026" },
      ],
    },

    chloe: {
      id:            "chloe",
      name:          NURSE_TRAINEE.name,
      stage:         "Trainee Nurse",
      year:          "NEBDN Year 1 — 2026/27",
      practice:      `Dental Group — ${siteName(NURSE_TRAINEE.site)} Practice`,
      site:          siteName(NURSE_TRAINEE.site),
      supervisorId:  "maria_lopez",
      supervisorName:NURSE_MENTOR,
      startDate:     "1 Sept 2026",
      profileStatus: "on_track",
      dops:          { logged: 8, required: 12 },
      msf:           { logged: 0, required: 2 },
      mandatoryTraining: { completed: 5, required: 8 },

      induction: [
        { id: "cn1",  label: "Chairside Basics",            done: true,  date: "01 Sep", evidence: ["evidence-cn1-1.pdf"], stamped: true  },
        { id: "cn2",  label: "Instrument Recognition",       done: true,  date: "02 Sep", evidence: ["evidence-cn2-1.pdf"], stamped: true  },
        { id: "cn3",  label: "Decontamination Pathway",      done: true,  date: "03 Sep", evidence: ["evidence-cn3-1.pdf"], stamped: true  },
        { id: "cn4",  label: "Stock & Surgery Setup",        done: true,  date: "05 Sep", evidence: ["evidence-cn4-1.pdf"], stamped: true  },
        { id: "cn5",  label: "Medical Emergencies",          done: true,  date: "08 Sep", evidence: [],                       stamped: true  },
        { id: "cn6",  label: "Safeguarding",                  done: true,  date: "10 Sep", evidence: [],                       stamped: false },
        { id: "cn7",  label: "Confidentiality / GDPR",       done: false, date: null,     evidence: [],                       stamped: false },
        { id: "cn8",  label: "Radiography Awareness",        done: false, date: null,     evidence: [],                       stamped: false },
        { id: "cn9",  label: "Lab Work Process",              done: false, date: null,     evidence: [],                       stamped: false },
        { id: "cn10", label: "Clinical Note Support",        done: false, date: null,     evidence: [],                       stamped: false },
        { id: "cn11", label: "Infection Prevention",          done: false, date: null,     evidence: [],                       stamped: false },
      ],

      safetyGates: [
        {
          ref:         "DCP-MAT",
          title:       "Dental Materials Composition & Mixing",
          status:      "chaperone",
          restriction: "Mentor Validation Required",
          detail:      "Trainee may prepare materials only with the assisting mentor confirming chemical ratios pre-mix. Lifts once practical competency is witnessed and signed off.",
          signOffLog:  [
            { date: "08 May 2026", supervisor: NURSE_MENTOR, action: "Restriction added — pending NEBDN Module 4 completion" },
          ],
        },
        {
          ref:         "DCP-ASP",
          title:       "High-Volume Aspiration & Moisture Control",
          status:      "unrestricted",
          restriction: null,
          detail:      "Trainee authorised for unsupervised aspiration support on all standard restorative and surgical procedures.",
          signOffLog:  [
            { date: "12 May 2026", supervisor: NURSE_MENTOR, action: "Authorised — direct observation passed" },
          ],
        },
      ],

      competencyAreas: [
        { id: "cct1", area: "Surgery Setup",         signed: 5,  total: 5,  tone: "complete",  lastDate: "22 May 2026" },
        { id: "cct2", area: "Decontamination",       signed: 4,  total: 5,  tone: "ontrack",   lastDate: "21 May 2026" },
        { id: "cct3", area: "Chairside Assisting",   signed: 6,  total: 10, tone: "progress",  lastDate: "19 May 2026" },
        { id: "cct4", area: "Instrument Handling",   signed: 8,  total: 10, tone: "progress",  lastDate: "18 May 2026" },
        { id: "cct5", area: "Infection Control",     signed: 3,  total: 3,  tone: "complete",  lastDate: "10 May 2026" },
        { id: "cct6", area: "Patient Communication", signed: 2,  total: 5,  tone: "review",    lastDate: "06 May 2026" },
      ],

      meetings: [
        { id: "cm1", date: "20 May 2026", type: "Weekly Tutorial",   duration: "30 min", actions: "Worked through decontamination cycle scoring; reviewed dipslide procedure", comments: "Confidence growing on independent decon room duties." },
        { id: "cm2", date: "13 May 2026", type: "Skills Sign-off",    duration: "20 min", actions: "DOPS sign-off — high-volume aspiration on direct restoration",              comments: "Smooth assisting; ready to support indirect prep cases." },
        { id: "cm3", date: "06 May 2026", type: "Weekly Tutorial",   duration: "30 min", actions: "Reviewed instrument set lists for surgical extractions",                    comments: "Eager learner — recommend shadow session with oral surgeon." },
        { id: "cm4", date: "22 Apr 2026", type: "Pastoral Check-in", duration: "25 min", actions: "Discussed workload + coursework balance; signposted NEBDN study group",      comments: "Wellbeing positive. Will follow up on study-leave request." },
      ],

      audits: [],

      portfolio: [
        {
          id: "cp-folder-1", label: "Clinical Case Reflections", accent: "#1565c0",
          files: [
            { id: "cf1", name: "RoE Reflection — High-Volume Aspiration", kind: "PDF",  size: "740 KB", uploadedAt: "21 May 2026", verifiedBy: NURSE_MENTOR },
            { id: "cf2", name: "Daily Reflective Log — Week 18",            kind: "DOCX", size: "210 KB", uploadedAt: "10 May 2026", verifiedBy: NURSE_MENTOR },
          ],
        },
        {
          id: "cp-folder-2", label: "Regulatory Certificates & Compliance", accent: "#6a1b9a",
          files: [
            { id: "cf3", name: "NEBDN Decontamination Module Cert", kind: "PDF", size: "240 KB", uploadedAt: "12 May 2026", verifiedBy: NURSE_MENTOR },
            { id: "cf4", name: "Hand Hygiene Refresher Certificate", kind: "PDF", size: "190 KB", uploadedAt: "01 May 2026", verifiedBy: NURSE_MENTOR },
          ],
        },
        {
          id: "cp-folder-3", label: "Observed Audits & Procedures", accent: "#00838f",
          files: [
            { id: "cf5", name: "Tutor-Witnessed Decon Cycle Log",    kind: "PDF", size: "320 KB", uploadedAt: "18 May 2026", verifiedBy: NURSE_MENTOR },
            { id: "cf6", name: "Aspiration Technique Observation",   kind: "PDF", size: "420 KB", uploadedAt: "09 May 2026", verifiedBy: null           },
          ],
        },
        {
          id: "cp-folder-4", label: "Stakeholder Feedback Loops", accent: "#ef6c00",
          files: [
            { id: "cf7", name: "Mentor Feedback Form — Q1", kind: "PDF",  size: "160 KB", uploadedAt: "30 Apr 2026", verifiedBy: NURSE_MENTOR },
            { id: "cf8", name: "Patient Comfort Survey",    kind: "XLSX", size: "78 KB",  uploadedAt: "22 Apr 2026", verifiedBy: NURSE_MENTOR },
          ],
        },
      ],

      pdpGoals: [
        {
          id: "cpdp-1", goal: "Master dental materials composition, chemical ratios, and hands-on mixing techniques.",
          goalShort: "materials mixing", evidence: "2 mentor observations, RoE Module 4 log", due: "05 Jun 2026",
          feedback: "Strong theoretical grasp — ready for practical assessment to lift the chaperone restriction.",
          status: "in_progress", esStatus: "awaiting_practical", esDetail: "Requires on-site clinical witness stamp",
        },
        {
          id: "cpdp-2", goal: "Develop chairside patient-communication scripts for nervous patients.",
          goalShort: "patient comms", evidence: "2 role-play observations", due: "10 Jul 2026",
          feedback: "Tone is warm; refine the consent-confirmation closing line per practice script.",
          status: "needs_review", esStatus: "needs_review", esDetail: "Awaiting next observation cycle",
        },
      ],

      upcomingEvents: [
        { id: "cu1", type: "Mentor Tutorial",   when: "In 3 days",  date: "Saturday, 30 May 2026" },
        { id: "cu2", type: "NEBDN Submission",  when: "In 9 weeks", date: "26 July 2026" },
        { id: "cu3", type: "Practical Witness", when: "In 11 days", date: "5 June 2026" },
      ],
    },
  },

  supervisors: {
    sarah_patel: { id: "sarah_patel", name: FD_SUPERVISOR, role: "Educational Supervisor",            caseload: ["liam"]  },
    maria_lopez: { id: "maria_lopez", name: NURSE_MENTOR,    role: "Student Nurse Mentor (Lead Nurse)", caseload: ["chloe"] },
  },
};

/* ════════════════════════════════════════════════════════════════════
 * RBAC — persona map per dev role
 *
 * Each dev role lands the user "as" a real Dental Group persona with a
 * specific set of supervision capabilities. The pills the user sees
 * + the actions they can perform are driven entirely from here.
 *
 *   canSee         which role-pill ids are visible in the tab bar
 *                  (subset of: "liam" · "chloe" · "es")
 *   esMode         "active"   → can sign off PDP rows + witness comps
 *                  "readonly" → can browse the cohort but no actions
 *                  "none"     → no ES View access at all
 *   selfTraineeId  when the user IS the trainee (Liam viewing his own
 *                  record); future hook for the badge "Your Profile"
 *
 * Production swap:
 *   const persona = await api.get("/api/me/supervision-context");
 *   // returns { name, title, canSee, esMode, selfTraineeId, blurb }
 *   //   driven by `cognito:groups` + the supervision caseload table. */

const PERSONA_BY_DEV_ROLE = {
  group_admin: {
    name:           GROUP_ADMIN,
    title:          "Group Admin",
    canSee:         ["liam", "chloe", "es"],
    cohortAccess:   ["liam", "chloe"],
    esMode:         "active",
    isPrivileged:   true,
    selfTraineeId:  null,
    blurb:          "Full visibility across the Dental Group training cohort.",
  },
  clinical_director: {
    name:           FD_SUPERVISOR,
    title:          "Clinical Director — Educational Supervisor",
    canSee:         ["liam", "es"],
    cohortAccess:   ["liam"],
    esMode:         "active",
    isPrivileged:   true,
    selfTraineeId:  null,
    blurb:          `Educational supervisor of record for ${FD_TRAINEE.name} (${siteName(FD_TRAINEE.site)}).`,
  },
  governance_lead: {
    name:           NURSE_MENTOR,
    title:          "Lead Nurse — Student Nurse Mentor",
    canSee:         ["chloe", "es"],
    cohortAccess:   ["chloe"],
    esMode:         "active",
    isPrivileged:   true,
    selfTraineeId:  null,
    blurb:          `Mentor of record for ${NURSE_TRAINEE.name} (${siteName(NURSE_TRAINEE.site)}).`,
  },
  practice_manager: {
    name:           GROUP_PM,
    title:          "Group Practice Manager",
    canSee:         ["es"],
    /* PM sees the WHOLE cohort in the ES view — org-wide oversight —
     * but without sign-off authority. The esMode === "readonly" gate
     * collapses every action button into a "View only" pill. */
    cohortAccess:   ["liam", "chloe"],
    esMode:         "readonly",
    isPrivileged:   false,
    selfTraineeId:  null,
    blurb:          "Cohort oversight (read-only). Clinical sign-off authority sits with each supervisor.",
  },
  staff: {
    name:           FD_TRAINEE.name,
    title:          "Foundation Dentist — Trainee",
    canSee:         ["liam"],
    cohortAccess:   [],
    esMode:         "none",
    /* Trainees can edit their OWN data (tick induction, upload
     * evidence) but cannot perform supervisor sign-off on themselves.
     * Per-action gates combine `isPrivileged` with `selfTraineeId`. */
    isPrivileged:   false,
    selfTraineeId:  "liam",
    blurb:          "Viewing your own training record.",
  },
};

const DEFAULT_PERSONA = {
  name: "Unknown user", title: "—",
  canSee: [], cohortAccess: [], esMode: "none",
  isPrivileged: false, selfTraineeId: null,
  blurb: "No supervision context resolved for this role.",
};

function personaFor(devRole) {
  return PERSONA_BY_DEV_ROLE[devRole] ?? DEFAULT_PERSONA;
}

/* ════════════════════════════════════════════════════════════════════
 * Context + mutators + provider
 * ════════════════════════════════════════════════════════════════════ */

const SupervisionContext = createContext(null);

function useSupervisor(traineeId) {
  const ctx = useContext(SupervisionContext);
  if (!ctx) throw new Error("useSupervisor must be used within SupervisionProvider");
  return { trainee: ctx.store.trainees[traineeId], mutators: ctx.mutators, store: ctx.store };
}

function useSupervisionStore() {
  const ctx = useContext(SupervisionContext);
  if (!ctx) throw new Error("useSupervisionStore must be used within SupervisionProvider");
  return ctx;
}

function SupervisionProvider({ children }) {
  const [store, setStore] = useState(SUPERVISION_STORE_SEED);
  /* Persona resolves from the dev-role switcher (production: JWT claim).
   * Exposed via context so every tab can gate actions without prop
   * drilling — granular RBAC + ES cohort scoping read this same value. */
  const [devRole] = useDevRole();
  const persona = useMemo(() => personaFor(devRole), [devRole]);

  const updateTrainee = (traineeId, patch) => {
    setStore((prev) => ({
      ...prev,
      trainees: {
        ...prev.trainees,
        [traineeId]: {
          ...prev.trainees[traineeId],
          ...(typeof patch === "function" ? patch(prev.trainees[traineeId]) : patch),
        },
      },
    }));
  };

  const mutators = useMemo(() => ({
    modifyGateRestriction: (traineeId, ref, supervisorName) => {
      updateTrainee(traineeId, (t) => {
        const cycle = { chaperone: "unrestricted", unrestricted: "blocked", blocked: "chaperone" };
        return {
          safetyGates: t.safetyGates.map((g) => {
            if (g.ref !== ref) return g;
            const next = cycle[g.status];
            return {
              ...g,
              status: next,
              restriction:
                next === "unrestricted" ? null :
                next === "blocked"      ? "Treatment Blocked — Trainee Cannot Perform" :
                                          (t.id === "chloe" ? "Mentor Validation Required" : "Chaperone Mandate Active"),
              signOffLog: [
                {
                  date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                  supervisor: supervisorName || "You",
                  action: `Restriction modified → ${next}`,
                },
                ...g.signOffLog,
              ],
            };
          }),
        };
      });
    },

    signAudit: (traineeId, auditId, supervisorName) => {
      updateTrainee(traineeId, (t) => ({
        audits: t.audits.map((a) => a.id !== auditId ? a : {
          ...a,
          status:     "signed",
          signedBy:   supervisorName || "You",
          signedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        }),
      }));
    },

    logMeeting: (traineeId, meeting) => {
      updateTrainee(traineeId, (t) => ({
        meetings: [
          { id: `m-${Date.now()}`, duration: "20 min", actions: "", comments: "", ...meeting },
          ...t.meetings,
        ],
      }));
    },

    toggleInductionDone: (traineeId, itemId) => {
      updateTrainee(traineeId, (t) => ({
        induction: t.induction.map((r) => r.id === itemId ? { ...r, done: !r.done } : r),
      }));
    },
    toggleInductionStamp: (traineeId, itemId) => {
      updateTrainee(traineeId, (t) => ({
        induction: t.induction.map((r) => r.id === itemId ? { ...r, stamped: !r.stamped } : r),
      }));
    },
    addInductionEvidence: (traineeId, itemId, filename) => {
      updateTrainee(traineeId, (t) => ({
        induction: t.induction.map((r) => r.id === itemId
          ? { ...r, evidence: [...(r.evidence ?? []), filename] }
          : r,
        ),
      }));
    },

    signOffPdpGoal: (traineeId, goalId, supervisorName) => {
      updateTrainee(traineeId, (t) => ({
        pdpGoals: t.pdpGoals.map((g) => g.id !== goalId ? g : {
          ...g,
          status:    "signed_off",
          esStatus:  "signed_off",
          feedback: `${g.feedback} Signed off by ${supervisorName || "You"} on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.`,
        }),
      }));
    },
    witnessPdpGoal: (traineeId, goalId, supervisorName) => {
      updateTrainee(traineeId, (t) => ({
        pdpGoals: t.pdpGoals.map((g) => g.id !== goalId ? g : {
          ...g,
          status:    "complete",
          esStatus:  "witnessed",
          feedback: `${g.feedback} Practical witnessed by ${supervisorName || "You"} on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}.`,
        }),
      }));
    },
  }), []);

  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const value = useMemo(() => ({
    store, updateTrainee, mutators, toast, setToast,
    persona, devRole,
  }), [store, mutators, toast, persona, devRole]);

  return (
    <SupervisionContext.Provider value={value}>
      {children}
      {toast && (
        <div className={styles.toast} role="status">
          <I name="checkcircle" size={14} color="currentColor" />
          {toast}
        </div>
      )}
    </SupervisionContext.Provider>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * Derived helpers
 * ════════════════════════════════════════════════════════════════════ */

function deriveTraineeMetrics(t) {
  const inductionDone     = t.induction.filter((i) => i.done).length;
  const competencySigned  = t.competencyAreas.reduce((n, c) => n + c.signed, 0);
  const competencyTotal   = t.competencyAreas.reduce((n, c) => n + c.total,  0);
  const openConcerns      = t.safetyGates.filter((g) => g.status !== "unrestricted").length;
  return [
    { id: "induction",  label: "Induction Progress",   value: `${Math.round((inductionDone / t.induction.length) * 100)}%`, sub: `${inductionDone} / ${t.induction.length} completed`, barPct: Math.round((inductionDone / t.induction.length) * 100), tone: "teal"   },
    { id: "mandatory",  label: "Mandatory Training",   value: `${t.mandatoryTraining.completed} / ${t.mandatoryTraining.required}`, sub: "Courses completed",    barPct: Math.round((t.mandatoryTraining.completed / t.mandatoryTraining.required) * 100), tone: "blue"   },
    { id: "competency", label: "Competency Sign-offs", value: `${competencySigned} / ${competencyTotal}`, sub: "Completed",            barPct: Math.round((competencySigned / competencyTotal) * 100), tone: "purple" },
    { id: "meetings",   label: "Supervisor Meetings",  value: `${t.meetings.length} / 8`,            sub: "Meetings logged",     barPct: Math.min(100, Math.round((t.meetings.length / 8) * 100)), tone: "green"  },
    { id: "concerns",   label: "Open Concerns",        value: String(openConcerns),                  sub: openConcerns > 0 ? "Requires attention" : "All clear", isAlert: openConcerns > 0,  tone: openConcerns > 0 ? "red" : "green" },
  ];
}

function deriveEsCohort(store, cohortAccess = null) {
  const out = [];
  for (const t of Object.values(store.trainees)) {
    /* Cohort scoping — caller passes the persona's cohortAccess list
     * and we filter out trainees the persona has no business seeing.
     * `null` means "no filter" (legacy callers / tests). */
    if (cohortAccess && !cohortAccess.includes(t.id)) continue;
    for (const g of t.pdpGoals) {
      out.push({
        rowKey: `${t.id}-${g.id}`,
        traineeId: t.id,
        trainee:   t.name,
        stage:     t.stage === "Foundation Dentist" ? "FD" : t.stage.toUpperCase(),
        goal:      g.goal,
        goalShort: g.goalShort,
        due:       g.due,
        status:    g.esStatus,
        detail:    g.esDetail,
        goalId:    g.id,
      });
    }
  }
  return out;
}

/* ════════════════════════════════════════════════════════════════════
 * Root page
 * ════════════════════════════════════════════════════════════════════ */

export function SupervisionHubPage({ onNav }) {
  return (
    <SupervisionProvider>
      <SupervisionHubBody onNav={onNav} />
    </SupervisionProvider>
  );
}

function SupervisionHubBody({ onNav }) {
  /* Persona now lives on the context — single source for the page. */
  const { persona, setToast } = useSupervisionStore();

  /* Filter the role bar to ONLY what the persona is allowed to see. */
  const visibleRoles = useMemo(
    () => ROLES.filter((r) => persona.canSee.includes(r.id)),
    [persona],
  );

  /* Initial activeRole = first allowed for this persona. Falls back to
   * "liam" so the dev-role switcher behaves predictably during demos. */
  const [activeRole, setActiveRole] = useState(
    () => visibleRoles[0]?.id ?? "liam",
  );
  const [activeSubTab, setActiveSubTab] = useState("overview");

  /* Auto-correct if the active role becomes restricted mid-session
   * (e.g. user switches dev role from clinical_director → practice_manager
   * while viewing Liam — PM doesn't have Liam access, so we drop them
   * into the ES View instead and explain why via a toast). */
  useEffect(() => {
    const allowed = persona.canSee.includes(activeRole);
    if (!allowed && visibleRoles.length > 0) {
      const fallback = visibleRoles[0].id;
      setActiveRole(fallback);
      const blockedRoleName = ROLES.find((r) => r.id === activeRole)?.name ?? activeRole;
      setToast(`Switched view — your role doesn't grant access to ${blockedRoleName}.`);
    }
  }, [persona, activeRole, visibleRoles, setToast]);

  /* Zero-access render — persona has no supervision permissions at
   * all. Today no Dental Group devRole lands here (every role gets at
   * least one pill); kept as a defence-in-depth screen for future
   * read-only / suspended roles. */
  if (visibleRoles.length === 0) {
    return (
      <div className={styles.page}>
        <PageHeader persona={persona} />
        <NoAccessPanel persona={persona} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader persona={persona} />

      <nav className={styles.roleBar} role="tablist" aria-label="Trainees and supervisor view">
        {visibleRoles.map((r) => {
          const isActive = r.id === activeRole;
          return (
            <button
              key={r.id} type="button" role="tab" aria-selected={isActive}
              className={`${styles.rolePill} ${isActive ? styles.rolePillActive : ""}`}
              onClick={() => setActiveRole(r.id)}
            >
              <span className={styles.rolePillName}>{r.name}</span>
              {r.stage && <span className={styles.rolePillStage}>({r.stage})</span>}
            </button>
          );
        })}
        {/* Show locked count if any roles are gated off — gives the user
         * visibility that the restriction is real, not a bug. */}
        {ROLES.length > visibleRoles.length && (
          <span className={styles.roleLockedHint} title="Roles outside your remit are hidden">
            <span aria-hidden="true">🔒</span>
            {ROLES.length - visibleRoles.length} role{ROLES.length - visibleRoles.length === 1 ? "" : "s"} restricted
          </span>
        )}
      </nav>

      <nav className={styles.subTabBar} role="tablist" aria-label="Workspace sections">
        {SUB_TABS.map((t) => {
          const isActive = t.id === activeSubTab;
          return (
            <button
              key={t.id} type="button" role="tab" aria-selected={isActive}
              className={`${styles.subTab} ${isActive ? styles.subTabActive : ""}`}
              onClick={() => setActiveSubTab(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Render the workspace OR a RestrictedPanel if (somehow) the
       * activeRole has drifted out of the persona's allowlist before
       * the auto-correct effect fires. */}
      {!persona.canSee.includes(activeRole) ? (
        <RestrictedPanel
          requested={ROLES.find((r) => r.id === activeRole)?.name ?? activeRole}
          persona={persona}
        />
      ) : (
        <>
          {activeRole === "liam"  && <TraineeWorkspace traineeId="liam"  subTab={activeSubTab} onNav={onNav} />}
          {activeRole === "chloe" && <TraineeWorkspace traineeId="chloe" subTab={activeSubTab} onNav={onNav} />}
          {activeRole === "es"    && <ESWorkspace subTab={activeSubTab} esMode={persona.esMode} />}
        </>
      )}
    </div>
  );
}

/* ─── Header (now shared between zero-access + main render) ──────── */

function PageHeader({ persona }) {
  return (
    <>
      <header className={styles.pageHead}>
        <div className={styles.pageHeadMain}>
          {/* Title matches the sidebar nav label ("Supervision Hub") so users
              land where they think they clicked; Training Hub is a separate
              destination and the old combined name blurred the two. */}
          <h1 className={styles.pageTitle}>Supervision Hub</h1>
          <p className={styles.pageSub}>
            Manage educational pathways, clinical safety gates, and national portfolio
            verifications across the Dental Group network.
          </p>
        </div>
      </header>
      <PersonaBanner persona={persona} />
    </>
  );
}

/* Full-width persona banner — sits between the page title and the
 * role-pills nav. Makes the RBAC wiring impossible to miss during a
 * demo: every persona switch updates name + title + caseload count.
 * Hover the dev-role chip in the sidebar to swap personas. */
function PersonaBanner({ persona }) {
  /* Caseload summary — what the persona is allowed to manage today. */
  const traineeIds = persona.cohortAccess ?? [];
  const traineeLabel = (() => {
    if (traineeIds.length === 0 && persona.selfTraineeId) {
      return "Your own training record";
    }
    if (traineeIds.length === 0) return "No trainees assigned";
    const names = traineeIds.map((id) => id === "liam" ? FD_TRAINEE.name : id === "chloe" ? NURSE_TRAINEE.name : id);
    return `${traineeIds.length} trainee${traineeIds.length === 1 ? "" : "s"} · ${names.join(", ")}`;
  })();

  const modeChip = persona.esMode === "active"   ? { label: "ES sign-off active",  tone: "good"    }
                :  persona.esMode === "readonly" ? { label: "ES view-only",         tone: "neutral" }
                :  persona.isPrivileged          ? { label: "Sign-off enabled",     tone: "good"    }
                :                                  { label: "Trainee view",         tone: "muted"   };

  return (
    <section className={styles.personaBanner} aria-label="Currently viewing as">
      <Avatar name={persona.name} size={44} />
      <div className={styles.personaBannerMain}>
        <div className={styles.personaBannerEyebrow}>Logged in as</div>
        <div className={styles.personaBannerName}>{persona.name}</div>
        <div className={styles.personaBannerTitle}>{persona.title}</div>
      </div>
      <div className={styles.personaBannerMeta}>
        <div className={styles.personaBannerMetaRow}>
          <span className={styles.personaBannerMetaLabel}>Caseload</span>
          <span className={styles.personaBannerMetaValue}>{traineeLabel}</span>
        </div>
        <div className={styles.personaBannerMetaRow}>
          <span className={styles.personaBannerMetaLabel}>Mode</span>
          <span className={`${styles.personaBannerModeChip} ${styles[`personaBannerModeChip_${modeChip.tone}`]}`}>
            {modeChip.label}
          </span>
        </div>
      </div>
      <div className={styles.personaBannerHint} title="Use the dev-role switcher chip at the bottom of the sidebar to swap personas">
        💡 Switch persona via the dev-role chip in the sidebar
      </div>
    </section>
  );
}

function NoAccessPanel({ persona }) {
  return (
    <div className={styles.noAccess}>
      <div className={styles.noAccessIcon} aria-hidden="true">🔒</div>
      <h2 className={styles.noAccessTitle}>Restricted</h2>
      <p className={styles.noAccessLead}>
        Your account ({persona.name} — {persona.title}) does not currently hold
        any supervision capabilities. The Training &amp; Supervision Hub is
        reserved for:
      </p>
      <ul className={styles.noAccessList}>
        <li>Educational Supervisors (overseeing Foundation Dentists)</li>
        <li>Student Nurse Mentors (overseeing trainee dental nurses)</li>
        <li>Trainees themselves (viewing their own training record)</li>
        <li>Practice Managers + Directors (read-only cohort oversight)</li>
      </ul>
      <p className={styles.noAccessFoot}>
        If you believe this is an error, contact your Practice Manager
        or the Group Admin.
      </p>
    </div>
  );
}

function RestrictedPanel({ requested, persona }) {
  return (
    <div className={styles.restricted}>
      <div className={styles.restrictedIcon} aria-hidden="true">🔒</div>
      <h3 className={styles.restrictedTitle}>Access restricted</h3>
      <p className={styles.restrictedText}>
        You don&apos;t have permission to view <strong>{requested}</strong>.
        Your role (<strong>{persona.title}</strong>) is scoped to
        {persona.canSee.length > 0
          ? <> the {persona.canSee.length} view{persona.canSee.length === 1 ? "" : "s"} above.</>
          : <> no supervision data.</>}
      </p>
      <p className={styles.restrictedFoot}>
        If you need access — for example because your supervision caseload changed —
        contact your Practice Manager or the Group Admin.
      </p>
    </div>
  );
}

function TraineeWorkspace({ traineeId, subTab, onNav }) {
  if (subTab === "overview")   return <OverviewTab   traineeId={traineeId} />;
  if (subTab === "induction")  return <InductionTab  traineeId={traineeId} />;
  if (subTab === "competency") return <CompetencyTrackerTab traineeId={traineeId} />;
  if (subTab === "meetings")   return <MeetingsLedgerTab    traineeId={traineeId} />;
  if (subTab === "evidence")   return <EvidencePortfolioTab traineeId={traineeId} />;
  if (subTab === "learning")   return <LearningPlanTab      traineeId={traineeId} onNav={onNav} />;
  return <SubTabStub label={SUB_TABS.find((t) => t.id === subTab)?.label ?? subTab} role={traineeId} />;
}

/* ════════════════════════════════════════════════════════════════════
 * Overview tab
 * ════════════════════════════════════════════════════════════════════ */

function OverviewTab({ traineeId }) {
  const { trainee, mutators } = useSupervisor(traineeId);
  const { setToast, persona } = useSupervisionStore();
  /* Per-action gates — privileged actions require a supervisor cap.
   * A trainee viewing their own profile (selfTraineeId === traineeId)
   * can still read everything but cannot stamp themselves. */
  const canSignOff = persona.isPrivileged;

  const [openGateId, setOpenGateId] = useState(null);
  const [showAllInduction, setShowAllInduction] = useState(false);
  const [collapsed, setCollapsed] = useState({
    induction: false, safety: false, competency: false, meetings: false, audits: false,
  });
  const toggleCollapse = (key) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));
  const openGate = trainee.safetyGates.find((g) => g.ref === openGateId) ?? null;

  const handleModifyRestriction = (ref) => {
    mutators.modifyGateRestriction(trainee.id, ref, trainee.supervisorName);
    setToast("Restriction modified — change recorded in the supervisor sign-off log.");
  };
  const handleSignAudit = (id) => {
    mutators.signAudit(trainee.id, id, trainee.supervisorName);
    setToast("Audit digitally signed and authorised — locked to the immutable ledger.");
  };
  const handleViewSubmission = () => setToast("Audit submission opened in archive viewer (stub).");
  const handleLogMeeting = () => {
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    mutators.logMeeting(trainee.id, { date: today, type: "Ad-hoc Check-in" });
    setToast("Meeting logged to the trainee's supervision record.");
  };
  const handleExportPortfolio = () => {
    const stamp = new Date().toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
      timeZone: "Europe/London", hour12: false,
    }).replace(",", "");
    const content = [
      "=".repeat(70),
      "VERBILO COMPLIANCE TRUST ENGINE — DEANERY PORTFOLIO EXPORT",
      "=".repeat(70),
      `Trainee:       ${trainee.name} (${trainee.stage})`,
      `Practice:      ${trainee.practice}`,
      `Supervisor:    ${trainee.supervisorName}`,
      `Generated:     ${stamp} BST`,
      "",
      "DEANERY MILESTONE LOGS:",
      "-".repeat(70),
      `[${trainee.dops.logged}/${trainee.dops.required}]  Direct Observation of Skills (DOPS) Logged`,
      `[${trainee.msf.logged}/${trainee.msf.required}]  Multi-Source Feedback (MSF) Completed`,
      ...(trainee.audits[0] ? [`[ ${trainee.audits[0].status === "signed" ? "approved" : "pending "} ]  Clinical Audit Project — ${trainee.audits[0].title}`] : []),
      "",
      "CLINICAL SCOPE & SAFETY RESTRICTIONS:",
      "-".repeat(70),
      ...trainee.safetyGates.map((g) => `[${g.status.toUpperCase().padEnd(13)}] ${g.ref}: ${g.title}`),
      "",
      "=".repeat(70),
      "PORTFOLIO STATUS: VERIFIED & CRYPTOGRAPHICALLY SIGNED BY VERBILO LEDGER.",
      "=".repeat(70),
      "",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `Verbilo-Deanery-Portfolio-${trainee.name.replace(/\s+/g, "-")}.txt`;
    a.rel  = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast("Deanery portfolio export downloaded.");
  };
  const handleDownloadEvidence = () => setToast("Evidence log download started (stub).");

  const metrics = useMemo(() => deriveTraineeMetrics(trainee), [trainee]);
  const competencyTop = trainee.competencyAreas.slice(0, 5);
  const inductionItemsToShow = showAllInduction ? trainee.induction : trainee.induction.slice(0, 5);
  const inductionHiddenCount = trainee.induction.length - 5;

  const risks = useMemo(() => {
    const out = [];
    const restrictions = trainee.safetyGates.filter((g) => g.status !== "unrestricted");
    if (restrictions.length > 0) {
      out.push({ id: "r-restriction", tone: "red",
        text: `${restrictions.length} Active Clinical Restriction${restrictions.length === 1 ? "" : "s"}`,
        detail: restrictions.map((r) => r.title).join(", ") });
    }
    if (trainee.msf.logged < trainee.msf.required) {
      out.push({ id: "r-msf", tone: "amber",
        text: `${trainee.msf.required - trainee.msf.logged} Peer Feedback Response${trainee.msf.required - trainee.msf.logged === 1 ? "" : "s"} Pending`,
        detail: "Awaiting feedback panel completion" });
    }
    const unsignedAudit = trainee.audits.find((a) => a.status !== "signed");
    if (unsignedAudit) {
      out.push({ id: "r-audit", tone: "amber", text: "Audit Awaiting Final Sign-off", detail: unsignedAudit.title });
    }
    const overdueInduction = trainee.induction.filter((i) => i.overdue && !i.done);
    if (overdueInduction.length > 0) {
      out.push({ id: "r-induction", tone: "pink", text: "Mandatory Training Overdue",
        detail: overdueInduction.map((i) => i.label).join(", ") });
    }
    return out;
  }, [trainee]);

  return (
    <>
      <section className={styles.topRow} aria-label="Trainee profile and progress summary">
        <ProfileCard profile={trainee} />
        <div className={styles.metricsRow}>
          {metrics.map((m) => <MetricCard key={m.id} metric={m} />)}
        </div>
      </section>

      <div className={styles.mainSplit}>
        <div className={styles.mainLeft}>

          <CollapsibleBlock title="Induction & Mandatory Training Summary"
            collapsed={collapsed.induction} onToggle={() => toggleCollapse("induction")}>
            <ul className={styles.checklist}>
              {inductionItemsToShow.map((item) => (
                <li key={item.id} className={`${styles.checklistRow} ${item.overdue ? styles.checklistRowOverdue : ""}`}>
                  <span className={`${styles.checklistIcon} ${item.done ? styles.checklistIconDone : ""}`}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={styles.checklistLabel}>{item.label}</span>
                  <span className={styles.checklistMeta}>
                    {item.done
                      ? <span className={styles.checklistDate}>{item.date}</span>
                      : item.overdue
                          ? <span className={styles.checklistOverdue}>Overdue</span>
                          : <span className={styles.checklistPending}>Pending</span>}
                  </span>
                </li>
              ))}
            </ul>
            {inductionHiddenCount > 0 && (
              <button type="button" className={styles.moreBtn} onClick={() => setShowAllInduction((v) => !v)}>
                {showAllInduction ? "Collapse list" : `+ ${inductionHiddenCount} more items`}
              </button>
            )}
          </CollapsibleBlock>

          <CollapsibleBlock title="Clinical Scope & Safety Restrictions"
            hint="Click any row to inspect the protocol + sign-off log"
            collapsed={collapsed.safety} onToggle={() => toggleCollapse("safety")}>
            <div className={styles.gatesTable} role="table">
              <div className={styles.gatesTableHead} role="row">
                <span role="columnheader">Protocol</span>
                <span role="columnheader">Status</span>
                <span role="columnheader" className={styles.gatesActionCol}></span>
              </div>
              {trainee.safetyGates.map((g) => (
                <div key={g.ref} role="row" tabIndex={0}
                  className={styles.gatesRow}
                  onClick={() => setOpenGateId(g.ref)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenGateId(g.ref); } }}>
                  <span role="cell" className={styles.gatesRowProtocol}>
                    <strong>{g.ref}:</strong> {g.title}
                  </span>
                  <span role="cell"><StatusPill status={g.status} restriction={g.restriction} /></span>
                  <span role="cell" className={styles.gatesActionCol}>
                    {canSignOff ? (
                      <button type="button" className={styles.modifyBtn}
                        onClick={(e) => { e.stopPropagation(); handleModifyRestriction(g.ref); }}>
                        <I name="edit" size={11} color="currentColor" />
                        Modify Restriction
                      </button>
                    ) : (
                      <span className={styles.gatesReadonlyHint} title="Restriction changes require supervisor capability">
                        <span aria-hidden="true">🔒</span> Supervisor only
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleBlock>

          <CollapsibleBlock title="Competency Sign-off Tracker Summary" hint="Top 5 areas by signed-off progress"
            collapsed={collapsed.competency} onToggle={() => toggleCollapse("competency")}>
            <ul className={styles.compList}>
              {competencyTop.map((c) => {
                const pct = Math.round((c.signed / c.total) * 100);
                const complete = c.signed >= c.total;
                return (
                  <li key={c.id} className={styles.compListRow}>
                    <span className={styles.compListLabel}>{c.area}</span>
                    <div className={styles.compListBar}>
                      <div className={`${styles.compListBarFill} ${complete ? styles.compListBarFillComplete : ""}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.compListStatus}>
                      <strong>{c.signed}</strong> / {c.total}
                      {complete && <I name="checkcircle" size={10} color="#2e7d32" />}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CollapsibleBlock>

          <CollapsibleBlock title="Recent Supervisor Meetings"
            collapsed={collapsed.meetings} onToggle={() => toggleCollapse("meetings")}
            headerExtra={canSignOff ? (
              <button type="button" className={styles.headerActionBtn}
                onClick={(e) => { e.stopPropagation(); handleLogMeeting(); }}>
                <I name="plus" size={11} color="currentColor" />
                Log New Meeting
              </button>
            ) : null}>
            <ul className={styles.meetingList}>
              {trainee.meetings.slice(0, 5).map((m) => (
                <li key={m.id} className={styles.meetingRow}>
                  <span className={styles.meetingDate}>{m.date}</span>
                  <span className={styles.meetingType}>{m.type}</span>
                  <span className={styles.meetingDuration}>{m.duration}</span>
                  <span className={styles.meetingStatus}>
                    <I name="checkcircle" size={11} color="#2e7d32" />
                    Logged
                  </span>
                </li>
              ))}
            </ul>
          </CollapsibleBlock>

          {trainee.audits.length > 0 && (
            <CollapsibleBlock title="Audit & Evidence Submissions"
              collapsed={collapsed.audits} onToggle={() => toggleCollapse("audits")}>
              <div className={styles.auditList}>
                {trainee.audits.map((a) => {
                  const isSigned = a.status === "signed";
                  return (
                    <article key={a.id} className={`${styles.auditCard} ${isSigned ? styles.auditCardSigned : ""}`}>
                      <div className={styles.auditMain}>
                        <h3 className={styles.auditTitle}><em>{a.title}</em></h3>
                        <div className={styles.auditMeta}>
                          Submitted {a.submittedDate}
                          {isSigned && <> · Signed {a.signedDate} by <strong>{a.signedBy}</strong></>}
                        </div>
                      </div>
                      <div className={styles.auditStatusCol}>
                        {isSigned ? (
                          <span className={styles.auditPillSigned}>
                            <I name="checkcircle" size={11} color="currentColor" />
                            Signed &amp; Authorised
                          </span>
                        ) : (
                          <span className={styles.auditPillPending}>
                            <span aria-hidden="true">⏳</span> Awaiting Final Sign-off
                          </span>
                        )}
                      </div>
                      <div className={styles.auditActions}>
                        <button type="button" className={styles.auditSecondaryBtn} onClick={handleViewSubmission}>
                          <I name="eye" size={11} color="currentColor" />
                          View Submission
                        </button>
                        {!isSigned && canSignOff && (
                          <button type="button" className={styles.auditPrimaryBtn} onClick={() => handleSignAudit(a.id)}>
                            <I name="edit" size={11} color="currentColor" />
                            Digitally Sign &amp; Authorise
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </CollapsibleBlock>
          )}

        </div>

        <aside className={styles.mainRight} aria-label="Risk and action cockpit">
          <div className={styles.cockpitSection}>
            <h3 className={styles.cockpitHeading}>
              <span aria-hidden="true">⚠️</span> Needs Attention
            </h3>
            {risks.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--on-surface-variant)", margin: 0, fontStyle: "italic" }}>
                All clear — no outstanding concerns flagged.
              </p>
            ) : (
              <ul className={styles.riskList}>
                {risks.map((r) => (
                  <li key={r.id} className={`${styles.riskRow} ${styles[`riskRow_${r.tone}`]}`}>
                    <div className={styles.riskRowText}>{r.text}</div>
                    <div className={styles.riskRowDetail}>{r.detail}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.cockpitSection}>
            <h3 className={styles.cockpitHeading}>
              <span aria-hidden="true">📅</span> Upcoming Events
            </h3>
            <ul className={styles.eventList}>
              {trainee.upcomingEvents.map((u) => (
                <li key={u.id} className={styles.eventRow}>
                  <div className={styles.eventTop}>
                    <span className={styles.eventType}>{u.type}</span>
                    <span className={styles.eventWhen}>{u.when}</span>
                  </div>
                  <div className={styles.eventDate}>{u.date}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.cockpitSection}>
            <h3 className={styles.cockpitHeading}>
              <span aria-hidden="true">📥</span> Portfolio &amp; Reports
            </h3>
            <div className={styles.cockpitActions}>
              <button type="button" className={styles.cockpitPrimaryBtn} onClick={handleExportPortfolio}>
                <I name="file" size={13} /> Export Complete Portfolio PDF
              </button>
              <button type="button" className={styles.cockpitSecondaryBtn} onClick={handleDownloadEvidence}>
                <I name="download" size={13} /> Download Evidence Log
              </button>
            </div>
          </div>

          <div className={styles.cockpitSection}>
            <h3 className={styles.cockpitHeading}>
              <span aria-hidden="true">📈</span> Deanery Progress Metrics
            </h3>
            <div className={styles.deaneryItem}>
              <div className={styles.deaneryHead}>
                <span className={styles.deaneryLabel}>Direct Obs of Skills (DOPS)</span>
                <span className={styles.deaneryCount}><strong>{trainee.dops.logged}</strong> / {trainee.dops.required} Logged</span>
              </div>
              <div className={styles.deaneryBar}>
                <div className={styles.deaneryBarFill} style={{ width: `${(trainee.dops.logged / trainee.dops.required) * 100}%` }} />
              </div>
            </div>
            <div className={styles.deaneryItem}>
              <div className={styles.deaneryHead}>
                <span className={styles.deaneryLabel}>Multi-Source Feedback (MSF)</span>
                <span className={styles.deaneryCount}><strong>{trainee.msf.logged}</strong> / {trainee.msf.required} Completed</span>
              </div>
              <div className={styles.deaneryBar}>
                <div className={styles.deaneryBarFill} style={{ width: `${(trainee.msf.logged / trainee.msf.required) * 100}%` }} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {openGate && <GateDrawer gate={openGate} onClose={() => setOpenGateId(null)} />}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * Other tab components
 * ════════════════════════════════════════════════════════════════════ */

function InductionTab({ traineeId }) {
  const { trainee, mutators } = useSupervisor(traineeId);
  const { setToast, persona } = useSupervisionStore();
  const canSignOff = persona.isPrivileged;

  const toggleDone    = (id) => mutators.toggleInductionDone(traineeId, id);
  const toggleStamped = (id) => { mutators.toggleInductionStamp(traineeId, id); setToast("Supervisor stamp updated — sign-off recorded."); };
  const handleUpload  = (id) => {
    const filename = `evidence-${id}-${Date.now().toString(36)}.pdf`;
    mutators.addInductionEvidence(traineeId, id, filename);
    setToast("Evidence document attached.");
  };

  const completed = trainee.induction.filter((r) => r.done).length;
  const stamped   = trainee.induction.filter((r) => r.stamped).length;

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>Induction Checklist</h2>
          <p className={styles.tabPanelLead}>
            Regulatory induction milestones for <strong>{trainee.name}</strong>{" "}
            at <strong>{trainee.practice}</strong>.
          </p>
        </div>
        <div className={styles.tabPanelSummary}>
          <div className={styles.tabPanelStat}><strong>{completed}</strong> / {trainee.induction.length} <span>completed</span></div>
          <div className={styles.tabPanelStat}><strong>{stamped}</strong> / {trainee.induction.length} <span>supervisor-stamped</span></div>
        </div>
      </header>

      <div className={styles.inductionGrid}>
        {trainee.induction.map((r) => (
          <article key={r.id} className={`${styles.inductionRow} ${r.done ? styles.inductionRowDone : ""}`}>
            <button type="button" aria-pressed={r.done}
              className={`${styles.inductionCheckbox} ${r.done ? styles.inductionCheckboxOn : ""}`}
              onClick={() => toggleDone(r.id)}
              aria-label={r.done ? "Mark as not complete" : "Mark as complete"}>
              {r.done ? "✓" : ""}
            </button>
            <div className={styles.inductionMain}>
              <div className={styles.inductionLabel}>{r.label}</div>
              {r.evidence?.length > 0 && (
                <div className={styles.inductionEvidenceList}>
                  {r.evidence.map((doc, i) => (
                    <span key={i} className={styles.inductionEvidenceChip} title={doc}>
                      <I name="file" size={9} color="currentColor" />
                      {doc}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.inductionActions}>
              <button type="button" className={styles.inductionUploadBtn} onClick={() => handleUpload(r.id)}>
                <I name="upload" size={11} color="currentColor" />
                Upload Evidence
              </button>
              {canSignOff ? (
                <button type="button" aria-pressed={r.stamped}
                  className={`${styles.inductionStampBadge} ${r.stamped ? styles.inductionStampBadgeOn : ""}`}
                  onClick={() => toggleStamped(r.id)}>
                  {r.stamped
                    ? <><I name="checkcircle" size={11} color="currentColor" /> Supervisor Stamped</>
                    : <>Supervisor Stamp</>}
                </button>
              ) : (
                /* Trainee sees the stamp state read-only — they can't
                 * stamp themselves. */
                <span className={`${styles.inductionStampReadonly} ${r.stamped ? styles.inductionStampReadonlyOn : ""}`}
                  title={r.stamped ? "Supervisor-stamped" : "Awaiting supervisor stamp"}>
                  {r.stamped
                    ? <><I name="checkcircle" size={11} color="currentColor" /> Supervisor Stamped</>
                    : <><span aria-hidden="true">⏳</span> Awaiting Stamp</>}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CompetencyTrackerTab({ traineeId }) {
  const { trainee } = useSupervisor(traineeId);
  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>Competency Tracker</h2>
          <p className={styles.tabPanelLead}>
            Live clinical scope tracker for <strong>{trainee.name}</strong>{" "}
            at <strong>{trainee.practice}</strong>.
          </p>
        </div>
      </header>
      <div className={styles.ctTable} role="table">
        <div className={styles.ctTableHead} role="row">
          <span role="columnheader">Area</span>
          <span role="columnheader">Progress</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Last Sign-off</span>
        </div>
        {trainee.competencyAreas.map((r) => {
          const pct = Math.round((r.signed / r.total) * 100);
          const meta = COMP_TONE_META[r.tone] ?? { emoji: "•", label: r.tone };
          return (
            <div key={r.id} role="row" className={styles.ctRow}>
              <span role="cell" className={styles.ctArea}>{r.area}</span>
              <span role="cell" className={styles.ctProgressCell}>
                <div className={styles.ctBar}>
                  <div className={`${styles.ctBarFill} ${styles[`ctBarFill_${r.tone}`]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className={styles.ctProgressCount}><strong>{r.signed}</strong> / {r.total}</span>
              </span>
              <span role="cell">
                <span className={`${styles.ctBadge} ${styles[`ctBadge_${r.tone}`]}`}>
                  <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                </span>
              </span>
              <span role="cell" className={styles.ctDate}>{r.lastDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MeetingsLedgerTab({ traineeId }) {
  const { trainee, mutators } = useSupervisor(traineeId);
  const { setToast, persona } = useSupervisionStore();
  const canSignOff = persona.isPrivileged;
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddMeeting = (payload) => {
    mutators.logMeeting(traineeId, payload);
    setModalOpen(false);
    setToast("Tutorial session logged to the immutable ledger.");
  };

  const nextReview = trainee.upcomingEvents.find((e) => /(meeting|review|tutorial)/i.test(e.type));

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>Supervision Meetings</h2>
          <p className={styles.tabPanelLead}>
            Mentorship checkpoints and tutorials logged for <strong>{trainee.name}</strong>.
          </p>
        </div>
      </header>

      <div className={styles.meetingStats}>
        <div className={styles.meetingStat}>
          <div className={styles.meetingStatLabel}>Total Tutorials</div>
          <div className={styles.meetingStatValue}>{trainee.meetings.length}</div>
        </div>
        <div className={styles.meetingStat}>
          <div className={styles.meetingStatLabel}>Missed Meetings</div>
          <div className={`${styles.meetingStatValue} ${styles.meetingStatValueGood}`}>0</div>
        </div>
        <div className={styles.meetingStat}>
          <div className={styles.meetingStatLabel}>Next Scheduled Review</div>
          <div className={styles.meetingStatValueSmall}>
            {nextReview ? nextReview.date : "Not scheduled"}
          </div>
        </div>
      </div>

      <div className={styles.meetingTable} role="table">
        <div className={styles.meetingTableHead} role="row">
          <span role="columnheader">Date</span>
          <span role="columnheader">Meeting Type</span>
          <span role="columnheader">Primary Action Points</span>
          <span role="columnheader">Supervisor Comments</span>
          <span role="columnheader">Status</span>
        </div>
        {trainee.meetings.map((m) => (
          <div key={m.id} role="row" className={styles.meetingTableRow}>
            <span role="cell" className={styles.meetingTableDate}>{m.date}</span>
            <span role="cell" className={styles.meetingTableType}>{m.type}</span>
            <span role="cell" className={styles.meetingTableText}>{m.actions || "—"}</span>
            <span role="cell" className={styles.meetingTableText}>{m.comments || "—"}</span>
            <span role="cell">
              <span className={styles.meetingTableStatus}>
                <I name="checkcircle" size={11} color="currentColor" />
                Logged
              </span>
            </span>
          </div>
        ))}
      </div>

      {canSignOff && (
      <button type="button" className={styles.meetingFab} onClick={() => setModalOpen(true)}>
        <I name="plus" size={13} color="currentColor" />
        Log New Tutorial Session
      </button>
      )}

      {modalOpen && <NewMeetingModal onCancel={() => setModalOpen(false)} onSave={handleAddMeeting} />}
    </div>
  );
}

function NewMeetingModal({ onCancel, onSave }) {
  const dialogRef = useModalA11y(onCancel);
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const [date,     setDate]     = useState(today);
  const [type,     setType]     = useState("Weekly Tutorial");
  const [actions,  setActions]  = useState("");
  const [comments, setComments] = useState("");

  const canSave = date.trim() && type.trim() && actions.trim();

  return (
    <div className={styles.modalScrim} onClick={onCancel}>
      <div ref={dialogRef} className={styles.modalDialog} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Log new tutorial session">
        <header className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Log New Tutorial Session</h3>
          <button type="button" className={styles.modalClose} onClick={onCancel} aria-label="Close">×</button>
        </header>
        <div className={styles.modalBody}>
          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Date</span>
            <input type="text" className={styles.modalInput} value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Meeting type</span>
            <select className={styles.modalInput} value={type} onChange={(e) => setType(e.target.value)}>
              <option>Weekly Tutorial</option>
              <option>Monthly Review</option>
              <option>Case Discussion</option>
              <option>Skills Sign-off</option>
              <option>Pastoral Check-in</option>
              <option>Ad-hoc Check-in</option>
            </select>
          </label>
          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Primary action points</span>
            <textarea className={styles.modalInput} rows={3} value={actions} onChange={(e) => setActions(e.target.value)} placeholder="One short line per actionable outcome agreed at the meeting" />
          </label>
          <label className={styles.modalField}>
            <span className={styles.modalFieldLabel}>Supervisor comments</span>
            <textarea className={styles.modalInput} rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Brief reflective notes from the supervisor" />
          </label>
        </div>
        <footer className={styles.modalFoot}>
          <button type="button" className={styles.modalCancelBtn} onClick={onCancel}>Cancel</button>
          <button type="button" className={styles.modalSaveBtn} disabled={!canSave}
            onClick={() => onSave({ date, type, actions: actions.trim(), comments: comments.trim() })}>
            <I name="check" size={11} color="currentColor" />
            Save Tutorial Log
          </button>
        </footer>
      </div>
    </div>
  );
}

function EvidencePortfolioTab({ traineeId }) {
  const { trainee } = useSupervisor(traineeId);
  const { setToast } = useSupervisionStore();
  const [openFolders, setOpenFolders] = useState(() => new Set(trainee.portfolio.map((f) => f.id)));

  const toggleFolder = (id) => setOpenFolders((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const handleViewFile = (f) => setToast(`Opened ${f.name} in document viewer (stub).`);

  const totalFiles    = trainee.portfolio.reduce((n, f) => n + f.files.length, 0);
  const verifiedFiles = trainee.portfolio.reduce((n, f) => n + f.files.filter((x) => x.verifiedBy).length, 0);

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>Evidence Portfolio</h2>
          <p className={styles.tabPanelLead}>
            Document repository for <strong>{trainee.name}</strong>.
          </p>
        </div>
        <div className={styles.tabPanelSummary}>
          <div className={styles.tabPanelStat}><strong>{totalFiles}</strong> <span>files in portfolio</span></div>
          <div className={styles.tabPanelStat}><strong>{verifiedFiles}</strong> / {totalFiles} <span>supervisor-verified</span></div>
        </div>
      </header>

      <div className={styles.folderStack}>
        {trainee.portfolio.map((folder) => {
          const open = openFolders.has(folder.id);
          return (
            <section key={folder.id} className={styles.folder}>
              <header className={styles.folderHead}
                onClick={() => toggleFolder(folder.id)}
                role="button" tabIndex={0} aria-expanded={open}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleFolder(folder.id); } }}
                style={{ "--folder-accent": folder.accent }}>
                <span className={styles.folderIcon} aria-hidden="true">📁</span>
                <h3 className={styles.folderTitle}>{folder.label}</h3>
                <span className={styles.folderCount}>{folder.files.length} files</span>
                <span className={`${styles.blockChevron} ${!open ? styles.blockChevronCollapsed : ""}`} aria-hidden="true" />
              </header>
              {open && (
                <ul className={styles.fileList}>
                  {folder.files.map((f) => (
                    <li key={f.id} className={styles.fileRow}>
                      <span className={styles.fileKindChip}>{f.kind}</span>
                      <div className={styles.fileMain}>
                        <div className={styles.fileName}>{f.name}</div>
                        <div className={styles.fileMeta}>Uploaded {f.uploadedAt} · {f.size}</div>
                      </div>
                      <button type="button" className={styles.fileViewBtn} onClick={() => handleViewFile(f)}>
                        <I name="eye" size={13} /> View Document
                      </button>
                      {f.verifiedBy ? (
                        <span className={styles.fileStampVerified}>
                          <I name="checkcircle" size={11} color="currentColor" />
                          Verified by {f.verifiedBy}
                        </span>
                      ) : (
                        <span className={styles.fileStampPending}>
                          <span aria-hidden="true">⏳</span> Awaiting verification
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LearningPlanTab({ traineeId, onNav }) {
  const { trainee } = useSupervisor(traineeId);
  const { setToast } = useSupervisionStore();

  const handleLinkToCpd = () => {
    if (onNav) onNav("cpd");
    else      setToast("Linked to the central CPD Hub.");
  };

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>Learning Plan &amp; PDP</h2>
          <p className={styles.tabPanelLead}>
            Personal Development Plan for <strong>{trainee.name}</strong>.
          </p>
        </div>
      </header>

      <div className={styles.pdpTable} role="table">
        <div className={styles.pdpTableHead} role="row">
          <span role="columnheader">Core Goal</span>
          <span role="columnheader">Linked Portfolio Evidence</span>
          <span role="columnheader">Targeted Completion</span>
          <span role="columnheader">Supervisor Feedback Note</span>
          <span role="columnheader">Status</span>
        </div>
        {trainee.pdpGoals.map((r) => {
          const meta = PDP_STATUS_META[r.status] ?? { emoji: "•", label: r.status };
          return (
            <div key={r.id} role="row" className={styles.pdpRow}>
              <span role="cell" className={styles.pdpGoal}>{r.goal}</span>
              <span role="cell" className={styles.pdpEvidence}>
                <span className={styles.pdpEvidenceChip}>
                  <I name="file" size={10} color="currentColor" />
                  {r.evidence}
                </span>
              </span>
              <span role="cell" className={styles.pdpDue}>{r.due}</span>
              <span role="cell" className={styles.pdpFeedback}><em>&ldquo;{r.feedback}&rdquo;</em></span>
              <span role="cell">
                <span className={`${styles.pdpBadge} ${styles[`pdpBadge_${r.status}`]}`}>
                  <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.pdpCrosslink}>
        <button type="button" className={styles.pdpCrosslinkBtn} onClick={handleLinkToCpd}>
          <span aria-hidden="true">🔗</span>
          Link Active Goal directly to Centralised CPD Hub
          <I name="arrow" size={11} color="currentColor" />
        </button>
        <span className={styles.pdpCrosslinkHint}>
          Demonstrates cross-application connectivity — clicking deep-links to the
          trainee&apos;s CPD record for evidence linking.
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * ES Workspace
 * ════════════════════════════════════════════════════════════════════ */

function ESWorkspace({ subTab, esMode = "active" }) {
  if (subTab === "learning") return <ESLearningPlanTab esMode={esMode} />;
  return (
    <div className={styles.esPanel}>
      <h2 className={styles.esPanelTitle}>Educational Supervisor View</h2>
      <p className={styles.esPanelLead}>
        A roster-level dashboard for supervisors mentoring multiple trainees
        across Dental Group.
      </p>
      {esMode === "readonly" && (
        <div className={styles.readonlyBanner} role="status">
          <I name="eye" size={13} />
          <span>
            <strong>Read-only mode.</strong> Your role grants cohort visibility but
            not clinical sign-off authority — sign-off actions sit with each
            trainee&apos;s named supervisor.
          </span>
        </div>
      )}
      <div className={styles.esPanelStub}>
        <I name="checkcircle" size={18} color="#2e7d32" />
        <span>
          The <strong>Learning Plan &amp; PDP</strong> tab is live — switch to it
          for the cohort PDP management dashboard.
        </span>
      </div>
    </div>
  );
}

function ESLearningPlanTab({ esMode = "active" }) {
  const { store, mutators, setToast, persona } = useSupervisionStore();
  /* Cohort data scoping — only show rows for trainees in the
   * persona's cohortAccess list. The FD's supervisor sees only the FD,
   * the nurse mentor sees only the trainee nurse, group_admin + PM see
   * both. */
  const rows = useMemo(() => deriveEsCohort(store, persona.cohortAccess), [store, persona]);

  const handleSignOff = (row) => {
    const supervisor = store.trainees[row.traineeId].supervisorName;
    mutators.signOffPdpGoal(row.traineeId, row.goalId, supervisor);
    setToast(`Evidence reviewed — "${row.goalShort}" signed off for ${row.trainee}.`);
  };
  const handleViewLog = (row) => setToast(`Opened evidence log for ${row.trainee}'s "${row.goalShort}" (stub).`);
  const handleWitness = (row) => {
    const supervisor = store.trainees[row.traineeId].supervisorName;
    mutators.witnessPdpGoal(row.traineeId, row.goalId, supervisor);
    setToast(`Competency witnessed — "${row.goalShort}" stamped for ${row.trainee}.`);
  };

  /* Metrics scoped to cohortAccess too — so Sarah's "Critical
   * Bottlenecks" only counts Liam's restrictions, not Chloe's. */
  const cohortTrainees = Object.values(store.trainees).filter(
    (t) => persona.cohortAccess.includes(t.id),
  );
  const awaitingCount = rows.filter((r) =>
    r.status === "awaiting_signoff" || r.status === "awaiting_practical",
  ).length;
  const traineeCount = new Set(rows.map((r) => r.traineeId)).size;
  const bottleneckCount = cohortTrainees.reduce(
    (n, t) => n + t.safetyGates.filter((g) => g.status !== "unrestricted").length, 0,
  );

  const traineeMixLabel = (() => {
    const stages = cohortTrainees.map((t) => t.stage);
    const fd = stages.filter((s) => s === "Foundation Dentist").length;
    const tn = stages.filter((s) => s === "Trainee Nurse").length;
    return [fd && `${fd} FD`, tn && `${tn} Trainee Nurse${tn === 1 ? "" : "s"}`].filter(Boolean).join(" / ");
  })();

  return (
    <div className={styles.tabPanel}>
      <header className={styles.tabPanelHead}>
        <div>
          <h2 className={styles.tabPanelTitle}>
            <span aria-hidden="true">📋</span> Supervisor Cohort PDP Management
          </h2>
          <p className={styles.tabPanelLead}>
            Macro-level tracking of active learning plans, competency bottlenecks, and
            outstanding clinical action plans across all Dental Group assigned trainees.
          </p>
        </div>
      </header>

      {esMode === "readonly" && (
        <div className={styles.readonlyBanner} role="status">
          <I name="eye" size={13} />
          <span>
            <strong>Read-only mode.</strong> Your role grants cohort visibility but
            not clinical sign-off authority — sign-off and witness actions sit
            with each trainee&apos;s named supervisor.
          </span>
        </div>
      )}

      <div className={styles.esMetricGrid}>
        <article className={`${styles.esMetric} ${styles.esMetric_neutral}`}>
          <div className={styles.esMetricLabel}>Total Trainees Monitored</div>
          <div className={styles.esMetricValue}>{traineeCount}</div>
          <div className={styles.esMetricSub}>{traineeMixLabel}</div>
        </article>
        <article className={`${styles.esMetric} ${styles.esMetric_amber}`}>
          <div className={styles.esMetricLabel}>Awaiting PDP Review</div>
          <div className={styles.esMetricValue}>
            {awaitingCount} <span className={styles.esMetricUnit}>Goal{awaitingCount === 1 ? "" : "s"} Pending</span>
          </div>
          <div className={styles.esMetricSub}>Supervisor action required</div>
        </article>
        <article className={`${styles.esMetric} ${bottleneckCount > 0 ? styles.esMetric_red : styles.esMetric_neutral}`}>
          <div className={styles.esMetricLabel}>Critical Skill Bottlenecks</div>
          <div className={styles.esMetricValue}>
            {bottleneckCount} <span className={styles.esMetricUnit}>Active Restriction{bottleneckCount === 1 ? "" : "s"}</span>
          </div>
          <div className={styles.esMetricSub}>
            {bottleneckCount > 0 ? "Chaperone mandate in force" : "No active scope restrictions"}
          </div>
        </article>
      </div>

      <div className={styles.esTable} role="table">
        <div className={styles.esTableHead} role="row">
          <span role="columnheader">Trainee</span>
          <span role="columnheader">Core Learning Goal</span>
          <span role="columnheader">Target Date</span>
          <span role="columnheader">Verification Status</span>
          <span role="columnheader">Action</span>
        </div>
        {rows.map((r) => {
          const meta = ES_PDP_STATUS_META[r.status] ?? { emoji: "•", label: r.status };
          return (
            <div key={r.rowKey} role="row" className={styles.esTableRow}>
              <span role="cell" className={styles.esTrainee}>
                <div className={styles.esTraineeName}>{r.trainee}</div>
                <div className={styles.esTraineeStage}>{r.stage}</div>
              </span>
              <span role="cell" className={styles.esGoal}>{r.goal}</span>
              <span role="cell" className={styles.esDue}>{r.due}</span>
              <span role="cell" className={styles.esStatusCell}>
                <span className={`${styles.esStatusBadge} ${styles[`esStatusBadge_${r.status}`]}`}>
                  <span aria-hidden="true">{meta.emoji}</span> {meta.label}
                </span>
                <span className={styles.esStatusDetail}>{r.detail}</span>
              </span>
              <span role="cell" className={styles.esActionCol}>
                {/* Read-only mode (PM / GovLead) replaces every action
                 * button with a single "View only" pill — the row still
                 * conveys status, but the privileged actions are gone. */}
                {esMode === "readonly" ? (
                  (r.status === "signed_off" || r.status === "witnessed") ? (
                    <span className={styles.esActionDone}>
                      <I name="checkcircle" size={11} color="currentColor" />
                      Closed
                    </span>
                  ) : (
                    <span className={styles.esActionReadonly} title="Read-only — sign-off requires supervisor capability">
                      <I name="eye" size={13} />
                      View only
                    </span>
                  )
                ) : (
                  <>
                    {r.status === "awaiting_signoff" && (
                      <button type="button" className={styles.esActionPrimary} onClick={() => handleSignOff(r)}>
                        <I name="checkcircle" size={11} color="currentColor" />
                        Review Evidence &amp; Sign-off
                      </button>
                    )}
                    {r.status === "in_progress" && (
                      <button type="button" className={styles.esActionSecondary} onClick={() => handleViewLog(r)}>
                        <I name="eye" size={11} color="currentColor" />
                        View Log
                      </button>
                    )}
                    {r.status === "awaiting_practical" && (
                      <button type="button" className={styles.esActionPrimary} onClick={() => handleWitness(r)}>
                        <I name="check" size={11} color="currentColor" />
                        Witness Competency
                      </button>
                    )}
                    {r.status === "needs_review" && (
                      <button type="button" className={styles.esActionSecondary} onClick={() => handleViewLog(r)}>
                        <I name="eye" size={11} color="currentColor" />
                        View Log
                      </button>
                    )}
                    {(r.status === "signed_off" || r.status === "witnessed") && (
                      <span className={styles.esActionDone}>
                        <I name="checkcircle" size={11} color="currentColor" />
                        Closed
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <aside className={styles.heatmapBlock}>
        <h3 className={styles.heatmapTitle}>
          <span aria-hidden="true">🔥</span> Regional Skill Bottlenecks Warning
        </h3>
        <p className={styles.heatmapText}>
          System metrics flag <strong>Endodontics (Molar Access)</strong> and{" "}
          <strong>Radiograph Justification</strong> templates as high-variance areas
          across the current Year 1 Dental Group cohort.
        </p>
        <div className={styles.heatmapChips}>
          <span className={`${styles.heatmapChip} ${styles.heatmapChipHigh}`}>
            🔴 Endodontics — Molar Access · variance ↑ 38%
          </span>
          <span className={`${styles.heatmapChip} ${styles.heatmapChipMid}`}>
            🟠 Radiograph Justification · variance ↑ 22%
          </span>
          <span className={`${styles.heatmapChip} ${styles.heatmapChipLow}`}>
            🟡 Materials Mixing · variance ↑ 11%
          </span>
        </div>
      </aside>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * Stub + primitives
 * ════════════════════════════════════════════════════════════════════ */

function SubTabStub({ label, role }) {
  return (
    <div className={styles.subTabStub}>
      <I name="construction" size={22} color="var(--on-surface-variant)" />
      <h3 className={styles.subTabStubTitle}>{label}</h3>
      <p className={styles.subTabStubText}>
        The <strong>{label}</strong> workspace for <strong>{role}</strong> ships in a future slice.
      </p>
    </div>
  );
}

function ProfileCard({ profile }) {
  const statusLabel = profile.profileStatus === "concerns" ? "⚠️ Concerns Raised"
                   :  profile.profileStatus === "risk"      ? "🔴 At Risk"
                   :                                          "🟢 On Track";
  const statusClass = profile.profileStatus === "concerns" ? styles.profileStatusAmber
                   :  profile.profileStatus === "risk"      ? styles.profileStatusRed
                   :                                          styles.profileStatusGreen;
  return (
    <article className={styles.profileCard}>
      <div className={styles.profileTopRow}>
        <h2 className={styles.profileName}>{profile.name}</h2>
        <span className={`${styles.profileStatusPill} ${statusClass}`}>{statusLabel}</span>
      </div>
      <div className={styles.profileRole}>{profile.stage}</div>
      <dl className={styles.profileMeta}>
        <div className={styles.profileMetaRow}><dt>Training Year</dt><dd>{profile.year}</dd></div>
        <div className={styles.profileMetaRow}><dt>Practice</dt><dd>{profile.practice}</dd></div>
        <div className={styles.profileMetaRow}><dt>Supervisor</dt><dd>{profile.supervisorName}</dd></div>
        <div className={styles.profileMetaRow}><dt>Start Date</dt><dd>{profile.startDate}</dd></div>
      </dl>
    </article>
  );
}

function MetricCard({ metric }) {
  return (
    <article className={`${styles.metricCard} ${styles[`metricCard_${metric.tone}`]}`}>
      <div className={styles.metricLabel}>{metric.label}</div>
      <div className={styles.metricValue}>{metric.value}</div>
      {metric.isAlert ? (
        <div className={styles.metricAlert}>{metric.sub}</div>
      ) : (
        <>
          <div className={styles.metricBar}>
            <div className={styles.metricBarFill} style={{ width: `${metric.barPct}%` }} />
          </div>
          <div className={styles.metricSub}>{metric.sub}</div>
        </>
      )}
    </article>
  );
}

function CollapsibleBlock({ title, hint, collapsed, onToggle, headerExtra, children }) {
  return (
    <section className={styles.block}>
      <header className={styles.blockHead}>
        <button type="button" className={styles.blockToggle} onClick={onToggle} aria-expanded={!collapsed}>
          <div className={styles.blockHeadMain}>
            <h2 className={styles.blockTitle}>{title}</h2>
            {hint && <span className={styles.blockHint}>{hint}</span>}
          </div>
          <span className={`${styles.blockChevron} ${collapsed ? styles.blockChevronCollapsed : ""}`} aria-hidden="true" />
        </button>
        {headerExtra && <div className={styles.blockHeadExtra}>{headerExtra}</div>}
      </header>
      {!collapsed && <div className={styles.blockBody}>{children}</div>}
    </section>
  );
}

function StatusPill({ status, restriction }) {
  if (status === "unrestricted") {
    return (
      <span className={styles.gateStatusOk}>
        <I name="checkcircle" size={11} color="currentColor" />
        Unrestricted
      </span>
    );
  }
  if (status === "blocked") {
    return (
      <span className={styles.gateStatusBlocked}>
        <span aria-hidden="true">⛔</span> {restriction}
      </span>
    );
  }
  return (
    <span className={styles.gateStatusFlagged}>
      <span aria-hidden="true">⚠️</span> {restriction}
    </span>
  );
}

function GateDrawer({ gate, onClose }) {
  const dialogRef = useModalA11y(onClose);

  return (
    <div className={styles.drawerScrim} onClick={onClose}>
      <div ref={dialogRef} className={styles.drawer} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Clinical policy safety gate">
        <header className={styles.drawerHead}>
          <div>
            <div className={styles.drawerEyebrow}>Clinical Policy Safety Gate</div>
            <h3 className={styles.drawerTitle}>{gate.ref}: {gate.title}</h3>
          </div>
          <button type="button" className={styles.drawerClose} onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className={styles.drawerBody}>
          <div className={styles.drawerProtocol}>
            <div className={styles.drawerSectionLabel}>Protocol Detail</div>
            <p className={styles.drawerProtocolText}>{gate.detail}</p>
            <div className={styles.drawerCurrentStatus}>
              Current status: <StatusPill status={gate.status} restriction={gate.restriction} />
            </div>
          </div>
          <div className={styles.drawerLog}>
            <div className={styles.drawerSectionLabel}>Supervisor Sign-off Log</div>
            <ul className={styles.drawerLogList}>
              {gate.signOffLog.map((entry, i) => (
                <li key={i} className={styles.drawerLogItem}>
                  <div className={styles.drawerLogDate}>{entry.date}</div>
                  <div className={styles.drawerLogBody}>
                    <strong>{entry.supervisor}</strong>
                    <div className={styles.drawerLogAction}>{entry.action}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
