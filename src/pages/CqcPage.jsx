import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnOutline } from "../components/ui/Buttons";
import { Pill } from "../components/ui/Pill";
import { I } from "../components/Icon";
import { putFile } from "../services/clientFileStore";
import { useAuth } from "../auth/AuthContext";
import { listSites } from "../services/governance/sites.service";
import { ensureSeed } from "../services/governance/seed";
import { READINESS_METRICS } from "../services/readiness.service";
import { useModalA11y } from "../hooks/useModalA11y";
import {
  listAuditSubmissions, recordAuditSubmission,
  lastSubmissionFor, isOverdue, daysSince, gaugeStats,
  listIncidents, recordIncident, updateIncident, ensureCqcSeed,
} from "../services/cqc.service";
import styles from "./CqcPage.module.css";

// ── Audit definitions ─────────────────────────────────────────────────────────

const auditDefs = [
  // DECONTAMINATION & VALIDATION
  //
  // NOTE: the daily "Foil Test" used to live here. It moved to the
  // Daily Logbooks tab (logbookTemplates.js → foil_test_daily) so that
  // every DAILY-cadence reading has a single canonical entry point and
  // clinicians don't have to context-switch tabs for their muscle-
  // memory checks. This list now only carries the WEEKLY+ audits.
  {
    key: "protein",
    title: "Protein Residue Test",
    category: "decon",
    freq: "Weekly",
    description: "Ninhydrin protein residue test on a representative instrument to verify cleaning efficacy.",
    fields: [
      { key: "instrument_id", label: "Instrument Tested", type: "text", required: true },
      { key: "test_kit_lot", label: "Test Kit Lot No.", type: "text", required: true },
      { key: "result_reading", label: "Result Reading (µg/cm²)", type: "number", required: true },
    ],
    checks: [
      { key: "within_limit", label: "Result within acceptable limit (≤ 3 µg/cm²)" },
      { key: "visually_clean", label: "Instrument visually clean before test" },
      { key: "kit_in_date", label: "Test kit within expiry date" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },
  {
    key: "soil",
    title: "Soil Test",
    category: "decon",
    freq: "Weekly",
    description: "Process challenge device (PCD) test to validate washer-disinfector cleaning performance.",
    fields: [
      { key: "wd_id", label: "Washer-Disinfector ID", type: "text", required: true },
      { key: "cycle_no", label: "Cycle Number", type: "text", required: true },
      { key: "test_strip_lot", label: "Test Strip Lot No.", type: "text", required: true },
    ],
    checks: [
      { key: "soil_removed", label: "Test soil completely removed from PCD" },
      { key: "temp_reached", label: "Thermal disinfection temperature reached" },
      { key: "cycle_log_ok", label: "Cycle printout / log shows pass" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },
  {
    key: "sterilizer",
    title: "Sterilizer Validation",
    category: "decon",
    freq: "Annual",
    description: "Annual type test / periodic performance qualification for bench-top autoclave (HTM 01-05).",
    fields: [
      { key: "autoclave_id", label: "Autoclave ID / Serial No.", type: "text", required: true },
      { key: "engineer_name", label: "Validation Engineer", type: "text", required: true },
      { key: "company", label: "Validation Company", type: "text", required: true },
      { key: "next_due", label: "Next Validation Due Date", type: "date", required: true },
    ],
    checks: [
      { key: "pq_passed", label: "Performance qualification test passed" },
      { key: "printout_received", label: "Validation report / printout received" },
      { key: "certificate_filed", label: "Certificate issued and filed" },
      { key: "next_booked", label: "Next annual validation date confirmed" },
    ],
    photo: true,
    photoLabel: "Upload Validation Certificate",
    signatureLabel: "Practice Manager / Decon Lead Signature",
  },
  {
    key: "distiller",
    title: "Distiller Maintenance",
    category: "decon",
    freq: "Monthly",
    description: "Monthly inspection and maintenance log for the water distiller unit used in decontamination.",
    fields: [
      { key: "distiller_id", label: "Distiller ID / Make & Model", type: "text", required: true },
      { key: "conductivity", label: "Water Conductivity (µS/cm)", type: "number", required: true },
      { key: "filter_changed", label: "Filter Last Changed Date", type: "date", required: false },
    ],
    checks: [
      { key: "conductivity_ok", label: "Conductivity ≤ 15 µS/cm (BS EN 13060)" },
      { key: "tank_clean", label: "Reservoir / tank cleaned and descaled" },
      { key: "no_scale", label: "No visible scale or deposit in output nozzle" },
      { key: "drainage_ok", label: "Unit drains and refills correctly" },
    ],
    photo: true,
    photoLabel: "Upload Photo of Distiller & Conductivity Reading",
    signatureLabel: "Operator Signature",
  },
  {
    key: "decon_room",
    title: "Decontamination Room Audit",
    category: "decon",
    freq: "Monthly",
    description: "Full environmental audit of the decontamination room against HTM 01-05 zoning requirements.",
    fields: [
      { key: "auditor", label: "Auditor Name", type: "text", required: true },
    ],
    checks: [
      { key: "zoning", label: "Clean / dirty zone separation maintained" },
      { key: "workflow", label: "Single-direction workflow observed" },
      { key: "ppe", label: "Correct PPE available and in use" },
      { key: "surfaces_clean", label: "All surfaces clean and free from clutter" },
      { key: "sharps", label: "Sharps bins correctly labelled and < ¾ full" },
      { key: "eyewash", label: "Emergency eyewash station accessible and in date" },
      { key: "signage", label: "HTM 01-05 zoning signage clearly visible" },
    ],
    photo: true,
    photoLabel: "Upload Photo of Decontamination Room",
    signatureLabel: "Decon Lead / Practice Manager Signature",
  },

  // WATER & ENVIRONMENT SAFETY
  {
    key: "water_temps",
    title: "Hot & Cold Water Temperatures",
    category: "water",
    freq: "Monthly",
    description: "Legionella risk management — temperature checks at sentinel outlets (HTM 04-01).",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "hot_temp", label: "Hot Water Temp at Furthest Outlet (°C)", type: "number", required: true },
      { key: "cold_temp", label: "Cold Water Temp at Furthest Outlet (°C)", type: "number", required: true },
    ],
    checks: [
      { key: "hot_ok", label: "Hot water ≥ 50°C at all sentinel outlets" },
      { key: "cold_ok", label: "Cold water ≤ 20°C after running for 2 minutes" },
      { key: "no_odour", label: "No discolouration or unusual odour" },
      { key: "thermometer_cal", label: "Thermometer calibrated and within service date" },
    ],
    photo: false,
    signatureLabel: "Inspector Signature",
  },
  // NOTE: the daily "Fridge Temperature Log" used to live here. Both the
  // clinical vaccine fridge and the medication / material fridge now have
  // their own DAILY cards on the Daily Logbooks tab
  // (logbookTemplates.js → vaccine_fridge_daily + medication_fridge_daily)
  // so the cold-chain attestation has a single canonical home.
  {
    key: "dip_slide",
    title: "Dip Slide Test",
    category: "water",
    freq: "Monthly",
    description: "Microbiological water quality test using dip slides on dental unit waterlines (HTM 01-05).",
    fields: [
      { key: "unit_id", label: "Dental Unit ID", type: "text", required: true },
      { key: "slide_lot", label: "Dip Slide Lot No.", type: "text", required: true },
      { key: "cfu_result", label: "CFU Result (colony forming units/mL)", type: "text", required: true },
      { key: "incubation_date", label: "Incubation Start Date", type: "date", required: true },
    ],
    checks: [
      { key: "result_ok", label: "Result ≤ 200 CFU/mL (HTM 01-05 limit)" },
      { key: "shocked", label: "Waterline shock dosing performed this period" },
      { key: "slide_in_date", label: "Dip slide within expiry date" },
    ],
    photo: false,
    signatureLabel: "Operator Signature",
  },

  // HEALTH, SAFETY & PREMISES
  {
    key: "fire_safety",
    title: "Fire Safety Check",
    category: "safety",
    freq: "Monthly",
    description: "Monthly fire safety inspection of all equipment, emergency lighting, and escape routes.",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
    ],
    checks: [
      { key: "extinguishers", label: "All fire extinguishers within annual service date" },
      { key: "exits_clear", label: "All fire exits clear and unobstructed" },
      { key: "em_lighting", label: "Emergency lighting tested and functional" },
      { key: "alarm_tested", label: "Fire alarm test completed this period" },
      { key: "assembly_signed", label: "Assembly point sign clearly visible" },
      { key: "evac_plan", label: "Evacuation plan posted on each floor" },
      { key: "marshal_trained", label: "Fire marshal trained staff member on site" },
    ],
    photo: false,
    signatureLabel: "Fire Marshal / Manager Signature",
  },
  {
    key: "med_kit",
    title: "Medical Emergency Kit",
    category: "safety",
    freq: "Monthly",
    description: "Inspection of medical emergency drug kit and resuscitation equipment (GDC Standards).",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "kit_location", label: "Kit Location", type: "text", required: true },
    ],
    checks: [
      { key: "adrenaline", label: "Adrenaline (epinephrine) 1:1000 — in date" },
      { key: "midazolam", label: "Midazolam (Epistatus) — in date" },
      { key: "glucagon", label: "Glucagon kit — in date" },
      { key: "oxygen", label: "Oxygen cylinder above 25% capacity" },
      { key: "aed", label: "AED charged with pads in date" },
      { key: "aspirin", label: "Aspirin 300 mg — in date" },
      { key: "gtn", label: "GTN spray — in date" },
      { key: "bvm", label: "Bag-valve-mask (BVM) present and complete" },
    ],
    photo: false,
    signatureLabel: "Responsible Clinician / Manager Signature",
  },
  {
    key: "material_expiry",
    title: "Material Expiry Check",
    category: "safety",
    freq: "Monthly",
    description: "Systematic check of clinical consumable and material expiry dates across all surgeries.",
    fields: [
      { key: "inspector", label: "Inspector Name", type: "text", required: true },
      { key: "areas", label: "Areas / Surgeries Checked", type: "text", required: true },
      { key: "expired_items", label: "Expired Items Found (or 'None')", type: "text", required: true },
    ],
    checks: [
      { key: "no_expired", label: "No expired clinical materials left in use" },
      { key: "la_in_date", label: "Local anaesthetic cartridges all in date" },
      { key: "impression_in_date", label: "Impression materials all in date" },
      { key: "near_expiry_flagged", label: "Items expiring within 30 days flagged for replacement" },
    ],
    photo: false,
    signatureLabel: "Inspector Signature",
  },

  // INFECTION PREVENTION & CONTROL (IPC) ───────────────────────────────────
  {
    key: "ipc_self_assessment",
    title: "IPC Self-Assessment",
    category: "ipc",
    freq: "Annual",
    description: "Whole-practice infection prevention and control self-assessment against CGDent / FGDP guidance and CQC Regulation 12. Required at least annually; supports the IPC lead role.",
    fields: [
      { key: "ipc_lead", label: "IPC Lead Name", type: "text", required: true },
      { key: "audit_date", label: "Audit Date", type: "date", required: true },
      { key: "next_review", label: "Next Annual Review Date", type: "date", required: true },
      { key: "non_compliant_actions", label: "Non-compliant items — actions / owners", type: "text", required: false },
    ],
    checks: [
      { key: "ldu_compliant", label: "Local Decontamination Unit meets HTM 01-05 zoning and workflow" },
      { key: "hand_hygiene", label: "Hand hygiene infrastructure (sinks, soap, towels, alcohol gel) compliant" },
      { key: "ppe_provision", label: "PPE provided, fit-tested where needed, training records up to date" },
      { key: "sharps_safe", label: "Sharps safety devices in use; safe disposal at point of use; bins ¾ rule" },
      { key: "surface_decon", label: "Surface decontamination protocols and product use logs in place" },
      { key: "duwl_managed", label: "DUWL monitoring (CFU ≤ 200/mL) and HTM 04-01 sentinel outlet logs current" },
      { key: "waste_segregated", label: "Clinical waste segregation per HTM 07-01; consignment notes retained 2+ years" },
      { key: "spillage_kit", label: "Spillage management kit available; staff trained; protocol displayed" },
      { key: "immunisation", label: "Staff immunisation records (Hep B, tetanus, MMR, etc.) up to date" },
      { key: "amr_policy", label: "Antimicrobial stewardship policy in place and audited" },
      { key: "training_records", label: "IPC training completed by all clinical staff and recorded" },
      { key: "outbreak_protocol", label: "Outbreak / cluster reporting protocol documented (UKHSA notifiable disease pathway)" },
      { key: "single_use", label: "Single-use items not reprocessed; manufacturer instructions followed" },
      { key: "linen_handling", label: "Linen / uniform laundering protocol meets healthcare laundry standards" },
      { key: "patient_environment", label: "Patient-facing environment visibly clean; cleaning logs current" },
    ],
    photo: true,
    photoLabel: "Upload IPC Self-Assessment Report / Evidence",
    signatureLabel: "IPC Lead / Clinical Governance Lead Signature",
  },
  {
    key: "hand_hygiene_audit",
    title: "Hand Hygiene — WHO 5 Moments",
    category: "ipc",
    freq: "Monthly",
    description: "Observational audit of hand hygiene compliance against the WHO 5 Moments framework. NICE QS61 expects audit and feedback as part of IPC governance.",
    fields: [
      { key: "auditor", label: "Auditor Name", type: "text", required: true },
      { key: "area", label: "Area / Surgery / Practice", type: "text", required: true },
      { key: "obs_total", label: "Total Observations", type: "number", required: true },
      { key: "obs_compliant", label: "Compliant Observations", type: "number", required: true },
      { key: "obs_percent", label: "Compliance Rate (%)", type: "number", required: true },
    ],
    checks: [
      { key: "m1", label: "Moment 1 — Before patient contact: observed and compliant" },
      { key: "m2", label: "Moment 2 — Before aseptic / clean task: observed and compliant" },
      { key: "m3", label: "Moment 3 — After body fluid exposure risk: observed and compliant" },
      { key: "m4", label: "Moment 4 — After patient contact: observed and compliant" },
      { key: "m5", label: "Moment 5 — After contact with patient surroundings: observed and compliant" },
      { key: "technique_ok", label: "Technique correct (soap + water 40–60 s OR alcohol gel 20–30 s, all surfaces)" },
      { key: "no_ppe_substitute", label: "PPE not worn as a substitute for hand hygiene" },
      { key: "bare_below_elbows", label: "Bare-below-elbows policy observed (no wrist watches, no nail polish, no false nails)" },
      { key: "feedback_given", label: "Real-time feedback given to staff observed; learning logged" },
      { key: "target_met", label: "Compliance rate meets local target (typically ≥ 95%)" },
    ],
    photo: false,
    signatureLabel: "Auditor / IPC Lead Signature",
  },

  // RADIATION SAFETY & IR(ME)R ─────────────────────────────────────────────
  {
    key: "radiograph_quality",
    title: "Radiograph Quality Audit (A/N)",
    category: "radiation",
    freq: "Annual",
    description: "Two-grade quality audit (Acceptable / Not Acceptable) of recent radiographs per CGDent / FGDP(UK) Selection Criteria 3rd ed. Required by IR(ME)R 2017 + 2024 Employer's Procedures.",
    fields: [
      { key: "auditor", label: "Auditor (IR(ME)R Practitioner)", type: "text", required: true },
      { key: "audit_period", label: "Audit Period (e.g. Q1 2026)", type: "text", required: true },
      { key: "sample_size", label: "Sample Size (radiographs reviewed)", type: "number", required: true },
      { key: "grade_a", label: "Grade A — Acceptable count", type: "number", required: true },
      { key: "grade_n", label: "Grade N — Not Acceptable count", type: "number", required: true },
      { key: "percent_acceptable", label: "Acceptable Rate (%)", type: "number", required: true },
      { key: "repeat_rate", label: "Repeat-Exposure Rate (%)", type: "number", required: false },
      { key: "root_causes", label: "Root causes for Grade N findings", type: "text", required: false },
    ],
    checks: [
      { key: "random_sample", label: "Random sample drawn from the audit period" },
      { key: "all_operators", label: "Sample covers all operators taking radiographs" },
      { key: "all_view_types", label: "All view types in use (BW, PA, OPT, CBCT) represented" },
      { key: "target_met", label: "Grade A rate ≥ 95% (current FGDP standard)" },
      { key: "n_investigated", label: "Each Grade N finding has documented root-cause analysis" },
      { key: "corrective_action", label: "Corrective actions / targeted retraining recorded for non-compliant operators" },
      { key: "repeat_tracked", label: "Repeat-exposure rate tracked per operator" },
      { key: "report_filed", label: "Audit report filed in IR(ME)R log with sample list and findings" },
      { key: "next_audit_booked", label: "Next audit scheduled (typically annual minimum, more frequent for high-volume)" },
    ],
    photo: true,
    photoLabel: "Upload Audit Report / Sample List",
    signatureLabel: "IR(ME)R Practitioner / Clinical Governance Lead Signature",
  },

  // GOVERNANCE — CLINICAL & WORKFORCE ──────────────────────────────────────
  {
    key: "antibiotic_prescribing",
    title: "Antibiotic Prescribing Audit",
    category: "governance",
    freq: "Annual",
    description: "Audit of dental antibiotic prescribing against FGDP / SDCEP antimicrobial stewardship guidance and the Dental Antimicrobial Stewardship Toolkit. Current CQC inspection focus area.",
    fields: [
      { key: "auditor", label: "Audit Lead Name", type: "text", required: true },
      { key: "audit_period", label: "Audit Period (e.g. 12 months to May 2026)", type: "text", required: true },
      { key: "sample_size", label: "Prescriptions Reviewed (n)", type: "number", required: true },
      { key: "indicated_count", label: "Indicated per FGDP/SDCEP guidance (n)", type: "number", required: true },
      { key: "broad_spectrum_count", label: "Broad-spectrum prescriptions (n)", type: "number", required: false },
      { key: "non_compliant_actions", label: "Actions for non-compliant prescriptions", type: "text", required: false },
    ],
    checks: [
      { key: "sdcep_aligned", label: "Indications align with SDCEP Drug Prescribing for Dentistry" },
      { key: "first_line_used", label: "First-line agents used (amoxicillin / metronidazole) where appropriate" },
      { key: "no_routine_pre_op", label: "No routine pre-operative antibiotic prophylaxis (NICE CG64)" },
      { key: "drainage_prioritised", label: "Drainage / source control documented before antibiotics" },
      { key: "duration_appropriate", label: "Duration 3–5 days; not longer than guidance" },
      { key: "allergy_documented", label: "Allergy status documented for every prescription" },
      { key: "review_arranged", label: "Patient review arranged for prescribed cases" },
      { key: "feedback_to_clinicians", label: "Audit findings fed back to individual clinicians" },
      { key: "policy_in_date", label: "Practice antibiotic policy reviewed within 12 months" },
      { key: "target_aware", label: "Practice signed up to TARGET Antibiotics Toolkit / Dental AMS Toolkit" },
    ],
    photo: true,
    photoLabel: "Upload Audit Report",
    signatureLabel: "Audit Lead / Clinical Governance Lead Signature",
  },
  {
    key: "record_keeping_audit",
    title: "Patient Record-Keeping Audit",
    category: "governance",
    freq: "Annual",
    description: "Audit of clinical record completeness against FGDP / CGDent Clinical Examination and Record-Keeping Good Practice Guidelines and GDC Principles 4.",
    fields: [
      { key: "auditor", label: "Audit Lead Name", type: "text", required: true },
      { key: "audit_period", label: "Audit Period", type: "text", required: true },
      { key: "sample_size", label: "Records Reviewed (n)", type: "number", required: true },
      { key: "percent_complete", label: "Records meeting all essential criteria (%)", type: "number", required: true },
      { key: "weakest_area", label: "Weakest area identified", type: "text", required: false },
    ],
    checks: [
      { key: "mh_current", label: "Medical history reviewed and updated each visit" },
      { key: "exam_findings", label: "Comprehensive intra/extra-oral exam recorded" },
      { key: "diagnosis_recorded", label: "Clinical diagnosis stated for each treatment" },
      { key: "treatment_options", label: "Treatment options discussed and recorded" },
      { key: "consent_documented", label: "Consent process documented (verbal/written, risks discussed)" },
      { key: "costs_recorded", label: "Costs / NHS-private status discussed and recorded" },
      { key: "radiographs_justified", label: "Every radiograph justified and graded (A/N)" },
      { key: "perio_screening", label: "BPE / 6-point chart recorded at intervals per BSP" },
      { key: "safety_netting", label: "Safety-net advice recorded where relevant" },
      { key: "contemporaneous", label: "Records made contemporaneously, signed and dated" },
      { key: "no_alterations", label: "No undocumented retrospective alterations" },
      { key: "feedback_provided", label: "Individual clinician feedback delivered" },
    ],
    photo: false,
    signatureLabel: "Audit Lead / Clinical Governance Lead Signature",
  },
  {
    key: "mercury_amalgam",
    title: "Mercury & Amalgam Separator Evidence",
    category: "governance",
    freq: "Annual",
    description: "Annual evidence log for amalgam separator service and amalgam waste consignment per EU Mercury Regulation 2017/852 (retained in UK law) and HTM 07-01.",
    fields: [
      { key: "auditor", label: "Responsible Person", type: "text", required: true },
      { key: "separator_make", label: "Amalgam Separator — Make / Model", type: "text", required: true },
      { key: "separator_eff", label: "Manufacturer-stated efficiency (%)", type: "number", required: true },
      { key: "service_date", label: "Last service / maintenance date", type: "date", required: true },
      { key: "next_service", label: "Next service due date", type: "date", required: true },
      { key: "consignor_id", label: "Waste consignor reference / contractor", type: "text", required: true },
    ],
    checks: [
      { key: "separator_compliant", label: "Separator meets ISO 11143 ≥ 95% retention efficiency" },
      { key: "serviced_in_date", label: "Annual service completed and certificate retained" },
      { key: "waste_segregated", label: "Amalgam waste segregated from clinical waste at point of use" },
      { key: "consignment_notes", label: "Hazardous waste consignment notes retained 3+ years" },
      { key: "no_amalgam_under_15", label: "No amalgam placed in under-15s or pregnant / breastfeeding patients (Mercury Reg restriction)" },
      { key: "encapsulated_only", label: "Encapsulated amalgam used; no loose mercury on site" },
      { key: "spillage_kit", label: "Mercury spillage kit on site, in date, staff trained" },
      { key: "alt_materials", label: "Alternative restorative materials available and offered" },
      { key: "policy_in_date", label: "Mercury / amalgam policy reviewed within 12 months" },
    ],
    photo: true,
    photoLabel: "Upload Separator Service Certificate & Latest Consignment Note",
    signatureLabel: "Responsible Person / Practice Manager Signature",
  },
  {
    key: "reg19_fpp",
    title: "Reg 19 Fit & Proper Persons Trail",
    category: "governance",
    freq: "Annual",
    description: "Annual review of CQC Regulation 19 fit-and-proper-persons requirements — DBS, immunisation, GDC registration, indemnity, references and ongoing training for every clinical staff member.",
    fields: [
      { key: "auditor", label: "HR / Practice Manager Name", type: "text", required: true },
      { key: "audit_date", label: "Audit Date", type: "date", required: true },
      { key: "staff_total", label: "Clinical Staff in Scope (n)", type: "number", required: true },
      { key: "staff_compliant", label: "Staff with complete file (n)", type: "number", required: true },
      { key: "gap_actions", label: "Outstanding gaps and remedial actions", type: "text", required: false },
    ],
    checks: [
      { key: "gdc_check", label: "GDC registration verified for every dental professional (annual re-check)" },
      { key: "dbs_in_date", label: "Enhanced DBS in date for every clinical role (≤ 3 years typical)" },
      { key: "right_to_work", label: "Right-to-work documentation on file" },
      { key: "references", label: "Two references on file for every clinical hire" },
      { key: "occ_health", label: "Occupational health clearance / Hep B immunisation status documented" },
      { key: "indemnity", label: "Current indemnity / professional liability cover verified" },
      { key: "training_records", label: "CPD / mandatory training records up to date (BLS, IPC, safeguarding, IR(ME)R, AMS)" },
      { key: "appraisal_current", label: "Annual appraisal completed for every clinical staff member" },
      { key: "safeguarding_level", label: "Safeguarding training to appropriate level (Level 2 minimum, Level 3 for safeguarding lead)" },
      { key: "policy_signed", label: "Policy and procedures signed and acknowledged on induction and at policy update" },
      { key: "no_outstanding_gaps", label: "All identified gaps have remedial plan with owner and date" },
    ],
    photo: false,
    signatureLabel: "HR Lead / Registered Manager Signature",
  },
];

const categories = [
  {
    key: "decon",
    label: "Decontamination & Validation",
    subtitle: "HTM 01-05 Compliance",
    icon: "shield",
    color: "#006974",
    bg: "rgba(0,105,116,0.07)",
  },
  {
    key: "water",
    label: "Water & Environment Safety",
    subtitle: "Legionella & Microbiological Controls",
    icon: "cloud",
    color: "#0077aa",
    bg: "rgba(0,119,170,0.07)",
  },
  {
    key: "safety",
    label: "Health, Safety & Premises",
    subtitle: "CQC Regulation 12 & Fire Safety",
    icon: "checksquare",
    color: "#2e7d32",
    bg: "rgba(46,125,50,0.07)",
  },
  {
    key: "ipc",
    label: "Infection Prevention & Control",
    subtitle: "CGDent / FGDP IPC · CQC Reg 12 · WHO 5 Moments",
    icon: "shieldalert",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.07)",
  },
  {
    key: "radiation",
    label: "Radiation Safety & IR(ME)R",
    subtitle: "IR(ME)R 2017 + 2024 · CGDent Selection Criteria",
    icon: "monitor",
    color: "#b45309",
    bg: "rgba(180,83,9,0.07)",
  },
  {
    key: "governance",
    label: "Clinical & Workforce Governance",
    subtitle: "AMS · Records · Mercury Reg · CQC Reg 19 FPP",
    icon: "briefcase",
    color: "#374151",
    bg: "rgba(55,65,81,0.07)",
  },
];

const freqColors = {
  Daily:   { bg: "rgba(168,56,54,0.12)",  color: "#a83836" },
  Weekly:  { bg: "rgba(147,75,0,0.13)",   color: "#934b00" },
  Monthly: { bg: "rgba(0,105,116,0.12)",  color: "#005c66" },
  Annual:  { bg: "rgba(72,60,130,0.12)",  color: "#3d3380" },
};

// ── Signature Pad ─────────────────────────────────────────────────────────────

const SignaturePad = ({ canvasRef, onDrawn }) => {
  const isDrawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * (canvas.width / rect.width),
      y: (src.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDraw = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      isDrawing.current = true;
      lastPos.current = getPos(e, canvas);
    },
    [canvasRef]
  );

  const draw = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const pos = getPos(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#1a2b2c";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
      onDrawn(true);
    },
    [canvasRef, onDrawn]
  );

  const stopDraw = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    onDrawn(false);
  };

  return (
    <div className={styles.sigWrap}>
      <canvas
        ref={canvasRef}
        className={styles.sigCanvas}
        width={560}
        height={100}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <button type="button" className={styles.sigClear} onClick={clearSig}>
        Clear
      </button>
    </div>
  );
};

// ── Audit Modal ───────────────────────────────────────────────────────────────

const AuditModal = ({ def, onClose, onComplete }) => {
  const dialogRef = useModalA11y(onClose);
  const [formData, setFormData] = useState({});
  const [checks, setChecks] = useState({});
  const [sigDrawn, setSigDrawn] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);

  const setField = (key, val) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const toggleCheck = (key) =>
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePhoto = async (e) => {
    const files = Array.from(e.target.files);
    const stored = await Promise.all(
      files.map(async (f) => {
        const { key } = await putFile("cqc", f, { auditKey: def.key });
        return { key, url: URL.createObjectURL(f), name: f.name };
      }),
    );
    setPhotos((prev) => [...prev, ...stored]);
  };

  const validate = () => {
    const errs = {};
    def.fields
      .filter((f) => f.required)
      .forEach((f) => {
        if (!formData[f.key]?.toString().trim()) errs[f.key] = "Required";
      });
    if (!sigDrawn) errs._sig = "Please sign before submitting";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    const signatureDataUrl = canvasRef.current?.toDataURL("image/png") ?? null;
    onComplete(def.key, {
      formData,
      checks,
      photoKeys: photos.map((p) => p.key),
      signatureDataUrl,
    });
  };

  if (submitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div ref={dialogRef} className={styles.modal} onClick={(e) => e.stopPropagation()} aria-labelledby="audit-recorded-title">
          <div className={styles.successScreen}>
            <div className={styles.successIcon}>
              <I name="checkcircle" size={52} color="var(--success)" />
            </div>
            <h2 id="audit-recorded-title" className={styles.successTitle}>Audit Recorded</h2>
            <p className={styles.successMsg}>
              <strong>{def.title}</strong> has been submitted and the readiness gauge updated.
            </p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        ref={dialogRef}
        className={styles.modal}
        aria-labelledby="cqc-audit-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>
            <h2 id="cqc-audit-title" className={styles.modalTitle}>{def.title}</h2>
            <p className={styles.modalSub}>{def.description}</p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <I name="xcircle" size={22} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Form fields */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="file" size={14} /> Form Details
            </h3>
            <div className={styles.fieldGrid}>
              {def.fields.map((f) => (
                <div key={f.key} className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>
                    {f.label}
                    {f.required && <span className={styles.req}> *</span>}
                  </label>
                  <input
                    type={f.type}
                    className={`${styles.fieldInput} ${
                      errors[f.key] ? styles.fieldInputErr : ""
                    }`}
                    value={formData[f.key] || ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                  {errors[f.key] && (
                    <span className={styles.errMsg}>{errors[f.key]}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Checklist */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="checksquare" size={14} /> Checklist
            </h3>
            <div className={styles.checkList}>
              {def.checks.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`${styles.checkRow} ${
                    checks[c.key] ? styles.checkRowDone : ""
                  }`}
                  onClick={() => toggleCheck(c.key)}
                >
                  <span className={styles.checkBox}>
                    {checks[c.key] ? <I name="check" size={13} /> : null}
                  </span>
                  <span className={styles.checkLabel}>{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Photo upload */}
          {def.photo && (
            <section className={styles.modalSection}>
              <h3 className={styles.sectionLabel}>
                <I name="camera" size={14} /> {def.photoLabel}
              </h3>
              <label className={styles.photoUpload}>
                <I name="upload" size={20} />
                <span>Click to upload photo(s)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhoto}
                  style={{ display: "none" }}
                />
              </label>
              {photos.length > 0 && (
                <div className={styles.photoPreview}>
                  {photos.map((p, i) => (
                    <img
                      key={p.key ?? i}
                      src={p.url}
                      alt={p.name ?? `Upload ${i + 1}`}
                      className={styles.photoThumb}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Signature */}
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}>
              <I name="edit" size={14} /> {def.signatureLabel}
            </h3>
            <SignaturePad canvasRef={canvasRef} onDrawn={setSigDrawn} />
            {errors._sig && (
              <span className={styles.errMsg}>{errors._sig}</span>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <BtnOutline onClick={onClose}>Cancel</BtnOutline>
          <BtnPrimary type="submit">Submit Audit</BtnPrimary>
        </div>
      </form>
    </div>
  );
};

// ── Incident Reporting ───────────────────────────────────────────────────────

const INCIDENT_TYPES = [
  "Needlestick / Sharps Injury",
  "Medication / Prescribing Error",
  "Patient Fall or Injury",
  "Equipment Failure or Defect",
  "Infection Control Breach",
  "Staff Injury (Non-Sharps)",
  "Near Miss",
  "Data / Information Breach",
  "Verbal Complaint or Concern",
  "Other",
];

const incidentSeverityCfg = {
  Low:    { bg: "rgba(37,111,42,0.12)",   color: "#256f2a" },
  Medium: { bg: "rgba(147,75,0,0.12)",   color: "#934b00" },
  High:   { bg: "rgba(166,27,27,0.12)",  color: "#a61b1b" },
};

const incidentStatusCfg = {
  Open:           { bg: "rgba(166,27,27,0.12)",  color: "#a61b1b" },
  "Under Review": { bg: "rgba(147,75,0,0.12)",   color: "#934b00" },
  Closed:         { bg: "rgba(37,111,42,0.12)",   color: "#256f2a" },
};

const initialIncidents = [
  {
    id: 1,
    type: "Needlestick / Sharps Injury",
    severity: "High",
    date: "2026-04-28",
    reportedBy: "Dr. Callum Lead",
    description: "Needlestick to left index finger whilst recapping a used local anaesthetic needle. Wound irrigated immediately.",
    actionTaken: "Wound irrigated. Occupational health notified. Patient blood-borne virus status reviewed.",
    status: "Under Review",
  },
  {
    id: 2,
    type: "Equipment Failure or Defect",
    severity: "Medium",
    date: "2026-04-22",
    reportedBy: "Dr. Amir Dentist",
    description: "Autoclave displayed cycle failure error mid-run. Load quarantined and not released for use.",
    actionTaken: "Load quarantined. Engineer scheduled. Backup autoclave brought into use.",
    status: "Open",
  },
  {
    id: 3,
    type: "Near Miss",
    severity: "Low",
    date: "2026-04-15",
    reportedBy: "Dr. Hannah Reed",
    description: "Patient prescribed incorrect dose of amoxicillin — error identified by reception before dispensing to patient.",
    actionTaken: "Prescription corrected. Clinician briefed on double-check prescribing policy.",
    status: "Closed",
  },
];

const ReportIncidentModal = ({ onClose, onSave }) => {
  const dialogRef = useModalA11y(onClose);
  const [form, setForm] = useState({
    type: "", severity: "Low",
    date: new Date().toISOString().slice(0, 10),
    reportedBy: "", description: "", actionTaken: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.type) e.type = "Required";
    if (!form.reportedBy.trim()) e.reportedBy = "Required";
    if (!form.description.trim()) e.description = "Required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ id: Date.now(), ...form, status: "Open" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div ref={dialogRef} className={styles.modal} onClick={e => e.stopPropagation()} aria-labelledby="incident-reported-title">
          <div className={styles.successScreen}>
            <div className={styles.successIcon}><I name="checkcircle" size={52} color="var(--success)" /></div>
            <h2 id="incident-reported-title" className={styles.successTitle}>Incident Reported</h2>
            <p className={styles.successMsg}>The incident has been logged. For High severity events, notify the practice lead and relevant authority directly.</p>
            <BtnPrimary onClick={onClose}>Done</BtnPrimary>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={dialogRef} className={styles.modal} onClick={e => e.stopPropagation()} aria-labelledby="report-incident-title">
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderText}>
            <h2 id="report-incident-title" className={styles.modalTitle}>Report an Incident</h2>
            <p className={styles.modalSub}>Log a clinical or operational incident, near miss, or safety concern.</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <I name="xcircle" size={22} />
          </button>
        </div>
        <div className={styles.modalBody}>
          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}><I name="file" size={14} /> Incident Details</h3>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldRow} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.fieldLabel}>Incident Type <span className={styles.req}>*</span></label>
                <select className={`${styles.fieldInput} ${errors.type ? styles.fieldInputErr : ""}`}
                  aria-label="Incident type"
                  value={form.type} onChange={e => set("type", e.target.value)}>
                  <option value="">Select type…</option>
                  {INCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                {errors.type && <span className={styles.errMsg}>{errors.type}</span>}
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Severity</label>
                <div className={styles.severityBtnGroup}>
                  {["Low", "Medium", "High"].map(s => (
                    <button key={s} type="button"
                      className={`${styles.severityBtn} ${form.severity === s ? styles.severityBtnActive : ""}`}
                      style={form.severity === s ? { background: incidentSeverityCfg[s].bg, color: incidentSeverityCfg[s].color, borderColor: incidentSeverityCfg[s].color } : {}}
                      onClick={() => set("severity", s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Date of Incident</label>
                <input type="date" className={styles.fieldInput}
                  aria-label="Date of incident"
                  value={form.date} onChange={e => set("date", e.target.value)} />
              </div>
              <div className={styles.fieldRow} style={{ gridColumn: "1 / -1" }}>
                <label className={styles.fieldLabel}>Reported By <span className={styles.req}>*</span></label>
                <input className={`${styles.fieldInput} ${errors.reportedBy ? styles.fieldInputErr : ""}`}
                  value={form.reportedBy} onChange={e => set("reportedBy", e.target.value)}
                  placeholder="Your full name" />
                {errors.reportedBy && <span className={styles.errMsg}>{errors.reportedBy}</span>}
              </div>
            </div>
          </section>

          <section className={styles.modalSection}>
            <h3 className={styles.sectionLabel}><I name="file" size={14} /> Description &amp; Actions</h3>
            <div className={styles.fieldRow} style={{ marginBottom: 12 }}>
              <label className={styles.fieldLabel}>What happened? <span className={styles.req}>*</span></label>
              <textarea className={`${styles.fieldInput} ${errors.description ? styles.fieldInputErr : ""}`}
                rows={3} value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Describe what happened, where, and who was involved…"
                style={{ resize: "vertical" }} />
              {errors.description && <span className={styles.errMsg}>{errors.description}</span>}
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Immediate action taken <span style={{ fontWeight: 400, color: "var(--on-surface-variant)" }}>(optional)</span>
              </label>
              <textarea className={styles.fieldInput} rows={2}
                value={form.actionTaken} onChange={e => set("actionTaken", e.target.value)}
                placeholder="What steps were taken immediately after the incident?"
                style={{ resize: "vertical" }} />
            </div>
          </section>
        </div>
        <div className={styles.modalFooter}>
          <BtnOutline onClick={onClose}>Cancel</BtnOutline>
          <BtnPrimary onClick={handleSave}><I name="alert" size={13} /> Submit Report</BtnPrimary>
        </div>
      </div>
    </div>
  );
};

// ── Incident Row (expandable) ─────────────────────────────────────────────────

const ESCALATION_RULES = {
  reg18: {
    label: "CQC Reg 18",
    fullLabel: "Care Quality Commission — Reg 18 Notification of Other Incidents",
    color: "#a83836",
    rationale: "Statutory notification under the Care Quality Commission (Registration) Regulations 2009, Regulation 18. The CQC must be informed of certain incidents affecting the regulated activity.",
    captureFields: [
      { key: "reference", label: "CQC notification reference (if provided)" },
      { key: "notes",     label: "Notes — date submitted, route used (CQC Provider Portal, e-mail, etc.)" },
    ],
  },
  dutyOfCandour: {
    label: "Duty of Candour",
    fullLabel: "Regulation 20 — Duty of Candour (statutory)",
    color: "#a61b1b",
    rationale: "Statutory duty under Regulation 20 of the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014. The patient (or representative) must be told in person, with a follow-up written notification, of any notifiable safety incident.",
    captureFields: [
      { key: "notes",     label: "Record of conversation, date, person spoken to, written follow-up sent" },
    ],
  },
  riddor: {
    label: "RIDDOR",
    fullLabel: "RIDDOR 2013 — HSE notification",
    color: "#934b00",
    rationale: "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013. Specified injuries, over-7-day worker absences, and dangerous occurrences (including certain sharps incidents) must be reported to HSE.",
    captureFields: [
      { key: "reference", label: "HSE notification reference (F2508 or RIDDOR online reference)" },
      { key: "notes",     label: "Notes — date submitted, reporter, follow-up actions" },
    ],
  },
};

const EscalationCard = ({ ruleKey, escalation, incidentId, tenantId, onUpdated }) => {
  const rule = ESCALATION_RULES[ruleKey];
  const [showRecord, setShowRecord] = useState(false);
  const [draft, setDraft] = useState({ reference: "", notes: "" });
  const handleMark = () => {
    onUpdated((current) => {
      const next = {
        ...current.escalations[ruleKey],
        notified: true,
        notifiedAt: new Date().toISOString(),
        reference: draft.reference || null,
        notes: draft.notes || null,
      };
      return updateIncident(tenantId, incidentId, {
        escalations: { ...current.escalations, [ruleKey]: next },
      });
    });
    setShowRecord(false);
  };
  return (
    <div className={styles.escCard} style={{ borderLeftColor: rule.color }}>
      <div className={styles.escHead}>
        <div>
          <div className={styles.escTitle} style={{ color: rule.color }}>{rule.fullLabel}</div>
          <div className={styles.escRationale}>{rule.rationale}</div>
        </div>
        {escalation.notified ? (
          <span className={styles.escDone}><I name="checkcircle" size={14} /> Notified · {new Date(escalation.notifiedAt).toLocaleDateString("en-GB")}</span>
        ) : (
          <span className={styles.escRequired} style={{ background: `${rule.color}1a`, color: rule.color }}>Required — not yet notified</span>
        )}
      </div>
      {escalation.notified && (escalation.reference || escalation.notes) && (
        <div className={styles.escDetail}>
          {escalation.reference && <div><strong>Ref:</strong> {escalation.reference}</div>}
          {escalation.notes && <div><strong>Notes:</strong> {escalation.notes}</div>}
        </div>
      )}
      {!escalation.notified && !showRecord && (
        <button type="button" className={styles.escRecordBtn} onClick={() => setShowRecord(true)}>
          <I name="edit" size={12} /> Record notification
        </button>
      )}
      {!escalation.notified && showRecord && (
        <div className={styles.escForm}>
          {rule.captureFields.map((f) => (
            <div key={f.key} className={styles.fieldRow}>
              <label className={styles.fieldLabel}>{f.label}</label>
              <input
                className={styles.fieldInput}
                value={draft[f.key] ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <BtnOutline onClick={() => setShowRecord(false)}>Cancel</BtnOutline>
            <BtnPrimary onClick={handleMark}><I name="check" size={12} /> Confirm notified</BtnPrimary>
          </div>
        </div>
      )}
    </div>
  );
};

const SeaCard = ({ sea, incidentId, tenantId, onUpdated }) => {
  const [draft, setDraft] = useState({ rootCause: sea.rootCause ?? "", learning: sea.learning ?? "" });
  const [editing, setEditing] = useState(!sea.completed);
  const handleSave = () => {
    onUpdated((current) => updateIncident(tenantId, incidentId, {
      sea: {
        ...current.sea,
        rootCause: draft.rootCause,
        learning: draft.learning,
        completed: !!draft.rootCause && !!draft.learning,
        completedAt: new Date().toISOString(),
      },
    }));
    setEditing(false);
  };
  return (
    <div className={styles.escCard} style={{ borderLeftColor: "#7c3aed" }}>
      <div className={styles.escHead}>
        <div>
          <div className={styles.escTitle} style={{ color: "#7c3aed" }}>Significant Event Analysis (SEA)</div>
          <div className={styles.escRationale}>High-severity incidents require a root-cause analysis and documented learning before the incident can be closed. SEAs feed practice-wide learning and the next clinical governance review.</div>
        </div>
        {sea.completed ? (
          <span className={styles.escDone}><I name="checkcircle" size={14} /> Completed · {new Date(sea.completedAt).toLocaleDateString("en-GB")}</span>
        ) : (
          <span className={styles.escRequired} style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed" }}>Required — not yet completed</span>
        )}
      </div>
      {editing && (
        <div className={styles.escForm}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Root cause analysis</label>
            <textarea
              className={styles.fieldInput}
              rows={3}
              value={draft.rootCause}
              onChange={(e) => setDraft((d) => ({ ...d, rootCause: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Learning / system change</label>
            <textarea
              className={styles.fieldInput}
              rows={3}
              value={draft.learning}
              onChange={(e) => setDraft((d) => ({ ...d, learning: e.target.value }))}
              style={{ resize: "vertical" }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            {sea.completed && <BtnOutline onClick={() => setEditing(false)}>Cancel</BtnOutline>}
            <BtnPrimary onClick={handleSave}><I name="check" size={12} /> Save SEA</BtnPrimary>
          </div>
        </div>
      )}
      {!editing && sea.completed && (
        <div className={styles.escDetail}>
          <div><strong>Root cause:</strong> {sea.rootCause}</div>
          <div><strong>Learning:</strong> {sea.learning}</div>
          <button type="button" className={styles.escRecordBtn} onClick={() => setEditing(true)}>
            <I name="edit" size={12} /> Edit SEA
          </button>
        </div>
      )}
    </div>
  );
};

const IncidentRow = ({ inc, tenantId, rowIndex = 0, onChanged }) => {
  const [expanded, setExpanded] = useState(false);
  const sev = incidentSeverityCfg[inc.severity] ?? { label: inc.severity || "Unknown", bg: "transparent", color: "inherit" };
  const sta = incidentStatusCfg[inc.status] ?? { label: inc.status || "Unknown", bg: "transparent", color: "inherit" };
  const [y, m, d] = (inc.date || "").split("-");
  const dateStr = (y && m && d) ? `${d}/${m}/${y}` : (inc.date || "—");

  const reload = (mutator) => {
    // mutator receives the current incident, returns the updated row.
    mutator(inc);
    onChanged();
  };

  const requiredCount =
    Object.values(inc.escalations ?? {}).filter((e) => e.required && !e.notified).length
    + (inc.sea?.required && !inc.sea.completed ? 1 : 0);

  const canClose = requiredCount === 0;

  const setStatus = (newStatus) => {
    if (newStatus === "Closed" && !canClose) return;
    updateIncident(tenantId, inc.id, { status: newStatus });
    onChanged();
  };

  return (
    <>
      <div
        className={`${styles.incidentRow} ${rowIndex % 2 === 1 ? styles.incidentRowAlt : ""}`}
        onClick={() => setExpanded((v) => !v)}
        style={{ cursor: "pointer" }}
      >
        <div style={{ flex: 2, minWidth: 0 }}>
          <div className={styles.incidentType}>{inc.type}</div>
          <div className={styles.incidentDate}>{dateStr}</div>
        </div>
        <div style={{ flex: 3, minWidth: 0 }}>
          <div className={styles.incidentDesc}>{inc.description}</div>
          {requiredCount > 0 && (
            <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {inc.escalations?.reg18?.required && !inc.escalations.reg18.notified && (
                <span className={styles.escPill} style={{ background: "rgba(168,56,54,0.12)", color: "#a83836" }}>Reg 18 required</span>
              )}
              {inc.escalations?.dutyOfCandour?.required && !inc.escalations.dutyOfCandour.notified && (
                <span className={styles.escPill} style={{ background: "rgba(166,27,27,0.12)", color: "#a61b1b" }}>Duty of Candour required</span>
              )}
              {inc.escalations?.riddor?.required && !inc.escalations.riddor.notified && (
                <span className={styles.escPill} style={{ background: "rgba(147,75,0,0.12)", color: "#934b00" }}>RIDDOR required</span>
              )}
              {inc.sea?.required && !inc.sea.completed && (
                <span className={styles.escPill} style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed" }}>SEA required</span>
              )}
            </div>
          )}
        </div>
        <div style={{ flex: 1.5, minWidth: 0 }} className={styles.incidentReporter}>{inc.reportedBy}</div>
        <div style={{ flex: 1 }}>
          <span className={styles.incidentPill} style={{ background: sev.bg, color: sev.color }}>{inc.severity}</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
          <span className={styles.incidentPill} style={{ background: sta.bg, color: sta.color }}>{inc.status}</span>
          <I name="chevrondown" size={12} color="var(--on-surface-variant)" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </div>
      {expanded && (
        <div className={styles.incidentExpand} onClick={(e) => e.stopPropagation()}>
          {inc.actionTaken && (
            <div className={styles.incidentExpandSection}>
              <h4>Immediate action taken</h4>
              <p>{inc.actionTaken}</p>
            </div>
          )}
          <div className={styles.incidentExpandSection}>
            <h4>Statutory escalations</h4>
            {!inc.escalations?.reg18?.required && !inc.escalations?.dutyOfCandour?.required && !inc.escalations?.riddor?.required ? (
              <p style={{ color: "var(--on-surface-variant)", fontSize: 13 }}>No statutory notifications required for this incident type at this severity.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {inc.escalations?.reg18?.required && (
                  <EscalationCard ruleKey="reg18" escalation={inc.escalations.reg18} incidentId={inc.id} tenantId={tenantId} onUpdated={reload} />
                )}
                {inc.escalations?.dutyOfCandour?.required && (
                  <EscalationCard ruleKey="dutyOfCandour" escalation={inc.escalations.dutyOfCandour} incidentId={inc.id} tenantId={tenantId} onUpdated={reload} />
                )}
                {inc.escalations?.riddor?.required && (
                  <EscalationCard ruleKey="riddor" escalation={inc.escalations.riddor} incidentId={inc.id} tenantId={tenantId} onUpdated={reload} />
                )}
              </div>
            )}
          </div>
          {inc.sea?.required && (
            <div className={styles.incidentExpandSection}>
              <h4>Significant Event Analysis</h4>
              <SeaCard sea={inc.sea} incidentId={inc.id} tenantId={tenantId} onUpdated={reload} />
            </div>
          )}
          <div className={styles.incidentExpandSection}>
            <h4>Status</h4>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {["Open", "Under Review", "Closed"].map((s) => {
                const disabled = s === "Closed" && !canClose;
                return (
                  <button
                    key={s}
                    type="button"
                    className={styles.severityBtn}
                    disabled={disabled}
                    style={{
                      opacity: disabled ? 0.45 : 1,
                      cursor: disabled ? "not-allowed" : "pointer",
                      background: inc.status === s ? incidentStatusCfg[s].bg : "var(--surface)",
                      color: inc.status === s ? incidentStatusCfg[s].color : "var(--on-surface-variant)",
                      borderColor: inc.status === s ? incidentStatusCfg[s].color : "var(--outline-variant)",
                    }}
                    onClick={() => setStatus(s)}
                  >
                    {s}
                  </button>
                );
              })}
              {!canClose && (
                <span style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>
                  Cannot close — {requiredCount} required action{requiredCount !== 1 ? "s" : ""} outstanding.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────

/* ─── HistoryModal ────────────────────────────────────────────────────
 * Read-only modal that lists the recent submissions for one audit.
 * Opens from "View History" on a compliant card. Deliberately has no
 * write affordances — the CQC Hub is dashboard-only. */
const HistoryModal = ({ def, submissions, sites, onClose }) => {
  const dialogRef = useModalA11y(onClose);

  const siteName = (siteId) =>
    sites.find((s) => s.id === siteId)?.name ?? "—";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={dialogRef}
        className={styles.historyModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <header className={styles.historyHead}>
          <div>
            <div className={styles.historyEyebrow}>Audit History · Read-Only</div>
            <h2 id="history-title" className={styles.historyTitle}>{def.title}</h2>
            <p className={styles.historySub}>{def.description}</p>
          </div>
          <button
            type="button"
            className={styles.historyClose}
            onClick={onClose}
            aria-label="Close history"
          >
            ×
          </button>
        </header>

        <div className={styles.historyBody}>
          {submissions.length === 0 ? (
            <p className={styles.historyEmpty}>No submissions on file yet.</p>
          ) : (
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Site</th>
                  <th>Submitted by</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td>{new Date(s.submittedAt).toLocaleDateString("en-GB")}</td>
                    <td>{siteName(s.siteId)}</td>
                    <td>{s.submittedBy?.name ?? "—"}</td>
                    <td className={styles.historyRoleCell}>{s.submittedBy?.role ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <footer className={styles.historyFooter}>
          <span className={styles.historyHint}>
            To file a new submission, use{" "}
            <strong>Operational Logs</strong> (recurring readings) or{" "}
            <strong>Governance &amp; SOPs</strong> (policy audits).
          </span>
          <button type="button" className={styles.historyCloseBtn} onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};

/* ─── Redirect taxonomy ──────────────────────────────────────────────
 * The CQC Compliance Hub is read-only. When a card shows Overdue or
 * Action Required, its action button redirects the user to the
 * workspace where remediation actually happens:
 *
 *   • "logbook" target  → Operational Logs tab (recurring equipment +
 *                          environment readings — daily / weekly / monthly
 *                          cadence). Used for sterilisation cycle logs,
 *                          temperature checks, DUWL dipslides, etc.
 *
 *   • "sop" target      → Governance & SOPs tab (Clinical Protocols
 *                          library). Used for policy audits, annual
 *                          contractor validations, observational audits,
 *                          inventory checks, and any "review the SOP"
 *                          remediation path.
 *
 * If a key is missing from this map it defaults to "sop" — Governance is
 * the safe fallback because every audit ultimately has an SOP. */
const REDIRECT_TARGETS = {
  // Decontamination & Validation
  protein:                "logbook",   // recurring weekly test
  soil:                   "logbook",   // recurring weekly test
  sterilizer:             "sop",       // annual contractor PQ
  distiller:              "logbook",   // monthly maintenance reading
  decon_room:             "sop",       // environmental zoning audit
  // Water & Environment Safety
  water_temps:            "logbook",   // recurring temperature reading
  dip_slide:              "logbook",   // recurring DUWL count
  // Health, Safety & Premises
  fire_safety:            "sop",       // policy walkthrough
  med_kit:                "sop",       // kit contents audit
  material_expiry:        "sop",       // inventory check
  // Infection Prevention & Control
  ipc_self_assessment:    "sop",       // annual policy audit
  hand_hygiene_audit:     "sop",       // observational audit
  // Radiation Safety & IR(ME)R
  radiograph_quality:     "sop",       // annual quality audit
  // Clinical & Workforce Governance
  antibiotic_prescribing: "sop",       // annual AMS audit
  record_keeping_audit:   "sop",       // annual records audit
  mercury_amalgam:        "sop",       // annual mercury evidence
  reg19_fpp:              "sop",       // annual HR / FPP audit
};

/* SOP-target audit → Audit & Evidence Centre pack filter.
 *
 * Drives the "Manage Schedule" / "View Schedule" deep-link: when the
 * exec clicks the button on a macro audit card, App.jsx receives the
 * pack key in pageContext and pre-seeds the Master Feed's pack
 * dropdown to that pack.
 *
 * Pack keys must match PACK_BADGE_META in AuditEvidenceCentre — kept
 * deliberately verbose (one entry per audit key, not derived from
 * category) so future audits with category-overrides are explicit. */
const AUDIT_KEY_TO_PACK = {
  // Decontamination & Validation pack
  sterilizer:             "decontamination_ipc",
  decon_room:             "decontamination_ipc",
  // Infection Prevention & Control → also lives in the Decon/IPC pack
  ipc_self_assessment:    "decontamination_ipc",
  hand_hygiene_audit:     "decontamination_ipc",
  // Radiation
  radiograph_quality:     "radiography_irmer",
  // Health, Safety & Premises → Practice Operations pack
  fire_safety:            "practice_operations",
  med_kit:                "practice_operations",
  material_expiry:        "practice_operations",
  // Clinical & Workforce Governance → Practice Operations pack
  antibiotic_prescribing: "practice_operations",
  record_keeping_audit:   "practice_operations",
  mercury_amalgam:        "practice_operations",
  reg19_fpp:              "practice_operations",
};

export const CqcPage = ({ onNav } = {}) => {
  const { user } = useAuth();

  // Mirror the PIL pattern: fall back to demo-tenant when the auth user
  // hasn't been enriched. Lets the page work in dev / demo flows.
  const cqcUser = user ? {
    id:       user.id ?? user.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId: user.tenantId ?? "demo-tenant",
    siteId:   user.siteId ?? null,
    username: user.username ?? "dev",
    role:     user.role ?? "super_admin",
  } : null;
  const tenantId = cqcUser?.tenantId ?? "demo-tenant";

  const [sites, setSites] = useState([]);
  const [siteFilter, setSiteFilter] = useState(
    () => localStorage.getItem("verbilo.cqc.siteFilter") ?? "all",
  );
  const [submissions, setSubmissions] = useState([]);
  const [incidents, setIncidents] = useState([]);
  /* History modal — opened from "View Ledger" on compliant cards.
   * Read-only — shows the audit's last few submissions for context. */
  const [historyKey, setHistoryKey] = useState(null);
  /* Audit modal — opened from "Start Audit" on overdue SOP-target
   * cards. Hosts the comprehensive compliance assessment form. */
  const [openAudit, setOpenAudit] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [tick, setTick] = useState(0); // bump to force re-read after writes

  useEffect(() => {
    if (!cqcUser) return;
    ensureSeed(cqcUser);
    const seededSites = listSites(tenantId);
    setSites(seededSites);
    ensureCqcSeed(tenantId, seededSites);
  }, [cqcUser?.id, tenantId]);

  useEffect(() => {
    setSubmissions(listAuditSubmissions(tenantId));
    setIncidents(listIncidents(tenantId));
  }, [tenantId, tick]);

  const activeSiteId = siteFilter === "all" ? null : siteFilter;
  const setActiveSiteFilter = (val) => {
    setSiteFilter(val);
    localStorage.setItem("verbilo.cqc.siteFilter", val);
  };

  const filteredSubmissions = activeSiteId
    ? submissions.filter((s) => s.siteId === activeSiteId)
    : submissions;
  const filteredIncidents = activeSiteId
    ? incidents.filter((i) => i.siteId === activeSiteId)
    : incidents;

  const { total, current: done, pct } = useMemo(
    () => gaugeStats(auditDefs, submissions, activeSiteId),
    [submissions, activeSiteId],
  );

  const gaugeColor =
    pct >= 85 ? "#4caf50" : pct >= 60 ? "#ff9800" : "#a83836";

  /* Resolve the def for the currently-open History modal. */
  const historyDef = historyKey
    ? auditDefs.find((d) => d.key === historyKey)
    : null;
  const historySubmissions = useMemo(() => {
    if (!historyKey) return [];
    return filteredSubmissions
      .filter((s) => s.auditKey === historyKey)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 8);
  }, [historyKey, filteredSubmissions]);

  /* Resolve the def for the currently-open AuditModal. */
  const activeAuditDef = openAudit
    ? auditDefs.find((d) => d.key === openAudit)
    : null;

  /* "Go to Logs" — sidebar redirect for overdue cards whose
   * remediation happens in the Operational Logs workspace (recurring
   * equipment readings: protein residue, soil test, distiller, water
   * temps, dipslides). Falls back to a no-op if the parent hasn't
   * wired onNav (e.g. when the page is rendered in isolation). */
  const handleGoToLogs = () => {
    if (!onNav) return;
    onNav("logbooks");
  };

  /* "Manage Schedule" / "View Schedule" — deep-links the user to the
   * Audit & Evidence Centre with the Master Feed's pack dropdown
   * pre-seeded to this audit's pack. The CQC Hub stays read-only;
   * scheduling, delegation and assessment execution all live in the
   * Centre. Falls back to a plain nav (no filter) if the audit key
   * isn't mapped or onNav isn't wired. */
  const handleManageSchedule = (auditKey) => {
    if (!onNav) return;
    const packFilter = AUDIT_KEY_TO_PACK[auditKey];
    onNav("audit_evidence", packFilter ? { packFilter } : undefined);
  };

  /* AuditModal completion handler — fires recordAuditSubmission +
   * bumps the tick so the dashboard re-reads and the just-completed
   * card flips from Overdue to Current. */
  const handleAuditComplete = (auditKey, payload) => {
    if (!cqcUser) return;
    const submissionSite =
      activeSiteId
        ?? cqcUser.siteId
        ?? sites[0]?.id
        ?? null;
    recordAuditSubmission(tenantId, {
      auditKey,
      siteId: submissionSite,
      submittedBy: {
        id:   cqcUser.id,
        name: cqcUser.username,
        role: cqcUser.role,
      },
      ...payload,
    });
    setTick((n) => n + 1);
    setOpenAudit(null);
  };

  const handleIncidentSave = (newIncident) => {
    if (!cqcUser) return;
    const submissionSite =
      activeSiteId
        ?? cqcUser.siteId
        ?? sites[0]?.id
        ?? null;
    recordIncident(tenantId, { ...newIncident, siteId: submissionSite });
    setTick((n) => n + 1);
  };

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>CQC Compliance Hub</h1>
          <p className={styles.pageSubtitle}>
            Dental Group — Audit &amp; Compliance Tracking
          </p>
        </div>
        <div className={styles.headerControls} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--on-surface-variant)" }}>
            <I name="building" size={13} />
            <span>Site</span>
            <select
              className="ui-control"
              value={siteFilter}
              onChange={(e) => setActiveSiteFilter(e.target.value)}
              disabled={sites.length === 0}
              style={{
                minWidth: 180,
                cursor: sites.length === 0 ? "not-allowed" : "pointer",
                opacity: sites.length === 0 ? 0.6 : 1,
              }}
            >
              <option value="all">{sites.length === 0 ? "No sites configured" : "All sites — group view"}</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <Pill bg="var(--tertiary-container)" color="var(--on-tertiary-container)">
            <I name="shield" size={13} /> CQC Registered
          </Pill>
        </div>
      </div>

      {/* Readiness gauge banner */}
      <Card hover={false} className={styles.gaugeCard}>
        <div className={styles.gaugeLayout}>
          <div className={styles.gaugeRingWrap}>
            <div
              className={styles.gaugeRing}
              style={{
                background: `conic-gradient(${gaugeColor} 0% ${pct}%, var(--surface-high) ${pct}% 100%)`,
              }}
            >
              <div className={styles.gaugeCenter}>
                <span className={styles.gaugePct}>{pct}%</span>
                <span className={styles.gaugeSubLabel}>{READINESS_METRICS.cqcAuditCoverage.shortLabel}</span>
              </div>
            </div>
          </div>

          <div className={styles.gaugeContent}>
            <h2 className={styles.gaugeName}>
              {activeSiteId
                ? `${sites.find((s) => s.id === activeSiteId)?.name ?? "Site"} — CQC Audit Coverage`
                : "Group CQC Audit Coverage"}
            </h2>
            <p className={styles.gaugeDesc}>
              {done} of {total} required audits currently in-date{activeSiteId ? "" : " across the group"}.{" "}
              {pct >= 85
                ? "Strong audit coverage. Keep each audit current."
                : pct >= 60
                ? "Good progress. Bring the remaining audits up to date."
                : "Action required. Complete missing or overdue audits."}
            </p>

            <div className={styles.gaugeBands}>
              <span className={styles.bandGreen}>
                <span className={styles.bandDot} style={{ background: "#4caf50" }} />
                ≥85% Strong
              </span>
              <span className={styles.bandAmber}>
                <span className={styles.bandDot} style={{ background: "#ff9800" }} />
                60–84% Partial
              </span>
              <span className={styles.bandRed}>
                <span className={styles.bandDot} style={{ background: "#a83836" }} />
                &lt;60% Action Required
              </span>
            </div>

            <div className={styles.gaugeStats}>
              <div className={styles.gaugeStat}>
                <span className={styles.gaugeStatVal} style={{ color: "#4caf50" }}>
                  {done}
                </span>
                <span className={styles.gaugeStatLab}>Current</span>
              </div>
              <div className={styles.gaugeDivider} />
              <div className={styles.gaugeStat}>
                <span
                  className={styles.gaugeStatVal}
                  style={{ color: total - done > 0 ? "#a83836" : "#4caf50" }}
                >
                  {total - done}
                </span>
                <span className={styles.gaugeStatLab}>Not Current</span>
              </div>
              <div className={styles.gaugeDivider} />
              <div className={styles.gaugeStat}>
                <span className={styles.gaugeStatVal}>{total}</span>
                <span className={styles.gaugeStatLab}>Total Audits</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Audit categories */}
      {categories.map((cat) => {
        const catAudits = auditDefs.filter((d) => d.category === cat.key);
        const catCurrent = catAudits.filter((d) => {
          const last = lastSubmissionFor(filteredSubmissions, d.key, activeSiteId);
          return last != null && !isOverdue(d, last);
        }).length;

        return (
          <div key={cat.key} className={styles.catBlock}>
            <div
              className={styles.catHeader}
              style={{ borderLeftColor: cat.color, background: cat.bg }}
            >
              <I name={cat.icon} size={22} color={cat.color} />
              <div className={styles.catHeaderText}>
                <h2 className={styles.catTitle}>{cat.label}</h2>
                <p className={styles.catSub}>{cat.subtitle}</p>
              </div>
              <Pill
                bg="var(--surface-container)"
                color="var(--on-surface-variant)"
                small
              >
                {catCurrent} / {catAudits.length} current
              </Pill>
            </div>

            <div className={styles.auditGrid}>
              {catAudits.map((def) => {
                const last = lastSubmissionFor(filteredSubmissions, def.key, activeSiteId);
                const overdue = isOverdue(def, last);
                const isCurrent = !!last && !overdue;
                const lastAgeDays = daysSince(last);
                const target = REDIRECT_TARGETS[def.key] ?? "sop";
                return (
                  /* Read-only card. No onClick wrapper — the card has
                   * become a status surface; all interaction goes through
                   * the explicit action button at the bottom. */
                  <Card
                    key={def.key}
                    hover={false}
                    className={`${styles.auditCard} ${styles.auditCardReadOnly} ${isCurrent ? styles.auditCardDone : ""} ${overdue ? styles.auditCardOverdue : ""}`}
                  >
                    <div className={styles.auditCardTop}>
                      <Pill
                        bg={
                          isCurrent
                            ? "rgba(76,175,80,0.15)"
                            : freqColors[def.freq]?.bg ?? "var(--surface-container)"
                        }
                        color={
                          isCurrent
                            ? "#2e7d32"
                            : freqColors[def.freq]?.color ?? "var(--on-surface-variant)"
                        }
                        small
                      >
                        {isCurrent ? "Current" : def.freq}
                      </Pill>
                      {isCurrent ? (
                        <I name="checkcircle" size={16} color="#4caf50" />
                      ) : last ? (
                        <Pill bg="rgba(168,56,54,0.12)" color="#a83836" small>
                          Overdue · {lastAgeDays}d
                        </Pill>
                      ) : null}
                    </div>
                    <h3 className={styles.auditTitle}>{def.title}</h3>
                    <p className={styles.auditDesc}>{def.description}</p>
                    {last && (
                      <p className={styles.auditDesc} style={{ marginTop: 4, fontSize: 11 }}>
                        Last: {new Date(last.submittedAt).toLocaleDateString("en-GB")} · {last.submittedBy?.name ?? "—"}
                      </p>
                    )}
                    {/* Read-only action row. Cards either:
                     *   • Compliant  → low-emphasis "View History" (opens a
                     *                    modal showing the last submissions)
                     *   • Overdue or
                     *     never done → primary alert button that redirects
                     *                    to the workspace where remediation
                     *                    actually happens (Operational Logs
                     *                    for equipment readings, Governance
                     *                    & SOPs for policy reviews). */}
                    {/* Four-way action routing — executives never enter
                     * raw data here; every button is a navigation to
                     * the right workspace for the task at hand:
                     *
                     *   • Current  + logbook → "View Ledger"
                     *                          (in-place history modal,
                     *                           the only read-only path
                     *                           that stays inside this
                     *                           page)
                     *   • Current  + sop     → "View Schedule"
                     *                          (Audit & Evidence Centre,
                     *                           pre-filtered to the pack
                     *                           — read-only browsing)
                     *   • Overdue  + logbook → "Go to Logs"
                     *                          (Operational Logs sidebar
                     *                           tab — missed equipment
                     *                           reading, operational risk)
                     *   • Overdue  + sop     → "Manage Schedule"
                     *                          (Audit & Evidence Centre,
                     *                           pre-filtered to the pack —
                     *                           delegate to a clinician
                     *                           via the Nudge flow) */}
                    <div className={styles.auditAction}>
                      {isCurrent && target === "logbook" ? (
                        <button
                          type="button"
                          className={`${styles.auditBtn} ${styles.auditBtnSecondary}`}
                          onClick={() => setHistoryKey(def.key)}
                          aria-label={`View ledger for ${def.title}`}
                        >
                          <I name="eye" size={13} />
                          <span className={styles.auditBtnLabel}>View Ledger</span>
                        </button>
                      ) : isCurrent && target === "sop" ? (
                        <button
                          type="button"
                          className={`${styles.auditBtn} ${styles.auditBtnSecondary}`}
                          onClick={() => handleManageSchedule(def.key)}
                          aria-label={`View the schedule for ${def.title} in the Audit & Evidence Centre`}
                        >
                          <I name="eye" size={13} />
                          <span className={styles.auditBtnLabel}>View Schedule</span>
                        </button>
                      ) : target === "logbook" ? (
                        <button
                          type="button"
                          className={`${styles.auditBtn} ${styles.auditBtnAlert}`}
                          onClick={handleGoToLogs}
                          aria-label={`Go to the Operational Logs to remediate ${def.title}`}
                        >
                          <I name="external" size={13} />
                          <span className={styles.auditBtnLabel}>Go to Logs</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.auditBtn} ${styles.auditBtnPrimary}`}
                          onClick={() => handleManageSchedule(def.key)}
                          aria-label={`Manage the ${def.title} schedule in the Audit & Evidence Centre`}
                        >
                          <I name="barchart" size={13} />
                          <span className={styles.auditBtnLabel}>Manage Schedule</span>
                        </button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Incident Register */}
      <div className={styles.incidentSection}>
        <div className={styles.incidentSectionHeader}>
          <div>
            <h2 className={styles.incidentSectionTitle}>Incident Register</h2>
            <p className={styles.incidentSectionSub}>
              {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? "s" : ""} logged this period. High severity incidents must be escalated to the CQC and/or HSE as required.
            </p>
          </div>
          <button className={styles.reportIncidentBtn} onClick={() => setShowIncidentModal(true)}>
            <I name="plus" size={14} /> Report Incident
          </button>
        </div>
        <Card hover={false} className={styles.incidentCard}>
          <div className={styles.incidentTableHead}>
            <span style={{ flex: 2 }}>Type / Date</span>
            <span style={{ flex: 3 }}>Description</span>
            <span style={{ flex: 1.5 }}>Reported By</span>
            <span style={{ flex: 1 }}>Severity</span>
            <span style={{ flex: 1 }}>Status</span>
          </div>
          {filteredIncidents.map((inc, i) => (
            <IncidentRow
              key={inc.id}
              inc={inc}
              tenantId={tenantId}
              rowIndex={i}
              onChanged={() => setTick((n) => n + 1)}
            />
          ))}
        </Card>
      </div>

      {showIncidentModal && (
        <ReportIncidentModal
          onClose={() => setShowIncidentModal(false)}
          onSave={(newInc) => { handleIncidentSave(newInc); setShowIncidentModal(false); }}
        />
      )}

      {/* History modal — read-only, opens from "View Ledger" on a
       * compliant card. The CQC Hub stays dashboard-first; this is
       * the read-only inspection surface. */}
      {historyDef && (
        <HistoryModal
          def={historyDef}
          submissions={historySubmissions}
          sites={sites}
          onClose={() => setHistoryKey(null)}
        />
      )}

      {/* Audit modal — write surface, opens from "Start Audit" on an
       * overdue SOP-target card (macro clinical / annual audits like
       * Decon Room Audit, IPC Self-Assessment, Reg 19 FPP). Recurring
       * equipment-reading audits (Foil Test, Distiller, Dipslides…)
       * route to Operational Logs instead and never hit this modal. */}
      {activeAuditDef && (
        <AuditModal
          def={activeAuditDef}
          onClose={() => setOpenAudit(null)}
          onComplete={handleAuditComplete}
        />
      )}
    </div>
  );
};
