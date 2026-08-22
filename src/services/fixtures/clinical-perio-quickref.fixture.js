/**
 * Periodontal Quick Reference cards — chairside decision-support content for
 * the Clinical Resources Hub → Periodontal tab.
 *
 * These are intentionally NOT controlled SOPs (those live in the Clinical
 * Governance pack under Governance & SOPs). They're evergreen reference,
 * derived from external UK guidance (BSP / BSPD / SDCEP / NICE / EFP).
 *
 * Use case: clinician glances at this mid-examination or mid-treatment — 5
 * seconds to find an answer, no clicks needed. No approval workflow, no
 * version control, no staff acknowledgement.
 *
 * Card format choices:
 *   - `table`  — fixed grid of rows/columns (BPE codes, grading scales)
 *   - `flow`   — visual horizontal pathway (Step 1 → 2 → 3 → 4)
 *   - `decision` — input fields → computed output (Staging & Grading)
 *
 * Sources cited in each card so a clinician can verify the rationale.
 */

export const perioQuickRefFixture = [
  /* ─── Card 1 · BPE codes & action thresholds ────────────────────────────── */
  {
    id: "bpe-codes",
    label: "BPE codes & actions",
    icon: "barchart",
    format: "table",
    summary: "What each BPE score means and the minimum clinical response.",
    sources: [
      { name: "BSP BPE Guidelines (2019)", url: "https://www.bsperio.org.uk/professionals/basic-periodontal-examination-bpe-information" },
      { name: "BSP/BSPD — BPE in Children & Adolescents",  url: "https://www.bsperio.org.uk/professionals/under-18s" },
    ],
    columns: ["Code", "Finding", "Minimum action"],
    rows: [
      ["0", "Pocket < 3.5 mm · no bleeding · no calculus / plaque-retentive factors", "Reinforce prevention. Risk-based recall."],
      ["1", "Pocket < 3.5 mm · bleeding on probing", "OHI tailored to the bleeding sites. Risk-based recall."],
      ["2", "Pocket < 3.5 mm · calculus or plaque-retentive factor present", "OHI + supragingival scale & polish. Remove the plaque-retentive factor."],
      ["3", "Pocket 3.5–5.5 mm (black band partially visible)", "Full periodontal charting in the affected sextant. OHI + subgingival instrumentation. Re-assess at 3 months."],
      ["4", "Pocket > 5.5 mm (black band not visible)", "Full-mouth periodontal charting. Diagnosis (Stage & Grade). Risk assessment. Structured Step 1 + Step 2 therapy. Radiographs if clinically justified."],
      ["*", "Furcation involvement at any sextant", "Site-specific furcation grading (Hamp I–III). Radiographs to assess bone level. Consider specialist referral if Grade II/III."],
    ],
    notes: [
      "BPE is a screening tool, not a diagnosis.",
      "Do not ignore bleeding, suppuration, mobility or recession even if BPE scores are low.",
      "For under-18s, use the BSP/BSPD simplified BPE on index teeth (UR6, UR1, UL6, LL6, LL1, LR6) — codes 0–2 only from age 7; full BPE from 12 if cooperation allows.",
    ],
  },

  /* ─── Card 2 · BSP 2018 Staging & Grading decision tool ─────────────────── */
  {
    id: "staging-grading",
    label: "BSP 2018 Staging & Grading",
    icon: "target",
    format: "decision",
    summary: "Stage = severity & complexity. Grade = rate of progression.",
    sources: [
      { name: "BSP — Implementation of the 2017 Classification (2019)", url: "https://www.bsperio.org.uk/professionals/new-classification-of-periodontal-diseases" },
      { name: "BSP S3 UK Clinical Practice Guidelines (2021)",            url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    ],
    // Decision tool inputs the clinician would set
    inputs: [
      { id: "interdentalCAL", label: "Worst-site interdental CAL (mm)", type: "number", min: 0, max: 15, step: 0.5, hint: "Loss of clinical attachment at the worst interproximal site." },
      { id: "boneLossPct",    label: "Worst-site bone loss (% of root length)", type: "number", min: 0, max: 100, step: 1, hint: "From periapical or bitewing radiograph." },
      { id: "ageYears",       label: "Patient age (years)", type: "number", min: 7, max: 110, step: 1 },
      { id: "toothLossDueToPerio", label: "Teeth lost due to periodontitis", type: "number", min: 0, max: 32, step: 1 },
    ],
    // Logic the UI would apply
    stagingRules: [
      { stage: "I",   condition: "Interdental CAL 1–2 mm · radiographic bone loss < 15% · no tooth loss due to periodontitis",                                                       severity: "Initial periodontitis" },
      { stage: "II",  condition: "Interdental CAL 3–4 mm · radiographic bone loss 15–33% · no tooth loss due to periodontitis",                                                       severity: "Moderate periodontitis" },
      { stage: "III", condition: "Interdental CAL ≥ 5 mm · radiographic bone loss ≥ middle third · tooth loss due to periodontitis ≤ 4 · pocket ≥ 6 mm / vertical bone loss / furcation II–III", severity: "Severe periodontitis — potential for additional tooth loss" },
      { stage: "IV",  condition: "Stage III criteria PLUS tooth loss due to periodontitis ≥ 5 · masticatory dysfunction · drifting / flaring / occlusal trauma · need for complex rehab", severity: "Severe periodontitis — potential for loss of dentition" },
    ],
    gradingRules: [
      { grade: "A", condition: "% bone loss / age < 0.25",         progression: "Slow" },
      { grade: "B", condition: "% bone loss / age 0.25 – 1.0",     progression: "Moderate" },
      { grade: "C", condition: "% bone loss / age > 1.0",          progression: "Rapid" },
    ],
    modifiers: [
      "Smoking ≥ 10 cigarettes/day → upgrade Grade by one level",
      "Poorly controlled diabetes (HbA1c ≥ 7%) → upgrade Grade by one level",
      "Extent: localised < 30% of teeth affected · generalised ≥ 30% · molar–incisor pattern",
    ],
  },

  /* ─── Card 3 · BSP S3 Stepwise Pathway (visual flow) ────────────────────── */
  {
    id: "stepwise-pathway",
    label: "BSP S3 Stepwise Treatment",
    icon: "arrow",
    format: "flow",
    summary: "The four-step UK periodontal treatment pathway with endpoint criteria for moving on.",
    sources: [
      { name: "BSP S3 UK Clinical Practice Guidelines (2021)", url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
      { name: "EFP S3 Level Treatment Guidelines (2020)",       url: "https://www.efp.org/publications/projects/clinical-practice-guidelines/" },
    ],
    steps: [
      {
        n: 1,
        title: "Step 1 — Behaviour & risk control",
        targets: ["All patients with periodontitis", "Stage I–IV"],
        actions: [
          "Personalised OHI (interdental brushes sized per site)",
          "Smoking cessation referral / brief intervention",
          "Diabetes status check — refer to GP if HbA1c uncontrolled",
          "Remove plaque-retentive factors (overhangs, defective restorations)",
          "Professional mechanical plaque removal (PMPR) supragingival",
        ],
        endpoint: "Plaque score reduction, bleeding score reduction, behavioural change demonstrated. Move to Step 2 — do not skip.",
      },
      {
        n: 2,
        title: "Step 2 — Subgingival instrumentation",
        targets: ["Stage I–III responding to Step 1"],
        actions: [
          "Subgingival instrumentation (hand / ultrasonic) per quadrant or full-mouth disinfection",
          "Local anaesthetic for pockets ≥ 5 mm",
          "Adjuncts (chlorhexidine, systemic antibiotics) considered only for Stage III Grade C or molar–incisor patterns",
          "Reinforce OHI at each visit",
        ],
        endpoint: "Reassess at 3 months: pocket depth, bleeding on probing, plaque score, smoking status. Define success / non-responding sites.",
      },
      {
        n: 3,
        title: "Step 3 — Repeat / Surgical for non-responders",
        targets: ["Stage III–IV with residual PPD ≥ 6 mm or BoP at re-evaluation"],
        actions: [
          "Repeated subgingival instrumentation at residual sites",
          "Access flap surgery for persistent deep pockets",
          "Regenerative procedures (e.g. EMD, GTR) for intra-bony defects with appropriate morphology",
          "Resective surgery for suprabony defects / furcation II",
          "Referral threshold: Stage IV / Grade C / failed Step 2 / medical complexity",
        ],
        endpoint: "Pocket ≤ 4 mm with no BoP at all sites. Stability defined: no further attachment loss + minimal BoP.",
      },
      {
        n: 4,
        title: "Step 4 — Supportive Periodontal Care (SPT)",
        targets: ["All treated patients indefinitely"],
        actions: [
          "Risk-based recall interval — 3, 4, 6 months per site (default 3 months in first year post-active therapy)",
          "Re-evaluate plaque, bleeding, pocket depth, recession at every recall",
          "Targeted PMPR at any site with re-emerging BoP or pocketing",
          "Reinforce OHI, smoking, diabetes",
          "Annual full periodontal charting",
        ],
        endpoint: "Long-term stability. Return to active therapy if disease recurs (≥ 2 sites with ≥ 2 mm CAL loss or new PPD ≥ 5 mm with BoP).",
      },
    ],
  },

  /* ─── Card 4 · Mobility · Furcation · Recession grading ─────────────────── */
  {
    id: "grading-scales",
    label: "Mobility · Furcation · Recession",
    icon: "barchart",
    format: "table",
    summary: "Three standard grading scales — one screen, no scrolling.",
    sources: [
      { name: "Miller (1985) — Tooth Mobility Index",            url: "https://onlinelibrary.wiley.com/journal/16000757" },
      { name: "Hamp, Nyman & Lindhe (1975) — Furcation Grading", url: "https://onlinelibrary.wiley.com/journal/1600051x" },
      { name: "Cairo et al (2011) — Recession Classification (used by BSP)", url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1600-051X.2011.01713.x" },
    ],
    subTables: [
      {
        title: "Mobility (Miller)",
        columns: ["Grade", "Definition"],
        rows: [
          ["0", "Physiological mobility only"],
          ["1", "Horizontal mobility < 1 mm"],
          ["2", "Horizontal mobility > 1 mm"],
          ["3", "Horizontal mobility > 1 mm + vertical mobility — depressible in the socket"],
        ],
      },
      {
        title: "Furcation (Hamp / Lindhe)",
        columns: ["Grade", "Horizontal loss"],
        rows: [
          ["I",   "≤ 3 mm — early"],
          ["II",  "> 3 mm but not through-and-through — significant attachment loss"],
          ["III", "Through-and-through — probe passes entirely through the furcation"],
        ],
      },
      {
        title: "Recession (Cairo RT)",
        columns: ["Type", "Interdental attachment"],
        rows: [
          ["RT1", "No interproximal CAL loss — best prognosis for root coverage"],
          ["RT2", "Interproximal CAL loss ≤ buccal CAL — partial root coverage achievable"],
          ["RT3", "Interproximal CAL loss > buccal CAL — root coverage not predictable"],
        ],
      },
    ],
  },
];

/** Exposed via the existing clinical.service pattern. Wired into the
 *  Periodontal tab on the Clinical Resources Hub. */
export const listPerioQuickRef = () => perioQuickRefFixture;
