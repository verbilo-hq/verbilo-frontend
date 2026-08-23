/**
 * Spotlight library — the dashboard's "always something fresh" slot.
 *
 * Different content KIND each week (regulatory update · featured
 * colleague · group win · clinical case · tool tip · external
 * headline). Cycles by ISO week index so each user sees ~6 weeks of
 * unique content before any single piece repeats.
 *
 * Strict Verbilo-or-external rule (same as the rest of the dashboard):
 * nothing comes from the PMS. Featured colleagues + group wins are
 * Dental Group-internal stories. External items reference public
 * regulators (GDC, CQC, NICE, SDCEP, FGDP, ICO, BADN, ADAM).
 *
 * Item shape:
 *   { id, kind, title, body, attribution?, cta? }
 *     kind        — drives the chip colour + label
 *     title       — short headline
 *     body        — 2-3 sentence digest
 *     attribution — optional "— Source"
 *     cta         — optional { label, nav? } — nav = sidebar page id
 */

/* Kind metadata — defines colour + label + emoji for the chip */
export const SPOTLIGHT_KIND_META = {
  regulatory:   { label: "Regulatory Update",   emoji: "⚖️", accent: "#6a1b9a" },
  colleague:    { label: "Featured Colleague",  emoji: "🌟", accent: "#ef6c00" },
  group_win:    { label: "Group Win",           emoji: "🏆", accent: "#1b5e20" },
  clinical:     { label: "Clinical Case",       emoji: "🧠", accent: "#0277bd" },
  tool_tip:     { label: "Verbilo Tip",         emoji: "💡", accent: "#006974" },
  external:     { label: "Industry Headline",   emoji: "📰", accent: "#525b76" },
  mentor:       { label: "Mentor's Pick",       emoji: "🎓", accent: "#6a1b9a" },
  product:      { label: "Product Alert",       emoji: "🆕", accent: "#ef6c00" },
};

export const SPOTLIGHT_LIBRARY = {

  dentist: [
    { id: "d-sl-1", kind: "regulatory",
      title: "SDCEP updates antibiotic prophylaxis flowchart",
      body:  "Scottish Dental Clinical Effectiveness Programme released a revised flowchart for high-risk cardiac patients last week — clarifies the prescribing pathway for prosthetic-valve and previous-IE cases.",
      attribution: "SDCEP, May 2026" },
    { id: "d-sl-2", kind: "clinical",
      title: "Case sharing: late presentation of vertical root fracture",
      body:  "Dr. Hannah Reed shared an anonymised case showing how a vertical root fracture mimicked persistent periapical disease for 18 months. Key takeaway: bite-test diagnostics before retreat planning.",
      attribution: "Dr. Hannah Reed · Southall" },
    { id: "d-sl-3", kind: "group_win",
      title: "Group antibiotic stewardship hits 97%",
      body:  "Dental Group-wide antibiotic prescribing compliance is now at 97% — best quarter on record. Every clinician contributed. 🎉",
      cta: { label: "Open CPD Hub", nav: "cpd" } },
    { id: "d-sl-4", kind: "colleague",
      title: "Dr. Callum Lead completes Implant Diploma",
      body:  "Callum passed his ADI Implant Diploma final assessment this week, becoming our 4th implant-credentialled dentist. Congratulations from the whole group.",
      attribution: "Dental Group" },
    { id: "d-sl-5", kind: "tool_tip",
      title: "Quick CPD reflection from anywhere",
      body:  "Press Ctrl + K from any Verbilo page to open the global search — type 'CPD' and you can log a reflection without navigating away from your current screen.",
      cta: { label: "Try it now" } },
    { id: "d-sl-6", kind: "external",
      title: "FGDP/CGDent publishes Record-Keeping Standards 5th ed.",
      body:  "Updated for the CQC single-assessment framework. Notable change: explicit guidance on documenting AI-assisted radiograph reading.",
      attribution: "BDJ · 18 May" },
  ],

  foundation_dentist: [
    { id: "fd-sl-1", kind: "mentor",
      title: "Mentor pick: rubber dam isolation in narrow palates",
      body:  "Dr. Callum Lead recommends the 4A clamp + butterfly modification for lower 6s when the lingual gingiva is recessed. Worth a chairside drill before your next molar endo.",
      attribution: "Dr. Callum Lead · ES" },
    { id: "fd-sl-2", kind: "group_win",
      title: "FD cohort milestone: DOPS-3 cleared for 4/5 trainees",
      body:  "The South Coast foundation cohort is on pace for term-end portfolio submission. Strong supervision team across the region.",
      attribution: "Deanery, South Coast" },
    { id: "fd-sl-3", kind: "regulatory",
      title: "IR(ME)R 2024 — practitioner training threshold revised",
      body:  "Core training hours for IR(ME)R operators went from 5 to 7 per cycle. Your supervisor portfolio template will auto-update next refresh.",
      attribution: "HSE, May 2026" },
    { id: "fd-sl-4", kind: "clinical",
      title: "Cohort case: managing pulpitis on Friday afternoon",
      body:  "Three FDs across the deanery reported similar pulpitis-after-deep-restoration cases last month. Recommended: schedule a 30-min review buffer on Fridays for follow-up triage.",
      attribution: "FD case-share group" },
    { id: "fd-sl-5", kind: "tool_tip",
      title: "Use Supervision Hub to log DOPS as soon as you finish a case",
      body:  "Open Supervision Hub → Competency Tracker → click the row to log the observation. Logging inside 24h triples the chance your ES signs it off within 5 days.",
      cta: { label: "Open Supervision Hub", nav: "supervision_hub" } },
    { id: "fd-sl-6", kind: "external",
      title: "BDA: FD pay banding consultation closes 14 June",
      body:  "British Dental Association is collecting evidence on cost-of-living impact on Foundation Dentist starting salary. Your contribution counts.",
      attribution: "BDA · ongoing" },
  ],

  hygienist: [
    { id: "h-sl-1", kind: "regulatory",
      title: "NICE NG24 recall intervals — revised guidance",
      body:  "NICE updated the patient-risk-based recall framework. Key change: now allows up to 24 months between scheduled hygiene reviews for low-risk adults.",
      attribution: "NICE NG24, May 2026" },
    { id: "h-sl-2", kind: "tool_tip",
      title: "Direct Access SOP — quick acknowledgement",
      body:  "Your Direct Access SOP signature is required annually. From the Clinical Protocols page you can sign + record in under 90 seconds.",
      cta: { label: "Open Clinical Protocols", nav: "clinical_protocols" } },
    { id: "h-sl-3", kind: "colleague",
      title: "Megan Hughes elected to BSDHT regional committee",
      body:  "Megan will represent the region at the next British Society of Dental Hygiene & Therapy AGM. The group is proud.",
      attribution: "Dental Group" },
    { id: "h-sl-4", kind: "external",
      title: "BSDHT publishes 2026 perio maintenance position paper",
      body:  "Reinforces the role of hygienists in long-term implant maintenance + biofilm management. Worth a read before your next NSPT review.",
      attribution: "BSDHT · April" },
    { id: "h-sl-5", kind: "group_win",
      title: "Group hygiene CPD attainment up 22% YoY",
      body:  "Our DCP team logged 22% more verifiable CPD hours than last year — strongest growth in the group's training history.",
      cta: { label: "Open CPD Hub", nav: "cpd" } },
    { id: "h-sl-6", kind: "product",
      title: "GBT powder availability — supplier change",
      body:  "Group procurement has switched to a new Glycine powder supplier for AIRFLOW units. Lead time drops from 3 weeks to 5 days from June.",
      attribution: "Group procurement" },
  ],

  nurse: [
    { id: "n-sl-1", kind: "regulatory",
      title: "HTM 01-05 — 2026 minor update published",
      body:  "Decon room zoning guidance clarified for split-site practices. Group SOPs already align — no action required, refresh your awareness.",
      attribution: "DHSC HTM 01-05" },
    { id: "n-sl-2", kind: "product",
      title: "New autoclave indicator strip — compatibility update",
      body:  "Group procurement validated the Steri-Strip Class 6 for B-type vacuum cycles. Use up the legacy Class 4 stock first.",
      attribution: "Group procurement" },
    { id: "n-sl-3", kind: "tool_tip",
      title: "Bookmark your most-run logbook",
      body:  "Open Operational Logs → click the star on Autoclave 1 → it'll pin to the top of your dashboard's MyActionQueue every morning.",
      cta: { label: "Open Operational Logs", nav: "logbooks" } },
    { id: "n-sl-4", kind: "colleague",
      title: "Nina Nurse Lead: 6 months zero IPC breaches",
      body:  "Lead Nurse Nina Nurse Lead (Southall) led the practice to a 6-month spotless IPC record — no waterline excursions, no decon non-conformances.",
      attribution: "Dental Group Southall" },
    { id: "n-sl-5", kind: "group_win",
      title: "Cross-infection audit: 100% across 6 sites",
      body:  "Every Dental Group site cleared the Q1 cross-infection audit without a single recommendation. Nurse-led discipline at every chair.",
      cta: { label: "Open Audit Centre", nav: "audit_evidence" } },
    { id: "n-sl-6", kind: "external",
      title: "BADN webinar: managing AGP risk in mixed surgeries",
      body:  "Free 45-min BADN webinar on 12 June. Counts toward your verifiable CPD. Sign-up link in the CPD Hub.",
      attribution: "BADN · 12 June" },
  ],

  trainee_nurse: [
    { id: "tn-sl-1", kind: "mentor",
      title: "Nina's pick: instrument set memory trick",
      body:  "Group your mental instrument map by treatment phase, not by tray order. Setup speed doubles within a week.",
      attribution: "Nina Nurse Lead · Mentor" },
    { id: "tn-sl-2", kind: "tool_tip",
      title: "Upload evidence the day you do the procedure",
      body:  "Same-day upload to your RoE keeps mentor verification under 48 hours. The Supervision Hub's Induction tab handles the upload in 3 taps.",
      cta: { label: "Open Supervision Hub", nav: "supervision_hub" } },
    { id: "tn-sl-3", kind: "colleague",
      title: "Cohort spotlight: nurse trainees nationwide",
      body:  "NEBDN registered a record 18,400 trainee dental nurses across the UK this academic year. You're part of a strong cohort.",
      attribution: "NEBDN, May 2026" },
    { id: "tn-sl-4", kind: "external",
      title: "BADN trainee bulletin: revision pack released",
      body:  "BADN published a free 60-page revision pack covering NEBDN Modules 1-4. Direct download from your CPD Hub library.",
      attribution: "BADN · trainee", cta: { label: "Open CPD Hub", nav: "cpd" } },
    { id: "tn-sl-5", kind: "regulatory",
      title: "GDC scope of practice — DCP refresh",
      body:  "GDC reissued the scope-of-practice doc for DCPs in training. New section clarifies what trainees may NOT undertake unsupervised.",
      attribution: "GDC, April 2026" },
    { id: "tn-sl-6", kind: "group_win",
      title: "Dental Group nurse-training pass rate: 100% for 3 years",
      body:  "Every Dental Group trainee nurse has passed their NEBDN finals first-time for three consecutive cohorts. You're in a strong programme.",
      attribution: "Dental Group" },
  ],

  receptionist: [
    { id: "r-sl-1", kind: "regulatory",
      title: "ICO: dental records subject access requests",
      body:  "ICO issued fresh guidance on Subject Access Requests for dental records. Key change: response window now formally 28 calendar days, not 30.",
      attribution: "ICO, May 2026" },
    { id: "r-sl-2", kind: "tool_tip",
      title: "Phone script for cancellation excess fees",
      body:  "Group SOP Reception-12 has a vetted script for explaining the £30 short-notice cancellation fee. Two minutes to read, ends awkward calls.",
      cta: { label: "Open SOPs", nav: "clinical_protocols" } },
    { id: "r-sl-3", kind: "colleague",
      title: "Freya Front recognised for patient feedback",
      body:  "Freya (Southall front desk) received 12 unsolicited patient compliments last month — most ever for any team member.",
      attribution: "Dental Group Southall" },
    { id: "r-sl-4", kind: "group_win",
      title: "Group patient-comms training: 100% complete",
      body:  "Every Dental Group front desk completed the customer-care refresher this quarter. First time we've hit 100% on this module.",
      cta: { label: "Open Training Hub", nav: "training" } },
    { id: "r-sl-5", kind: "external",
      title: "Practice Plan: top complaint topics 2026",
      body:  "Practice Plan's annual patient feedback report puts waiting-room temperature + scheduling friction as the top two complaint themes. Forewarned.",
      attribution: "Practice Plan" },
    { id: "r-sl-6", kind: "regulatory",
      title: "Safeguarding adults — level-2 module refresh due Sept",
      body:  "Your level-2 Safeguarding Adults expires in September. Module is now web-based + completes in 35 minutes.",
      cta: { label: "Open Training Hub", nav: "training" } },
  ],

  practice_manager: [
    { id: "pm-sl-1", kind: "regulatory",
      title: "CQC 2026 single-assessment framework — Quality Statement W3",
      body:  "Inspectors are now formally asking about Quality Statement W3 (workforce wellbeing). Make sure your appraisal cycle evidences this explicitly.",
      attribution: "CQC, May 2026" },
    { id: "pm-sl-2", kind: "tool_tip",
      title: "DBS renewal alerts — set the heads-up to 90 days",
      body:  "Staff Directory → Settings → DBS Alert Window. Set to 90 days (not the default 30) so you have time to book + chase before expiry.",
      cta: { label: "Open Staff Directory", nav: "staff" } },
    { id: "pm-sl-3", kind: "group_win",
      title: "Group NPS hit 8.4 — new record",
      body:  "Patient Net Promoter Score across Dental Group practices climbed to 8.4 this quarter. Best on record. Southall + Reading led the lift.",
      attribution: "Dental Group" },
    { id: "pm-sl-4", kind: "external",
      title: "ACAS: April 2026 statutory sick pay rise",
      body:  "Statutory sick pay rises to £X from 6 April 2026. Update your staff handbook + payroll calculation template before then.",
      attribution: "ACAS, April 2026" },
    { id: "pm-sl-5", kind: "colleague",
      title: "Maya Manager: ADAM Manager of the Year shortlist",
      body:  "Practice Manager Maya Manager shortlisted for ADAM Manager of the Year 2026. Awards dinner 14 June.",
      attribution: "ADAM" },
    { id: "pm-sl-6", kind: "tool_tip",
      title: "Schedule mock CQC inspections from Audit Centre",
      body:  "Audit & Evidence Centre → Templates → Mock Inspection. Schedules an unannounced 15-minute audit on a single surgery. Use one a month.",
      cta: { label: "Open Audit Centre", nav: "audit_evidence" } },
  ],

  area_manager: [
    { id: "am-sl-1", kind: "external",
      title: "Dental M&A: PE consolidation slows in Q1 2026",
      body:  "Mergers Marketplace data shows PE-backed group acquisitions down 18% YoY. Valuations holding for 4+ site groups in the South.",
      attribution: "Mergers Marketplace" },
    { id: "am-sl-2", kind: "group_win",
      title: "Southall site wins Site of the Quarter",
      body:  "Highest compliance score, lowest staff turnover, top NPS across the region. Dr. Callum Lead's leadership shows.",
      attribution: "Dental Group" },
    { id: "am-sl-3", kind: "tool_tip",
      title: "Cross-site compliance dashboard — filter by site cluster",
      body:  "Manager Hub → Compliance Tab → filter by site cluster. Lets you compare your South Coast cluster against the national group average.",
      cta: { label: "Open Manager Hub", nav: "manager" } },
    { id: "am-sl-4", kind: "external",
      title: "NASDAL benchmarking: associate retention rising",
      body:  "NASDAL latest quarterly report shows associate retention up 6% YoY across the sector. Strongest signal in 3 years.",
      attribution: "NASDAL Q1 2026" },
    { id: "am-sl-5", kind: "colleague",
      title: "Adam Area Two chairs new Regional Manager forum",
      body:  "Adam is now chairing the BDA Group Practice Managers forum — quarterly knowledge-sharing across UK dental groups.",
      attribution: "BDA Forum" },
    { id: "am-sl-6", kind: "regulatory",
      title: "NHS contract reform consultation closes 14 June",
      body:  "DHSC consultation on dental contract reform closes mid-June. Submit your regional response via the Group Compliance Hub.",
      attribution: "DHSC" },
  ],

  clinical_director: [
    { id: "cd-sl-1", kind: "regulatory",
      title: "SDCEP: revised guidance on AI-assisted radiograph review",
      body:  "SDCEP published clinical position on the use of AI-assisted radiograph diagnostics. Clarifies how to document the AI tool in clinical notes.",
      attribution: "SDCEP, May 2026" },
    { id: "cd-sl-2", kind: "group_win",
      title: "Group radiograph QA score at 92% — 4-year high",
      body:  "Q1 image-quality audit across all Dental Group sites hit 92% — best result in four years. Driven by improved cross-site CPD pulse.",
      attribution: "Dental Group" },
    { id: "cd-sl-3", kind: "tool_tip",
      title: "Cohort PDP review — open from Supervision Hub",
      body:  "Switch to the Supervisor Cohort PDP Management tab to clear all outstanding sign-offs in one queue. Saves ~20 mins vs per-trainee navigation.",
      cta: { label: "Open Supervision Hub", nav: "supervision_hub" } },
    { id: "cd-sl-4", kind: "external",
      title: "Dental Protection: defensible note-writing trends 2026",
      body:  "Dental Protection's annual risk bulletin highlights AI-assisted clinical decision-making as the fastest-growing area of indemnity scrutiny.",
      attribution: "Dental Protection · risk bulletin" },
    { id: "cd-sl-5", kind: "clinical",
      title: "Group SEA learning: implant explantation patterns",
      body:  "Q1 SEA review surfaced 3 implant explantations within first 6 months across the group — all linked to immediate-load protocols. Pathway update under consultation.",
      attribution: "Clinical Governance Q1" },
    { id: "cd-sl-6", kind: "regulatory",
      title: "GDC: revised CPD reflection wording for revalidation",
      body:  "GDC clarified what 'reflection' means for verifiable CPD claims. New wording specifically excludes one-line tick-box reflections.",
      attribution: "GDC, May 2026" },
  ],
};

/* ─── Selector — ISO-week-driven rotation ───────────────────────────
 * Uses the year + week-of-year so each user gets a deterministic
 * weekly rotation that everyone sees together. Add a small per-user
 * offset later when we want each user's content to feel desynced
 * from their colleagues' (more "fresh"). */
function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function getSpotlightForWeek(personaId, weekIndex = null) {
  const library = SPOTLIGHT_LIBRARY[personaId] ?? SPOTLIGHT_LIBRARY.dentist;
  const week    = weekIndex ?? isoWeek(new Date());
  const idx     = ((week % library.length) + library.length) % library.length;
  return library[idx];
}

export function getSpotlightAt(personaId, offset) {
  /* For prev / next manual stepping (carousel-style). */
  const library = SPOTLIGHT_LIBRARY[personaId] ?? SPOTLIGHT_LIBRARY.dentist;
  const week    = isoWeek(new Date()) + offset;
  const idx     = ((week % library.length) + library.length) % library.length;
  return { item: library[idx], position: idx + 1, total: library.length };
}
