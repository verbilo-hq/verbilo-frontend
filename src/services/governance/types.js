/**
 * Governance & SOPs — type constants. Mirrors the Prisma enums in
 * verbilo-backend/prisma/schema.prisma. Keep these in sync when the schema
 * changes — both the migration and this file need updating.
 */

export const UserRole = Object.freeze({
  super_admin:                     'super_admin',
  group_admin:                     'group_admin',
  clinical_director:               'clinical_director',
  governance_lead:                 'governance_lead',
  ipc_lead:                        'ipc_lead',
  decontamination_lead:            'decontamination_lead',
  irmer_lead:                      'irmer_lead',
  radiation_protection_supervisor: 'radiation_protection_supervisor',
  practice_manager:                'practice_manager',
  site_lead:                       'site_lead',
  operator:                        'operator',
  referrer:                        'referrer',
  practitioner:                    'practitioner',
  staff:                           'staff',
  auditor:                         'auditor',
});

export const ROLE_LABEL = {
  [UserRole.super_admin]:                     'Super Admin',
  [UserRole.group_admin]:                     'Group Admin',
  [UserRole.clinical_director]:               'Clinical Director',
  [UserRole.governance_lead]:                 'Governance Lead',
  [UserRole.ipc_lead]:                        'IPC Lead',
  [UserRole.decontamination_lead]:            'Decontamination Lead',
  [UserRole.irmer_lead]:                      'IRMER Lead',
  [UserRole.radiation_protection_supervisor]: 'Radiation Protection Supervisor',
  [UserRole.practice_manager]:                'Practice Manager',
  [UserRole.site_lead]:                       'Site Lead',
  [UserRole.operator]:                        'Operator',
  [UserRole.referrer]:                        'Referrer',
  [UserRole.practitioner]:                    'Practitioner',
  [UserRole.staff]:                           'Staff Member',
  [UserRole.auditor]:                         'Auditor',
};

export const SiteStatus = Object.freeze({
  not_configured:        'not_configured',
  partially_configured:  'partially_configured',
  ready_for_approval:    'ready_for_approval',
  live:                  'live',
  review_due:            'review_due',
  evidence_overdue:      'evidence_overdue',
});

export const SITE_STATUS_LABEL = {
  not_configured:       'Not configured',
  partially_configured: 'Partially configured',
  ready_for_approval:   'Ready for approval',
  live:                 'Live',
  review_due:           'Review due',
  evidence_overdue:     'Evidence overdue',
};
export const SITE_STATUS_COLOR = {
  not_configured:       '#6b7280',
  partially_configured: '#b36000',
  ready_for_approval:   '#1565c0',
  live:                 '#2e7d32',
  review_due:           '#f57c00',
  evidence_overdue:     '#e53935',
};

export const PackStatus = Object.freeze({
  not_started:        'not_started',
  in_setup:           'in_setup',
  awaiting_approval:  'awaiting_approval',
  live:               'live',
});

export const EquipmentType = Object.freeze({
  autoclave:               'autoclave',
  washer_disinfector:      'washer_disinfector',
  ultrasonic_bath:         'ultrasonic_bath',
  waterline_system:        'waterline_system',
  tracking_system:         'tracking_system',
  logbook_system:          'logbook_system',
  waste_contractor:        'waste_contractor',
  service_provider:        'service_provider',
  intraoral_xray:          'intraoral_xray',
  opg_xray:                'opg_xray',
  cbct_xray:               'cbct_xray',
  handheld_xray:           'handheld_xray',
  digital_sensor:          'digital_sensor',
  phosphor_plate_scanner:  'phosphor_plate_scanner',
  image_software:          'image_software',
  qa_testing_kit:          'qa_testing_kit',
  rp_signage:              'rp_signage',
  rpa_provider:            'rpa_provider',
  mpe_provider:            'mpe_provider',
  // Medical emergencies
  emergency_drug_box:      'emergency_drug_box',
  aed_defibrillator:       'aed_defibrillator',
  oxygen_cylinder:         'oxygen_cylinder',
  portable_suction:        'portable_suction',
  bag_valve_mask:          'bag_valve_mask',
  blood_glucose_meter:     'blood_glucose_meter',
  // Safeguarding — not physical hardware, but reuse the equipment_records
  // table for their localStorage CRUD + downstream evidence wiring.
  safeguarding_lead_credential: 'safeguarding_lead_credential',
  team_safeguarding_summary:    'team_safeguarding_summary',
  dbs_record:                   'dbs_record',
  // Generic-register packs — Step 5 entry discriminators (1 type per pack).
  complaints_case:              'complaints_case',
  operational_facility:         'operational_facility',
  active_audit_template:        'active_audit_template',
  site_contractor:              'site_contractor',
});

export const EQUIPMENT_TYPE_LABEL = {
  autoclave:               'Autoclave',
  washer_disinfector:      'Washer-Disinfector',
  ultrasonic_bath:         'Ultrasonic Bath',
  waterline_system:        'Waterline System',
  tracking_system:         'Instrument Tracking',
  logbook_system:          'Logbook System',
  waste_contractor:        'Waste Contractor',
  service_provider:        'Service Provider',
  intraoral_xray:          'Intraoral X-ray Unit',
  opg_xray:                'OPG / Panoramic Unit',
  cbct_xray:               'CBCT Unit',
  handheld_xray:           'Handheld X-ray Unit',
  digital_sensor:          'Digital Sensor',
  phosphor_plate_scanner:  'Phosphor Plate Scanner',
  image_software:          'Image Viewing / Reporting Software',
  qa_testing_kit:          'QA Testing Kit',
  rp_signage:              'Radiation Protection Signage',
  rpa_provider:            'Radiation Protection Adviser (RPA)',
  mpe_provider:            'Medical Physics Expert (MPE)',
  emergency_drug_box:      'Emergency Drug Box',
  aed_defibrillator:       'AED Defibrillator',
  oxygen_cylinder:         'Oxygen Cylinder',
  portable_suction:        'Portable Suction',
  bag_valve_mask:          'Bag-Valve-Mask',
  blood_glucose_meter:     'Blood Glucose Meter',
};

/** Per-pack equipment classifications — drives the type dropdown in the
 *  Equipment Register so users only see relevant types. */
export const EQUIPMENT_TYPES_BY_PACK = {
  decontamination_ipc: [
    EquipmentType.autoclave, EquipmentType.washer_disinfector, EquipmentType.ultrasonic_bath,
    EquipmentType.waterline_system, EquipmentType.tracking_system, EquipmentType.logbook_system,
    EquipmentType.waste_contractor, EquipmentType.service_provider,
  ],
  radiography_irmer: [
    EquipmentType.intraoral_xray, EquipmentType.opg_xray, EquipmentType.cbct_xray, EquipmentType.handheld_xray,
    EquipmentType.digital_sensor, EquipmentType.phosphor_plate_scanner, EquipmentType.image_software,
    EquipmentType.qa_testing_kit, EquipmentType.rp_signage, EquipmentType.rpa_provider, EquipmentType.mpe_provider,
  ],
  medical_emergencies: [
    EquipmentType.emergency_drug_box, EquipmentType.aed_defibrillator, EquipmentType.oxygen_cylinder,
    EquipmentType.portable_suction, EquipmentType.bag_valve_mask, EquipmentType.blood_glucose_meter,
  ],
};

/** Operator entitlement types — covers equipment classes (intraoral / OPG /
 *  CBCT / handheld) plus process competencies (image acquisition / processing /
 *  QA checks) plus IRMER duty-holder roles (referrer / practitioner / operator).
 *  Each row in the operator entitlement register is keyed by (user, site, type). */
export const EntitlementType = Object.freeze({
  intraoral:         'intraoral',
  opg:               'opg',
  cbct:              'cbct',
  handheld:          'handheld',
  image_acquisition: 'image_acquisition',
  image_processing:  'image_processing',
  qa_checks:         'qa_checks',
  referrer:          'referrer',
  practitioner:      'practitioner',
  operator:          'operator',
});

export const ENTITLEMENT_TYPE_LABEL = {
  intraoral:         'Intraoral X-ray',
  opg:               'OPG / Panoramic',
  cbct:              'CBCT',
  handheld:          'Handheld X-ray',
  image_acquisition: 'Image acquisition',
  image_processing:  'Image processing',
  qa_checks:         'QA checks',
  referrer:          'Referrer',
  practitioner:      'Practitioner',
  operator:          'Operator',
};

/** Subset of entitlement types that are equipment-modality-based (i.e. driven
 *  by the site's radiography profile flags). */
export const EQUIPMENT_ENTITLEMENT_TYPES = [
  EntitlementType.intraoral, EntitlementType.opg, EntitlementType.cbct, EntitlementType.handheld,
];

/** IRMER duty-holder entitlement types (gated by user role). */
export const ROLE_ENTITLEMENT_TYPES = [
  EntitlementType.referrer, EntitlementType.practitioner, EntitlementType.operator,
];

/** Process-competency entitlement types (everyone who handles images needs them). */
export const PROCESS_ENTITLEMENT_TYPES = [
  EntitlementType.image_acquisition, EntitlementType.image_processing, EntitlementType.qa_checks,
];

/** Back-compat alias — older code referred to "EquipmentClass" / "EQUIPMENT_CLASS_LABEL"
 *  when only the four equipment-class types existed. Kept so existing imports
 *  continue to work. */
export const EquipmentClass = EntitlementType;
export const EQUIPMENT_CLASS_LABEL = ENTITLEMENT_TYPE_LABEL;

export const EquipmentStatus = Object.freeze({
  active:           'active',
  in_service:       'in_service',
  decommissioned:   'decommissioned',
  overdue_service:  'overdue_service',
});

export const DocumentType = Object.freeze({
  policy:            'policy',
  sop:               'sop',
  log_template:      'log_template',
  audit_tool:        'audit_tool',
  evidence_template: 'evidence_template',
  appendix:          'appendix',
});

export const DOCUMENT_TYPE_LABEL = {
  policy:            'Policy',
  sop:               'SOP',
  log_template:      'Log',
  audit_tool:        'Audit Tool',
  evidence_template: 'Evidence Template',
  appendix:          'Site Appendix',
};

/* ─── Decon Equipment Register (Step 5) — 4 industry-compliant categories
 * Discriminated union: every asset has a `category` + a category-specific
 * `data` blob. Modal field schema drives form rendering + validation. */

export const ASSET_CATEGORY = Object.freeze({
  decon:    'decon',
  water:    'water',
  waste:    'waste',
  engineer: 'engineer',
});

export const ASSET_CATEGORY_META = [
  { key: 'decon',    title: 'Decontamination Equipment',       subtitle: 'Autoclaves, washer-disinfectors, ultrasonic baths',     icon: 'shield',   accent: '#006974' },
  { key: 'water',    title: 'Water Systems & Testing',         subtitle: 'RO units, distillers, bottled dispensers + dip slides', icon: 'droplet',  accent: '#1565c0' },
  { key: 'waste',    title: 'Waste Management & Consignment',  subtitle: 'Hazardous, sharps, amalgam, gypsum carriers',           icon: 'trash',    accent: '#b36000' },
  { key: 'engineer', title: 'Engineering & Service Providers', subtitle: 'Authorised engineers, RPA, competent persons',           icon: 'wrench',   accent: '#6a1b9a' },
];

export const DECON_EQUIPMENT_TYPE = [
  { value: 'type_b_vacuum_autoclave', label: 'Type B (Vacuum) Autoclave' },
  { value: 'type_n_autoclave',        label: 'Type N (Non-Vacuum) Autoclave' },
  { value: 'washer_disinfector',      label: 'Washer-Disinfector (WD)' },
  { value: 'ultrasonic_bath',         label: 'Ultrasonic Bath' },
];

export const WATER_SYSTEM_TYPE = [
  { value: 'reverse_osmosis',   label: 'Reverse Osmosis (RO) Unit' },
  { value: 'distiller',         label: 'Water Distiller' },
  { value: 'bottled_dispenser', label: 'Bottled Water Dispenser/System' },
];

export const FILTER_CHANGE_CADENCE = [
  { value: 'monthly',        label: 'Monthly' },
  { value: 'quarterly',      label: 'Quarterly' },
  { value: 'bi_annually',    label: 'Bi-Annually' },
  { value: 'annually',       label: 'Annually' },
  { value: 'by_cycle_count', label: 'By Cycle Count' },
];

export const DIP_SLIDE_CADENCE = [
  { value: 'not_applicable', label: 'Not Applicable' },
  { value: 'monthly',        label: 'Monthly' },
  { value: 'quarterly',      label: 'Quarterly' },
];

export const WASTE_STREAM = [
  { value: 'hazardous_clinical', label: 'Hazardous Clinical Waste' },
  { value: 'amalgam',            label: 'Dental Amalgam Waste' },
  { value: 'sharps',             label: 'Dental Sharps' },
  { value: 'gypsum',             label: 'Gypsum Waste' },
  { value: 'offensive',          label: 'Offensive Waste' },
];

export const COLLECTION_FREQUENCY = [
  { value: 'weekly',      label: 'Weekly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'monthly',     label: 'Monthly' },
  { value: 'ad_hoc',      label: 'Ad-Hoc / On-Demand' },
];

export const PROVIDER_CATEGORY = [
  { value: 'authorised_engineer',        label: 'Authorised Engineer (Decontamination)' },
  { value: 'competent_person_pressure',  label: 'Competent Person (Pressure Systems)' },
  { value: 'rpa',                        label: 'Radiation Protection Advisor (RPA)' },
  { value: 'facilities',                 label: 'Facilities / Maintenance Contractor' },
];

/* Modal field schema — drives form rendering + validation. Each field:
 *   name, label, type ('text'|'select'|'date'|'tel'|'email'|'multi-checkbox')
 *   options? (for select / multi-checkbox)
 *   required?, placeholder?
 *   showIf?(values) — conditional render (e.g. PSSR ref only for autoclaves)
 *   validate?(value) — returns true | error message
 */
export const ASSET_FIELD_SCHEMA = {
  decon: [
    { name: 'equipmentType',             label: 'Equipment Type',                  type: 'select', options: DECON_EQUIPMENT_TYPE, required: true },
    { name: 'manufacturer',              label: 'Manufacturer / Brand',            type: 'text', required: true },
    { name: 'modelNumber',               label: 'Model Name / Number',             type: 'text', required: true },
    { name: 'serialNumber',              label: 'Serial Number (S/N)',             type: 'text', required: true },
    { name: 'localIdentifier',           label: 'Local Asset Identifier',          type: 'text', placeholder: 'e.g. Autoclave 1' },
    /* PSSR ref appears only for pressure-system autoclaves (Type B / Type N) —
     * required by the Pressure Systems Safety Regulations 2000 for any vessel
     * with a written scheme of examination. Hidden by default for WD / ultrasonic. */
    { name: 'pssrWrittenSchemeRef',      label: 'PSSR Written Scheme Reference Number', type: 'text',
      showIf: (v) => v.equipmentType === 'type_b_vacuum_autoclave' || v.equipmentType === 'type_n_autoclave',
      required: true,
      placeholder: 'e.g. WSE-2025-001' },
    /* Dates land in the right column of the 2-col modal grid, side-by-side. */
    { name: 'lastStatutoryInspectionAt', label: 'Last Statutory Inspection Date',  type: 'date' },
    { name: 'nextValidationDueAt',       label: 'Next Validation Service Due',     type: 'date' },
  ],
  water: [
    { name: 'systemType',           label: 'Water System Type',                          type: 'select', options: WATER_SYSTEM_TYPE, required: true },
    { name: 'manufacturerModel',    label: 'Manufacturer & Model',                       type: 'text', required: true },
    { name: 'localIdentifier',      label: 'Local Asset Identifier',                     type: 'text', placeholder: 'e.g. RO Unit 1' },
    { name: 'installationLocation', label: 'Installation Location',                      type: 'text', placeholder: 'e.g. LDU Clean Side' },
    { name: 'filterChangeCadence',  label: 'Filter Change Cadence',                      type: 'select', options: FILTER_CHANGE_CADENCE },
    { name: 'lastServiceAt',        label: 'Last Filter Change / Service Date',          type: 'date' },
    { name: 'microDipSlideCadence', label: 'Microbiological Dip Slide Testing Cadence',  type: 'select', options: DIP_SLIDE_CADENCE },
  ],
  waste: [
    { name: 'wasteStreams',        label: 'Waste Stream Category',          type: 'multi-checkbox', options: WASTE_STREAM, required: true },
    { name: 'carrierName',         label: 'Waste Carrier Name',             type: 'text', required: true },
    { name: 'eaLicenseNumber',     label: 'EA Carrier License Number',      type: 'text',
      placeholder: 'CBDUXXXXXX', required: true,
      validate: (v) => !v ? 'Required' : (/^CBDU[A-Z0-9]+$/i.test(v) ? true : 'Format: CBDU + alphanumeric, no spaces') },
    { name: 'contractRef',         label: 'Contract Reference Number',      type: 'text' },
    { name: 'collectionFrequency', label: 'Collection Frequency',           type: 'select', options: COLLECTION_FREQUENCY },
    { name: 'contractRenewalAt',   label: 'Contract Renewal Date',          type: 'date' },
  ],
  engineer: [
    { name: 'providerCategory',   label: 'Service Provider Category',                   type: 'select', options: PROVIDER_CATEGORY, required: true },
    { name: 'companyName',        label: 'Company Name',                                type: 'text', required: true },
    { name: 'localIdentifier',    label: 'Internal Reference',                          type: 'text', placeholder: 'e.g. Primary engineer' },
    { name: 'primaryContactName', label: 'Primary Contact Engineer',                    type: 'text' },
    { name: 'certificationRef',   label: 'Professional Certification / Registration',   type: 'text' },
    { name: 'emergencyTel',       label: 'Emergency Contact Telephone',                 type: 'tel', required: true },
    { name: 'serviceAlertEmail',  label: 'Email Address for Service Alerts',            type: 'email', required: true,
      validate: (v) => !v ? 'Required' : (/^\S+@\S+\.\S+$/.test(v) ? true : 'Invalid email format') },
  ],
};

/** Pretty-print an enum value via its options map. */
export const labelFromOptions = (options, value) =>
  options.find((o) => o.value === value)?.label ?? value ?? '';

export const DocumentStatus = Object.freeze({
  template:    'template',
  draft:       'draft',
  in_review:   'in_review',
  approved:    'approved',
  published:   'published',
  review_due:  'review_due',
  expired:     'expired',
  archived:    'archived',
  rejected:    'rejected',
});

export const DOCUMENT_STATUS_LABEL = {
  template:    'Template',
  draft:       'Draft',
  in_review:   'In Review',
  approved:    'Approved',
  published:   'Published',
  review_due:  'Review Due',
  expired:     'Expired',
  archived:    'Archived',
  rejected:    'Rejected',
};

export const DOCUMENT_STATUS_COLOR = {
  template:    '#6b7280',
  draft:       '#1565c0',
  in_review:   '#6a1b9a',
  approved:    '#0277bd',
  published:   '#2e7d32',
  review_due:  '#f57c00',
  expired:     '#e53935',
  archived:    '#475569',
  rejected:    '#e53935',
};

export const DocumentScope = Object.freeze({
  group: 'group',
  site:  'site',
  role:  'role',
});

export const AckStatus = Object.freeze({
  assigned:      'assigned',
  acknowledged:  'acknowledged',
  overdue:       'overdue',
  waived:        'waived',
});

export const EvidenceKind = Object.freeze({
  file:           'file',
  log_entry:      'log_entry',
  checklist:      'checklist',
  audit_result:   'audit_result',
  certificate:    'certificate',
  photo:          'photo',
  external_link:  'external_link',
  attestation:    'attestation',
});

export const EvidenceStatus = Object.freeze({
  required:       'required',
  submitted:      'submitted',
  accepted:       'accepted',
  rejected:       'rejected',
  overdue:        'overdue',
  expired:        'expired',
  not_applicable: 'not_applicable',
});

export const EVIDENCE_STATUS_LABEL = {
  required:       'Required',
  submitted:      'Submitted',
  accepted:       'Accepted',
  rejected:       'Rejected',
  overdue:        'Overdue',
  expired:        'Expired',
  not_applicable: 'Not applicable',
};

export const EVIDENCE_STATUS_COLOR = {
  required:       '#6b7280',
  submitted:      '#1565c0',
  accepted:       '#2e7d32',
  rejected:       '#e53935',
  overdue:        '#e53935',
  expired:        '#b36000',
  not_applicable: '#9ca3af',
};

export const AuditRagStatus = Object.freeze({
  unknown: 'unknown',
  green:   'green',
  amber:   'amber',
  red:     'red',
});

/** Decontamination & IPC site-profile flags. Kept under SITE_PROFILE_FLAGS for
 *  backwards compatibility with the existing Decon UI; prefer reading from
 *  SITE_PROFILE_FLAGS_BY_PACK going forward. */
export const SITE_PROFILE_FLAGS = [
  { id: 'processOnSite',              label: 'Instruments processed on-site' },
  { id: 'processCentrally',           label: 'Instruments processed off-site / hub' },
  { id: 'manualCleaning',             label: 'Manual cleaning protocols used' },
  { id: 'ultrasonicBath',             label: 'Ultrasonic bath used' },
  { id: 'washerDisinfector',          label: 'Washer-disinfector (WD) used' },
  { id: 'autoclave',                  label: 'Autoclave / steriliser units used' },
  { id: 'instrumentsPouched',         label: 'Instruments pouched after sterilisation' },
  { id: 'waterlineManagement',        label: 'Dental Unit Waterline (DUWL) management' },
  { id: 'amalgamWaste',               label: 'Amalgam waste handled & separated' },
  { id: 'sharpsDisposal',             label: 'Sharps disposal handled on-site' },
  { id: 'clinicalWasteTransferNotes', label: 'Clinical waste transfer notes required' },
  { id: 'mainsWaterRo',               label: 'Mains water connection (with RO system)' },
  { id: 'independentWaterBottles',    label: 'Independent water bottles used' },
];

/** Radiography & IRMER site-profile flags. */
/**
 * Radiography & IRMER site-profile flags.
 *
 * `mandatory: true` flags are statutorily required for any practice running
 * an X-ray set under IRR17 / IRMER 2017 — they're not shown as user-facing
 * toggles in Step 4 and are silently kept `true` in profile state so any
 * downstream SOPs / audits that gate on them still activate correctly.
 *
 * `category` groups the user-visible flags into the three Step 4 sections:
 *   imaging   — modality / device categories
 *   processing — image capture / processing tech stack
 *   operational — workflow / governance toggles
 */
export const RADIOGRAPHY_PROFILE_FLAGS = [
  // Imaging Modalities
  { id: 'intraoralXray',     label: 'Intraoral X-ray used (Wall-mounted)',         category: 'imaging' },
  { id: 'opgXray',           label: 'OPG (Panoramic) X-ray used',                  category: 'imaging' },
  { id: 'cbctXray',          label: 'CBCT X-ray used',                              category: 'imaging' },
  { id: 'handheldXray',      label: 'Handheld X-ray unit used',                     category: 'imaging' },
  { id: 'mobilePortableXray',label: 'Mobile / Portable X-ray unit used',            category: 'imaging' },
  // Processing System
  { id: 'digitalSensors',    label: 'Digital sensors used (Direct USB / Wi-Fi)',    category: 'processing' },
  { id: 'phosphorPlates',    label: 'Phosphor plates used (PSP scanner)',           category: 'processing' },
  { id: 'filmProcessing',    label: 'Traditional film processing (Chemical / Darkroom)', category: 'processing' },
  // Operational Focus
  { id: 'staffAcknowledgementRequired', label: 'Staff acknowledgement required',    category: 'operational' },
  // Statutorily mandatory — hidden from UI, silently kept true. Listed here
  // so audits/SOPs that gate on these IDs still activate (signage check,
  // QA audit, maintenance review, image quality audit, local rules review).
  { id: 'controlledAreas',            label: 'Controlled areas in place',          mandatory: true },
  { id: 'localRulesRequired',         label: 'Local rules required',               mandatory: true },
  { id: 'imageQualityAuditRequired',  label: 'Image quality audit required',       mandatory: true },
  { id: 'qaRecordsRequired',          label: 'QA records required',                mandatory: true },
  { id: 'maintenanceRecordsRequired', label: 'Maintenance records required',       mandatory: true },
];

/** Medical Emergencies & Resuscitation site-profile flags.
 *
 * `mandatory: true` flags are statutorily required for every operating UK
 * dental practice under the GDC Standards / RCUK Quality Standards for
 * Cardiopulmonary Resuscitation Equipment & Training. They're set silently
 * to true on every applied profile and hidden from the toggle grid — there
 * is no realistic configuration where these can be off.
 *
 * `category` drives Step 4 sub-section grouping (FLAG_CATEGORY_META):
 *   • clinical_scope  — modalities that trigger advanced kit / templates
 *   • policy_workflow — operational governance & evidence toggles
 */
export const MEDICAL_EMERGENCIES_PROFILE_FLAGS = [
  // ── Clinical Modalities & Scope ──────────────────────────────────────
  { id: 'consciousSedation',       label: 'Conscious sedation provided on-site',         category: 'clinical_scope' },
  { id: 'domiciliaryCare',         label: 'Domiciliary / off-site care provided',        category: 'clinical_scope' },
  { id: 'paediatricKitRequired',   label: 'Paediatric strengths / pads required (treats children)', category: 'clinical_scope' },

  // ── Policy & Workflow Requirements ───────────────────────────────────
  { id: 'mockDrillRequired',       label: 'Mock drill schedule required',                category: 'policy_workflow' },
  { id: 'bloodGlucosePresent',     label: 'Blood glucose meter on site',                 category: 'policy_workflow' },
  { id: 'staffAcknowledgementRequired', label: 'Staff acknowledgement required',          category: 'policy_workflow' },

  // ── Statutorily mandatory — hidden from UI, silently kept true ───────
  // Universally required for any operating UK dental practice under GDC
  // Standards + RCUK Quality Standards. Downstream activation (drug-box
  // checks, AED maintenance, oxygen checks, BLS training audit, suction +
  // BVM evidence) still reads these so data shape stays consistent.
  { id: 'drugBoxPresent',          label: 'Emergency drug box on site',                  mandatory: true },
  { id: 'aedPresent',              label: 'AED on site',                                 mandatory: true },
  { id: 'oxygenPresent',           label: 'Oxygen cylinder on site',                     mandatory: true },
  { id: 'suctionPresent',          label: 'Portable suction on site',                    mandatory: true },
  { id: 'bagValveMaskPresent',     label: 'Bag-valve-mask on site',                      mandatory: true },
  { id: 'blsTrainingRequired',     label: 'BLS training records required (all clinical staff)', mandatory: true },
];

/** Audit & Evidence site-profile flags. Slim 2-flag scope-screen per the
 *  generic-renderer refactor — actual audit master-list lives on Step 5. */
export const AUDIT_EVIDENCE_PROFILE_FLAGS = [
  { id: 'foundationTrainingPractice', label: 'Foundation training practice',
    hint: 'Triggers enhanced educational peer-reviews and clinical record sampling multi-packs.' },
  { id: 'digitalOnlyImaging',         label: 'Digital-only imaging workflows',
    hint: 'Bypasses chemical darkroom and liquid fixer waste audit sections.' },
];

/** Site-Specific SOPs site-profile flags — local-variation scope-screen. */
export const SITE_SPECIFIC_PROFILE_FLAGS = [
  { id: 'leasedBuilding',  label: 'Leased building / Landlord managed premises',
    hint: 'Splits compliance boundaries — landlord owns structural Fire Risk Assessments and water mains Legionella testing.' },
  { id: 'multiFloor',      label: 'Multi-floor clinical layout',
    hint: 'Enforces separate physical escape route maps and disability ramp variation matrices.' },
];

/** Practice Operations site-profile flags — operational scope-screen. */
export const PRACTICE_OPS_PROFILE_FLAGS = [
  { id: 'hasClinicalFridge', label: 'Has vaccine / clinical fridge on-site',
    hint: 'Mandates automated daily temperature log reminders.' },
  { id: 'loneWorking',       label: 'Utilises lone workers / late evening clinics',
    hint: 'Enforces Lone Working safety policy appendix distribution.' },
  { id: 'controlledDrugs',   label: 'Controlled Drugs (CD) kept on-site',
    hint: 'Triggers mandatory statutory CD safe structural checks and running balance log keys.' },
];

/** Complaints, Incidents & Duty of Candour site-profile flags. */
export const COMPLAINTS_PROFILE_FLAGS = [
  { id: 'nhsPatients',         label: 'Handles NHS patients',
    hint: 'Triggers statutory Parliamentary and Health Service Ombudsman (PHSO) escalation tracks and NHS Complaints Regulations data keys.' },
  { id: 'privatePatientsOnly', label: 'Handles private patients only',
    hint: 'Triggers Dental Complaints Service (DCS) frameworks.' },
  { id: 'verbalLogBypass',     label: 'Verbal-only log bypass enabled',
    hint: 'Lets informal grumbles be registered on a fast-track dashboard ledger without initiating formal root-cause analysis pipelines.' },
];

/** Safeguarding Governance site-profile flags.
 *
 * Two sub-categories drive Step 4 grouping:
 *   • demographics — patient-base scope; flips on child-protection vs
 *                    Mental Capacity Act / DoLS workflows downstream
 *   • reporting    — local statutory-agency architecture
 *
 * Designated-lead questions ("site safeguarding lead designated" etc.) were
 * dropped from the flag list — that information lives on the credentials
 * register (Step 5) where it belongs, not as a per-site checkbox.
 */
export const SAFEGUARDING_PROFILE_FLAGS = [
  // ── Patient Demographics & Scope ─────────────────────────────────────
  { id: 'treatsChildren',              label: 'Treats patients under 18 (children)',
    category: 'demographics',
    hint: 'Enables child protection workflows, Level 3 training validation, and Working Together to Safeguard Children dependencies.' },
  { id: 'treatsVulnerableAdults',      label: 'Treats vulnerable adults',
    category: 'demographics',
    hint: 'Enables Mental Capacity Act (MCA) and Deprivation of Liberty Safeguards (DoLS) compliance matrices.' },

  // ── Local Reporting Architecture ─────────────────────────────────────
  { id: 'multiRegionalLocalAuthorities', label: 'Multi-regional local authorities',
    category: 'reporting',
    hint: 'Force-declares multiple reporting tracks when the patient demographic spans neighbouring county lines.' },
  { id: 'staffAcknowledgementRequired',  label: 'Staff acknowledgement required',
    category: 'reporting' },
];

export const SITE_PROFILE_FLAGS_BY_PACK = {
  decontamination_ipc:     SITE_PROFILE_FLAGS,
  radiography_irmer:       RADIOGRAPHY_PROFILE_FLAGS,
  medical_emergencies:     MEDICAL_EMERGENCIES_PROFILE_FLAGS,
  safeguarding_governance: SAFEGUARDING_PROFILE_FLAGS,
  complaints_incidents:    COMPLAINTS_PROFILE_FLAGS,
  practice_operations:     PRACTICE_OPS_PROFILE_FLAGS,
  audit_evidence:          AUDIT_EVIDENCE_PROFILE_FLAGS,
  site_specific_sops:      SITE_SPECIFIC_PROFILE_FLAGS,
};

export const AUDIT_TYPES = [
  // ── Decontamination & IPC ──
  // Defaults aligned with Infection Prevention Society / CQC expectations —
  // decon + IPC audits are bi-annual, not monthly/quarterly.
  // Aligned with Infection Prevention Society / CQC expectations —
  // decon + IPC audits are six-monthly, not monthly/quarterly.
  { id: 'decontamination',        label: 'Decontamination Audit',           defaultFreq: 'biannually', pack: 'decontamination_ipc' },
  { id: 'ipc',                    label: 'IPC Audit',                       defaultFreq: 'biannually', pack: 'decontamination_ipc' },
  { id: 'surgery_turnaround',     label: 'Surgery Turnaround Audit',        defaultFreq: 'monthly',   pack: 'decontamination_ipc' },
  { id: 'hand_hygiene',           label: 'Hand Hygiene Audit',              defaultFreq: 'monthly',   pack: 'decontamination_ipc' },
  { id: 'environmental_cleaning', label: 'Environmental Cleaning Audit',     defaultFreq: 'monthly',   pack: 'decontamination_ipc' },
  { id: 'waterline',              label: 'Waterline Management Audit',       defaultFreq: 'quarterly', pack: 'decontamination_ipc' },
  { id: 'sharps_waste',           label: 'Sharps / Waste Audit',             defaultFreq: 'quarterly', pack: 'decontamination_ipc' },

  // ── Radiography & IRMER ──
  /* defaultFreq aligned to the audit-template content team's six-monthly
   * inspection-ready cadence — was previously quarterly. */
  { id: 'equipment_qa',           label: 'Routine X-Ray Equipment Surveillance', defaultFreq: 'biannually', pack: 'radiography_irmer', requiredFlag: 'qaRecordsRequired' },
  /* Same: six-monthly per IPS / FGDP image-grading benchmark rhythm. */
  { id: 'image_quality',          label: 'Image Quality & Reject Analysis Audit', defaultFreq: 'biannually', pack: 'radiography_irmer', requiredFlag: 'imageQualityAuditRequired' },
  /* New audit type — IR(ME)R Reg 11 + 12 evidence. CQC routinely samples
   * this in inspections; every exposure must carry a recorded clinical
   * justification + clinical evaluation report. */
  { id: 'clinical_justification', label: 'Clinical Justification & Reporting Audit', defaultFreq: 'biannually', pack: 'radiography_irmer' },
  { id: 'operator_entitlement',   label: 'Staff Training & Entitlement Audit', defaultFreq: 'annually',  pack: 'radiography_irmer' },
  { id: 'local_rules',            label: 'Radiation Protection File & Local Rules Audit', defaultFreq: 'annually',  pack: 'radiography_irmer', requiredFlag: 'localRulesRequired' },
  { id: 'risk_assessment',        label: 'Radiation Risk Assessment Review', defaultFreq: 'annually',  pack: 'radiography_irmer' },
  { id: 'equipment_maintenance',  label: 'Equipment Maintenance Review',     defaultFreq: 'quarterly', pack: 'radiography_irmer', requiredFlag: 'maintenanceRecordsRequired' },
  { id: 'signage',                label: 'Controlled Area Signage Check',     defaultFreq: 'quarterly', pack: 'radiography_irmer', requiredFlag: 'controlledAreas' },
  { id: 'incident',               label: 'Radiography Incident Review',      defaultFreq: 'quarterly', pack: 'radiography_irmer' },
  { id: 'cbct',                   label: 'CBCT Governance Review',           defaultFreq: 'annually',  pack: 'radiography_irmer', requiredFlag: 'cbctXray' },

  // ── Medical Emergencies ──
  /* Re-labelled to match the new audit-template title — the audit covers all
   * 6 RCUK-mandated drugs, AED + spare pads, oxygen capacity, BVM kit, and
   * portable suction headroom. Monthly cadence aligns to RCUK 2021 guidance. */
  { id: 'emergency_readiness',       label: 'Resuscitation Equipment & Emergency Drugs Audit', defaultFreq: 'monthly',  pack: 'medical_emergencies' },
  { id: 'drug_box_check',            label: 'Drug Box Check',                defaultFreq: 'monthly',   pack: 'medical_emergencies', requiredFlag: 'drugBoxPresent' },
  { id: 'aed_check',                 label: 'AED Maintenance Check',         defaultFreq: 'monthly',   pack: 'medical_emergencies', requiredFlag: 'aedPresent' },
  { id: 'oxygen_check',              label: 'Oxygen Cylinder Check',         defaultFreq: 'monthly',   pack: 'medical_emergencies', requiredFlag: 'oxygenPresent' },
  /* Bumped from annually → biannually + broadened to cover drill + training
   * review per RCUK Quality Standards (6-monthly drill cadence). */
  { id: 'mock_drill',                label: 'Mock Medical Emergency Drill & Training Review', defaultFreq: 'biannually', pack: 'medical_emergencies', requiredFlag: 'mockDrillRequired' },
  { id: 'bls_training',              label: 'BLS Training Currency Audit',   defaultFreq: 'annually',  pack: 'medical_emergencies', requiredFlag: 'blsTrainingRequired' },
  { id: 'emergency_incident_review', label: 'Emergency Incident Review',     defaultFreq: 'quarterly', pack: 'medical_emergencies' },

  // ── Complaints, Incidents & Duty of Candour ──
  /* Two inspection-ready governance audits — the broad annual feedback /
   * logging audit + the six-monthly adverse-incident + DoC audit. Sit
   * above the narrower legacy audits (complaints_log_review, etc.) which
   * remain in the wizard but fall back to Quick complete until authored. */
  { id: 'complaints_feedback_logging', label: 'Complaints & Feedback Logging Audit',    defaultFreq: 'annually',   pack: 'complaints_incidents' },
  { id: 'adverse_incident_candour',    label: 'Adverse Incident & Duty of Candour Audit', defaultFreq: 'biannually', pack: 'complaints_incidents' },
  { id: 'complaints_log_review',   label: 'Complaints Log Review',              defaultFreq: 'quarterly', pack: 'complaints_incidents' },
  { id: 'incident_log_review',     label: 'Incident Log Review',                defaultFreq: 'quarterly', pack: 'complaints_incidents' },
  { id: 'candour_case_review',     label: 'Duty of Candour Case Review',        defaultFreq: 'annually',  pack: 'complaints_incidents' },
  { id: 'sea_review',              label: 'Significant Event Analysis Review',  defaultFreq: 'annually',  pack: 'complaints_incidents' },
  { id: 'complaints_themes_audit', label: 'Complaints Themes & Learning Audit', defaultFreq: 'annually',  pack: 'complaints_incidents' },

  // ── Safeguarding Governance ──
  /* Six-monthly comprehensive governance audit — covers local-authority
   * contacts, referral-timeline compliance, EPR safeguarding flagging,
   * multi-agency update review, and template-form readiness. Sits above
   * the narrower annual review + quarterly referral-log audits and is
   * the primary inspection-ready governance evidence. */
  { id: 'safeguarding_governance',     label: 'Safeguarding Governance Audit',         defaultFreq: 'biannually', pack: 'safeguarding_governance' },
  { id: 'safeguarding_annual_review',  label: 'Annual Safeguarding Review',            defaultFreq: 'annually',  pack: 'safeguarding_governance' },
  { id: 'safeguarding_training_audit', label: 'Safeguarding Training Currency Audit',  defaultFreq: 'annually',  pack: 'safeguarding_governance' },
  { id: 'safeguarding_referral_log',   label: 'Safeguarding Referral Log Review',      defaultFreq: 'quarterly', pack: 'safeguarding_governance' },
  { id: 'safeguarding_children_check', label: 'Children Safeguarding Spot Check',      defaultFreq: 'quarterly', pack: 'safeguarding_governance', requiredFlag: 'treatsChildren' },

  // ── Practice Operations ──
  /* Stale-flag cleanup: the legacy flag IDs (fridgeMedications, handlesCash,
   * usesChaperones) were dropped when the Practice Ops profile schema was
   * rewritten earlier — the audits that gated on them never triggered.
   * Re-mapped: fridge → hasClinicalFridge (the new flag). Cash + chaperone
   * dropped to universal because the new profile schema doesn't carry an
   * equivalent toggle; the audits remain useful to every applied site. */
  { id: 'opening_closing_audit',   label: 'Opening & Closing Check Audit',         defaultFreq: 'monthly',   pack: 'practice_operations' },
  { id: 'stock_audit',             label: 'Stock & Ordering Audit',                defaultFreq: 'quarterly', pack: 'practice_operations' },
  { id: 'fridge_temp_audit',       label: 'Fridge Temperature Log Audit',          defaultFreq: 'monthly',   pack: 'practice_operations', requiredFlag: 'hasClinicalFridge' },
  { id: 'cash_reconciliation',     label: 'Cash Reconciliation Audit',             defaultFreq: 'monthly',   pack: 'practice_operations' },
  { id: 'lone_working_audit',      label: 'Lone-Working Risk Assessment',          defaultFreq: 'annually',  pack: 'practice_operations', requiredFlag: 'loneWorking' },
  { id: 'reception_experience',    label: 'Reception & Patient Experience Audit',  defaultFreq: 'annually',  pack: 'practice_operations' },
  { id: 'medical_history_audit',   label: 'Medical History Currency Audit',        defaultFreq: 'quarterly', pack: 'practice_operations' },
  { id: 'chaperone_log_audit',     label: 'Chaperone Log Review',                  defaultFreq: 'quarterly', pack: 'practice_operations' },

  // ── Audit & Evidence (cross-pack orchestration) ──
  /* Both evidence_pack_check + action_tracker_review previously gated on
   * legacy flags (maintainsEvidencePack, actionTrackerInUse) that are no
   * longer in the Audit & Evidence profile schema. Universal now — every
   * applied site that runs the pack should have these audits live. */
  { id: 'audit_programme_review', label: 'Annual Audit Programme Review',    defaultFreq: 'annually',  pack: 'audit_evidence' },
  { id: 'evidence_pack_check',    label: 'Evidence Pack Completeness Check', defaultFreq: 'quarterly', pack: 'audit_evidence' },
  { id: 'action_tracker_review',  label: 'Action Tracker Review',            defaultFreq: 'monthly',   pack: 'audit_evidence' },

  // ── Site-Specific SOPs (per-site bespoke) ──
  /* All three previously gated on legacy flags (hasLocalVariations,
   * hasLocalRiskRegister, hasFireRiskAssessment). Universal now — these
   * are practice-wide CQC + Fire Safety Order baseline requirements that
   * apply to any operating site. */
  { id: 'site_variations_review', label: 'Site-Specific SOP Variations Review', defaultFreq: 'annually',  pack: 'site_specific_sops' },
  { id: 'local_risk_register',    label: 'Local Risk Register Review',          defaultFreq: 'quarterly', pack: 'site_specific_sops' },
  { id: 'fire_safety_review',     label: 'Fire Safety Review',                  defaultFreq: 'annually',  pack: 'site_specific_sops' },
];

/** Audit types filtered to a single pack. */
export const auditTypesForPack = (packKey) => AUDIT_TYPES.filter((a) => a.pack === packKey);
