/**
 * Default Decontamination & IPC master templates.
 *
 * Imported from Pil Dental Practice's polished SOP set (HTM 01-05 / SDCEP /
 * MHRA aligned). 17 SOPs from the PDF + 2 placeholders for Amalgam Waste and
 * Decontamination Equipment Fault Reporting.
 *
 * One markdown body per template. The renderer in MasterTemplateLibrary
 * understands #/##/### headings, - / * / 1. lists, **bold**, _italic_,
 * `inline code`, and > blockquote. No tables — values are laid out as
 * bold-prefixed lines or bullet lists.
 */

const REFS_HTM = "HTM 01-05 Decontamination in primary care dental practices (best practice)";
const REFS_SDCEP = "SDCEP Decontamination Into Practice";
const REFS_MHRA = "MHRA Device Bulletin DB 2006(04 + 05)";
const REFS_BS_13060 = "BS EN 13060";
const REFS_BS_15883 = "BS EN ISO 15883";

export const DECON_MASTER_TEMPLATES = [
  /* ── 01 Instrument Decontamination SOP ──────────────────────────────── */
  {
    title: "Instrument Decontamination SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: null,
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "SDCEP", "MHRA Bulletin 18"],
    body: `# Instrument Decontamination SOP

The full reprocessing cycle for reusable dental instruments — from chairside transport through cleaning, inspection, sterilisation, packaging and storage — written to meet HTM 01-05 best-practice standards in a UK general dental practice.

**Applies to:** All staff handling reusable dental instruments
**Frequency:** Every clinical session; reviewed annually
**Lead:** Infection Prevention & Control Lead
**Evidence:** Decontamination log, washer cycle log, autoclave cycle log, batch records, traceability
**Standards:** HTM 01-05 (best practice), SDCEP IPC guidance, MHRA Bulletin 18

> Best-practice standard. Decontamination must follow a one-way "dirty to clean" flow. Manual cleaning is used only where a washer-disinfector cannot be used or as pre-cleaning. Sterilisation is the final stage and only valid on cleaned instruments.

## 1. Roles & responsibilities

- **IPC Lead.** Owns this SOP, trains staff, monitors compliance, reviews logs weekly.
- **Decontamination Operator.** Trained nurse / assistant who carries out the cycle. Wears full PPE. Signs the daily log.
- **Clinical Lead.** Investigates any failed cycle, near miss or sterilisation failure. Authorises return to use.
- **All clinical staff.** Transport contaminated instruments safely, avoid mixing dirty and clean, report any concerns.

## 2. The decontamination cycle — eight stages

1. **Acquisition.** At point of use, place instruments in a rigid leak-proof transport container with a fitted lid. Keep moist with an enzymatic spray or damp gauze to prevent bioburden drying on.
2. **Transport.** Move the closed container along the agreed dirty route to the decontamination room. Never carry instruments uncovered through clinical areas.
3. **Cleaning.** Wash in a validated washer-disinfector (preferred) at a thermal disinfection cycle reaching at least 90 °C for 1 minute, or 80 °C for 10 minutes. Use an ultrasonic bath beforehand for jointed or heavily soiled items. See manual cleaning SOP only as a last resort.
4. **Inspection.** Under task lighting and an illuminated magnifier, check every instrument for residual debris, damage, corrosion or wear. Reject and reprocess or discard as appropriate.
5. **Packaging.** Pouch each instrument or set in a sealed, dated, validated sterilisation pouch with internal and external chemical indicators. Pouches must not be overfilled or pierced by sharp tips.
6. **Sterilisation.** Load the autoclave correctly. Run a Type B (vacuum) cycle for pouched instruments — 134 °C for 3 minutes at the plateau. Confirm successful cycle from the printout and chemical indicators.
7. **Storage.** Store pouched instruments in a clean, dry, closed cupboard away from sinks, splash zones and direct sunlight. Stock-rotate by date. Use within the practice's defined shelf life (commonly 60 days).
8. **Traceability.** Log every cycle: date, autoclave ID, cycle number, operator, items processed, patient where applicable. Retain records for the period set in the practice's records-retention policy.

## 3. Daily checks & cycle standards

**Start-of-day checks:**
- **Washer-disinfector** — door seal, spray arms free, salt & rinse-aid topped up, daily self-test pass
- **Ultrasonic bath** — fresh solution at recommended dilution, water change noted, foil ablation test weekly
- **Autoclave** — water reservoir (sterile / RO only), printer paper, daily cycle pass, B&D test for Type B
- **RO / sterile water supply** — conductivity within range; filters in date
- **Decontamination room** — clean, dry, dirty-to-clean flow uncluttered, PPE stock available

**Cycle parameters:**
- _Thermal disinfection_ — 90 °C for 1 minute, or 80 °C for 10 minutes. Cycle printout retained. A0 value ≥ 600 where measured.
- _Steam sterilisation_ — Type B (vacuum) for pouched / lumened items. Type N for unwrapped, used immediately. 134 °C, 3 min hold, dry cycle complete. Bowie-Dick & helix tests daily on Type B.

## 4. Personal protective equipment

- Disposable apron or fluid-repellent gown.
- Heavy-duty (household / nitrile) gloves for the dirty side; clean nitrile for inspection & packaging.
- Eye protection — visor or goggles.
- FRSM (fluid-resistant surgical mask) where splashing is a risk.
- Closed-toe footwear; long hair tied back; no rings or wristwatches.

> Critical reminder. Never use household detergents, abrasive sponges or bleach on instruments. They damage surfaces, leave residue and invalidate manufacturer warranties. Use only validated enzymatic / instrument detergents within their working dilution and contact time.

## 5. Cycle failure pathway

1. **Identify the failure.** Failed indicator strip, missed parameter on the printout, B&D test fail, visible debris after cleaning, damaged pouch, wet load, or cycle aborted by the machine.
2. **Quarantine the load.** Place all items in a labelled "DO NOT USE" tray. Record the cycle number, time, operator and observed failure on the decontamination log.
3. **Escalate.** Notify the IPC Lead immediately. Contact the equipment service engineer where machine fault is suspected. Do not run further loads on the affected machine until cleared.
4. **Reprocess once cleared.** Once root cause is identified and the equipment cleared, reprocess the load from the cleaning stage. Document the second-cycle pass before items return to clinical use.
5. **Patient-safety review.** If any failed-load instruments have already reached a patient, complete a significant-event analysis and follow the practice's duty-of-candour and patient-notification process.

## 6. Monthly audit prompts

- Daily, weekly and quarterly test logs complete and signed.
- Decontamination room flow remains "dirty to clean" — no reverse flow observed.
- Autoclave validation, service and pressure-vessel insurance in date.
- PPE, detergent and indicator stock all in date.
- Washer-disinfector service in date; A0 / thermal data on file.
- Staff training records for all decontamination operators up to date.

---

_References: ${REFS_HTM}; ${REFS_SDCEP}; ${REFS_MHRA} & Top Tips for Sterile Services; CQC IPC inspection KLOE; manufacturer instructions for the practice's washer-disinfector, ultrasonic bath and autoclave._`,
  },

  /* ── 02 Instrument Journey & Traceability SOP ───────────────────────── */
  {
    title: "Instrument Journey & Traceability SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: null,
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "MHRA traceability"],
    body: `# Instrument Journey & Traceability SOP

Tracking each pack of reusable instruments through the full decontamination journey, with patient-level traceability where applicable.

**Applies to:** All reusable instrument packs used in clinical treatment
**Frequency:** Every cycle; logs reviewed weekly by IPC Lead
**Evidence:** Cycle logs, batch identifiers, patient record entries
**Standards:** HTM 01-05 best practice, MHRA traceability principles

> Best-practice traceability links each sterilised pack to the cycle it was processed in, and (for invasive procedures) to the patient who received it.

## 1. What must be traceable

- Operator who processed the load
- Date, time, autoclave ID and cycle number
- Washer-disinfector cycle number where used
- Pack contents (description or set name)
- Result of cycle (pass / fail) and indicator confirmation
- Patient identifier for invasive procedures (surgical extractions, implants, periradicular surgery)

## 2. How the journey is recorded

1. **Label every pouch.** Date of sterilisation, operator initials, expiry / use-by date, autoclave ID and cycle number — printed by integrated label printer or written legibly.
2. **Record cycle data.** Retain the autoclave printout, sticker or digital log for every cycle. Cross-reference cycle number with the daily decontamination log.
3. **Patient-level link.** For invasive procedures, place the pack label or barcode in the patient record. For routine reusable kits, batch-level traceability is acceptable best practice.
4. **Failed cycle.** Quarantine the load and record the failure on the log with the cycle number, observed reason, escalation and outcome. See Steriliser Testing & Load Release SOP.

## 3. Retention & audit

- **Cycle logs & autoclave printouts** — minimum 2 years; longer if linked to a patient record.
- **Patient-linked pack labels** — held in patient record per records-retention policy.
- **Validation, service & QA reports** — lifetime of the equipment.
- **Failed-cycle / incident records** — indefinitely; reviewed at significant-event meetings.

---

_References: HTM 01-05 (best practice traceability); MHRA medical-device guidance; CQC IPC inspection KLOE; GDC record-keeping standards._`,
  },

  /* ── 03 Manual Cleaning SOP ─────────────────────────────────────────── */
  {
    title: "Manual Cleaning SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "manualCleaning",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "Manufacturer IFU"],
    body: `# Manual Cleaning SOP

When and how to clean instruments by hand — used only where a washer-disinfector cannot be used or as pre-cleaning for heavily soiled items.

**Applies to:** All staff carrying out manual cleaning of reusable instruments
**Frequency:** Each session where manual cleaning is required
**Evidence:** Manual cleaning log, detergent batch / dilution record
**Standards:** HTM 01-05 essential quality requirements, manufacturer IFU

> Use a washer-disinfector wherever possible. Manual cleaning is the least reproducible step and should only be used when a WD cannot be used (e.g. handpieces requiring lubrication, manufacturer contraindication) or as pre-cleaning for set bioburden.

## 1. Setting up the sink

- Dedicated dirty-side sink only — never a hand-wash basin.
- Two-sink system where possible: wash, then rinse with RO / softened water.
- Water 30–35 °C — too hot will coagulate protein, too cold reduces detergent action.
- Enzymatic instrument detergent at manufacturer's working dilution and contact time.
- Long-handled soft brush per instrument set. Replace brushes weekly or earlier if frayed.

## 2. The method

1. **Fully submerge.** Place open hinged instruments under the water surface to prevent aerosols. Disassemble where the manufacturer allows.
2. **Brush below the waterline.** Brush all surfaces, hinges, serrations and lumens. Aerosol-generating actions (above the waterline) are not allowed.
3. **Rinse.** Rinse thoroughly with RO / softened water to remove all detergent residue.
4. **Inspect.** Under task lighting and illuminated magnifier. Repeat the wash if any debris is visible.
5. **Dry.** Lint-free wipe or medical-grade compressed air. Move to packaging and sterilisation promptly — wet instruments will fail the autoclave cycle.

## 3. What not to do

- No household detergents, scouring pads or bleach.
- No splashing or above-waterline scrubbing.
- No reuse of brushes for multiple sessions without disinfection.
- No mixing different metals (carbon steel and stainless) in the same bath.

## 4. PPE for manual cleaning

- Fluid-repellent gown or apron
- Heavy-duty household / nitrile gloves
- Eye protection — full-face visor preferred
- Fluid-resistant surgical mask

---

_References: HTM 01-05; SDCEP Decontamination Into Practice; manufacturer Instructions for Use for each instrument and detergent._`,
  },

  /* ── 04 Ultrasonic Bath SOP ─────────────────────────────────────────── */
  {
    title: "Ultrasonic Bath SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "ultrasonicBath",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "Manufacturer IFU"],
    body: `# Ultrasonic Bath SOP

Use and daily testing of the ultrasonic bath — for pre-cleaning of jointed, serrated or heavily soiled instruments before the washer-disinfector or autoclave.

**Applies to:** All decontamination operators
**Frequency:** Per use; foil ablation test weekly; deep-clean weekly
**Evidence:** Ultrasonic bath log, weekly foil-test result, service record
**Standards:** HTM 01-05, manufacturer IFU

> The bath supplements, not replaces, the washer-disinfector. It is most useful for jointed instruments, burs, files and matrices where ultrasound cavitation reaches surfaces a wash cycle would miss.

## 1. Daily set-up

1. **Fill.** Fresh enzymatic detergent at manufacturer's dilution, filled to the marked line.
2. **Degas.** Run an empty cycle (5 minutes) before first use of the day. Dissolved air reduces cavitation.
3. **Load.** Open hinged instruments. Use the basket — instruments must not touch the tank base or each other.
4. **Run.** Cycle time per manufacturer (typically 3–6 minutes). Lid closed throughout to contain aerosols.
5. **Rinse.** Rinse loaded instruments with RO water before transfer to the washer-disinfector or packaging.

## 2. Weekly foil ablation test

- Aluminium foil strip suspended in the tank.
- Run a standard cycle.
- Inspect: even pitting / perforation across the strip confirms uniform cavitation.
- If pattern is uneven or no pitting visible — quarantine the bath, contact service engineer.

## 3. Solution change

- Change at least every clinical session, or sooner if visibly soiled.
- Drain through the dedicated outlet — never through a clinical sink.
- Wipe tank with neutral detergent; do not use abrasives.

---

_References: HTM 01-05; SDCEP IPC guidance; manufacturer IFU for the specific ultrasonic bath model._`,
  },

  /* ── 05 Washer-Disinfector SOP ──────────────────────────────────────── */
  {
    title: "Washer-Disinfector SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "washerDisinfector",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "BS EN ISO 15883"],
    body: `# Washer-Disinfector SOP

Daily operation, loading, cycle release and routine testing of the washer-disinfector — the preferred method for cleaning and thermal disinfection of reusable dental instruments.

**Applies to:** All trained decontamination operators
**Frequency:** Every cycle; daily, weekly, quarterly and annual tests
**Evidence:** WD cycle logs, daily test records, validation reports
**Standards:** HTM 01-05 best practice, BS EN ISO 15883, manufacturer IFU

> The washer-disinfector is the primary cleaning method. A valid thermal disinfection cycle reaches at least 90 °C for 1 min (or 80 °C for 10 min), giving A0 ≥ 600 and removing the variability of hand cleaning.

## 1. Daily start-up

- Detergent, neutraliser and rinse-aid topped up.
- Spray arms free to rotate; nozzles clear.
- Filter / strainer cleaned.
- Door seal clean and undamaged.
- Daily self-test run and recorded.

## 2. Loading

1. **Open hinges, dismantle.** Where the manufacturer allows. Lumens must face downwards toward the spray arm or be connected to lumen attachments.
2. **Do not stack.** Instruments must not shadow each other. The cycle is only valid if water can reach every surface.
3. **Load weight.** Stay within the manufacturer's stated maximum load.
4. **Close and start.** Use the validated thermal disinfection cycle. Do not interrupt mid-cycle.

## 3. Cycle release

- Confirm the printout / display shows the cycle reached the required temperature and time.
- A0 value (where displayed) ≥ 600 for thermal disinfection.
- Inspect a sample of instruments under magnification.
- **If pass:** transfer to inspection & packaging.
- **If fail:** quarantine load, log the failure, see Steriliser Testing & Load Release SOP.

## 4. Test & service schedule

- **Daily** (operator) — self-test, spray arm check, filter check, door seal, A0 confirmation per cycle.
- **Weekly** (operator / IPC Lead) — cleaning efficacy (soil test where used), automatic control test review.
- **Quarterly** (service engineer) — engineer service per contract.
- **Annually** (authorised engineer) — revalidation per ISO 15883.

---

_References: ${REFS_HTM}; ${REFS_BS_15883}; manufacturer IFU._`,
  },

  /* ── 06 Autoclave Operation SOP ─────────────────────────────────────── */
  {
    title: "Autoclave Operation SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "autoclave",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "BS EN 13060"],
    body: `# Autoclave Operation SOP

Daily operation, loading and routine testing of the steam steriliser — the final stage of the decontamination cycle, valid only on clean instruments.

**Applies to:** All trained decontamination operators
**Frequency:** Every cycle; daily, weekly and annual tests
**Evidence:** Autoclave cycle logs, printouts, daily test records, validation reports
**Standards:** HTM 01-05 best practice, BS EN 13060, manufacturer IFU

> Steam sterilisation works on clean instruments only. Bioburden, residue or moisture in pouches will cause cycle failure — and a passed printout is not a guarantee of sterility if the load was not properly cleaned and dried beforehand.

## 1. Choosing the cycle type

- **Type N** — solid, unwrapped, used immediately. 134 °C, 3 min hold.
- **Type B (vacuum)** — pouched, hollow or lumened instruments. 134 °C, 3 min hold, dry phase.
- **Type S** — specific manufacturer-defined items only. Parameters as manufacturer states.

## 2. Loading

- Pouches placed paper-side up, not overlapping.
- Hinged instruments open.
- Lumens drained and oriented to allow steam penetration.
- Within the manufacturer's stated maximum load.
- Trays not stacked unless designed to be.

## 3. Daily tests

- **Daily housekeeping** (all cycles) — reservoir refilled with sterile / RO water, printer paper, door seal.
- **Bowie-Dick / helix test** (Type B / S only) — confirms air removal and steam penetration.
- **Automatic Control Test (ACT)** (all cycles) — cycle parameters within tolerance.

## 4. Cycle release

1. **Check printout.** Confirm full cycle reached temperature, hold time and dry stage.
2. **Indicators.** Internal & external indicator strips show pass colour. Helix / B&D test (if run) passed.
3. **Pouches dry & intact.** Wet pouches are a wet-load failure — quarantine and reprocess.
4. **Log the cycle.** Date, cycle number, operator, items processed, outcome.

## 5. Service & validation

- Annual revalidation by an authorised person.
- Pressure-vessel insurance inspection in date.
- Service contract per manufacturer (typically 6-monthly or annual).
- Records held with this SOP.

---

_References: ${REFS_HTM}; ${REFS_BS_13060}; ${REFS_MHRA}; manufacturer IFU._`,
  },

  /* ── 07 Steriliser Testing & Load Release SOP ───────────────────────── */
  {
    title: "Steriliser Testing & Load Release SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "autoclave",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "BS EN 13060", "BS EN 285"],
    body: `# Steriliser Testing & Load Release SOP

The tests required before each clinical session and after each cycle, and the criteria for releasing a load for clinical use or quarantining it.

**Applies to:** All decontamination operators and the IPC Lead
**Frequency:** Daily, weekly, quarterly and annually
**Evidence:** Test logs, printouts, B&D / helix records, validation reports
**Standards:** HTM 01-05, BS EN 13060, BS EN 285 (where applicable)

## 1. Daily tests before clinical use

- **Automatic Control Test (ACT)** — cycle reached set temperature, hold time and dry phase within tolerance.
- **Bowie-Dick / helix (Type B)** — indicator colour change uniform; no air pocket pattern.
- **Steam penetration (helix)** — internal indicator confirms full penetration of lumen.
- **Visual / housekeeping** — door seal, reservoir, printer paper, indicator stock.

## 2. Per-cycle load release

1. **Printout / display review.** Full cycle completion, correct parameters, no fault codes.
2. **Indicators.** Internal & external chemical indicators all show pass colour.
3. **Pouches dry & intact.** No wetness, no breaches in the seal.
4. **Sign the log.** Operator signs / initials the load-release entry. Released loads move to clean storage.

## 3. When to quarantine

- Failed daily test (ACT, B&D or helix).
- Cycle aborted by the machine.
- Indicator strip not changed or showing partial pass.
- Wet load.
- Pouch breached, missing label or unclear cycle traceability.

## 4. Quarantine pathway

1. **Stop and label.** Mark all instruments "DO NOT USE", remove from clean storage.
2. **Escalate.** Notify IPC Lead. Contact service engineer if equipment fault is suspected.
3. **Root cause & clearance.** Identify the cause, log it, run repeat ACT / B&D where applicable. Machine cleared only when consecutive successful tests are recorded.
4. **Reprocess.** Reprocess from the cleaning stage. Document second-cycle pass.
5. **Patient-safety review.** If any quarantined load reached a patient, trigger significant-event analysis & duty of candour.

---

_References: HTM 01-05; BS EN 13060; MHRA DB 2006(05); manufacturer IFU; CQC IPC inspection._`,
  },

  /* ── 08 Instrument Packaging & Storage SOP ──────────────────────────── */
  {
    title: "Instrument Packaging & Storage SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: "instrumentsPouched",
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "BS EN 868"],
    body: `# Instrument Packaging & Storage SOP

How instruments are pouched, labelled and stored after sterilisation to maintain the sterile state until point of use.

**Applies to:** All decontamination operators
**Frequency:** Every cycle
**Evidence:** Pouch labelling consistent with cycle log
**Standards:** HTM 01-05 best practice, BS EN 868

## 1. Pouch selection

- Sterilisation pouches that include internal & external chemical indicators.
- Sized so the instrument occupies no more than ~75% of the pouch.
- Sharp instruments protected by tip protectors before pouching.
- Heat-seal preferred over self-seal where the practice has a sealer.

## 2. Labelling

- **Date of sterilisation** — date the cycle was run.
- **Use-by / expiry date** — practice-defined; commonly 60 days for pouched instruments stored in closed cupboards.
- **Autoclave ID & cycle number** — for traceability.
- **Operator initials** — who processed the load.
- **Pack contents** — for sets / kits, the set name.

## 3. Storage

- Clean, dry, closed cupboard or drawer.
- Away from sinks, splash zones, direct sunlight and radiators.
- Stock-rotated by use-by date — oldest at the front.
- Not stored in clinical surgery cupboards used during patient treatment unless in sealed pouches.

## 4. Out-of-date / damaged pouches

- Pouches past their use-by date — return to the decontamination room for reprocessing.
- Visibly damaged, wet or breached pouches — the contents are non-sterile; reprocess from cleaning.
- Pouches dropped on the floor — assume breached unless visibly intact and immediately reprocessed.

---

_References: HTM 01-05; BS EN 868; manufacturer IFU for pouches and heat-sealer._`,
  },

  /* ── 09 Surgery Turnaround SOP ──────────────────────────────────────── */
  {
    title: "Surgery Turnaround SOP",
    type: "sop",
    category: "cleaning",
    requiredFlag: null,
    linkedAuditType: "surgery_turnaround",
    references: ["HTM 01-05", "SDCEP IPC"],
    body: `# Surgery Turnaround SOP

What happens chairside between patients — zoning, surface decontamination, waterline flushing, instrument transfer and chair preparation.

**Applies to:** All clinical staff
**Frequency:** After every patient
**Evidence:** Surgery turnaround log (where used), product use records
**Standards:** HTM 01-05, SDCEP IPC guidance, manufacturer IFU for surface products

## 1. Zoning

- **Clinical contact zone** — surfaces touched during treatment: dental chair, light handles, control panels, suction, x-ray sensor, tray, instruments.
- **Splash zone** — within ~1.5 m of the patient mouth.
- **Outside zone** — surfaces beyond the splash zone; cleaned at the end of each session.

## 2. Between-patient sequence

1. **Remove waste.** Used cups, bibs, tray covers, single-use items into appropriate clinical waste stream.
2. **Transfer instruments.** Reusable instruments into the rigid lidded transport container, kept moist. Move to decontamination room via the dirty route.
3. **Flush waterlines.** Flush each handpiece line for 20–30 seconds (or per DUWL SOP). See DUWL Management SOP.
4. **Wipe down all clinical contact and splash zone surfaces.** Use a single-use disposable wipe with a validated disinfectant (e.g. alcohol <70% or chlorhexidine-based as per practice product). Follow contact time on the label.
5. **Re-set the surgery.** Fresh tray cover, bib, cup, suction tips, single-use items. New PPE for staff. Hand hygiene before the next patient is brought in.

## 3. End-of-session clean

- All clinical contact and splash zones disinfected.
- Outside zone (floors, skirting, low-touch surfaces) cleaned by domestic / environmental routine.
- Suction lines flushed with recommended cleaner.
- Dental chair cover and headrest disinfected.
- Light handles and control panels disinfected.

## 4. Surface product notes

- Use only products validated for dental clinical surfaces and within their stated contact time.
- Follow the manufacturer's instructions for dilution, dwell time and rinse requirements.
- Wipes are single-use only — never re-dipped or re-used between zones.

---

_References: HTM 01-05; SDCEP IPC; manufacturer IFU for surface disinfectants used._`,
  },

  /* ── 10 Environmental Cleaning SOP ──────────────────────────────────── */
  {
    title: "Environmental Cleaning SOP",
    type: "sop",
    category: "cleaning",
    requiredFlag: null,
    linkedAuditType: "environmental_cleaning",
    references: ["NHS Cleaning Standards 2025", "HTM 01-05"],
    body: `# Environmental Cleaning SOP

Routine cleaning of clinical, public and non-clinical areas — daily, weekly and periodic — to maintain a safe, hygienic practice environment.

**Applies to:** All cleaning & clinical staff
**Frequency:** Daily, weekly, monthly, quarterly
**Evidence:** Cleaning schedule sign-off
**Standards:** NHS National Standards of Healthcare Cleanliness 2025; HTM 01-05

## 1. Daily cleaning — frequency & method

- **Surgery clinical contact zones** — between every patient (see Surgery Turnaround SOP).
- **Surgery floor** — end of session, neutral detergent / clinical-grade cleaner.
- **Decontamination room** — end of session, full clean, dirty-to-clean flow.
- **Toilets & hand-wash basins** — twice daily; replenish soap, towels, gel.
- **Reception & waiting area** — daily, desks, chairs, door handles, point-of-touch.

## 2. Weekly & periodic

- **Weekly** — low-level surfaces, skirting boards, behind chairs, cupboard exteriors.
- **Monthly** — high-level surfaces, light fittings, vents, ceiling tiles inspected.
- **Quarterly** — deep clean of decontamination room and one surgery in rotation.
- **Annually** — deep clean of all surgeries; carpet / soft furnishing review.

## 3. Colour-coded cloths

- **Red** — toilets and washroom floors.
- **Yellow** — washroom sinks and basins.
- **Blue** — general lower-risk areas (reception, offices, corridors).
- **Green** — kitchen and catering areas.

## 4. Cleaning products

- Use only products on the practice approved list.
- Stored separately from food, medicines and patient items.
- COSHH assessment held for each product.
- Decanted bottles labelled with product and dilution.

---

_References: NHS National Standards of Healthcare Cleanliness 2025; HTM 01-05; COSHH Regulations 2002._`,
  },

  /* ── 11 Hand Hygiene SOP ────────────────────────────────────────────── */
  {
    title: "Hand Hygiene SOP",
    type: "sop",
    category: "hand_hygiene",
    requiredFlag: null,
    linkedAuditType: "hand_hygiene",
    references: ["WHO Hand Hygiene Guidelines", "HTM 01-05"],
    body: `# Hand Hygiene SOP

When and how to perform hand hygiene — the single most important infection prevention measure in dental practice.

**Applies to:** All staff and visitors
**Frequency:** Continuous, throughout the day
**Evidence:** Annual hand hygiene audit, training records
**Standards:** WHO Five Moments for Hand Hygiene; HTM 01-05

## 1. The five moments

1. **Before patient contact.** Including before donning gloves.
2. **Before clean / aseptic procedure.** Even if hands were washed seconds earlier and then touched a non-clean surface.
3. **After body fluid exposure risk.** Even when gloves were worn — hands must be cleaned after glove removal.
4. **After patient contact.** After every patient, every time.
5. **After contact with patient surroundings.** The dental chair, instruments, charts, screen.

## 2. Method — 6-step technique (WHO)

- Palm to palm.
- Right palm over left dorsum, then swap.
- Palm to palm, fingers interlaced.
- Backs of fingers to opposing palms, fingers interlocked.
- Rotational rubbing of left thumb in right palm, then swap.
- Rotational rubbing, backwards & forwards with clasped fingers in palm.

> Wash for at least 20 seconds with liquid soap and water, rinse and dry with single-use paper towel. Use alcohol-based hand rub on visibly clean hands when hand washing is not immediately practical.

## 3. When soap and water is required

- Hands visibly soiled.
- After contact with body fluids (even when gloved).
- Before eating; after using the toilet.
- When caring for a patient with suspected/known C. difficile or norovirus (alcohol gel is not effective).

## 4. Skin care

- Hand cream (practice-supplied, fragrance-free) at breaks and end of shifts.
- Report skin breakdown / dermatitis to the IPC Lead — occupational health referral as required.
- No artificial nails, nail polish or stoned rings during clinical work.
- Watches and wrist jewellery off below the elbow before clinical work.

---

_References: WHO Guidelines on Hand Hygiene in Health Care; HTM 01-05; UK Health Security Agency guidance._`,
  },

  /* ── 12 PPE SOP ─────────────────────────────────────────────────────── */
  {
    title: "PPE SOP",
    type: "sop",
    category: "ppe",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["HSE COSHH", "HTM 01-05 §5", "UKHSA national IPC manual"],
    body: `# Personal Protective Equipment (PPE) SOP

Selection, use, donning and doffing of personal protective equipment for clinical, surgical and decontamination tasks.

**Applies to:** All clinical and decontamination staff
**Frequency:** Every clinical and decontamination task
**Evidence:** PPE stock log; risk assessments
**Standards:** HTM 01-05; UKHSA national IPC manual; manufacturer IFU

## 1. PPE by task

- **Routine examination, low-risk treatment** — gloves, FRSM, eye protection, tunic.
- **Aerosol-generating procedure** — gloves, FRSM (FFP3 where local risk assessment indicates), eye protection / visor, fluid-repellent gown.
- **Minor oral surgery** — sterile gloves, FRSM, visor, fluid-repellent gown.
- **Decontamination — dirty side** — heavy-duty gloves, visor, FRSM, fluid-repellent gown.
- **Decontamination — clean side** — clean nitrile gloves, FRSM, eye protection.
- **Environmental cleaning (non-clinical)** — general-purpose gloves, apron.

## 2. Donning order

1. **Hand hygiene.** Soap & water or alcohol gel as appropriate.
2. **Gown / apron.** Tied at the back.
3. **Mask / respirator.** Fit-tested FFP3 where indicated; FRSM otherwise.
4. **Eye protection / visor.** Disposable or cleaned reusable as appropriate.
5. **Gloves.** Last item donned. Pulled over cuffs of gown.

## 3. Doffing order

1. **Gloves first.** Peel off carefully — do not touch outer surface with bare skin.
2. **Hand hygiene.**
3. **Gown / apron.** Untie or break ties at the back; roll inwards.
4. **Eye protection.** Remove by the side arms or strap, not the front.
5. **Mask / respirator.** Remove last, by the straps only.
6. **Hand hygiene.** Final step before leaving the area.

## 4. Reusable vs single-use

- Gloves, masks, aprons — single-use, discarded after each patient.
- Visors — disposable preferred; reusable cleaned between patients per IFU.
- Tunics — changed daily and if visibly soiled; laundered at the practice or via approved laundry contract.

---

_References: UK national IPC manual; HTM 01-05; HSE COSHH; manufacturer IFU._`,
  },

  /* ── 13 Clinical Waste SOP ──────────────────────────────────────────── */
  {
    title: "Clinical Waste SOP",
    type: "sop",
    category: "waste",
    requiredFlag: "clinicalWasteTransferNotes",
    linkedAuditType: "sharps_waste",
    references: ["Hazardous Waste Regulations 2005", "HTM 07-01"],
    body: `# Clinical Waste SOP

Segregation, storage and disposal of clinical waste in line with the Hazardous Waste Regulations and the practice waste contract.

**Applies to:** All staff
**Frequency:** Continuous; weekly waste audit
**Evidence:** Waste consignment notes; bin segregation observation
**Standards:** Hazardous Waste Regulations 2005; HTM 07-01; CQC

## 1. Waste streams

- **Orange bag** — infectious clinical waste suitable for alternative treatment (autoclave / shred).
- **Yellow bag** — infectious waste contaminated with chemicals / medicines — incineration.
- **Tiger striped bag (yellow / black)** — offensive / hygiene waste — not infectious.
- **Yellow rigid sharps bin** — sharps not contaminated with medicines.
- **Purple rigid sharps bin** — sharps contaminated with cytotoxic / cytostatic medicines.
- **White amalgam pot** — amalgam waste, extracted teeth with amalgam, capsules.
- **Blue-lid sharps bin** — pharmaceuticals / unused medicines.
- **Black bag** (where used) — domestic / municipal waste only.

## 2. Filling & closing

- Bags filled no more than ⅔ full.
- Sharps bins closed temporarily between uses; sealed when at fill line; never resealed once final-locked.
- Each container labelled with date opened and date sealed, plus practice address.
- Stored in a lockable, signed waste store until collected.

## 3. Consignment notes

- Every collection must produce a signed consignment / waste transfer note.
- Retain for at least 3 years (hazardous waste).
- Quarterly summary returns where applicable.

## 4. Amalgam separator

- ISO 11143 compliant separator fitted to every chairside spittoon / suction unit using amalgam.
- Service / canister change per manufacturer IFU.
- Used canisters disposed of as hazardous dental waste via the waste contractor.
- Records of service and canister change retained.

---

_References: Hazardous Waste (England & Wales) Regulations 2005; HTM 07-01 Safe Management of Healthcare Waste; Environmental Permitting Regulations; Mercury (Information, etc.) Regulations._`,
  },

  /* ── 14 Sharps Management SOP ───────────────────────────────────────── */
  {
    title: "Sharps Management SOP",
    type: "sop",
    category: "sharps",
    requiredFlag: "sharpsDisposal",
    linkedAuditType: "sharps_waste",
    references: ["HSE Sharps Regs 2013", "BS EN ISO 23907"],
    body: `# Sharps Management SOP

Safe handling, transport and disposal of sharps to prevent needlestick injury and onward harm.

**Applies to:** All clinical staff
**Frequency:** Every clinical session
**Evidence:** Sharps bin labels; sharps risk assessment; incident records
**Standards:** Health and Safety (Sharp Instruments in Healthcare) Regulations 2013

## 1. Core rules

- Sharps containers within arm's reach at the point of use.
- Person using the sharp disposes of it — never delegated.
- Single-handed re-sheathing of dental local anaesthetic needles using an approved device or scoop technique only.
- Safer / sheathed devices used where available.
- Never overfill a sharps bin — sealed at the fill line.

## 2. The sharps container

- BS EN ISO 23907 compliant rigid container.
- Yellow lid for non-medicinal sharps; purple lid for cytotoxic.
- Assembled per manufacturer; assembly signed and dated on the label.
- Temporary closure between uses; final closure when at fill line.
- Stored secure, off the floor, in a labelled location.

## 3. Common causes of injury (and prevention)

- **Two-handed needle re-sheathing** → use approved sheath-aid or scoop technique.
- **Passing sharps hand-to-hand** → use a neutral zone (tray); no hand-to-hand.
- **Overfilled sharps bin** → seal at fill line; monitor at the start of each session.
- **Sharps left on tray after treatment** → disposal is the responsibility of the user — at the chair.

> If an injury occurs, see the Sharps Injury SOP — immediate action, reporting and post-exposure pathway.

---

_References: Health and Safety (Sharp Instruments in Healthcare) Regulations 2013; BS EN ISO 23907; HSE guidance; HTM 01-05._`,
  },

  /* ── 15 Sharps Injury SOP ───────────────────────────────────────────── */
  {
    title: "Sharps Injury SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["UKHSA post-exposure guidance", "RIDDOR 2013"],
    body: `# Sharps Injury SOP

Immediate action and post-exposure pathway for any needlestick or sharp-instrument injury sustained by staff or patients.

**Applies to:** All staff; visitors where applicable
**Frequency:** Immediately following any incident
**Evidence:** Incident form; occupational health correspondence; significant event note
**Standards:** UKHSA post-exposure guidance; PHE EPP guidance

> **Act within minutes.** Time-critical decisions about post-exposure prophylaxis depend on rapid notification and early occupational-health assessment.

## 1. Immediate action — at the sink

1. **Encourage bleeding.** Gently — do not suck the wound.
2. **Wash thoroughly.** Plenty of running water and soap. Do not scrub.
3. **Dry & cover.** Sterile waterproof dressing.
4. **For splashes to eyes / mouth.** Irrigate eyes with sterile saline or water (contact lenses out). Rinse mouth with water — do not swallow.

## 2. Notify & assess

1. **Tell the practice manager / IPC Lead immediately.**
2. **Identify the source patient.** Risk-assess for blood-borne virus transmission (HIV, hepatitis B & C). Ask the patient about consent for a blood test.
3. **Contact Occupational Health / A&E.** In hours: practice OH provider. Out of hours: nearest A&E. Take details of the incident, source patient (where known) and your own immunisation status.
4. **Consider PEP.** HIV PEP starter pack ideally within 1 hour, certainly within 72 hours. Hepatitis B booster / immunoglobulin per OH advice.

## 3. Documentation

- Incident report form completed within 24 hours.
- RIDDOR reportable if injury results in >7 days off work, or seroconversion to a notifiable BBV.
- Significant-event analysis logged.
- Follow-up reviews per OH advice (typically at 6, 12 and 24 weeks for BBV testing).

## 4. Confidentiality

Source patient information is confidential. Test results are not disclosed without consent. Records are kept securely and shared only with those who need to know.

---

_References: UKHSA Integrated guidelines on post-exposure prophylaxis; UK guidance on managing exposure-prone procedures; RIDDOR 2013; HSE._`,
  },

  /* ── 16 Blood / Body Fluid Exposure SOP ─────────────────────────────── */
  {
    title: "Blood / Body Fluid Exposure SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["UKHSA national IPC manual", "HTM 01-05", "COSHH"],
    body: `# Blood / Body Fluid Exposure SOP

How to manage splashes, spills and exposures to blood or other body fluids — staff exposure, patient spills, and surface decontamination.

**Applies to:** All staff
**Frequency:** Immediately following any spill or exposure
**Evidence:** Incident form; spill kit log
**Standards:** UKHSA national IPC manual; HTM 01-05; COSHH

## 1. Staff splash / exposure

1. **Eyes.** Irrigate with sterile saline or running water for at least 10 minutes. Contact lenses out before irrigation, replaced only after assessment.
2. **Mouth.** Rinse with water repeatedly — do not swallow.
3. **Intact skin.** Wash thoroughly with soap and water.
4. **Broken skin / sharps injury.** See Sharps Injury SOP.
5. **Notify and report.** Practice manager / IPC Lead. Occupational Health. Incident form.

## 2. Patient spill — surface decontamination

1. **Cordon off.** Don PPE (gloves, apron, eye protection, mask as needed).
2. **Contain.** Use the practice spill kit. Cover the spill with absorbent granules or paper towels and a chlorine-releasing agent at 10,000 ppm for blood and 1,000 ppm for other fluids per manufacturer.
3. **Leave the recommended contact time.** Per product label (usually 3–5 minutes).
4. **Remove and dispose.** All contaminated materials into orange clinical waste.
5. **Clean and disinfect.** Wash the area with neutral detergent, then disinfect with the chlorine-releasing agent at the appropriate dilution. Rinse if required by the product.
6. **Restock the spill kit.** Replace any used items. Log the spill and the replenishment.

## 3. Spill kit contents

- Disposable gloves and apron
- Eye protection / mask
- Chlorine-releasing granules or tablets (NaDCC)
- Absorbent paper / pads
- Scoop & scraper
- Orange clinical waste bag
- Hazard warning sign

## 4. Notes on chlorine-releasing agents

- Never use chlorine on urine — releases chlorine gas. Absorb first, then disinfect.
- Wear PPE and ensure ventilation when working with chlorine products.
- COSHH assessment held with this SOP.

---

_References: UK national IPC manual; HTM 01-05; COSHH; manufacturer IFU for the practice spill kit._`,
  },

  /* ── 17 Dental Unit Waterline Management SOP ────────────────────────── */
  {
    title: "Dental Unit Waterline Management SOP",
    type: "sop",
    category: "waterlines",
    requiredFlag: "waterlineManagement",
    linkedAuditType: "waterline",
    references: ["HTM 01-05", "HTM 04-01", "ADA / CDC guidance"],
    body: `# Dental Unit Waterline (DUWL) Management SOP

Daily, weekly and periodic management of dental unit waterlines to keep bacterial load below 200 CFU/ml and reduce the risk of biofilm-related infection.

**Applies to:** All clinical staff and decontamination operators
**Frequency:** Daily, weekly, quarterly; annual review
**Evidence:** DUWL log; water-quality test results; service records
**Standards:** HTM 01-05; HTM 04-01; ADA / CDC guidance

> Stagnant water and biofilm in dental unit waterlines are the main concern. Routine flushing, a validated biocide and periodic testing keep CFU below the recommended limit and reduce the risk to immunocompromised patients.

## 1. Daily routine

1. **Start-of-day flush.** Discharge all handpiece lines and the 3-in-1 for 2 minutes before the first patient.
2. **Between-patient flush.** Discharge each line for 20–30 seconds (or as per chair manufacturer IFU) into the spittoon, not into the patient's mouth.
3. **End-of-day shock or biocide.** Apply the validated biocide per the manufacturer's intermittent or continuous regimen.
4. **Drain & cap.** Drain self-contained reservoir bottles, leave open to dry overnight.

## 2. Weekly & periodic

- **Weekly** — deep biocide cycle per IFU.
- **Quarterly** — routine bacterial sampling (dip slide or laboratory) — target <200 CFU/ml; action >200 CFU/ml.
- **Annually** — review supply water source, filters and chair manufacturer recommendations.

## 3. Risk patients

- Severely immunocompromised patients — use sterile water for surgical procedures.
- Patients with recent radiotherapy to head & neck — discuss with IPC Lead.
- All surgical procedures (extractions, implants) — use sterile irrigant from a dedicated supply, not the chair waterline.

## 4. If CFU is above 200 / ml

1. Stop using the chair for routine treatment until cleared.
2. Shock dose the lines with biocide per IFU.
3. Re-test until two consecutive samples are within limit.
4. Review source water, biocide regimen, filter and reservoir condition.

## 5. Records

- Daily flush record (initial sign-off).
- Weekly biocide cycle record.
- Quarterly CFU test result & corrective actions.
- Annual service records and any equipment changes.

---

_References: HTM 01-05; HTM 04-01; CDC dental waterline guidance; chair manufacturer IFU; biocide product IFU._`,
  },

  /* ── 18 Amalgam Waste SOP (placeholder — not in PDF) ────────────────── */
  {
    title: "Amalgam Waste SOP",
    type: "sop",
    category: "waste",
    requiredFlag: "amalgamWaste",
    linkedAuditType: "sharps_waste",
    references: ["HTM 07-01", "Mercury (Information, etc.) Regulations"],
    body: `# Amalgam Waste SOP

_Placeholder — content to be authored. See Clinical Waste SOP §4 for the amalgam separator requirements that currently apply._

**Applies to:** All clinical and decontamination staff
**Frequency:** Continuous
**Evidence:** Amalgam separator service records, white-pot collection notes
**Standards:** HTM 07-01; Mercury Regulations`,
  },

  /* ── 19 Decontamination Equipment Fault Reporting SOP (placeholder) ─── */
  {
    title: "Decontamination Equipment Fault Reporting SOP",
    type: "sop",
    category: "decontamination",
    requiredFlag: null,
    linkedAuditType: "decontamination",
    references: ["HTM 01-05", "MHRA"],
    body: `# Decontamination Equipment Fault Reporting SOP

_Placeholder — content to be authored. The Instrument Decontamination SOP §5 (Cycle failure pathway) and the Steriliser Testing & Load Release SOP cover the operational response. This SOP will formalise root-cause analysis, MHRA reporting and engineer call-out criteria._

**Applies to:** All decontamination operators and the IPC Lead
**Frequency:** Per fault / failure event
**Evidence:** Fault log, engineer reports, MHRA correspondence
**Standards:** HTM 01-05; MHRA Yellow Card / device adverse incident reporting`,
  },
];

/* ── Radiography & IR(ME)R master templates ─────────────────────────── */

export const RADIOGRAPHY_MASTER_TEMPLATES =
[
  {
    packKey: "radiography_irmer",
    title: "Radiation Governance, Roles & Employer's Procedures",
    type: "sop",
    category: "governance",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["IRMER 2017", "IRR17", "GDC Standards", "CGDent / FGDP Selection Criteria", "CQC IR(ME)R guidance"],
    body: `# Radiation Governance, Roles & Employer's Procedures

**Owner:** Radiation Protection Supervisor / Practice Owner
**Review cycle:** Annual or after regulatory change
**Version:** 1.0 — Reviewed May 2026

IR(ME)R duties, employer's procedures, referrer / practitioner / operator roles, entitlement, training, and record keeping for all dental radiography within the practice.

## Purpose and scope

This protocol sets out the governance arrangements for dental radiography within the practice. It applies to all staff who request, justify, authorise, expose, process, evaluate, report, store or audit radiographs, including intraoral, panoramic, cephalometric and CBCT imaging where relevant.

## Required governance framework

- Maintain current written employer's procedures that reflect actual practice workflows and equipment.
- Keep an entitlement matrix identifying who may act as referrer, practitioner and operator for each exposure type.
- Confirm staff have appropriate training before entitlement and maintain evidence of continuing education.
- Define the Radiation Protection Supervisor, Radiation Protection Adviser and Medical Physics Expert arrangements.
- Keep records of equipment inventory, quality assurance, clinical image quality audit, incident review and corrective actions.

## Core roles — practice expectation

- **Employer.** Holds overall responsibility for written procedures, QA programme, training, entitlement and compliance.
- **Referrer.** Provides sufficient clinical information to allow justification of the exposure.
- **Practitioner.** Justifies the medical exposure and confirms expected benefit outweighs radiation risk.
- **Operator.** Carries out practical aspects such as patient identification, positioning, exposure, processing, evaluation or reporting according to entitlement.
- **RPS / RPA / MPE.** Support local rules, radiation protection advice, equipment testing, dose optimisation and incident escalation.

## Operating procedure

1. **Confirm scope.** List each x-ray unit, sensor, scanner and CBCT arrangement, including where images are taken or referred externally.
2. **Check entitlement.** Before any radiographic duty is performed, confirm the staff member is trained, entitled and working within their documented scope.
3. **Use written procedures.** Follow the current employer's procedures for patient identification, pregnancy enquiry where relevant, justification, optimisation, exposure, clinical evaluation, reporting and incident handling.
4. **Keep audit-ready records.** Record exposure details, clinical evaluation, quality grading, retake reason where applicable and any communication to the patient or referrer.
5. **Review governance.** Review procedures at least annually and after new equipment, incidents, inspection findings, staff role changes or regulatory updates.

## Minimum records

- Employer's procedures and local rules, with version control and review date.
- Entitlement records for referrers, practitioners and operators.
- Radiography training and CPD records.
- Equipment inventory, service reports and routine surveillance checks.
- QA audits, reject/repeat analysis and corrective action logs.
- Incident records, duty of candour notes where applicable, and escalation correspondence.

**Governance note.** This document must be reviewed alongside the practice's local rules, risk assessment, RPA / MPE advice and current IR(ME)R / IRR requirements. It does not replace site-specific radiation protection documentation.

_References: IRMER 2017 · IRR17 · GDC Standards · CGDent / FGDP Selection Criteria · CQC IR(ME)R guidance._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Radiography Local Rules SOP",
    type: "sop",
    category: "local_rules",
    requiredFlag: "localRulesRequired",
    linkedAuditType: "local_rules",
    references: ["IRMER 2017", "IRR17", "HSE guidance", "CGDent / FGDP Selection Criteria", "CQC IR(ME)R guidance"],
    body: `# Radiography Local Rules SOP

**Owner:** Radiation Protection Supervisor
**Review cycle:** Annually and after any equipment, room or staff change
**Version:** 1.0 — Reviewed May 2026

Site-specific local rules for ionising radiation — covering controlled areas, contingency arrangements, RPS / RPA contact, and how staff and patients are protected.

## Applies to

All staff in clinical areas where dental X-ray equipment is used.

## Evidence

Signed local rules document; staff acknowledgement record.

## Purpose and scope

Local rules are a legal requirement. Every employer using ionising radiation must have written local rules under IRR17, signed and acknowledged by all staff who work with or near the X-ray equipment.

## Required content

1. **Name of the radiation employer.**
2. **Identification of the controlled area(s).** Each X-ray room, the controlled area boundary, signage and access controls.
3. **Designated personnel.** Radiation Protection Supervisor (RPS), Radiation Protection Adviser (RPA), Medical Physics Expert (MPE), referrer / practitioner / operator entitlement.
4. **Working instructions.** Distance from primary beam, patient holding policy, pregnancy enquiry, dose optimisation.
5. **Contingency arrangements.** What to do if exposure continues, equipment fails, or a stuck-beam suspected. Stop, retreat, contact RPA, log incident.
6. **Dose investigation level.** Trigger for incident reporting and RPA consultation.

## Practical working instructions

- Operator stands at least 1.5 m from the patient and outside the primary beam, or behind a permanent protective barrier.
- Patient never held by staff during exposure. Use a film holder; if a parent / carer must support, provide PPE and instruction.
- Pregnancy enquiry made discreetly before any exposure; recorded in clinical notes.
- Lead apron / thyroid collar offered per current selection-criteria guidance.
- Audible / visual warning understood by all staff in the room.

## Operating procedure

1. Issue the signed local rules document to every member of staff who works in or accesses controlled areas.
2. Have each staff member read, ask any questions of the RPS, and sign to confirm understanding.
3. Re-acknowledge after any update to the rules, equipment, room layout, or designated personnel.
4. Keep the signed acknowledgement register with the controlled local rules master.
5. Review at least annually, and sooner after any change.

## Staff acknowledgement

All staff working in or accessing controlled areas must read these local rules, ask any questions of the RPS, and sign to confirm they understand them. Re-acknowledgement after any update.

_References: IRMER 2017 · IRR17 · HSE guidance · CGDent / FGDP Selection Criteria · CQC IR(ME)R guidance._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Radiography Equipment QA SOP",
    type: "sop",
    category: "qa",
    requiredFlag: "qaRecordsRequired",
    linkedAuditType: "equipment_qa",
    references: ["IRMER 2017", "IRR17", "CGDent / FGDP Guidance Notes", "Manufacturer IFU", "MPE recommendations"],
    body: `# Radiography Equipment QA SOP

**Owner:** Radiation Protection Supervisor
**Review cycle:** Daily, weekly, monthly, annual
**Version:** 1.0 — Reviewed May 2026

Daily, weekly and annual quality assurance for X-ray equipment, sensors and processing — to ensure consistent image quality and safe dose.

## Applies to

All radiography operators and RPS.

## Evidence

QA log; engineer service reports; annual MPE report.

## Daily checks

- Power on, warm-up cycle complete.
- Tube head movement smooth, locks engage, no drift.
- Control panel readouts within expected range.
- Sensor / phosphor plate visually inspected.
- Image-processing software / scanner functional.

## Weekly and monthly

- **Weekly.** Test exposure with QA phantom or step-wedge; sensor uniformity check.
- **Monthly.** Phosphor plate inspection for scratches / artefacts; sensor cable integrity.
- **Quarterly.** Image quality audit (cross-reference Image Quality Audit SOP).

## Annual

- Service by authorised engineer per manufacturer contract.
- Critical examination / acceptance testing by MPE after install or major service.
- Annual performance review (output, kVp accuracy, beam alignment, timer accuracy).
- Records retained for the life of the equipment.

## Operating procedure — if a QA test fails

1. **Stop clinical use.** Label the unit "DO NOT USE". Move patients to another unit where possible.
2. **Escalate.** Notify RPS and contact service engineer / RPA. Document the failure on the QA log.
3. **Investigate.** Engineer attendance, replacement or repair. Re-test before return to use.
4. **Return-to-use sign-off.** RPS confirms QA tests passed before clinical exposures resume.

_References: IRMER 2017 · IRR17 · CGDent / FGDP Guidance Notes · Manufacturer IFU · MPE recommendations._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Image Quality Audit SOP",
    type: "sop",
    category: "quality",
    requiredFlag: "imageQualityAuditRequired",
    linkedAuditType: "image_quality",
    references: ["IRMER 2017", "IRR17", "CGDent / FGDP Selection Criteria", "SDCEP Practice Support Manual", "CQC IR(ME)R guidance"],
    body: `# Image Quality Audit SOP

**Owner:** Radiation Protection Supervisor
**Review cycle:** Quarterly per operator and per unit
**Version:** 1.0 — Reviewed May 2026

Quarterly grading of clinical radiographs against agreed criteria, with corrective actions for unacceptable images.

## Applies to

All operators producing radiographs.

## Evidence

Audit log; reject / repeat analysis; CPD records.

## Grading system

- **A — Acceptable.** No errors of preparation, exposure, positioning, processing or handling. Target ≥ 70% (digital).
- **N — Not Acceptable.** Errors render the image diagnostically unacceptable. Target < 10% (digital).

Digital systems often use 2-grade (Acceptable / Not Acceptable). The practice uses the system stated in its current local procedures and records the result on each audit.

## Operating procedure — audit method

1. **Sample.** Minimum 50 images per operator per quarter (or all images if fewer taken).
2. **Grade.** RPS or a peer operator grades each image. Record reason for any Not Acceptable.
3. **Trend.** Plot quarterly results. Triggers: > 10% Not Acceptable or trend deterioration.
4. **Action.** Targeted retraining, CPD, equipment review or referral to RPA.

## Common reasons for rejection

- Positioning — cone-cut, elongation, foreshortening, missing apices.
- Exposure — too dark, too light, low contrast.
- Patient movement.
- Processing / sensor errors — artefacts, scratches.
- Anatomical region missed (e.g. periapical region cut off).

## Records

Audit record per quarter to include: operator, images sampled, grade A %, grade N %, trend, action plan, RPS and operator sign-off.

_References: IRMER 2017 · IRR17 · CGDent / FGDP Selection Criteria · SDCEP Practice Support Manual · CQC IR(ME)R guidance._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Operator Entitlement SOP",
    type: "sop",
    category: "irmer",
    requiredFlag: null,
    linkedAuditType: "operator_entitlement",
    references: ["IRMER 2017", "IRR17", "GDC Standards", "CGDent / FGDP Selection Criteria", "CQC IR(ME)R guidance"],
    body: `# Operator Entitlement SOP

**Owner:** Radiation Protection Supervisor / IR(ME)R Lead
**Review cycle:** On joining and reviewed annually or after role change
**Version:** 1.0 — Reviewed May 2026

Who is entitled to act as referrer, practitioner or operator under IR(ME)R, the evidence required and how entitlement is recorded.

## Applies to

All staff with any IR(ME)R role.

## Evidence

Entitlement matrix; training records; CPD.

## The three IR(ME)R roles

- **Referrer.** Provides clinical information justifying the request. Usually GDC-registered dentist; can be other clinicians by local protocol.
- **Practitioner.** Justifies the exposure — confirms benefit outweighs risk. Must have appropriate training and entitlement.
- **Operator.** Carries out any practical aspect — positioning, exposure, processing, evaluation, reporting. Trained and entitled for the specific tasks.

## Required evidence before entitlement

- Core dental qualification (where applicable) and GDC registration.
- Training appropriate to each role — IR(ME)R, dose optimisation, equipment specific.
- Where new to the practice — equipment-specific induction signed off by RPS.
- 5-year CPD per GDC Enhanced CPD — including ionising radiation for those involved in radiography.

## Entitlement matrix

The practice maintains a written entitlement matrix listing each individual, their roles (R / P / O), the exposure types they are entitled for, evidence on file, and review date.

## Operating procedure — if a member of staff acts outside their entitlement

1. **Stop the exposure.**
2. **Notify RPS.** Investigation, training gap analysis, re-entitlement plan.
3. **IR(ME)R notification.** Consider whether the exposure was "unintended" or "much greater than intended" — see Radiography Incident SOP.
4. **Document and learn.** Record the event, share learning at practice meeting, update entitlement matrix and training as required.
5. **Re-entitle only when evidence is complete** and signed off by RPS / IR(ME)R Lead.

_References: IRMER 2017 · IRR17 · GDC Standards · CGDent / FGDP Selection Criteria · CQC IR(ME)R guidance._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Radiation Risk Assessment Review SOP",
    type: "sop",
    category: "risk_assessment",
    requiredFlag: null,
    linkedAuditType: "risk_assessment",
    references: ["IRMER 2017", "IRR17", "HSE Approved Code of Practice", "CGDent / FGDP Selection Criteria", "RPA / MPE advice"],
    body: `# Radiation Risk Assessment Review SOP

**Owner:** Radiation Protection Supervisor / Practice Owner
**Review cycle:** Annual; after any change
**Version:** 1.0 — Reviewed May 2026

Annual review of the radiation risk assessment for each X-ray installation and the wider radiation safety arrangements.

## Applies to

RPS, RPA, Practice Owner.

## Evidence

Signed risk assessment; RPA correspondence.

## Scope

A radiation risk assessment is required under IRR17 before an X-ray installation is used, and must be reviewed periodically and after any change. This SOP describes the practice's annual review and the triggers for a sooner review.

## Areas covered

- Identification of hazards and people at risk (staff, patients, visitors, members of the public).
- Engineering controls — shielding, controlled-area boundaries, equipment safety features.
- Procedural controls — operator distance, patient-holding policy, pregnancy enquiry.
- Training and entitlement.
- Contingency arrangements and stuck-beam response.
- Dose monitoring where applicable.

## Triggers for an out-of-cycle review

- New X-ray unit, sensor or CBCT installation.
- Change to room use or layout.
- New staff member with radiography role.
- Incident or near-miss.
- Change in HSE / IR(ME)R / IRR guidance or local pathway.

## Operating procedure

1. **Schedule review.** RPS books the annual review and confirms RPA consultation where required.
2. **Walk the rooms.** Verify shielding, boundaries, signage, warning lights, contingency equipment.
3. **Review controls.** Confirm operator distance, patient-holding policy, pregnancy enquiry and dose optimisation remain effective.
4. **Document changes** since last review and any actions required, with owners and dates.
5. **Sign off** by RPS and Practice Owner; file with the controlled radiation set; share with all duty-holders.

## Annual review record

Date of review, year of review, reviewer (RPS), RPA consulted, changes since last review, actions required, sign-off by RPS and Practice Owner.

_References: IRMER 2017 · IRR17 (Reg 8 — Risk Assessment) · HSE Approved Code of Practice · CGDent / FGDP Selection Criteria · RPA / MPE advice._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Controlled Area Signage SOP",
    type: "sop",
    category: "safety",
    requiredFlag: "controlledAreas",
    linkedAuditType: "signage",
    references: ["IRMER 2017", "IRR17", "HSE ACOP", "Manufacturer IFU", "CGDent / FGDP Selection Criteria"],
    body: `# Controlled Area Signage SOP

**Owner:** Radiation Protection Supervisor
**Review cycle:** Continuous; review with local rules
**Version:** 1.0 — Reviewed May 2026

How controlled areas are designated, signposted and accessed so staff, patients and visitors understand and respect the boundary.

## Applies to

All staff working in or near controlled areas.

## Evidence

Photograph of installed signage; local rules document.

## What counts as a controlled area

Any space where dose rates may exceed the relevant levels in IRR17 during exposure — typically the X-ray room, including immediately adjacent areas where shielding does not give full attenuation.

## Signage requirements

- Trefoil radiation warning sign clearly visible at every entrance.
- Wording: "Controlled area — do not enter while X-rays are being taken" (or local equivalent).
- Audible / visual warning during exposure where required by local rules.
- Sign size and visibility appropriate to the door / entrance.
- Signs in good condition — not faded, peeling or obscured.

## Access control

- Only the patient and necessary attending staff in the controlled area during exposure.
- Door closed during exposure.
- Other patients and visitors directed away during X-ray sessions.
- Staff acting as operators positioned at least 1.5 m from the patient and outside the primary beam.

## Operating procedure

1. **Confirm boundary** of each controlled area in the radiation risk assessment and local rules.
2. **Install and maintain signage** at every entrance, with trefoil and required wording.
3. **Verify warning lights / audible alarms** are working at each session.
4. **Brief patients and visitors** at the door — door closed during exposure.
5. **Annual check** — RPS records signage in place, warning light working, door closes properly, signage legible.

## Annual check record

Date, reviewer, signage in place, warning light working, door closes properly, signage legible; sign-off by RPS and Practice Owner.

_References: IRMER 2017 · IRR17 (Reg 17 — Designation of areas) · HSE ACOP · Manufacturer IFU · CGDent / FGDP Selection Criteria._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Radiography Incident / SAUE Reporting SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: "incident",
    references: ["IRMER 2017", "IRR17", "CQC Reg 12", "HSE RIDDOR", "CGDent / FGDP Selection Criteria"],
    body: `# Radiography Incident / SAUE Reporting SOP

**Owner:** Radiation Protection Supervisor / IR(ME)R Lead
**Review cycle:** Immediately following any incident or suspicion of one
**Version:** 1.0 — Reviewed May 2026

How incidents involving ionising radiation are managed — accidental, unintended or significantly greater-than-intended exposures (SAUE).

## Applies to

All staff involved in radiography.

## Evidence

Incident form; RPA correspondence; statutory report (CQC, HSE) where required.

**Investigate quickly.** Some incidents are statutory reportable to CQC within strict timeframes. Ring the RPA the same day — don't wait until the next routine review.

## What counts as an incident

- **Unintended exposure.** Wrong patient, wrong tooth, wrong side, wrong projection.
- **Accidental exposure.** Staff or member of public exposed where they should not have been.
- **Equipment malfunction.** Stuck timer, continuous beam, run-on.
- **Significantly greater than intended (SAUE).** Exposure delivering a dose materially higher than planned — definition in IR(ME)R 2017 / 2024 amendment.
- **Near miss.** Something almost went wrong — same process, no exposure delivered.

## Operating procedure — immediate action

1. **Stop and secure.** Unplug or isolate the equipment if a fault is suspected. Label "DO NOT USE".
2. **Notify RPS / RPA.** Same day. RPA advises whether the incident meets the SAUE threshold.
3. **Document the facts.** Time, equipment, operator, intended vs delivered exposure, patient ID, witness, any equipment fault code.
4. **Inform the patient.** Per duty of candour where harm may have occurred.
5. **Statutory report.** SAUE to CQC within statutory timeframe; HSE if applicable; defence organisation as required.

## Investigation and learning

1. **Root cause.** Equipment, training, process, communication, fatigue, distraction.
2. **Action plan.** Each action owned, dated and tracked to completion.
3. **SEA / share learning.** Anonymised significant event at practice meeting; SOP update if required.
4. **Review.** Equipment cleared for return to use only after engineer / RPA / RPS sign-off.

_References: IRMER 2017 (& 2024 amendment — SAUE) · IRR17 · CQC Reg 12 · HSE RIDDOR · CGDent / FGDP Selection Criteria._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Equipment Maintenance Records SOP",
    type: "sop",
    category: "maintenance",
    requiredFlag: "maintenanceRecordsRequired",
    linkedAuditType: "equipment_maintenance",
    references: ["IRMER 2017", "IRR17", "HSE guidance", "Manufacturer IFU", "MHRA equipment management guidance"],
    body: `# Equipment Maintenance Records SOP

**Owner:** Radiation Protection Supervisor / Practice Manager
**Review cycle:** Continuous; reviewed annually
**Version:** 1.0 — Reviewed May 2026

How service, calibration and critical-examination records are kept for every piece of dental radiography equipment.

## Applies to

RPS; Practice Manager.

## Evidence

Equipment inventory; service contracts; engineer reports.

## Equipment inventory

Maintain a written inventory of every X-ray unit, intraoral sensor, panoramic / CBCT machine, scanner and processor. For each item record:

- Manufacturer, model, serial number.
- Location and ID label.
- Installation date.
- Service contract and contractor details.
- Critical examination / acceptance test report.
- Annual service / performance report.
- QA test history.

## Service schedule

- **Routine service** — per manufacturer (typically annual); responsible: service engineer.
- **Performance / output test** — annual or after major service; responsible: engineer / MPE.
- **Critical examination** — on install and after major change; responsible: MPE.
- **QA tests** — daily / weekly / monthly; responsible: operator / RPS.

## Operating procedure

1. **Maintain inventory.** Keep the equipment inventory current — add new items on install, remove on disposal.
2. **Book services.** Schedule routine services per manufacturer contract; arrange critical examination on install or after major change.
3. **File reports.** Engineer service reports, MPE acceptance and performance reports filed against each asset.
4. **Track QA tests.** Maintain QA log per unit for daily, weekly and monthly checks.
5. **Annual audit.** Review every asset against the prompts below; escalate any gap to RPS / Practice Owner.

## Record retention

- Equipment records kept for the lifetime of the equipment and at least 2 years after disposal.
- QA test logs kept for at least 2 years.
- SAUE / incident records kept indefinitely.

## Annual audit prompts

- Every piece of equipment listed in the inventory.
- Critical examination on file for each unit.
- Service contracts in date for each unit.
- QA test log complete for the previous 12 months.
- Any unit removed from service properly logged and equipment disposed of via authorised contractor.

_References: IRMER 2017 · IRR17 (employer's duties) · HSE guidance · Manufacturer IFU · MHRA equipment management guidance._
`
  },
  {
    packKey: "radiography_irmer",
    title: "IR(ME)R Employer's Procedures SOP",
    type: "sop",
    category: "irmer",
    requiredFlag: null,
    linkedAuditType: "operator_entitlement",
    references: ["IRMER 2017", "IRR17", "CQC IR(ME)R inspections", "GOV.UK Guidance to IR(ME)R", "CGDent / FGDP Selection Criteria"],
    body: `# IR(ME)R Employer's Procedures SOP

**Owner:** Employer / IR(ME)R Lead / Clinical Director / RPS
**Review cycle:** Annually or after regulation, equipment or staffing change
**Version:** 1.0 — Reviewed May 2026

How the practice creates, controls and reviews its written IR(ME)R employer's procedures — covering patient identification, justification, optimisation, clinical evaluation, accidental exposure, audit and training.

## Applies to

Employer, IR(ME)R Lead, Clinical Director, RPS.

## Evidence

Current employer's procedures, approval record, staff acknowledgement, entitlement register, audit records, version history.

IR(ME)R requires written employer's procedures. They sit alongside (but separate from) the radiation local rules under IRR17. They cover what the practice does when it carries out medical exposures — not just how the equipment is used safely.

## Required procedures (IR(ME)R schedule)

- Patient identification — checks before exposure.
- Entitlement of duty-holders (referrer / practitioner / operator).
- Justification of medical exposures.
- Optimisation — keeping dose ALARP whilst diagnostic.
- Clinical evaluation and reporting of every exposure.
- Pregnancy enquiry where biologically relevant.
- Accidental, unintended or significant accidental / unintended exposure (SAUE).
- Audit of compliance with procedures.
- Training records and ongoing CPD.
- Equipment inventory and link to QA / service records.

## Operating procedure — document control

1. **One controlled master.** Held by IR(ME)R Lead. Version-controlled. Old versions archived.
2. **Approval before release.** Signed off by Employer / Clinical Director. Date and version on every page.
3. **Staff acknowledgement.** Every duty-holder reads and signs the current version. Re-acknowledged after material updates.
4. **Review.** Annual minimum. Sooner after regulation change, new equipment, service or staff role change, or RPA / MPE advice.

## Linking procedures to practice activity

- Procedures link to the relevant site, equipment register, entitlement matrix and risk assessment.
- Each procedure names the duty-holder responsible and the audit method.
- CBCT-specific procedures held as a controlled appendix where the practice uses CBCT.

## Records

Approval & version control: approved by, version, approval date, next review, summary of changes since last version. Staff acknowledgement sample: name, role, signature & date. Sign-off by Employer / Clinical Director and IR(ME)R Lead.

_References: IRMER 2017 (& 2024 amendment) · IRR17 · CQC IR(ME)R inspections · GOV.UK Guidance to IR(ME)R · CGDent / FGDP Selection Criteria._
`
  },
  {
    packKey: "radiography_irmer",
    title: "Referrer, Practitioner & Operator Responsibilities SOP",
    type: "sop",
    category: "irmer",
    requiredFlag: null,
    linkedAuditType: "operator_entitlement",
    references: ["IRMER 2017", "IRR17", "CGDent / FGDP Selection Criteria", "SDCEP Practice Support Manual", "GDC Standards"],
    body: `# Referrer, Practitioner & Operator Responsibilities SOP

**Owner:** IR(ME)R Lead / RPS
**Review cycle:** Annually and after staff or service change
**Version:** 1.0 — Reviewed May 2026

The distinct IR(ME)R roles, what each duty-holder must do, and how the practice ensures every exposure is requested, justified and evaluated by the correct person.

## Applies to

All clinical and clinical-support staff with an IR(ME)R role.

## Evidence

Duty-holder register, entitlement records, referral and reporting audit.

## The three roles

- **Referrer.** Provides sufficient clinical information so the practitioner can decide whether the exposure is justified. Must be a registered healthcare professional acting within scope.
- **Practitioner.** Justifies each individual exposure — confirms expected benefit outweighs the radiation risk. Has the legal authority to authorise the exposure.
- **Operator.** Carries out any practical aspect — positioning, exposure, processing, evaluation or reporting — within the scope of their entitlement.

## Operating procedure — justification (the practitioner's test)

1. **Is the exposure necessary?** Is the clinical question one that radiography can answer?
2. **Is there a non-ionising alternative?** Clinical examination, transillumination, photography or MRI where appropriate.
3. **Is the exposure as low as reasonably practicable (ALARP)?** Right view, right size, right exposure factors.
4. **Is the result likely to change management?** If not — do not expose.

## Clinical evaluation

- Every exposure must have a clinical evaluation recorded.
- Findings recorded in the clinical record — incidental findings as well as the indication.
- If the operator is not entitled to evaluate (e.g. nurse operator), the evaluation must be done by a duty-holder who is.
- Reports / evaluations on CBCT and other complex imaging may require a specialist where the in-practice clinician is not entitled.

## Audit prompts

- Each exposure has a documented referral, justification and clinical evaluation.
- The same person is not acting outside their entitlement.
- Practitioner justification is recorded — not just assumed.
- Incidental findings handled and communicated to the patient where appropriate.

## Audit sample record

Period, sample size, % with referrer recorded, % with justification recorded, % with clinical evaluation, trend; sign-off by RPS and IR(ME)R Lead.

_References: IRMER 2017 (Reg 11 Justification, Reg 12 Optimisation, Reg 13 Clinical evaluation) · IRR17 · CGDent / FGDP Selection Criteria · SDCEP Practice Support Manual · GDC Standards._
`
  },
  {
    packKey: "radiography_irmer",
    title: "RPA / MPE Contact & Escalation SOP",
    type: "sop",
    category: "governance",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["IRMER 2017", "IRR17", "HSE Approved Code of Practice", "CQC IR(ME)R guidance", "CGDent / FGDP Selection Criteria"],
    body: `# RPA / MPE Contact & Escalation SOP

**Owner:** IR(ME)R Lead / RPS / Practice Owner
**Review cycle:** Continuous; details verified annually
**Version:** 1.0 — Reviewed May 2026

How the practice maintains and uses its Radiation Protection Adviser (RPA) and Medical Physics Expert (MPE) — including the triggers for escalation and how their advice is filed.

## Applies to

IR(ME)R Lead, RPS, Practice Owner.

## Evidence

RPA / MPE contact record, written advice / correspondence, service agreement.

## Why you need each adviser

- **Radiation Protection Adviser (RPA).** Statutory advisor on compliance with IRR17 — risk assessment, local rules, controlled areas, contingency planning, equipment install, dose advice.
- **Medical Physics Expert (MPE).** Required under IR(ME)R for optimisation, dose audit and CBCT use. Advises on patient dose, image quality and equipment performance.

## Maintaining contact details

- Current name, organisation, phone, email and out-of-hours arrangement on file.
- Scope of advice / service agreement on file.
- Verified annually — and after any change.
- Contact details accessible to anyone who might need to escalate (Practice Manager, RPS, IR(ME)R Lead).

## Escalation triggers

- New X-ray, OPG, CBCT or handheld equipment.
- Room change, building works, shielding question.
- Risk assessment review.
- Failed QA test that may affect safety or dose.
- Incident, near miss or suspected SAUE.
- CBCT governance, justification or optimisation question.
- Controlled area or signage issue.
- Regulatory change, ICB requirement or CQC inspection finding.

## Operating procedure

1. **Maintain the contact card** — RPA and MPE name, organisation, phone, email, out-of-hours route.
2. **Verify annually** and after any change of adviser or service agreement.
3. **On any trigger**, contact the appropriate adviser the same day where safety or dose is in question.
4. **Log every contact** — adviser, date, method, reason, advice given, actions agreed.
5. **Action and close out** — assign owner and date; file written advice with the controlled radiation set.

## Records

Contact and advice log: date, adviser, method (phone / email / visit), reason for contact, advice given and actions agreed. Annual verification: year, RPA confirmed (name & org), MPE confirmed (name & org), service agreement in date; sign-off by Practice Owner and IR(ME)R Lead.

_References: IRMER 2017 (MPE involvement) · IRR17 (RPA appointment) · HSE Approved Code of Practice · CQC IR(ME)R guidance · CGDent / FGDP Selection Criteria._
`
  },
  {
    packKey: "radiography_irmer",
    title: "CBCT Governance SOP",
    type: "sop",
    category: "cbct",
    requiredFlag: "cbctXray",
    linkedAuditType: "cbct",
    references: ["IRMER 2017", "IRR17", "SEDENTEXCT Guidelines", "CGDent / FGDP Selection Criteria (CBCT chapter)", "HPA / UKHSA dental CBCT guidance"],
    body: `# CBCT Governance SOP

**Owner:** IR(ME)R Lead / RPS / MPE
**Review cycle:** Continuous; annual governance review
**Version:** 1.0 — Reviewed May 2026

How the practice ensures CBCT is justified, optimised, reported and audited — to meet IR(ME)R, CQC and CGDent / FGDP selection-criteria expectations.

## Applies to

All staff involved in CBCT (referrers, practitioners, operators), MPE.

## Evidence

CBCT equipment record, justification log, optimisation evidence, MPE correspondence, training records, image-quality audit.

CBCT carries a higher dose than 2D dental imaging. Its use must be specifically justified for every patient, with smallest field of view and lowest dose that answers the clinical question.

## When CBCT is appropriate

- Where the additional 3D information will change the clinical decision.
- Where conventional 2D imaging is insufficient — and a non-ionising alternative is not available.
- Specific indications include: complex implant planning, surgical extraction near nerves, endodontic complications, dento-alveolar trauma, and assessment of pathology.
- Should not be used for routine examination, periodontal screening or as a default ahead of 2D radiographs.

## The CBCT-specific governance set

- CBCT entitlement is recorded separately — operators must be specifically trained for CBCT, not just 2D.
- CBCT local rules appendix and risk assessment held with the main radiation set.
- MPE involvement evidenced — install, acceptance, ongoing optimisation.
- Service contract and QA programme specific to the CBCT unit.
- Reporting arrangement — in-practice reporter where entitled, or named external specialist reporter.

## Operating procedure — justification, optimisation, reporting

1. **Justify each scan.** Practitioner records the clinical question, why 2D is insufficient, expected benefit, alternatives considered.
2. **Optimise.** Smallest field of view that includes the area of interest; lowest dose that gives diagnostic image quality; collimated to the indication.
3. **Report.** Full radiological report covering the entire volume — not only the area of interest. Incidental findings actioned and communicated to the patient where relevant.
4. **Store and link.** Report and DICOM volume stored in the clinical record with traceability to the cycle, operator and reporter.

## Annual CBCT review

- Justification audit — sample of scans cross-checked against indications.
- Optimisation audit — field of view and dose appropriate to indication.
- Reporting audit — full volume reported within local timeframe.
- Image-quality audit including artefacts and reject rate.
- Training and entitlement reviewed.
- MPE correspondence reviewed and actioned.

## Not-applicable statement

For sites without CBCT, this SOP is marked as not applicable on the radiation governance register. The marking is reviewed annually so a future install triggers a return to active governance.

_References: IRMER 2017 (& 2024 amendment) · IRR17 · SEDENTEXCT Guidelines · CGDent / FGDP Selection Criteria (CBCT chapter) · HPA / UKHSA dental CBCT guidance._
`
  }
]
;

/* ── Complaints, Incidents & Duty of Candour master templates ─────── */

export const COMPLAINTS_MASTER_TEMPLATES =
[
  {
    packKey: "complaints_incidents",
    title: "Complaint Handling SOP",
    type: "sop",
    category: "complaints",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 16", "GDC Standards", "NHS Complaints Regs 2009"],
    body: `# Complaint Handling SOP

**Owner:** Practice Manager / Complaints Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice receives, logs and progresses a complaint — from first contact through to closure — to meet NHS and CQC complaint-handling expectations.

- Applies to: All staff
- Frequency: On receipt of every complaint
- Evidence: Complaints log; correspondence file; outcome summary
- Standards: CQC, GDC, NHS PSIRF, PHSO

Every complaint is an opportunity to learn. Treat each one promptly, openly and without defensiveness. The patient should feel listened to even if the outcome is not what they expected.

## The six-stage process
1. Receive. Any member of staff can take a complaint, verbally or in writing. Make a contemporaneous note in the patient's own words.
2. Acknowledge. Within 3 working days — see Complaint Acknowledgement SOP.
3. Investigate. Proportionate to the complaint. See Complaint Investigation SOP.
4. Respond. Written response signed off by the Practice Owner. See Complaint Response Approval SOP.
5. Close or escalate. If the complainant is satisfied — close. If not — signpost to NHS England, the Parliamentary & Health Service Ombudsman or the Dental Complaints Service.
6. Learn. Review at practice meeting; update SOPs and training where needed.

## Timeframes
- Acknowledge: within 3 working days
- Substantive response: within 20 working days (agree extension if longer)
- Keep complainant updated: if response delayed, every 10 working days
- Final response & closure: within 6 months of receipt

## External routes
- NHS complaints — NHS England complaints team, or Integrated Care Board.
- Private complaints — Dental Complaints Service (0208 253 0800).
- Parliamentary & Health Service Ombudsman (NHS) after local resolution exhausted.
- GDC for fitness-to-practise concerns.

## Records & sign-off
- Complaints log fields: reference, patient, date received, complaint summary, investigation lead, response date, outcome, learning recorded.
- Local sign-off: Practice Manager and Practice Owner with date.

_References: CQC Reg 16 · GDC Standards · NHS Complaints Regs 2009._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Complaint Acknowledgement SOP",
    type: "sop",
    category: "complaints",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 16", "GDC Standards", "NHS Complaints Regs 2009"],
    body: `# Complaint Acknowledgement SOP

**Owner:** Practice Manager / Complaints Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How and when the practice acknowledges a complaint — the first written contact after receipt.

- Applies to: Practice Manager; Complaints Lead
- Frequency: Within 3 working days of every complaint
- Evidence: Acknowledgement letter / email; complaints log
- Standards: CQC, GDC, NHS PSIRF, PHSO

## Acknowledgement standard
- Within 3 working days of receipt — written, by the patient's preferred channel.
- Names the Complaints Lead and how to contact them directly.
- States how the practice will investigate and an expected response timeframe.
- Offers to discuss by phone or face-to-face if helpful.
- Signposts the patient to advocacy where appropriate.

## Letter template
Dear [Patient name],

Thank you for contacting us on [date] about your concerns regarding [brief summary]. I am sorry that something has caused you to complain. I will be looking into this personally.

I aim to respond fully within [target] working days. If I need longer I will keep you informed every 10 working days. If you would prefer to discuss this by phone or meet in person, please let me know.

If at any stage you are not happy with how we are handling your complaint, you can contact [NHS England / Dental Complaints Service / ICB] — details overleaf.

Yours sincerely, [Complaints Lead], [Practice].

## Use plain English
- No clinical jargon.
- No legal or insurance language.
- Acknowledge feelings (sorry you felt) without admitting liability prematurely.

## Records & sign-off
- Acknowledgement log: complaint reference, date received, date acknowledged, sent by (staff member), sent by (post/email/hand), target response date.
- Local sign-off: Complaints Lead and Practice Owner with date.

_References: CQC Reg 16 · GDC Standards · NHS Complaints Regs 2009._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Complaint Investigation SOP",
    type: "sop",
    category: "complaints",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 16", "GDC Standards", "NHS Complaints Regs 2009"],
    body: `# Complaint Investigation SOP

**Owner:** Complaints Lead / Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How a complaint is investigated — gathering evidence, hearing from staff and complainant, and reaching findings of fact.

- Applies to: Complaints Lead; Clinical Lead
- Frequency: For every complaint
- Evidence: Investigation file; staff statements; clinical record review
- Standards: CQC, GDC, NHS PSIRF, PHSO

## Plan the investigation
1. Identify the issues. List the specific points the complainant wants addressed. Separate clinical, communication, financial, administrative.
2. Decide proportionality. Minor administrative — desk review. Clinical / serious — full investigation, possibly independent clinical opinion.
3. Identify witnesses. Staff involved on the day; reception; clinical records; appointment history; lab tickets.
4. Set the timeline. Internal milestones to keep within the 20-working-day target.

## Gather evidence
- Clinical records — clear, contemporaneous, retrieved as printed copy.
- Statements from staff — written, factual, signed and dated.
- Photos, radiographs and lab work where relevant.
- Correspondence (emails, texts, complaint letter).
- Appointment, payment and consent records.

## Findings
- For each issue, state: what the complainant said, what the evidence shows, what we conclude.
- Distinguish fact from opinion.
- Identify learning points whether the complaint is upheld or not.

## Records & sign-off
- Investigation record: complaint ref, start date, lead investigator, completion date, issues identified, evidence reviewed, findings, learning identified.
- Local sign-off: Clinical Lead and Complaints Lead with date.

_References: CQC Reg 16 · GDC Standards · NHS Complaints Regs 2009._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Complaint Response Approval SOP",
    type: "sop",
    category: "complaints",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 16", "GDC Standards", "NHS Complaints Regs 2009"],
    body: `# Complaint Response Approval SOP

**Owner:** Complaints Lead / Practice Owner
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the final written complaint response is drafted, reviewed and signed off before sending.

- Applies to: Complaints Lead; Practice Owner
- Frequency: Every complaint response
- Evidence: Final response letter; sign-off record
- Standards: CQC, GDC, NHS PSIRF, PHSO

## Drafting the response
- Address every issue raised — answer each in turn, in the patient's own words.
- State the findings of fact and the conclusion in plain English.
- Apologise where the practice has fallen short.
- Explain what has changed or will change as a result.
- Offer remedy where appropriate — refund, repeat treatment, gesture.
- Signpost to the next stage of escalation.

## Review & approval
1. Peer read. A senior colleague reads the draft for tone, clarity and gaps.
2. Indemnity advice. Take advice from your defence organisation before sending where clinical issues, refunds, threats of legal action or duty-of-candour are involved.
3. Practice Owner sign-off. Final letter signed by the Practice Owner.
4. Send and log. Send by the patient's preferred channel; copy filed in the complaint folder.

## Tone
- Sincere, not defensive.
- Specific to the complainant — not a template letter.
- Avoid legalese; avoid blaming individual staff in writing.

## Records & sign-off
- Sign-off record: complaint ref, drafted by, peer reviewed by, indemnity consulted, approved by, date sent.
- Local sign-off: Complaints Lead and Practice Owner with date.

_References: CQC Reg 16 · GDC Standards · NHS Complaints Regs 2009._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Incident Reporting SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 12", "CQC Reg 20", "GDC Standards"],
    body: `# Incident Reporting SOP

**Owner:** Practice Manager / Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How patient-safety incidents are reported, logged and triaged — covering events that resulted in harm or had the potential to.

- Applies to: All staff
- Frequency: Within 24 hours of any incident
- Evidence: Incident report form; incident log; NRLS / LFPSE submission where required
- Standards: CQC, GDC, NHS PSIRF, PHSO

## What to report
- Anything that caused, or could have caused, harm to a patient, visitor or staff member.
- Medication error, wrong tooth, wrong patient.
- Equipment failure with patient impact.
- Safeguarding-related incident.
- IT / data incident affecting patient care.

## When to report
1. Immediately. Verbally to the Practice Manager / Clinical Lead.
2. Within 24 hours. Complete the incident report form. Facts, time-stamped.
3. External reporting. RIDDOR (HSE) for reportable injuries; CQC notification for relevant events; LFPSE / NRLS where applicable.

## Triage
The Clinical Lead grades the incident:
- No harm / near miss — log and learn.
- Low harm — Significant Event Analysis (see SEA SOP).
- Moderate or severe harm — SEA, duty of candour, external notification.
- Death — same as above plus coroner referral if dental-related.

## Records & sign-off
- Incident report fields: date / time, location, reported by, person affected, what happened (facts), immediate action taken.
- Local sign-off: Clinical Lead and Practice Owner with date.

_References: CQC Reg 12 · CQC Reg 20 · GDC Standards._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Near-Miss Reporting SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 12", "CQC Reg 20", "GDC Standards"],
    body: `# Near-Miss Reporting SOP

**Owner:** Practice Manager / Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How to report and learn from events that almost caused harm — the most valuable safety data the practice collects.

- Applies to: All staff
- Frequency: Continuous
- Evidence: Near-miss log; learning summary
- Standards: CQC, GDC, NHS PSIRF, PHSO

Near misses are free lessons. Reporting them is encouraged and never disciplined — the only blame-free zone in the practice.

## What is a near miss
- Wrong drug drawn up but recognised before administration.
- Wrong instrument set opened but caught before use.
- X-ray exposure setting selected incorrectly but cancelled before exposure.
- Patient identification error caught at the chair.
- Sharps injury narrowly avoided.

## How to report
1. Quick form. The same incident form, marked "near miss". Brief — what happened, what stopped it, what could be improved.
2. No blame. The point is the system, not the person.
3. Practice meeting. Anonymised review at the next monthly meeting.

## Learning triggers
- Three near misses in a similar process — review the SOP.
- One near miss with potential for serious harm — full SEA.
- Recurring contributors (interruption, time pressure, equipment) — environmental review.

## Records & sign-off
- Near-miss log: date, reported by, what almost happened, what prevented harm, system factor identified, action taken.
- Local sign-off: Clinical Lead and Practice Manager with date.

_References: CQC Reg 12 · CQC Reg 20 · GDC Standards._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Significant Event Analysis SOP",
    type: "sop",
    category: "sea",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 12", "GDC Standards", "SDCEP/RCS Guidance"],
    body: `# Significant Event Analysis SOP

**Owner:** Clinical Lead / Practice Owner
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
The structured review the practice carries out after a significant event — to understand what happened and how to reduce the chance of recurrence.

- Applies to: Whole team
- Frequency: After every significant event; minimum 4 per year
- Evidence: SEA records; action log; CPD records
- Standards: CQC, GDC, NHS PSIRF, PHSO

## What counts as a significant event
- Any incident causing actual or potential moderate-to-severe harm.
- Real medical emergency in the practice.
- Any incident requiring duty of candour.
- Cluster of near misses suggesting a system issue.
- Positive events worth replicating (good practice analysis).

## The seven-step review
1. What happened? Time-stamped, factual narrative.
2. Why did it happen? Contributory factors — person, task, equipment, environment, communication, training, organisational.
3. What went well? So we keep doing it.
4. What could have gone better?
5. What needs to change? Each action with a named owner and deadline.
6. What learning to share. Anonymised, at practice meeting and CPD records.
7. Review. Re-check at the agreed point that the action stuck.

## Tone
Just-culture, system-focused. Avoid naming or blame. Focus on what made the error possible and what makes the right action easier next time.

## Records & sign-off
- SEA template: SEA date, event date, what happened, why did it happen, what went well / could have gone better, what will change — actions, owners, deadlines.
- Local sign-off: Clinical Lead and Practice Owner with date.

_References: CQC Reg 12 · GDC Standards · SDCEP/RCS Guidance._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Duty of Candour SOP",
    type: "sop",
    category: "candour",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 20 (Duty of Candour)", "GDC Standards"],
    body: `# Duty of Candour SOP

**Owner:** Practice Owner / all clinical staff
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
The practice's statutory and professional duty to be open and honest with patients when something has gone wrong with their care.

- Applies to: All clinical staff; Practice Owner
- Frequency: Whenever a notifiable safety incident occurs
- Evidence: Duty of candour record on patient file; written confirmation to patient
- Standards: CQC, GDC, NHS PSIRF, PHSO

Two duties run in parallel. Statutory duty (CQC Regulation 20) for the organisation; professional duty (GDC) for every individual clinician. Both require openness, apology and a written follow-up.

## When the duty triggers
A "notifiable safety incident" is one where unintended or unexpected care has resulted, or could result, in death, severe harm, moderate harm or prolonged psychological harm.

## The five things to do
1. Tell the patient face-to-face. As soon as practicable. In private, with appropriate support.
2. Apologise. A genuine apology is not an admission of legal liability — it is a professional and human duty.
3. Explain what happened. What we know, what we don't yet know, and how we will find out.
4. Offer support. Practical help, further treatment, second opinion, contact details for support organisations.
5. Write to the patient. Confirm in writing within a reasonable period — usually 10 working days. Provide the outcome of any investigation.

## Recording
- Note the verbal conversation in the patient's clinical record at the time.
- Keep a copy of the written follow-up letter on the patient file.
- Cross-reference the incident report and any SEA.
- Mark the duty of candour discharged.

## Records & sign-off
- Duty of candour record: incident date, patient, conversation date, conducted by, what was discussed and what was apologised for, support offered & agreed, written follow-up sent on.
- Local sign-off: Clinician and Practice Owner with date.

_References: CQC Reg 20 (Duty of Candour) · GDC Standards._
`
  },
  {
    packKey: "complaints_incidents",
    title: "Learning from Incidents SOP",
    type: "sop",
    category: "learning",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Learning from Incidents SOP

**Owner:** Practice Owner / Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice closes the loop after an incident — capturing lessons, updating processes and verifying that improvements have stuck.

- Applies to: Practice Owner; Clinical Lead; all staff
- Frequency: After every incident and quarterly review
- Evidence: Learning log; action tracker; quarterly governance minutes
- Standards: CQC, GDC, NHS PSIRF, PHSO

## From incident to action
1. Identify learning. From the SEA or hot debrief — what would prevent recurrence?
2. Assign actions. Each action: named owner, specific change, deadline, success measure.
3. Update. SOPs, induction, training, checklists, equipment list, staffing or layout.
4. Communicate. All-staff briefing; anonymised summary at the next practice meeting.
5. Verify. Audit at 3, 6 and 12 months — has the change held?

## Quarterly governance meeting
Standing agenda item:
- Incidents and near misses since last meeting.
- Complaints summary.
- Open actions and overdue items.
- Themes — what are we seeing repeatedly?
- External signals — alerts from MHRA, GDC, CQC.

## Sharing beyond the practice
- Submit relevant cases to LFPSE / NRLS to support national learning.
- Anonymised case discussion at local clinical networks where appropriate.
- CPD entry for staff involved.

## Records & sign-off
- Learning & action tracker: incident ref, date, action, owner, deadline, success measure, 3 / 6 / 12-month verification — has the change held?
- Local sign-off: Clinical Lead and Practice Owner with date.

_References: CQC Reg 17 · GDC Standards._
`
  }
]
;

/* ── Medical Emergencies master templates ─────────────────────────── */

export const MEDICAL_EMERGENCIES_MASTER_TEMPLATES =
[
  {
    packKey: "medical_emergencies",
    title: "Medical Emergency Readiness, Drugs & Equipment",
    type: "sop",
    category: "emergency_readiness",
    requiredFlag: null,
    linkedAuditType: "emergency_readiness",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12"],
    body: `# Medical Emergency Readiness, Drugs & Equipment

**Owner:** Clinical Lead
**Review cycle:** Annual; after guideline changes or incidents
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Emergency kit contents, oxygen and AED access, weekly checks, staff roles, training records, simulation drills, and incident audit. Every clinical area must be able to summon help, access oxygen, airway equipment and an AED within the first minutes of an emergency.

## Recognise
- Any patient, visitor or staff member can collapse before, during or after dental treatment.
- Emergency readiness is a whole-team responsibility, including non-clinical staff who may need to call 999, bring equipment or guide paramedics.
- The practice must keep emergency drugs and equipment immediately accessible, in date, checked and familiar to the team.

## Immediate protocol
1. Assign named responsibilities. Nominate primary and deputy staff for drug checks, equipment checks, oxygen cylinder checks, AED checks and emergency training records.
2. Check drugs and equipment at least weekly. Record expiry dates, seals, oxygen cylinder contents, AED status, pads, batteries, suction function and the location of all equipment.
3. Keep the team trained. Maintain evidence of medical emergency and resuscitation training appropriate to each person's role, including use of oxygen, AED and emergency drugs.
4. Run rehearsals. Practise calling for help, bringing the kit, chair positioning, BLS/AED deployment, drug drawing-up, SBAR handover and access for ambulance crews.
5. Audit and update. After checks, drills or real incidents, record actions, restock, replace expired items and update local protocols where learning is identified.

## Recommended emergency drugs
- Adrenaline 1:1000 IM — anaphylaxis management.
- Aspirin 300 mg dispersible tablets — suspected myocardial infarction in adults.
- Glucagon 1 mg IM — hypoglycaemia where patient is unconscious or uncooperative.
- GTN spray 400 µg / dose — angina / suspected cardiac chest pain in adults.
- Midazolam oromucosal 5 mg/ml — prolonged or repeated epileptic seizure according to protocol.
- Oral glucose / sugar — conscious hypoglycaemia.
- Oxygen cylinder(s) — respiratory support and resuscitation.
- Salbutamol inhaler 100 µg / actuation — acute asthma or bronchospasm via spacer.

## Recommended emergency equipment
- AED with pads — visible, accessible, status indicator checked, pads in date, spare pads where available.
- Portable oxygen with flowmeter — cylinder in date, adequate contents, correct regulator, masks and tubing available.
- High-concentration oxygen mask — for breathing patients requiring high-flow oxygen.
- Pocket mask with oxygen port — available in each treatment area where practicable.
- Self-inflating bag-valve-mask — adult and child sizes with oxygen reservoir and masks.
- Oropharyngeal airways — sizes 0, 1, 2, 3 and 4.
- Portable suction — charged / functional with appropriate tubing and suction tips.
- Spacer device — for salbutamol delivery.
- Syringes and needles — for emergency injectable drugs where required.

## Escalation & audit
No equipment, drug or oxygen check should be left undocumented. Any expired, missing or malfunctioning item must be replaced or escalated before the next clinical session where possible. After any real emergency, quarantine used drug packaging where helpful, complete an incident record and debrief the team.

- Handover: use SBAR — situation, background, assessment, response. Include times, drugs, doses, oxygen, AED shocks and known medical history.
- Documentation: record facts, observations, treatment given, who attended, patient outcome and ambulance / hospital communication.
- Learning: restock immediately, debrief staff, record local incident if required and update training or protocols where learning is identified.

_References: Resus Council UK · GDC Standards · CQC Reg 12._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Medical Emergency Response SOP",
    type: "sop",
    category: "incident_response",
    requiredFlag: null,
    linkedAuditType: "emergency_incident_review",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12"],
    body: `# Medical Emergency Response SOP

**Owner:** Clinical Lead
**Review cycle:** Every clinical session; rehearsed in drills
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
The whole-practice response to a medical emergency from recognition through to handover — what each role does, in what order. Action in the first 60 seconds matters most: recognise, call for help, position the patient, summon the kit and start basic life support if needed.

- Applies to: all staff — clinical and non-clinical.
- Frequency: every clinical session; rehearsed in drills.
- Evidence: drill records, incident reports, training records.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Recognise & call
1. Recognise. Collapse, chest pain, breathing difficulty, fitting, profuse bleeding, severe allergic reaction or any sudden deterioration.
2. Call for help. Shout for a colleague. The nearest staff member dials 999 if airway, breathing or circulation is compromised.
3. Position. If unresponsive and breathing — recovery position. If not breathing normally — supine and start CPR.
4. Bring the kit. Emergency drug kit, oxygen, AED and incident record to the scene.

## Role allocation
- Clinician with patient: stays with the patient. Leads clinical response, airway, breathing, drug administration.
- Nurse / second clinician: brings the emergency kit, oxygen and AED. Draws up drugs as directed.
- Reception / nominated 999 caller: dials 999, gives the practice address and post-code, stays on the line, opens the door for paramedics.
- Practice manager: manages other patients, clears the route for paramedics, documents the timeline.

## Common presentations — quick reference
- Anaphylaxis: adrenaline 1:1000 IM (500 µg adult), oxygen, supine + legs raised, repeat at 5 min if no improvement.
- Acute asthma: salbutamol via spacer (up to 10 puffs), oxygen, sit upright.
- Hypoglycaemia (conscious): oral glucose 10–20 g; recheck.
- Hypoglycaemia (unconscious): glucagon 1 mg IM; oxygen; recovery position.
- Suspected MI: GTN spray sub-lingual, aspirin 300 mg dispersible chewed, oxygen if SpO <94%, 999.
- Seizure > 5 min: midazolam oromucosal 10 mg; protect from injury; 999.
- Cardiac arrest: CPR 30:2, AED on as soon as available, 999.
- Choking: encourage cough; 5 back blows, 5 abdominal thrusts; 999 if obstruction persists.

## Handover to paramedics — SBAR
- Situation — what has happened, when.
- Background — medical history, current treatment, medications, allergies.
- Assessment — observations, drugs given (dose, route, time), AED shocks delivered.
- Response — current state, intervention in progress.

## After the incident
- Restock the emergency kit immediately. Replace used drugs and consumables.
- Complete incident report within 24 hours.
- Debrief the team. Significant event analysis where appropriate.
- Notify the patient's GP per practice policy.
- Duty of candour considered if harm has occurred.

_References: Resus Council UK · GDC Standards · CQC Reg 12._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Emergency Drugs Check SOP",
    type: "sop",
    category: "drugs",
    requiredFlag: "drugBoxPresent",
    linkedAuditType: "drug_box_check",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12", "BNF / BNFc"],
    body: `# Emergency Drugs Check SOP

**Owner:** IPC Lead
**Review cycle:** Weekly; restock immediately after any use
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Weekly check of the emergency drug kit — contents, expiry dates, seal integrity and replenishment. Every drug must be in date, sealed and immediately accessible. Any expired or missing drug is replaced before the next clinical session.

- Applies to: IPC Lead and named deputies.
- Frequency: weekly; restock immediately after any use.
- Evidence: drugs check log with operator signature.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Recommended stock (SDCEP)
- Adrenaline IM — 1 mg / 1 ml (1:1000), minimum 2 ampoules — anaphylaxis.
- Aspirin — 300 mg dispersible, pack of 4 — suspected MI.
- Glucagon IM — 1 mg / ml, single pack — unconscious hypoglycaemia.
- Glyceryl trinitrate spray — 400 µg / dose — angina / suspected cardiac chest pain.
- Midazolam oromucosal — 5 mg / ml, adult & child doses — prolonged seizure.
- Oral glucose — tablets / gel — conscious hypoglycaemia.
- Salbutamol inhaler — 100 µg / actuation + spacer — acute asthma.

## Weekly check method
1. Cross-check against the contents list. Every item present and in date.
2. Visual inspection. Seal integrity, no damage, no discolouration, no leak.
3. Soonest expiry. Record the earliest expiry on the log to trigger early ordering.
4. Sign the log. Date, operator, exceptions, actions taken.

## If a drug is missing or expired
- Quarantine the kit. Mark it "INCOMPLETE — do not use".
- Source a replacement before the next clinical session.
- Borrow a complete kit from a neighbouring surgery or arrange a same-day delivery.
- Log the lapse and consider whether SEA is required.

## Weekly log prompts
- Week starting, operator name, signature.
- Earliest expiry, items replaced, outcome.
- Local sign-off: Clinical Lead / IPC Lead, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12 · BNF / BNFc._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Oxygen Check SOP",
    type: "sop",
    category: "equipment",
    requiredFlag: "oxygenPresent",
    linkedAuditType: "oxygen_check",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12"],
    body: `# Oxygen Check SOP

**Owner:** Named oxygen checker(s)
**Review cycle:** Weekly; after every use
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Weekly check of portable oxygen — cylinder contents, regulator, masks and tubing — ready for immediate use. Oxygen must be available in every clinical area with a flow meter, non-rebreathe mask and tubing, ready to deliver up to 15 L/min within seconds.

- Applies to: named oxygen checker(s).
- Frequency: weekly; after every use.
- Evidence: oxygen check log; cylinder change records.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Weekly check
1. Cylinder contents. Gauge in the green / full zone (≥ full). Replace below ¼ full.
2. Regulator & flow. Briefly open the valve, confirm flow at 15 L/min, then close.
3. Tubing & masks. One non-rebreathe mask with reservoir bag, one nasal cannula, single-use, in date, sealed.
4. Cylinder location. Secured upright on its trolley or wall bracket. Spare cylinder available where the practice keeps one.
5. Sign the log.

## Cylinder sizing & replacement
- CD-size cylinders typically used in primary care dental.
- Replace below ¼ full; order spares with at least 2 weeks of typical use in stock.
- Empty cylinders returned to the supplier — not stored with full ones.
- Cylinders fall under DSEAR regulations; storage area ventilated, away from heat sources, no oil or grease on fittings.

## Weekly log prompts
- Week, cylinder gauge, flow test 15 L/min outcome.
- Mask & tubing in date, operator.
- Local sign-off: IPC Lead / Practice Owner, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12._
`
  },
  {
    packKey: "medical_emergencies",
    title: "AED Check SOP",
    type: "sop",
    category: "equipment",
    requiredFlag: "aedPresent",
    linkedAuditType: "aed_check",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12", "Resus Council UK AED Guidance 2025"],
    body: `# AED Check SOP

**Owner:** Named AED checker(s)
**Review cycle:** Weekly; after any use
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Weekly check of the automated external defibrillator — status indicator, pads, battery and access. The AED must be retrievable in under 60 seconds. A working AED with in-date pads available in the practice can double a patient's chance of survival from cardiac arrest.

- Applies to: named AED checker(s).
- Frequency: weekly; after any use.
- Evidence: AED check log; pad / battery replacement records.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Weekly check
1. Status indicator. Self-test indicator green / OK. Refer to AED manufacturer's symbol.
2. Pads. Adult pads, in date and in the sealed pouch. Paediatric pads if held by the practice — in date. Spare set ideally available.
3. Battery. Status indicator green. Replace per manufacturer schedule (typically every 4–5 years; sooner after use).
4. Location. Visible, signposted, accessible to all staff. Not locked in a drawer.
5. Sign the log.

## Per manufacturer
- Each AED has a specific self-test routine. Refer to the device manual held with this SOP.
- Most devices indicate a fault with a red status light or audible alarm. Investigate any change in status immediately.
- Adult pads suitable for ≥ 8 years / ≥ 25 kg. Paediatric pads or paediatric mode for < 8 years where available.

## Weekly log prompts
- Week, status indicator, adult pads expiry.
- Paed pads expiry, battery status, operator & outcome.
- Local sign-off: IPC Lead / Practice Owner, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12 · Resus Council UK AED Guidance 2025._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Emergency Equipment Check SOP",
    type: "sop",
    category: "equipment",
    requiredFlag: null,
    linkedAuditType: "emergency_readiness",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12"],
    body: `# Emergency Equipment Check SOP

**Owner:** Named equipment checker(s)
**Review cycle:** Weekly; after every use
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Weekly check of airway, breathing and ancillary equipment kept with the emergency drug kit.

- Applies to: named equipment checker(s).
- Frequency: weekly; after every use.
- Evidence: equipment check log.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Equipment list (per RCUK / SDCEP)
- Pocket mask with oxygen port — single-use mask available in each treatment area where practicable.
- Self-inflating bag-valve-mask (adult) — bag intact, valve functional, reservoir attached, masks clean.
- Self-inflating bag-valve-mask (child) — bag intact, valve functional, masks clean.
- Oropharyngeal (Guedel) airways — sizes 0, 1, 2, 3 and 4.
- Portable suction — charged / functional with tubing and tips.
- Spacer device — available for salbutamol delivery; not previously used by a patient.
- Syringes & needles — sterile, in date, sizes appropriate for IM injection.
- Pulse oximeter — battery, sensor clean, working.
- Blood glucose meter & strips — strips in date, meter QC current.
- Stop watch / timer — working.

## Weekly check method
1. Inventory. Cross-check against the contents list above. Any missing item replaced before the next clinical session.
2. Function test. Suction unit run for a few seconds; pulse oximeter switched on; BVM bag squeezed for valve action.
3. Expiry / cleanliness. All single-use items in date and sealed. Reusable items visibly clean.
4. Sign the log.

## Weekly log prompts
- Week, operator, suction works.
- BVM intact, items replaced, outcome.
- Local sign-off: IPC Lead / Practice Owner, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Medical Emergency Scenario Drill SOP",
    type: "sop",
    category: "training",
    requiredFlag: "mockDrillRequired",
    linkedAuditType: "mock_drill",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12", "CQC Mythbusters"],
    body: `# Medical Emergency Scenario Drill SOP

**Owner:** Clinical Lead / Drill Lead
**Review cycle:** Minimum quarterly; ideally monthly
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Practising medical emergencies as a whole team — scenarios, frequency, debrief and learning capture. Drills turn theory into reflex. Untrained teams panic. Practised teams act calmly. Frequency matters more than complexity.

- Applies to: all clinical and non-clinical staff.
- Frequency: minimum quarterly; ideally monthly.
- Evidence: drill log; debrief notes; training matrix.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Schedule
- Quarterly minimum; monthly is best practice.
- Rotate scenarios so all common presentations are covered every 12 months.
- At least one drill in each clinical area each year.
- Whole team — clinical, nursing, reception, management.

## Scenario library
- Adult cardiac arrest in the surgery — CPR, AED deployment, role allocation, 999 timing.
- Anaphylaxis after local anaesthetic — adrenaline IM, repeat dose, oxygen, positioning.
- Acute asthma in waiting room — salbutamol via spacer, recognition by reception staff.
- Suspected MI — aspirin, GTN, oxygen, 999, calm handover.
- Hypoglycaemia in a diabetic patient — glucose / glucagon, recheck, GP referral.
- Seizure exceeding 5 minutes — midazolam, airway protection, 999.
- Choking in reception — back blows, abdominal thrusts, 999.

## Drill structure
1. Brief. Set the scene, explain it is a drill, identify the simulated patient.
2. Run. Real timings, real kit, real positions. No drugs administered, but doses verbalised and drawing-up rehearsed.
3. Debrief. What went well, what was missed, what to change. Record outcomes and assign actions.
4. Update. Update local SOPs, training matrix and any equipment gaps revealed by the drill.

## Drill record
- Date, scenario, lead.
- Attendees, time to 999 call, time to BLS / drug.
- What went well, what to improve.
- Local sign-off: Clinical Lead / Drill Lead, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12 · CQC Mythbusters._
`
  },
  {
    packKey: "medical_emergencies",
    title: "Emergency Incident Review SOP",
    type: "sop",
    category: "incident",
    requiredFlag: null,
    linkedAuditType: "emergency_incident_review",
    references: ["Resus Council UK", "GDC Standards", "CQC Reg 12", "CQC Reg 20"],
    body: `# Emergency Incident Review SOP

**Owner:** Clinical Lead
**Review cycle:** After every real incident or significant near miss
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice debriefs, learns from and documents any real medical emergency or near miss. The point is learning, not blame. Every real emergency is an opportunity to find what worked, what didn't and what to do differently next time.

- Applies to: all staff involved in an incident.
- Frequency: after every real incident or significant near miss.
- Evidence: incident report, SEA record, action log.
- Standards: Resuscitation Council UK, SDCEP, CQC.

## Within 24 hours
1. Incident report form. Completed by the staff member closest to the event. Facts only, time-stamped.
2. Hot debrief. Whole team in the same room. 10–15 minutes. "What happened? What worked? What didn't?"
3. Welfare check. Staff and patient wellbeing. Offer post-incident support; consider Occupational Health referral.
4. Kit restock. Replace all used drugs, consumables and oxygen. Quarantine any expired stock.

## Within 7 days
1. Significant Event Analysis. Structured review. What happened? Why? What change reduces the chance of recurrence?
2. Action log. Each action assigned to a named owner with a deadline.
3. Communication. Notify the patient's GP per practice policy. Duty of candour considered.
4. Statutory reporting. RIDDOR if applicable. CQC notification if patient outcome meets the threshold.

## Within 30 days
- SOPs and training updated to reflect learning.
- Scenario drill scheduled based on the event.
- Action log followed up; outstanding items escalated.
- SEA shared at the next practice meeting (anonymised as needed).

## SEA template
- Date of review, date of incident.
- What happened?
- What went well?
- What could have gone better?
- What will change as a result?
- Local sign-off: Clinical Lead / Practice Owner, date.

_References: Resus Council UK · GDC Standards · CQC Reg 12 · CQC Reg 20._
`
  }
]
;

/* ── Practice Operations master templates ──────────────────────────── */

export const PRACTICE_OPS_MASTER_TEMPLATES =
[
  {
    packKey: "practice_operations",
    title: "Opening Procedure SOP",
    type: "sop",
    category: "opening",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Opening Procedure SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
The first hour of the day — unlocking, alarms, checks and getting clinical and reception areas ready for patients.

**Applies to:** First staff member on site
**Frequency:** Every working day
**Evidence:** Daily opening checklist; sign-off log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Arrival & Security
1. Disarm alarm. Within 30 seconds. Code held only by named keyholders.
2. Check the building. Any signs of break-in, leaks, lights left on, unfamiliar items.
3. Unlock public areas. Front door at the agreed time, not before.

### Practice-Wide Checks
- Heating / cooling at clinical temperature.
- Hand-wash basins stocked (soap, towels, gel).
- Reception phones and IT logged in and working.
- Fridge temperature within range (see Fridge Temperature SOP).
- Emergency drugs and AED in date and accessible.

### Surgery Set-Up
- Compressor and vacuum on.
- Waterline start-of-day flush completed (see DUWL SOP).
- Autoclave / WD started for the first load if needed.
- First instruments laid out for the morning list.

## Records & sign-off
- Daily opening log: date, time, opened by, alarm code OK, building secure, issues found.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Closing Procedure SOP",
    type: "sop",
    category: "closing",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Closing Procedure SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
End-of-day shutdown — clinical areas left clean and ready, equipment safe, building secured.

**Applies to:** Last staff member on site
**Frequency:** Every working day
**Evidence:** Daily closing checklist; sign-off log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Clinical Areas
- All instruments reprocessed and put away.
- Surgeries cleaned per Surgery Turnaround SOP (final clean).
- Waterlines end-of-day biocide applied; chair drained where applicable.
- Suction line cleaner run.
- Autoclave / WD final cycle complete; loads released or quarantined as required.

### Equipment
1. Compressor / vacuum off.
2. X-ray units off at the wall.
3. IT shut down (per practice IT policy).
4. Lights off in non-essential areas.

### Security
- Cash and card terminals locked away.
- Confidential documents secured.
- Drug cupboard locked; keys logged.
- All doors and windows checked.
- Alarm set; building locked.

## Records & sign-off
- Daily closing log: date, time, closed by, alarm set, handover for tomorrow, issues left.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Daily Practice Readiness SOP",
    type: "sop",
    category: "daily_readiness",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Daily Practice Readiness SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
A single morning huddle covering safety, staffing, schedule and known risks — five minutes that prevent the day going wrong.

**Applies to:** All staff
**Frequency:** Every working day, 5 minutes before opening
**Evidence:** Huddle log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### The Huddle
Whole team, standing, five minutes. Same time every morning. Practice Manager or senior clinician leads.

### The Five Checks
1. Staffing. Who is in, who is missing, any cover needed.
2. Schedule. Walk through the day. Complex cases, new patients, anxious patients, late arrivals likely.
3. Safety. Emergency drugs, AED, oxygen, autoclave, fridge — all checked and OK.
4. Yesterday's loose ends. Outstanding tasks, lab work due back, follow-up calls.
5. Known risks. Equipment fault under investigation, staff member feeling unwell, a complainant due in.

### Tone
- Brief, calm, no blame.
- Anyone can raise a concern.
- Decisions captured in the huddle log.

## Records & sign-off
- Huddle log: date, led by, safety checks pass, attendees, issues raised & decisions taken.
- Local sign-off: Clinical Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Reception SOP",
    type: "sop",
    category: "reception",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "NHS Contracts", "Data Protection Act 2018"],
    body: `# Reception SOP

**Owner:** Reception Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How reception greets, manages and protects patients from the first point of contact through to handover to the clinical team.

**Applies to:** Reception team
**Frequency:** Continuous
**Evidence:** Visitor records; complaint log; safeguarding log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### First Contact
- Stand to greet where possible; eye contact; warm and professional.
- Confirm identity using full name, DOB and address (never by name alone).
- Check medical history update is in date.
- Confirm whether the patient has been informed of any cost ahead of time.

### Confidentiality
- No clinical details discussed in earshot of other patients.
- Screens turned away from public view.
- Phone calls about treatment taken in a private area where possible.

### Difficult Situations
1. Angry or distressed patient. Listen, acknowledge, move to a private space, offer a senior colleague if helpful.
2. Safeguarding concern. Don't try to investigate at the desk. Record what was said, alert the Safeguarding Lead (see Safeguarding SOPs).
3. Patient appearing unwell. Bring a clinician straight away. Do not ask them to wait if they look acutely unwell.

## Records & sign-off
- Daily reception log: date, receptionist on duty, patients arrived, late cancellations, DNAs (count), incidents to flag.
- Local sign-off: Reception Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards · NHS Contracts · Data Protection Act 2018_
`
  },
  {
    packKey: "practice_operations",
    title: "Appointment Booking SOP",
    type: "sop",
    category: "booking",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "NHS Contracts", "Data Protection Act 2018"],
    body: `# Appointment Booking SOP

**Owner:** Reception Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How appointments are booked to give patients the right amount of time with the right clinician and to keep the day running.

**Applies to:** All booking staff
**Frequency:** Continuous
**Evidence:** Booking system; daily schedule audit
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Standard Slot Lengths
- New patient examination — 30–45 mins
- Routine recall — 15–20 mins
- Hygienist routine — 30 mins
- Hygienist periodontal — 45–60 mins
- Filling, single tooth — 30 mins
- Filling, multiple / large — 45–60 mins
- Root canal (per visit) — 60–90 mins
- Crown prep — 60 mins
- Extraction, simple — 30 mins
- Extraction, surgical — 60 mins
- Emergency — 15–20 mins, triage first

### Booking Rules
- Anxious patients booked at the start of a session where possible.
- Children & school-leavers booked outside school hours where preferred.
- Complex cases not double-booked.
- Buffer slots kept for emergencies and over-runs.
- Costs confirmed and recorded before appointment.

### Confirmation
- SMS or email confirmation at booking and 24–48 hours before.
- Patient asked to update contact details at every booking.
- Pre-appointment instructions sent where relevant (e.g. fasting for sedation).

## Records & sign-off
- Local sign-off: Practice Manager / Clinical Lead and date.

_References: CQC Reg 17 · GDC Standards · NHS Contracts · Data Protection Act 2018_
`
  },
  {
    packKey: "practice_operations",
    title: "New Patient Registration SOP",
    type: "sop",
    category: "registration",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "GDPR", "BDA Patient Records Guidance"],
    body: `# New Patient Registration SOP

**Owner:** Reception Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How a new patient is registered, identified and prepared for their first appointment.

**Applies to:** Reception team
**Frequency:** On every new registration
**Evidence:** Patient record; signed forms; medical history
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Information Collected
- Full name, DOB, full address, contact phone & email.
- Emergency contact and relationship.
- NHS number where NHS care is to be provided.
- GP name and surgery.
- Communication preferences and access needs.
- Photo ID and proof of address — where required by local NHS rules.

### Forms Completed Before First Appointment
- Patient registration form.
- Medical history questionnaire.
- Privacy & consent to share information.
- NHS / private treatment terms acknowledged.

### At the First Appointment
1. Verify identity. Full name, DOB, address spoken aloud.
2. Confirm medical history. Reviewed and updated with clinician.
3. Welcome conversation. Treat goals, concerns, anxieties.
4. Clinical examination & plan. See Your First Visit PIL.

## Records & sign-off
- Local sign-off: Practice Manager / Reception Lead and date.

_References: CQC Reg 17 · GDC Standards · GDPR · BDA Patient Records Guidance_
`
  },
  {
    packKey: "practice_operations",
    title: "Medical History Update SOP",
    type: "sop",
    category: "medical_history",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "NICE Medical History Guidance"],
    body: `# Medical History Update SOP

**Owner:** Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How and when the medical history is updated — at every visit, before any treatment, signed by patient and clinician.

**Applies to:** All clinical staff
**Frequency:** Every appointment
**Evidence:** Signed medical history in clinical record
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### The Standard
- Medical history reviewed at every clinical appointment, before treatment starts.
- Patient signs to confirm accuracy.
- Clinician signs to confirm review.
- Any change clearly noted in the clinical record.

### What to Ask
- Any changes since last visit? New conditions, new medications, new allergies?
- Hospital admissions or recent operations?
- Are you pregnant or could you be?
- Any concerns since we last saw you?

### High-Risk Items to Probe
- Anticoagulants and antiplatelets (apixaban, rivaroxaban, warfarin, clopidogrel).
- Bisphosphonates / denosumab.
- Diabetes — recent HbA1c.
- Cardiac conditions, valve replacements, recent MI.
- Pregnancy and breastfeeding.
- Drug allergies — particularly antibiotics and latex.

## Records & sign-off
- Annual audit: quarter, sample size, % signed at each visit, issues found.
- Local sign-off: Practice Manager / Clinical Lead and date.

_References: CQC Reg 17 · GDC Standards · NICE Medical History Guidance_
`
  },
  {
    packKey: "practice_operations",
    title: "Patient Check-In SOP",
    type: "sop",
    category: "checkin",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Patient Check-In SOP

**Owner:** Reception Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
The two-minute check-in routine that confirms identity, medical-history currency, payment status and consent before the clinician sees the patient.

**Applies to:** Reception team
**Frequency:** Every patient arrival
**Evidence:** Patient record entries
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Identify
- Full name, DOB, address spoken aloud and matched against the record.
- Never identify by name alone — particularly important with common names and families.

### Verify
- Medical history reviewed in the last 12 months — and asked about at every visit.
- Contact details current.
- Communication preference.
- Any safeguarding or accessibility flag noted.

### Prepare
- Confirm planned treatment and approximate cost.
- Hand over any forms requiring signature (consent, treatment plan).
- Let the patient know expected wait time.

## Records & sign-off
- Local sign-off: Reception Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Patient Check-Out SOP",
    type: "sop",
    category: "checkout",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Patient Check-Out SOP

**Owner:** Reception Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How patients leave the practice — review of treatment, payment, follow-up booking and dispatch with any post-op information.

**Applies to:** Reception team; clinical staff
**Frequency:** Every patient departure
**Evidence:** Treatment record; payment record; recall set
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Handover From Clinician
- Treatment notes complete in patient record.
- Next appointment indicated (with timeframe).
- Any post-op information sheets given.
- Cost confirmed; any deposit for next visit noted.

### At Reception
1. Take payment. Card preferred; cash receipted; itemised receipt offered.
2. Book follow-up. Within the timeframe the clinician has specified. Recall set in the system.
3. Confirm contact preference. For confirmation, reminder and any post-op call.
4. Send patient off well. Thank you, any questions, take care.

### Special Cases
- Patient on sedation — accompanied home; no driving.
- Post-extraction — verbal aftercare reinforced; written sheet given.
- Distressed or anxious patient — offer a quick check-in by phone the next day.

## Records & sign-off
- Local sign-off: Reception Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Failed Attendance / DNA SOP",
    type: "sop",
    category: "dna",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Failed Attendance / DNA SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice records, communicates with and (where appropriate) discharges patients who repeatedly miss appointments.

**Applies to:** Reception team; Practice Manager
**Frequency:** Every DNA / late cancellation
**Evidence:** DNA letter file; patient record entries
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Definitions
- DNA (did not attend) — patient failed to attend a booked appointment without notice.
- Short-notice cancellation — cancelled within 24 hours of the appointment.
- Late arrival — arrived too late to complete the booked treatment safely.

### After a DNA
1. Log it. Patient record and DNA register.
2. Contact the patient. Same day if possible. Check welfare — particularly if the patient is vulnerable, in pain or under safeguarding flag.
3. First DNA. Friendly letter / email, reminder of impact on others, rebook.
4. Second DNA. Warning letter — further DNAs may lead to removal from the list.
5. Third DNA. Consider removal from list per practice / NHS rules. Particular care if vulnerable patient.

### Safeguarding Considerations
- Children — repeated DNA is a safeguarding flag, especially if treatment outstanding (see Dental Neglect SOP).
- Vulnerable adults — DNA may indicate need for support, not negligence.
- Patient in pain or with active infection who DNAs — chase actively.

## Records & sign-off
- DNA register: patient, appointment date, contacted on, outcome, safeguarding flag, next action.
- Local sign-off: Clinical Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Urgent Appointment Triage SOP",
    type: "sop",
    category: "triage",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Urgent Appointment Triage SOP

**Owner:** Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How reception triages patients with urgent dental need — pain, swelling, trauma — and fits them in safely the same day.

**Applies to:** Reception team; on-call clinician
**Frequency:** Every urgent contact
**Evidence:** Triage log; appointment system
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Key Triage Questions
- Where is the problem and how long has it been there?
- Pain — when did it start, what makes it worse, has it kept you awake, what relieves it?
- Any facial swelling or visible swelling in the mouth?
- Difficulty opening the mouth, swallowing or breathing?
- Any fever or feeling unwell?
- Any bleeding that won't stop?
- Recent injury or trauma — knocked tooth?

### Categories
- True emergency — airway / breathing involvement, severe spreading swelling, uncontrolled bleeding. Refer 999 / A&E.
- Urgent same day — pain keeping awake, facial swelling without airway involvement, knocked-out adult tooth. Same-day appointment.
- Urgent within 1–3 days — pain with painkillers controlling it, lost crown / filling with no pain. Next available urgent slot.
- Routine — lost filling, no pain; chipped tooth, no symptoms. Next available routine slot.

### Reception Limits
Reception triages on symptoms only. If unsure, route to the on-call clinician. Reception does not give clinical advice or diagnose.

## Records & sign-off
- Triage log: patient, symptoms, triaged by, outcome.
- Local sign-off: Clinical Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Referral Follow-Up SOP",
    type: "sop",
    category: "referral",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Referral Follow-Up SOP

**Owner:** Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Tracking onward referrals to specialists and hospitals to ensure patients are seen and feedback returns to the practice.

**Applies to:** Reception team; referring clinician
**Frequency:** Continuous
**Evidence:** Referral tracker
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### At the Point of Referral
- Referral letter and attachments completed.
- Patient told what to expect and likely timeframe.
- Tracker entry created — patient, destination, date sent, expected response window.
- Copy of letter on patient file.

### Chasing
1. Two-week wait / USC referrals. Check acknowledgement within 1 working day; confirm patient appointment within agreed local timeframe.
2. Routine referrals. If no response in 4–6 weeks — contact the patient to check if they have heard, then chase the provider.
3. Specialist letter back. Filed in patient record on receipt; clinician informed; any actions actioned.

### Referral Did Not Happen
- Patient did not attend specialist — note in record, contact patient, re-refer if appropriate.
- Referral rejected by provider — discuss with clinician, refer elsewhere or contact patient.
- Provider lost referral — re-send, escalate to ICB if recurring.

## Records & sign-off
- Referral tracker: patient, referred to, date sent, acknowledged, patient seen, outcome on file.
- Local sign-off: Clinical Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Lab Work Handling SOP",
    type: "sop",
    category: "lab_work",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "MDR/UKCA Devices"],
    body: `# Lab Work Handling SOP

**Owner:** Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How dental impressions, models and prostheses are sent, received, decontaminated and tracked.

**Applies to:** Clinical staff; reception team
**Frequency:** Continuous
**Evidence:** Lab tracker; decontamination records
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Outgoing Impressions / Items
1. Decontaminate. Rinse, disinfect per manufacturer IFU before packaging.
2. Label decontaminated. Sticker / form confirming the item has been decontaminated before despatch.
3. Complete lab ticket. Patient ID, clinician, shade, materials, design, date required.
4. Log in tracker. Date sent, lab, expected return date.

### Incoming Returns
- Confirm decontamination certificate / statement from the lab.
- Check item against the ticket — correct patient, design, shade.
- Re-disinfect on receipt if your local policy requires.
- Store in patient-labelled bag in the lab cupboard.
- Notify reception that the work has arrived; book / confirm fit appointment.

### Quality Issues
- Wrong item, wrong shade, poor fit — quarantine and contact lab same day.
- Damage in transit — photograph, log, contact lab.
- Repeat issues with same lab — escalate to Practice Manager / Clinical Lead.

## Records & sign-off
- Lab tracker: patient, lab, item, sent, due back, received.
- Local sign-off: Practice Manager / Clinical Lead and date.

_References: CQC Reg 17 · GDC Standards · MDR/UKCA Devices_
`
  },
  {
    packKey: "practice_operations",
    title: "Stock Ordering SOP",
    type: "sop",
    category: "stock",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "MHRA Storage Guidance"],
    body: `# Stock Ordering SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How clinical and non-clinical stock is ordered, received, rotated and recorded.

**Applies to:** Practice Manager; nominated stock leads
**Frequency:** Continuous; weekly check
**Evidence:** Stock control file; invoices
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Stock Categories
- Clinical disposables — gloves, masks, suction tips, cups.
- Restorative materials — composite, bond, cement, matrix.
- Decontamination consumables — pouches, indicator strips, detergents.
- Drugs & emergency stock — see Emergency Drugs Check SOP.
- Office & reception — toner, paper, cleaning materials.

### Ordering
1. Reorder level. Defined for each item — order when stock falls to the reorder level, not after running out.
2. Approved supplier list. Pricing reviewed annually.
3. Authorise. Practice Manager signs off orders over the agreed threshold.
4. Track. Date ordered, expected delivery, invoice received.

### On Receipt
- Check items against the order.
- Check expiry dates — newest stock to the back.
- Store at correct temperature.
- File the delivery note and invoice.
- Update the stock control sheet.

## Records & sign-off
- Stock audit: item, current stock, reorder level, expiry of next pack, operator, action.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards · MHRA Storage Guidance_
`
  },
  {
    packKey: "practice_operations",
    title: "Equipment Fault Reporting SOP",
    type: "sop",
    category: "equipment",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards"],
    body: `# Equipment Fault Reporting SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How equipment faults are reported, isolated and tracked through to repair.

**Applies to:** All staff
**Frequency:** On any fault
**Evidence:** Equipment fault log; service reports
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### On Recognising a Fault
1. Stop using. Label "DO NOT USE" with date, time and reporter.
2. Isolate. Switch off; unplug where safe.
3. Notify Practice Manager. Same shift.
4. Document. Equipment fault log — make, model, serial, fault description, when it started.

### Decide Next Step
- Engineer call-out — service contract or pay-per-call.
- Borrow from a sister site if available.
- Cancel / re-schedule patients if equipment is essential and replacement not available.
- Notify MHRA if a device caused or could have caused harm (Yellow Card system).

### Return to Use
- Engineer report on file.
- Any required validation / QA repeated.
- Cleared by Clinical Lead / RPS / IPC Lead as appropriate before patient use.

## Records & sign-off
- Fault log: date / time, reporter, equipment, fault description, action taken, cleared by & date.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards_
`
  },
  {
    packKey: "practice_operations",
    title: "Fridge Temperature Monitoring SOP",
    type: "sop",
    category: "fridge",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "PHE/UKHSA Cold Chain", "MHRA Storage"],
    body: `# Fridge Temperature Monitoring SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Daily check of the drug-storage fridge to ensure medicines and lab materials are kept within the required cold chain.

**Applies to:** Named fridge checker(s)
**Frequency:** Every working day, twice if possible
**Evidence:** Fridge temperature log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### The Standard
- Fridge temperature kept between 2 °C and 8 °C.
- Calibrated min/max thermometer reset each day.
- Reading recorded with date, time, min and max since last reset, and operator signature.

### What Is Stored
- Vaccines (where the practice provides any).
- Local anaesthetic stock (per manufacturer IFU — some require fridge, others not).
- Glucagon emergency drug.
- Some lab materials.

### Out-of-Range Reading
1. Do not use the contents until cleared.
2. Investigate. Door left open, fridge fault, power failure, recent loading of warm items.
3. Check manufacturer guidance. Some products tolerate brief excursions; others must be discarded.
4. Notify Practice Manager / supplier.
5. Record on log and incident form if applicable.

## Records & sign-off
- Fridge log: date, AM reading, PM reading, min since reset, max since reset, operator.
- Local sign-off: Clinical Lead / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards · PHE/UKHSA Cold Chain · MHRA Storage_
`
  },
  {
    packKey: "practice_operations",
    title: "Keyholding & Security SOP",
    type: "sop",
    category: "security",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "HSE Lone Working Guidance"],
    body: `# Keyholding & Security SOP

**Owner:** Practice Owner
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How keys, alarm codes and access to the practice are managed safely — including out-of-hours arrangements.

**Applies to:** Named keyholders; Practice Owner
**Frequency:** Continuous; annual review
**Evidence:** Keyholder register; alarm code log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### Keyholders
- Named keyholder register held by Practice Owner and Practice Manager.
- Each keyholder signs to confirm receipt of keys and alarm code.
- Keys returned on leaving employment, recorded as returned.
- Alarm codes changed on personnel change and at least annually.

### Out-of-Hours Access
- Only authorised keyholders may enter alone.
- Lone working — see Lone Working SOP.
- Contractors accompanied by a member of staff.
- Visit recorded in the access log.

### Lost or Compromised Key
1. Report immediately to Practice Manager.
2. Change locks or alarm code that day.
3. Risk-assess what was potentially exposed.
4. Log and review at next governance meeting.

## Records & sign-off
- Keyholder register: name, role, keys held, date issued, alarm code issued, date returned.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards · HSE Lone Working Guidance_
`
  },
  {
    packKey: "practice_operations",
    title: "Lone Working SOP",
    type: "sop",
    category: "lone_working",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "HSE Lone Working Guidance"],
    body: `# Lone Working SOP

**Owner:** Practice Manager
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Working safely when alone in the practice — when it is permitted, when it isn't, and the controls in place.

**Applies to:** All clinical staff; Practice Manager
**Frequency:** Whenever someone works alone
**Evidence:** Lone working register; incident log
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### When Lone Working Is Not Permitted
- Treatment under sedation.
- Treatment of a child without a chaperone present.
- Treatment of any patient where a chaperone is needed (see Chaperone SOP).
- Surgical procedures with general or IV-sedation requirements.

### Controls When Lone Working Is Permitted
1. Risk assessment. Documented for the activity and the site.
2. Communication. Someone knows where you are and when to expect you back. Phone with charge. Buddy check-in at agreed time.
3. Emergency access. Phone within reach; emergency drugs and AED unlocked and accessible.
4. Patient identity. Confirm appointment is genuine before opening the door out-of-hours.

### After Hours / In an Empty Building
- Doors locked from inside while working.
- Avoid working with cash visible.
- Personal alarm carried where the risk assessment indicates.
- Welfare contact at the end of the session.

## Records & sign-off
- Lone working register: date, activity, worker, buddy, start / end times, check-in completed.
- Local sign-off: Practice Owner / Practice Manager and date.

_References: CQC Reg 17 · GDC Standards · HSE Lone Working Guidance_
`
  },
  {
    packKey: "practice_operations",
    title: "Chaperone SOP",
    type: "sop",
    category: "chaperone",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Reg 17", "GDC Standards", "GDC Standards 1.7", "GMC Chaperone Guidance"],
    body: `# Chaperone SOP

**Owner:** Clinical Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
When a chaperone is required during clinical examination or treatment, who acts as chaperone, and how the practice records it.

**Applies to:** All clinical staff
**Frequency:** Every time a chaperone is offered or used
**Evidence:** Chaperone record in patient file
**Standards:** CQC, GDC, HSE, practice policy

## Operating procedure

### When a Chaperone Is Offered or Required
- Any intimate examination — extremely rare in dentistry but possible (e.g. trauma involving face / mouth where assessment overlaps with other regions).
- Where the patient or clinician asks for one.
- For children and young people under 18 — parent / carer or another adult.
- For vulnerable adults.
- Whenever cultural, religious or personal preference is expressed.

### Who Acts as Chaperone
- A trained member of staff — usually a nurse — who understands the role.
- Visible to the patient throughout.
- Not a family member alone for adults (unless the patient prefers and the clinician agrees).
- For children — generally a parent / carer plus the dental nurse.

### Recording
1. Offer. Always offered, even if declined.
2. Decision. Record who chaperoned (or that the patient declined).
3. If patient declines but chaperone is required by policy. Re-explain, document the conversation, defer if needed.

## Records & sign-off
- Chaperone record: patient, date / treatment, chaperone present, chaperone role, offer accepted / declined.
- Local sign-off: Practice Manager / Clinical Lead and date.

_References: CQC Reg 17 · GDC Standards · GDC Standards 1.7 · GMC Chaperone Guidance_
`
  }
]
;

/* ── Safeguarding Governance master templates ─────────────────────── */

export const SAFEGUARDING_MASTER_TEMPLATES =
[
  {
    packKey: "safeguarding_governance",
    title: "Safeguarding Concern Recording SOP",
    type: "sop",
    category: "concern",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13"],
    body: `# Safeguarding Concern Recording SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How any staff member records a safeguarding concern about a child or adult, before deciding whether escalation or referral is needed.

- **Applies to:** All staff — clinical and non-clinical
- **Frequency:** Immediately on noticing a concern
- **Evidence:** Concern record on patient file; safeguarding log entry
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

If a child or adult is in immediate danger — call 999. Recording comes after the immediate response.

## What to record
- Date, time and location.
- Who was present.
- Exact words used by the patient — in quotation marks, not paraphrased.
- What you observed (injury, behaviour, demeanour) in factual terms.
- Any disclosure made — verbatim where possible.
- What you said in response.
- Action taken and who you informed.

## How to record
1. **Facts only.** Avoid opinion or interpretation. "The child said ..." not "the child seemed neglected".
2. **Body map.** Use the practice body-map template for any visible injury. Document size, colour, location and any patient/parent explanation.
3. **Same day.** Complete the record before the end of the clinical session. Never the next day.
4. **Sign and date.** The clinician completing the record signs it.

## Confidentiality
- Safeguarding information is shared on a need-to-know basis only.
- Do not promise confidentiality to the patient — explain you may need to share if they or someone else may be at risk.
- Records held securely; access logged.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Safeguarding Escalation SOP",
    type: "sop",
    category: "escalation",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13"],
    body: `# Safeguarding Escalation SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How a recorded concern is escalated within the practice for safeguarding review and decision on next steps.

- **Applies to:** All staff and the Safeguarding Lead
- **Frequency:** Immediately after a concern is recorded
- **Evidence:** Escalation entry on patient file; safeguarding log
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## Who to tell, in order
1. **Practice Safeguarding Lead.** Same day. Phone or face-to-face — not just an email.
2. **Deputy if Lead unavailable.** Each practice has at least one Deputy. Cover must be available every working day.
3. **External escalation if there is immediate risk.** 999 (immediate danger), 101 (non-emergency police), MASH / Children's Services / Adult Social Care, or LADO (allegations against staff).

## What the Safeguarding Lead does
- Reviews the recording within the same working day.
- Decides whether to refer externally — Children's Services, Adult Safeguarding Team, LADO, police.
- Discusses with another senior colleague where uncertain (proportionate, not delaying).
- Records the decision and the rationale on the patient file.
- Updates the staff member who raised the concern.

## When you can bypass the practice lead
- Immediate danger — call 999.
- You believe escalation is being blocked or delayed inappropriately — contact the local Designated Safeguarding Professional, ICB safeguarding team, or the NSPCC helpline (0808 800 5000) for advice.
- Allegation involves the Safeguarding Lead — go to the Deputy or directly to LADO.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Safeguarding Referral SOP",
    type: "sop",
    category: "referral",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13"],
    body: `# Safeguarding Referral SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How a safeguarding referral is made to Children's Services, Adult Safeguarding or the police — and what is recorded after.

- **Applies to:** Safeguarding Lead and Deputy
- **Frequency:** Whenever an external referral is needed
- **Evidence:** Referral form / call log; acknowledgement; safeguarding log
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## When to refer
- Reasonable belief a child or adult is at risk of significant harm.
- Disclosure of abuse — physical, sexual, emotional, financial, neglect.
- Patterns of unexplained injury, missed appointments, dental neglect (see Dental Neglect SOP).
- Allegation against a member of staff (see Allegations Against Staff & LADO SOPs).

## Making the referral
1. **Phone first.** Speak to MASH / Adult Safeguarding Team during office hours; out-of-hours team or 999 outside.
2. **Follow up in writing.** Use the local referral form — most authorities require this within 24 or 48 hours.
3. **Share what you have.** Identifying information, the concern, what the patient said, your recording, any history.
4. **Ask for an acknowledgement.** Confirm the referral was received, who is handling it and when feedback can be expected.

## Consent & information sharing
- Tell the patient (or parent for a child where safe to do so) you are making a referral — unless doing so increases risk.
- You do not need consent to share information if there is a safeguarding risk. UK GDPR Article 6 / Article 9 conditions are met.
- Record what you shared, with whom, when and why.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Dental Neglect Escalation SOP",
    type: "sop",
    category: "neglect",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "BSPD Dental Neglect Guidance"],
    body: `# Dental Neglect Escalation SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice recognises and escalates suspected dental neglect of a child — using the three-stage prevention, intervention and escalation model.

- **Applies to:** All clinical staff treating children
- **Frequency:** On recognition of concern
- **Evidence:** Patient record; safeguarding log; correspondence with parents and other agencies
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## What dental neglect looks like
- Severe untreated decay causing pain or infection without timely treatment.
- Repeated failure to bring the child for care after recall or treatment plan.
- Failure to provide appropriate diet, brushing or fluoride exposure.
- Persistent failure to attend appointments despite the child being in pain.

## The three-stage model (BSPD)
1. **Preventive dental team management.** Raise concern with parents, explain risk, deliver prevention (toothbrushing, fluoride, diet advice), arrange next appointment, record everything.
2. **Preventive multi-agency management.** If no change after a clear, recorded plan — liaise with the child's GP, health visitor, school nurse and other involved professionals. Share information and agree a joint plan.
3. **Child protection referral.** Where dental neglect persists despite stages 1 and 2, or where there is wider neglect — make a safeguarding referral to Children's Services.

## Communicating with parents
- Be clear, calm, non-judgemental and specific about what needs to change.
- Put the plan in writing, with timescales and the consequence of non-attendance.
- Document each conversation verbatim where possible.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · BSPD Dental Neglect Guidance_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Allegations Against Staff SOP",
    type: "sop",
    category: "allegations",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "Working Together to Safeguard Children 2023", "LADO Statutory Guidance"],
    body: `# Allegations Against Staff SOP

**Owner:** Practice Owner / Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How an allegation about the behaviour of a member of staff is received, managed and escalated — with particular care for impartiality and confidentiality.

- **Applies to:** Practice Owner, Safeguarding Lead, HR
- **Frequency:** Immediately on receipt of an allegation
- **Evidence:** Allegation record; LADO correspondence; HR investigation file
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

Allegations are taken seriously regardless of source. They include behaviour that has harmed or may have harmed a child or adult, possible criminal offence, or behaviour indicating unsuitability to work with children or vulnerable adults.

## On receiving an allegation
1. **Listen — do not investigate.** Take notes, repeat back key points to check, thank the person for raising it. Do not promise confidentiality.
2. **Notify the Safeguarding Lead and Practice Owner.** Same day. If either is the subject, notify the Deputy / external designated professional instead.
3. **Contact LADO.** For allegations against a person who works with children — within one working day. LADO advises on next steps.
4. **Consider precautionary action.** Suspension is a neutral act and may be necessary to allow investigation. Take HR / indemnity advice.

## Confidentiality and communication
- Need-to-know basis only.
- The accused is told as soon as it is consistent with the investigation (LADO advises timing).
- The complainant is supported and updated where appropriate.
- No discussion in shared areas or on personal devices.

## After the outcome
- Substantiated — referral to police / GDC / DBS as appropriate; HR action.
- Unsubstantiated / malicious — restore staff member, learn from process.
- Inconclusive — agree closure with LADO; record on personnel file.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · Working Together to Safeguard Children 2023 · LADO Statutory Guidance_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "LADO Escalation SOP",
    type: "sop",
    category: "lado",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "Working Together to Safeguard Children 2023", "LADO Statutory Guidance"],
    body: `# LADO Escalation SOP

**Owner:** Practice Owner / Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How and when to contact the Local Authority Designated Officer (LADO) about an allegation involving someone who works with children.

- **Applies to:** Practice Owner, Safeguarding Lead
- **Frequency:** Within one working day of the allegation
- **Evidence:** LADO referral form; case reference; correspondence
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## LADO threshold
Contact LADO when an allegation is made that an adult who works with children has:

- Behaved in a way that has harmed, or may have harmed, a child.
- Possibly committed a criminal offence against, or related to, a child.
- Behaved towards a child in a way that indicates they would pose a risk of harm to children.
- Behaved or may have behaved in a way (in their personal life) that indicates unsuitability to work with children.

## Process
1. **Within one working day.** Phone LADO; follow up with written referral on the local form.
2. **Share what is known.** Allegation, dates, parties involved, action already taken, indemnity / HR position.
3. **Follow LADO advice.** LADO may convene a strategy meeting, advise on police involvement, on suspension and on communication.
4. **Coordinate with HR.** Disciplinary process runs alongside LADO advice — never instead of.

## Common pitfalls
- Investigating internally first — LADO must be informed in parallel, not after.
- Treating a low-level concern as too minor — LADO will help decide threshold.
- Failure to share information with police or DBS where required.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · Working Together to Safeguard Children 2023 · LADO Statutory Guidance_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Whistleblowing SOP",
    type: "sop",
    category: "whistleblowing",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "PIDA 1998", "Freedom to Speak Up Guardian Guidance"],
    body: `# Whistleblowing SOP

**Owner:** Practice Owner
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How any member of staff can raise concerns about wrongdoing in the practice — patient safety, fraud, malpractice — and the protection they receive when they do.

- **Applies to:** All staff
- **Frequency:** As needed
- **Evidence:** Whistleblowing record; investigation file
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

Speaking up protects patients. The practice supports staff who raise concerns and prohibits any detriment to a worker who blows the whistle in good faith.

## What counts as a whistleblowing concern
- Patient safety or quality of care concern.
- Criminal offence, including fraud.
- Failure to meet a legal obligation (Health & Safety, IPC, IR(ME)R, data protection).
- Miscarriage of justice or covering up wrongdoing.
- Damage to the environment.

## How to raise a concern
1. **In-practice.** Speak to your line manager, Safeguarding Lead, Practice Manager or Practice Owner. In writing or face-to-face. Anonymous reports accepted but harder to investigate.
2. **Freedom to Speak Up Guardian.** Where the practice has appointed one, contact directly.
3. **External — Prescribed Persons.** CQC, GDC, HSE, NHS England and others are prescribed under the Public Interest Disclosure Act for relevant matters.
4. **Independent advice.** Protect (formerly Public Concern at Work) — 020 3117 2520.

## Protections
- Workers who raise concerns in good faith are protected under PIDA 1998.
- The practice does not investigate the reporter; it investigates the concern.
- Confidentiality maintained as far as possible — anonymity respected on request.
- No detriment — disciplinary action for raising a concern is not permitted.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · PIDA 1998 · Freedom to Speak Up Guardian Guidance_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Domestic Abuse Disclosure SOP",
    type: "sop",
    category: "domestic_abuse",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "Domestic Abuse Act 2021", "SafeLives Guidance"],
    body: `# Domestic Abuse Disclosure SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How to respond when a patient discloses domestic abuse, the support available and the safeguarding actions required.

- **Applies to:** All clinical staff
- **Frequency:** On disclosure
- **Evidence:** Confidential record on patient file; referral correspondence
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## Listen and believe
- Find a private space — never discuss in front of a partner or family member.
- Use simple, non-leading questions: "Is there anything you'd like to tell me?"
- Listen without judgement. Do not pressure the patient to leave.
- Believe what is said and acknowledge their courage in disclosing.

## Risk and safety
1. **Assess immediate risk.** Is the patient safe to leave today? Children involved? Recent escalation?
2. **Safety planning.** Discuss simple steps: keep ID and money accessible, agreed code word, places to go.
3. **Signpost specialist support.** National Domestic Abuse Helpline (0808 2000 247, 24/7), Refuge, local IDVA service.
4. **Children at risk.** If children may be at risk — a referral is required under the Children Act regardless of the adult patient's consent.

## Recording
- Confidential record — flagged in the patient file, with restricted access.
- Be aware that the alleged perpetrator may share the same address or be a patient of the practice.
- Do not put information on a routine appointment reminder, letter or invoice where it could be seen by the perpetrator.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · Domestic Abuse Act 2021 · SafeLives Guidance_
`
  },
  {
    packKey: "safeguarding_governance",
    title: "Mental Capacity & Coercion Escalation SOP",
    type: "sop",
    category: "capacity",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["Care Act 2014", "Children Act 2004", "GDC Standards", "CQC Reg 13", "Mental Capacity Act 2005", "MCA Code of Practice"],
    body: `# Mental Capacity & Coercion Escalation SOP

**Owner:** Safeguarding Lead
**Review cycle:** Annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How to assess capacity for dental treatment decisions and escalate where a patient appears to be under coercion or undue pressure.

- **Applies to:** All clinical staff treating adults
- **Frequency:** Whenever capacity is in doubt or coercion suspected
- **Evidence:** Capacity assessment record; best-interest decision; safeguarding log
- **Standards:** Working Together 2023, Care Act 2014, GDC Standards 8

## The five principles (Mental Capacity Act 2005)
1. **Assume capacity** unless established otherwise.
2. **Support the decision.** Take all practicable steps to help the person decide — simple language, visual aids, time.
3. **Unwise is not the same as incapable.**
4. **Best interests** apply where the person lacks capacity for the specific decision.
5. **Least restrictive** option chosen.

## The two-stage test
- **Diagnostic test.** Is there an impairment of, or disturbance in the functioning of, the mind or brain?
- **Functional test.** Can the person understand the information, retain it, weigh it up, and communicate a decision?

If the answer to any of the four functional elements is no for the specific decision at this time, the person lacks capacity for that decision.

## Spotting coercion
- Another person answers questions on the patient's behalf or pressurises a "right" answer.
- Patient appears anxious, watching, deferring to a companion.
- Inconsistencies between patient's words alone vs in company.
- Disclosures of financial or social pressure.

## Escalation
- Speak to the patient privately if you have any doubt.
- Where capacity is genuinely lacking and decisions need to be made — best-interest decision involving family, advocate, GP and Safeguarding Lead.
- Where you suspect coercion or financial abuse — adult safeguarding referral.
- Where physical injury or sexual abuse — police as well as safeguarding.

_References: Care Act 2014 · Children Act 2004 · GDC Standards · CQC Reg 13 · Mental Capacity Act 2005 · MCA Code of Practice_
`
  }
]
;

/* ── Audit & Evidence master templates ─────────────────────────────── */

export const AUDIT_EVIDENCE_MASTER_TEMPLATES =
[
  {
    packKey: "audit_evidence",
    title: "Audit Programme Planning SOP",
    type: "sop",
    category: "audit_planning",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "CQC Reg 17", "NHS Contracts"],
    body: `# Audit Programme Planning SOP

**Owner:** Clinical Lead, Practice Manager, Audit Lead
**Review cycle:** Annual programme; quarterly review
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice plans its annual audit cycle — selecting topics, assigning leads, scheduling and aligning with CQC inspection expectations.

## Required evidence
Annual audit calendar, topic register, audit action log.

**Standards:** CQC Fundamental Standards (Regs 12, 17), GDC Enhanced CPD.

## The Annual Audit Cycle
- Minimum two cycles of clinical audit per dentist per 2-year period (GDC Enhanced CPD requirement when audit is part of recommended topics).
- Practice-wide schedule covers compulsory and risk-based topics.
- Each audit assigned a lead, deadline, sample size and re-audit point.
- Topics revisited annually or whenever an incident, complaint or inspection finding suggests review.

## Recommended Topic List
- Infection prevention & control (IPC) — 6-monthly.
- Radiography image quality (digital) — quarterly.
- Record keeping — quarterly per clinician.
- Hand hygiene observation — annual + spot-checks.
- Antimicrobial prescribing — annual.
- Medical emergency drills & kit checks — quarterly.
- Consent documentation — annual.
- Patient experience / Friends & Family — continuous; quarterly review.
- Mandatory training compliance — quarterly.
- Significant event analysis — each event + annual summary.

## Operating procedure
1. Plan in advance. Set the annual calendar at the April / May governance meeting.
2. Sample & method. Each audit uses a written method, sample size and accepted standard.
3. Report findings. Brief one-page summary; results to the practice meeting.
4. Action plan. Each action owned, dated, tracked to closure.
5. Re-audit. To confirm the change worked.

_References: CQC Inspection Framework · GDC Standards · CQC Reg 17 · NHS Contracts_
`
  },
  {
    packKey: "audit_evidence",
    title: "CQC Evidence Pack Compilation SOP",
    type: "sop",
    category: "evidence_pack",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "CQC Reg 17", "NHS Contracts"],
    body: `# CQC Evidence Pack Compilation SOP

**Owner:** Practice Manager, CQC Registered Manager, Clinical Lead
**Review cycle:** Continuous; full review quarterly
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice keeps a continuously updated CQC evidence pack ready for inspection — mapped to the five key questions (Safe, Effective, Caring, Responsive, Well-led).

## Required evidence
CQC evidence index, source documents, version log.

**Standards:** CQC Key Lines of Enquiry, single assessment framework.

## Structure Of The Evidence Pack
- Safe — IPC audits, medical emergency drills, radiography QA, sharps incidents, safeguarding records, complaints, DBS / immunisation records.
- Effective — Clinical audits, treatment outcomes, CPD records, consent audit, antimicrobial prescribing data.
- Caring — Patient feedback, FFT, complaint themes & learning, accessibility evidence.
- Responsive — Triage SOP and audit, waiting times, complaints response times, accessibility audit.
- Well-led — Governance meetings, action logs, SEAs, leadership development, mandatory training compliance, staff survey, whistleblowing.

## Source-Document Discipline
- Every claim in the evidence pack links to a controlled source document.
- Documents version-controlled, dated and approved.
- Live audit / action data drawn from the central audit register, not separate spreadsheets.
- Anonymised case examples retained (with patient consent / anonymisation).

## Operating procedure
1. Audit register review. Confirm latest audits, actions and re-audits filed.
2. Significant events. Anonymised summary added for the quarter.
3. Training matrix. Updated to reflect current compliance levels.
4. Index check. Top-level index updated with current links / versions.

_References: CQC Inspection Framework · GDC Standards · CQC Reg 17 · NHS Contracts_
`
  },
  {
    packKey: "audit_evidence",
    title: "Infection Prevention & Control Audit SOP",
    type: "sop",
    category: "infection_control_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "HTM 01-05", "FGDP/CGDent Audit Toolkit"],
    body: `# Infection Prevention & Control Audit SOP

**Owner:** IPC Lead and named auditors
**Review cycle:** 6-monthly minimum; CQC expects evidence of action plans
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How the practice audits compliance with HTM 01-05 and SDCEP IPC standards — the most-inspected audit topic by the CQC.

## Required evidence
Audit form, photographic evidence, action log, re-audit results.

**Standards:** HTM 01-05 (essential and best practice), SDCEP IPC, CQC Regulation 12.

## Scope Of The Audit
- Decontamination room layout (dirty-to-clean flow).
- Cleaning & sterilisation cycles and records.
- Surgery turnaround and surface decontamination.
- Hand hygiene compliance.
- PPE use and supply.
- Waste segregation & storage.
- Sharps management.
- DUWL management.
- Staff training and immunisation records.

## Operating procedure
1. Use the HTM 01-05 self-assessment. Or SDCEP equivalent — scored against essential and best-practice requirements.
2. Walk-through observation. Decontamination room, surgeries, waste store, sharps points, hand-wash basins.
3. Document review. Logs, training records, manufacturer IFU, service contracts.
4. Score & report. Essential standards met = pass. Any gaps trigger immediate action.
5. Re-audit. At 3 months for any unmet essential standard; 6 months for best-practice gaps.

## Common Findings To Probe
- Mixing of dirty and clean instruments.
- Pouches stored in clinical splash zone.
- Missing daily / weekly test records.
- PPE doffing sequence and supply.
- DUWL CFU above 200 / ml.

_References: CQC Inspection Framework · GDC Standards · HTM 01-05 · FGDP/CGDent Audit Toolkit_
`
  },
  {
    packKey: "audit_evidence",
    title: "Radiography (IR(ME)R) Audit SOP",
    type: "sop",
    category: "radiography_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "IRMER 2017", "IRR17", "FGDP/CGDent Selection Criteria"],
    body: `# Radiography (IR(ME)R) Audit SOP

**Owner:** IR(ME)R Lead, RPS
**Review cycle:** Quarterly image quality; annual IR(ME)R compliance
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Sampling and grading radiographs against quality standards and confirming IR(ME)R duty-holder compliance.

## Required evidence
Image grade tally, justification audit, retake / reject analysis.

**Standards:** IR(ME)R 2017 & 2024 amendment, CGDent / FGDP Selection Criteria.

## Image Quality Audit (Quarterly)
- Sample minimum 50 images per operator per quarter.
- Grade A (acceptable) / N (not acceptable) — see SOP-RAD-04.
- Target ≥ 70% Grade A digital; < 10% Grade N.
- Reject / retake analysis — note reason.

## IR(ME)R Compliance Audit (Annual)
- Justification recorded for each exposure.
- Clinical evaluation recorded on every image.
- Entitlement matrix current.
- Pregnancy enquiry documented where biologically relevant.
- Incident / SAUE records reviewed.
- CBCT governance (if applicable) — justification, optimisation, full-volume reporting.

## Operating procedure
1. Operator below target. Targeted feedback, retraining, CPD plan.
2. Justification gaps. Document template update; re-train.
3. SAUE found in retrospect. Report through Radiography Incident SOP.

_References: CQC Inspection Framework · GDC Standards · IRMER 2017 · IRR17 · FGDP/CGDent Selection Criteria_
`
  },
  {
    packKey: "audit_evidence",
    title: "Record Keeping Audit SOP",
    type: "sop",
    category: "record_keeping_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "FGDP/CGDent Clinical Examination & Record Keeping"],
    body: `# Record Keeping Audit SOP

**Owner:** Each clinician; Clinical Lead
**Review cycle:** Quarterly per clinician
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Quarterly audit of clinical records against GDC standards and FGDP record-keeping criteria.

## Required evidence
Audit grids, action plans, reflective notes.

**Standards:** GDC Standards 4, FGDP Clinical Examination & Record-Keeping.

## Sample & Method
- 10 random records per clinician per quarter.
- Audit grid based on FGDP minimum dataset.
- Peer-review preferred — a colleague audits, not the clinician themselves.

## Items Audited
- Medical history reviewed and signed at every visit.
- BPE / periodontal status recorded.
- Caries, restorations and missing teeth charted.
- Soft tissue / oral cancer screen recorded.
- Radiographs justified and clinically evaluated.
- Treatment plan, options and costs documented.
- Consent recorded.
- Post-op advice given.
- Recall set per NICE guidance.

## Operating procedure
1. Score each record. Pass / partial / fail per item.
2. Target ≥ 95%. Anything below triggers individual feedback and re-audit.
3. Themes. Practice-wide gaps go to the next governance meeting.

_References: CQC Inspection Framework · GDC Standards · FGDP/CGDent Clinical Examination & Record Keeping_
`
  },
  {
    packKey: "audit_evidence",
    title: "Hand Hygiene Audit SOP",
    type: "sop",
    category: "hand_hygiene_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "WHO 5 Moments", "NICE Hand Hygiene"],
    body: `# Hand Hygiene Audit SOP

**Owner:** IPC Lead and trained observers
**Review cycle:** Annual minimum; spot-checks each quarter
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Observation-based audit of WHO 5-Moments hand hygiene compliance — the single most evidence-based IPC measure.

## Required evidence
Observation forms, compliance score, action plan.

**Standards:** WHO 5 Moments, HTM 01-05, NICE QS61.

## Method
- 20-minute structured observation per surgery / clinical area.
- Observer documents each hand-hygiene opportunity and whether it was taken.
- Five moments — before patient contact, before clean / aseptic procedure, after body fluid risk, after patient contact, after patient surroundings.
- Targets ≥ 95% compliance.

## Where To Observe
- Surgery during a patient session.
- Decontamination room dirty side / clean side.
- Reception / waiting area touchpoints.
- Hygienist room during periodontal procedures.

## Operating procedure
1. Report headline compliance number anonymously to the team.
2. Discuss improvement actions at the next practice meeting.
3. Re-audit within 3 months when compliance falls below 90%.

_References: CQC Inspection Framework · GDC Standards · WHO 5 Moments · NICE Hand Hygiene_
`
  },
  {
    packKey: "audit_evidence",
    title: "Antimicrobial Prescribing Audit SOP",
    type: "sop",
    category: "antimicrobial_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "SDCEP Prescribing", "NICE NG15"],
    body: `# Antimicrobial Prescribing Audit SOP

**Owner:** All prescribing clinicians
**Review cycle:** Annual minimum
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Annual audit of antibiotic prescribing against the FGDP / SDCEP Drug Prescribing for Dentistry standards, in line with national antimicrobial stewardship.

## Required evidence
Prescribing audit form, action plan, CPD reflection.

**Standards:** SDCEP Drug Prescribing for Dentistry; FGDP Antimicrobial Prescribing; NICE NG15.

## What To Audit
- Indication appropriate (clear diagnosis of dental infection, not pulpitis alone).
- Drug, dose, frequency and duration match SDCEP guidance.
- Definitive dental treatment offered alongside or instead of antibiotics.
- Patient counselled on completing the course.
- Documented in the patient record.

## Operating procedure
1. Pull every antimicrobial prescription for the audit period (typically 3 months).
2. Score each. Pass / partial / fail against the items above.
3. Aggregate. By clinician and practice-wide.
4. Compare. Practice prescribing rate vs published national benchmark (NHSBSA dental prescribing data).

## Stewardship Actions
- Where indication unclear — replace antibiotic with definitive treatment or watchful waiting.
- Pulpitis without spreading infection: extirpation / extraction, not antibiotics.
- Provide patient leaflets on why antibiotics are sometimes withheld.

_References: CQC Inspection Framework · GDC Standards · SDCEP Prescribing · NICE NG15_
`
  },
  {
    packKey: "audit_evidence",
    title: "Patient Experience & Feedback Audit SOP",
    type: "sop",
    category: "patient_experience",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "NHS Friends & Family", "CQC Reg 17"],
    body: `# Patient Experience & Feedback Audit SOP

**Owner:** Practice Manager, Patient Experience Lead
**Review cycle:** Continuous; quarterly analysis
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Continuous collection of patient feedback (Friends & Family Test, NHS reviews, complaints, spontaneous compliments) with quarterly analysis.

## Required evidence
FFT returns, complaint themes, action log.

**Standards:** NHS Friends & Family Test guidance; CQC Caring domain.

## Channels
- NHS Friends & Family Test (where applicable).
- Post-visit text or email survey.
- Google & NHS UK reviews.
- Comment cards in reception.
- Complaints & compliments file.

## Quarterly Analysis
- Volume per channel.
- Response rate (where applicable).
- Themes — appointment access, communication, wait time, cost transparency, clinical quality.
- Top 3 positive themes for the quarter.
- Top 3 improvement themes — each with an owner.

## Operating procedure
1. You said / we did. Publish an anonymous summary in the waiting room and online — closing the feedback loop.

_References: CQC Inspection Framework · GDC Standards · NHS Friends & Family · CQC Reg 17_
`
  },
  {
    packKey: "audit_evidence",
    title: "Mandatory Training Compliance Audit SOP",
    type: "sop",
    category: "training_audit",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "GDC Standards (Lifelong Learning)", "CQC Reg 18"],
    body: `# Mandatory Training Compliance Audit SOP

**Owner:** Practice Manager, Training Lead
**Review cycle:** Quarterly
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Quarterly check that every member of staff is up to date on the practice mandatory training matrix.

## Required evidence
Training matrix, certificates on file, compliance score.

**Standards:** GDC Enhanced CPD, CQC Regulation 18.

## Core Mandatory Topics
- Basic Life Support & medical emergencies — annual.
- Infection prevention & control — annual.
- Safeguarding children — level appropriate to role — 3-yearly minimum.
- Safeguarding adults — level appropriate to role — 3-yearly minimum.
- Fire safety — annual.
- Health & safety — annual.
- Equality, diversity & inclusion — 3-yearly.
- Data protection / IG — annual.
- Disability awareness / accessibility — 3-yearly.
- Radiography (IRR / IR(ME)R) — 5-yearly for clinicians.
- GDC Enhanced CPD recommended topics — per cycle.

## Operating procedure
1. Training matrix. One row per staff member; one column per topic; date of last training, expiry date.
2. Quarterly check. Flag any topic expiring in the next 90 days.
3. Compliance %. Calculate practice-wide and per role.
4. Action plan. Book training to cover all expiring items before deadline.

_References: CQC Inspection Framework · GDC Standards · GDC Standards (Lifelong Learning) · CQC Reg 18_
`
  },
  {
    packKey: "audit_evidence",
    title: "Audit Action Plan Tracking SOP",
    type: "sop",
    category: "action_tracking",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["CQC Inspection Framework", "GDC Standards", "CQC Reg 17"],
    body: `# Audit Action Plan Tracking SOP

**Owner:** Audit Lead, Practice Manager
**Review cycle:** Continuous; reviewed monthly
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How findings from every audit, complaint, incident or external inspection are converted into trackable actions and verified to closure.

## Required evidence
Action register, governance minutes, verification notes.

**Standards:** CQC Regulation 17, NHS PSIRF.

## Action Register
Single register for actions across audits, complaints, incidents and inspections. Every action carries:
- Source (which audit / complaint / SEA).
- Description and success criterion.
- Named owner.
- Target date.
- Status — open / in progress / closed / overdue.
- Verification date (re-audit / observation).

## Operating procedure
1. Open actions. Progress check; chase overdue owners.
2. Closing. Confirm success criterion met before closing.
3. Verification. Plan re-audit at agreed interval.
4. Escalation. Actions overdue 30 days go to next governance meeting.

## The Closing Discipline
- No action closed without evidence — re-audit, observation, document update or training record.
- Closed actions sampled in CQC evidence pack to show learning is embedded.

_References: CQC Inspection Framework · GDC Standards · CQC Reg 17_
`
  }
]
;

/* ── Site-Specific SOPs master templates ───────────────────────────── */

export const SITE_SPECIFIC_MASTER_TEMPLATES =
[
  {
    packKey: "site_specific_sops",
    title: "Site Profile & Floor Plan SOP",
    type: "sop",
    category: "site_profile",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "HSE Workplace Regs 1992", "CQC Reg 15"],
    body: `# Site Profile & Floor Plan SOP

**Owner:** Practice Manager; Clinical Lead
**Review cycle:** Annual review; updated on any layout change
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
A controlled summary of each site — address, contacts, opening hours, surgery layout and zoning — kept current and used by every other site-specific SOP.

**Applies to:** Practice Manager; Clinical Lead
**Evidence:** Site profile sheet, floor plan, photographs, evacuation plan
**Standards:** CQC Regulation 17; HTM 01-05 layout principles

## Site Profile Contents
- Full address and registered CQC location code.
- Lead clinician, Registered Manager, RPS, IPC Lead, Safeguarding Lead.
- Opening hours; out-of-hours arrangements.
- Surgery count; chair list; specialties offered.
- Decontamination room location and capacity.
- Storage areas — drugs, waste, lab work, IT.
- Public areas — reception, waiting, accessible WC.

## Floor Plan
- Scaled or to-scale schematic of the building.
- Surgery numbering matches what reception uses.
- Decontamination dirty-to-clean flow marked.
- Fire exits, extinguishers, AED, oxygen and emergency drug kit locations marked.
- Controlled radiation areas marked.

## Operating procedure
1. Annual review. Confirm all details remain accurate.
2. On change. New equipment, room change, building works, staff role change — update same day.

_References: GDC Standards · CQC Reg 17 · HSE Workplace Regs 1992 · CQC Reg 15_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Local Equipment Register SOP",
    type: "sop",
    category: "equipment_register",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "MHRA Yellow Card", "CQC Reg 15"],
    body: `# Local Equipment Register SOP

**Owner:** Practice Manager; Equipment Lead; RPS
**Review cycle:** Continuous; full review annually
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Site-specific inventory of every clinical and decontamination equipment item, its service contract, validation status and operator entitlement.

**Applies to:** Practice Manager; Equipment Lead; RPS
**Evidence:** Equipment register; service reports; validation records
**Standards:** HTM 01-05; IRR17; manufacturer IFU; MHRA equipment management

## Items To Register
- X-ray units, OPG / cephalometric, CBCT (per site).
- Autoclaves, washer-disinfectors, ultrasonic baths.
- Dental chairs, lights, suction units, compressors.
- AED, oxygen cylinders, suction (emergency).
- Fridges for drugs and lab materials.
- Imaging sensors, intraoral cameras, scanners.
- IT — PCs, scanners, label printers.

## Register Fields
- Manufacturer, model, serial.
- Location and ID label.
- Install date; expected lifespan.
- Service contractor; contract end date.
- Last service / validation date; next due.
- Operator entitlement (for X-ray / CBCT).

## Operating procedure
1. Maintain the register continuously as equipment is acquired, serviced or decommissioned.
2. Removed items remain on the register marked "disposed" with date and contractor.
3. Hazardous items (amalgam separator, mercury thermometers) disposed via licensed contractor only.
4. Complete a full annual review and record reviewer, items in register, service due in next 90 days and issues identified.

_References: GDC Standards · CQC Reg 17 · MHRA Yellow Card · CQC Reg 15_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Site Emergency Escalation Map SOP",
    type: "sop",
    category: "emergency_map",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "Resus Council UK", "HSE First Aid Regs 1981"],
    body: `# Site Emergency Escalation Map SOP

**Owner:** All staff at the site
**Review cycle:** Posted in every clinical area; reviewed annually
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
A one-page escalation chart for each site — who to call, in what order, for medical, building, safeguarding and IT emergencies.

**Applies to:** All staff at the site
**Evidence:** Posted escalation chart; staff acknowledgement
**Standards:** CQC Regulation 12 & 17

## Categories
- Medical / cardiac: 999 → Clinical Lead → SBAR handover.
- Fire: Activate alarm → evacuate → 999 → Fire Marshal.
- Power / gas / water: Building services contractor → Practice Manager.
- IT outage / cyber: IT support → Practice Manager → ICO if data breach.
- Safeguarding immediate risk: 999 → Safeguarding Lead → LADO / Children's Services.
- Aggression / violence: 101 or 999 → Practice Manager → incident report.
- Radiation incident: RPS → RPA → CQC (if SAUE).
- Patient walk-in collapse: 999 → on-site clinician → AED + drugs kit.

## Local Contact Numbers
Each site holds its own list — populated on the records page (NHS 111, Practice Manager, Safeguarding Lead, RPS / RPA, building services, local children's services, IT support, LADO).

## Operating procedure
1. Post the chart in every surgery, decontamination room, reception and staff room.
2. Save the chart on the practice intranet for download.
3. Review the chart at every governance meeting.
4. Refresh local contact numbers on staff change or contractor change.

_References: GDC Standards · CQC Reg 17 · Resus Council UK · HSE First Aid Regs 1981_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Local Waste Contractor Arrangements SOP",
    type: "sop",
    category: "waste_contractor",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "HTM 07-01", "Hazardous Waste Regs 2005"],
    body: `# Local Waste Contractor Arrangements SOP

**Owner:** Practice Manager; nominated waste lead
**Review cycle:** Continuous; contractor reviewed every 2 years
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Site-specific arrangements for clinical, hazardous and amalgam waste collection — contractor, schedule, consignment notes and audit trail.

**Applies to:** Practice Manager; nominated waste lead
**Evidence:** Consignment notes; quarterly returns; contractor licence on file
**Standards:** Hazardous Waste Regulations 2005; HTM 07-01; Environment Agency

## Approved Contractor Details
Held on the records page — different per site. Must hold valid licence under the Waste Carriers Regulations.

## Schedule Of Collections
- Orange bag (infectious) — orange container — weekly or per local agreement.
- Yellow bag (chemical-contaminated) — yellow container — per agreement.
- Sharps — yellow lid — yellow rigid — when sealed.
- Sharps — purple lid (cytotoxic) — purple rigid — when sealed.
- Amalgam pot & separator canister — white rigid — when sealed.
- Pharmaceutical waste — blue lid — when sealed.
- Offensive / hygiene — tiger — per agreement.

## Operating procedure
1. Sign a consignment note at every collection.
2. Retain consignment notes for at least 3 years.
3. Hold quarterly returns for hazardous waste at the practice.
4. Check the contractor licence annually; renew before expiry.

_References: GDC Standards · CQC Reg 17 · HTM 07-01 · Hazardous Waste Regs 2005_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Local Service Contracts Register SOP",
    type: "sop",
    category: "service_contracts",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "HTM 01-05", "MHRA Storage Guidance"],
    body: `# Local Service Contracts Register SOP

**Owner:** Practice Manager; Equipment Lead
**Review cycle:** Continuous; reviewed quarterly
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Site-specific register of every service contract — autoclave, washer-disinfector, compressor, IT, waste, fire, alarm — with renewal dates and contractor details.

**Applies to:** Practice Manager; Equipment Lead
**Evidence:** Service contracts file; engineer reports; renewal log
**Standards:** CQC Regulation 15 (Premises & equipment)

## Categories Of Contract
- Clinical equipment service — autoclave, WD, ultrasonic, chairs, suction, compressor.
- Radiation equipment — X-ray, OPG, CBCT (per RPA / MPE schedule).
- Building services — boiler, air-conditioning, electrical, plumbing.
- Fire — alarm, extinguishers, emergency lighting.
- Security — intruder alarm, CCTV, lone-worker.
- IT & data — practice management software, cyber, backup.
- Waste — see Local Waste Contractor SOP.
- Cleaning — domestic cleaner; deep-clean contractor.

## Per Contract Record
- Contractor, contact and out-of-hours number.
- Service scope and frequency.
- Start and renewal dates.
- Cost and budget owner.
- Last engineer visit and report on file.

## Operating procedure
1. Renewal window. Flag contracts ending in the next 90 days.
2. Service evidence. Confirm engineer report on file for each.
3. Insurance & statutory. Pressure-vessel, electrical testing, fire risk assessment — in date.

_References: GDC Standards · CQC Reg 17 · HTM 01-05 · MHRA Storage Guidance_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Site-Specific Risk Assessments SOP",
    type: "sop",
    category: "risk_assessment",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "HSE Management of H&S at Work Regs 1999", "COSHH 2002"],
    body: `# Site-Specific Risk Assessments SOP

**Owner:** Practice Manager; Health & Safety Lead
**Review cycle:** Annual minimum; on incident or change
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How site-level risk assessments are maintained — fire, COSHH, manual handling, lone working, slips / trips, radiation — with named owners and review cycles.

**Applies to:** Practice Manager; Health & Safety Lead
**Evidence:** Signed risk assessments; review log
**Standards:** Management of Health & Safety at Work Regulations 1999; Regulatory Reform (Fire Safety) Order 2005

## Required Risk Assessments
- Fire — Practice Manager — annual.
- COSHH (cleaning agents, mercury, x-ray fixer, biocides) — H&S Lead — annual / on new product.
- Manual handling — H&S Lead — annual.
- Display screen equipment (DSE) — H&S Lead — annual / on workstation change.
- Slips / trips / falls — Practice Manager — annual.
- Lone working — Practice Manager — annual.
- Sharps — IPC Lead — annual.
- Pregnant / new mother staff — Practice Manager — on notification of pregnancy.
- Radiation (IRR17) — RPS — annual.
- Lockdown / aggression — Practice Manager — annual.

## Standard Structure
- Hazard identified.
- People at risk.
- Existing controls.
- Residual risk rating.
- Further actions and owners.
- Review date.

## Operating procedure
1. Maintain each assessment using the standard structure with a named owner and review date.
2. Trigger an out-of-cycle review on incident or near miss.
3. Trigger an out-of-cycle review on building, equipment or workflow change.
4. Trigger an out-of-cycle review for a new staff group (pregnancy, disability adjustment).
5. Trigger an out-of-cycle review on regulator, RPA or insurer recommendation.

_References: GDC Standards · CQC Reg 17 · HSE Management of H&S at Work Regs 1999 · COSHH 2002_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Fire Safety & Evacuation SOP",
    type: "sop",
    category: "fire_safety",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "Regulatory Reform (Fire Safety) Order 2005", "BS 9999"],
    body: `# Fire Safety & Evacuation SOP

**Owner:** All staff at the site
**Review cycle:** Drill twice a year; risk assessment annual
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
Site-specific fire arrangements — alarm system, evacuation routes, assembly point, drills, marshals and patient evacuation considerations.

**Applies to:** All staff at the site
**Evidence:** Fire risk assessment, drill log, alarm test log, extinguisher service
**Standards:** Regulatory Reform (Fire Safety) Order 2005; PAS 60518

## Posted Information
- Evacuation plan posted in every clinical area and corridor.
- Assembly point clearly identified outside.
- Names of fire marshals on staff board.
- Fire alarm test schedule and last test date displayed at reception.

## Patient Evacuation
1. Stop treatment safely. Remove sharps from the mouth; remove suction; stand the chair up.
2. Guide patients. Surgery clinician brings the patient to the nearest fire exit. Reception sweeps the waiting room.
3. Special needs. Wheelchair / mobility-impaired patients use the agreed evacuation chair / ramp / refuge point per the site layout.
4. Patient list. Reception brings the day's patient list to the assembly point.
5. Headcount. Fire Marshal completes headcount of staff and known patients.

## Drills & Testing
- Fire alarm test — weekly, recorded.
- Emergency lighting — monthly check; annual full discharge.
- Extinguishers — annual service; monthly visual check.
- Evacuation drill — twice a year; recorded with debrief.

## Operating procedure
1. Maintain the posted information and review at every governance meeting.
2. Run drills twice a year, debrief and record actions agreed.
3. Log every alarm test, emergency-light check and extinguisher service.
4. Update the fire risk assessment annually and after any incident or building change.

_References: GDC Standards · CQC Reg 17 · Regulatory Reform (Fire Safety) Order 2005 · BS 9999_
`
  },
  {
    packKey: "site_specific_sops",
    title: "Site Variation Approval SOP",
    type: "sop",
    category: "variation_approval",
    requiredFlag: null,
    linkedAuditType: null,
    references: ["GDC Standards", "CQC Reg 17", "GDC Standards 6.1"],
    body: `# Site Variation Approval SOP

**Owner:** Practice Manager; Clinical Lead; group Clinical Governance Lead
**Review cycle:** On any proposed variation; reviewed annually
**Version:** 1.0 — Reviewed May 2026

## Purpose & scope
How a site may safely deviate from a group-wide SOP when local conditions require it — and how that variation is approved, documented and reviewed.

**Applies to:** Practice Manager; Clinical Lead; group Clinical Governance Lead
**Evidence:** Variation register; risk assessment; approval signatures
**Standards:** CQC Regulation 17; GDC Standards

## When A Variation Is Allowed
- Local layout, equipment or service availability differs from the group standard.
- The group standard is impractical at the site without compromising safety.
- Patient-population factor (e.g. wheelchair-accessible setup, accessible suite arrangement).
- Local commissioning or NHS contract requirement.

## What Cannot Be Varied
- Statutory requirements (IRR17, IR(ME)R, HTM 01-05 essential, Care Act, safeguarding duties).
- National clinical guidance where mandated (SDCEP, NICE, BNF).
- Patient safety thresholds (medical emergency drug list, AED availability, sharps disposal).

## Operating procedure
1. Identify the gap. Specific SOP, specific clause, specific local reason.
2. Risk assess. What additional risk does the variation introduce? What controls compensate?
3. Draft the variation. Wording change, with reference back to the parent SOP.
4. Approve. Practice Manager + Clinical Lead at site; group Clinical Governance Lead at group level.
5. Communicate. All staff at the site briefed and acknowledge in writing.
6. Review. Annual review; remove the variation if circumstances change.

_References: GDC Standards · CQC Reg 17 · GDC Standards 6.1_
`
  }
]
;
