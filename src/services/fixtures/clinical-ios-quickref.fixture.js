/**
 * Implants & Oral Surgery Quick Reference cards — chairside decision-support
 * content for the Clinical Resources Hub → Implants & Oral Surgery tab.
 *
 * Like the Perio and Endo quick-ref, these are NOT controlled SOPs (those
 * live in the Clinical Governance pack IOS-01..10). They're evergreen
 * reference for mid-treatment lookup, derived from external UK guidance
 * (SDCEP, NICE, BAOS, FGDP/CGDent).
 *
 * Same card formats as the others: `table`, `flow`, `decision`.
 */

export const iosQuickRefFixture = [
  /* ─── Card 1 · Anticoagulant management for surgical patients ─────────── */
  {
    id: "anticoag-management",
    label: "Anticoagulants & antiplatelets",
    icon: "alert",
    format: "table",
    summary: "SDCEP at-a-glance: continue vs pause, INR thresholds and local haemostasis for the common bleeding-risk medications.",
    sources: [
      { name: "SDCEP — Management of Dental Patients Taking Anticoagulants or Antiplatelet Drugs", url: "https://www.sdcep.org.uk/published-guidance/anticoagulants-and-antiplatelets/" },
      { name: "SDCEP — Drug Prescribing for Dentistry",                                              url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    ],
    columns: ["Drug", "Higher-risk procedures", "Lower-risk procedures", "Local haemostasis"],
    rows: [
      ["Warfarin",                            "Check INR within 72 h (24 h if unstable). Treat if INR ≤ 4.0; do NOT stop without prescriber.",         "Continue as prescribed.",                                                      "Pack with oxidised cellulose, suture, gauze pressure ≥ 20 min, advise tranexamic mouthwash if persistent ooze."],
      ["DOAC — apixaban / dabigatran",         "Consider missing the morning dose on day of procedure (or delaying it until 4 h after).",              "Continue as prescribed.",                                                      "Same as above. Recommend morning appointments to allow daytime review."],
      ["DOAC — rivaroxaban / edoxaban (once-daily)", "Delay the morning dose until 4 h after haemostasis is achieved.",                                "Continue as prescribed.",                                                      "Same as above."],
      ["Aspirin (single antiplatelet)",        "Continue.",                                                                                              "Continue.",                                                                    "Local measures usually sufficient."],
      ["Clopidogrel / prasugrel / ticagrelor",  "Continue. Use enhanced local haemostasis.",                                                              "Continue.",                                                                    "Oxidised cellulose + sutures + tranexamic acid mouthwash 4×/day for 2 days."],
      ["Dual antiplatelet therapy",            "Continue — DO NOT stop without liaison with cardiologist.",                                              "Continue.",                                                                    "Enhanced local haemostasis. Consider staging extractions."],
      ["LMWH / heparin (rare in primary care)", "Liaise with prescriber.",                                                                                "Liaise with prescriber.",                                                      "Specialist input recommended."],
    ],
    notes: [
      "Higher-risk = multiple extractions, surgical extractions, flap surgery, alveolar surgery, biopsies, implant placement, bone grafting.",
      "Lower-risk = simple extraction (1–2 teeth), supra/subgingival PMPR, abscess incision, restorations including subgingival prep.",
      "NEVER stop an anticoagulant without explicit prescriber agreement. Local haemostasis manages almost all bleeding in primary care.",
      "Tranexamic acid mouthwash (5%, 10 mL, 4×/day for 2 days) is the most evidence-supported adjunct for post-extraction bleeding.",
    ],
  },

  /* ─── Card 2 · MRONJ risk stratification ──────────────────────────────── */
  {
    id: "mronj-risk",
    label: "MRONJ risk stratification",
    icon: "alert",
    format: "table",
    summary: "Per SDCEP — sort patients into Low or Higher risk before extraction or invasive surgical treatment.",
    sources: [
      { name: "SDCEP — Oral Health Management of Patients at Risk of MRONJ",  url: "https://www.sdcep.org.uk/published-guidance/medication-related-osteonecrosis-of-the-jaw-mronj/" },
      { name: "SDCEP — Drug Prescribing for Dentistry",                       url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    ],
    columns: ["Patient profile", "Risk band", "Primary care action"],
    rows: [
      ["Bisphosphonates (oral) for osteoporosis · < 5 years · no concurrent steroids",                "Low",     "Routine atraumatic extraction. Prevention + recall. Inform patient of small MRONJ risk."],
      ["Bisphosphonates (oral) ≥ 5 years OR concurrent systemic steroids / other risk factors",       "Higher",  "Consider extraction in primary care with atraumatic technique + suture; refer to specialist if complex."],
      ["IV bisphosphonates (zoledronate / pamidronate) for cancer",                                    "Higher",  "Refer to OMFS / specialist for any invasive procedure."],
      ["Denosumab (Prolia, osteoporosis dose 6-monthly)",                                              "Low",     "Treat as oral bisphosphonate (low) once-yearly cohort — atraumatic technique; same principles."],
      ["Denosumab (Xgeva, cancer dose 4-weekly)",                                                       "Higher",  "Refer to OMFS / specialist for any invasive procedure."],
      ["Antiangiogenics (bevacizumab, sunitinib, etc.) for cancer",                                    "Higher",  "Refer to OMFS / specialist."],
      ["Previous MRONJ (any drug, healed)",                                                             "Higher",  "Refer to OMFS for any further invasive procedure."],
    ],
    notes: [
      "MRONJ is rare overall but life-changing. Document the risk band and the discussion in the patient record.",
      "Prevention is the most powerful intervention — stabilise dental disease BEFORE drug therapy starts where possible.",
      "Single-tooth atraumatic extraction in a low-risk patient does not require specialist referral — but local haemostasis + suture + follow-up are essential.",
    ],
  },

  /* ─── Card 3 · Antibiotic prophylaxis decision flow ───────────────────── */
  {
    id: "abx-prophylaxis",
    label: "Antibiotic prophylaxis",
    icon: "arrow",
    format: "flow",
    summary: "When to prescribe pre-operative antibiotics — for infective endocarditis (rare per NICE) and for implant / surgical site prophylaxis.",
    sources: [
      { name: "NICE CG64 — Prophylaxis against infective endocarditis",                                url: "https://www.nice.org.uk/guidance/cg64" },
      { name: "SDCEP — Antibiotic Prophylaxis Against Infective Endocarditis",                         url: "https://www.sdcep.org.uk/published-guidance/antibiotic-prophylaxis/" },
      { name: "SDCEP — Drug Prescribing for Dentistry",                                                url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    ],
    steps: [
      {
        n: 1,
        title: "Is this an invasive dental procedure?",
        targets: ["Per SDCEP/NICE"],
        actions: [
          "Invasive = manipulation of dento-gingival junction / periapical region OR perforation of oral mucosa.",
          "Includes extraction, scaling/RSD, biopsy, implant placement, periapical / periradicular surgery.",
          "Excludes restorative work above the gingival margin without bleeding.",
        ],
        endpoint: "If NOT invasive → no prophylaxis needed.",
      },
      {
        n: 2,
        title: "Does the patient have an at-increased-risk cardiac condition?",
        targets: ["Per NICE CG64"],
        actions: [
          "Prosthetic heart valve (mechanical, bioprosthetic or transcatheter).",
          "Previous infective endocarditis.",
          "Cyanotic congenital heart disease (uncorrected or with residual defect).",
          "Repaired congenital heart disease with prosthetic material < 6 months post-procedure.",
          "Cardiac transplant recipients with valvulopathy.",
        ],
        endpoint: "If YES at-increased-risk → proceed to Step 3.",
      },
      {
        n: 3,
        title: "Shared decision: does the patient want prophylaxis?",
        targets: ["NICE does NOT routinely recommend antibiotic prophylaxis — but the patient can request it after shared discussion."],
        actions: [
          "Discuss risks (allergy, C. difficile, antimicrobial resistance) and benefits (theoretical IE risk reduction).",
          "Liaise with the cardiologist if the patient is uncertain or has had previous IE.",
          "If patient declines or shared decision is no → no prophylaxis. Reinforce oral health, recall.",
        ],
        endpoint: "If YES patient wants → prescribe per SDCEP.",
      },
      {
        n: 4,
        title: "Prescribe — IE prophylaxis (SDCEP)",
        targets: ["1 hour pre-procedure"],
        actions: [
          "Amoxicillin 3 g oral 60 minutes before the procedure.",
          "If penicillin allergy: clindamycin 600 mg oral 60 minutes before. (Clindamycin advice has changed — check latest SDCEP).",
          "Children: amoxicillin 50 mg/kg (max 3 g).",
          "Document indication, drug, dose, route, allergy check.",
        ],
        endpoint: "Document the decision, the drug given, and the procedure performed.",
      },
      {
        n: 5,
        title: "Implant / bone graft surgical prophylaxis (separate from IE)",
        targets: ["Per SDCEP and local implant pathway"],
        actions: [
          "Single dose amoxicillin 2 g (or 3 g) oral 60 minutes before implant placement — evidence supports a single pre-op dose.",
          "Post-op antibiotic course is NOT routinely indicated — increases AMR with little additional benefit.",
          "Adjust for allergies; document rationale.",
        ],
        endpoint: "Single pre-op dose only unless local infection or specific clinical indication after the procedure.",
      },
    ],
  },

  /* ─── Card 4 · Post-operative complications guide ─────────────────────── */
  {
    id: "post-op-complications",
    label: "Post-op complications",
    icon: "alert",
    format: "table",
    summary: "Patient returns post-extraction or implant — recognise the pattern, act fast.",
    sources: [
      { name: "SDCEP — Drug Prescribing for Dentistry",   url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
      { name: "BAOS — Oral surgery patient information",  url: "https://www.baos.org.uk/" },
      { name: "Practice medical emergency protocol",       url: null },
    ],
    columns: ["Presentation", "Likely cause", "Action", "Urgency"],
    rows: [
      ["3–5 days post-extraction · severe pain · empty socket · halitosis · no swelling",          "Alveolar osteitis (dry socket)",         "Irrigate with warm saline + chlorhexidine, place alvogyl / iodoform dressing, analgesia. Review in 24–48 h.", "Same-week"],
      ["Persistent oozing > 8 h post-op",                                                          "Inadequate haemostasis ± anticoagulant",  "Local pressure 20 min, oxidised cellulose, suture, tranexamic mouthwash 4×/day × 2 days. Reassess INR/medications.",  "Same-day"],
      ["Whistling air / fluid through socket after upper molar / premolar extraction",             "Oro-antral communication (OAC)",          "Confirm with Valsalva. If small (< 2 mm), advise no nose-blow; refer to OMFS within days for review. Larger — same-day referral.",  "Days / same-day"],
      ["Persistent numbness > 24 h after mandibular surgery",                                      "Inferior alveolar / lingual nerve injury", "Document neurosensory map. Refer per local OMFS pathway within 1 week. Photograph if visible bruising.",                  "Refer within 1 week"],
      ["Increasing swelling + fever + trismus post-op",                                            "Surgical site infection / spreading",     "Drainage if collection. Antibiotics per SDCEP (amoxicillin 500 mg TDS 5 days or metronidazole 400 mg TDS).",          "Same-day"],
      ["Floor-of-mouth swelling / airway compromise",                                              "Ludwig's angina / spreading infection",   "999 / A&E IMMEDIATELY. Do not attempt drainage in primary care.",                                                     "Emergency"],
      ["Implant pain + mobility days–weeks post-op",                                                "Early implant failure",                    "Photograph, periapical radiograph, refer to placing clinician / OMFS. Avoid removing without specialist input.",        "Within 1 week"],
    ],
    notes: [
      "Dry socket: prevent by avoiding rinsing 24 h post-op, no smoking, soft diet. Treat — do not prescribe routine antibiotics.",
      "Anticoagulant patient with persistent bleeding: local measures first, then consider tranexamic mouthwash before stopping the drug.",
      "Document neurosensory injury immediately — patient consent for photographs assists medico-legal record.",
    ],
  },

  /* ─── Card 5 · Surgical referral triggers flow ────────────────────────── */
  {
    id: "referral-triggers",
    label: "Refer to OMFS / specialist?",
    icon: "arrow",
    format: "flow",
    summary: "Decide before opening up — is this within general-practice competence or should it be referred?",
    sources: [
      { name: "BAOS / FDS — Oral Surgery practice guidance",            url: "https://www.baos.org.uk/" },
      { name: "GDC Standards — working within competence",               url: "https://standards.gdc-uk.org/pages/principle7/principle7.aspx" },
      { name: "NICE TA1 — Wisdom teeth (where applicable)",              url: "https://www.nice.org.uk/" },
    ],
    steps: [
      {
        n: 1,
        title: "Indication clear?",
        targets: ["Symptoms · pathology · restorability"],
        actions: [
          "Pain + symptoms reproducible to the tooth in question?",
          "Pathology confirmed clinically + radiographically?",
          "Restorability honestly considered? (RES-08 / IOS-01)",
        ],
        endpoint: "If indication unclear, do not start.",
      },
      {
        n: 2,
        title: "Anatomically straightforward?",
        targets: ["Imaging review · root form · adjacent structures"],
        actions: [
          "Roots convergent, single, accessible?",
          "Distance from inferior alveolar canal, mental foramen, maxillary sinus on radiograph?",
          "Adjacent teeth / restorations not at risk from luxation?",
        ],
        endpoint: "If close to nerve / sinus or unusual anatomy → consider CBCT or referral.",
      },
      {
        n: 3,
        title: "Within your skill + kit?",
        targets: ["Per GDC principle 7 — honest self-assessment"],
        actions: [
          "Surgical extraction technique familiar (flap, bone removal, sectioning)?",
          "Appropriate instruments / handpiece / suction?",
          "Trained nurse available?",
          "Time in the diary for an unplanned surgical conversion?",
        ],
        endpoint: "If any answer is no → refer.",
      },
      {
        n: 4,
        title: "Medical risk manageable in primary care?",
        targets: ["See Card 1 (anticoagulants) and Card 2 (MRONJ)"],
        actions: [
          "Anticoagulation manageable with local haemostasis?",
          "Low MRONJ risk band?",
          "No ASA III/IV concern requiring hospital setting?",
          "Patient cooperation adequate (no sedation/GA referral needed)?",
        ],
        endpoint: "If medical risk exceeds primary care capacity → refer.",
      },
      {
        n: 5,
        title: "Refer destinations",
        targets: ["Match destination to need"],
        actions: [
          "Routine surgical complexity → local oral surgery (often community / DCT-led service).",
          "Suspected pathology, biopsy, malignancy → OMFS via 2-week-wait or routine OMFS.",
          "Implant complications → original placing clinician + OMFS as needed.",
          "Medical complexity needing GA → secondary care OMFS or hospital dentistry.",
        ],
        endpoint: "Send a full referral with diagnosis, radiograph, history, what you've tried, and the specific question.",
      },
    ],
  },
];

/** Exposed via the existing clinical.service pattern. Wired into the
 *  Implants & Oral Surgery tab on the Clinical Resources Hub. */
export const listIosQuickRef = () => iosQuickRefFixture;
