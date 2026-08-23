/**
 * Endodontic Quick Reference cards — chairside decision-support content
 * for the Clinical Resources Hub → Endodontics tab.
 *
 * Like the Perio quick-ref, these are NOT controlled SOPs (those live in
 * the Clinical Governance pack ENDO-01..10). They are evergreen
 * reference for mid-treatment lookup, derived from external UK guidance
 * (BES, SDCEP, ESE).
 *
 * Same card formats as Perio: `table`, `flow`, `decision`.
 */

export const endoQuickRefFixture = [
  /* ─── Card 1 · Pulp & periapical diagnosis ─────────────────────────────── */
  {
    id: "pulpal-diagnosis",
    label: "Pulp & periapical diagnosis",
    icon: "target",
    format: "table",
    summary: "Differentiate the seven main endodontic diagnoses by symptom pattern and test response.",
    sources: [
      { name: "BES — Guide to Good Endodontic Practice",          url: "https://britishendodonticsociety.org.uk/professionals/" },
      { name: "AAE Consensus Conference Endodontic Diagnostic Terminology", url: "https://www.aae.org/specialty/clinical-resources/" },
    ],
    columns: ["Diagnosis", "Symptoms", "Test response", "Immediate action"],
    rows: [
      ["Normal pulp",                       "Asymptomatic",                                              "Cold +ve, brief; percussion −ve; periapex normal",      "No treatment."],
      ["Reversible pulpitis",               "Sharp pain to cold/sweet, stops in seconds",                "Cold +ve, brief, no lingering; percussion −ve",         "Treat cause (caries, fractured restoration, exposed dentine). Pulp protection per ENDO-07."],
      ["Symptomatic irreversible pulpitis", "Spontaneous pain · lingering pain to cold (often > 30 s)", "Cold +ve, lingering; percussion +/− as inflammation spreads", "Plan RCT or extraction. Local anaesthesia may be unpredictable — see Card 4."],
      ["Asymptomatic irreversible pulpitis","No spontaneous pain, but pulp exposure / deep caries seen",  "Cold +ve or −ve; percussion −ve",                       "Plan RCT or vital pulp therapy (ENDO-07) per exposure."],
      ["Pulp necrosis",                     "No response to thermal; may be asymptomatic or with apical signs", "Cold/EPT −ve; percussion +/−",                    "RCT or extraction. Periapical radiograph."],
      ["Symptomatic apical periodontitis",  "Pain on biting / percussion / palpation",                   "Percussion +ve, palpation often +ve; cold may be −ve", "Confirm pulpal status. Drain / open if abscess. Analgesia. RCT or extraction."],
      ["Acute apical abscess",              "Rapid swelling, severe pain, may be systemic",              "Percussion +ve; pulp non-vital; tender soft tissues",   "Drain (incise or open through canal). Antibiotics per SDCEP only if systemic signs. Definitive RCT or extraction."],
    ],
    notes: [
      "Sensibility tests give an indication of nerve response, not pulp vitality. Always interpret with the clinical and radiographic picture.",
      "Use control teeth (contralateral or adjacent vital tooth) for every sensibility test.",
      "Record the test type and the response — not just '+ve' or '−ve'.",
    ],
  },

  /* ─── Card 2 · Irrigation & sodium hypochlorite safety ─────────────────── */
  {
    id: "irrigation-safety",
    label: "Irrigation & NaOCl safety",
    icon: "alert",
    format: "table",
    summary: "Working concentrations, contact times and what to do if a hypochlorite accident occurs.",
    sources: [
      { name: "BES — Guide to Good Endodontic Practice",                       url: "https://britishendodonticsociety.org.uk/professionals/" },
      { name: "ESE — Quality guidelines for endodontic treatment",              url: "https://www.e-s-e.eu/for-the-dental-professional/quality-guidelines/" },
      { name: "Practice COSHH and sodium hypochlorite safety procedures",       url: null },
    ],
    subTables: [
      {
        title: "Common irrigants",
        columns: ["Irrigant", "Typical concentration", "Role"],
        rows: [
          ["Sodium hypochlorite (NaOCl)", "0.5–5.25% (most UK practices use 1–3%)", "Tissue dissolution + antimicrobial. Renew every 5 minutes."],
          ["EDTA 17%",                    "17% (≈ 1 minute)",                        "Smear-layer removal at end of preparation. Do NOT leave > 1 min — risk of dentine erosion."],
          ["Chlorhexidine 2%",            "2% solution or gel",                      "Antimicrobial; final rinse where indicated. NEVER mix with NaOCl (forms parachloroaniline — orange precipitate, toxic)."],
          ["Saline / sterile water",       "—",                                       "Final flush after EDTA and before paper-point drying."],
        ],
      },
      {
        title: "If hypochlorite extrudes beyond the apex",
        columns: ["Sign / step", "Action"],
        rows: [
          ["Patient feels sudden severe pain ± metallic taste mid-irrigation",        "STOP irrigation immediately. Aspirate residual gel/solution."],
          ["Rapid swelling, ecchymosis or paraesthesia",                              "Reassure patient. Cold compress for first 24 h, then warm compresses."],
          ["Significant swelling or any systemic / airway concern",                    "Refer same day to OMFS / A&E. Consider IV analgesia and antibiotics."],
          ["Analgesia",                                                                 "Per SDCEP prescribing — paracetamol + NSAID if no contraindications."],
          ["Antibiotics",                                                                "Only if signs of secondary infection — not routinely for the chemical injury itself."],
          ["Document",                                                                   "Incident, patient communication, advice given, review interval. Inform clinical lead."],
        ],
      },
    ],
    notes: [
      "Use a side-vented irrigation needle 2 mm short of working length to reduce extrusion risk.",
      "Never force irrigant — gentle agitation only. Stop if back-pressure or sudden pain.",
      "Rubber dam, eye protection and high-volume suction are mandatory for every endodontic appointment.",
    ],
  },

  /* ─── Card 3 · Average working lengths & file sequence ─────────────────── */
  {
    id: "working-length-files",
    label: "Working length & file sequence",
    icon: "barchart",
    format: "table",
    summary: "Average tooth lengths and typical ISO file progression — chairside lookup only, always confirm with radiograph and apex locator.",
    sources: [
      { name: "BES — Guide to Good Endodontic Practice",  url: "https://britishendodonticsociety.org.uk/professionals/" },
      { name: "ISO 3630 — Dental root-canal instruments", url: null },
    ],
    subTables: [
      {
        title: "Typical average tooth length (mm) — adult permanent",
        columns: ["Tooth", "Mean length", "Canal anatomy"],
        rows: [
          ["Upper central incisor",     "22.5",  "Single straight canal, often wide."],
          ["Upper lateral incisor",     "22.0",  "Single, often distally curved at apex."],
          ["Upper canine",              "26.5",  "Single longest tooth — beware over-extension."],
          ["Upper first premolar",       "20.5",  "2 canals (≈ 85% MB/P), occasionally 3."],
          ["Upper second premolar",      "21.0",  "Usually 1 canal; 2 in 20–30%."],
          ["Upper first molar",         "20.5",  "MB1 + MB2 + DB + P. MB2 present in 60–95% — look for it."],
          ["Upper second molar",        "20.0",  "Variable: 3 or 4 canals; sometimes fused."],
          ["Lower central / lateral",    "21.0",  "Single canal in ≈ 65%; 2 canals (B + L) in ≈ 35%."],
          ["Lower canine",              "26.0",  "Usually single; 2 canals in ≈ 5–15%."],
          ["Lower first / second premolar","22.0", "Usually single. Look for additional canal especially in lower first premolar."],
          ["Lower first molar",         "21.0",  "MB + ML + D (sometimes 2). Distolingual canal in ≈ 15%."],
          ["Lower second molar",        "20.0",  "MB + ML + D; C-shaped anatomy possible."],
        ],
      },
      {
        title: "ISO hand-file progression",
        columns: ["Step", "File size", "Purpose"],
        rows: [
          ["Patency",                "10 / 15",        "Confirm a glide path to working length."],
          ["Initial enlargement",    "20",             "Establish reproducible glide path. Recapitulate frequently."],
          ["Apical preparation",     "25–40 (anterior, single-canal premolar)", "Larger apical sizes for single straight canals."],
          ["Apical preparation",     "20–35 (curved molar canals)",              "Smaller apical sizes for curved canals to avoid transportation."],
          ["Crown-down (rotary)",     "Manufacturer system",                       "Follow the rotary system instructions exactly — torque, speed, sequence."],
        ],
      },
    ],
    notes: [
      "Always confirm working length with an apex locator and radiographic check. Tooth-length averages are starting points only.",
      "Use a stopper on every file. Record working length and reference point in the notes.",
      "If anatomy seems unusual (extra canals, severe curvature, C-shape), pause and consider CBCT or specialist referral.",
    ],
  },

  /* ─── Card 4 · LA troubleshooting for endodontics ───────────────────────── */
  {
    id: "la-troubleshooting",
    label: "LA troubleshooting (hot pulp)",
    icon: "alert",
    format: "table",
    summary: "When the inferior alveolar block hasn't worked on a 'hot' lower molar — supplementary techniques in order.",
    sources: [
      { name: "BES — Guide to Good Endodontic Practice",  url: "https://britishendodonticsociety.org.uk/professionals/" },
      { name: "SDCEP — Drug Prescribing for Dentistry",   url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    ],
    columns: ["Step", "Technique", "Notes"],
    rows: [
      ["1", "Confirm anaesthesia of soft tissues (lip, tongue)",  "If lip is numb but pulp is not, this is profound failure of pulpal anaesthesia — proceed to supplementary techniques."],
      ["2", "Repeat IAN block — different needle angle / land mark", "Use a longer needle. Consider Gow-Gates or Akinosi for high failure rate cases."],
      ["3", "Long buccal + lingual infiltration (articaine 4%)", "Articaine 4% with 1:100,000 adrenaline infiltrated buccally to the affected tooth — diffuses through the cortical plate; useful in molars."],
      ["4", "Intraligamentary injection (PDL)",                   "Slow injection with back-pressure into the PDL space. 0.2 mL per root. Use specifically designed syringe where available."],
      ["5", "Intraosseous injection",                              "Drill through cortical plate distal to the tooth; inject directly into cancellous bone. Effective but rapid onset / short duration."],
      ["6", "Intrapulpal injection",                                "Last resort. Place needle into the pulp chamber and inject under pressure. Briefly painful then profound anaesthesia for the remainder of the visit."],
    ],
    notes: [
      "Articaine has higher diffusion through bone than lidocaine — useful for supplementary buccal infiltration in mandibular molars with hot pulps.",
      "Avoid repeated IAN blocks — risk of paraesthesia. Move to a supplementary technique earlier.",
      "Document each technique used, dose given and cumulative LA in mg — keep within the maximum safe dose per patient body weight.",
    ],
  },

  /* ─── Card 5 · Restorability & referral decision flow ──────────────────── */
  {
    id: "restorability-flow",
    label: "Endodontic restorability flow",
    icon: "arrow",
    format: "flow",
    summary: "Five quick decisions to make before opening up a tooth — is RCT in this practice the right plan?",
    sources: [
      { name: "BES — Guide to Good Endodontic Practice",          url: "https://britishendodonticsociety.org.uk/professionals/" },
      { name: "GDC Standards — working within competence",         url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
    ],
    steps: [
      {
        n: 1,
        title: "Is the tooth restorable?",
        targets: ["Ferrule, periodontal support, remaining structure"],
        actions: [
          "≥ 1.5–2 mm circumferential ferrule available?",
          "Periodontal support stable, no Grade III mobility?",
          "Strategic value — bridge abutment, occlusal stability, aesthetics?",
        ],
        endpoint: "If NO — discuss extraction + replacement (denture / bridge / implant). Do not start RCT.",
      },
      {
        n: 2,
        title: "Can it be isolated?",
        targets: ["Rubber dam essential for every endodontic appointment"],
        actions: [
          "Clamp seats and seals?",
          "If no — pre-endodontic build-up (composite or orthodontic band) first.",
          "Persistent inability to isolate = referral or extraction.",
        ],
        endpoint: "Rubber dam is non-negotiable. No dam, no RCT.",
      },
      {
        n: 3,
        title: "Is the diagnosis clear?",
        targets: ["Pulpal AND periapical diagnosis (see Card 1)"],
        actions: [
          "Symptoms and tests align with a definitive diagnosis?",
          "If pulpitis vs cracked tooth vs non-odontogenic pain unclear — pause and reassess.",
          "Periapical radiograph reviewed and reported.",
        ],
        endpoint: "Do NOT start irreversible treatment if the diagnosis is uncertain.",
      },
      {
        n: 4,
        title: "Is it within my competence?",
        targets: ["Honest self-assessment per GDC principle 7"],
        actions: [
          "Canal anatomy familiar (number, curvature, calcification)?",
          "Retreatment, post removal, perforation repair — within training?",
          "Equipment available — apex locator, magnification, rotary system, irrigation activation?",
        ],
        endpoint: "If complexity exceeds local skill / kit — refer per local pathway BEFORE opening the tooth.",
      },
      {
        n: 5,
        title: "Single visit or staged?",
        targets: ["Symptoms, anatomy, time, patient factors"],
        actions: [
          "Vital pulp + straightforward anatomy → single visit reasonable.",
          "Necrotic pulp + apical pathology → consider inter-visit Ca(OH)2 medicament.",
          "Symptoms / drainage / time pressure → stage.",
          "Plan and consent the final restoration before access (cuspal coverage for posteriors).",
        ],
        endpoint: "Confirm restoration plan + booking before the patient leaves with a temporary.",
      },
    ],
  },
];

/** Exposed via the existing clinical.service pattern. Wired into the
 *  Endodontics tab on the Clinical Resources Hub. */
export const listEndoQuickRef = () => endoQuickRefFixture;
