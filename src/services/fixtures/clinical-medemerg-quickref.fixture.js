/**
 * Medical Emergencies Quick Reference cards — chairside decision-support
 * content for the Clinical Resources Hub → Medical Emergencies tab.
 *
 * Evergreen reference derived from current UK guidance — anchored to the
 * Resuscitation Council UK (RCUK) Quality Standards for Cardiopulmonary
 * Resuscitation Practice and Training (Dental Practice), the RCUK Adult
 * BLS algorithm, RCUK ABCDE approach, BNF emergency drug doses, SDCEP
 * Drug Prescribing for Dentistry, NICE NG126 (acute care), CQC Reg 12
 * (safe care and treatment) and current GDC guidance on emergency
 * preparedness.
 *
 * Not controlled SOPs (those live under Governance & SOPs → Medical
 * Emergencies pack). Chairside reference for the team to act in the
 * first critical minutes — recognise → call → treat → document.
 */

export const medEmergQuickRefFixture = [
  /* ─── Card 1 · Anaphylaxis recognition & immediate management ───────────── */
  {
    id: "anaphylaxis",
    label: "Anaphylaxis — recognise, adrenaline, call",
    icon: "alert",
    format: "flow",
    summary: "ABCDE approach with adrenaline IM as the single most important intervention. Repeat at 5 min if no improvement.",
    sources: [
      { name: "Resuscitation Council UK — Emergency treatment of anaphylactic reactions", url: "https://www.resus.org.uk/library/additional-guidance/guidance-anaphylaxis" },
      { name: "RCUK Quality Standards for CPR Practice — Dental Practice", url: "https://www.resus.org.uk/library/quality-standards-cpr" },
      { name: "BNF — Adrenaline 1:1000 IM in anaphylaxis", url: "https://bnf.nice.org.uk/" },
    ],
    steps: [
      {
        n: 1,
        title: "Recognise — sudden onset, A / B / C compromise",
        targets: ["After trigger exposure — drug, latex, LA, antibiotic, food"],
        actions: [
          "Airway: hoarse voice, stridor, swelling of tongue / lips, difficulty swallowing.",
          "Breathing: wheeze, increased respiratory rate, fatigue, cyanosis, SpO₂ falling.",
          "Circulation: pale / clammy / tachycardia, hypotension, collapse.",
          "Skin (supportive, NOT diagnostic alone): urticaria, flushing, angio-oedema.",
        ],
        endpoint: "If ABC compromise after exposure → assume anaphylaxis. Don't wait for skin signs.",
      },
      {
        n: 2,
        title: "Call 999 — clearly state \"anaphylaxis\"",
        targets: ["Single-person team — call as you treat. Larger team — delegate the call."],
        actions: [
          "Dial 999. State: \"Anaphylaxis. Adult / child. Conscious / unconscious. Adrenaline given.\"",
          "Give the practice address and meet-point.",
          "Stay on the line until told to disconnect.",
        ],
        endpoint: "Paramedic en route. Practice door / lift access organised by a second team member.",
      },
      {
        n: 3,
        title: "Adrenaline IM — anterolateral thigh",
        targets: ["1:1000 solution. Repeat every 5 min if no improvement."],
        actions: [
          "Adult / child ≥ 12 yr: 500 micrograms (0.5 mL of 1:1000) IM.",
          "Child 6 to 11 yr: 300 micrograms (0.3 mL).",
          "Child 6 months to 5 yr: 150 micrograms (0.15 mL).",
          "Child < 6 months: 100–150 micrograms (0.1–0.15 mL).",
          "Inject anterolateral mid-thigh — through clothing if needed. Note the time.",
        ],
        endpoint: "First dose given. Set 5-minute timer. Prepare second dose.",
      },
      {
        n: 4,
        title: "Position, oxygen, monitor",
        targets: ["ABC support — patient comfort, oxygen, observation"],
        actions: [
          "Position — lie flat with legs raised (if breathing), upright if breathing difficulty severe, recovery position if vomiting / unconscious + breathing.",
          "High-flow oxygen — 15 L/min via non-rebreather mask.",
          "Monitor — pulse, SpO₂, respiration, level of response. Record every 1–2 min.",
          "Second adrenaline at 5 min if no clinical improvement.",
        ],
        endpoint: "Patient stable or improving. Continue monitoring until ambulance arrives.",
      },
      {
        n: 5,
        title: "Hand over to paramedic — full record",
        targets: ["SBAR or AT-MIST handover"],
        actions: [
          "Time of onset, trigger if known, sequence of symptoms.",
          "Adrenaline given — dose, route, time, response. Repeat doses if given.",
          "Other treatments — oxygen, fluids, positioning.",
          "Patient identifiers, medical history, allergies (known and now newly identified).",
        ],
        endpoint: "Patient transferred. Practice incident report opened. Duty of Candour conversation with patient / family afterwards.",
      },
    ],
  },

  /* ─── Card 2 · Adult Basic Life Support (BLS) algorithm ────────────────── */
  {
    id: "adult-bls",
    label: "Adult BLS — DRSABCD + CPR + AED",
    icon: "heart",
    format: "flow",
    summary: "Resuscitation Council UK Adult BLS algorithm — recognise cardiac arrest, start CPR, attach AED.",
    sources: [
      { name: "Resuscitation Council UK — Adult Basic Life Support", url: "https://www.resus.org.uk/library/2021-resuscitation-guidelines/adult-basic-life-support-guidelines" },
      { name: "RCUK Quality Standards for CPR Practice — Dental Practice", url: "https://www.resus.org.uk/library/quality-standards-cpr" },
    ],
    steps: [
      {
        n: 1,
        title: "DR — Danger, Response",
        targets: ["10 seconds, no more"],
        actions: [
          "Danger — is the area safe for you, the patient, the team?",
          "Response — shake shoulders, shout \"are you alright?\". No response → emergency.",
          "Shout for help — get a second team member to bring the emergency kit, AED and oxygen.",
        ],
        endpoint: "Patient unresponsive. Help summoned. Move to airway.",
      },
      {
        n: 2,
        title: "S — Send for help. A — Airway. B — Breathing",
        targets: ["10 seconds, look-listen-feel"],
        actions: [
          "Send — dial 999, state \"cardiac arrest, adult, CPR starting\". Send AED.",
          "Airway — head tilt + chin lift. Remove visible obstruction. Do not blind-sweep.",
          "Breathing — look, listen, feel for normal breathing for no more than 10 seconds.",
          "Agonal gasps = NOT normal breathing. Treat as arrest.",
        ],
        endpoint: "Not breathing normally → start CPR immediately.",
      },
      {
        n: 3,
        title: "C — Chest compressions",
        targets: ["30:2 ratio. Rate 100–120 / min. Depth 5–6 cm. Allow full recoil."],
        actions: [
          "Lower half of sternum (centre of chest). Heel of one hand, second hand on top, interlocked fingers.",
          "Arms straight, shoulders directly above hands.",
          "30 compressions then 2 rescue breaths if trained, oxygen and pocket mask / BVM available. Compressions-only if untrained or no barrier device.",
          "Minimise interruptions. Swap compressor every 2 min to avoid fatigue.",
        ],
        endpoint: "Effective CPR continuing. AED arriving.",
      },
      {
        n: 4,
        title: "D — Defibrillator (AED) — attach as soon as available",
        targets: ["Switch on, follow voice prompts, do not stop CPR while pads attach"],
        actions: [
          "Bare the chest. Dry skin if wet. Shave if very hairy (kit razor).",
          "Pads — one below right clavicle, one over lower-left lateral chest (V6 position).",
          "Continue CPR while pads attach. Stop only when AED says \"analysing\".",
          "Shock advised → ensure no one is touching the patient, deliver shock, immediately resume CPR for 2 min before next analysis.",
        ],
        endpoint: "AED in use. CPR continues 30:2 between shocks until paramedic arrives or patient recovers.",
      },
      {
        n: 5,
        title: "Hand over to paramedic — continuous record",
        targets: ["SBAR handover, AED data download"],
        actions: [
          "Time of arrest, witnessed / unwitnessed, time CPR started.",
          "Number of shocks delivered, drugs / interventions given.",
          "Underlying medical history if known, current medications.",
          "AED report download retained for the incident report.",
        ],
        endpoint: "Patient transferred. Team debrief. Incident review at next clinical governance meeting.",
      },
    ],
  },

  /* ─── Card 3 · Hypoglycaemia — conscious vs unconscious ─────────────────── */
  {
    id: "hypoglycaemia",
    label: "Hypoglycaemia — conscious vs unconscious",
    icon: "zap",
    format: "flow",
    summary: "Recognise low blood glucose; give oral glucose if conscious and able to swallow, glucagon IM if not.",
    sources: [
      { name: "Resuscitation Council UK — Medical emergencies in the dental practice", url: "https://www.resus.org.uk/library/additional-guidance" },
      { name: "BNF — Glucagon and oral glucose", url: "https://bnf.nice.org.uk/" },
      { name: "NICE NG28 — Type 2 diabetes (hypoglycaemia management)", url: "https://www.nice.org.uk/guidance/ng28" },
    ],
    steps: [
      {
        n: 1,
        title: "Recognise — sweating, shaking, confusion, drowsy",
        targets: ["Diabetic patient on insulin / sulfonylurea is the classic context"],
        actions: [
          "Sweating, pallor, tachycardia, tremor.",
          "Drowsy, confused, slurred speech, behavioural change, hostile.",
          "Severe: seizure, coma.",
          "Capillary blood glucose < 4.0 mmol/L (if meter available) — but treat empirically if symptoms typical and no meter.",
        ],
        endpoint: "Suspected hypoglycaemia → check ability to swallow safely.",
      },
      {
        n: 2,
        title: "Conscious + can swallow → oral fast-acting glucose",
        targets: ["15–20 g rapid-acting carbohydrate"],
        actions: [
          "Glucogel / Dextrogel — 1–2 tubes (15–20 g glucose) into the buccal sulcus, massage cheek.",
          "OR 3–4 glucose tablets dissolved in the mouth.",
          "OR a glass of sugary drink (NOT diet) — orange juice, full-sugar lemonade.",
          "Re-check after 10–15 min. Repeat if still < 4.0 mmol/L or symptomatic.",
        ],
        endpoint: "Once recovered → give a longer-acting carb (sandwich, biscuit) to prevent rebound.",
      },
      {
        n: 3,
        title: "Reduced consciousness / unable to swallow → glucagon IM",
        targets: ["Cannot give oral glucose safely — aspiration risk"],
        actions: [
          "Glucagon 1 mg IM (adult / child ≥ 25 kg). 0.5 mg IM (child < 25 kg).",
          "Reconstitute from kit — powder + diluent — shake gently, draw up, inject IM (deltoid or anterolateral thigh).",
          "Call 999 if glucagon used — patient needs assessment regardless of recovery.",
          "Recovery may take 5–15 min. Re-check glucose if meter available.",
        ],
        endpoint: "Once conscious + able to swallow → give oral carbs as in step 2.",
      },
      {
        n: 4,
        title: "Position, oxygen, monitor, escalate",
        targets: ["ABC support while waiting for recovery / paramedic"],
        actions: [
          "Position — recovery position if reduced consciousness.",
          "Oxygen — high-flow if SpO₂ < 94% or respiratory compromise.",
          "Monitor — pulse, respiration, level of response, glucose every 10–15 min.",
          "Escalate to 999 if: glucagon used, slow recovery, recurrent episode, seizure, repeat hypos within session.",
        ],
        endpoint: "Patient stable or transferred. Document trigger if identifiable (delayed appointment, missed meal, insulin timing).",
      },
      {
        n: 5,
        title: "After-care and prevention",
        targets: ["Reduce risk of recurrence"],
        actions: [
          "Patient should not drive for at least 45 min after recovery (DVLA standard).",
          "Eat a substantial snack / meal before leaving the practice.",
          "Review pre-treatment risk — appointment timing, last meal, medication timing — for future visits.",
          "Diabetic alert in the records updated. Consider liaison with patient's GP if recurrent hypos.",
        ],
        endpoint: "Incident logged. Risk-assessment for future appointments updated.",
      },
    ],
  },

  /* ─── Card 4 · Acute asthma severity & escalation ───────────────────────── */
  {
    id: "asthma-severity",
    label: "Acute asthma — severity & escalation",
    icon: "wind",
    format: "table",
    summary: "BTS / SIGN severity assessment in primary care, salbutamol via spacer, when to call 999.",
    sources: [
      { name: "BTS / SIGN — British Guideline on the Management of Asthma", url: "https://www.brit-thoracic.org.uk/quality-improvement/guidelines/asthma/" },
      { name: "Resuscitation Council UK — Medical emergencies in dental practice", url: "https://www.resus.org.uk/library/additional-guidance" },
    ],
    columns: ["Severity", "Recognition", "Action", "Escalate"],
    rows: [
      ["Moderate", "Talks in sentences. PEF 50–75% predicted. RR < 25. HR < 110. SpO₂ ≥ 92%.", "Sit upright. Reassure. Salbutamol 4–10 puffs via spacer, one puff at a time, breathe 5 times between puffs. Repeat every 10–20 min.", "Reassess after 20 min. No improvement → severe / call 999."],
      ["Severe", "Cannot complete sentences. PEF 33–50% predicted. RR ≥ 25 (adult). HR ≥ 110. SpO₂ < 92%.", "Salbutamol 10 puffs via spacer. Oxygen 15 L/min via non-rebreather. Sit upright. Repeat salbutamol every 10 min while awaiting ambulance.", "Call 999 immediately."],
      ["Life-threatening", "Silent chest. Cyanosis. Exhaustion. Confusion. Bradycardia. Hypotension. SpO₂ < 92%. PEF < 33%.", "Salbutamol 10 puffs via spacer or nebulised if available. Oxygen 15 L/min. CPR-ready position. Prepare for adrenaline / cardiac arrest if deteriorating.", "Call 999 — \"life-threatening asthma\". Paramedic emergency."],
      ["Near-fatal", "Raised PaCO₂ (paramedic ABG). Mechanical ventilation needed.", "Hospital management.", "Already on paramedic care — escort to ED."],
    ],
    notes: [
      "Salbutamol via spacer is as effective as nebulised for moderate / severe attacks in adults and children — the spacer should be in the emergency kit.",
      "Do not delay 999 to keep treating in the chair. Continue salbutamol every 10 min while waiting.",
      "Patient on regular long-acting beta-agonist (LABA) — be cautious of beta-receptor saturation; oxygen and 999 take priority over repeat salbutamol.",
      "After recovery — refer back to GP for asthma plan review. A presentation requiring 999 is a marker of poor control.",
    ],
  },

  /* ─── Card 5 · Choking algorithm ────────────────────────────────────────── */
  {
    id: "choking",
    label: "Choking — back blows, abdominal thrusts",
    icon: "alert",
    format: "flow",
    summary: "RCUK choking algorithm — encourage cough, back blows, abdominal thrusts, CPR if unconscious.",
    sources: [
      { name: "Resuscitation Council UK — Adult choking algorithm", url: "https://www.resus.org.uk/library/2021-resuscitation-guidelines/adult-basic-life-support-guidelines" },
    ],
    steps: [
      {
        n: 1,
        title: "Assess — is the obstruction mild or severe?",
        targets: ["Can the patient cough effectively?"],
        actions: [
          "Mild — patient can speak, cough, breathe. Encourage continued coughing. Stay with them.",
          "Severe — cannot speak, weak / ineffective cough, struggling to breathe, cyanosis.",
          "Ask: \"Are you choking?\". A nod = severe.",
        ],
        endpoint: "If severe and patient still conscious → move to step 2.",
      },
      {
        n: 2,
        title: "5 back blows — between the shoulder blades",
        targets: ["Heel of hand, sharp blows"],
        actions: [
          "Lean the patient forward over your arm.",
          "Deliver up to 5 sharp blows between the shoulder blades with the heel of your hand.",
          "Check after each blow whether the obstruction has cleared — do not give all 5 if cleared earlier.",
        ],
        endpoint: "Cleared → patient breathes / coughs effectively. Not cleared → step 3.",
      },
      {
        n: 3,
        title: "5 abdominal thrusts (Heimlich) — adult / child > 1 yr",
        targets: ["Below ribcage, above umbilicus, sharp inward + upward thrust"],
        actions: [
          "Stand behind the patient.",
          "Place one fist (thumb side) in the upper abdomen below the ribcage.",
          "Grasp with the other hand. Pull sharply inwards and upwards. Up to 5 times.",
          "Check after each thrust.",
          "INFANT (< 1 yr) — chest thrusts instead of abdominal thrusts. Head down, two fingers on lower sternum, sharp compressions.",
        ],
        endpoint: "Cleared → reassess. Not cleared → repeat 5 back blows + 5 thrusts until cleared OR patient becomes unconscious.",
      },
      {
        n: 4,
        title: "If patient becomes unconscious → start CPR",
        targets: ["Compressions may dislodge the obstruction"],
        actions: [
          "Lower patient safely to the floor.",
          "Call 999 if not already called.",
          "Start CPR — 30 compressions : 2 breaths.",
          "Each time you open the airway for breaths, look in the mouth — remove any visible object. Do not blind-sweep.",
        ],
        endpoint: "Continue CPR until obstruction cleared, patient recovers, or paramedic takes over.",
      },
      {
        n: 5,
        title: "After-care — refer to ED for assessment",
        targets: ["Even after successful clearance, abdominal thrusts can cause injury"],
        actions: [
          "All patients who have had abdominal thrusts should be assessed at ED — risk of internal injury (liver, spleen, ribs).",
          "Patients who lost consciousness — paramedic transfer regardless of recovery.",
          "Practice incident report — what was the foreign body, was it dental (crown, instrument, cotton roll)?",
          "Review prevention — rubber dam, throat pack, suction position, instrument tethering.",
        ],
        endpoint: "Patient assessed. Practice debrief. Procedural change documented if avoidable.",
      },
    ],
  },

  /* ─── Card 6 · Emergency kit — minimum drugs & equipment ────────────────── */
  {
    id: "emergency-kit",
    label: "Emergency kit — RCUK minimum drugs & equipment",
    icon: "briefcase",
    format: "table",
    summary: "Minimum drugs and equipment required at every dental practice per RCUK Quality Standards for CPR (Dental Practice).",
    sources: [
      { name: "Resuscitation Council UK — Quality Standards for CPR Practice and Training (Dental)", url: "https://www.resus.org.uk/library/quality-standards-cpr" },
      { name: "BNF — emergency drug doses and presentations", url: "https://bnf.nice.org.uk/" },
      { name: "GDC Standards — Principle 7.1 (provide good quality care based on current evidence)", url: "https://standards.gdc-uk.org/" },
    ],
    columns: ["Item", "Specification", "Check frequency"],
    rows: [
      ["Adrenaline 1:1000", "Pre-filled 1 mL ampoules / auto-injectors. Adult + paediatric strengths if treating children.", "Monthly expiry + presence check. Replace promptly when expiring within 3 months."],
      ["Glucagon 1 mg", "Reconstitutable kit (powder + diluent) OR pre-filled auto-injector (newer formulations). Store per manufacturer (some require refrigeration — verify locally).", "Monthly. Expiry + refrigeration log if applicable."],
      ["Oral glucose", "Glucogel / Dextrogel 25 g tubes (≥ 2). Glucose tablets as backup.", "Monthly expiry check."],
      ["Aspirin 300 mg", "Dispersible tablets.", "Monthly."],
      ["GTN spray", "Sublingual, 400 mcg / spray.", "Monthly. Expires faster than tablets — track closely."],
      ["Salbutamol inhaler", "100 mcg / puff, with valved holding chamber (spacer). Single-patient-use spacer in kit, or wash + dry between patients per manufacturer.", "Monthly. Replace inhaler when low (visual check)."],
      ["Buccal midazolam", "10 mg pre-filled syringes (paediatric strengths if treating children — 2.5, 5, 7.5 mg).", "Monthly. Controlled drug — secure storage, register entry."],
      ["Oxygen", "Size D portable cylinder (minimum 1) OR larger CD cylinder. With pressure gauge, regulator, tubing, masks.", "Weekly pressure check. Annual cylinder service / replacement per supplier."],
      ["Oxygen masks", "Non-rebreather (adult + paediatric). Nasal cannula. Pocket mask with O₂ inlet. Bag-valve-mask (BVM) adult + paediatric if team trained.", "Monthly inspection. Single-use after each patient."],
      ["AED (Automated External Defibrillator)", "Adult + paediatric pads (or paediatric mode). Self-test daily. Within 1 min reach of any treatment area.", "Daily self-test indicator. Pads expiry tracked. Battery life tracked."],
      ["Suction", "Powered suction (mains + battery backup) OR mechanical (Yankauer). Wide-bore for vomit / blood.", "Weekly function check."],
      ["Spacer device", "Valved holding chamber for salbutamol delivery.", "Monthly check. Wash + dry between patients per manufacturer."],
      ["Blood glucose meter", "Calibrated meter + lancets + strips (in date).", "Strip expiry monthly. Calibrate per manufacturer."],
      ["Pulse oximeter", "Single-finger or larger. Adult + paediatric probe.", "Monthly battery check."],
      ["Pocket face shield / barrier", "For rescue breaths.", "Monthly presence check."],
    ],
    notes: [
      "Every clinical team member must be BLS-trained — minimum annual update for dental BLS + medical emergencies (RCUK / GDC).",
      "Kit access — known location, no padlock during clinical hours, anyone can reach it. Map on the wall in every clinical room.",
      "Each item logged on the emergency kit check log. Monthly responsible-person sign-off. Audit-ready trail required for CQC.",
      "Children — paediatric-strength adrenaline, paediatric AED pads / mode, paediatric BVM, paediatric oxygen masks. Adult-only kit is non-compliant if children are seen.",
    ],
  },
];
