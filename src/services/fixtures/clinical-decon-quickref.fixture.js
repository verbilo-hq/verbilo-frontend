/**
 * Decontamination & IPC Quick Reference cards — chairside decision-support
 * content for the Clinical Resources Hub → Decontamination tab.
 *
 * Evergreen reference derived from external UK guidance — anchored to
 * HTM 01-05 (Decontamination in Primary Care Dental Practices), BS EN ISO
 * 15883 (washer-disinfectors), BS EN 13060 (small steam sterilizers),
 * HTM 04-01 (water systems), HTM 07-01 (clinical waste), HSE Sharps
 * Regulations 2013, GDC Standards and CGDent IPC guidance.
 *
 * These are NOT controlled SOPs (those live under Governance & SOPs → Decon
 * & IPC pack). They are chairside reference for nurses and clinicians who
 * need an answer in 5 seconds — what cycle, what threshold, what now.
 */

export const deconQuickRefFixture = [
  /* ─── Card 1 · Sterilizer test schedule (HTM 01-05) ──────────────────────── */
  {
    id: "sterilizer-tests",
    label: "Sterilizer test schedule",
    icon: "checksquare",
    format: "table",
    summary: "Daily, weekly, quarterly and annual checks required for HTM 01-05 compliance.",
    sources: [
      { name: "HTM 01-05 — Decontamination in Primary Care Dental Practices (2013, updated 2024)", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
      { name: "BS EN 13060 — Small steam sterilizers", url: "https://www.bsigroup.com/" },
      { name: "CGDent — Decontamination of Reusable Dental Instruments", url: "https://cgdent.uk/" },
    ],
    columns: ["Frequency", "Check", "Pass criterion"],
    rows: [
      ["Daily — start of session", "Visual inspection — door seal, chamber, drain, water reservoir.", "No visible contamination, debris, damage or limescale. Reservoir filled with fresh distilled / RO water."],
      ["Daily — start of session", "Automatic Control Test (ACT) cycle.", "Cycle completes within parameters (134 °C ± 3, 3 min hold for Type N / B). Printout / data log retained."],
      ["Daily (Type B only)", "Steam penetration test (Helix or Bowie-Dick).", "Indicator strip shows uniform colour change. Failed strip = sterilizer out of service until rectified."],
      ["Weekly", "Vacuum leak test (Type B vacuum cycle).", "Pressure rise ≤ 0.13 kPa/min during leak rate test. Failed = service engineer."],
      ["Weekly", "Air detector function test (Type B with air detector).", "Detector triggers when air introduced. Document result."],
      ["Quarterly", "Periodic test by Authorised Person (Decontamination) / Test Person.", "Thermometric small load + full load, residual air, dryness as applicable to sterilizer type. Engineer report retained 2+ years."],
      ["Annual", "Performance Qualification (PQ) by Test Person.", "Full revalidation against installation parameters. Calibration certificate retained 11 years (records lifetime for sterilizer)."],
      ["Each load", "Process Challenge Device (PCD) or chemical indicator inside one pouch / pack.", "Indicator passes for that cycle. Retain indicator with cycle log."],
    ],
    notes: [
      "Type N = non-vacuum (wrapped solid instruments only — no lumens, no porous loads). Type B = vacuum cycle (suitable for hollow / lumened / porous loads, e.g. handpieces, packaged loads).",
      "All cycle records (printouts / data logs) must be retained for 2 years minimum; sterilizer service / validation records for the lifetime of the device (11 years typical).",
      "Failed test = sterilizer immediately out of service. Quarantine the load. Engineer attendance required before re-use.",
    ],
  },

  /* ─── Card 2 · Foil test, protein residue & cleaning verification ───────── */
  {
    id: "cleaning-verification",
    label: "Cleaning verification — foil, protein, soil",
    icon: "shield",
    format: "table",
    summary: "Pass criteria for ultrasonic / washer-disinfector cleaning performance under HTM 01-05.",
    sources: [
      { name: "HTM 01-05 — section on cleaning verification", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
      { name: "BS EN ISO 15883 — Washer-disinfectors", url: "https://www.bsigroup.com/" },
    ],
    columns: ["Test", "What it checks", "Pass criterion", "Frequency"],
    rows: [
      ["Foil ablation (ultrasonic)", "Energy distribution within the ultrasonic bath.", "Uniform pitting / perforation of 0.05 mm aluminium foil within 60–90 s at 4 corners + centre. No \"dead zones\".", "Weekly."],
      ["Protein residue test (e.g. Lipsticktrans, BCA, ninhydrin)", "Effectiveness of manual / ultrasonic cleaning on processed instruments.", "≤ 3 µg residual protein per cm² of instrument surface (HTM 01-05 essential requirement).", "Quarterly (essential), weekly (best practice)."],
      ["Process Challenge Device (PCD) — washer-disinfector", "Whole washer-disinfector cycle, including detergent, temperature, rinse.", "Indicator shows full colour change / pass. No visible soil on test piece.", "Weekly (essential), daily best practice."],
      ["Visual inspection under magnification (≥ ×2.5 with task lighting)", "Residual debris on instruments before packaging.", "No visible debris, no rust, no damage. Instruments with residue → re-process.", "Every instrument, every cycle."],
      ["TOSI / Browne STF Load Check test", "Soil removal under realistic load in washer-disinfector.", "Test piece shows complete soil removal (uniform clean surface).", "Weekly."],
    ],
    notes: [
      "≤ 3 µg residual protein/cm² is the HTM 01-05 essential requirement; the best-practice target is ≤ 5 µg per side of a typical instrument.",
      "Washer-disinfector with thermal disinfection (≥ 80 °C for 10 min, ≥ 90 °C for 1 min, or A0 ≥ 600) is best practice. Manual + ultrasonic is essential minimum.",
      "Failed verification → re-process the affected load AND investigate root cause (detergent dose, water hardness, instrument loading, ultrasonic transducer).",
    ],
  },

  /* ─── Card 3 · Instrument decontamination flow ──────────────────────────── */
  {
    id: "instrument-flow",
    label: "Instrument decontamination flow",
    icon: "arrow",
    format: "flow",
    summary: "Six-stage HTM 01-05 reprocessing flow from chairside transport to sterile storage.",
    sources: [
      { name: "HTM 01-05 — Decontamination in Primary Care Dental Practices", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
      { name: "BS EN ISO 17664 — Reprocessing of reusable medical devices", url: "https://www.bsigroup.com/" },
    ],
    steps: [
      {
        n: 1,
        title: "Transport to LDU — dirty side",
        targets: ["Rigid closed container, leak-proof, labelled 'contaminated'"],
        actions: [
          "Do not pre-soak in enzymatic solution at the chairside unless manufacturer specifies (some materials degrade).",
          "Keep instruments moist if there will be a delay before reprocessing — drying blood / saline makes cleaning harder.",
          "Sharps separated and disposed at chairside — do not transport.",
        ],
        endpoint: "Container reaches the Local Decontamination Unit (LDU) sealed and clearly identified.",
      },
      {
        n: 2,
        title: "Pre-clean → wash",
        targets: ["Washer-disinfector (best practice) or ultrasonic + manual rinse"],
        actions: [
          "Disassemble jointed and hollow instruments. Open all hinges.",
          "Washer-disinfector cycle with validated detergent and thermal disinfection (A0 ≥ 600 typical).",
          "If manual + ultrasonic: pre-rinse in cool water, ultrasonic 5–10 min with enzymatic detergent (covered, lid closed), final rinse with reverse-osmosis or distilled water.",
        ],
        endpoint: "Instruments visibly clean. Lubricate hinges and handpieces per manufacturer.",
      },
      {
        n: 3,
        title: "Inspect under magnification",
        targets: ["≥ ×2.5 magnification with task light"],
        actions: [
          "Check for residual debris, rust, corrosion, blunt edges, damage.",
          "Re-process anything not visibly clean. Discard damaged instruments.",
          "Record inspection on the load batch sheet.",
        ],
        endpoint: "Every instrument passes inspection or is rejected.",
      },
      {
        n: 4,
        title: "Pack — for wrapped loads",
        targets: ["Validated sterilization pouches, double-pack for surgical kits"],
        actions: [
          "Use Type B (vacuum) sterilizer for wrapped, hollow or lumened instruments.",
          "Apply lot label: sterilizer ID, cycle number, date, operator initials, expiry date.",
          "Include chemical indicator inside the pack (Class 4 / Class 6 multi-parameter).",
        ],
        endpoint: "Pack labelled with traceable lot identifier and expiry.",
      },
      {
        n: 5,
        title: "Sterilize → cycle log",
        targets: ["134 °C ± 3 °C, 3 min hold (standard cycle), full drying"],
        actions: [
          "Cycle runs with appropriate Type N (unwrapped) or Type B (wrapped / hollow / porous).",
          "Operator verifies cycle parameters on printout / data log.",
          "Failed cycle → quarantine entire load, do not unload until investigated.",
          "Wet packs = failed drying → re-process. Do not store wet.",
        ],
        endpoint: "Cycle log printed / saved with operator signature. Retain 2 years.",
      },
      {
        n: 6,
        title: "Store — clean side",
        targets: ["Dust-free, dry, off-floor, clean cupboard or rack"],
        actions: [
          "Wrapped instruments — stored in date order, FIFO. Shelf-life per local policy (typically 60 days wrapped, sealed; verify locally).",
          "Unwrapped instruments — must be used same session. Cannot be stored unwrapped for later use.",
          "Storage area separated from dirty / contaminated areas. Single direction of flow from dirty → clean.",
        ],
        endpoint: "Instruments ready for clinical use, traceable to cycle, within shelf-life.",
      },
    ],
  },

  /* ─── Card 4 · DUWL water quality & sentinel outlet testing ────────────── */
  {
    id: "duwl-water",
    label: "Water — DUWL & sentinel outlets",
    icon: "droplets",
    format: "table",
    summary: "Dental unit water line (DUWL) and HTM 04-01 sentinel outlet thresholds and actions.",
    sources: [
      { name: "HTM 04-01 — Safe water in healthcare premises", url: "https://www.gov.uk/government/publications/safe-water-in-healthcare-premises-htm-04-01" },
      { name: "HTM 01-05 — section on water quality", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
      { name: "HSE — Legionnaires' disease ACoP L8", url: "https://www.hse.gov.uk/pubns/books/l8.htm" },
    ],
    columns: ["Parameter", "Threshold / target", "Action if breached"],
    rows: [
      ["DUWL — viable count (CFU/mL) at outlet", "≤ 200 CFU/mL (HTM 01-05 essential requirement).", "Shock-disinfect the line per manufacturer. Re-test. Persistent breach = investigate biofilm, replace lines if needed."],
      ["DUWL — Legionella spp.", "Not detected per 100 mL.", "Immediate shock-disinfection. Notify dutyholder. Re-sample. Persistent positive = take unit out of service."],
      ["Sentinel outlets — cold water temperature (after 2 min run)", "≤ 20 °C.", "Investigate stagnation. Check tank insulation, distribution. Risk-assess Legionella control."],
      ["Sentinel outlets — hot water temperature (after 1 min run)", "≥ 50 °C at outlet (≥ 55 °C in storage / circulating).", "Check calorifier set-point, valves, blending. Failure = scald + Legionella risk."],
      ["Little-used outlets — flushing frequency", "Weekly flush for at least 5 min hot + 5 min cold where outlet used < weekly.", "Document each flush. Failure to flush = treat as little-used + shock-disinfect."],
      ["DUWL flushing — start of session", "≥ 2 min through all handpieces, syringes, scaler before first patient.", "Documented in opening checks log."],
      ["DUWL flushing — between patients", "20–30 s through handpieces and triple syringe after each patient.", "Reduces cross-contamination + biofilm load."],
      ["Distilled / RO water for autoclave reservoir", "Conductivity ≤ 15 µS/cm (BS EN 13060).", "Higher conductivity = limescale risk. Use only verified distilled or RO water."],
    ],
    notes: [
      "HTM 04-01 requires every healthcare site to have a written water safety plan (WSP) and a competent person responsible for water safety.",
      "Sentinel outlet = the outlet furthest from and closest to the water inlet, plus high-risk outlets (showers, surgery handwash basins).",
      "DUWL testing frequency: 6-monthly viable count is essential; quarterly is best practice. Annual Legionella sampling minimum (more frequent if risk assessment indicates).",
    ],
  },

  /* ─── Card 5 · Sharps & needlestick injury response ─────────────────────── */
  {
    id: "sharps-injury",
    label: "Sharps & needlestick injury",
    icon: "alert",
    format: "flow",
    summary: "Immediate response, blood-borne virus risk assessment and PEP pathway.",
    sources: [
      { name: "Health and Safety (Sharp Instruments in Healthcare) Regulations 2013", url: "https://www.legislation.gov.uk/uksi/2013/645/contents" },
      { name: "Public Health England — Eye of the Needle / EAGA HIV PEP guidance", url: "https://www.gov.uk/government/collections/post-exposure-prophylaxis-pep" },
      { name: "BBV Exposure Management — Green Book chapter 6a", url: "https://www.gov.uk/government/publications/immunisation-against-infectious-disease-the-green-book" },
    ],
    steps: [
      {
        n: 1,
        title: "Immediate first aid at the chair",
        targets: ["Within 30 seconds of exposure"],
        actions: [
          "Encourage bleeding under cold running water — do not suck, do not scrub.",
          "Wash thoroughly with soap and water. Do not use bleach or alcohol on the wound.",
          "Splash to eye / mouth → irrigate with copious cool water / saline for at least 15 min, eyes open.",
          "Cover the wound with a waterproof dressing.",
        ],
        endpoint: "Wound clean, dressed. Move immediately to risk assessment — do not return to clinical work.",
      },
      {
        n: 2,
        title: "Risk-assess the exposure",
        targets: ["Source patient + injured worker"],
        actions: [
          "Type of injury — sharps / splash / bite. Depth, device used, visible blood.",
          "Source patient — consent for BBV testing (HIV, Hep B, Hep C). Do not coerce.",
          "Injured worker — Hep B vaccination status + last antibody titre.",
          "Document time, mechanism, persons involved on the practice's sharps injury report.",
        ],
        endpoint: "Risk graded LOW / MODERATE / HIGH. High-risk = immediate occupational health / A&E.",
      },
      {
        n: 3,
        title: "Escalate to occupational health / A&E",
        targets: ["Within 1 hour for high-risk exposures — HIV PEP window is ≤ 72 h, ideally < 1 h"],
        actions: [
          "Phone the local Occupational Health on-call number OR attend A&E.",
          "Bring: source-patient consent for testing (if obtained), worker's Hep B titre records, exposure report.",
          "PEP (post-exposure prophylaxis) decision is made by the OH / A&E clinician — not in primary dental care.",
          "Hep B booster ± immunoglobulin may be given by OH based on titre.",
        ],
        endpoint: "Worker assessed, baseline bloods taken, PEP commenced if indicated. Follow-up plan in place.",
      },
      {
        n: 4,
        title: "Practice-level documentation & escalation",
        targets: ["Within 24 hours"],
        actions: [
          "Sharps injury logged on practice incident register.",
          "RIDDOR — report to HSE if injury is to a worker AND results in > 7 days absence OR is a 'dangerous occurrence' (e.g. confirmed BBV exposure with seroconversion).",
          "CQC — consider Reg 18 notification if serious injury to staff or patient.",
          "Review root cause — was a safety device used? Was disposal at point of use? Update SOP / training.",
        ],
        endpoint: "Incident closed when worker follow-up complete, root cause addressed, learning shared.",
      },
    ],
  },

  /* ─── Card 6 · PPE selection by procedure type ──────────────────────────── */
  {
    id: "ppe-selection",
    label: "PPE — selection by procedure",
    icon: "shield",
    format: "table",
    summary: "Minimum PPE matched to aerosol risk and procedure type. Errs on side of essential, not minimum.",
    sources: [
      { name: "HTM 01-05 — PPE section", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
      { name: "HSE — PPE at Work Regulations 1992 (amended 2022)", url: "https://www.hse.gov.uk/ppe/ppe-regulations-2022.htm" },
      { name: "CGDent — IPC guidance for dental practice", url: "https://cgdent.uk/" },
    ],
    columns: ["Procedure type", "Gloves", "Mask", "Eye protection", "Body protection"],
    rows: [
      ["Non-clinical (reception, telephone)", "Not required.", "Not required.", "Not required.", "Standard uniform / scrubs."],
      ["Clinical examination — no instrumentation, no aerosol", "Single-use nitrile / latex.", "Type IIR fluid-resistant surgical mask.", "Side-shielded glasses / visor.", "Tunic + apron if contact with body fluids possible."],
      ["Non-AGP — hand instrumentation, manual scaling, examination with probing", "Single-use nitrile.", "Type IIR fluid-resistant.", "Full visor or glasses + side shields.", "Tunic + plastic apron."],
      ["AGP — high-speed handpiece, ultrasonic, air-water syringe, air polishing, prophy", "Single-use nitrile (consider double-gloving for surgical).", "FFP2 or FFP3 respirator (FFP3 best practice — fit-tested).", "Full-face visor + side-shielded glasses underneath.", "Tunic + plastic apron OR fluid-resistant gown for prolonged AGP."],
      ["Surgical — extractions, implants, periodontal surgery", "Sterile single-use surgical gloves (consider double-gloving).", "FFP2 / FFP3 respirator (fit-tested).", "Full-face visor + side-shielded glasses.", "Sterile surgical gown + plastic apron + head cover."],
      ["Reprocessing — LDU dirty side", "Heavy-duty puncture-resistant household-type gloves.", "Type IIR surgical mask.", "Full visor.", "Plastic apron + tunic. Long sleeves rolled down or use sleeve protectors."],
      ["Reprocessing — LDU clean side", "Single-use nitrile.", "Type IIR (if handling unwrapped instruments).", "Glasses sufficient.", "Tunic."],
    ],
    notes: [
      "Respirators (FFP2 / FFP3) require fit-testing for each wearer to the specific make / model. Re-test on facial change, weight change, dental work or every 2 years (HSE INDG479).",
      "Type IIR mask = fluid-resistant surgical mask (BS EN 14683 Type IIR). Type IIR does NOT protect against airborne droplet nuclei — use a respirator for AGPs.",
      "Doff PPE in correct order: gloves → apron / gown → eye protection → mask. Hand hygiene after each step.",
    ],
  },
];
