/**
 * Radiography Quick Reference cards — chairside decision-support content for
 * the Clinical Resources Hub → Radiography tab.
 *
 * Evergreen reference derived from external UK guidance — anchored to
 * IR(ME)R 2017 + 2024 Amendment Regulations, IRR 2017, CGDent / FGDP(UK)
 * Selection Criteria for Dental Radiography (3rd ed.), CGDent / PHE
 * Guidance Notes for Dental Practitioners on the Safe Use of X-ray
 * Equipment (2020), SEDENTEXCT for CBCT and PHE Dental DRLs.
 *
 * Not controlled SOPs (those live under Governance & SOPs → Radiography &
 * IRMER pack). Chairside reference for justification, selection, technique,
 * quality and dose decisions made at the point of taking a radiograph.
 */

export const radiographyQuickRefFixture = [
  /* ─── Card 1 · IR(ME)R duty holders ──────────────────────────────────────── */
  {
    id: "irmer-duty-holders",
    label: "IR(ME)R duty holders",
    icon: "person",
    format: "table",
    summary: "Who does what under IR(ME)R 2017 — referrer, practitioner, operator and employer.",
    sources: [
      { name: "IR(ME)R 2017 + 2024 Amendment Regulations — guidance", url: "https://www.gov.uk/government/publications/ionising-radiation-medical-exposure-regulations-2017-guidance" },
      { name: "CGDent / PHE — Safe Use of X-ray Equipment (2020)", url: "https://cgdent.uk/standards-guidance/" },
    ],
    columns: ["Role", "Statutory duty", "Common dental example"],
    rows: [
      ["Employer", "Sets written Employer's Procedures, ensures training, equipment QA, dose monitoring and IR(ME)R compliance. Notifies CQC of significant accidental / unintended exposures (SAUE).", "Practice owner / partnership. Maintains the Local Rules, RPA appointment, training records."],
      ["Referrer", "Provides sufficient medical data to enable justification. Cannot refer outside their entitlement.", "Dentist requesting OPT for a 2nd opinion. Hygienist referring for periapical of a sensitive tooth."],
      ["Practitioner", "Justifies each exposure as showing net benefit, weighing diagnostic gain against radiation risk. Authorises (or refuses) the exposure.", "Dentist who reviews history + clinical findings + decides whether the requested PA is justified."],
      ["Operator", "Carries out the practical aspects of the exposure within the practitioner's authorisation, follows the protocol, optimises dose (ALARP).", "Dentist taking the radiograph. Trained nurse positioning the patient and pressing the button under written authorisation."],
      ["Medical Physics Expert (MPE)", "Provides advice on optimisation, dose measurement, equipment performance. Required for CBCT and complex installations.", "External consultancy for the practice's annual QA programme and CBCT advice."],
      ["Radiation Protection Adviser (RPA)", "Statutory adviser under IRR 2017. Advises on Local Rules, contingency, equipment safety, designated areas.", "Named external RPA (often the same consultancy as MPE for dental practices)."],
    ],
    notes: [
      "Roles may be combined in one person (e.g. dentist is referrer + practitioner + operator) but each role's duty must be discharged for every exposure.",
      "Entitlement: the employer's procedures must list each individual's entitled scope (e.g. nurse trained for intra-oral but not OPT). Operating outside entitlement is an IR(ME)R breach.",
      "Significant Accidental / Unintended Exposure (SAUE) thresholds are now defined in the 2024 amendment — notification to CQC required when met. Maintain an incident log.",
    ],
  },

  /* ─── Card 2 · Selection criteria — when to take what ──────────────────── */
  {
    id: "selection-criteria",
    label: "Selection criteria — when to take what",
    icon: "monitor",
    format: "table",
    summary: "Indications for the common dental views per CGDent / FGDP(UK) Selection Criteria 3rd ed.",
    sources: [
      { name: "CGDent / FGDP(UK) — Selection Criteria for Dental Radiography (3rd ed.)", url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
      { name: "SEDENTEXCT — Evidence-Based Guidelines on the use of CBCT in Dentistry", url: "http://www.sedentexct.eu/" },
    ],
    columns: ["View", "When to take", "When NOT routinely indicated"],
    rows: [
      ["Bitewings (BW)", "Caries detection / monitoring. Existing restoration margins. Vertical bone loss in periodontitis. New adult patient (after exam). Recall by caries risk: high 6 mo, moderate 12 mo, low 24 mo.", "Routine 6-monthly BW for low-risk adults. Routine BW without prior caries-risk assessment."],
      ["Periapical (PA)", "Pain / pathology of a specific tooth. Apical assessment (RCT, abscess, perio). Trauma. Pre-extraction / pre-restorative. Implant pre-assessment of a single site.", "Routine screening of asymptomatic teeth. As substitute for a clinical examination."],
      ["Occlusal", "Localisation of unerupted / supernumerary tooth (parallax). Pathology in a quadrant. Sialolith in submandibular duct. Trauma in children where intra-oral is not tolerated.", "Routine periapical assessment. As default in adults — intra-oral PA usually superior."],
      ["OPT / Panoramic", "General assessment of dentition (developmental anomalies, third molars, generalised pathology). Pre-orthodontic. Trauma involving multiple regions. Patient unable to tolerate intra-oral.", "Routine screening. As substitute for BW or PA for caries / apical assessment (resolution insufficient)."],
      ["Lateral cephalogram", "Orthodontic treatment planning where skeletal pattern matters. Surgical orthodontics. Growth monitoring in selected paediatric cases.", "Routine pre-orthodontic in straightforward camouflage cases (per current BOS guidance — discuss with orthodontist)."],
      ["CBCT — small / limited field", "Endodontic complications (resorption, perforation, missed canal, suspected fracture). Impacted canine localisation when 2D inconclusive. Implant planning (single / few sites). Selected trauma.", "First-line assessment. Routine endodontics. Routine third molar assessment (use OPT first; CBCT only where OPT shows close ID canal relationship and removal planned)."],
      ["CBCT — medium / large field", "Multiple implant sites with sinus considerations. Orthognathic / surgical planning. Complex pathology.", "Routine assessment. Single-site implant where small FOV would suffice."],
    ],
    notes: [
      "Selection is always patient-specific — history, clinical findings, risk profile and the question being asked drive the choice. Generic recall protocols do not replace justification.",
      "Document the clinical justification AND the question being answered in the notes BEFORE taking the radiograph.",
      "CBCT additional duties: SEDENTEXCT-trained operator, MPE involvement, full-volume reporting (not just the dental area of interest). Out-of-area findings must be reported by a competent person.",
    ],
  },

  /* ─── Card 3 · Image quality grading (A / N / U) ────────────────────────── */
  {
    id: "quality-grading",
    label: "Image quality grading — A / N / U",
    icon: "star",
    format: "table",
    summary: "Two-grade (A / N) audit standard per CGDent / FGDP(UK) — what counts as diagnostically acceptable.",
    sources: [
      { name: "CGDent / FGDP(UK) — Selection Criteria for Dental Radiography (3rd ed.) — Quality section", url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
      { name: "CGDent / PHE — Guidance Notes (2020)", url: "https://cgdent.uk/standards-guidance/" },
    ],
    columns: ["Grade", "Definition", "Acceptance target", "Action if below target"],
    rows: [
      ["A — Acceptable (Diagnostically Acceptable)", "No errors of patient preparation, exposure, positioning, processing or film handling. Image meets the diagnostic requirement for the clinical question asked.", "≥ 95% of all radiographs taken (current FGDP standard — recently revised from the previous tripartite A/D/U).", "Review training, equipment, processing. Audit and re-audit."],
      ["N — Not Acceptable (Diagnostically Not Acceptable)", "Errors of preparation, exposure, positioning, processing or film handling that render the image diagnostically insufficient for the question asked.", "≤ 5% of all radiographs.", "Identify cause — operator technique, equipment, patient cooperation. Targeted retraining. Repeat exposure only if clinically justified (do not repeat for the audit alone)."],
      ["Legacy 3-grade (still seen in older audits) — E", "Excellent — no errors at all. Subjective best-quality category, often retained for teaching.", "Optional internal benchmark only.", "Not required for IR(ME)R compliance."],
      ["Legacy 3-grade — D / U", "Diagnostically acceptable with errors / Unacceptable — the previous tripartite system has been superseded by the simpler 2-grade scheme above.", "Reference only.", "Migrate audits to the 2-grade A/N system."],
    ],
    notes: [
      "Quality audit is a mandatory ongoing part of the IR(ME)R Employer's Procedures. Audit at least annually; high-volume practices should audit more often.",
      "Repeat-exposure rate is a separate audit metric — track repeats per operator. A high repeat rate signals technique or equipment problems.",
      "Document every audit with sample size, audit period, results, root-cause analysis and corrective actions in the IR(ME)R log.",
    ],
  },

  /* ─── Card 4 · Justification decision flow ──────────────────────────────── */
  {
    id: "justification-flow",
    label: "Justification — before pressing the button",
    icon: "checksquare",
    format: "flow",
    summary: "Five-question justification flow that every IR(ME)R practitioner must run before authorising an exposure.",
    sources: [
      { name: "IR(ME)R 2017 — Regulation 11 (Justification)", url: "https://www.legislation.gov.uk/uksi/2017/1322/regulation/11" },
      { name: "CGDent / FGDP(UK) — Selection Criteria 3rd ed.", url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
    ],
    steps: [
      {
        n: 1,
        title: "Is the clinical question clear?",
        targets: ["History + examination first"],
        actions: [
          "What specific diagnostic question am I trying to answer?",
          "Could a clinical test (vitality, palpation, percussion, probing) answer it without ionising radiation?",
          "Has a recent radiograph already answered this question (intra-practice or from previous provider)?",
        ],
        endpoint: "If the question can be answered without radiation, or has already been answered — STOP. Do not expose.",
      },
      {
        n: 2,
        title: "Will the result change management?",
        targets: ["Diagnostic AND therapeutic value"],
        actions: [
          "If the result is positive, what will I do differently?",
          "If the result is negative, what will I do differently?",
          "If neither answer changes the plan — the exposure is not justified.",
        ],
        endpoint: "Document the clinical question AND the planned management impact in the notes.",
      },
      {
        n: 3,
        title: "Is this the right view?",
        targets: ["Smallest dose, smallest field, lowest resolution that answers the question"],
        actions: [
          "Could a BW answer this instead of a PA? PA instead of OPT? OPT instead of CBCT?",
          "Smallest field of view (FOV) for CBCT — never larger than the area of interest.",
          "Resolution — lower-dose protocol if the question doesn't need high resolution.",
        ],
        endpoint: "Selected view answers the question with the least radiation. Document selection rationale.",
      },
      {
        n: 4,
        title: "Patient-specific factors checked?",
        targets: ["Pregnancy, paediatric, previous exposures, special care"],
        actions: [
          "Pregnancy — ask all women of childbearing potential. Dental exposures rarely contraindicated, but document.",
          "Paediatric — use age-appropriate technique, consider holding parent (with PPE), lower kVp setting.",
          "Recent exposures — check the cumulative recent radiation history. Avoid duplication.",
          "Special care — capacity, cooperation, sedation needs, alternative imaging options.",
        ],
        endpoint: "Patient-specific considerations recorded. Dose optimised. Proceed.",
      },
      {
        n: 5,
        title: "Authorise, optimise, record",
        targets: ["IR(ME)R compliance"],
        actions: [
          "Authorise (practitioner role) and instruct operator — or carry out yourself.",
          "Operator follows the protocol, applies ALARP, uses the smallest field, lowest mA / kVp consistent with diagnostic quality.",
          "Record: clinical question, justification, view taken, settings used, report / interpretation, who took / authorised.",
          "Grade the image (A / N), repeat decisions documented if needed.",
        ],
        endpoint: "Exposure complete. Findings reported and incorporated into the treatment plan. Audit-ready record retained.",
      },
    ],
  },

  /* ─── Card 5 · Pregnancy, paediatric & special considerations ──────────── */
  {
    id: "special-considerations",
    label: "Pregnancy, paediatric & special considerations",
    icon: "heart",
    format: "table",
    summary: "Dose, technique and consent adjustments for pregnancy, paediatric and special-care patients.",
    sources: [
      { name: "CGDent / FGDP(UK) — Selection Criteria 3rd ed., paediatric / pregnancy sections", url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
      { name: "RCR / PHE — Protection of Pregnant Patients during Diagnostic Medical Exposures", url: "https://www.gov.uk/government/publications/medical-radiation-uses-dose-measurements" },
    ],
    columns: ["Group", "Considerations", "Practical adjustment"],
    rows: [
      ["Pregnant patient", "Dental radiation dose is extremely low (< 0.01 mSv per intra-oral). Foetal dose negligible if the abdomen is not in the primary beam.", "Ask routinely — \"is there any chance you could be pregnant?\". Document. Apron not routinely required for intra-oral / OPT, but offer for patient reassurance. Defer non-urgent imaging where possible."],
      ["Paediatric — primary dentition (≤ 6 yr)", "Higher relative risk per dose (longer life expectancy, more radiosensitive tissues). Cooperation often limits intra-oral.", "Smallest sensor / film. Lowest kVp consistent with diagnostic quality. Bitewings preferred over OPT for caries. Use rectangular collimation. Holder devices to reduce repeats."],
      ["Paediatric — mixed / permanent (7–18 yr)", "Routine intra-oral usually tolerated. OPT for orthodontic and developmental anomalies.", "Standard paediatric protocols. Recall BWs only when caries risk supports it. Selection criteria same as adults but lower threshold for caution."],
      ["Special-care / unable to cooperate", "Multiple repeats increase dose. Movement causes blur. Consent / capacity may be an issue (Mental Capacity Act 2005).", "Best-interests decision documented (MCA assessment for adults without capacity). Consider sedation / GA referral if essential imaging cannot be obtained at the chair. Use the lowest-dose view that answers the question."],
      ["Holding the patient (parent / carer)", "Holder should not be regularly involved in radiography. Pregnant holders excluded.", "Provide lead apron + thyroid shield to holder. Position holder out of the primary beam. Document who held and why."],
      ["Frequent re-presenter / repeat imaging request", "Cumulative dose tracking. Patient may have had imaging at another provider.", "Ask, document, request copies of recent imaging before duplicating. Use 'image bank' approach where the practice already has a recent diagnostic image."],
    ],
    notes: [
      "Apron use is not mandatory for intra-oral or panoramic dental exposures in current UK guidance — the field is not directed at the abdomen / thyroid. Offer if the patient requests for reassurance.",
      "Thyroid shielding may still be considered for occlusal / OPT where the beam approaches the thyroid — check local Employer's Procedures.",
      "If pregnancy is confirmed and imaging is urgent (e.g. acute infection, trauma) — proceed with justification, the smallest field, fastest receptor and document.",
    ],
  },

  /* ─── Card 6 · Significant Accidental / Unintended Exposure (SAUE) ─────── */
  {
    id: "saue-response",
    label: "Significant accidental / unintended exposure",
    icon: "alert",
    format: "flow",
    summary: "What to do when an exposure goes wrong — IR(ME)R 2024 notification and CQC pathway.",
    sources: [
      { name: "IR(ME)R 2024 Amendment Regulations — guidance on SAUE", url: "https://www.gov.uk/government/publications/ionising-radiation-medical-exposure-regulations-2017-guidance" },
      { name: "CQC — IR(ME)R notification pathway", url: "https://www.cqc.org.uk/guidance-providers/notifications-providers/notifications" },
    ],
    steps: [
      {
        n: 1,
        title: "Identify and contain at the chair",
        targets: ["Patient first, equipment second"],
        actions: [
          "Stop the exposure / cycle if not yet complete.",
          "Reassure the patient. Do not catastrophise — dental doses are very low.",
          "Isolate the equipment from further use until investigated.",
          "Document the incident contemporaneously — what, when, who, equipment, settings, view taken.",
        ],
        endpoint: "Incident captured factually. Patient informed openly (Duty of Candour).",
      },
      {
        n: 2,
        title: "Initial assessment — is this an SAUE?",
        targets: ["Threshold under IR(ME)R 2024 — significantly different dose to intended"],
        actions: [
          "Was the wrong patient exposed?",
          "Was a much greater dose delivered than intended (e.g. CBCT instead of PA, wrong protocol selected)?",
          "Was equipment malfunction involved? Settings drift?",
          "Was the exposure outside the practitioner's authorisation / training?",
        ],
        endpoint: "If any answer is YES — treat as SAUE pending RPA / MPE advice. Continue to step 3.",
      },
      {
        n: 3,
        title: "Escalate — RPA, MPE, employer",
        targets: ["Within hours, not days"],
        actions: [
          "Contact the practice's named RPA / MPE for advice on dose assessment.",
          "Inform the employer (practice owner / partnership / clinical governance lead).",
          "Engineer attendance if equipment malfunction suspected.",
          "Patient — open conversation about what happened, dose received, follow-up plan.",
        ],
        endpoint: "Dose assessment requested. Equipment status decided. Patient updated.",
      },
      {
        n: 4,
        title: "Notify CQC (where threshold met)",
        targets: ["Statutory notification under IR(ME)R 2024 + CQC Reg 18"],
        actions: [
          "CQC IR(ME)R notification — within agreed timeframe per local SOP (typically within working days of incident).",
          "Maintain the IR(ME)R incident log — incident, investigation, root cause, learning.",
          "Consider parallel duties — Duty of Candour (Reg 20) if patient experienced moderate harm or above.",
          "RIDDOR — separate consideration if a worker was injured.",
        ],
        endpoint: "Notification submitted with reference number. Internal investigation report drafted within 60 days (typical).",
      },
      {
        n: 5,
        title: "Learn and close",
        targets: ["Root cause, system change, training"],
        actions: [
          "Root cause: was it equipment, protocol, training, communication, attention?",
          "System change: update Employer's Procedures, protocols, equipment QA, supervision.",
          "Training: targeted retraining for the operator / practitioner; share learning across the team.",
          "Re-audit at 3 + 6 months to confirm the change has held.",
        ],
        endpoint: "Incident closed. Improvement evidenced. Learning shared at clinical governance meeting.",
      },
    ],
  },
];
