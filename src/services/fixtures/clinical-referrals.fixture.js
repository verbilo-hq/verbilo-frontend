/**
 * Referral document packs — clinical resources hub.
 *
 * Each specialty has a "documents" array. Documents with a `sections` array
 * render in the document viewer. Stub documents (metadata only) open the
 * viewer with a "coming soon" placeholder so the index still reflects the
 * intended pack structure.
 *
 * Section kinds supported by ReferralDocViewer.jsx:
 *   { kind: "paragraph",  body }
 *   { kind: "callout",    variant: "info|warning|danger", title?, body }
 *   { kind: "section",    title }                            -- h2 break
 *   { kind: "field-rows", rows: [{ label, fields: [{ label, span? }] }] }
 *   { kind: "checkboxes", title?, items: [string] }
 *   { kind: "table",      title?, columns: [string], rows: [[string]] }
 *   { kind: "script",     title?, body }                     -- italic, dashed
 *   { kind: "info-grid",  cols?, items: [{ title, body, bullets? }] }
 *   { kind: "prose-list", title?, items: [string] }
 *   { kind: "references", title?, items: [{ name, url? }] }
 *
 * Switch to a real API later by editing clinical.service.js — the function
 * already mirrors the Prisma/REST swap pattern.
 */

const BES_GUIDE = {
  name: "British Endodontic Society. A Guide to Good Endodontic Practice, 2022.",
  url: "https://britishendodonticsociety.org.uk/_userfiles/pages/files/a4_bes_guidelines_2022_hyperlinked_final.pdf",
};
const BES_TOOL = {
  name: "British Endodontic Society. BES Case Assessment Tool / EndoApp.",
  url: "https://britishendodonticsociety.org.uk/professionals/bes_case_assessment_tool.aspx",
};
const NHS_DR_ENDO = {
  name: "NHS / Dental Referrals. Referral Criteria for Endodontic Care.",
  url: "https://www.dental-referrals.org/wp-content/uploads/2021/04/Referral-Criteria-for-Endodontic-care.pdf",
};
const GUYS_ENDO = {
  name: "Guy's and St Thomas' NHS Foundation Trust. Dental endodontics service - referrals.",
  url: "https://www.guysandstthomas.nhs.uk/referral-guide/endodontics",
};
const ESE_CBCT = {
  name: "European Society of Endodontology. Position Statement: Use of CBCT in Endodontics, 2019.",
  url: "https://onlinelibrary.wiley.com/doi/10.1111/iej.13187",
};
const CGDENT_RAD = {
  name: "CGDent / FGDP(UK). Selection Criteria for Dental Radiography, 3rd edition.",
  url: "https://cgdent.uk/selection-criteria-for-dental-radiography/",
};
const IRMER = {
  name: "Department of Health and Social Care. Guidance to the Ionising Radiation (Medical Exposure) Regulations 2017 and Amendment Regulations 2024.",
  url: "https://www.gov.uk/government/publications/ionising-radiation-medical-exposure-regulations-2017-guidance/guidance-to-the-ionising-radiation-medical-exposure-regulations-2017",
};
const CGDENT_XRAY = {
  name: "CGDent / PHE. Guidance Notes for Dental Practitioners on the Safe Use of X-ray Equipment, 2020.",
  url: "https://cgdent.uk/standards-guidance/",
};

const BSP_REFERRAL = {
  name: "British Society of Periodontology and Implant Dentistry. BSP Guidelines for Periodontal Patient Referral, 2020.",
  url: "https://www.bsperio.org.uk/assets/downloads/BSP_Guidelines_for_Patient_Referral_2020.pdf",
};
const SDCEP_PERIO = {
  name: "Scottish Dental Clinical Effectiveness Programme. Prevention and Treatment of Periodontal Diseases in Primary Care, 2nd edition, 2025.",
  url: "https://www.periodontalcare.sdcep.org.uk/media/vjgfn5ak/sdcep-prevention-and-treatment-of-periodontal-diseases-in-primary-care-2nd-edition-nov-2025.pdf",
};
const SDCEP_REFERRAL = {
  name: "Scottish Dental Clinical Effectiveness Programme. Periodontal care guidance - Referral.",
  url: "https://www.periodontalcare.sdcep.org.uk/guidance/referral/",
};
const BSP_BPE = {
  name: "British Society of Periodontology and Implant Dentistry. Basic Periodontal Examination (BPE) Guidelines, 2019.",
  url: "https://www.bsperio.org.uk/assets/downloads/BSP_BPE_Guidelines_2019.pdf",
};
const OHID_DBOH = {
  name: "Office for Health Improvement and Disparities / NHS England. Delivering Better Oral Health - Chapter 5: Periodontal diseases.",
  url: "https://www.gov.uk/government/publications/delivering-better-oral-health-an-evidence-based-toolkit-for-prevention/chapter-5-periodontal-diseases",
};
const CGDENT_RECORDS = {
  name: "College of General Dentistry. Clinical Examination and Record-Keeping: Good Practice Guidelines.",
  url: "https://cgdent.uk/clinical-examination-and-record-keeping/",
};

/* Default governance note used at the top of every authored document. */
const GOV_NOTE_ENDO =
  "This template is designed for adaptation by a UK dental practice or dental group. It should be checked against local commissioning arrangements, specialist provider acceptance criteria, radiology procedures and the practice's clinical governance process before publication.";

const GOV_NOTE_PERIO =
  "This template is designed for adaptation by a UK dental practice or dental group. It should be checked against local commissioning arrangements, specialist provider acceptance criteria, radiography procedures, record-keeping standards and the practice's clinical governance process before publication.";

/* ────────────────────────────────────────────────────────────────────────────
 * ENDODONTIC SPECIALISTS — full sample doc for ENDO-REF-001, others stubbed
 * ──────────────────────────────────────────────────────────────────────────── */

const endodonticDocuments = [
  {
    id: "endo-ref-001",
    code: "ENDO-REF-001",
    type: "Referral form",
    title: "Endodontic Specialist Referral Form",
    purpose: "Captures patient, tooth, diagnosis, radiographs, restorability and referral request.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This referral form captures the minimum information required for endodontic triage and specialist assessment. It is intended for complex primary root canal treatment, non-surgical retreatment, selected surgical endodontic assessment and endodontic diagnostic opinion." },
      { kind: "callout", variant: "warning", title: "Before sending", body: "confirm restorability, periodontal prognosis, patient consent for referral, current symptoms, and that a current diagnostically acceptable periapical radiograph is attached. Where acute swelling, spreading infection or systemic illness is present, manage as an urgent dental infection pathway rather than routine specialist referral." },

      { kind: "section", title: "Referral form template" },
      { kind: "field-rows", rows: [
        { label: "Referring practice", fields: [
          { label: "Practice name" },
          { label: "Clinician" },
          { label: "GDC number" },
          { label: "Email" },
          { label: "Phone" },
        ]},
        { label: "Patient details", fields: [
          { label: "Name" },
          { label: "DOB" },
          { label: "NHS/private ID" },
          { label: "Address", span: 3 },
          { label: "Phone/email", span: 3 },
        ]},
        { label: "Medical history", fields: [
          { label: "Relevant medical conditions, allergies, anticoagulants, bisphosphonates/anti-resorptives, pregnancy status if relevant, anxiety/sedation needs, reasonable adjustments", span: 3, lines: 3 },
        ]},
        { label: "Tooth/teeth", fields: [
          { label: "Tooth notation" },
          { label: "Arch/quadrant" },
          { label: "Strategic value" },
          { label: "Restorative status", span: 3 },
        ]},
      ]},

      { kind: "checkboxes", title: "Referral request", items: [
        "Diagnostic opinion",
        "Primary root canal treatment",
        "Non-surgical retreatment",
        "Apicectomy / surgical endodontic assessment",
        "Management of complication",
        "CBCT justification / imaging opinion",
        "Other",
      ]},

      { kind: "checkboxes", title: "Clinical diagnosis", items: [
        "Reversible pulpitis",
        "Symptomatic irreversible pulpitis",
        "Pulp necrosis",
        "Previously treated tooth",
        "Previously initiated therapy",
        "Symptomatic apical periodontitis",
        "Chronic apical periodontitis",
        "Acute apical abscess",
        "Cracked tooth suspected",
        "Resorption suspected",
        "Diagnosis uncertain",
      ]},

      { kind: "field-rows", rows: [
        { label: "Symptoms", fields: [
          { label: "Pain history, duration, percussion/palpation, biting pain, swelling/sinus, thermal tests, EPT if used, periodontal probing, mobility", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "checkboxes", title: "Radiographs attached", items: [
        "Current periapical radiograph of tooth/teeth",
        "Pre-operative radiographs",
        "Working length / master cone / obturation views if treatment started",
        "Bitewings where restorability/caries is relevant",
        "OPG if relevant",
        "Existing CBCT report if already justified and available",
      ]},

      { kind: "field-rows", rows: [
        { label: "Previous treatment", fields: [
          { label: "Access opened?" },
          { label: "Canal(s) negotiated?" },
          { label: "Medicament placed?" },
          { label: "Materials/posts/instruments present", span: 3 },
          { label: "Dates of previous RCT/restoration if known", span: 3 },
        ]},
      ]},

      { kind: "checkboxes", title: "Restorability", items: [
        "Tooth judged restorable",
        "Tooth may require crown/onlay after endodontics",
        "Caries removal/restorability not yet confirmed",
        "Periodontal prognosis guarded",
        "Crown/root fracture suspected",
      ]},

      { kind: "checkboxes", title: "Patient discussion", items: [
        "Options discussed: no treatment/extraction/RCT/retreatment/referral",
        "Costs and likely appointments discussed",
        "Patient understands specialist assessment may not lead to treatment",
        "Patient consents to referral and sharing radiographs/clinical records",
      ]},

      { kind: "checkboxes", title: "Priority", items: [
        "Routine",
        "Pain affecting sleep/function",
        "Swelling/sinus present",
        "Trauma-related",
        "Aesthetic zone/strategic tooth",
        "Medically complex patient",
      ]},

      { kind: "section", title: "Information to include in the referral narrative" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Clinical summary", body: "State the problem in one or two sentences, including the tooth, diagnosis, symptoms and requested outcome." },
        { title: "Why specialist input is needed", body: "Describe the complexity factor, for example severe curvature, calcification, resorption, perforation, separated instrument, immature apex, retreatment through a post, suspected crack or medical/behavioural complexity." },
      ]},

      { kind: "script", title: "Patient communication script", body: "\"I am referring this tooth because the root canal treatment looks more complex than routine care. The specialist will assess whether the tooth is predictable to treat, confirm the likely options and explain the risks, costs and appointments before any treatment is started.\"" },

      { kind: "table", title: "Referral quality checklist", columns: ["Check", "Yes / no / notes"], rows: [
        ["Current periapical radiograph is attached and diagnostic.", ""],
        ["Restorability and periodontal prognosis have been considered.", ""],
        ["Reason for specialist referral is clear.", ""],
        ["Patient has been told referral may be declined if local criteria are not met.", ""],
        ["Urgent infection has been managed or redirected appropriately.", ""],
      ]},

      { kind: "references", items: [BES_GUIDE, BES_TOOL, NHS_DR_ENDO, GUYS_ENDO] },
    ],
  },
  {
    id: "endo-ref-002",
    code: "ENDO-REF-002",
    type: "Clinical guidance",
    title: "Endodontic Referral Criteria & Case Complexity Guidance",
    purpose: "Helps GDPs decide when to manage, refer to enhanced skills or refer to specialist/hospital services.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-003",
    code: "ENDO-REF-003",
    type: "Clinical pathway",
    title: "Primary Root Canal Treatment Referral Pathway",
    purpose: "Guides complex first-time RCT referrals.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-004",
    code: "ENDO-REF-004",
    type: "Clinical pathway",
    title: "Root Canal Retreatment Pathway",
    purpose: "Guides assessment and referral for previously root-filled teeth.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-005",
    code: "ENDO-REF-005",
    type: "Referral criteria",
    title: "Apicectomy Referral Criteria",
    purpose: "Sets criteria for surgical endodontic assessment and oral surgery cross-referral.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-006",
    code: "ENDO-REF-006",
    type: "Imaging guidance",
    title: "CBCT Request Guidance for Endodontic Cases",
    purpose: "Supports justified, optimised CBCT requests and reporting pathways.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-007",
    code: "ENDO-REF-007",
    type: "Clinical guidance",
    title: "Endodontic Complications Referral Guidance",
    purpose: "Supports referral and documentation for separated instruments, perforations, ledges, resorption and related complications.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
  {
    id: "endo-ref-008",
    code: "ENDO-REF-008",
    type: "Clinical guidance",
    title: "Cracked Tooth & Restorability Assessment Guidance",
    purpose: "Supports cracked tooth assessment and prevents unsuitable endodontic referrals.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ENDO,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * PERIODONTAL SPECIALISTS — full sample doc for PERIO-REF-001, others stubbed
 * ──────────────────────────────────────────────────────────────────────────── */

const periodontalDocuments = [
  {
    id: "perio-ref-001",
    code: "PERIO-REF-001",
    type: "Referral form",
    title: "Periodontal Specialist Referral Form",
    purpose: "Structured referral form for specialist periodontal assessment.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This referral form captures the information required for specialist periodontal triage. It should be used for advanced periodontitis, non-responding periodontal sites, complex furcation/root morphology, mucogingival concerns, peri-implant disease and specialist periodontal diagnostic opinion." },
      { kind: "callout", variant: "warning", title: "Before sending", body: "check local acceptance criteria. Many specialist periodontal pathways expect initial therapy, risk-factor advice, plaque control support, diagnostic radiographs and appropriate periodontal charting before referral, unless the patient has rapidly progressive disease, Grade C features, severe complexity or an urgent periodontal presentation." },

      { kind: "section", title: "Referral form template" },
      { kind: "field-rows", rows: [
        { label: "Referring practice", fields: [
          { label: "Practice name" },
          { label: "Clinician" },
          { label: "GDC number" },
          { label: "Email" },
          { label: "Phone" },
        ]},
        { label: "Patient details", fields: [
          { label: "Name" },
          { label: "DOB" },
          { label: "NHS/private ID" },
          { label: "Address", span: 3 },
          { label: "Phone/email", span: 3 },
        ]},
        { label: "Medical history", fields: [
          { label: "Relevant conditions, allergies, pregnancy status if relevant, anticoagulants, anti-resorptives, immunosuppression, diabetes, cardiovascular risk, anxiety/sedation needs, reasonable adjustments", span: 3, lines: 3 },
        ]},
        { label: "Social / risk history", fields: [
          { label: "Smoking/vaping status" },
          { label: "Cigarettes/day or equivalent" },
          { label: "Diabetes status / HbA1c if relevant" },
          { label: "Family history" },
          { label: "Engagement / attendance notes", span: 3 },
        ]},
      ]},

      { kind: "checkboxes", title: "Referral request", items: [
        "Specialist periodontal assessment",
        "Stage III / IV periodontitis",
        "Grade C / rapid progression concern",
        "Non-responding sites after treatment",
        "Furcation defects / complex root morphology",
        "Mucogingival or recession concern",
        "Peri-implant disease",
        "Acute periodontal condition",
        "Diagnostic opinion",
        "Other",
      ]},

      { kind: "field-rows", rows: [
        { label: "Diagnosis / classification", fields: [
          { label: "Diagnosis", span: 3 },
          { label: "Stage" },
          { label: "Grade" },
          { label: "Extent / distribution" },
          { label: "Main teeth / sites affected", span: 3 },
        ]},
        { label: "BPE and charting", fields: [
          { label: "BPE scores" },
          { label: "Date" },
        ]},
      ]},

      { kind: "checkboxes", items: [
        "Full 6-point pocket chart attached",
        "Post-treatment 6-point pocket chart attached",
        "Bleeding score recorded",
        "Plaque score recorded",
        "Recession / mobility / furcation recorded where relevant",
      ]},

      { kind: "checkboxes", title: "Radiographs / images", items: [
        "Bitewings showing crestal bone levels",
        "Periapicals of affected sites",
        "Full-mouth periapicals where generalised advanced disease",
        "OPG where relevant",
        "Implant baseline and current periapical radiographs",
        "Clinical photographs",
      ]},

      { kind: "checkboxes", title: "Treatment already provided", items: [
        "Oral hygiene instruction and interdental cleaning advice",
        "Risk-factor advice: smoking / vaping",
        "Risk-factor advice: diabetes / medical factors",
        "Supragingival plaque / calculus removal",
        "Subgingival instrumentation",
        "Plaque-retentive factors corrected where possible",
        "Supportive periodontal care arranged",
      ]},

      { kind: "field-rows", rows: [
        { label: "Dates and response", fields: [
          { label: "Dates and response to treatment", span: 3, lines: 3 },
        ]},
        { label: "Reason for referral", fields: [
          { label: "Specific reason and requested outcome", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "checkboxes", title: "Patient discussion", items: [
        "Diagnosis and prognosis discussed",
        "Options discussed, including no treatment and tooth loss risk",
        "Patient understands referral may not be accepted",
        "Patient understands ongoing maintenance remains essential",
        "Patient consents to referral and sharing records / radiographs",
      ]},

      { kind: "script", title: "Referral narrative script", body: "\"I am referring this patient because they have periodontal disease with features that need specialist assessment. Initial care and risk-factor advice have been provided, and the attached charting/radiographs show the sites of concern. The requested outcome is specialist advice on prognosis, further treatment options and maintenance planning.\"" },

      { kind: "table", title: "Submission checklist", columns: ["Check", "Complete / notes"], rows: [
        ["Reason for referral is clear and linked to complexity or non-response.", ""],
        ["Relevant medical, social and risk-factor information included.", ""],
        ["Radiographs are current, labelled and diagnostic.", ""],
        ["Periodontal charting and bleeding / plaque scores are attached.", ""],
        ["Previous treatment and response are summarised.", ""],
      ]},

      { kind: "references", items: [BSP_REFERRAL, SDCEP_PERIO, SDCEP_REFERRAL, BSP_BPE, OHID_DBOH, CGDENT_RECORDS] },
    ],
  },
  {
    id: "perio-ref-002",
    code: "PERIO-REF-002",
    type: "Data summary template",
    title: "Supporting Periodontal Data Summary",
    purpose: "Data capture sheet for BPE, 6-point pocket charting, bleeding, plaque, risk factors and radiographs.",
    format: "DOCX / PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-003",
    code: "PERIO-REF-003",
    type: "Clinical guidance",
    title: "Periodontal Referral Criteria & Case Complexity Guidance",
    purpose: "General criteria for GDP management, enhanced services and specialist referral.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-004",
    code: "PERIO-REF-004",
    type: "Clinical criteria",
    title: "Stage III / IV & Complex Periodontitis Referral Criteria",
    purpose: "Clear referral thresholds for advanced periodontitis and complex features.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-005",
    code: "PERIO-REF-005",
    type: "Clinical pathway",
    title: "Periodontal Treatment Pathway Before Referral",
    purpose: "Stepwise primary care pathway before referral is considered.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-006",
    code: "PERIO-REF-006",
    type: "Clinical pathway",
    title: "Peri-Implantitis Specialist Pathway",
    purpose: "Assessment, initial non-surgical management and referral triggers for peri-implantitis.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-007",
    code: "PERIO-REF-007",
    type: "Clinical guidance",
    title: "Mucogingival / Recession Referral Guidance",
    purpose: "Referral guidance for recession, root coverage and mucogingival concerns.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
  },
  {
    id: "perio-ref-008",
    code: "PERIO-REF-008",
    type: "Urgent guidance",
    title: "Acute Periodontal Conditions Referral Guidance",
    purpose: "Urgent management and referral triggers for acute periodontal presentations.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_PERIO,
    urgent: true,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * 2-WEEK WAIT / URGENT SUSPECTED CANCER — all 6 docs fully authored.
 * Urgent pathway. Visual styling cascades via the specialty `color` value.
 * ──────────────────────────────────────────────────────────────────────────── */

const GOV_NOTE_USC =
  "This template is designed for adaptation by a UK dental practice or dental group. It must be checked against current NICE suspected cancer referral guidance, local NHS / ICB urgent suspected cancer routes (including e-RS), and the practice's clinical governance, photography and data-sharing policies before publication.";

const uscDocuments = [
  {
    id: "ref-usc-01",
    code: "REF-USC-01",
    type: "Referral form",
    title: "Urgent Suspected Cancer Referral Form — Oral / Head & Neck",
    purpose: "Internal referral capture form for suspected oral, lip, or head and neck cancer. Supports the clinician before submitting the official local NHS urgent suspected cancer referral.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "callout", variant: "danger", body: "This template supports referral capture only. Use the current local NHS urgent suspected cancer / e-RS referral route required by your ICB or hospital provider." },

      { kind: "section", title: "Patient and referral details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient full name" },
          { label: "DOB / NHS no." },
          { label: "Contact number" },
          { label: "Interpreter / accessibility needs", span: 3 },
        ]},
        { label: "Referral", fields: [
          { label: "Referring clinician" },
          { label: "Practice / site" },
          { label: "Referral date and time" },
          { label: "Referral destination / portal", span: 3 },
        ]},
      ]},

      { kind: "section", title: "Urgent referral trigger" },
      { kind: "info-grid", cols: 2, items: [
        { title: "NICE suspected cancer triggers", bullets: [
          "Unexplained ulceration in the oral cavity lasting more than 3 weeks.",
          "Persistent unexplained neck lump.",
          "Lump on lip or in oral cavity consistent with oral cancer.",
          "Red or red-and-white patch consistent with erythroplakia or erythroleukoplakia.",
        ]},
        { title: "Additional concerning features", bullets: [
          "Unexplained swelling or non-healing extraction socket.",
          "Unexplained tooth mobility not periodontal in origin.",
          "Persistent unilateral throat / oral discomfort, dysphagia or voice change.",
          "Numbness, paraesthesia, unexplained bleeding or weight loss.",
        ]},
      ]},

      { kind: "section", title: "Clinical summary" },
      { kind: "field-rows", rows: [
        { label: "Lesion", fields: [
          { label: "Size and appearance", span: 3, lines: 2 },
          { label: "Pain / bleeding / ulceration / induration", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "Risk factors, examination and attachments" },
      { kind: "info-grid", cols: 3, items: [
        { title: "Risk factors", bullets: [
          "Tobacco / vaping history recorded.",
          "Alcohol history recorded.",
          "Previous head/neck cancer or radiotherapy.",
          "Immunosuppression or relevant medical history.",
        ]},
        { title: "Examination", bullets: [
          "Extra-oral and neck examination completed.",
          "Intra-oral soft tissue examination completed.",
          "Dental/periodontal cause considered where relevant.",
          "Radiographs reviewed if clinically indicated.",
        ]},
        { title: "Attachments", bullets: [
          "Clinical photographs attached.",
          "Radiographs attached where relevant.",
          "Medication / medical risk details included.",
          "Contact details verified with patient.",
        ]},
      ]},

      { kind: "section", title: "Patient communication and safety net" },
      { kind: "callout", variant: "danger", title: "Patient must be informed", body: "Explain that this is an urgent suspected cancer referral to rule out serious disease, not a confirmed diagnosis. Confirm availability for rapid appointment contact." },
      { kind: "field-rows", rows: [
        { label: "Confirmation", fields: [
          { label: "Written / verbal safety-net advice given" },
          { label: "Tracking log entry created" },
          { label: "Patient informed urgent pathway required" },
          { label: "Consent to share referral information" },
          { label: "Notes / agreed actions", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "Sign-off" },
      { kind: "field-rows", rows: [
        { label: "Clinician", fields: [
          { label: "Clinician" },
          { label: "GDC number" },
          { label: "Date / time" },
        ]},
      ]},

      { kind: "reference-basis", body: "NICE suspected cancer referral criteria, local NHS urgent suspected cancer referral routes, and GDC record-keeping / consent expectations." },
    ],
  },

  {
    id: "ref-usc-02",
    code: "REF-USC-02",
    type: "Referral criteria",
    title: "Oral Cancer Red Flags & Referral Criteria",
    purpose: "A quick clinical reference for recognising urgent oral, lip and head and neck cancer referral triggers and avoiding unsafe monitoring.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "section", title: "Immediate rule" },
      { kind: "callout", variant: "danger", body: "If the lesion meets urgent suspected cancer criteria, refer without delay. Do not monitor first." },
      { kind: "info-grid", cols: 2, items: [
        { title: "Refer urgently", body: "Use the urgent suspected cancer pathway where the clinical appearance, history, persistence or associated symptoms raise suspicion of oral, lip or head and neck cancer." },
        { title: "Monitor only when safe", body: "Short-interval review is only appropriate where there is an obvious benign / traumatic cause, no red flags, and clear safety-net instructions are documented." },
      ]},

      { kind: "section", title: "Core red flags" },
      { kind: "table", columns: ["Finding", "Urgent action", "Record"], rows: [
        ["Unexplained oral ulceration lasting more than 3 weeks", "Urgent suspected cancer referral", "Site, size, duration, symptoms, images"],
        ["Persistent unexplained neck lump", "Urgent suspected cancer referral", "Location, size, fixation, duration"],
        ["Lump on lip or in oral cavity consistent with oral cancer", "Urgent dental / specialist assessment pathway as locally required", "Description, images, risk factors"],
        ["Red or red-and-white patch consistent with erythroplakia / erythroleukoplakia", "Urgent dental / specialist assessment pathway as locally required", "Site, texture, persistence, images"],
      ]},

      { kind: "section", title: "Additional concerning features" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Oral findings", bullets: [
          "Non-healing extraction socket or unexplained swelling.",
          "Unexplained bleeding, induration, fixation or altered sensation.",
          "Unexplained tooth mobility not consistent with periodontal disease.",
          "Persistent unilateral discomfort or pain with no dental cause.",
        ]},
        { title: "General / history", bullets: [
          "Dysphagia, voice change, trismus or unexplained weight loss.",
          "High-risk tobacco / alcohol history or previous head and neck cancer.",
          "Patient reports a lesion that is enlarging or changing.",
          "Clinician has unresolved concern despite uncertain presentation.",
        ]},
      ]},

      { kind: "section", title: "Referral decision guide" },
      { kind: "numbered-steps", items: [
        { title: "Assess the lesion and neck.", body: "Record site, size, duration, symptoms, risk factors, mucosal appearance, palpation findings and relevant dental/radiographic context." },
        { title: "Check urgent criteria.", body: "If any urgent suspected cancer criterion or high-risk feature is present, complete urgent referral and patient communication steps immediately." },
        { title: "Photograph and measure.", body: "Attach clear clinical photographs and document dimensions in millimetres where possible. Use consistent follow-up imaging only when monitoring is safe." },
        { title: "Safety-net clearly.", body: "Tell the patient what to expect, when to seek urgent help and what will happen if they are not contacted. Record the advice given." },
      ]},

      { kind: "section", title: "Not suitable for monitoring alone" },
      { kind: "callout", variant: "danger", title: "Do not delay referral", body: "for ulceration persisting beyond 3 weeks, red / red-white patches suspicious for erythroplakia / erythroleukoplakia, unexplained lumps, indurated lesions, unexplained neck lumps, or clinician concern that cancer cannot be excluded." },

      { kind: "section", title: "Local pathway checks" },
      { kind: "table", columns: ["Check", "Complete", "Notes"], rows: [
        ["Current local referral form / e-RS route used", "", ""],
        ["Images and radiographs attached where required", "", ""],
        ["Patient informed and contact details checked", "", ""],
        ["Tracking log opened", "", ""],
      ]},

      { kind: "reference-basis", body: "NICE suspected cancer referral guidance and local NHS urgent suspected cancer pathways." },
    ],
  },

  {
    id: "ref-usc-03",
    code: "REF-USC-03",
    type: "Clinical guidance",
    title: "Clinical Photography & Referral Evidence Checklist",
    purpose: "A practical checklist for photographs, measurements, history, attachments and minimum referral evidence for urgent oral cancer referrals.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "callout", variant: "info", body: "Good photographs and referral evidence reduce delay, support triage and create a clear record of the lesion at the point of referral. Photographs must never replace clinical judgement or delay urgent referral." },

      { kind: "section", title: "Minimum evidence set" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Clinical information", bullets: [
          "Site, side and anatomical description.",
          "Size in mm, duration and change over time.",
          "Symptoms: pain, bleeding, numbness, dysphagia, trismus.",
          "Relevant risk factors and medical history.",
        ]},
        { title: "Attachments", bullets: [
          "Overview image showing orientation and site.",
          "Close-up image with focus and good lighting.",
          "Image with measuring probe / ruler where possible.",
          "Radiograph or charting when dental / bony cause considered.",
        ]},
      ]},

      { kind: "section", title: "Photography standard" },
      { kind: "table", columns: ["Area", "Standard", "Tick"], rows: [
        ["Consent / explanation", "Explain the image is part of the clinical record / referral. Follow practice photography and data policy.", ""],
        ["Lighting and focus", "Use bright, even lighting. Avoid blur, shadow, saliva glare and obstructed views.", ""],
        ["Orientation", "Take an overview image first, then close-up. Use retractors / mirror where appropriate.", ""],
        ["Measurement", "Record dimensions in mm. Include probe / ruler if safe and clean image is possible.", ""],
        ["File handling", "Save securely to the clinical record. Do not store on personal devices or messaging apps.", ""],
      ]},

      { kind: "section", title: "Referral evidence checklist" },
      { kind: "table", columns: ["Item", "Complete", "Notes"], rows: [
        ["Patient contact details verified", "", ""],
        ["History, duration and progression recorded", "", ""],
        ["Risk factors recorded", "", ""],
        ["Extra-oral / neck examination recorded", "", ""],
        ["Intra-oral soft tissue examination recorded", "", ""],
        ["Clinical photographs attached", "", ""],
        ["Radiographs attached where relevant", "", ""],
        ["Patient informed of urgent referral", "", ""],
        ["Referral tracking log opened", "", ""],
      ]},

      { kind: "section", title: "Suggested image file naming" },
      { kind: "callout", variant: "info", title: "Format", body: "YYYY-MM-DD_PatientInitials_NHSNo_orDOB_Site_View — Example: 2026-05-10_AB_1234567890_LeftLateralTongue_CloseUp.jpg" },

      { kind: "section", title: "Quality fail actions" },
      { kind: "info-grid", cols: 2, items: [
        { title: "If images are poor", body: "Retake immediately if this can be done without delaying referral. If not, submit referral with the available evidence and explain limitations." },
        { title: "If urgent criteria are met", body: "Do not delay the referral to obtain ideal images. Send what is available and arrange supplementary evidence if requested." },
      ]},

      { kind: "reference-basis", body: "GDC record-keeping principles and local NHS referral triage requirements." },
    ],
  },

  {
    id: "ref-usc-04",
    code: "REF-USC-04",
    type: "Monitoring record",
    title: "Soft Tissue Lesion Monitoring & Safety-Netting Chart",
    purpose: "A record template for short-interval monitoring only where urgent cancer criteria are not met and clear safety-netting is documented.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "callout", variant: "danger", body: "Use only when urgent suspected cancer criteria are not met. If red flags are present or the clinician is concerned, refer urgently instead of monitoring." },

      { kind: "section", title: "Patient and lesion details" },
      { kind: "field-rows", rows: [
        { label: "Lesion", fields: [
          { label: "Lesion site / side" },
          { label: "Likely benign cause identified?" },
          { label: "Patient name / DOB" },
          { label: "Clinician", span: 3 },
          { label: "Initial description and patient history", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "Safety check before monitoring" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Monitoring may be appropriate where", bullets: [
          "There is a clear traumatic or benign explanation.",
          "No suspicious red, red-white, indurated or enlarging features.",
          "No unexplained neck lump or systemic red flags.",
          "Patient has been given a specific review date.",
        ]},
        { title: "Escalate rather than monitor where", bullets: [
          "Ulceration persists beyond 3 weeks or is unexplained.",
          "Lesion is suspicious, indurated, enlarging, bleeding or unexplained.",
          "Red or red-white patch is suspicious.",
          "Patient fails to attend review and risk remains unresolved.",
        ]},
      ]},

      { kind: "section", title: "Monitoring chart" },
      { kind: "table", columns: ["Date", "Size / appearance", "Photo ref.", "Advice / action", "Next review"], rows: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ]},

      { kind: "section", title: "Escalation triggers during monitoring" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Refer urgently if", bullets: [
          "No improvement or unresolved lesion at the agreed review point.",
          "Lesion enlarges, becomes indurated, ulcerates or bleeds.",
          "Neck lump, numbness, dysphagia, trismus or systemic symptoms appear.",
          "Patient anxiety or clinician concern means cancer cannot be excluded.",
        ]},
        { title: "Patient safety-net wording", body: "\"Please contact us immediately if this area gets bigger, becomes more painful, bleeds, changes colour, or if you notice a lump in your neck. Do not wait for the next appointment.\"" },
      ]},

      { kind: "section", title: "Decision log" },
      { kind: "field-rows", rows: [
        { label: "Decision", fields: [
          { label: "Patient safety-net advice given" },
          { label: "Outcome" },
          { label: "Reason monitoring was considered safe" },
          { label: "Review date agreed" },
          { label: "Final notes / referral decision", span: 3, lines: 3 },
        ]},
        { label: "Sign-off", fields: [
          { label: "Clinician" },
          { label: "Date" },
          { label: "Practice / site" },
        ]},
      ]},

      { kind: "reference-basis", body: "NICE urgent suspected cancer criteria and local safety-netting responsibilities." },
    ],
  },

  {
    id: "ref-usc-05",
    code: "REF-USC-05",
    type: "Communication guide",
    title: "Patient Communication — Urgent Referral",
    purpose: "A communication guide and record for explaining urgent suspected cancer referral clearly, safely and compassionately.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "section", title: "Communication aim" },
      { kind: "callout", variant: "info", body: "Explain the reason for urgent referral honestly and calmly. The patient should understand that cancer needs to be ruled out, the referral is urgent, and they must be available for rapid contact." },

      { kind: "section", title: "Suggested clinician wording" },
      { kind: "script", title: "Core script", body: "\"I have found an area that needs urgent specialist assessment. This does not mean you definitely have cancer, but the safest thing is to refer you on the urgent suspected cancer pathway so it can be checked quickly.\"" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Explain what happens next", body: "\"The hospital or referral service should contact you with an appointment. Please answer unknown numbers and tell us if your contact details change.\"" },
        { title: "Explain safety-netting", body: "\"If the area gets worse, you develop swelling, bleeding, a neck lump, difficulty swallowing or breathing, or you cannot get an appointment, contact us immediately.\"" },
      ]},

      { kind: "checkboxes", title: "Patient understanding checklist", items: [
        "Patient understands this is an urgent referral to rule out serious disease, not a confirmed diagnosis.",
        "Patient understands the importance of attending the offered appointment.",
        "Patient contact details and availability checked.",
        "Patient advised to contact the practice if they are not contacted by the referral service within the expected local timeframe.",
        "Written or verbal safety-net advice provided.",
      ]},

      { kind: "section", title: "Communication record" },
      { kind: "field-rows", rows: [
        { label: "Communication", fields: [
          { label: "Patient informed by" },
          { label: "Date / time" },
          { label: "Patient preferred contact method" },
          { label: "Interpreter / support person involved", span: 3 },
        ]},
      ]},

      { kind: "section", title: "Do and do not" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Do", bullets: [
          "Use clear, direct language and allow time for questions.",
          "Check the patient's understanding and practical availability.",
          "Document the exact explanation and advice given.",
          "Offer written information and signpost support where appropriate.",
        ]},
        { title: "Do not", bullets: [
          "Promise the lesion is harmless if referral criteria are met.",
          "Use vague wording such as \"just to be safe\" without explaining urgency.",
          "Delay referral while waiting to see if the patient agrees to monitoring.",
          "Leave the patient unclear about what to do if no appointment arrives.",
        ]},
      ]},

      { kind: "section", title: "Support and practical barriers" },
      { kind: "table", columns: ["Barrier / need", "Action agreed", "Responsible person"], rows: [
        ["Transport / mobility", "", ""],
        ["Interpreter / communication support", "", ""],
        ["High anxiety / support person", "", ""],
        ["Contact difficulties", "", ""],
      ]},

      { kind: "section", title: "Sign-off" },
      { kind: "field-rows", rows: [
        { label: "Clinician", fields: [
          { label: "Clinician" },
          { label: "Patient questions answered?" },
          { label: "Tracking log opened?" },
        ]},
      ]},

      { kind: "reference-basis", body: "GDC communication, consent and record-keeping expectations, and local urgent suspected cancer referral requirements." },
    ],
  },

  {
    id: "ref-usc-06",
    code: "REF-USC-06",
    type: "Tracking log",
    title: "Urgent Referral Tracking & Safety-Netting Log",
    purpose: "A tracking record for referral sent date, acknowledgement, patient contact, chase actions, outcomes and escalation.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    urgent: true,
    governanceNote: GOV_NOTE_USC,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "callout", variant: "info", body: "This log helps the practice evidence that urgent suspected cancer referrals are sent, acknowledged, communicated to the patient and chased where required. It should be used alongside the clinical record and local referral system." },

      { kind: "section", title: "Urgent referral tracking log" },
      { kind: "table", columns: ["Patient", "Referral sent date/time", "Destination / portal", "Acknowledgement", "Patient informed", "Chase due", "Outcome"], rows: [
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["", "", "", "", "", "", ""],
      ]},

      { kind: "section", title: "Minimum tracking checks" },
      { kind: "info-grid", cols: 2, items: [
        { title: "At referral", bullets: [
          "Referral submitted through correct local route.",
          "Referral confirmation / receipt saved.",
          "Patient told it is urgent and contact details checked.",
          "Clinical images / radiographs attached where required.",
        ]},
        { title: "After referral", bullets: [
          "Acknowledgement checked.",
          "Appointment / contact outcome tracked.",
          "Non-attendance or failure to respond escalated.",
          "Outcome filed in clinical record when received.",
        ]},
      ]},

      { kind: "section", title: "Chase and escalation rules" },
      { kind: "callout", variant: "danger", title: "Local timeframes vary", body: "Use the group's agreed pathway and ICB / hospital guidance. If an acknowledgement or appointment is not received within the expected timeframe, chase the referral service and document the action." },
      { kind: "numbered-steps", items: [
        { title: "Check referral sent.", body: "Confirm the correct referral route, attachment upload and submission receipt." },
        { title: "Contact the patient.", body: "Verify whether the patient has received a call, text, letter or appointment. Reconfirm availability and contact details." },
        { title: "Chase provider / referral centre.", body: "Record who was contacted, time, advice received and next action." },
        { title: "Escalate unresolved risk.", body: "If the pathway appears delayed, seek senior clinical / admin escalation and follow local urgent cancer referral processes." },
      ]},

      { kind: "section", title: "Detailed follow-up record" },
      { kind: "table", columns: ["Date / time", "Action taken", "Person contacted", "Advice / outcome", "Next step"], rows: [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ]},
      { kind: "field-rows", rows: [
        { label: "Log reviewed", fields: [
          { label: "Log reviewed by" },
          { label: "Role" },
          { label: "Date" },
        ]},
      ]},

      { kind: "reference-basis", body: "GDC referral record-keeping expectations and local urgent suspected cancer safety-netting processes." },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * ORAL SURGERY / OMFS — all 7 docs fully authored.
 * Reference anchors are cited by name (no URL) per the source documents.
 * ──────────────────────────────────────────────────────────────────────────── */

const GOV_NOTE_OS =
  "This template is designed for adaptation by a UK dental practice or dental group. It must be checked against current NHS England Oral Surgery Clinical Standard, NICE guidance (NG12, TA1), local ICB / commissioning arrangements and provider acceptance criteria, IR(ME)R radiography procedures, and the practice's clinical governance process before publication.";

const OS_REFS = [
  { name: "NHS England Oral Surgery Clinical Standard — routine oral surgery and complexity pathways." },
  { name: "NICE NG12 — suspected cancer referral criteria." },
  { name: "NICE TA1 — pathology-based wisdom tooth removal criteria." },
  { name: "GDC Standards — valid consent, explanation of risks / options / costs, and record-keeping." },
  { name: "SDCEP guidance — acute dental problems, antimicrobial stewardship, and anticoagulant / bleeding risk management." },
];

const oralSurgeryDocuments = [
  {
    id: "ref-os-01",
    code: "REF-OS-01",
    type: "Referral form",
    title: "Oral Surgery Referral Form",
    purpose: "Referral details, clinical findings, radiographs, medical history, consent status and requested treatment.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "callout", variant: "danger", title: "Referral safety check", body: "Use the 2-week wait oral cancer pathway immediately for suspected malignant lesions. Do not use this routine oral surgery form where cancer criteria are met." },

      { kind: "section", title: "Patient and referrer details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient name" },
          { label: "Date of birth / NHS number" },
          { label: "Address / telephone" },
          { label: "Interpreter / communication needs", span: 3 },
        ]},
        { label: "Referrer", fields: [
          { label: "Referring clinician / GDC number" },
          { label: "Practice / secure email / telephone", span: 2 },
        ]},
      ]},

      { kind: "section", title: "Referral request" },
      { kind: "field-rows", rows: [
        { label: "Request", fields: [
          { label: "Requested service — oral surgery / OMFS / biopsy / advice only" },
          { label: "Urgency — routine / urgent / post-operative complication" },
          { label: "Tooth / site / side" },
          { label: "Provisional diagnosis", span: 3 },
          { label: "Reason for referral — describe symptoms, duration, previous treatment, why this cannot be managed in primary care, and specific treatment requested", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "Clinical findings and attachments" },
      { kind: "checkboxes", items: [
        "Clinical photographs attached where relevant.",
        "Relevant radiographs attached and dated.",
        "Periodontal / restorability information included.",
        "Previous treatment or complications described.",
        "Patient has been told why referral is being made.",
        "Patient is available and willing to attend.",
      ]},
      { kind: "field-rows", rows: [
        { label: "Examination summary", fields: [
          { label: "Include swelling, trismus, infection signs, mucosal findings, nerve symptoms, sinus involvement, mobility, caries / restoration status and mouth opening", span: 3, lines: 4 },
        ]},
      ]},

      { kind: "section", title: "Medical risk and medicines" },
      { kind: "field-rows", rows: [
        { label: "Medical", fields: [
          { label: "ASA / relevant medical history" },
          { label: "Allergies" },
          { label: "Anticoagulants / antiplatelets" },
          { label: "Antiresorptives / radiotherapy / immunosuppression" },
          { label: "Pregnancy / breastfeeding if relevant" },
          { label: "Sedation, anxiety or special care needs" },
        ]},
      ]},

      { kind: "section", title: "Referral triage confirmation" },
      { kind: "checkboxes", items: [
        "Referral is within local acceptance criteria or the reason for exception is clearly documented.",
        "Radiographs are recent, diagnostic and appropriate to the question being asked.",
        "Known 2WW oral cancer criteria have been considered and excluded, or the urgent cancer pathway has been used instead.",
        "Patient understands this is a referral request and that the receiving service may triage, redirect or reject incomplete referrals.",
      ]},

      { kind: "callout", variant: "warning", title: "Localisation required", body: "Replace placeholder referral destinations, contact details, acceptance criteria and upload routes with the current local ICB, NHS e-Referral Service, hospital, community provider or private specialist pathway." },
      { kind: "references", title: "Reference anchors", items: [
        { name: "GDC Standards — valid consent and explanation of options / costs." },
        { name: "NICE NG12 — suspected oral cancer referral pathway." },
        { name: "NHS England Oral Surgery Clinical Standard — routine oral surgery and complexity pathways." },
      ]},
    ],
  },

  {
    id: "ref-os-02",
    code: "REF-OS-02",
    type: "Referral criteria",
    title: "Oral Surgery Referral Criteria & Triage Guide",
    purpose: "GDP-managed cases, Level 2 oral surgery, OMFS referral thresholds, required records and rejection reasons.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "Use this guide before submitting an oral surgery or OMFS referral. It supports consistent triage, reduces rejected referrals and helps patients reach the right service first time." },

      { kind: "section", title: "Core rule" },
      { kind: "callout", variant: "info", body: "Routine extractions are normally within GDP care. Refer when complexity, risk, anatomy, medical history, anxiety or service limitations mean care is outside competence, setting or available equipment." },

      { kind: "section", title: "Suggested triage levels" },
      { kind: "table", columns: ["Pathway", "Typical examples", "Referral content required"], rows: [
        ["Primary care / GDP", "Routine extraction, simple retained roots, simple local measures for infection when within competence.", "Record rationale for managing in practice, consent, radiograph where indicated and safety checks."],
        ["Level 2 / intermediate oral surgery", "Moderately difficult surgical extraction, uncomplicated impacted third molar meeting criteria, retained roots requiring flap / bone removal, patient anxiety suitable for local pathway.", "Clear reason for referral, diagnostic image, medical history, difficulty factors and requested treatment."],
        ["OMFS / secondary care", "High-risk anatomy, nerve / sinus risk, significant medical risk, severe infection, suspected pathology, complex trauma, GA / special care requirement, failed previous attempts.", "Full clinical details, medical risk summary, radiographs / CBCT if justified, photographs, urgency and contact route."],
      ]},

      { kind: "section", title: "Common reasons referrals are rejected or delayed" },
      { kind: "prose-list", items: [
        "Insufficient clinical information or no clear reason why the case cannot be treated in primary care.",
        "No diagnostic radiograph, poor quality image, image not dated or not attached.",
        "Medical history, anticoagulant status or allergy details missing.",
        "Third molar referral not aligned with NICE pathology criteria.",
        "Soft tissue lesion not routed through 2WW when urgent cancer criteria are present.",
        "Patient not informed that referral is being made or not available to attend.",
      ]},

      { kind: "section", title: "Urgent escalation triggers" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Same-day emergency", body: "Airway compromise, rapidly spreading swelling, floor of mouth elevation, severe trismus, systemic sepsis, uncontrolled bleeding, altered consciousness or suspected major nerve injury after surgery." },
        { title: "2-week wait pathway", body: "Unexplained oral ulcer lasting more than 3 weeks, persistent unexplained neck lump, oral lump, or red / red-white patch consistent with erythroplakia or erythroleukoplakia." },
      ]},

      { kind: "section", title: "Referral quality checklist" },
      { kind: "checkboxes", items: [
        "Reason for referral is explicit.",
        "Correct pathway selected.",
        "Diagnostic radiograph attached.",
        "Medical risk checked.",
        "Patient informed of pathway.",
        "Urgency documented.",
      ]},

      { kind: "callout", variant: "warning", title: "Localisation required", body: "Replace placeholder referral destinations, contact details, acceptance criteria and upload routes with the current local ICB, NHS e-Referral Service, hospital, community provider or private specialist pathway." },
      { kind: "references", title: "Reference anchors", items: [
        { name: "NHS England Oral Surgery Clinical Standard — GDPs expected to provide routine oral surgery, complex cases managed by specialists / consultants." },
        { name: "NICE NG12 — suspected cancer referral criteria." },
        { name: "NICE TA1 — pathology-based wisdom tooth removal criteria." },
      ]},
    ],
  },

  {
    id: "ref-os-03",
    code: "REF-OS-03",
    type: "Clinical pathway",
    title: "Surgical Extraction Pathway Guide",
    purpose: "Case assessment, local anaesthesia, flap design, sectioning, bone removal, haemostasis, retained roots and referral triggers.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "section", title: "Before starting" },
      { kind: "numbered-steps", items: [
        { title: "Confirm identity, tooth / site, indication, radiograph, medical history, medicines, allergies and valid consent." },
        { title: "Assess difficulty: access, root form, ankylosis, proximity to inferior dental canal, maxillary sinus, adjacent restorations and patient tolerance." },
        { title: "Confirm whether the case is within clinician competence, setting and equipment. Refer before starting if risk exceeds competence or local scope." },
      ]},

      { kind: "section", title: "Pathway stages" },
      { kind: "table", columns: ["Stage", "Protocol points", "Document"], rows: [
        ["Assessment", "Diagnosis, restorability, periodontal status, radiographic anatomy, medical risk, bleeding risk and alternatives.", "Reason for extraction and options discussed."],
        ["Planning", "Local anaesthetic plan, flap requirement, sectioning, bone removal, haemostasis measures, instruments and post-op advice.", "Treatment plan, consent and risk discussion."],
        ["Surgery", "Atraumatic technique, soft tissue protection, irrigation, debridement where appropriate, avoid excessive force, reassess if unexpected difficulty occurs.", "Procedure completed, complications or deviations."],
        ["Closure and haemostasis", "Inspect socket, remove debris, smooth sharp bone if required, achieve haemostasis, place sutures where indicated.", "Haemostasis method and advice given."],
        ["Discharge", "Give written aftercare, analgesia advice, bleeding instructions, emergency contact and review plan.", "Aftercare and review instructions."],
      ]},

      { kind: "section", title: "Stop and refer triggers" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Do not continue blindly", body: "Stop and reassess if roots fracture deeply, access becomes unsafe, sinus / nerve risk changes, uncontrolled bleeding occurs, the patient becomes unwell or the procedure exceeds the original plan." },
        { title: "Retained root decision", body: "Do not chase a root where retrieval creates disproportionate nerve, sinus, bone-loss or tuberosity fracture risk. Document the decision, inform the patient and arrange review / referral where required." },
      ]},

      { kind: "section", title: "Referral information after attempted extraction" },
      { kind: "prose-list", items: [
        "Tooth / site, date, indication and stage reached.",
        "Radiograph before and after attempt where appropriate.",
        "Complication encountered and immediate management.",
        "Analgesics, antibiotics if indicated, haemostatic measures and sutures used.",
        "Nerve symptoms, sinus symptoms, swelling, trismus or bleeding status.",
        "Patient advice given and urgency requested.",
      ]},

      { kind: "callout", variant: "warning", title: "Localisation required", body: "Replace placeholder referral destinations, contact details, acceptance criteria and upload routes with the current local ICB, NHS e-Referral Service, hospital, community provider or private specialist pathway." },
      { kind: "references", title: "Reference anchors", items: [
        { name: "NHS England Oral Surgery Clinical Standard — routine extraction within primary care, complex care through appropriate providers." },
        { name: "GDC Standards — valid consent before treatment and explanation of risks / options / costs." },
        { name: "SDCEP acute dental problems guidance — local measures first, antibiotics only where indicated." },
      ]},
    ],
  },

  {
    id: "ref-os-04",
    code: "REF-OS-04",
    type: "Referral criteria",
    title: "Impacted Third Molar Referral Criteria",
    purpose: "NICE-aligned pathology criteria, pericoronitis, caries, resorption, cystic change, nerve risk, imaging and referral evidence.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "callout", variant: "danger", title: "NICE position", body: "Do not refer for prophylactic removal of pathology-free impacted third molars in the NHS. Referral should be supported by evidence of pathology or a justified clinical exception." },

      { kind: "section", title: "Referral criteria" },
      { kind: "table", columns: ["Accepted indication", "Examples of evidence to include", "Notes"], rows: [
        ["Unrestorable caries", "Clinical findings, radiograph, symptoms and restorability assessment.", "Include caries affecting third molar or associated second molar where relevant."],
        ["Pulpal / periapical pathology", "Pain history, vitality / sensibility findings, swelling, radiographic lesion.", "Explain why endodontic / restorative management is unsuitable if relevant."],
        ["Cellulitis, abscess or osteomyelitis", "Swelling, trismus, systemic signs, previous episodes, treatment given.", "Escalate urgently if spreading / systemic infection."],
        ["Resorption or damage to adjacent tooth", "Radiographic evidence of internal / external resorption or periodontal defect.", "Attach diagnostic image with tooth notation."],
        ["Follicular pathology", "Cystic change, tumour concern, follicle changes or pathological expansion.", "Route suspected malignancy through 2WW where criteria are met."],
        ["Recurrent significant pericoronitis", "Documented episodes, severity, local measures, antibiotic history if any.", "A single mild episode is usually not enough by itself."],
      ]},

      { kind: "section", title: "Radiographic and anatomical risk" },
      { kind: "prose-list", items: [
        "Provide current diagnostic imaging showing tooth angulation, root morphology, pathology and relationship to the inferior dental canal or maxillary sinus.",
        "Record altered sensation, pain pattern, mouth opening and infection status.",
        "Consider whether CBCT is justified only where it will change management, and follow local radiography / IR(ME)R procedures.",
        "Where nerve risk is high, indicate whether coronectomy has been considered by the receiving service or whether specialist assessment is requested.",
      ]},

      { kind: "section", title: "Referral form prompts" },
      { kind: "field-rows", rows: [
        { label: "Prompts", fields: [
          { label: "Tooth / side" },
          { label: "Indication category" },
          { label: "Number / severity of pericoronitis episodes" },
          { label: "Image attached / date" },
          { label: "Evidence of pathology and treatment already provided", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "Do not use this pathway for" },
      { kind: "callout", variant: "warning", body: "Orthodontic extraction decisions, routine monitoring of asymptomatic pathology-free third molars, or suspected oral cancer. Use the correct referral pathway for those scenarios." },

      { kind: "references", title: "Reference anchors", items: [
        { name: "NICE TA1 — prophylactic removal of pathology-free impacted third molars should be discontinued; removal should be limited to pathology." },
        { name: "NICE NG12 — suspected oral cancer referral criteria." },
        { name: "Local oral surgery provider criteria should be checked before submission." },
      ]},
    ],
  },

  {
    id: "ref-os-05",
    code: "REF-OS-05",
    type: "Clinical checklist",
    title: "Medical Risk, Anticoagulants & Bleeding Risk Checklist",
    purpose: "Anticoagulants, antiplatelets, bleeding history, systemic risk, medication review and medical liaison.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "section", title: "Use before referral" },
      { kind: "paragraph", body: "Complete this checklist where medical history or medicines may affect extraction, biopsy, implant surgery, sedation, haemostasis or healing." },

      { kind: "section", title: "High-risk principle" },
      { kind: "callout", variant: "danger", body: "Do not alter prescribed anticoagulant or antiplatelet medicines without following current guidance and, where needed, liaising with the prescriber or specialist service." },

      { kind: "section", title: "Bleeding risk checklist" },
      { kind: "checkboxes", items: [
        "Warfarin — INR result / date recorded.",
        "DOAC — drug, dose, timing and renal risk considered.",
        "Single or dual antiplatelet therapy recorded.",
        "Bleeding disorder or liver disease checked.",
        "Procedure bleeding risk assessed.",
        "Local haemostatic measures planned.",
      ]},

      { kind: "section", title: "Wider surgical risk" },
      { kind: "table", columns: ["Risk area", "Referral note", "Action"], rows: [
        ["Diabetes", "Control, hypoglycaemia risk, infection risk and appointment timing.", "Consider medical liaison for unstable control."],
        ["Antiresorptives / MRONJ risk", "Bisphosphonates, denosumab, cancer dosing, steroid or antiangiogenic therapy.", "Record risk discussion and consider specialist pathway."],
        ["Radiotherapy history", "Head / neck radiotherapy, dose / field if known, osteoradionecrosis risk.", "Refer / liaise before dentoalveolar surgery."],
        ["Immunosuppression", "Chemotherapy, transplant medicines, high-dose steroids, biologics, neutropenia.", "Assess infection risk and need for medical advice."],
        ["Cardiac / infective endocarditis risk", "High-risk cardiac conditions, recent cardiac event or device.", "Follow current local / national guidance and liaise when uncertain."],
        ["Capacity / anxiety / special care", "Capacity, consent, cooperation, needle phobia, sedation / GA need.", "Use special care or sedation pathway where appropriate."],
      ]},

      { kind: "section", title: "Referral detail fields" },
      { kind: "field-rows", rows: [
        { label: "Detail", fields: [
          { label: "Medication name, dose and timing" },
          { label: "Relevant blood tests / INR / renal function" },
          { label: "Medical liaison completed?" },
          { label: "Haemostatic plan", span: 3 },
          { label: "Clinical concern and requested advice", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "callout", variant: "info", title: "Referral quality point", body: "Give enough medical information for the receiving service to decide setting, urgency, haemostatic plan and whether secondary care or medical liaison is required." },
      { kind: "references", title: "Reference anchors", items: [
        { name: "SDCEP Anticoagulants and Antiplatelets guidance — bleeding risk assessment and treatment planning for dental patients." },
        { name: "NHS England Oral Surgery Clinical Standard — complex oral surgery care requires appropriate setting and training." },
        { name: "GDC Standards — consent and communication of material risks." },
      ]},
    ],
  },

  {
    id: "ref-os-06",
    code: "REF-OS-06",
    type: "Clinical pathway",
    title: "Soft Tissue Lesions, Biopsy & Oral Medicine Pathway",
    purpose: "Non-urgent lesion assessment, biopsy referral, oral medicine signposting, red-flag exclusion and 2WW escalation.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "callout", variant: "danger", title: "Do not delay urgent cancer referral", body: "If a lesion meets suspected oral cancer criteria, use the 2-week wait pathway, not a routine biopsy or oral surgery route." },

      { kind: "section", title: "Initial assessment record" },
      { kind: "prose-list", items: [
        "Site, size, colour, surface texture, ulceration, induration, fixation, bleeding and pain.",
        "Duration, change over time, recurrence, trauma source, smoking / alcohol, systemic symptoms and relevant medical history.",
        "Neck examination findings where appropriate.",
        "High-quality clinical photographs with consent and a measuring reference if possible.",
        "Whether local traumatic cause has been removed and whether review interval is appropriate.",
      ]},

      { kind: "section", title: "Pathway selection" },
      { kind: "table", columns: ["Presentation", "Likely route", "Notes"], rows: [
        ["Unexplained ulcer lasting more than 3 weeks, oral lump, red / red-white patch suspicious for erythroplakia / erythroleukoplakia, unexplained persistent neck lump.", "2WW oral cancer", "Make urgent suspected cancer referral. Do not wait for routine review if criteria met."],
        ["Benign-appearing lesion requiring removal or histology.", "Oral surgery / biopsy", "Include photographs, size, site, symptoms, differential diagnosis and medical risk."],
        ["Widespread mucosal disease, burning mouth, lichen planus-type changes, xerostomia, recurrent ulceration or diagnostic uncertainty.", "Oral medicine", "Consider oral medicine pathway if non-surgical diagnosis / management is the primary need."],
        ["Dental abscess / sinus tract or odontogenic swelling.", "Dental / oral surgery", "Manage source locally where possible. Escalate spreading / systemic infection urgently."],
      ]},

      { kind: "section", title: "Routine biopsy referral information" },
      { kind: "field-rows", rows: [
        { label: "Information", fields: [
          { label: "Lesion site and size" },
          { label: "Duration / progression" },
          { label: "Clinical photographs attached?" },
          { label: "2WW criteria considered?" },
          { label: "Description and differential diagnosis", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "Safety-netting" },
      { kind: "prose-list", items: [
        "Record why the case is suitable for routine referral if 2WW criteria are not met.",
        "Give clear return advice if the lesion grows, ulcerates, bleeds, becomes painful or the patient develops neck swelling.",
        "Track referrals until accepted and attended where there is diagnostic uncertainty.",
        "Escalate to urgent pathway if new red flags develop while waiting.",
      ]},

      { kind: "references", title: "Reference anchors", items: [
        { name: "NICE NG12 — oral cancer suspected cancer referral criteria." },
        { name: "GDC Standards — patient communication, consent and records." },
        { name: "Oral medicine and oral surgery pathways should be aligned to local provider acceptance criteria." },
      ]},
    ],
  },

  {
    id: "ref-os-07",
    code: "REF-OS-07",
    type: "Complications guidance",
    title: "Post-Operative Complications & Urgent Re-Referral",
    purpose: "Bleeding, dry socket, infection, swelling, trismus, OAC, nerve symptoms, delayed healing and urgent escalation.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_OS,
    sections: [
      { kind: "section", title: "Immediate danger signs" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Emergency transfer", body: "Call 999 or arrange emergency hospital assessment for airway compromise, rapidly spreading swelling, floor of mouth elevation, severe trismus, systemic sepsis, uncontrolled haemorrhage or significant deterioration." },
        { title: "Urgent specialist advice", body: "Seek urgent OMFS / oral surgery advice for suspected oro-antral communication, persistent altered sensation, severe infection, fracture, displaced root, or bleeding not controlled with local measures." },
      ]},

      { kind: "section", title: "Common complication pathways" },
      { kind: "table", columns: ["Problem", "Initial management", "Refer / re-refer when"], rows: [
        ["Persistent bleeding", "Pressure with gauze, inspect socket, remove clot if needed, identify source, local haemostatic measures, sutures if appropriate.", "Bleeding persists despite local measures, patient is medically high risk, or haemodynamic concern."],
        ["Dry socket / alveolar osteitis", "History usually severe pain a few days after extraction; irrigate gently, dress if local policy supports, provide analgesia and review.", "Pain uncontrolled, diagnosis uncertain, swelling / systemic signs, or delayed healing."],
        ["Infection / swelling", "Assess spreading / systemic signs, drainage / local measures where possible, analgesia, safety-netting.", "Cellulitis, fever, malaise, lymph node involvement, trismus, floor of mouth swelling or immunocompromised patient."],
        ["Oro-antral communication", "Avoid probing, advise sinus precautions, consider urgent specialist advice.", "Suspected OAC / OAF, fluid through nose, air passage, root displaced into sinus."],
        ["Nerve symptoms", "Document sensory change, distribution, onset, function and pain; reassure without dismissing.", "Persistent altered sensation, dysaesthesia, worsening symptoms or surgical nerve risk."],
        ["Delayed healing or suspicious socket", "Assess trauma, infection, MRONJ / radiotherapy risk, lesion or retained root.", "Non-healing, exposed bone, malignancy concern or high-risk medical history."],
      ]},

      { kind: "section", title: "Antibiotic stewardship" },
      { kind: "callout", variant: "warning", title: "Local measures first", body: "Antibiotics should not be used as a substitute for drainage, debridement or removal of the cause. Prescribe only where there is spreading / systemic infection, significant risk of complications or specific guidance-based indication." },

      { kind: "section", title: "Urgent re-referral record" },
      { kind: "field-rows", rows: [
        { label: "Re-referral", fields: [
          { label: "Original procedure / date" },
          { label: "Current problem and duration" },
          { label: "Vital signs / systemic features if assessed" },
          { label: "Treatment already provided", span: 3, lines: 2 },
          { label: "Reason urgent advice / referral is requested", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "references", title: "Reference anchors", items: [
        { name: "BAOS post-operative advice — bleeding control, pain and dry socket considerations." },
        { name: "SDCEP acute conditions guidance — antibiotics only where spreading / systemic infection or higher risk." },
        { name: "NICE NG12 — persistent suspicious lesions should be escalated via suspected cancer pathway." },
      ]},
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * ORTHODONTICS — all 5 docs fully authored.
 * Anchored to BOS, NHS England Commissioning Standard for Primary Care
 * Orthodontics, GDC Standards, IR(ME)R 2017 and NICE NG12 for red flags.
 * ──────────────────────────────────────────────────────────────────────────── */

const GOV_NOTE_ORTHO =
  "This document is a practice-level clinical pathway / referral template. It must be adapted to local NHS / ICB commissioning arrangements, NHS / private referral routes, receiving provider acceptance criteria, indemnity advice and current BOS, GDC, CQC and NHS England guidance before use. Always record clinical justification, patient consent, treatment discussions and safety-netting advice in the clinical notes.";

const ORTHO_REFS_CORE = [
  { name: "British Orthodontic Society — clinical guidance on case selection, consent, clear aligner treatment and retention." },
  { name: "NHS England — Commissioning Standard for Primary Care Orthodontics (IOTN-based eligibility and pathway expectations)." },
  { name: "GDC Standards for the Dental Team — valid consent, scope of practice, communication, record-keeping and safeguarding." },
  { name: "Department of Health and Social Care — Ionising Radiation (Medical Exposure) Regulations 2017 (and 2024 amendment) — justification and recording of dental radiographs." },
  { name: "CGDent / FGDP(UK) — Selection Criteria for Dental Radiography, 3rd edition." },
  { name: "NICE NG12 — suspected cancer recognition and referral (route soft-tissue red flags via the 2-week wait pathway, not orthodontics)." },
];

const orthodonticsDocuments = [
  {
    id: "orth-cp-001",
    code: "ORTH-CP-001",
    type: "Clinical pathway",
    title: "Clear Aligner Clinical Pathway",
    purpose: "A practical pathway for screening, referral, consent, monitoring and completion of clear aligner orthodontic treatment.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ORTHO,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This pathway supports safe, consistent assessment, referral, treatment planning and follow-up for patients considering clear aligner orthodontic treatment. It is intended for clinicians, treatment coordinators and practice teams involved in adult or adolescent orthodontic screening, consent, record taking and onward referral." },
      { kind: "callout", variant: "info", title: "Core principle", body: "Clear aligner treatment is orthodontic treatment, not a cosmetic add-on. Patients require an appropriate diagnosis, periodontal and caries assessment, informed consent, orthodontic records and a clear retention plan." },

      { kind: "section", title: "Scope" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Included", bullets: [
          "Initial suitability screening for aligner treatment.",
          "Referral to an in-house or external orthodontic provider.",
          "Required records before treatment planning.",
          "Consent, risks and patient expectations.",
          "Monitoring, refinements and escalation.",
          "Retention and post-treatment follow-up.",
        ]},
        { title: "Excluded", bullets: [
          "Management of complex skeletal discrepancy without specialist input.",
          "Hospital orthodontic pathways.",
          "Cleft, craniofacial or multidisciplinary restorative cases.",
          "Treatment where active disease or poor oral hygiene is unresolved.",
          "Remote-only treatment without adequate clinical assessment.",
        ]},
      ]},

      { kind: "section", title: "Suitability screening" },
      { kind: "table", columns: ["Suitable to consider", "Requires caution or specialist advice", "Do not proceed until resolved"], rows: [
        [
          "Mild to moderate crowding or spacing. Good oral hygiene and motivation. Stable periodontal condition. Realistic expectations. Accepts retention is long term.",
          "Significant rotations or extrusion / intrusion movements. Deep bite, open bite or crossbite requiring complex correction. Existing implants, bridges or heavily restored teeth. Root resorption history. Unclear occlusal or TMD concerns.",
          "Active caries. Untreated periodontal disease. Poor plaque control. Unresolved pain, infection or pathology. Patient unwilling to attend reviews or wear retainers.",
        ],
      ]},

      { kind: "section", title: "Clinical workflow" },
      { kind: "numbered-steps", items: [
        { title: "Initial discussion and expectation check", body: "Confirm the patient's main concern, desired outcome, timeline, budget awareness and understanding that biological tooth movement has limitations." },
        { title: "Comprehensive dental assessment", body: "Assess caries, periodontal health, oral hygiene, occlusion, soft tissues, restorations, tooth wear, mobility, missing teeth and risk factors." },
        { title: "Orthodontic screening", body: "Record overjet, overbite, molar / incisor relationship, crowding / spacing, crossbites, centrelines, rotations, open bite / deep bite and functional shifts." },
        { title: "Records and investigations", body: "Obtain clinically justified radiographs, intraoral photographs, extraoral photographs and digital scan / impressions according to the provider pathway." },
        { title: "Treatment planning or referral", body: "Refer to the orthodontic provider or in-house clinician with all required records. Confirm whether the pathway is private, NHS, mixed or multidisciplinary." },
        { title: "Consent and financial discussion", body: "Explain limitations, alternatives, likely attachments / IPR, refinements, duration, review schedule, relapse risk, retention requirements and fees." },
        { title: "Active treatment monitoring", body: "Review fit, tracking, oral hygiene, periodontal status, attachments, IPR completion, patient compliance and any pain, ulceration or mobility concerns." },
        { title: "Completion, retainers and discharge", body: "Confirm treatment goals, scan or fit retainers promptly, provide written retention advice and arrange review / failure pathway." },
      ]},

      { kind: "section", title: "Minimum records required" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Clinical assessment", bullets: [
          "Medical history and medication review.",
          "Dental history and previous orthodontic history.",
          "Full periodontal screening and oral hygiene assessment.",
          "Caries risk and active disease status.",
          "Occlusal assessment.",
          "Soft tissue examination.",
        ]},
        { title: "Records and consent", bullets: [
          "Clinically justified radiographs.",
          "Intraoral photographs.",
          "Extraoral photographs where required.",
          "Digital scan or impressions.",
          "Patient concern and expectations.",
          "Signed consent once treatment is agreed.",
        ]},
      ]},

      { kind: "section", title: "Consent points to cover" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Clinical risks", bullets: [
          "Pain, tenderness and temporary speech changes.",
          "Ulceration or soft tissue irritation.",
          "Root resorption.",
          "Gingival recession or black triangles.",
          "Decalcification / caries if hygiene is poor.",
          "Periodontal deterioration in susceptible patients.",
          "Unwanted tooth movement or bite changes.",
        ]},
        { title: "Treatment realities", bullets: [
          "Results depend on aligner wear and attendance.",
          "Attachments and IPR may be required.",
          "Refinements may be needed.",
          "Treatment duration may change.",
          "Not all movements are predictable.",
          "Fixed appliances or specialist referral may be a better option.",
          "Retainers are required long term.",
        ]},
      ]},

      { kind: "section", title: "Review and escalation" },
      { kind: "table", columns: ["Issue", "Action"], rows: [
        ["Aligner not tracking", "Assess compliance, attachment loss, seating, scan accuracy and whether refinement or provider review is required."],
        ["Pain, mobility or periodontal concern", "Pause movement if required, assess clinically, treat underlying disease and escalate to the prescribing orthodontic clinician."],
        ["Attachment failure", "Replace according to provider protocol and document tooth, date, material and any tracking impact."],
        ["Patient non-compliance", "Record advice, explain risks of extended treatment / poor outcome and consider treatment pause or discontinuation."],
        ["Unexpected occlusal change", "Assess bite, function and symptoms; seek orthodontic review before continuing."],
      ]},

      { kind: "section", title: "Documentation standard" },
      { kind: "paragraph", body: "At each appointment record: aligner stage, wear compliance, hygiene, periodontal / caries concerns, attachment status, IPR completed, clinical findings, advice given, next steps, consent discussions and any deviation from the planned pathway." },
      { kind: "callout", variant: "warning", title: "Do not rely on software simulation alone", body: "The clinician remains responsible for diagnosis, suitability, consent, treatment monitoring and escalation." },

      { kind: "references", title: "Reference anchors", items: ORTHO_REFS_CORE },
    ],
  },

  {
    id: "orth-ref-criteria",
    code: "ORTH-REF-CRIT",
    type: "Referral criteria",
    title: "Orthodontic Referral Criteria / IOTN Guidance",
    purpose: "Supports appropriate orthodontic referral decisions and IOTN screening for NHS or private treatment.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ORTHO,
    sections: [
      { kind: "callout", variant: "info", body: "Use this guidance to support appropriate orthodontic referral decisions. It does not replace local referral criteria, specialist judgement or current NHS commissioning requirements." },

      { kind: "section", title: "Quick IOTN summary" },
      { kind: "table", columns: ["IOTN grade / score", "Meaning", "Typical action"], rows: [
        ["DHC Grade 1", "No treatment need", "No NHS orthodontic referral usually required."],
        ["DHC Grade 2", "Little treatment need", "Private options may be discussed if patient wishes."],
        ["DHC Grade 3", "Borderline treatment need", "Consider AC score and local pathway requirements."],
        ["DHC Grade 4", "Treatment need", "Refer where dentally fit and motivated."],
        ["DHC Grade 5", "Very great treatment need", "Refer where dentally fit and motivated."],
        ["AC 1–4", "Little / no aesthetic need", "Usually insufficient aesthetic need."],
        ["AC 5–7", "Borderline aesthetic need", "May support borderline cases."],
        ["AC 8–10", "Great aesthetic need", "Supports significant aesthetic impact."],
      ]},

      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This guidance supports dental clinicians in identifying patients who may require orthodontic referral and in understanding the Index of Orthodontic Treatment Need (IOTN). IOTN is used to assess the clinical need for orthodontic treatment and to help determine whether a patient may be suitable for NHS orthodontic treatment or whether private orthodontic options should be discussed. This document should be used alongside local referral pathways, NHS commissioning requirements and the receiving provider's current referral criteria." },

      { kind: "section", title: "What is IOTN?" },
      { kind: "paragraph", body: "IOTN has two parts: the Dental Health Component (DHC), which grades the clinical severity of the malocclusion from 1 to 5, and the Aesthetic Component (AC), which grades dental appearance from 1 to 10. The DHC is usually the primary driver of clinical need. The AC may be relevant in borderline Grade 3 cases." },

      { kind: "section", title: "NHS orthodontic eligibility" },
      { kind: "callout", variant: "info", body: "Patients are usually considered suitable for NHS orthodontic assessment where they are under 18 and have a clear clinical need. NHS treatment is typically considered where the patient has IOTN DHC Grade 4 or 5, or IOTN DHC Grade 3 with an Aesthetic Component score of 6 or above. Patients who do not meet NHS criteria may still be suitable for private orthodontic treatment where clinically appropriate." },

      { kind: "section", title: "Patients suitable for orthodontic referral" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Increased overjet", body: "Refer where there is a significantly increased overjet, particularly where upper incisors are prominent, lips are incompetent, trauma risk is increased, or the overjet is greater than 6 mm. An overjet greater than 9 mm usually indicates very high treatment need." },
        { title: "Reverse overjet / Class III pattern", body: "Refer where there is a reverse overjet, anterior crossbite, functional displacement, speech or masticatory difficulty, or a suspected skeletal Class III pattern." },
        { title: "Crossbites", body: "Refer where there is an anterior or posterior crossbite associated with displacement, facial asymmetry, functional shift, tooth wear, periodontal trauma or risk of abnormal growth pattern." },
        { title: "Crowding and contact point displacement", body: "Refer where crowding is moderate to severe, particularly where contact point displacement is significant, eruption is being impeded, oral hygiene is compromised, periodontal damage is a concern, or extractions may be required as part of orthodontic planning." },
        { title: "Open bite", body: "Refer where there is an anterior or lateral open bite, speech impact, difficulty biting, associated habit requiring management, or concern regarding the skeletal pattern." },
        { title: "Deep bite", body: "Refer where there is complete overbite, palatal or gingival trauma, lower incisor trauma to palatal tissues, or risk of periodontal damage." },
        { title: "Impacted or ectopic teeth", body: "Refer where there is an impacted canine, delayed eruption, ectopic eruption, retained primary teeth affecting eruption, supernumerary teeth, or suspected obstruction to eruption." },
        { title: "Hypodontia", body: "Refer where permanent teeth are developmentally missing, particularly where restorative planning, space opening, space closure or multidisciplinary input may be required." },
      ]},
      { kind: "callout", variant: "warning", title: "Cleft lip / palate or craniofacial anomaly", body: "Refer through the appropriate specialist pathway where the patient has cleft lip and / or palate, a craniofacial anomaly or a complex developmental dental anomaly." },

      { kind: "section", title: "When NHS orthodontic referral may not be appropriate" },
      { kind: "prose-list", items: [
        "NHS referral is unlikely to be appropriate for minor spacing, mild crowding, mild rotations, minor aesthetic concerns, IOTN Grade 1 or 2, or IOTN Grade 3 with a low Aesthetic Component score.",
        "Delay referral where oral hygiene is poor, caries is active, periodontal disease is uncontrolled, attendance is poor or expectations are unrealistic.",
        "Stabilise dental disease and improve oral hygiene before referral wherever possible.",
      ]},

      { kind: "section", title: "Oral health requirements before referral" },
      { kind: "paragraph", body: "Before referral, the clinician should ensure the patient is dentally fit, caries is stabilised, periodontal health is acceptable, oral hygiene is good and the patient is motivated for treatment. Diet advice, fluoride advice and oral hygiene instruction should be provided where indicated. The patient must understand that orthodontic treatment requires excellent plaque control and long-term retention." },

      { kind: "section", title: "Pre-referral checklist" },
      { kind: "table", columns: ["Check", "Notes"], rows: [
        ["Patient dentally fit.", ""],
        ["Caries stabilised.", ""],
        ["Periodontal health acceptable.", ""],
        ["Good oral hygiene.", ""],
        ["Motivated for treatment.", ""],
        ["Overjet / overbite recorded.", ""],
        ["Occlusal findings recorded.", ""],
        ["Relevant radiographs justified and reported.", ""],
        ["Patient / parent understands referral does not guarantee NHS treatment.", ""],
        ["Referral destination and date recorded.", ""],
      ]},

      { kind: "section", title: "Information to include in the referral" },
      { kind: "paragraph", body: "The referral should include patient details, reason for referral, presenting orthodontic concern, relevant IOTN estimate if known, overjet measurement, overbite description, molar and incisor relationship, crowding or spacing assessment, crossbite or displacement findings, missing or impacted teeth, oral hygiene status, caries and periodontal status, relevant medical history, relevant dental history, radiographs where indicated, photographs if required locally, patient or parent expectations, and whether NHS or private referral is being requested." },

      { kind: "section", title: "Radiographs and records" },
      { kind: "callout", variant: "warning", body: "Radiographs should only be taken where clinically justified. They should not be taken purely because a referral is being made." },
      { kind: "prose-list", items: [
        "Dental panoramic radiograph for impacted teeth, missing teeth or eruption concerns.",
        "Periapical radiographs for localised concerns.",
        "Clinical photographs if required by the local pathway.",
        "Study models or digital scans if requested by the receiving provider.",
        "All radiographs must be justified, reported and recorded in line with normal radiographic standards.",
      ]},

      { kind: "section", title: "Impacted canines — early referral indicators" },
      { kind: "paragraph", body: "Consider early referral where the upper canine is not palpable by age 10–11, there is asymmetry in eruption, lateral incisor root resorption is suspected, the canine position appears ectopic, the primary canine remains retained beyond the expected eruption age, or radiographs suggest displacement or impaction. Early identification can reduce the risk of root resorption and complex treatment." },

      { kind: "section", title: "Consent and patient discussion" },
      { kind: "paragraph", body: "Before referring, explain why referral is being considered, that referral does not guarantee NHS treatment, that eligibility depends on IOTN and specialist assessment, that waiting times may apply, and that excellent oral hygiene is required. Explain that treatment may involve fixed appliances, extractions, aligners, retainers and long-term follow-up. Patients should understand that retention is lifelong after orthodontic treatment. For children, ensure the parent or guardian understands the purpose of referral and the likely pathway." },

      { kind: "section", title: "Private orthodontic referral" },
      { kind: "paragraph", body: "Private referral may be appropriate where the patient does not meet NHS IOTN criteria, is an adult seeking orthodontic treatment, has mainly cosmetic alignment concerns, is interested in clear aligners, wants faster access where available, or where NHS treatment is unavailable or declined. Private options should be discussed transparently and without pressure." },

      { kind: "section", title: "Red flags / urgent referral considerations" },
      { kind: "callout", variant: "danger", body: "Orthodontic referral is not the correct pathway for suspected malignancy, unexplained swelling, persistent ulceration or rapidly changing soft tissue lesions. Use the urgent suspected cancer referral pathway where indicated. Urgent advice or referral may also be needed for dental trauma, acute infection, facial swelling, severe pain, suspected pathology, rapid tooth movement or unexplained mobility." },

      { kind: "references", title: "Reference anchors", items: ORTHO_REFS_CORE },
    ],
  },

  {
    id: "orth-ref-adults",
    code: "ORTH-REF-ADULT",
    type: "Referral form",
    title: "Orthodontic Referral Form — Adults",
    purpose: "Adult, private and multidisciplinary orthodontic referral template.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ORTHO,
    sections: [
      { kind: "callout", variant: "info", body: "This form is a clinical template. Referral acceptance and eligibility remain subject to local referral criteria, provider triage and commissioner requirements." },

      { kind: "section", title: "1. Patient details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient full name" },
          { label: "Date of birth" },
          { label: "NHS number, if applicable" },
          { label: "Home address", span: 3 },
          { label: "Postcode" },
          { label: "Contact number" },
          { label: "Email address" },
          { label: "Preferred contact method", span: 3 },
        ]},
      ]},

      { kind: "section", title: "2. Referring practice details" },
      { kind: "field-rows", rows: [
        { label: "Practice", fields: [
          { label: "Referring clinician" },
          { label: "GDC number" },
          { label: "Practice name" },
          { label: "Practice address", span: 3 },
          { label: "Practice telephone" },
          { label: "Practice email" },
          { label: "Referral date" },
          { label: "Referral destination", span: 3 },
        ]},
      ]},

      { kind: "section", title: "3. Referral type" },
      { kind: "checkboxes", items: [
        "Private orthodontic assessment",
        "Specialist orthodontic opinion",
        "Restorative / orthodontic planning",
        "Pre-prosthetic orthodontics",
        "Pre-implant orthodontic planning",
        "Complex hospital pathway advice",
        "Clear aligner consultation",
        "Other — specify in notes",
      ]},

      { kind: "section", title: "4. Main patient concern" },
      { kind: "checkboxes", items: [
        "Crowding",
        "Spacing",
        "Overjet concern",
        "Bite concern",
        "Aesthetic alignment",
        "Relapse after previous orthodontics",
        "Pre-restorative tooth movement",
        "Functional / occlusal concern",
        "Impacted / unerupted tooth",
        "Periodontal / restorative complexity",
      ]},
      { kind: "field-rows", rows: [
        { label: "Goals", fields: [
          { label: "Patient goals, concerns and expectations", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "5. Previous orthodontic history" },
      { kind: "checkboxes", items: [
        "No previous orthodontic treatment",
        "Previous fixed appliance treatment",
        "Previous aligner treatment",
        "Previous removable appliance",
        "Retention currently worn",
        "Lost / broken retainer",
        "Known relapse",
      ]},
      { kind: "field-rows", rows: [
        { label: "History", fields: [
          { label: "Previous treatment details, approximate dates and retention history", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "6. Current dental and occlusal assessment" },
      { kind: "field-rows", rows: [
        { label: "Assessment", fields: [
          { label: "Overjet measurement" },
          { label: "Overbite description" },
          { label: "Incisor relationship" },
          { label: "Molar relationship" },
          { label: "Crowding / spacing summary" },
          { label: "Crossbite / displacement" },
          { label: "Missing teeth" },
          { label: "Heavily restored teeth" },
          { label: "Existing implants / prostheses" },
          { label: "TMD or occlusal symptoms" },
          { label: "Clinical summary and treatment planning considerations", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "7. Periodontal and restorative status" },
      { kind: "checkboxes", items: [
        "Periodontal health stable",
        "Periodontal disease history",
        "Active periodontal disease suspected",
        "BPE recorded",
        "Restorative work planned",
        "Implant planning involved",
        "Endodontic issues present",
        "Caries active or suspected",
      ]},
      { kind: "callout", variant: "warning", body: "Adult orthodontic treatment should be planned carefully where periodontal support is reduced, restorative complexity exists, or multidisciplinary treatment is needed." },

      { kind: "section", title: "8. Medical history and risk factors" },
      { kind: "checkboxes", items: [
        "No relevant medical history",
        "Relevant medical history attached / listed",
        "Medication history attached / listed",
        "Bisphosphonate / antiresorptive history",
        "Smoking / vaping",
        "Pregnancy, if relevant",
        "Dental anxiety",
        "Consent / capacity consideration",
      ]},
      { kind: "field-rows", rows: [
        { label: "Medical", fields: [
          { label: "Relevant medical history, medication, allergies or risk factors", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "9. Records included" },
      { kind: "checkboxes", items: [
        "DPT / OPT included",
        "Periapical radiograph included",
        "Bitewings included",
        "Clinical photographs included",
        "Digital scan / study models included",
        "Radiographs not indicated",
        "Radiographs held at practice",
        "Periodontal charting included",
      ]},
      { kind: "callout", variant: "info", body: "Radiographs must only be taken where clinically justified, reported and recorded in the patient notes." },
      { kind: "field-rows", rows: [
        { label: "Radiographs", fields: [
          { label: "Radiograph dates and report summary", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "10. Patient discussion and financial expectations" },
      { kind: "checkboxes", items: [
        "Private treatment likely explained",
        "Referral / consultation fees explained where known",
        "Treatment costs not guaranteed explained",
        "Treatment time commitment explained",
        "Retention after treatment explained",
        "Alternative options discussed",
        "Risks / limitations discussed",
        "Patient consents to referral",
      ]},
      { kind: "field-rows", rows: [
        { label: "Discussion", fields: [
          { label: "Patient expectations, affordability considerations and discussion notes", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "11. Referrer declaration" },
      { kind: "callout", variant: "info", body: "I confirm that the information provided is accurate to the best of my knowledge and that the patient has consented to this referral." },
      { kind: "field-rows", rows: [
        { label: "Sign-off", fields: [
          { label: "Clinician name" },
          { label: "Signature" },
          { label: "Date" },
          { label: "Practice stamp", span: 3 },
        ]},
      ]},

      { kind: "references", title: "Reference anchors", items: ORTHO_REFS_CORE },
    ],
  },

  {
    id: "orth-ref-under18",
    code: "ORTH-REF-U18",
    type: "Referral form",
    title: "Orthodontic Referral Form — Under 18s",
    purpose: "NHS eligibility, IOTN screening and paediatric / adolescent referral template.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ORTHO,
    sections: [
      { kind: "callout", variant: "info", body: "This form is a clinical template. Referral acceptance and eligibility remain subject to local referral criteria, provider triage and commissioner requirements." },

      { kind: "section", title: "1. Patient and parent / guardian details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient full name" },
          { label: "Date of birth" },
          { label: "NHS number" },
          { label: "Home address", span: 3 },
          { label: "Postcode" },
          { label: "Patient contact number" },
          { label: "Parent / guardian name" },
          { label: "Parent / guardian contact number" },
          { label: "Preferred contact method" },
          { label: "Interpreter or communication needs", span: 3 },
        ]},
      ]},

      { kind: "section", title: "2. Referring practice details" },
      { kind: "field-rows", rows: [
        { label: "Practice", fields: [
          { label: "Referring clinician" },
          { label: "GDC number" },
          { label: "Practice name" },
          { label: "Practice address", span: 3 },
          { label: "Practice telephone" },
          { label: "Practice email" },
          { label: "Referral date" },
          { label: "Preferred reply method", span: 3 },
        ]},
      ]},

      { kind: "section", title: "3. Referral type and priority" },
      { kind: "checkboxes", items: [
        "NHS orthodontic assessment",
        "Interceptive orthodontic opinion",
        "Impacted / ectopic tooth assessment",
        "Complex multidisciplinary opinion",
        "Private orthodontic discussion requested",
        "Other — specify in notes",
      ]},

      { kind: "section", title: "4. Reason for referral" },
      { kind: "field-rows", rows: [
        { label: "Concern", fields: [
          { label: "Main presenting orthodontic concern", span: 3, lines: 3 },
        ]},
      ]},
      { kind: "checkboxes", items: [
        "Increased overjet",
        "Reverse overjet / Class III tendency",
        "Anterior crossbite",
        "Posterior crossbite",
        "Functional displacement",
        "Moderate / severe crowding",
        "Impacted canine or delayed eruption",
        "Hypodontia / missing permanent teeth",
        "Deep bite with trauma",
        "Open bite",
        "Spacing concern",
        "Relapse following previous treatment",
      ]},

      { kind: "section", title: "5. IOTN screening estimate" },
      { kind: "callout", variant: "info", body: "Record an estimated IOTN if known. Final eligibility is confirmed by the orthodontic provider. NHS treatment is commonly considered where DHC is Grade 4 or 5, or Grade 3 with sufficient aesthetic component, subject to local rules." },
      { kind: "checkboxes", items: [
        "DHC Grade 1 — no treatment need",
        "DHC Grade 2 — little treatment need",
        "DHC Grade 3 — borderline need",
        "DHC Grade 4 — treatment need",
        "DHC Grade 5 — very great treatment need",
        "Aesthetic Component score recorded below",
      ]},
      { kind: "field-rows", rows: [
        { label: "Measurements", fields: [
          { label: "Estimated AC score" },
          { label: "Overjet measurement" },
          { label: "Overbite description" },
          { label: "Incisor relationship" },
          { label: "Molar relationship" },
          { label: "Contact point displacement / crowding" },
        ]},
      ]},

      { kind: "section", title: "6. Oral health readiness" },
      { kind: "checkboxes", items: [
        "Good oral hygiene",
        "Oral hygiene requires improvement",
        "Caries free",
        "Caries stabilised",
        "Active caries present",
        "Periodontal health acceptable",
        "Diet / fluoride advice given",
        "Patient appears motivated for treatment",
      ]},
      { kind: "field-rows", rows: [
        { label: "Notes", fields: [
          { label: "Comments on oral hygiene, caries control, periodontal health or motivation", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "7. Dental findings relevant to referral" },
      { kind: "field-rows", rows: [
        { label: "Findings", fields: [
          { label: "Missing teeth" },
          { label: "Retained primary teeth" },
          { label: "Unerupted / impacted teeth" },
          { label: "Supernumerary teeth" },
          { label: "Previous extractions" },
          { label: "Trauma history" },
          { label: "Clinical findings and relevant history", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "8. Records included" },
      { kind: "checkboxes", items: [
        "DPT / OPT included",
        "Periapical radiograph included",
        "Clinical photographs included",
        "Digital scan / study models included",
        "Radiographs not indicated",
        "Radiographs held at practice",
      ]},
      { kind: "callout", variant: "info", body: "Radiographs must only be taken where clinically justified, reported and recorded in the patient notes." },
      { kind: "field-rows", rows: [
        { label: "Radiographs", fields: [
          { label: "Radiograph dates and report summary", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "9. Medical, behavioural and safeguarding information" },
      { kind: "checkboxes", items: [
        "No relevant medical history",
        "Relevant medical history attached / listed",
        "Medication history attached / listed",
        "Dental anxiety",
        "Additional needs / neurodivergence",
        "Learning disability",
        "Safeguarding concern discussed / escalated",
        "Consent / capacity consideration",
      ]},
      { kind: "field-rows", rows: [
        { label: "Notes", fields: [
          { label: "Relevant medical, behavioural, communication or safeguarding notes", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "10. Patient / parent discussion" },
      { kind: "checkboxes", items: [
        "Referral reason explained",
        "NHS eligibility not guaranteed explained",
        "Waiting times explained",
        "Need for excellent oral hygiene explained",
        "Retention after treatment explained",
        "Possible extractions / appliances discussed",
        "Private options discussed where appropriate",
        "Parent / guardian agrees to referral",
      ]},
      { kind: "field-rows", rows: [
        { label: "Discussion", fields: [
          { label: "Patient / parent expectations and comments", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "11. Referrer declaration" },
      { kind: "callout", variant: "info", body: "I confirm that the information provided is accurate to the best of my knowledge and that the patient / parent or guardian has consented to this referral." },
      { kind: "field-rows", rows: [
        { label: "Sign-off", fields: [
          { label: "Clinician name" },
          { label: "Signature" },
          { label: "Date" },
          { label: "Practice stamp", span: 3 },
        ]},
      ]},

      { kind: "references", title: "Reference anchors", items: ORTHO_REFS_CORE },
    ],
  },

  {
    id: "orth-cp-002",
    code: "ORTH-CP-002",
    type: "Clinical pathway",
    title: "Retention Protocol & Follow-Up Pathway",
    purpose: "A structured protocol for retainer fitting, patient advice, follow-up reviews, failure management and long-term retention.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_ORTHO,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This pathway sets out the practice standard for orthodontic retention, retainer reviews, failure management and long-term relapse prevention. It applies after fixed appliance, removable appliance and clear aligner treatment." },
      { kind: "callout", variant: "info", title: "Core principle", body: "Retention is not optional. Patients must be advised that teeth can move throughout life and that retainers are usually required long term to maintain the orthodontic result." },

      { kind: "section", title: "Retention options" },
      { kind: "table", columns: ["Retainer type", "Use case", "Key considerations"], rows: [
        ["Vacuum-formed removable retainer", "Common first-line option after aligner or fixed appliance treatment.", "Requires wear compliance, can crack or distort, should be replaced if poor fit or damaged."],
        ["Hawley retainer", "Useful where adjustability, durability or settling of occlusion is desired.", "More visible and bulkier; may be preferred in selected cases."],
        ["Bonded / fixed retainer", "Useful for anterior alignment stability, especially where relapse risk is high.", "Requires excellent hygiene, monitoring for debonding, calculus and wire distortion."],
        ["Dual retention", "Fixed retainer plus removable night retainer.", "Often appropriate for high relapse risk or significant anterior correction."],
      ]},

      { kind: "section", title: "Retainer fitting workflow" },
      { kind: "numbered-steps", items: [
        { title: "Confirm treatment completion", body: "Check occlusion, alignment, periodontal condition, patient satisfaction and whether further refinement is required before retention starts." },
        { title: "Fit retainer promptly", body: "Fit or issue retainers as soon as clinically possible after appliance removal or final aligner stage to minimise early relapse." },
        { title: "Check fit and comfort", body: "Confirm full seating, extension, occlusion, speech, soft tissue comfort and patient ability to insert / remove safely." },
        { title: "Give written and verbal instructions", body: "Explain wear schedule, cleaning, storage, replacement, what to do if lost or broken, and when to contact the practice urgently." },
        { title: "Book retention review", body: "Arrange review according to the orthodontic provider plan and risk profile." },
      ]},

      { kind: "section", title: "Suggested wear schedule" },
      { kind: "callout", variant: "warning", title: "Local orthodontic instructions take priority", body: "The schedule below is a general template and should be adapted to the prescribing clinician's plan and patient relapse risk." },
      { kind: "table", columns: ["Stage", "Typical instruction", "Notes"], rows: [
        ["Initial retention phase", "Full-time or near full-time wear if directed, except for eating, drinking anything other than water and cleaning.", "Often used immediately after treatment where relapse risk is highest."],
        ["Transition phase", "Night-time wear once advised by the orthodontic clinician.", "Do not reduce wear if the retainer feels tight or teeth are moving."],
        ["Long-term maintenance", "Night-time wear long term, often indefinitely.", "Patient should understand that stopping wear may allow relapse."],
      ]},

      { kind: "section", title: "Follow-up pathway" },
      { kind: "info-grid", cols: 2, items: [
        { title: "At each review check", bullets: [
          "Retainer fit, condition and seating.",
          "Evidence of tooth movement or relapse.",
          "Occlusion and comfort.",
          "Oral hygiene and gingival health.",
          "Calculus around bonded retainers.",
          "Wire integrity and bonding points.",
          "Patient compliance and understanding.",
          "Need for replacement or escalation.",
        ]},
        { title: "Record in notes", bullets: [
          "Type of retainer supplied.",
          "Wear instructions given.",
          "Fit and condition.",
          "Cleaning advice.",
          "Any repairs, adjustments or replacements.",
          "Relapse concerns.",
          "Patient advice and consent.",
          "Next review or discharge plan.",
        ]},
      ]},

      { kind: "section", title: "Lost, broken or poor-fitting retainers" },
      { kind: "table", columns: ["Scenario", "Action"], rows: [
        ["Lost removable retainer", "Advise patient to contact the practice as soon as possible. Arrange scan / impression for replacement. Explain relapse risk and any replacement fee."],
        ["Cracked or distorted removable retainer", "Assess whether it still seats fully. Replace if fit is compromised. Do not advise continued wear if it could move teeth incorrectly."],
        ["Retainer feels tight", "Assess for relapse. If it seats fully, increased wear may be advised by the clinician. If it does not seat, do not force it; arrange review."],
        ["Bonded retainer debonded", "Assess urgency, wire position and tooth movement. Repair or refer according to competence and local pathway."],
        ["Wire distorted or causing unwanted movement", "Stop and escalate. A distorted bonded retainer can actively move teeth in an undesirable way."],
      ]},

      { kind: "section", title: "Patient instructions" },
      { kind: "prose-list", items: [
        "Wear retainers exactly as instructed.",
        "Bring retainers to every review.",
        "Clean retainers daily with a soft brush and suitable cleaner.",
        "Do not use hot water, as this may distort plastic retainers.",
        "Store removable retainers in a protective box.",
        "Keep retainers away from pets.",
        "Contact the practice urgently if a retainer is lost, broken or stops fitting.",
        "Do not stop wearing retainers because teeth feel stable.",
        "Maintain excellent oral hygiene around bonded retainers.",
        "Attend routine dental and hygiene appointments.",
      ]},

      { kind: "section", title: "Escalation criteria" },
      { kind: "callout", variant: "danger", title: "Escalate promptly", body: "Escalate if there is rapid relapse, a distorted bonded retainer, unexplained mobility, periodontal deterioration, pain, occlusal change, appliance breakage outside competence, or patient dissatisfaction requiring orthodontic review." },

      { kind: "section", title: "Discharge and long-term responsibility" },
      { kind: "paragraph", body: "Before discharge from active orthodontic review, confirm that the patient understands the long-term retention requirement, how to obtain replacement retainers, what signs require urgent review and whether ongoing monitoring will be provided by the orthodontic provider or general dental practice. Where a patient declines recommended retainer wear or replacement, document the discussion, risks explained and the patient's decision." },

      { kind: "references", title: "Reference anchors", items: ORTHO_REFS_CORE },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * RESTORATIVE & IMPLANTS — all 6 docs fully authored from UK clinical
 * governance sources (no source PDFs supplied; researched against NHS England
 * Restorative Dentistry Clinical Standard, GDC Training Standards in Implant
 * Dentistry 2012, ADI guidance, BSP/EFP S3 peri-implant guideline, BSRD/BSSPD/
 * BARD/RCS FDS, BEWE 2008, IR(ME)R 2017+2024 and NICE NG12).
 * ──────────────────────────────────────────────────────────────────────────── */

const GOV_NOTE_REST =
  "This template is researched from authoritative UK clinical governance sources but has not been verified against your local commissioning, indemnity or provider acceptance arrangements. It must be checked against the current NHS England Restorative Dentistry Clinical Standard, GDC Training Standards in Implant Dentistry, local ICB / provider acceptance criteria, indemnity advice and the practice's clinical governance process before publication. Always record clinical justification, valid consent (including clinician training / experience for implant placement), treatment discussions and safety-netting in the clinical notes.";

const REST_REFS_CORE = [
  { name: "NHS England — Guides for Commissioning Restorative Dentistry / Restorative Dentistry Clinical Standard (Level 1 / Level 2 / Level 3 framework)." },
  { name: "General Dental Council — Standards for the Dental Team (valid consent, scope of practice, lifelong learning, fair and transparent communication)." },
  { name: "General Dental Council — Training Standards in Implant Dentistry (2012) — clinicians placing implants must demonstrate competence, appropriate training and ongoing CPD." },
  { name: "Association of Dental Implantology (ADI) — UK guidance on implant pathways, training and patient information." },
  { name: "British Society of Periodontology / European Federation of Periodontology (EFP) — S3 Clinical Practice Guideline on the Prevention and Treatment of Peri-implant Diseases." },
  { name: "Royal College of Surgeons of England — Faculty of Dental Surgery (RCS FDS) clinical guidelines on restorative dentistry." },
  { name: "British Society of Restorative Dentistry (BSRD) and British Society for the Study of Prosthetic Dentistry (BSSPD) — clinical practice standards." },
  { name: "Bartlett, Ganss, Lussi — Basic Erosive Wear Examination (BEWE), Clinical Oral Investigations 2008 — recommended UK index for tooth wear screening." },
  { name: "Department of Health and Social Care — Ionising Radiation (Medical Exposure) Regulations 2017 (and 2024 amendment); CGDent / FGDP(UK) Selection Criteria for Dental Radiography — for CBCT justification." },
  { name: "NICE NG12 — suspected cancer recognition and referral (route soft-tissue red flags via the 2-week wait pathway, not restorative)." },
];

const restorativeDocuments = [
  {
    id: "rest-ref-01",
    code: "REST-REF-01",
    type: "Referral form",
    title: "Restorative & Implant Referral Form",
    purpose: "Captures patient, site, diagnosis, restorative plan, medical / risk status and requested treatment for restorative or implant assessment.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "callout", variant: "warning", title: "Referral safety check", body: "Use the 2-week wait oral cancer pathway immediately for suspected malignant lesions. Implant or restorative referral is not a substitute for urgent suspected cancer escalation." },

      { kind: "section", title: "Patient and referrer details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient full name" },
          { label: "Date of birth / NHS number" },
          { label: "Address / telephone" },
          { label: "Email / preferred contact" },
          { label: "Interpreter / accessibility needs", span: 3 },
        ]},
        { label: "Referrer", fields: [
          { label: "Referring clinician / GDC number" },
          { label: "Practice / secure email / telephone", span: 2 },
        ]},
      ]},

      { kind: "section", title: "Referral request" },
      { kind: "checkboxes", items: [
        "Implant assessment — single tooth.",
        "Implant assessment — multiple teeth / edentulous arch.",
        "Implant-retained overdenture assessment.",
        "Complex crown / bridge / inlay-onlay planning.",
        "Full-mouth or quadrant rehabilitation planning.",
        "Tooth wear (TSL) assessment and management.",
        "Multidisciplinary restorative opinion (perio / endo / ortho).",
        "Diagnostic opinion / second opinion only.",
        "Hypodontia or developmental anomaly — adolescent / adult.",
      ]},

      { kind: "field-rows", rows: [
        { label: "Site / diagnosis", fields: [
          { label: "Tooth / teeth / edentulous site (FDI or Palmer)" },
          { label: "Provisional diagnosis" },
          { label: "Urgency — routine / expedited / advice only" },
          { label: "Specific question or treatment requested", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "Patient-specific risk and history" },
      { kind: "checkboxes", title: "Implant / restorative risk factors", items: [
        "Current smoker / vaping (number / day if known).",
        "Diabetes — controlled / uncontrolled (HbA1c if known).",
        "Bisphosphonate / antiresorptive / antiangiogenic history — MRONJ risk.",
        "Head / neck radiotherapy history — ORN risk.",
        "Stage III / IV periodontitis or Grade C history.",
        "Bruxism / parafunction.",
        "Immunosuppression or biologics.",
        "Pregnancy / breastfeeding (if relevant).",
        "Allergy or adverse reaction to dental materials.",
        "Anxiety / sedation needs / reasonable adjustments.",
      ]},
      { kind: "field-rows", rows: [
        { label: "Medical", fields: [
          { label: "Full medical history, medication and allergies", span: 3, lines: 3 },
        ]},
      ]},

      { kind: "section", title: "Clinical findings and attachments" },
      { kind: "checkboxes", items: [
        "Caries stabilised or stabilisation plan recorded.",
        "Periodontal diagnosis recorded; BPE and pocket charting attached where relevant.",
        "Endodontic status of strategic teeth assessed.",
        "Occlusal analysis recorded (ICP, RCP, parafunction signs).",
        "Existing implants / restorations documented with dates.",
        "Clinical photographs (intra- and extra-oral) attached.",
        "Diagnostic radiographs attached and dated (bitewings, periapicals, OPG as relevant).",
        "Existing CBCT report attached if already justified.",
        "Study models or digital scan attached if available.",
      ]},
      { kind: "field-rows", rows: [
        { label: "Examination summary", fields: [
          { label: "Soft tissues, ridge form, edentulous span, opposing dentition, restorative space, biotype, inter-arch relationship and aesthetic considerations", span: 3, lines: 4 },
        ]},
      ]},

      { kind: "section", title: "Restorative goal" },
      { kind: "field-rows", rows: [
        { label: "Goal", fields: [
          { label: "Functional, aesthetic and prosthodontic goal for this patient", span: 3, lines: 2 },
          { label: "Alternatives discussed (no treatment, denture, bridge, implant, orthodontic space management)", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "Patient discussion and consent for referral" },
      { kind: "checkboxes", items: [
        "Patient understands referral is for assessment and may not result in treatment.",
        "Patient understands their preferred option may not be the most clinically appropriate.",
        "Patient understands fees / NHS vs private nature of the receiving pathway.",
        "Patient understands implant / advanced restorative care has long-term maintenance and review needs.",
        "Patient consents to referral and sharing radiographs / records / images.",
        "Smoking cessation discussed where relevant (NICE PH48 / local stop-smoking service).",
      ]},

      { kind: "callout", variant: "warning", title: "Localisation required", body: "Replace placeholder referral destinations, contact details, acceptance criteria and upload routes with the current local ICB, NHS e-Referral Service, hospital, community provider or private specialist pathway." },

      { kind: "section", title: "Sign-off" },
      { kind: "field-rows", rows: [
        { label: "Clinician", fields: [
          { label: "Clinician name" },
          { label: "GDC number" },
          { label: "Date / time" },
          { label: "Practice stamp", span: 3 },
        ]},
      ]},

      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },

  {
    id: "rest-ref-02",
    code: "REST-REF-02",
    type: "Referral form",
    title: "Complex Restorative Case Referral Form",
    purpose: "For multidisciplinary or extensive restorative cases — full-mouth rehabilitation, complex tooth wear, post-trauma reconstruction or hypodontia.",
    format: "PDF / editable HTML",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "callout", variant: "info", body: "Use this form where a single discipline referral is insufficient and combined restorative / perio / endo / ortho / oral surgery planning is needed. Routine single-tooth restorative work should normally be completed in primary care." },

      { kind: "section", title: "Patient and referrer details" },
      { kind: "field-rows", rows: [
        { label: "Patient", fields: [
          { label: "Patient full name" },
          { label: "Date of birth / NHS number" },
          { label: "Contact details (phone / email)", span: 2 },
        ]},
        { label: "Referrer", fields: [
          { label: "Referring clinician / GDC number" },
          { label: "Practice / secure email", span: 2 },
        ]},
      ]},

      { kind: "section", title: "Reason for complex referral" },
      { kind: "checkboxes", items: [
        "Generalised severe tooth wear (BEWE 3 sites or above).",
        "Full-mouth or quadrant rehabilitation.",
        "Post-trauma reconstruction (avulsion, fracture, displaced tooth).",
        "Hypodontia / developmental anomaly (paediatric / adolescent / adult).",
        "Complex aesthetic case with restorative compromise.",
        "Failing extensive existing restorations (full arch / multiple units).",
        "Combined perio-restorative or endo-restorative planning.",
        "Cleft / craniofacial / oncology reconstruction follow-up.",
        "Vertical dimension change required.",
        "Patient with reduced periodontal support requiring restorative planning.",
      ]},

      { kind: "section", title: "Existing dentition summary" },
      { kind: "field-rows", rows: [
        { label: "Dentition", fields: [
          { label: "Missing teeth (FDI / Palmer)", span: 3 },
          { label: "Heavily restored or root-treated teeth" },
          { label: "Teeth of poor prognosis (and reason)" },
          { label: "Existing implants (site, year, system)" },
          { label: "Existing dentures / bridges / overlays" },
          { label: "Opposing arch and occlusal scheme" },
          { label: "Tooth wear pattern and aetiology" },
        ]},
      ]},

      { kind: "section", title: "Multidisciplinary considerations" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Periodontal", body: "BPE, stage / grade, smoking, diabetes, response to Step 1 / Step 2 therapy, prognosis of strategic teeth." },
        { title: "Endodontic", body: "Strategic teeth requiring RCT or retreatment, restorability, ferrule, post / core feasibility, vertical root fracture risk." },
        { title: "Orthodontic", body: "Space management, axial inclination, eruption, hypodontia space planning, pre-restorative tooth movement." },
        { title: "Oral surgery / OMFS", body: "Extractions, bone preservation, ridge augmentation, sinus lift, soft-tissue grafting, biopsy of incidental lesions." },
      ]},

      { kind: "section", title: "Records to attach" },
      { kind: "checkboxes", items: [
        "Full clinical examination summary including soft tissues and TMJ.",
        "Up-to-date BPE and periodontal charting where relevant.",
        "Diagnostic radiographs (bitewings, periapicals, OPG) with dates.",
        "Existing CBCT report if already justified and available.",
        "Intra- and extra-oral clinical photographs.",
        "Study models or digital scans where possible.",
        "Tooth wear monitoring photographs and BEWE chart if relevant.",
        "Summary of previous treatment, dates and outcomes.",
      ]},

      { kind: "section", title: "Patient priorities and constraints" },
      { kind: "field-rows", rows: [
        { label: "Priorities", fields: [
          { label: "Patient's main concern and what would represent a successful outcome", span: 3, lines: 3 },
          { label: "Financial constraints, NHS / private context and time constraints", span: 3, lines: 2 },
          { label: "Maintenance commitment and recall preference", span: 3, lines: 2 },
        ]},
      ]},

      { kind: "section", title: "Referrer declaration" },
      { kind: "callout", variant: "info", body: "I confirm that the information provided is accurate to the best of my knowledge, that material risks and alternatives have been discussed, and that the patient consents to this referral." },
      { kind: "field-rows", rows: [
        { label: "Sign-off", fields: [
          { label: "Clinician name" },
          { label: "GDC number" },
          { label: "Date" },
          { label: "Practice stamp", span: 3 },
        ]},
      ]},

      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },

  {
    id: "rest-ref-03",
    code: "REST-REF-03",
    type: "Referral criteria",
    title: "Restorative & Implant Referral Criteria & Complexity Guidance",
    purpose: "Aligns GDP-managed cases, Level 2 enhanced restorative and Level 3 specialist restorative dentistry, with required records and common rejection reasons.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This guidance supports consistent triage of restorative and implant referrals using the NHS England Restorative Dentistry Clinical Standard Level 1 / Level 2 / Level 3 framework. Implant placement is also governed by the GDC Training Standards in Implant Dentistry (2012), which require clinicians placing implants to demonstrate appropriate training, competence and ongoing CPD." },

      { kind: "section", title: "Core rule" },
      { kind: "callout", variant: "info", body: "Single-tooth direct restorations, routine indirect restorations, simple dentures and routine maintenance of existing implants are normally within primary care. Refer when complexity, risk, anatomy, restorability, periodontal status, medical history, training requirements or multidisciplinary planning means care is outside the practice's competence, training or available equipment." },

      { kind: "section", title: "Suggested triage levels" },
      { kind: "table", columns: ["Pathway", "Typical examples", "Referral content required"], rows: [
        ["Level 1 — primary care / GDP", "Single-tooth direct or indirect restorations, simple dentures, routine implant maintenance on a system the clinician is trained on, single-unit crown / onlay where margin, ferrule and periodontal support are favourable.", "Record rationale for managing in practice, consent, diagnostic radiographs and standard restorative records."],
        ["Level 2 — enhanced / intermediate", "Single-implant assessment in a low-risk site, moderately complex crown / bridge, replacement of failing single-unit restorations, tooth wear with limited spread (BEWE 2 / focal BEWE 3), pre-prosthetic perio or endo input.", "Clear reason for referral, diagnostic image set, medical and risk-factor summary, restorative goal and consent for referral."],
        ["Level 3 — specialist / consultant restorative", "Multiple-implant or full-arch reconstruction, severe generalised tooth wear (BEWE 3 across multiple sextants), hypodontia, post-trauma reconstruction, cleft / craniofacial restorative follow-up, complex perio-restorative or oncology-related rehabilitation, reduced periodontal support requiring strategic planning.", "Full clinical and risk profile, multidisciplinary information (perio / endo / ortho / OMFS), radiographs / CBCT (if justified), photographs, study models or digital scan and urgency."],
      ]},

      { kind: "section", title: "Patient-specific risk factors that raise complexity" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Systemic / behavioural", bullets: [
          "Current smoker — strong evidence of poorer implant and periodontal outcomes.",
          "Uncontrolled or poorly-controlled diabetes (HbA1c).",
          "Bisphosphonates / antiresorptives / antiangiogenics — MRONJ risk.",
          "Head and neck radiotherapy — ORN risk.",
          "Immunosuppression, biologics or active malignancy.",
          "Bruxism, parafunction or unmanaged TMD.",
        ]},
        { title: "Local / dental", bullets: [
          "Stage III / IV periodontitis or Grade C history.",
          "Compromised bone volume or proximity to inferior dental canal / maxillary sinus.",
          "Aesthetic zone with high lip line, thin biotype or interdental recession.",
          "Reduced restorative space, drifted or supraerupted opposing teeth.",
          "Active caries or unresolved endodontic pathology.",
          "Limited oral hygiene capability or motivation.",
        ]},
      ]},

      { kind: "section", title: "Common reasons referrals are rejected or delayed" },
      { kind: "prose-list", items: [
        "Active periodontal disease that has not been stabilised in primary care.",
        "Active caries not stabilised; restorability of strategic teeth not assessed.",
        "Insufficient diagnostic information — no recent radiographs, no BPE / pocket chart, no photographs.",
        "No clear restorative goal or patient question.",
        "Smoking status not documented and cessation not discussed.",
        "Patient not informed that referral is for assessment and may not lead to treatment.",
        "Soft-tissue red flag present that should be routed via the urgent suspected cancer pathway.",
      ]},

      { kind: "section", title: "When NHS restorative pathways apply" },
      { kind: "paragraph", body: "NHS Level 2 and Level 3 restorative pathways are generally reserved for clinically significant cases such as hypodontia, severe tooth wear, post-trauma reconstruction, complex periodontal-restorative cases, cleft / craniofacial follow-up and oncology reconstruction, in line with the NHS England Restorative Dentistry Clinical Standard. Eligibility and routing depend on local ICB and provider acceptance criteria. Aesthetic-led implant or full-mouth requests are usually managed privately." },

      { kind: "section", title: "Referral quality checklist" },
      { kind: "checkboxes", items: [
        "Reason for referral and requested outcome are explicit.",
        "Correct pathway / level selected.",
        "Diagnostic radiographs are recent, justified and attached.",
        "Periodontal and caries status are stabilised or stabilisation plan recorded.",
        "Medical history, smoking and MRONJ risk are documented.",
        "Patient informed about NHS vs private route, maintenance burden and limitations.",
        "Soft-tissue red flags excluded or routed via 2WW.",
      ]},

      { kind: "callout", variant: "warning", title: "Localisation required", body: "Replace placeholder referral destinations, contact details, acceptance criteria and upload routes with the current local ICB, NHS e-Referral Service, hospital, community provider or private specialist pathway." },
      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },

  {
    id: "rest-ref-04",
    code: "REST-REF-04",
    type: "Clinical guidance",
    title: "Implant Pre-Assessment & Patient Selection Criteria",
    purpose: "Patient selection, risk profile, site assessment and pre-treatment requirements before implant placement assessment.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "callout", variant: "warning", title: "Training and competence", body: "Clinicians placing implants must demonstrate appropriate training, competence and ongoing CPD in line with the GDC Training Standards in Implant Dentistry (2012). Patients must be informed about the clinician's training and experience as part of valid consent." },

      { kind: "section", title: "Suitable for primary-care implant assessment" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Patient factors", bullets: [
          "Adult with completed skeletal growth.",
          "Stable, treated periodontal condition.",
          "Good oral hygiene and engagement.",
          "Non-smoker or willing to engage with cessation.",
          "Controlled medical conditions (including diabetes).",
          "Realistic expectations and acceptance of maintenance.",
        ]},
        { title: "Site factors", bullets: [
          "Adequate bone volume on diagnostic imaging.",
          "Safe relationship to inferior dental canal, mental foramen and maxillary sinus.",
          "Adequate restorative space (vertical and mesio-distal).",
          "Stable, healthy opposing dentition.",
          "Favourable biotype and keratinised tissue width.",
          "No active local infection or untreated endodontic pathology nearby.",
        ]},
      ]},

      { kind: "section", title: "Higher-risk indicators — consider specialist referral" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Medical / behavioural risk", bullets: [
          "Current smokers, especially > 10 / day.",
          "Bisphosphonates, denosumab or antiangiogenics — MRONJ risk.",
          "Previous head and neck radiotherapy — ORN risk.",
          "Stage III / IV periodontitis history or non-compliant maintenance.",
          "Bruxism / parafunction without splint management.",
          "Diabetes with HbA1c indicating poor control.",
          "Immunosuppression or active cancer treatment.",
        ]},
        { title: "Anatomical / restorative risk", bullets: [
          "Severely resorbed ridge requiring augmentation or sinus lift.",
          "Proximity to inferior dental canal or mental foramen.",
          "Aesthetic zone with high lip line and thin biotype.",
          "Multiple-implant or full-arch planning.",
          "Combined with extraction and immediate placement.",
          "Patient with limited dexterity or capacity for hygiene maintenance.",
        ]},
      ]},

      { kind: "section", title: "Pre-treatment requirements" },
      { kind: "numbered-steps", items: [
        { title: "Stabilise oral health.", body: "Complete caries stabilisation, periodontal therapy (Steps 1–2) and any necessary endodontic work before implant assessment. Active disease compromises peri-implant outcomes." },
        { title: "Confirm engagement.", body: "Reinforce oral hygiene, interdental cleaning and recall attendance. Implant therapy depends on lifelong maintenance." },
        { title: "Smoking cessation.", body: "Offer brief intervention and signpost to local NHS Stop Smoking Services or NHS Better Health resources (NICE PH48). Document advice and patient decision." },
        { title: "Medical optimisation.", body: "Liaise with the GP / specialist where systemic conditions, anticoagulants, antiresorptives or immunosuppression may affect implant prognosis." },
        { title: "Justified imaging.", body: "Take 2D radiographs first; consider CBCT only where the result will change management, in line with IR(ME)R 2017 (and 2024 amendment) and CGDent / FGDP(UK) Selection Criteria. Document justification and reporting." },
        { title: "Discuss alternatives.", body: "Cover no treatment, denture, conventional or resin-bonded bridge, orthodontic space management and implant — including cost, longevity, maintenance and biological risk." },
      ]},

      { kind: "section", title: "Consent points to cover for implant assessment" },
      { kind: "prose-list", items: [
        "Implant treatment is multi-stage and may extend over months, with surgical and prosthodontic phases.",
        "Lifelong maintenance and review are required; the implant restoration is not a one-off treatment.",
        "Material biological complications include peri-implant mucositis and peri-implantitis, with potential for bone loss and implant loss.",
        "Mechanical complications include screw loosening, prosthetic chipping, abutment fracture and rare implant fracture.",
        "Smoking, uncontrolled diabetes, history of severe periodontitis and poor plaque control increase failure and disease risk.",
        "Aesthetic outcomes — particularly soft-tissue contour, papillae and emergence — cannot always be predicted, especially in the aesthetic zone.",
        "Future revision, replacement or removal may be needed, sometimes involving bone grafting.",
        "Costs may include planning, surgery, prosthetics, maintenance and replacement components.",
      ]},

      { kind: "section", title: "Records to attach for implant referral" },
      { kind: "checkboxes", items: [
        "Up-to-date BPE / pocket chart and plaque score.",
        "Diagnostic radiographs of the site and adjacent teeth (with dates).",
        "CBCT report where justified and available (do not request CBCT routinely).",
        "Intra-oral and extra-oral clinical photographs.",
        "Study models / digital scan of both arches and the bite.",
        "Restorative goal and discussed alternatives.",
        "Smoking status and cessation advice record.",
        "Medical history including MRONJ-relevant drugs and HbA1c if relevant.",
      ]},

      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },

  {
    id: "rest-ref-05",
    code: "REST-REF-05",
    type: "Clinical pathway",
    title: "Tooth Wear (TSL) Assessment & Referral Pathway",
    purpose: "Screening (BEWE), aetiology, prevention, monitoring and referral thresholds for tooth surface loss.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "section", title: "Purpose" },
      { kind: "paragraph", body: "This pathway supports consistent assessment of tooth surface loss (TSL), identification of aetiology, prevention, monitoring and referral. Most TSL is multifactorial (erosion, attrition, abrasion, abfraction). The aim is to slow progression with prevention and identify the small group of patients who require restorative or multidisciplinary input." },

      { kind: "section", title: "Screening — Basic Erosive Wear Examination (BEWE)" },
      { kind: "callout", variant: "info", body: "BEWE is the recommended screening tool (Bartlett, Ganss, Lussi 2008). Score the most severely affected surface in each sextant 0–3. Sum the sextant scores to give a total (0–18) that guides management." },
      { kind: "table", columns: ["BEWE score per surface", "Description", "Per-sextant action"], rows: [
        ["0", "No erosive tooth wear.", "Routine care."],
        ["1", "Initial loss of surface texture.", "Prevention and routine review."],
        ["2", "Distinct defect, hard tissue loss < 50% of the surface area.", "Identify aetiology, deliver prevention, monitor with photographs / casts."],
        ["3", "Hard tissue loss ≥ 50% of the surface area.", "Active prevention, consider restorative intervention or referral."],
      ]},
      { kind: "table", columns: ["BEWE total (sum of sextants)", "Risk level", "Suggested management"], rows: [
        ["≤ 2", "None / low", "Routine care and prevention."],
        ["3 – 8", "Low", "Tailored prevention and aetiology advice; monitor with photographs / impressions."],
        ["9 – 13", "Medium", "Prevention plus enhanced monitoring; consider specialist advice if progressing despite intervention."],
        ["≥ 14", "High", "Specialist restorative referral typically appropriate, especially where function, aesthetics or sensitivity affected."],
      ]},

      { kind: "section", title: "Identifying aetiology" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Erosion (chemical)", bullets: [
          "Frequency / amount of acidic drinks and food (carbonated drinks, sports drinks, fruit teas, citrus, vinegar).",
          "Gastro-oesophageal reflux, hiatus hernia, pregnancy-related reflux.",
          "Eating disorders (bulimia / restrictive intake) — handle with care and consider safeguarding pathway.",
          "Alcohol use and chronic vomiting.",
          "Workplace acid exposure.",
        ]},
        { title: "Attrition / abrasion / abfraction", bullets: [
          "Bruxism, clenching, parafunctional habits.",
          "Aggressive brushing technique and abrasive toothpaste.",
          "Habits — pen / nail biting, occupational habits.",
          "Occlusal interferences and parafunctional contacts.",
          "Tongue / cheek biting patterns.",
        ]},
      ]},

      { kind: "section", title: "Prevention and primary-care management" },
      { kind: "numbered-steps", items: [
        { title: "Establish aetiology and explain to the patient.", body: "Behaviour change relies on the patient understanding what is causing the wear. Show photographs or casts to illustrate progression." },
        { title: "Modify diet and behaviour.", body: "Reduce frequency and contact time of acid exposure; use a straw; rinse with water; avoid brushing for 30–60 minutes after acid exposure; address parafunctional habits." },
        { title: "Manage medical contributors.", body: "Refer to the GP for suspected reflux or eating disorders. Address pregnancy-related reflux supportively." },
        { title: "Strengthen and protect.", body: "High-fluoride toothpaste, fluoride varnish, desensitising agents and (where indicated) a soft-tissue / occlusal splint for bruxism." },
        { title: "Monitor objectively.", body: "Use standardised clinical photographs, study models / digital scans at 6- to 12-month intervals. Compare like-for-like to confirm progression rather than relying on visual memory." },
      ]},

      { kind: "section", title: "When to refer" },
      { kind: "prose-list", items: [
        "BEWE total ≥ 14 or generalised severe wear affecting function, sensitivity or aesthetics.",
        "Progressive wear despite documented prevention and behaviour change over 6–12 months.",
        "Loss of vertical dimension or restorative space concerns.",
        "Complex aetiology requiring multidisciplinary input (e.g. medical reflux + parafunction + restorative compromise).",
        "Aesthetic-zone wear in a young patient where minimally invasive, predictable restoration is needed.",
        "Patient requesting restorative reconstruction where complexity is beyond primary-care competence.",
      ]},

      { kind: "section", title: "Usually manage in primary care" },
      { kind: "table", columns: ["Presentation", "Primary-care action"], rows: [
        ["Mild localised wear with clear aetiology and no symptoms.", "Aetiology advice, prevention, photographic monitoring, fluoride."],
        ["Sensitivity without significant loss.", "Desensitising regimen, brushing technique, fluoride varnish."],
        ["Localised wear from a single dietary or behavioural cause.", "Targeted behaviour change and follow-up."],
      ]},

      { kind: "section", title: "Records to attach for tooth wear referral" },
      { kind: "checkboxes", items: [
        "BEWE chart and total score.",
        "Sequence of standardised clinical photographs with dates.",
        "Study models or digital scans where available.",
        "Aetiology summary and prevention measures already implemented.",
        "Smoking, alcohol and reflux / dietary history.",
        "Sensitivity, function and aesthetic impact for the patient.",
      ]},

      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },

  {
    id: "rest-ref-06",
    code: "REST-REF-06",
    type: "Clinical pathway",
    title: "Implant Maintenance & Peri-Implant Disease Monitoring",
    purpose: "Routine maintenance schedule, diagnostic criteria for peri-implant mucositis and peri-implantitis, and referral / escalation thresholds.",
    format: "PDF",
    updated: "May 2026",
    review: "May 2027",
    governanceNote: GOV_NOTE_REST,
    sections: [
      { kind: "callout", variant: "info", title: "Anchor", body: "Diagnostic definitions follow the 2017 World Workshop classification and the BSP / EFP S3 Clinical Practice Guideline on the Prevention and Treatment of Peri-implant Diseases. Local provider and indemnity guidance should also be checked." },

      { kind: "section", title: "Why implant maintenance matters" },
      { kind: "paragraph", body: "Peri-implant mucositis is common, reversible inflammation around an implant. Without intervention it can progress to peri-implantitis, which causes progressive bone loss and may end in implant loss. Smoking, history of periodontitis, poor plaque control, uncontrolled diabetes and certain prosthesis designs (cement retained, over-contoured, hard-to-clean) increase risk." },

      { kind: "section", title: "Routine maintenance schedule" },
      { kind: "table", columns: ["Risk category", "Suggested recall", "Core activity"], rows: [
        ["Low risk — non-smoker, no perio history, good hygiene, single screw-retained restoration.", "6–12 months.", "Probing using light force, plaque / BOP score, peri-implant tissue inspection, prosthesis check, professional cleaning with implant-safe instruments."],
        ["Moderate risk — previous periodontitis, occasional bleeding sites, suboptimal plaque control or cement-retained restoration.", "3–6 months.", "As above plus reinforced oral hygiene, interdental aids, occlusal check; radiograph if indicated."],
        ["High risk — current smoker, Stage III / IV periodontitis history, poor compliance, uncontrolled diabetes, complex prosthesis.", "3 months initially.", "As above plus aggressive plaque control reinforcement, smoking cessation support, consider specialist co-management."],
      ]},

      { kind: "section", title: "Diagnostic criteria" },
      { kind: "info-grid", cols: 2, items: [
        { title: "Peri-implant health", body: "No inflammation, no bleeding on gentle probing, no progressive bone loss compared with baseline radiograph. Probing depths stable. Patient comfortable with the prosthesis." },
        { title: "Peri-implant mucositis", body: "Bleeding and / or suppuration on gentle probing, visible inflammation, no progressive bone loss beyond initial physiological remodelling. Reversible if managed early." },
        { title: "Peri-implantitis", body: "Inflammation plus progressive crestal bone loss beyond initial remodelling, often with increased probing depth, bleeding / suppuration and possible mobility. Radiographic comparison with baseline is essential." },
        { title: "Implant failure", body: "Mobility, persistent pain, severe progressive bone loss or fistula. The implant cannot be maintained. Removal usually required." },
      ]},

      { kind: "section", title: "Primary-care actions before referral" },
      { kind: "numbered-steps", items: [
        { title: "Confirm diagnosis.", body: "Probe with light force, record bleeding / suppuration / probing depths, take a long-cone periapical radiograph and compare with the baseline at restoration fit." },
        { title: "Reinforce oral hygiene.", body: "Demonstrate implant-specific interdental aids, single-tufted brushes and floss / threaders. Confirm the prosthesis allows access." },
        { title: "Professional debridement.", body: "Remove sub- and supramucosal biofilm and calculus using implant-safe instruments (titanium / PEEK / plastic / ultrasonic with appropriate tip). Do not use steel curettes on the implant surface." },
        { title: "Address modifiable risk.", body: "Smoking cessation support, diabetes control, occlusal review, address overhanging or hard-to-clean prosthetic contours." },
        { title: "Manage cement / retained excess.", body: "Remove any retained subgingival cement that is identified. Cement-related peri-implant disease often resolves with cement removal and plaque control." },
        { title: "Review and reassess.", body: "Re-evaluate at 2–3 months. If inflammation persists or radiographic bone loss is progressing, refer." },
      ]},

      { kind: "section", title: "When to refer" },
      { kind: "prose-list", items: [
        "Progressive radiographic bone loss compared with baseline.",
        "Persistent bleeding, suppuration or probing depth increase after initial non-surgical management.",
        "Implant mobility, pain or fistula — likely failure.",
        "Restoration design that prevents adequate cleaning and requires modification or replacement.",
        "Complex prosthesis (full-arch, screw-retained reconstructions) where the original placing clinician or restorative specialist should re-engage.",
        "Patient with high systemic or behavioural risk where peri-implantitis is progressing.",
      ]},

      { kind: "section", title: "What not to do" },
      { kind: "callout", variant: "danger", title: "Antibiotic caution", body: "Routine systemic antibiotics are not first-line treatment for peri-implant mucositis or peri-implantitis. Mechanical debridement, plaque control and risk-factor management are the foundation. Use antimicrobials only where there is spreading or systemic infection, in line with antimicrobial stewardship." },

      { kind: "section", title: "Records to attach for referral" },
      { kind: "checkboxes", items: [
        "Long-cone periapical radiograph of the implant and a comparable baseline image.",
        "Peri-implant probing, bleeding and suppuration chart.",
        "Implant system, abutment and prosthesis details (where known).",
        "Date of placement and placing clinician (where known).",
        "Summary of non-surgical management already provided and response.",
        "Smoking, diabetes and periodontal history.",
      ]},

      { kind: "references", title: "Reference anchors", items: REST_REFS_CORE },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Specialty index — all six referral specialties are document-packed:
 * Oral Surgery, 2WW Oral Cancer, Orthodontics, Endodontics, Periodontics
 * and Restorative & Implants.
 * ──────────────────────────────────────────────────────────────────────────── */

export const referralSpecialties = [
  {
    id: "oral-surgery",
    slug: "oral-surgery",
    label: "Oral Surgery / OMFS",
    icon: "clinical",
    color: "#1f4853",
    summary: "Routine and complex oral surgery, third molars, biopsy, medical-risk planning and post-operative complications.",
    intro: "Document pack for routine and complex oral surgery / OMFS referrals — covers referral form, triage criteria, surgical extraction pathway, third molar criteria, medical / bleeding risk, soft tissue lesions and biopsy, and post-operative complications.",
    documents: oralSurgeryDocuments,
  },
  {
    id: "usc-cancer",
    slug: "usc-cancer",
    label: "2-Week Wait — Oral Cancer",
    icon: "alert",
    color: "#b91c1c",
    urgent: true,
    summary: "Urgent suspected cancer pathway for oral, lip and head & neck — referral form, red-flag criteria, photography, monitoring, communication and tracking.",
    intro: "Document pack for urgent suspected oral, lip and head & neck cancer referrals. Use these alongside (not in place of) the current local NHS / ICB urgent suspected cancer route required by your provider.",
    documents: uscDocuments,
  },
  {
    id: "orthodontics",
    slug: "orthodontics",
    label: "Orthodontics",
    icon: "star",
    color: "#4338ca",
    summary: "Adult and under-18 orthodontic referrals, IOTN screening, clear aligner pathway and retention protocol.",
    intro: "Document pack for orthodontic referrals — covers clear aligner pathway, IOTN-based referral criteria, adult and under-18 referral forms, and retention / follow-up protocol. Anchored to BOS, NHS England Commissioning Standard for Primary Care Orthodontics and current GDC guidance.",
    documents: orthodonticsDocuments,
  },
  {
    id: "endodontic",
    slug: "endodontic",
    label: "Endodontic Specialists",
    icon: "activity",
    color: "#0d7280",
    summary: "Complex root canal treatment, retreatment, surgical endodontics, complications and CBCT pathways.",
    intro: "Document pack for referring complex endodontic cases — covers triage, complexity assessment, primary RCT, retreatment, apicectomy, CBCT, complications and cracked tooth assessment.",
    documents: endodonticDocuments,
  },
  {
    id: "periodontal",
    slug: "periodontal",
    label: "Periodontal Specialists",
    icon: "shieldalert",
    color: "#2e7d32",
    summary: "Advanced periodontitis, non-responding sites, mucogingival surgery and peri-implant disease.",
    intro: "Document pack for referring complex periodontal cases — covers triage, complexity assessment, Stage III/IV criteria, treatment pathway before referral, peri-implantitis, mucogingival concerns and acute periodontal conditions.",
    documents: periodontalDocuments,
  },
  {
    id: "restorative-implants",
    slug: "restorative-implants",
    label: "Restorative & Implants",
    icon: "award",
    color: "#9a3412",
    summary: "Implant referral, complex restorative planning, NHS Level 2 / Level 3 pathways, tooth wear and peri-implant disease.",
    intro: "Document pack for restorative and implant referrals — covers referral forms, NHS L1/L2/L3 complexity guidance, implant pre-assessment and patient selection, BEWE-anchored tooth wear pathway, and implant maintenance / peri-implant disease monitoring. Anchored to NHS England Restorative Dentistry Clinical Standard, GDC Training Standards in Implant Dentistry, ADI, BSP/EFP S3 peri-implant guideline, RCS FDS, BSRD and BSSPD.",
    documents: restorativeDocuments,
  },
];

export const findReferralSpecialty = (id) => referralSpecialties.find((s) => s.id === id);
export const findReferralDocument = (specialtyId, docId) =>
  findReferralSpecialty(specialtyId)?.documents.find((d) => d.id === docId) ?? null;
