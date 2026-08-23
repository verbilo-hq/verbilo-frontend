/**
 * Whitening & Aesthetics Quick Reference cards — chairside decision-support
 * content for the Clinical Resources Hub → Whitening & Aesthetics tab.
 *
 * Not controlled SOPs (those live in WH-CP-01..04 inside the Clinical
 * Governance pack). Evergreen chairside lookup, derived from external UK
 * guidance (GDC tooth whitening legal position, EU Cosmetic Products
 * Regulation 1223/2009, BDA).
 */

export const whiteningQuickRefFixture = [
  /* ─── Card 1 · UK legal limits at a glance ─────────────────────────────── */
  {
    id: "whitening-legal-limits",
    label: "UK legal limits",
    icon: "alert",
    format: "table",
    summary: "Who can supply what concentration to whom — the bright lines of UK tooth-whitening law.",
    sources: [
      { name: "GDC — Tooth whitening legal position statement",                        url: "https://www.gdc-uk.org/information-standards-guidance/standards-and-guidance/tooth-whitening" },
      { name: "GDC — Working within the law guidance on tooth whitening",              url: "https://www.gdc-uk.org/" },
      { name: "EU Cosmetic Products Regulation 1223/2009 (UK retained law)",            url: null },
    ],
    columns: ["H₂O₂ concentration", "Who may use it", "Pathway", "Notes"],
    rows: [
      ["≤ 0.1% (released / contained)",        "Anyone, including under-18s.",                  "Sold OTC. No dental supervision required.",       "Effect on shade is minimal at this concentration."],
      ["> 0.1% – 6% (released / contained)",   "Adults 18+ for cosmetic purposes.",              "Dentist-led. First use by dentist or under direct supervision; home continuation permitted.", "Most home-tray and chairside products sit in this band. 10% carbamide ≈ 3.5% H₂O₂."],
      ["> 6% (released / contained)",          "Not lawful.",                                    "—",                                              "Cosmetic whitening only. Lawful prescription for disease management is separate."],
      ["Under-18 cosmetic whitening",          "Not lawful.",                                    "—",                                              "Lawful only where purpose is wholly to treat disease (e.g. severe intrinsic staining post-trauma)."],
      ["Non-dental retailer / salon",           "Not lawful.",                                    "Report illegal practice to GDC.",                "Tooth whitening is the practice of dentistry — only GDC-registered professionals above 0.1% H₂O₂."],
    ],
    notes: [
      "Carbamide peroxide ≈ 1/3 of its weight in hydrogen peroxide (so 10% CP ≈ 3.5% H₂O₂). Check the product datasheet for the released H₂O₂ figure.",
      "Document concentration, batch and expiry every time you issue a product.",
      "Discuss reasonable expectations with the patient BEFORE issuing — restorations, crowns and veneers will not whiten.",
    ],
  },

  /* ─── Card 2 · Pre-treatment suitability checklist ─────────────────────── */
  {
    id: "whitening-suitability",
    label: "Suitability checklist",
    icon: "check",
    format: "table",
    summary: "Run through this before agreeing to whiten — every item is a reason to pause or refuse.",
    sources: [
      { name: "GDC Standards — obtain valid consent",  url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
      { name: "BDA — tooth whitening advice",          url: "https://bda.org/" },
    ],
    columns: ["Check", "If yes", "Action"],
    rows: [
      ["Patient is under 18 and the reason is cosmetic",                                            "Stop",                  "Not lawful with H₂O₂ > 0.1%. Discuss alternatives (no treatment, deferred until 18)."],
      ["Active caries, periodontal disease or pulpal symptoms",                                     "Stabilise first",       "Treat dental disease before whitening. Whitening on an inflamed pulp will worsen symptoms."],
      ["Severe baseline sensitivity / generalised exposed dentine",                                  "Caution",               "Lower concentration, alternate-day use, desensitising toothpaste 2 weeks before and during. Set expectations."],
      ["Crowns / veneers / composites in the aesthetic zone",                                        "Counsel + plan",        "Discuss that restorations will NOT whiten — likely replacement after shade stabilises (≥ 2 weeks post-whitening)."],
      ["Pregnant or breastfeeding",                                                                  "Defer",                 "No evidence of harm but elective treatment. Defer until after pregnancy / breastfeeding ends."],
      ["Allergy / previous reaction to peroxide or colophony (tray adhesive)",                       "Avoid",                  "Consider alternative aesthetic approach (e.g. composite bonding) if appropriate."],
      ["Body image / unrealistic expectations / coercion to whiten",                                  "Pause",                  "Document the discussion. Decline treatment if the underlying issue is not about teeth."],
      ["Smoking / heavy staining habit",                                                              "Counsel",                "Whitening will reverse less effectively with continued staining habit. Smoking cessation conversation."],
      ["Non-vital / single dark tooth post-trauma",                                                   "Internal whitening route", "Different protocol (internal non-vital bleaching) — refer if outside competence."],
    ],
    notes: [
      "Take baseline shade + photographs BEFORE treatment. The patient remembers their teeth as darker than they were — without baseline you cannot show what changed.",
      "Consent is a discussion, not a signature. Confirm in writing what was discussed and what was agreed.",
      "Document the discussion if the patient is borderline-suitable but chooses to proceed.",
    ],
  },

  /* ─── Card 3 · Adverse effects management ──────────────────────────────── */
  {
    id: "whitening-adverse-effects",
    label: "Adverse effects management",
    icon: "alert",
    format: "table",
    summary: "Common chairside presentations during or after whitening — recognise, manage, when to pause.",
    sources: [
      { name: "GDC — Tooth whitening legal position statement",  url: "https://www.gdc-uk.org/information-standards-guidance/standards-and-guidance/tooth-whitening" },
      { name: "BDA — tooth whitening advice",                     url: "https://bda.org/" },
      { name: "SDCEP — Drug Prescribing for Dentistry",           url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    ],
    columns: ["Finding", "Likely cause", "Practice response"],
    rows: [
      ["Mild transient sensitivity to cold during home whitening",         "Expected reversible response to whitening",                            "Reassure. Sensitive toothpaste, reduced wear time or alternate-day use. Usually settles within 24 h of pausing."],
      ["Moderate sensitivity affecting eating / sleep",                     "Overuse, exposed dentine, tray pressure, higher concentration",        "Pause. Review fit. Reduce concentration / wear time on restart. Consider desensitising primer in tray for 5 min before gel."],
      ["Sharp spontaneous pain or lingering thermal pain",                   "Pulpitis, cracked tooth, caries or restoration breakdown",             "STOP whitening. Dentist assessment before any restart — investigate pulpal status."],
      ["Gingival blanching / burning / chemical irritation",                 "Gel contact, tray overfill, poor isolation or poor tray fit",          "Remove gel, rinse, check tissues, review tray contour and patient gel amount. Pause until soft tissues heal."],
      ["Ulceration or persistent mucosal soreness",                          "Chemical injury vs unrelated mucosal lesion",                          "Dentist review. Do not restart until lesion is diagnosed or resolved. Photograph for record."],
      ["Uneven whitening / white spots more visible",                         "Dehydration, enamel defects, fluorosis, demineralisation",            "Allow rehydration over 1–2 weeks before judging. Discuss revised expectations. Consider ICON resin infiltration or composite camouflage for white spots."],
      ["Poor response despite full course",                                  "Tetracycline staining, fluorosis, non-vital tooth, restorations",      "Reassess differential. Internal whitening for non-vital, restorative alternatives for tetracycline, refer if needed."],
      ["Relapse over months / years",                                         "Dietary staining, smoking, time since treatment",                       "Top-up gel from the same dentist-led pathway. Reinforce diet / smoking conversation."],
      ["Suspected ingestion of gel / allergic reaction",                      "Rare but serious",                                                       "Per practice medical emergency protocol. Anaphylaxis: adrenaline + 999. Significant ingestion: A&E."],
    ],
    notes: [
      "Top-up gel must be issued under the same dentist-led pathway — assessment, suitability, consent, batch traceability. No 'no-appointment' top-ups.",
      "Discoloured non-vital teeth (post-trauma) need internal walking bleach — a different protocol. Refer if outside competence.",
      "Document every adverse effect — symptoms, response, restart plan or discontinuation.",
    ],
  },

  /* ─── Card 4 · Aesthetic outcome conversation flow ─────────────────────── */
  {
    id: "aesthetic-conversation",
    label: "Aesthetic conversation",
    icon: "arrow",
    format: "flow",
    summary: "Steer the conversation from 'I want whiter teeth' to a realistic plan that matches what the patient can actually achieve.",
    sources: [
      { name: "GDC Standards — obtain valid consent",       url: "https://standards.gdc-uk.org/pages/principle3/principle3.aspx" },
      { name: "GDC Standards — openness and patient communication", url: "https://standards.gdc-uk.org/pages/principle1/principle1.aspx" },
      { name: "BDA — tooth whitening advice",                url: "https://bda.org/" },
    ],
    steps: [
      {
        n: 1,
        title: "What does the patient actually want?",
        targets: ["Whiter teeth vs straighter teeth vs full aesthetic change"],
        actions: [
          "Ask in their words — 'what would you change about your smile?'",
          "Show their own current photos in good light. Patients underestimate their current shade.",
          "Distinguish whitening (colour) from alignment (orthodontics) from form (composite / veneers).",
        ],
        endpoint: "If the concern is alignment or form, whitening alone won't deliver what they want.",
      },
      {
        n: 2,
        title: "What will whitening NOT change?",
        targets: ["Be explicit before treatment, not after"],
        actions: [
          "Restorations (composite, crowns, veneers, bridges, dentures) will not whiten.",
          "Single dark tooth from trauma usually needs internal whitening, not external.",
          "Tetracycline staining lightens poorly with external whitening — discuss restorative alternatives.",
          "White spots / fluorosis may become more visible before they fade with rehydration.",
        ],
        endpoint: "Patient must understand expectation limits BEFORE consenting.",
      },
      {
        n: 3,
        title: "Baseline shade and photographs",
        targets: ["Before any product touches the teeth"],
        actions: [
          "Take a documented shade with a guide (Vita Classical or 3D Master) on clean wet teeth in natural light.",
          "Photograph with the shade tab in the same image — referenceable record.",
          "Compare with the patient at the chair. Get their verbal acknowledgement of starting point.",
        ],
        endpoint: "Without a baseline, you cannot evidence the result.",
      },
      {
        n: 4,
        title: "Match plan to suitability",
        targets: ["See Card 2 (suitability checklist)"],
        actions: [
          "Home tray whitening — most cooperative adults, mild-to-moderate change goal.",
          "Chairside whitening — visible 'today' result, often combined with home tray top-up.",
          "Internal whitening — single dark non-vital tooth post-trauma.",
          "Restorative alternative — if expectation exceeds what whitening delivers, plan composite or veneers instead.",
        ],
        endpoint: "Choose ONE primary approach + agreed top-up / maintenance plan.",
      },
      {
        n: 5,
        title: "Review and aesthetic acceptance",
        targets: ["At end of course / at fit"],
        actions: [
          "Compare post-treatment shade with baseline photographs.",
          "Time aesthetic restorations ≥ 2 weeks after whitening completes — shade stabilises.",
          "Discuss maintenance: top-up gel under the same dentist-led pathway, diet / smoking, recall.",
          "If patient is disappointed: review baseline, discuss alternatives (composite bonding, veneers, ortho referral) rather than re-whitening.",
        ],
        endpoint: "Document final shade, patient acceptance, and the agreed maintenance plan.",
      },
    ],
  },
];

/** Exposed via the existing clinical.service pattern. Wired into the
 *  Whitening & Aesthetics tab on the Clinical Resources Hub. */
export const listWhiteningQuickRef = () => whiteningQuickRefFixture;
