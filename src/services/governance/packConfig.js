/**
 * Per-pack content config.
 *
 * One entry per Governance & SOPs template pack. Drives:
 *   - catalogue card (name / subtitle / description / standards / icon / colour / includes)
 *   - storyboard step blocks (which steps + caption per pack)
 *   - setup wizard step content (equipment categories, audit defaults, roles list)
 *
 * Adding a new pack = adding an entry here. No new JSX required.
 *
 * Every pack uses the SAME 6-step interactive setup wizard:
 *   1. Pack Selection            — intro + group / brand summary
 *   2. Sites Applicability       — which sites are in scope
 *   3. Roles & Ownership         — group leads + approver / reviewer
 *   4. Equipment & Systems       — per-pack label (e.g. "Equipment & Systems",
 *                                  "Standards & Resources", "Contacts & escalation")
 *   5. Audit & Evidence          — audit frequency, reminder days, retention
 *   6. Review & Submit           — submits the pack for Clinical Director approval
 *
 * After submit, the pack moves through a separate LIFECYCLE rendered in the
 * catalogue storyboard (visual narrative on the pack card):
 *   7.  Approval Workflow
 *   8.  Live & Published         } shown only when extendedLifecycle: true
 *  (9). Evidence Tracked          (e.g. Radiography & IRMER)
 *
 * Default storyboard: 8 step blocks. With `extendedLifecycle: true`, the
 * storyboard renders 10 step blocks.
 */

export const PACK_CONFIG = {
  /* ── 1. Decontamination & IPC ─────────────────────────────────────────── */
  decontamination_ipc: {
    key: "decontamination_ipc",
    name: "Decontamination & IPC",
    subtitle: "HTM 01-05 aligned",
    description: "Complete IPC framework for UK dental groups: policies, SOPs, log templates and audit tools. Activates SOPs and evidence requirements per site based on the equipment and processes you operate.",
    standards: ["HTM 01-05", "CQC Reg 12", "GDC Standards", "HSE Regulations"],
    color: "#c62828",
    icon: "shield",
    extendedLifecycle: false,
    includes: [
      "9 policies + 13 SOPs + 12 log templates",
      "Per-site decontamination profile",
      "Equipment & systems register (autoclaves, WDs, ultrasonics, waterlines)",
      "Staff IPC acknowledgements per role",
      "7 audit types with RAG scoring",
    ],
    equipmentCategoryLabel: "Equipment & Systems",
    equipmentCategories: [
      { id: "autoclave",         label: "Autoclave / Steriliser",  desc: "B / N / S class steam sterilisers" },
      { id: "washerDisinfector", label: "Washer-Disinfector",      desc: "Thermal disinfection cycles + records" },
      { id: "ultrasonicBath",    label: "Ultrasonic Bath",          desc: "Pre-cleaning of dental instruments" },
      { id: "waterlineSystem",   label: "Dental Unit Waterlines",   desc: "Biofilm control + waterline testing" },
      { id: "trackingSystem",    label: "Instrument Tracking",      desc: "Batch / cycle / traceability records" },
      { id: "wasteContractor",   label: "Clinical Waste Contractor", desc: "Consignment notes + duty of care" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupIpcLeadUserId",   label: "Group IPC Lead",                hint: "Pack owner — day-to-day governance",          filter: ["ipc_lead"] },
      { id: "groupDeconLeadUserId", label: "Group Decontamination Lead",    hint: "Owns the decon process",                      filter: ["decontamination_lead"] },
    ],
    auditDefaults: { frequency: "monthly", reminderDays: 14, retentionYears: 7 },
    trackedItems: [
      "Autoclave / washer-disinfector test records + service certificates",
      "Hand hygiene + PPE compliance records",
      "Decontamination + waterline audit results",
      "Staff acknowledgement records — tied to published document versions",
      "Audit completion + RAG status across applied sites",
    ],
  },

  /* ── 2. Radiography & IRMER ───────────────────────────────────────────── */
  radiography_irmer: {
    key: "radiography_irmer",
    name: "Radiography & IRMER",
    subtitle: "IRMER 2017 · IRR17 aligned",
    description: "Controlled radiography governance for UK dental groups: employer procedures, local rules, equipment QA, operator entitlement, RPA/MPE contacts, controlled-area signage and image-quality audits. Activates per-site SOPs based on which imaging modalities each practice operates.",
    standards: ["IRMER 2017", "IRR17", "GDC Standards", "CQC Reg 12"],
    color: "#f57c00",
    icon: "alert",
    extendedLifecycle: true, // 10-step lifecycle: adds Approval Workflow + Live & Published + Evidence Tracked breakdown
    includes: [
      "5 policy templates + 17 procedures + audit tools",
      "Operator entitlement register (intraoral / OPG / CBCT)",
      "Per-site equipment QA + maintenance evidence",
      "Controlled-area signage workflows",
      "RPA / MPE contact + escalation tracking",
    ],
    equipmentCategoryLabel: "Equipment & Systems",
    equipmentCategories: [
      { id: "intraoralXray",   label: "Intraoral X-ray",        desc: "Wall-mounted intraoral units" },
      { id: "opgXray",         label: "OPG / Panoramic",        desc: "Extraoral panoramic units" },
      { id: "cbctXray",        label: "CBCT",                   desc: "Cone-beam CT — extra governance applies" },
      { id: "handheldXray",    label: "Handheld X-ray",         desc: "Portable / mobile units" },
      { id: "digitalSensors",  label: "Digital Sensors",        desc: "Direct digital intraoral capture" },
      { id: "phosphorPlates",  label: "Phosphor Plate Scanner", desc: "Indirect digital capture" },
      { id: "imageSoftware",   label: "Imaging Software",       desc: "Acquisition + reporting platform" },
      { id: "qaKit",           label: "QA Test Kit",            desc: "Image-quality and dose testing" },
    ],
    externalProviders: [
      { id: "rpaProviderName", contactId: "rpaContact",  label: "Radiation Protection Adviser (RPA)", placeholder: "e.g. Physics Protection Ltd",   contactLabel: "RPA contact",  contactPlaceholder: "rpa@example.co.uk" },
      { id: "mpeProviderName", contactId: "mpeContact",  label: "Medical Physics Expert (MPE)",       placeholder: "e.g. Dental Physics Services Ltd", contactLabel: "MPE contact", contactPlaceholder: "mpe@example.co.uk" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupIrmerLeadUserId", label: "Group Radiation Practitioner / Clinical Lead", hint: "Pack owner — day-to-day IRR17 / IRMER governance", filter: ["irmer_lead"] },
    ],
    // IRR17 image-quality + QA audits run on a 6-month baseline cycle —
    // quarterly was too aggressive for the framework and out of step with
    // every other UK dental radiography QA programme.
    auditDefaults: { frequency: "biannually", reminderDays: 14, retentionYears: 7 },
    trackedItems: [
      "Equipment QA test records + maintenance certificates",
      "Operator entitlement training + attestation evidence",
      "Image-quality audit results + local rules reviews",
      "Staff acknowledgement records — tied to published document versions",
      "Audit completion + RAG status across applied sites",
    ],
  },

  /* ── 3. Medical Emergencies ───────────────────────────────────────────── */
  medical_emergencies: {
    key: "medical_emergencies",
    name: "Medical Emergencies",
    subtitle: "Resuscitation Council UK aligned",
    description: "Medical emergency readiness governance: drug box, AED, oxygen and suction checks, BLS competency, anaphylaxis and cardiac arrest pathways. Activates per-site drug + equipment registers and rolling training records.",
    standards: ["Resus Council UK", "GDC Standards", "CQC Reg 12"],
    color: "#1565c0",
    icon: "heart",
    extendedLifecycle: false,
    includes: [
      "Drug box + AED + oxygen + suction registers",
      "Anaphylaxis + cardiac arrest pathway SOPs",
      "BLS competency matrix per role",
      "Mock drill log + review template",
      "Emergency incident review workflow",
    ],
    equipmentCategoryLabel: "Emergency equipment & drugs",
    equipmentCategories: [
      { id: "drugBox",        label: "Emergency Drug Box",     desc: "Adrenaline, glucagon, salbutamol, GTN, aspirin, midazolam" },
      { id: "aed",            label: "AED",                    desc: "Automated external defibrillator" },
      { id: "oxygen",         label: "Oxygen cylinder + mask", desc: "Portable O2 supply + non-rebreathe mask" },
      { id: "suction",        label: "Portable suction",       desc: "Yankauer + emergency suction unit" },
      { id: "bagValveMask",   label: "Bag-valve-mask",         desc: "Resuscitation BVM with airway adjuncts" },
      { id: "bloodGlucose",   label: "Blood glucose monitor",  desc: "For hypoglycaemia management" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupMedEmergencyLeadUserId", label: "Medical Emergencies Lead",  hint: "Pack owner — day-to-day governance", filter: ["clinical_director", "governance_lead"] },
      { id: "groupResusLeadUserId",         label: "Resuscitation Lead",        hint: "Owns BLS competency",                filter: ["clinical_director", "governance_lead"] },
    ],
    auditDefaults: { frequency: "monthly", reminderDays: 7, retentionYears: 7 },
    trackedItems: [
      "Weekly drug + equipment check sheets",
      "AED self-test + pad expiry records",
      "BLS training certificates per staff member",
      "Mock drill completion + lessons-learned log",
      "Emergency incident review records",
    ],
  },

  /* ── 4. Safeguarding Governance ───────────────────────────────────────── */
  safeguarding_governance: {
    key: "safeguarding_governance",
    name: "Safeguarding Governance",
    subtitle: "Care Act 2014 · Children Act 2004",
    description: "Safeguarding governance for adults and children: lead/deputy contacts, escalation pathways, training matrix, supervision records, allegations against staff, whistleblowing and annual safeguarding report.",
    standards: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13"],
    color: "#6a1b9a",
    icon: "shield",
    extendedLifecycle: false,
    includes: [
      "Safeguarding policy + lead role descriptions",
      "Deputy contacts + escalation flowchart per site",
      "Training matrix (Levels 1/2/3) per role",
      "Allegations against staff procedure",
      "Whistleblowing policy + annual report template",
    ],
    equipmentCategoryLabel: "Contacts & escalation",
    equipmentCategories: [
      { id: "lashContact",        label: "Local Authority Safeguarding Hub", desc: "MASH / front door contact details per site" },
      { id: "ladoContact",        label: "LADO contact",                     desc: "Local Authority Designated Officer for allegations" },
      { id: "adultsContact",      label: "Adult safeguarding team",          desc: "Council adult social care safeguarding" },
      { id: "policeContact",      label: "Police safeguarding unit",         desc: "Non-emergency safeguarding contact" },
      { id: "healthVisitorTeam",  label: "Health visiting team",             desc: "Local NHS health visiting service" },
      { id: "domesticAbuseSvc",   label: "Domestic abuse service",           desc: "Local IDVA / refuge contact" },
    ],
    rolesLabel: "Safeguarding roles",
    roles: [
      { id: "groupSafeguardingLeadUserId",       label: "Safeguarding Lead",         hint: "Pack owner — day-to-day governance",      filter: ["clinical_director", "governance_lead"] },
      { id: "groupSafeguardingDeputyUserId",     label: "Deputy Safeguarding Lead",  hint: "Covers when lead is unavailable",         filter: ["clinical_director", "governance_lead", "practice_manager"] },
    ],
    auditDefaults: { frequency: "annually", reminderDays: 30, retentionYears: 11 },
    trackedItems: [
      "Safeguarding training certificates (Levels 1/2/3) per staff member",
      "Supervision records for safeguarding leads",
      "Allegation against staff log",
      "Annual safeguarding report submissions",
      "Whistleblowing concern records",
    ],
  },

  /* ── 5. Complaints, Incidents & Duty of Candour ───────────────────────── */
  complaints_incidents: {
    key: "complaints_incidents",
    name: "Complaints, Incidents & Duty of Candour",
    subtitle: "CQC Reg 16 · GDC Standards aligned",
    description: "Complaints, incidents and duty of candour governance: reporting workflow, escalation routes, candour letters, significant event analysis, learning logs and action tracking across all practices.",
    standards: ["CQC Reg 16", "CQC Reg 20", "GDC Standards", "NHS Complaints Regs"],
    color: "#b36000",
    icon: "alert",
    extendedLifecycle: false,
    includes: [
      "Complaints policy + acknowledgement templates",
      "Incident reporting SOP + log",
      "Duty of candour letter templates",
      "Significant Event Analysis (SEA) template",
      "Learning-from-incidents action tracker",
    ],
    equipmentCategoryLabel: "Reporting & escalation",
    equipmentCategories: [
      { id: "complaintsWorkflow",   label: "Complaints workflow",            desc: "Acknowledge → investigate → respond → close" },
      { id: "incidentReporting",    label: "Incident reporting workflow",    desc: "Near-miss + actual incident routes" },
      { id: "candourProcess",       label: "Duty of candour process",        desc: "Apology + investigation + outcome workflow" },
      { id: "seaTemplate",          label: "Significant Event Analysis",     desc: "SEA review template per incident" },
      { id: "learningLog",          label: "Learning + actions log",         desc: "Cross-site lessons + status tracking" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupComplaintsLeadUserId", label: "Complaints Lead",   hint: "Owns complaints workflow",        filter: ["governance_lead", "clinical_director", "practice_manager"] },
      { id: "groupCandourLeadUserId",    label: "Duty of Candour Lead", hint: "Owns candour process",            filter: ["clinical_director", "governance_lead"] },
    ],
    auditDefaults: { frequency: "quarterly", reminderDays: 14, retentionYears: 11 },
    trackedItems: [
      "Complaints log per site + group-level summary",
      "Incident log + near-miss records",
      "Candour letters issued (count + outcomes)",
      "SEA completion + actions closed",
      "Recurring themes + cross-site learning",
    ],
  },

  /* ── 6. Clinical Governance ───────────────────────────────────────────── */
  clinical_governance: {
    key: "clinical_governance",
    name: "Clinical Governance",
    subtitle: "GDC Standards · CQC Reg 11/12",
    description: "Controlled clinical protocols across 12 specialties, plus 13 Core protocols covering consent, prescribing, record keeping, safeguarding, radiography, referrals and clinical escalation. Adopted at group level by your Clinical Director; each clinician then reads and acknowledges.",
    standards: ["GDC Standards", "CQC Reg 11", "CQC Reg 12", "BSP", "BES", "BAOS", "BDA", "FGDP/CGDent", "SDCEP", "NICE"],
    color: "#0277bd",
    icon: "file",
    extendedLifecycle: false,
    /* Document pack — no per-practice configuration is required because the
       protocols are pre-authored and centrally version-controlled. The card
       opens the Protocol Library directly instead of routing through the
       6-step setup wizard. The Clinical Director adopts at group level;
       each clinician then reads and acknowledges per-protocol.

       Wizard-only fields (equipmentCategories, equipmentCategoryLabel,
       rolesLabel, roles, auditDefaults, trackedItems) are intentionally
       omitted — they are consumed only by PackSetup.jsx steps 3–5, which
       do not run when entryView === "library". */
    lead: "Clinical Director",
    entryView: "library",
    entryLabel: "Open library",
    includes: [
      "13 Core protocols — medical emergencies, urgent care, prescribing, record keeping, consent, safeguarding, radiography, referrals, post-op, IPC, medically compromised, FTA / neglect, clinical escalation",
      "Periodontal protocols (BPE, BSP staging, periodontal treatment steps)",
      "Endodontic protocols (pulp testing, aseptic technique, irrigation)",
      "Implants & oral surgery protocols",
      "Paediatric protocols",
      "Whitening & aesthetics protocols",
      "Restorative, prosthodontics, oral medicine, trauma, sedation, special care, TMD",
    ],
  },

  /* ── 7. Practice Operations SOPs ──────────────────────────────────────── */
  practice_operations: {
    key: "practice_operations",
    name: "Practice Operations SOPs",
    subtitle: "Operational SOPs for daily running",
    description: "Day-to-day operational SOPs covering opening / closing, reception, appointment booking, NHS claims, private payments, stock ordering, fridge / oxygen / AED checks, lone working and security across all practices.",
    standards: ["NHS Contracts", "CQC Reg 17", "GDC Standards"],
    color: "#0a875a",
    icon: "clipboard",
    extendedLifecycle: false,
    includes: [
      "Opening / closing SOP per site",
      "Reception + appointment booking SOPs",
      "NHS claims + private payment SOPs",
      "Stock ordering + lab work SOPs",
      "Daily / weekly check sheets (fridge / oxygen / AED)",
      "Lone working + keyholding / security SOP",
    ],
    equipmentCategoryLabel: "Operational areas",
    equipmentCategories: [
      { id: "openingClosing",   label: "Opening / closing SOP",          desc: "Daily start-up + shutdown checklists" },
      { id: "reception",        label: "Reception + booking",            desc: "Patient flow + appointment SOPs" },
      { id: "nhsClaims",        label: "NHS claims",                     desc: "FP17 / FP25 + claim submission SOP" },
      { id: "privatePayments",  label: "Private payments",               desc: "Payment handling + reconciliation" },
      { id: "stockOrdering",    label: "Stock ordering",                 desc: "Reorder thresholds + supplier list" },
      { id: "labWork",          label: "Lab work tracking",              desc: "Lab dispatch / receipt log" },
      { id: "loneWorking",      label: "Lone working + security",        desc: "After-hours + lone worker SOP" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupOpsLeadUserId", label: "Operations Lead", hint: "Pack owner — day-to-day ops governance", filter: ["practice_manager", "group_admin"] },
    ],
    auditDefaults: { frequency: "monthly", reminderDays: 7, retentionYears: 5 },
    trackedItems: [
      "Daily / weekly check sheet completion",
      "NHS claim submission + reconciliation records",
      "Stock control + reorder logs",
      "Lab dispatch / receipt records",
      "Security + lone worker incident logs",
    ],
  },

  /* ── 8. Audit & Evidence ──────────────────────────────────────────────── */
  audit_evidence: {
    key: "audit_evidence",
    name: "Audit & Evidence",
    subtitle: "Cross-pack audit + evidence orchestration",
    description: "Group-wide audit + evidence orchestration: schedule audit templates across practices, capture evidence, score, track actions and produce exportable evidence packs for CQC, NHS or commissioner inspections.",
    standards: ["CQC Inspection Framework", "GDC Standards"],
    color: "#475569",
    icon: "checksquare",
    extendedLifecycle: false,
    includes: [
      "Library of audit templates (IPC / radiography / record-keeping / etc.)",
      "Audit schedule per site",
      "Evidence capture + RAG scoring",
      "Action tracker across sites",
      "Exportable evidence pack for inspections",
    ],
    equipmentCategoryLabel: "Audit programme",
    equipmentCategories: [
      { id: "auditLibrary",   label: "Audit template library",   desc: "Catalogue of audit templates" },
      { id: "auditSchedule",  label: "Audit schedule per site",  desc: "Recurring schedule per audit type" },
      { id: "evidenceCapture", label: "Evidence capture",         desc: "File uploads + log entries + photo evidence" },
      { id: "ragScoring",     label: "RAG scoring",              desc: "Red / amber / green per audit" },
      { id: "actionTracker",  label: "Action tracker",           desc: "Cross-site action log with owners + due dates" },
    ],
    rolesLabel: "Group leads",
    roles: [
      { id: "groupAuditLeadUserId", label: "Audit Lead", hint: "Pack owner — runs the audit programme", filter: ["governance_lead", "auditor"] },
    ],
    auditDefaults: { frequency: "quarterly", reminderDays: 14, retentionYears: 7 },
    trackedItems: [
      "Audit completion across sites + audit types",
      "Audit scores + RAG distribution",
      "Open actions + overdue actions",
      "Evidence linkage to documents + equipment + audits",
      "Inspection-ready evidence pack exports",
    ],
  },

  /* ── 9. Site-Specific SOPs ────────────────────────────────────────────── */
  site_specific_sops: {
    key: "site_specific_sops",
    name: "Site-Specific SOPs",
    subtitle: "Local appendices and per-site variations",
    description: "Site-specific local appendices: room layouts, local equipment lists, escalation maps, local waste providers, local service contracts and any practice that needs a unique SOP variation versus group standard.",
    standards: ["GDC Standards", "CQC Reg 17"],
    color: "#9333ea",
    icon: "building",
    extendedLifecycle: false,
    includes: [
      "Local appendix templates per group SOP",
      "Local equipment list per site",
      "Local contacts + suppliers per site",
      "Local escalation maps per site",
      "Local site-specific version control",
    ],
    equipmentCategoryLabel: "Site appendices",
    equipmentCategories: [
      { id: "roomLayouts",      label: "Room layouts",          desc: "Per-site room diagrams + signage placement" },
      { id: "localEquipList",   label: "Local equipment list",  desc: "Equipment + serials + maintenance schedule" },
      { id: "localContacts",    label: "Local contacts",        desc: "Per-site emergency + service contacts" },
      { id: "escalationMap",    label: "Escalation map",        desc: "Out-of-hours + on-call routes per site" },
      { id: "localWaste",       label: "Local waste provider",  desc: "Per-site clinical + amalgam waste contractor" },
      { id: "localServices",    label: "Local service providers", desc: "Per-site engineer + maintenance contracts" },
    ],
    rolesLabel: "Site leads",
    roles: [
      { id: "groupSiteSopsLeadUserId", label: "Site SOPs Lead", hint: "Owns the site-specific appendices programme", filter: ["governance_lead", "practice_manager"] },
    ],
    auditDefaults: { frequency: "annually", reminderDays: 30, retentionYears: 5 },
    trackedItems: [
      "Local appendix completeness per site",
      "Local equipment list freshness",
      "Local contacts last-verified dates",
      "Local escalation map review status",
      "Site appendix version history",
    ],
  },
};

/** Ordered list of pack keys (used for the catalogue grid order). */
export const PACK_ORDER = [
  "decontamination_ipc",
  "radiography_irmer",
  "medical_emergencies",
  "safeguarding_governance",
  "complaints_incidents",
  "clinical_governance",
  "practice_operations",
  "audit_evidence",
  "site_specific_sops",
];

export const getPackConfig = (packKey) => PACK_CONFIG[packKey] ?? null;
export const listPackConfigs = () => PACK_ORDER.map((k) => PACK_CONFIG[k]).filter(Boolean);
