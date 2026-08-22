/**
 * Controlled documents for the Decontamination & IPC Governance Pack.
 *
 * Each entry expands into:
 *   - a `GovernanceDocument` row
 *   - one or more `DocumentVersion` rows in declared statuses
 *
 * Most docs are Published. A handful are deliberately in other states so the
 * dashboard demonstrates real-world spread:
 *
 *   - "Steriliser Testing & Load Release SOP"  → In Review
 *   - "Environmental Cleaning SOP"               → Review Due
 *   - "Sharps Injury SOP"                         → Expired
 *   - "Autoclave Operation SOP"                   → Published v1.1 + Draft v1.2 + Archived v1.0
 *   - "Clinical Waste SOP"                        → Published + 1 prior Archived
 */

import { DocumentType, DocumentScope, DocumentStatus } from "../types";

const DEFAULT_BODY = (title, ref) => `# ${title}

_Group-wide controlled document for the Decontamination & IPC Governance Pack._

## 1. Purpose
This document defines the controlled procedure for **${title.toLowerCase()}** across all applied Dental Group sites.

## 2. Scope
This procedure applies to every clinical staff member at each site where the relevant decontamination process is operated.

## 3. Roles & responsibilities
- **SOP Owner:** Group Decontamination Lead
- **Approver:** Clinical Director
- **Local execution:** Site Decontamination Lead and clinical team

## 4. Procedure
Where this document covers operational activity, the procedure is auto-populated from the site's Decontamination Profile + Equipment Register on publish. Local detail (autoclave model, waterline product, etc.) is inserted automatically.

## 5. Evidence requirements
Activated automatically on publish. See the Evidence Register for the live list of required evidence per site.

## 6. Audit linkage
Linked audits and their RAG status are visible on the Audit Dashboard.

## 7. References
- ${ref || "HTM 01-05"}
`;

export const DEMO_DOCUMENTS = [
  /* ── Policies (9) ──────────────────────────────────────────────────────── */
  {
    id: "doc-policy-ipc",
    title: "Infection Prevention & Control Policy",
    type: DocumentType.policy, category: "infection_control", scope: DocumentScope.group,
    references: ["HTM 01-05", "CQC Reg 12", "GDC Standards 6.1"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
    body: DEFAULT_BODY("Infection Prevention & Control Policy", "HTM 01-05 §2"),
  },
  {
    id: "doc-policy-decon",
    title: "Decontamination Policy",
    type: DocumentType.policy, category: "decontamination",
    references: ["HTM 01-05"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-hand",
    title: "Hand Hygiene Policy",
    type: DocumentType.policy, category: "hand_hygiene",
    references: ["WHO Hand Hygiene Guidelines", "HTM 01-05 §5"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-ppe",
    title: "PPE Policy",
    type: DocumentType.policy, category: "ppe",
    references: ["HSE COSHH", "HTM 01-05 §5"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-waste",
    title: "Clinical Waste Policy",
    type: DocumentType.policy, category: "waste",
    references: ["HTM 07-01", "Environment Agency Duty of Care"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-sharps",
    title: "Sharps Management Policy",
    type: DocumentType.policy, category: "sharps",
    references: ["HSE Sharps Regs 2013"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-exposure",
    title: "Exposure Incident Policy",
    type: DocumentType.policy, category: "incident",
    references: ["HSE RIDDOR"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-env",
    title: "Environmental Cleaning Policy",
    type: DocumentType.policy, category: "cleaning",
    references: ["PHE/UKHSA AGP Guidance"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },
  {
    id: "doc-policy-waterline",
    title: "Dental Unit Waterline Policy",
    type: DocumentType.policy, category: "waterlines", requiredFlag: "waterlineManagement",
    references: ["HTM 01-05 §8"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 145 }],
  },

  /* ── SOPs (13) ─────────────────────────────────────────────────────────── */
  {
    id: "doc-sop-journey",
    title: "Instrument Journey & Traceability SOP",
    type: DocumentType.sop, category: "decontamination", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §3.1-3.7"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  },
  {
    id: "doc-sop-manual",
    title: "Manual Cleaning SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "manualCleaning", linkedAuditType: "decontamination",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  },
  {
    id: "doc-sop-ultrasonic",
    title: "Ultrasonic Bath SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "ultrasonicBath", linkedAuditType: "decontamination",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  },
  {
    id: "doc-sop-wd",
    title: "Washer-Disinfector SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "washerDisinfector", linkedAuditType: "decontamination",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 130 }],
  },
  // Autoclave Operation SOP — the multi-version showcase
  {
    id: "doc-sop-autoclave",
    title: "Autoclave Operation SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6", "EN 13060"],
    versions: [
      { versionNumber: "1.0", status: DocumentStatus.archived,  publishedDaysAgo: 540, archivedDaysAgo: 260, changeSummary: "Original published version" },
      { versionNumber: "1.1", status: DocumentStatus.published, publishedDaysAgo: 260,                       changeSummary: "Updated to EN 13060 references; clarified load release sign-off" },
      { versionNumber: "1.2", status: DocumentStatus.draft,                                                  changeSummary: "Draft revision: incorporates Southall WD/autoclave linkage feedback" },
    ],
  },
  // In Review
  {
    id: "doc-sop-steriliser-testing",
    title: "Steriliser Testing & Load Release SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.in_review, submittedDaysAgo: 8 }],
  },
  {
    id: "doc-sop-packaging",
    title: "Instrument Packaging & Storage SOP",
    type: DocumentType.sop, category: "decontamination", requiredFlag: "instrumentsPouched",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 95 }],
  },
  {
    id: "doc-sop-turnaround",
    title: "Surgery Turnaround SOP",
    type: DocumentType.sop, category: "cleaning", linkedAuditType: "surgery_turnaround",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 100 }],
  },
  // Review due
  {
    id: "doc-sop-env",
    title: "Environmental Cleaning SOP",
    type: DocumentType.sop, category: "cleaning", linkedAuditType: "environmental_cleaning",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.review_due, publishedDaysAgo: 380, reviewDaysFromNow: -15 }],
  },
  // Expired
  {
    id: "doc-sop-sharps",
    title: "Sharps Injury SOP",
    type: DocumentType.sop, category: "sharps", requiredFlag: "sharpsDisposal", linkedAuditType: "sharps_waste",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.expired, publishedDaysAgo: 430, reviewDaysFromNow: -65 }],
  },
  // Published with one prior archived
  {
    id: "doc-sop-clinical-waste",
    title: "Clinical Waste SOP",
    type: DocumentType.sop, category: "waste", requiredFlag: "clinicalWasteTransferNotes", linkedAuditType: "sharps_waste",
    versions: [
      { versionNumber: "1.0", status: DocumentStatus.archived,  publishedDaysAgo: 410, archivedDaysAgo: 120, changeSummary: "Pre-EA duty-of-care update" },
      { versionNumber: "1.1", status: DocumentStatus.published, publishedDaysAgo: 120,                      changeSummary: "Aligned to Environment Agency Duty of Care 2024" },
    ],
  },
  {
    id: "doc-sop-amalgam",
    title: "Amalgam Waste SOP",
    type: DocumentType.sop, category: "waste", requiredFlag: "amalgamWaste", linkedAuditType: "sharps_waste",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 90 }],
  },
  {
    id: "doc-sop-waterline",
    title: "Dental Unit Waterline Management SOP",
    type: DocumentType.sop, category: "waterlines", requiredFlag: "waterlineManagement", linkedAuditType: "waterline",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 75 }],
  },

  /* ── Log Templates (15) ──────────────────────────────────────────────────
   * Controlled blank templates for the live records each SOP requires. The
   * actual live submissions are captured in the CQC Compliance Hub; these
   * are the printable / customisable templates the practice adopts under
   * the matching SOP. Retention noted in each body.
   */
  {
    id: "doc-log-sterilizer-cycle",
    title: "Sterilizer Cycle Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6.86", "BS EN 13060"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Sterilizer Cycle Log\n\n_Controlled log template — Decontamination & IPC pack._\n\n## Frequency\nEvery cycle, every day the sterilizer is in use.\n\n## Records captured\n- Date\n- Sterilizer ID / serial\n- Cycle number\n- Cycle type (Type N / Type B)\n- Temperature (°C)\n- Pressure (bar)\n- Hold time (min)\n- Drying complete (Y/N)\n- Chemical indicator pass (Y/N)\n- Operator name + signature\n\n## Retention\n2 years minimum (HTM 01-05).\n\n## References\nHTM 01-05 §6.86 · BS EN 13060`,
  },
  {
    id: "doc-log-helix-bowie-dick",
    title: "Helix / Bowie-Dick Test Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6.41", "BS EN 13060 Type B"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Helix / Bowie-Dick Test Log\n\n_Steam-penetration test log — Type B sterilizers only._\n\n## Frequency\nDaily, first cycle of each session.\n\n## Records captured\n- Date / time\n- Sterilizer ID / serial\n- Test type (Helix or Bowie-Dick)\n- Indicator strip lot number\n- Pass / fail (uniform colour change)\n- Operator name\n- If failed: sterilizer out of service action + engineer reference\n\n## Retention\n2 years (HTM 01-05).\n\n## References\nHTM 01-05 §6.41 · BS EN 13060`,
  },
  {
    id: "doc-log-vacuum-leak",
    title: "Vacuum Leak Test Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6.43", "BS EN 13060"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Vacuum Leak Test Log\n\n_Type B sterilizers only._\n\n## Frequency\nWeekly.\n\n## Records\n- Date\n- Sterilizer ID / serial\n- Pressure rise (kPa per minute)\n- Pass criterion: ≤ 0.13 kPa/min\n- Pass / fail\n- Operator + signature\n- If failed: service engineer reference + sterilizer quarantined date\n\n## Retention\n2 years.\n\n## References\nHTM 01-05 §6.43`,
  },
  {
    id: "doc-log-ultrasonic-foil",
    title: "Ultrasonic Foil Ablation Test Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "ultrasonicBath", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §3.43"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Ultrasonic Foil Ablation Test Log\n\n_Ultrasonic bath energy-distribution test._\n\n## Frequency\nWeekly.\n\n## Records\n- Date\n- Ultrasonic bath ID\n- Test duration (60–90 s)\n- Foil position(s) tested (4 corners + centre)\n- Uniform pitting / perforation observed Y/N at each position\n- Dead zones noted Y/N\n- Pass / fail\n- Operator + signature\n\n## Retention\n2 years.\n\n## References\nHTM 01-05 §3.43`,
  },
  {
    id: "doc-log-wd-soil",
    title: "TOSI / Browne STF Soil Test Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "washerDisinfector", linkedAuditType: "decontamination",
    references: ["BS EN ISO 15883"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Washer-Disinfector Soil Test Log (TOSI / Browne STF)\n\n## Frequency\nWeekly.\n\n## Records\n- Date\n- Washer-disinfector ID\n- Cycle number\n- Test piece lot number\n- Complete soil removal Y/N\n- Cycle parameters within spec Y/N\n- Pass / fail\n- Operator + signature\n\n## Retention\n2 years.\n\n## References\nBS EN ISO 15883`,
  },
  {
    id: "doc-log-protein-residue",
    title: "Protein Residue Test Log",
    type: DocumentType.log_template, category: "decontamination",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05 essential requirement ≤ 3 µg/cm²"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Protein Residue Test Log\n\n## Frequency\nQuarterly (essential) — weekly is best practice.\n\n## Records\n- Date\n- Instrument tested + serial\n- Test kit make + lot\n- Result (µg/cm²)\n- Pass criterion ≤ 3 µg/cm²\n- Pass / fail\n- Operator + signature\n- If failed: re-processing action + root cause review\n\n## Retention\n2 years.\n\n## References\nHTM 01-05 essential requirement`,
  },
  {
    id: "doc-log-sterilizer-pq",
    title: "Sterilizer Periodic Test / Annual PQ Log",
    type: DocumentType.log_template, category: "decontamination",
    requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6.70-6.80", "BS EN 13060"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Sterilizer Periodic Test (Annual PQ) Log\n\n_Quarterly periodic test + annual performance qualification._\n\n## Frequency\nQuarterly by competent Test Person · Annual by Test Person + Authorised Person (Decontamination).\n\n## Records\n- Date\n- Sterilizer ID / serial\n- Test Person + company\n- Thermometric small-load result\n- Thermometric full-load result\n- Residual air test (where applicable)\n- Dryness test\n- Certificate / report reference\n- Next test / PQ due date\n\n## Retention\nLife of the sterilizer (typically 11 years).\n\n## References\nHTM 01-05 §6.70–6.80`,
  },
  {
    id: "doc-log-duwl-flushing",
    title: "DUWL Flushing Log (Start of Session)",
    type: DocumentType.log_template, category: "waterlines",
    requiredFlag: "waterlineManagement", linkedAuditType: "waterline",
    references: ["HTM 01-05 §8", "HTM 04-01"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# DUWL Flushing Log (start of session)\n\n## Frequency\nDaily at start of session; 20–30 s between patients.\n\n## Records\n- Date / session start time\n- Dental unit ID(s)\n- ≥ 2 min flush through all handpieces / scaler / triple syringe Y/N\n- Operator name + signature\n\n## Retention\n2 years.\n\n## References\nHTM 01-05 §8`,
  },
  {
    id: "doc-log-duwl-shock",
    title: "DUWL Shock Disinfection Log",
    type: DocumentType.log_template, category: "waterlines",
    requiredFlag: "waterlineManagement", linkedAuditType: "waterline",
    references: ["HTM 01-05 §8"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# DUWL Shock Disinfection Log\n\n## Frequency\nWeekly (or per manufacturer schedule).\n\n## Records\n- Date\n- Dental unit ID\n- Product used + lot\n- Dose / dilution\n- Contact time (min)\n- Manufacturer instructions followed Y/N\n- Operator + signature\n\n## Retention\n2 years.\n\n## References\nHTM 01-05 §8`,
  },
  {
    id: "doc-log-duwl-cfu",
    title: "DUWL Microbiological Test (Dip Slide) Log",
    type: DocumentType.log_template, category: "waterlines",
    requiredFlag: "waterlineManagement", linkedAuditType: "waterline",
    references: ["HTM 01-05 §8 essential ≤ 200 CFU/mL"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# DUWL Microbiological Test Log\n\n## Frequency\nQuarterly (essential) · monthly (best practice).\n\n## Records\n- Date sampled\n- Dental unit ID\n- Dip slide make + lot\n- Incubation start date\n- Incubation read date (after 5–7 days at room temp)\n- CFU/mL result\n- Pass criterion ≤ 200 CFU/mL\n- Pass / fail\n- If failed: shock dosing action + re-sample\n- Operator + signature\n\n## Retention\n2 years (lab reports — life of device best practice).\n\n## References\nHTM 01-05 §8`,
  },
  {
    id: "doc-log-sentinel-temps",
    title: "Sentinel Outlet Temperature Log",
    type: DocumentType.log_template, category: "waterlines",
    linkedAuditType: "waterline",
    references: ["HTM 04-01", "HSE ACoP L8"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Sentinel Outlet Temperature Log\n\n_Legionella risk management — required by HTM 04-01._\n\n## Frequency\nMonthly at sentinel outlets (furthest + nearest to inlet; plus high-risk).\n\n## Records\n- Date\n- Outlet location\n- Hot temperature after 1 min run (target ≥ 50 °C; storage ≥ 55 °C)\n- Cold temperature after 2 min run (target ≤ 20 °C)\n- Thermometer calibrated Y/N\n- Pass / fail\n- Inspector + signature\n- Action if failed: investigate stagnation, calorifier, blending\n\n## Retention\n5 years.\n\n## References\nHTM 04-01 · HSE ACoP L8`,
  },
  {
    id: "doc-log-distiller",
    title: "Distiller / RO Water Conductivity Log",
    type: DocumentType.log_template, category: "decontamination",
    linkedAuditType: "decontamination",
    references: ["BS EN 13060 ≤ 15 µS/cm"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Distiller / RO Water Conductivity Log\n\n_Feedwater for sterilizer reservoir._\n\n## Frequency\nDaily (start of session).\n\n## Records\n- Date\n- Distiller / RO unit ID\n- Conductivity (µS/cm)\n- Pass criterion ≤ 15 µS/cm\n- Reservoir cleaned / descaled Y/N\n- Pass / fail\n- Operator + signature\n\n## Retention\n2 years.\n\n## References\nBS EN 13060`,
  },
  {
    id: "doc-log-waste-consignment",
    title: "Hazardous Waste Consignment Notes Log",
    type: DocumentType.log_template, category: "waste",
    requiredFlag: "clinicalWasteTransferNotes", linkedAuditType: "sharps_waste",
    references: ["HTM 07-01", "EA Duty of Care"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Hazardous Waste Consignment Notes Log\n\n_Duty-of-care record for clinical / amalgam / hazardous waste collection._\n\n## Frequency\nPer consignment.\n\n## Records\n- Collection date\n- Carrier name + registration\n- EWC waste code (e.g. 18 01 03* infectious; 18 01 10* amalgam)\n- Quantity (kg or L)\n- Pre-acceptance audit ref\n- Signed by producer + carrier\n- Consignment note number\n- Disposal site\n\n## Retention\nMinimum 3 years (Environment Agency Duty of Care).\n\n## References\nHTM 07-01 · Environment Agency Duty of Care guidance`,
  },
  {
    id: "doc-log-amalgam-separator",
    title: "Amalgam Separator Service Log",
    type: DocumentType.log_template, category: "waste",
    requiredFlag: "amalgamWaste", linkedAuditType: "sharps_waste",
    references: ["EU Mercury Reg 2017/852 (retained)", "ISO 11143 ≥ 95% retention"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Amalgam Separator Service Log\n\n## Frequency\nAnnual maintenance per manufacturer; service certificates retained for life of device.\n\n## Records\n- Separator make / model / serial\n- Stated efficiency (%) — ≥ 95% per ISO 11143\n- Service date\n- Engineer + company\n- Cartridge / chamber replaced Y/N\n- Next service due date\n- Certificate reference\n\n## Retention\nLife of separator.\n\n## Statutory linkage\nEU Mercury Regulation 2017/852 (retained in UK law) restricts amalgam use in under-15s + pregnant / breastfeeding patients and mandates separator. Certificate must be available at inspection.\n\n## References\nEU Mercury Reg · ISO 11143`,
  },
  {
    id: "doc-log-sharps-bbv",
    title: "Sharps Injury / BBV Exposure Log",
    type: DocumentType.log_template, category: "sharps",
    linkedAuditType: "sharps_waste",
    references: ["HSE Sharps Regs 2013", "PHE PEP guidance", "RIDDOR 2013"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Sharps Injury / BBV Exposure Log\n\n## Frequency\nPer incident — every sharps injury, splash or BBV exposure event.\n\n## Records\n- Incident date / time / location\n- Injured worker name + role\n- Mechanism (sharps recap, scalpel, splash, etc.)\n- Source patient (with consent for BBV testing)\n- Immediate first aid given (bleed under cold water, irrigate, dress)\n- Occupational Health referral date / time\n- A&E attendance if required\n- PEP decision (HIV: ≤ 72 h window)\n- Hep B titre check + booster / immunoglobulin given Y/N\n- BBV testing schedule (baseline, 6 wk, 12 wk, 6 mo)\n- RIDDOR notification reference\n- Root-cause analysis + corrective action\n\n## Retention\n40 years (BBV exposure — long-tail).\n\n## References\nHSE Sharps Regs 2013 · PHE PEP guidance · RIDDOR 2013`,
  },

  /* ── Audit Tools (8) ──────────────────────────────────────────────────────
   * Scored audit instruments — each linked to an AUDIT_TYPES entry. The
   * scoring framework is captured in the body; live audit submissions
   * (with RAG scoring and corrective actions) sit in the CQC Compliance
   * Hub against the same audit type.
   */
  {
    id: "doc-audit-ipc-self-assessment",
    title: "Annual IPC Self-Assessment Tool",
    type: DocumentType.audit_tool, category: "infection_control",
    linkedAuditType: "ipc",
    references: ["CGDent IPC Self-Assessment", "FGDP IPC guidance", "CQC Reg 12"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Annual IPC Self-Assessment Tool\n\n_The single most-requested IPC document at CQC dental inspections._\n\n## Frequency\nAnnual minimum — best practice 6-monthly with quarterly review of non-compliant items.\n\n## Auditor\nIPC Lead, signed off by Clinical Director.\n\n## Domains assessed (15 sections)\n1. Local Decontamination Unit — zoning + workflow + signage\n2. Hand hygiene infrastructure + audit results\n3. PPE provision + fit-testing + training\n4. Sharps safety + safe-disposal devices + bins\n5. Surface decontamination + cleaning logs\n6. DUWL monitoring + sentinel outlet logs\n7. Clinical waste segregation + consignment\n8. Mercury / amalgam separator evidence\n9. Spillage management + kit availability\n10. Staff immunisation status\n11. Antimicrobial stewardship policy + audit\n12. IPC training records + competency\n13. Outbreak / cluster reporting protocol\n14. Single-use items compliance\n15. Patient-facing environment cleanliness\n\n## Scoring\n- Green: ≥ 95% compliant items — inspection-ready\n- Amber: 75–94% — improvement plan required\n- Red: < 75% — immediate remediation\n\n## Output\nSigned report to Clinical Director · corrective-action plan with owners and dates · next audit date.\n\n## References\nCGDent IPC · FGDP IPC · CQC Reg 12`,
  },
  {
    id: "doc-audit-hand-hygiene",
    title: "Hand Hygiene WHO 5 Moments Audit Tool",
    type: DocumentType.audit_tool, category: "hand_hygiene",
    linkedAuditType: "hand_hygiene",
    references: ["WHO Hand Hygiene Guidelines", "NICE QS61"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Hand Hygiene WHO 5 Moments Audit Tool\n\n_Observational audit — NOT self-report._\n\n## Frequency\nMonthly per practice / area.\n\n## Sample\n≥ 20 observations per session; cover all clinical roles.\n\n## Observed moments\n1. Before patient contact\n2. Before aseptic / clean task\n3. After body fluid exposure risk\n4. After patient contact\n5. After contact with patient surroundings\n\n## Per-observation record\n- Date / time / area\n- Clinician role observed (anonymised)\n- Moment number\n- Compliance (Y/N)\n- Technique correct (soap+water 40–60 s OR alcohol gel 20–30 s)\n- Bare-below-elbows observed (Y/N)\n\n## Targets\n- Compliance rate ≥ 95% (local target — RAG threshold)\n- Bare-below-elbows: 100%\n\n## Output\n- Per-role compliance rate fed back to individuals\n- Real-time feedback at point of observation\n- Trend reviewed monthly\n\n## References\nWHO Guidelines on Hand Hygiene in Health Care · NICE QS61`,
  },
  {
    id: "doc-audit-decon-process",
    title: "Decontamination Process Audit Tool",
    type: DocumentType.audit_tool, category: "decontamination",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05 §3-§7"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Decontamination Process Audit Tool\n\n_End-to-end LDU + reprocessing workflow audit._\n\n## Frequency\nQuarterly.\n\n## Auditor\nDecontamination Lead + IPC Lead.\n\n## Sections (RAG scored)\n1. LDU zoning + single-direction workflow\n2. PPE worn correctly in dirty / clean zones\n3. Manual cleaning + ultrasonic verification logs current\n4. Washer-disinfector cycle logs + soil test current\n5. Pre-sterilisation inspection under magnification observed\n6. Packaging + lot labelling + chemical indicators in use\n7. Sterilizer ACT / Helix / vacuum tests current\n8. Sterile storage area clean, dry, FIFO, in-date\n9. Instrument traceability — lot to patient\n10. Single-use items not reprocessed\n\n## Scoring\nEach section RAG with corrective action where amber or red. Overall RAG = worst section.\n\n## Output\nSigned audit report · corrective action plan · next audit date.\n\n## References\nHTM 01-05 §3 to §7`,
  },
  {
    id: "doc-audit-sterilizer-process",
    title: "Sterilizer Process Audit Tool",
    type: DocumentType.audit_tool, category: "decontamination",
    requiredFlag: "autoclave", linkedAuditType: "decontamination",
    references: ["HTM 01-05 §6", "BS EN 13060"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Sterilizer Process Audit Tool\n\n## Frequency\nQuarterly.\n\n## Scope per sterilizer\n- Daily ACT log present + signed\n- Helix / Bowie-Dick log present (Type B)\n- Weekly vacuum leak log (Type B)\n- Quarterly periodic test by Test Person — report retained\n- Annual PQ certificate in date\n- Service contract current\n- Operator competency evidenced\n- Records retained 2 yr (cycles) / life of device (service)\n- Failed cycle response documented\n\n## Output\nPer-sterilizer RAG · cycle-log completeness % · corrective action plan.\n\n## References\nHTM 01-05 §6 · BS EN 13060`,
  },
  {
    id: "doc-audit-wd-process",
    title: "Washer-Disinfector Process Audit Tool",
    type: DocumentType.audit_tool, category: "decontamination",
    requiredFlag: "washerDisinfector", linkedAuditType: "decontamination",
    references: ["BS EN ISO 15883", "HTM 01-05 §5"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Washer-Disinfector Process Audit Tool\n\n## Frequency\nQuarterly.\n\n## Scope per WD\n- Daily cycle log present + signed\n- Weekly TOSI / soil test log\n- Thermal disinfection evidence — A0 ≥ 600\n- Detergent dose + lot recorded\n- PCD or chemical indicator results\n- Annual PQ certificate in date\n- Service contract current\n- Operator competency evidenced\n- Records retained 2 yr (cycles) / life of device (service)\n\n## Output\nPer-WD RAG · A0 compliance % · corrective action plan.\n\n## References\nBS EN ISO 15883 · HTM 01-05 §5`,
  },
  {
    id: "doc-audit-waterline",
    title: "DUWL / Water Safety Audit Tool",
    type: DocumentType.audit_tool, category: "waterlines",
    requiredFlag: "waterlineManagement", linkedAuditType: "waterline",
    references: ["HTM 01-05 §8", "HTM 04-01"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# DUWL / Water Safety Audit Tool\n\n## Frequency\nQuarterly.\n\n## Sections (RAG)\n1. Start-of-session flushing log present + signed\n2. Weekly shock disinfection log current\n3. DUWL microbiological testing log — last result ≤ 200 CFU/mL\n4. Sentinel outlet temperature log — hot ≥ 50 °C, cold ≤ 20 °C\n5. Water Safety Plan in place + reviewed annually\n6. Legionella risk assessment current\n7. Little-used outlet flushing log (weekly)\n8. Distiller / RO conductivity log ≤ 15 µS/cm\n\n## Output\nOverall water safety RAG · failed thresholds + corrective actions.\n\n## References\nHTM 01-05 §8 · HTM 04-01 · HSE ACoP L8`,
  },
  {
    id: "doc-audit-waste-mercury",
    title: "Clinical Waste & Mercury Audit Tool",
    type: DocumentType.audit_tool, category: "waste",
    linkedAuditType: "sharps_waste",
    references: ["HTM 07-01", "EU Mercury Reg 2017/852", "EA Duty of Care"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# Clinical Waste & Mercury Audit Tool\n\n## Frequency\nAnnual.\n\n## Scope\n- Waste segregation by colour-coded stream\n- Bin labelling + ¾ rule observed\n- Sharps bins single-handed scoop / safety devices in use\n- Consignment notes retained ≥ 3 years\n- EA Duty of Care contract current\n- Amalgam separator: service certificate in date, efficiency ≥ 95% (ISO 11143)\n- Mercury spillage kit on site + in date\n- Encapsulated amalgam only — no loose mercury\n- Amalgam restriction observed (no under-15s, no pregnant / breastfeeding)\n- Alternative restorative materials available\n\n## Output\nOverall RAG · separator certificate expiry alert · spillage kit currency · corrective action plan.\n\n## References\nHTM 07-01 · EU Mercury Reg 2017/852 (retained) · EA Duty of Care`,
  },
  {
    id: "doc-audit-ppe-fit-test",
    title: "PPE & FFP3 Fit-Test Audit Tool",
    type: DocumentType.audit_tool, category: "ppe",
    linkedAuditType: "ipc",
    references: ["HSE PPE Regs 1992 (amended 2022)", "HSE INDG479", "HTM 01-05 §5"],
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
    body: `# PPE & FFP3 Fit-Test Audit Tool\n\n## Frequency\nAnnual.\n\n## Scope\n- PPE stock check — all categories (gloves, masks, visors, gowns, aprons) in date\n- Type IIR masks per BS EN 14683 available\n- FFP2 / FFP3 respirators available for AGPs\n- FFP3 fit-test currency: every wearer, every model — re-test on facial change or every 2 years (HSE INDG479)\n- Doffing-order training delivered annually\n- Suppliers approved + traceable\n- Disposal route compliant with HTM 07-01\n\n## Per-staff record check\n- Hep B titre on file\n- Fit-test certificate current per wearer + per model\n- Annual PPE training acknowledged\n\n## Output\nOverall PPE RAG · per-wearer fit-test currency table · corrective action plan.\n\n## References\nHSE PPE Regs 1992 (amended 2022) · HSE INDG479 · HTM 01-05 §5`,
  },
];

/* ─── Site-specific appendices ───────────────────────────────────────────── */

export const DEMO_APPENDICES = [
  // Southall
  {
    id: "doc-appendix-br-room",
    title: "Southall Decontamination Room Layout Appendix",
    type: DocumentType.appendix, category: "decontamination", scope: DocumentScope.site,
    appliesToSiteId: "site-brighton",
    parentDocumentId: "doc-sop-journey",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 110 }],
  },
  {
    id: "doc-appendix-br-flow",
    title: "Southall Instrument Flow Appendix",
    type: DocumentType.appendix, category: "decontamination", scope: DocumentScope.site,
    appliesToSiteId: "site-brighton",
    parentDocumentId: "doc-sop-journey",
    versions: [{ versionNumber: "1.1", status: DocumentStatus.published, publishedDaysAgo: 75 }],
  },
  {
    id: "doc-appendix-br-equip",
    title: "Southall Equipment List Appendix",
    type: DocumentType.appendix, category: "decontamination", scope: DocumentScope.site,
    appliesToSiteId: "site-brighton",
    parentDocumentId: "doc-sop-autoclave",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 60 }],
  },
  // Reading
  {
    id: "doc-appendix-hv-us",
    title: "Reading Ultrasonic Bath Workflow Appendix",
    type: DocumentType.appendix, category: "decontamination", scope: DocumentScope.site,
    appliesToSiteId: "site-hove",
    parentDocumentId: "doc-sop-ultrasonic",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 100 }],
  },
  {
    id: "doc-appendix-hv-waste",
    title: "Reading Local Waste Collection Appendix",
    type: DocumentType.appendix, category: "waste", scope: DocumentScope.site,
    appliesToSiteId: "site-hove",
    parentDocumentId: "doc-sop-clinical-waste",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 95 }],
  },
  // New Cross
  {
    id: "doc-appendix-wo-wd",
    title: "New Cross Washer-Disinfector Workflow Appendix",
    type: DocumentType.appendix, category: "decontamination", scope: DocumentScope.site,
    appliesToSiteId: "site-worthing",
    parentDocumentId: "doc-sop-wd",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 80 }],
  },
  {
    id: "doc-appendix-wo-wl",
    title: "New Cross Waterline Management Appendix",
    type: DocumentType.appendix, category: "waterlines", scope: DocumentScope.site,
    appliesToSiteId: "site-worthing",
    parentDocumentId: "doc-sop-waterline",
    versions: [{ versionNumber: "1.0", status: DocumentStatus.published, publishedDaysAgo: 60 }],
  },
];
