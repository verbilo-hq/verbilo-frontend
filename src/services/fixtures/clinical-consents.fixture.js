/**
 * Consent Form Library — fill-and-print forms in two collections:
 *   1. Core consent forms (9)         — general workflows that apply to every patient pathway
 *   2. Treatment-specific consents (18) — per-procedure consent records
 *
 * Each form has 1–2 pages. A page is a list of `sections` plus optional
 * `ribbon` (top info banner), `ongoing` (dark teal callout) and a status
 * chip in the title panel.
 *
 * Section kinds the renderer supports:
 *   fields        — labelled writing-line fields in a 1/2/3-col matrix
 *   options       — single labelled set of tick-box options (e.g. NHS / Private)
 *   cards         — checkbox + bold title + body paragraph (consent statements)
 *   pair          — two-column note cards, each with variant: risk | patient | alert | rose
 *   questions     — Yes/No question matrix
 *   prefs         — multi-column preferences table (Use | Allowed | Declined | …)
 *   notes         — labelled large writing areas
 *   summary       — 3-tile Purpose / Alternatives / No-treatment summary (treatment forms)
 *   material      — copper-tinted "Proposed treatment" box
 *   signatures    — signature ledger with 1–2 panels (each panel has its own fields)
 *   smallprint    — small grey caveat under a section
 *
 * Wire to backend later by changing `clinical.service.js` (already follows the
 * Prisma/REST swap-comment pattern).
 */

export const consentCategories = [
  { slug: "core",      number: "1", label: "Core Consent Forms",        color: "#304f5b" },
  { slug: "treatment", number: "2", label: "Treatment-Specific Consents", color: "#a86635" },
];

export const consentsFixture = [
  /* ─── 01 · General Treatment Consent ──────────────────────────────────── */
  {
    id: "general-treatment",
    num: "01",
    ref: "GT-CONSENT-01",
    category: "core",
    title: "Agreement to Dental Treatment",
    documentType: "Consent Form",
    practiceSubtitle: "General dental care consent record",
    summary: "Routine dental care consent record.",
    pages: [
      {
        kicker: "General treatment consent · Page 1 of 2",
        title: "Agreement to Dental Treatment",
        lede: "This form records the discussion between you and your dental professional before treatment. It is not a substitute for that discussion. Please ask us to explain anything that is unclear before you sign.",
        statusChip: { title: "For routine care", body: "Use where proposed treatment, risks, alternatives and costs have been discussed." },
        ribbon: { mark: "i", body: "More complex treatment may need a separate procedure-specific consent form, such as sedation, implants, orthodontics, tooth whitening, surgical treatment or any care involving unusual risks or staged plans." },
        sections: [
          { kind: "fields", title: "Patient and appointment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Contact number" },
            { label: "Email address" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
          ]},
          { kind: "options", items: [
            { label: "Treatment basis", options: ["NHS", "Private", "Mixed NHS/private", "Emergency appointment"] },
          ]},
          { kind: "fields", title: "Proposed treatment or investigation", items: [
            { label: "Treatment proposed", full: true, size: "large" },
            { label: "Reason for treatment and expected benefit", full: true, size: "large" },
            { label: "Specific teeth, areas or items involved", full: true, size: "medium" },
          ]},
          { kind: "cards", title: "Information discussed", items: [
            { title: "What the treatment involves", body: "The nature, purpose and likely stages of the proposed treatment have been explained in a way I can understand." },
            { title: "Benefits and limitations", body: "I understand the expected benefit of treatment, that dentistry cannot guarantee a perfect result, and that future repair, replacement or maintenance may be needed." },
            { title: "Relevant options", body: "Reasonable alternatives have been discussed, including delaying treatment, referral, specialist opinion, private or NHS options where available, and no treatment." },
            { title: "Costs and changes", body: "The estimated cost has been explained. I understand costs or treatment stages may change if clinical findings change, and that this should be discussed with me before further treatment is provided unless urgent care is required." },
          ]},
        ],
        ongoing: { title: "Consent is ongoing", body: "We will check that you are still happy to proceed at the relevant stages of treatment. You can pause, refuse or withdraw consent at any time before or during treatment." },
      },
      {
        kicker: "General treatment consent · Page 2 of 2",
        title: "Patient Confirmation",
        lede: "Please initial or tick the statements that apply. The clinician should record any personalised risks, patient questions or concerns in the notes section before the form is signed.",
        statusChip: { title: "Before signing", body: "Questions, risks, alternatives and costs should be clear to the patient." },
        sections: [
          { kind: "pair",
            left:  { variant: "risk", title: "General risks discussed", items: [
              "Pain, tenderness, swelling, bruising, bleeding or sensitivity.",
              "Infection, delayed healing or the need for antibiotics or further treatment.",
              "Temporary numbness from local anaesthetic and very rarely altered sensation that lasts longer.",
              "Damage to teeth, fillings, crowns, bridges, dentures, soft tissues or adjacent structures.",
              "Failure of treatment, relapse, breakage, need for replacement, or need for specialist referral.",
              "Allergic or adverse reaction to dental materials, medicines or local anaesthetic.",
            ]},
            right: { variant: "patient", title: "Patient responsibilities", items: [
              "I have provided accurate medical history, medication and allergy information.",
              "I will tell the practice if my health, medicines, pregnancy status or allergies change.",
              "I understand that smoking, diet, oral hygiene and missed appointments can affect the result.",
              "I will follow aftercare instructions and contact the practice if I have unexpected symptoms.",
            ]},
          },
          { kind: "cards", title: "Patient declaration", items: [
            { title: "I have had the chance to ask questions", body: "My questions have been answered to my satisfaction, and I know I can ask for more time or further explanation before treatment starts." },
            { title: "I understand the decision I am being asked to make", body: "I understand the proposed treatment, the relevant risks, the likely benefits, the alternatives, the costs and what may happen if I choose not to proceed." },
            { title: "I am making this decision freely", body: "I have not been pressured into treatment, and I understand that I may refuse treatment or withdraw consent at any point." },
            { title: "I consent to the treatment described on this form", body: "I agree for the dental professional named above, and appropriately trained members of the dental team working under their direction, to provide the agreed treatment." },
          ]},
          { kind: "fields", title: "Where someone signs on behalf of the patient", layout: "3-col", items: [
            { label: "Name" },
            { label: "Relationship to patient" },
            { label: "Authority or parental responsibility", full: true },
          ]},
          { kind: "smallprint", body: "For children and young people, record who has parental responsibility where relevant. For adults who may lack capacity, do not rely on a relative's signature alone unless they have appropriate legal authority. Record capacity assessment, best-interests reasoning and any legal authority separately in the clinical notes." },
          { kind: "notes", title: "Personalised risks, questions and clinical notes", items: [
            { label: "Personalised or material risks discussed", size: "medium" },
            { label: "Patient questions, concerns or preferences", size: "medium" },
            { label: "Additional notes, interpreter or communication support used", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 07 · Tooth Extraction Consent ───────────────────────────────────── */
  {
    id: "extraction",
    num: "07",
    ref: "TR-EXT-01",
    category: "treatment",
    title: "Tooth Extraction Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Procedure-specific consent record",
    summary: "Routine extraction or retained root removal.",
    pages: [
      {
        kicker: "Extraction consent · Page 1 of 2",
        title: "Tooth Extraction Consent",
        lede: "Use this form for routine dental extraction where removal of a tooth or retained root has been recommended and alternatives have been explained.",
        statusChip: { title: "Tooth removal", body: "For straightforward extractions under local anaesthetic." },
        ribbon: { mark: "i", body: "Bleeding risk, medical history, anticoagulants, bisphosphonates, radiotherapy history and infection risk should be checked before extraction." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Tooth/teeth or roots to be removed", full: true, size: "medium" },
          ]},
          { kind: "options", items: [
            { label: "Treatment basis and proposed option", options: ["Simple extraction", "Retained root removal", "Extraction under local anaesthetic", "Extraction with sedation planned separately", "Referral discussed", "Other"] },
          ]},
          { kind: "material", title: "Proposed extraction", body: "The planned treatment is to remove the named tooth or root. Local anaesthetic will normally be used. The clinician may need to section the tooth, loosen surrounding tissues or place sutures depending on what happens during treatment." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Remove a tooth that is unrestorable, painful, infected, loose, fractured, impacted in a problematic way or unsuitable to keep." },
            { title: "Alternatives", body: "No treatment, monitoring, filling, crown, root canal treatment, periodontal treatment, antibiotics for short-term infection control, or referral." },
            { title: "No treatment", body: "Pain, swelling, infection, abscess, cyst formation, spreading infection or damage to nearby teeth may occur depending on diagnosis." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Pressure, pushing and pulling sensations during treatment.",
              "Bleeding, swelling, bruising, jaw stiffness and soreness afterwards.",
              "Dry socket, delayed healing, bad taste or infection.",
              "Sharp bone edges or small fragments may work through during healing.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Damage to adjacent teeth, fillings, crowns, bridges or soft tissues.",
              "Fractured root, difficult extraction or need for surgical removal/referral.",
              "Sinus opening with upper back teeth.",
              "Altered sensation, numbness or nerve injury, especially with lower back teeth.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Consent should be checked again if the plan, cost, clinician, risks or patient circumstances change before or during treatment." },
      },
      {
        kicker: "Extraction consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "This page records patient-specific instructions, questions and confirmation that the proposed treatment has been explained in a way the patient can understand.",
        statusChip: { title: "Before signing", body: "Record anything material to this patient, not just generic risks." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Before treatment", items: [
              "I have disclosed blood thinners, bleeding disorders, bisphosphonates/denosumab, radiotherapy and relevant medical conditions.",
              "I understand replacement options for the missing tooth have been discussed where relevant.",
              "I understand that antibiotics alone may not solve the dental cause of infection.",
            ]},
            right: { variant: "alert", title: "Aftercare and responsibilities", items: [
              "Bite on gauze as instructed and avoid rinsing, smoking, vaping, alcohol and strenuous exercise initially.",
              "Follow pain relief instructions and avoid aspirin unless already prescribed.",
              "Contact the practice urgently for uncontrolled bleeding, swelling, fever or worsening pain after a few days.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "The treatment has been explained to me", body: "I understand what is proposed, why it is recommended, the likely benefits, the limitations, and the stages involved." },
            { title: "I understand the alternatives", body: "Reasonable alternatives, including no treatment, referral or delaying treatment, have been discussed where relevant." },
            { title: "I understand the risks and costs", body: "The common risks, important risks, likely cost and possible need for additional treatment have been explained." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered, and I know I can ask for more time before deciding." },
            { title: "I consent to proceed", body: "I agree to the treatment described on this form and understand that I can withdraw consent at any time before or during treatment." },
          ]},
          { kind: "fields", title: "Specific patient instructions", layout: "2-col", items: [
            { label: "Medicines, allergies, pregnancy, anticoagulants or medical factors relevant to this treatment", full: true, size: "medium" },
            { label: "Estimated cost or treatment plan reference" },
            { label: "Review or follow-up appointment" },
            { label: "Extra aftercare or emergency instructions provided", full: true, size: "medium" },
          ]},
          { kind: "notes", title: "Personalised risks, questions and clinical notes", items: [
            { label: "Personalised or material risks discussed", size: "medium" },
            { label: "Patient questions, concerns or preferences", size: "medium" },
            { label: "Additional notes, interpreter or communication support used", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
          { kind: "smallprint", body: "A signed form supports, but does not replace, a properly documented consent discussion. Keep this record with the clinical notes and provide a copy to the patient if requested." },
        ],
      },
    ],
  },

  /* ─── 08 · Mental Capacity and Best Interests Record ──────────────────── */
  {
    id: "mental-capacity",
    num: "08",
    ref: "MCA-BI-01",
    category: "core",
    title: "Mental Capacity and Best Interests Record",
    documentType: "Clinical Record",
    practiceSubtitle: "Mental capacity and best interests record",
    summary: "Decision-specific capacity assessment and best-interests record.",
    pages: [
      {
        kicker: "Capacity record · Page 1 of 2",
        title: "Capacity Assessment Record",
        lede: "This form supports recording a decision-specific capacity assessment where there is doubt about an adult patient's ability to consent to a particular dental decision.",
        statusChip: { title: "Decision-specific", body: "Capacity must be considered for the particular decision at the particular time." },
        sections: [
          { kind: "fields", title: "Patient and decision details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Clinician completing assessment" },
            { label: "Date and time" },
            { label: "Specific decision to be made", full: true, size: "large" },
            { label: "Reason capacity is in doubt", full: true, size: "medium" },
          ]},
          { kind: "cards", title: "Support provided before assessment", items: [
            { title: "Communication support", body: "Information was provided in a suitable way, such as simple language, visual aids, interpreter, carer support or extra time." },
            { title: "Timing and environment", body: "The assessment considered pain, distress, medication, fatigue, infection, intoxication, anxiety or other temporary factors that could affect capacity." },
            { title: "Least restrictive approach", body: "The patient was supported to make their own decision wherever possible before considering a best-interests decision." },
          ]},
          { kind: "questions", title: "Capacity test for this decision", items: [
            "Can the patient understand the relevant information about the proposed decision?",
            "Can the patient retain the information long enough to make the decision?",
            "Can the patient use or weigh the information, including risks, benefits and alternatives?",
            "Can the patient communicate the decision by speech, writing, gesture, behaviour or another method?",
          ]},
        ],
      },
      {
        kicker: "Capacity record · Page 2 of 2",
        title: "Best Interests Record",
        lede: "Complete this page where the patient lacks capacity for the specific decision. A relative cannot consent for an adult unless they have the correct legal authority, but they may be consulted about best interests.",
        statusChip: { title: "Legal authority", body: "Check for LPA, deputyship, advance decisions or other relevant documentation." },
        sections: [
          { kind: "cards", title: "Assessment outcome", twoCol: true, items: [
            { title: "Patient has capacity for this decision", body: "The patient has capacity and their own consent, refusal or preference should be respected." },
            { title: "Patient lacks capacity for this decision", body: "The patient lacks capacity for this decision at this time and a best-interests decision is required." },
            { title: "Assessment postponed", body: "Capacity may improve, and the decision can safely wait. Reassess at a more suitable time." },
            { title: "Urgent treatment required", body: "Treatment is required urgently to prevent serious deterioration, pain, infection or harm, and delay is not appropriate." },
          ]},
          { kind: "fields", title: "Legal authority and consultation", items: [
            { label: "LPA, deputy, advance decision or other authority checked", full: true, size: "medium" },
            { label: "People consulted, including family, carers, advocate, GP or specialist", full: true, size: "medium" },
            { label: "Patient's past and present wishes, values, beliefs or known preferences", full: true, size: "medium" },
          ]},
          { kind: "fields", title: "Best-interests decision", items: [
            { label: "Treatment or action considered to be in the patient's best interests", full: true, size: "large" },
            { label: "Risks, benefits, alternatives and least restrictive option considered", full: true, size: "large" },
            { label: "Reason for final decision and aftercare plan", full: true, size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Clinician completing assessment", "Printed name and GDC number", "Date"] },
            { lines: ["Second clinician, witness or advocate if used", "Printed name and role", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 02 · Private Treatment Plan Consent ─────────────────────────────── */
  {
    id: "private-treatment-plan",
    num: "02",
    ref: "PRV-CONSENT-01",
    category: "core",
    title: "Private Treatment Plan Agreement",
    documentType: "Consent Form",
    practiceSubtitle: "Private treatment consent record",
    summary: "Private or mixed-care treatment plan agreement.",
    pages: [
      {
        kicker: "Private treatment consent · Page 1 of 2",
        title: "Private Treatment Plan Agreement",
        lede: "This form records the patient's agreement to proceed with private or mixed NHS/private dental care after discussion of the treatment options, estimated fees, risks, benefits and alternatives.",
        statusChip: { title: "Fee clarity", body: "Use alongside the written treatment plan and estimate." },
        sections: [
          { kind: "fields", title: "Patient and appointment details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "Treating clinician" }, { label: "Date treatment plan issued" },
            { label: "Treatment plan reference" }, { label: "Estimate valid until" },
          ]},
          { kind: "fields", title: "Treatment plan summary", items: [
            { label: "Proposed private treatment", full: true, size: "large" },
            { label: "Teeth, arches or areas involved", full: true, size: "medium" },
            { label: "Expected benefits and limitations", full: true, size: "large" },
            { label: "Estimated treatment stages and timescale", full: true, size: "large" },
          ]},
          { kind: "fields", title: "Financial information", layout: "2-col", items: [
            { label: "Estimated total fee" },
            { label: "Deposit or payment due before treatment" },
            { label: "Laboratory or external fees included" },
            { label: "Finance or payment arrangement reference" },
            { label: "Items not included in this estimate", full: true, size: "medium" },
          ]},
        ],
        ribbon: { mark: "£", body: "The estimate is based on the information available at the time of planning. If findings change, or if additional treatment becomes advisable, this should be discussed and agreed before continuing unless urgent care is required." },
      },
      {
        kicker: "Private treatment consent · Page 2 of 2",
        title: "Patient Agreement",
        lede: "Please complete this page before private treatment starts. Any major changes to the plan should be recorded and agreed separately.",
        statusChip: { title: "Before treatment", body: "Confirm scope, fees, risks and patient expectations." },
        sections: [
          { kind: "cards", title: "Information discussed", items: [
            { title: "Treatment options", body: "The recommended option, reasonable alternatives, referral options and the option of no treatment have been discussed." },
            { title: "NHS and private distinction", body: "Where NHS care is available, the difference between NHS and private options has been explained. I understand which parts of my care are private." },
            { title: "Maintenance and replacement", body: "I understand that dental work may need review, maintenance, repair or replacement in future." },
            { title: "Aesthetic expectations", body: "Shade, shape, fit, comfort and appearance have been discussed where relevant. I understand that exact cosmetic outcomes cannot be guaranteed." },
          ]},
          { kind: "pair",
            left:  { variant: "risk", title: "Private treatment risks", items: [
              "Treatment may not achieve the exact appearance, comfort or function hoped for.",
              "Additional visits may be needed for adjustments, reviews or complications.",
              "Existing disease, tooth structure, bite forces, smoking, diet or oral hygiene may affect the result.",
              "Laboratory-made restorations may need remake or adjustment if fit, shade or function requires it.",
            ]},
            right: { variant: "patient", title: "Patient commitments", items: [
              "Attend planned appointments and give reasonable notice if unable to attend.",
              "Follow aftercare, hygiene, diet and review advice.",
              "Inform the practice of changes in medical history, medication, pregnancy status or allergies.",
              "Pay agreed fees at the agreed stage unless a separate written arrangement is in place.",
            ]},
          },
          { kind: "cards", title: "Patient declaration", items: [
            { title: "I understand the proposed private treatment", body: "The treatment, stages, benefits, limitations, material risks and alternatives have been explained." },
            { title: "I understand the costs", body: "I have received an estimate and understand that fees may change if the clinical situation changes or I choose additional treatment." },
            { title: "I have had time to decide", body: "I have had the opportunity to ask questions, request more information or take time before proceeding." },
            { title: "I agree to proceed", body: "I consent to the private or mixed treatment described in the treatment plan and understand I may withdraw consent before or during treatment." },
          ]},
          { kind: "notes", title: "Agreed variations or special conditions", items: [
            { label: "Changes to standard estimate, staged decisions or conditions", size: "xlarge" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 03 · Medical History and Health Declaration ─────────────────────── */
  {
    id: "medical-history",
    num: "03",
    ref: "MH-DECL-01",
    category: "core",
    title: "Medical History Declaration",
    documentType: "Health Form",
    practiceSubtitle: "Medical history and health declaration",
    summary: "Health, medication, allergy and risk screening form.",
    pages: [
      {
        kicker: "Medical history · Page 1 of 2",
        title: "Medical History Declaration",
        lede: "Your medical history helps us provide safe dental care, choose suitable local anaesthetic, medicines and materials, and decide whether we need to liaise with your GP or specialist.",
        statusChip: { title: "Update regularly", body: "Please tell us about changes before every appointment." },
        sections: [
          { kind: "fields", title: "Patient details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "Preferred contact number" }, { label: "GP or usual medical practice" },
            { label: "Emergency contact name" }, { label: "Emergency contact number" },
          ]},
          { kind: "fields", title: "Medicines, allergies and key risks", items: [
            { label: "Current medicines, including inhalers, injections, anticoagulants, contraception, supplements and over-the-counter medicines", full: true, size: "large" },
            { label: "Allergies or adverse reactions, including latex, antibiotics, painkillers, local anaesthetic, metals or dental materials", full: true, size: "large" },
          ]},
          { kind: "questions", items: [
            "Do you take blood-thinning medication such as warfarin, apixaban, rivaroxaban, edoxaban, dabigatran, aspirin or clopidogrel?",
            "Have you ever had a serious reaction to local anaesthetic, antibiotics, painkillers, sedatives or dental materials?",
            "Do you have a heart condition, heart valve problem, pacemaker, previous infective endocarditis or history of heart surgery?",
            "Do you have high blood pressure, angina, stroke/TIA history or other cardiovascular condition?",
            "Do you have asthma, COPD, sleep apnoea or another breathing condition?",
            "Do you have diabetes, thyroid disease, adrenal problems or another endocrine condition?",
            "Do you have epilepsy, seizures, fainting episodes or blackouts?",
            "Do you have a bleeding disorder, anaemia or history of excessive bleeding after surgery or dental treatment?",
          ]},
        ],
      },
      {
        kicker: "Medical history · Page 2 of 2",
        title: "Health Screening",
        lede: "Some medicines and conditions affect healing, bleeding, infection risk and which treatment options are safest. Please answer openly so the dental team can plan care appropriately.",
        statusChip: { title: "Clinical safety", body: "This is part of safe care planning, not a judgement." },
        sections: [
          { kind: "questions", items: [
            "Are you pregnant, trying to become pregnant or breastfeeding?",
            "Do you take bisphosphonates, denosumab or other bone-strengthening medicines for osteoporosis, cancer or another condition?",
            "Have you had radiotherapy to the head or neck, chemotherapy, immunotherapy or an organ transplant?",
            "Do you have a condition or medicine that affects your immune system, including long-term steroids or biologic medicines?",
            "Do you have liver disease, kidney disease, hepatitis, HIV, tuberculosis or another significant infection risk?",
            "Do you have autism, ADHD, learning disability, sensory needs, anxiety, trauma history or communication needs that may affect dental care?",
            "Do you smoke, vape, use nicotine products or recreational drugs?",
            "Have you had a recent hospital admission, operation, new diagnosis or change in medication?",
          ]},
          { kind: "fields", title: "Additional details", items: [
            { label: "Details of any yes answers or anything else the dental team should know", full: true, size: "xlarge" },
            { label: "Reasonable adjustments, communication needs, interpreter, carer or support preferences", full: true, size: "medium" },
          ]},
          { kind: "cards", title: "Patient declaration", items: [
            { title: "I have answered accurately", body: "I confirm that the information I have provided is true and complete to the best of my knowledge." },
            { title: "I will tell the practice about changes", body: "I understand that changes in my health, medicines, allergies or pregnancy status may affect dental treatment and medicines." },
            { title: "I understand why this is needed", body: "I understand this information is used to help the dental team provide safe care and may be recorded in my clinical notes." },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 04 · Data Protection and Privacy Acknowledgement ────────────────── */
  {
    id: "data-protection",
    num: "04",
    ref: "DP-ACK-01",
    category: "core",
    title: "Data Protection Acknowledgement",
    documentType: "Privacy Form",
    practiceSubtitle: "Data protection and privacy acknowledgement",
    summary: "Privacy notice acknowledgement and optional contact preferences.",
    pages: [
      {
        kicker: "Privacy and data use · Page 1 of 2",
        title: "Data Protection Acknowledgement",
        lede: "This form records that the patient has been told how the practice uses personal and health information. It also records optional contact and communication choices.",
        statusChip: { title: "Not just consent", body: "Clinical data may be processed under lawful bases other than consent." },
        ribbon: { mark: "i", body: "For healthcare records, consent is not always the correct UK GDPR lawful basis. The practice must still be transparent, identify the appropriate lawful basis and special category condition, and explain this in its privacy notice." },
        sections: [
          { kind: "fields", title: "Patient details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "Email address" }, { label: "Mobile number" },
          ]},
          { kind: "cards", title: "How information may be used", items: [
            { title: "Providing dental care", body: "I understand my information may be used for diagnosis, treatment planning, treatment, prescriptions, referrals, recalls, clinical records and aftercare." },
            { title: "Practice administration", body: "I understand my information may be used for appointments, estimates, invoices, payment records, complaints, audits, clinical governance and regulatory requirements." },
            { title: "Sharing where needed for care", body: "I understand relevant information may be shared with dental laboratories, referral providers, hospitals, NHS bodies, insurers or other organisations where necessary for my care, payment or legal obligations." },
            { title: "My rights", body: "I understand I can ask to see the privacy notice and can ask about access, correction, objection, restriction and other information rights, subject to legal limits." },
          ]},
          { kind: "prefs", title: "Contact preferences",
            columns: ["Use or contact type", "Allowed", "Declined", "Notes"],
            rows: [
              "Appointment reminders by SMS",
              "Appointment reminders by email",
              "Recall reminders by SMS or email",
              "Telephone calls or voicemail where appropriate",
              "Postal letters",
              "Practice news or marketing messages",
            ]
          },
        ],
      },
      {
        kicker: "Privacy and data use · Page 2 of 2",
        title: "Optional Choices",
        lede: "The choices below are optional and can be changed. Declining optional contact or marketing does not affect access to dental care.",
        statusChip: { title: "Optional consent", body: "Use separate consent for photos, testimonials, marketing and social media." },
        sections: [
          { kind: "cards", title: "Optional uses", items: [
            { title: "Marketing and non-care messages", body: "I consent to receive practice news, offers or non-care messages using the contact methods I have allowed above." },
            { title: "Patient feedback", body: "I consent to being contacted for feedback, surveys or service-improvement questionnaires." },
            { title: "No social media permission here", body: "I understand this form does not give permission for my identifiable image, testimonial or case details to be used on social media or marketing material. A separate specific consent form is required." },
            { title: "Withdrawal", body: "I understand I can change optional preferences or withdraw optional consent at any time by contacting the practice." },
          ]},
          { kind: "notes", title: "Notes or restrictions requested by patient", items: [
            { label: "Preferred restrictions, safe contact details or confidentiality concerns", size: "xlarge" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 05 · Photography and Recording Consent ──────────────────────────── */
  {
    id: "photography",
    num: "05",
    ref: "PHOTO-CONSENT-01",
    category: "core",
    title: "Dental Photography Consent",
    documentType: "Consent Form",
    practiceSubtitle: "Photography and recording consent",
    summary: "Clinical, teaching and marketing photo permissions.",
    pages: [
      {
        kicker: "Photography and recording consent · Page 1 of 1",
        title: "Dental Photography Consent",
        lede: "Dental photographs can help with diagnosis, monitoring, shade matching, laboratory work, referrals and education. Identifiable use for marketing or social media needs separate, specific permission.",
        statusChip: { title: "Separate choices", body: "Clinical, teaching and marketing use should not be bundled together." },
        sections: [
          { kind: "fields", title: "Patient details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "Clinician" }, { label: "Date" },
          ]},
          { kind: "prefs", title: "Type of images or recordings",
            columns: ["Use or contact type", "Allowed", "Declined", "Initial"],
            rows: [
              "Close-up images of teeth and gums",
              "Smile photographs that may include lips or lower face",
              "Full-face photographs",
              "Short clinical video or scan recording",
              "Radiographs or digital scans used with images",
            ]
          },
          { kind: "cards", title: "Permitted uses", items: [
            { title: "Clinical record, monitoring and treatment planning", body: "I consent to images being used as part of my confidential dental record and for treatment planning, monitoring and communication with the dental team." },
            { title: "Referral and dental laboratory communication", body: "I consent to relevant images being shared securely with referral providers or dental laboratories where needed for my care." },
            { title: "Internal training and quality improvement", body: "I consent to anonymised or de-identified images being used within the practice for team training, audit or quality improvement." },
            { title: "External teaching or professional education", body: "I consent to images being used for professional teaching, lectures or case discussion. Identifying details should be removed where possible." },
            { title: "Website, advertising or social media", body: "I consent to identifiable images or case details being used by the practice for website, social media, printed marketing or advertising." },
          ]},
          { kind: "cards", title: "Important notes", items: [
            { title: "Optional uses can be refused", body: "Refusing photography for marketing, teaching or social media will not affect my dental care." },
            { title: "Clinical records may be retained", body: "I understand that images forming part of my clinical record may need to be retained even if I later withdraw consent for optional use." },
            { title: "Withdrawal", body: "I understand I can withdraw optional permission for future use, although it may not always be possible to recall material already published or distributed." },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 06 · Electronic Communications Consent ──────────────────────────── */
  {
    id: "electronic-comms",
    num: "06",
    ref: "ECOMMS-CONSENT-01",
    category: "core",
    title: "Digital Contact Consent",
    documentType: "Consent Form",
    practiceSubtitle: "Electronic communications consent",
    summary: "Email, SMS, portal and messaging preferences.",
    pages: [
      {
        kicker: "Electronic communications consent · Page 1 of 1",
        title: "Digital Contact Consent",
        lede: "This form records how the patient agrees to be contacted electronically and confirms understanding of the limits of email, SMS and messaging for dental communication.",
        statusChip: { title: "Contact safely", body: "Emergency dental problems should be handled by phone or urgent care routes, not email or messaging." },
        sections: [
          { kind: "fields", title: "Patient details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "Mobile number" }, { label: "Email address" },
          ]},
          { kind: "prefs", title: "Electronic contact preferences",
            columns: ["Use or contact type", "Allowed", "Declined", "Initial"],
            rows: [
              "SMS appointment reminders",
              "Email appointment reminders",
              "Online medical history and consent forms",
              "Emailing estimates or treatment plans",
              "Emailing invoices or payment links",
              "Secure portal messages",
              "Messaging app communication, if practice policy allows",
            ]
          },
          { kind: "cards", title: "Patient understanding", items: [
            { title: "Not for emergencies", body: "I understand email, SMS, portals and messaging apps may not be checked immediately and should not be used for urgent dental emergencies." },
            { title: "Confidentiality risks", body: "I understand electronic messages can be misdirected, intercepted, seen by people with access to my device, or affected by technical failure." },
            { title: "Keeping details updated", body: "I will tell the practice if my phone number, email address or safe contact preferences change." },
            { title: "Minimal information", body: "I understand the practice should keep electronic messages proportionate and may use secure methods for sensitive clinical information." },
            { title: "Withdrawal", body: "I can change my communication preferences at any time, although some messages may still be necessary for care, safety, legal or administrative reasons." },
          ]},
          { kind: "notes", title: "Restrictions or safe contact instructions", items: [
            { label: "Anything the practice should avoid, such as voicemail, email subject lines or shared devices", size: "xlarge" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 07 · Child and Parental Responsibility Consent ──────────────────── */
  {
    id: "child-consent",
    num: "07",
    ref: "CHILD-CONSENT-01",
    category: "core",
    title: "Child or Young Person Dental Consent",
    documentType: "Consent Form",
    practiceSubtitle: "Child and young person consent record",
    summary: "Child consent and authority record.",
    pages: [
      {
        kicker: "Child consent · Page 1 of 2",
        title: "Child or Young Person Dental Consent",
        lede: "This form records who is attending with the child or young person, who has parental responsibility where relevant, and how consent has been discussed.",
        statusChip: { title: "Child-centred", body: "Involve the child or young person in decisions as far as they are able." },
        sections: [
          { kind: "fields", title: "Child or young person details", layout: "2-col", items: [
            { label: "Child full name" }, { label: "Date of birth" },
            { label: "NHS number, if known" }, { label: "School or usual address identifier" },
          ]},
          { kind: "fields", title: "Adult attending or giving consent", layout: "2-col", items: [
            { label: "Adult full name" }, { label: "Relationship to child" },
            { label: "Contact number" }, { label: "Email address" },
          ]},
          { kind: "options", items: [
            { label: "Basis of authority", options: ["Mother with parental responsibility", "Father with parental responsibility", "Guardian or special guardian", "Local authority or foster carer arrangement", "Court order or other written authority", "Young person consenting for themselves"] },
          ]},
          { kind: "smallprint", body: "Where authority is unclear, request evidence or record the steps taken to confirm who can make the decision. If there is disagreement between people with parental responsibility, seek senior clinical or indemnity advice unless urgent care is needed." },
          { kind: "fields", title: "Treatment or decision being consented to", items: [
            { label: "Proposed examination, investigation or treatment", full: true, size: "large" },
            { label: "Reason for treatment and expected benefit", full: true, size: "medium" },
            { label: "Specific risks, concerns or behaviour-management needs", full: true, size: "medium" },
          ]},
        ],
      },
      {
        kicker: "Child consent · Page 2 of 2",
        title: "Consent Confirmation",
        lede: "Consent for children should be decision-specific and should consider the child's understanding, maturity and best interests.",
        statusChip: { title: "Record clearly", body: "For young people aged 16 and over, record their own consent unless there is a capacity concern." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Discussion with child", items: [
              "The treatment was explained to the child or young person in suitable language.",
              "Questions, worries, sensory needs or reasonable adjustments were explored.",
              "The child or young person appeared willing to proceed, or any distress/refusal was recorded and considered.",
            ]},
            right: { variant: "risk", title: "Discussion with adult", items: [
              "Benefits, risks, alternatives, no treatment and costs were explained where relevant.",
              "The adult's relationship and authority were checked as far as reasonably possible.",
              "Any safeguarding, disagreement or best-interest concern was recorded in the notes.",
            ]},
          },
          { kind: "cards", title: "Consent declaration", items: [
            { title: "The decision has been explained", body: "The proposed care, benefits, relevant risks, alternatives and likely consequences of no treatment have been explained." },
            { title: "I have authority, or the young person is consenting", body: "I confirm that I have parental responsibility or other authority to consent, or that the young person is consenting for themselves." },
            { title: "Questions have been answered", body: "Questions from the child, young person or adult have been answered as far as possible." },
            { title: "Consent is given", body: "Consent is given for the dental care described above. I understand consent can be withdrawn before or during treatment." },
          ]},
          { kind: "notes", title: "Notes", items: [
            { label: "Capacity, Gillick competence, parental responsibility evidence, safeguarding notes or disagreement", size: "xlarge" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── 09 · NHS Treatment Declaration Supplement ───────────────────────── */
  {
    id: "nhs-supplement",
    num: "09",
    ref: "NHS-SUPP-01",
    category: "core",
    title: "NHS Treatment Supplement",
    documentType: "NHS Supplement",
    practiceSubtitle: "NHS treatment declaration supplement",
    summary: "Local supplement only; does not replace FP17PR.",
    pages: [
      {
        kicker: "NHS treatment declaration · Page 1 of 1",
        title: "NHS Treatment Supplement",
        lede: "This supplementary form can help the practice record NHS treatment discussions, charges and mixed-care distinctions. It does not replace the official NHS FP17PR patient record form where that form is required.",
        statusChip: { title: "Do not replace FP17PR", body: "Complete the official NHS documentation for each NHS course of treatment." },
        ribbon: { mark: "N", body: "The official NHS patient record/declaration must be completed where required. This page is a local supplementary record to support clarity about treatment, charges, exemptions and private items." },
        sections: [
          { kind: "fields", title: "Patient and course details", layout: "2-col", items: [
            { label: "Patient full name" }, { label: "Date of birth" },
            { label: "NHS number, if known" }, { label: "Date of acceptance" },
            { label: "Performer or treating dentist" }, { label: "Course or claim reference" },
          ]},
          { kind: "options", title: "Treatment basis and charges", items: [
            { label: "Treatment basis", options: ["NHS course", "NHS urgent course", "Mixed NHS/private", "Private-only items also discussed"] },
            { label: "Charge status", options: ["Patient pays NHS charge", "Valid exemption claimed", "HC2/HC3 or remission", "Charge not yet confirmed"] },
          ]},
          { kind: "fields", layout: "2-col", items: [
            { label: "NHS band, urgent charge or estimated statutory charge discussed" },
            { label: "Private items, if any, and separate private estimate reference" },
            { label: "Evidence of exemption or remission seen, if applicable", full: true, size: "medium" },
          ]},
          { kind: "cards", title: "Patient declaration", items: [
            { title: "NHS care explained", body: "I understand the NHS treatment being offered and that NHS treatment should be clinically necessary to secure and maintain oral health." },
            { title: "Charges explained", body: "I understand the NHS charge or exemption/remission position discussed with me and that I may need to provide valid evidence." },
            { title: "Mixed care explained", body: "If private items are included, I understand which parts are private, that they are separate from NHS charges, and that I should receive a private estimate." },
            { title: "Consent remains treatment-specific", body: "I understand this supplementary page does not replace a proper consent discussion for the treatment itself or any procedure-specific consent form that may be required." },
          ]},
          { kind: "notes", title: "Notes", items: [
            { label: "NHS/private distinction, exemption evidence, charge queries or patient questions", size: "xlarge" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-01 · Filling / Direct Restoration ───────────────────────────── */
  {
    id: "filling",
    num: "01",
    ref: "TR-FILL-01",
    category: "treatment",
    title: "Filling and Direct Restoration Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Direct restoration consent record",
    summary: "Direct fillings, sealants and small build-ups.",
    pages: [
      {
        kicker: "Filling consent · Page 1 of 2",
        title: "Filling and Direct Restoration",
        lede: "Use this form when a tooth is to be restored using a direct material placed in a single appointment.",
        statusChip: { title: "Direct restoration", body: "Composite, glass ionomer, amalgam or temporary materials." },
        ribbon: { mark: "i", body: "Check sensitivity, occlusion, contact points, isolation and material selection before proceeding." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Tooth/teeth and surfaces to be restored", full: true, size: "medium" },
          ]},
          { kind: "options", items: [
            { label: "Material agreed", options: ["Tooth-coloured composite", "Glass ionomer", "Amalgam", "Composite/GI sandwich", "Temporary dressing", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Decayed, fractured or worn tooth structure will be removed and replaced with a direct restorative material. Local anaesthetic will be used if needed. Bite and contact will be checked before completion." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Restore lost tooth structure, seal active caries, protect the pulp and restore function and appearance." },
            { title: "Alternatives", body: "No treatment with monitoring, fluoride/remineralisation, indirect inlay/onlay, crown, root canal treatment or extraction if the tooth is unrestorable." },
            { title: "No treatment", body: "Caries may progress to pulpal involvement, pain, infection or eventual loss of the tooth." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Short-term sensitivity to cold, heat, pressure or sweet foods.",
              "Need for bite adjustment after placement.",
              "Composite restorations may discolour, chip or wear over time.",
              "Larger or deeper fillings have a shorter lifespan than smaller restorations.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "The cavity may extend deeper than expected and need an alternative plan.",
              "Pulpal damage may lead to need for root canal treatment or extraction.",
              "Cracks may become apparent under the existing filling.",
              "Allergy or local reaction to materials is rare but possible.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If the cavity proves deeper or wider than anticipated, the clinician will pause and discuss revised options before proceeding." },
      },
      {
        kicker: "Filling consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "This page records specific patient circumstances and confirmation that the proposed restoration has been agreed.",
        statusChip: { title: "Before signing", body: "Document material choice, isolation and any deviation from initial plan." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the agreed material and that alternatives have been discussed.",
              "I understand that sensitivity may settle over days to weeks.",
              "I accept that larger restorations may need replacing or upgrading over time.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Wait for numbness to pass before eating to avoid lip or cheek injury.",
              "Avoid hard, sticky or staining foods for 24 hours where advised.",
              "Maintain interdental cleaning around all restorations.",
              "Report persistent sensitivity, pain on biting or rough margins.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "The treatment has been explained to me", body: "I understand the procedure, the material choice, the likely benefits and the limitations." },
            { title: "I understand the alternatives", body: "Reasonable alternatives including no treatment, indirect restoration or extraction have been considered." },
            { title: "I understand the risks and costs", body: "Common risks, the agreed cost and the possibility of additional treatment have been explained." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered and I am happy to proceed." },
            { title: "I consent to proceed", body: "I agree to the restoration described and accept the plan may need to change during treatment." },
          ]},
          { kind: "notes", title: "Personalised risks and clinical notes", items: [
            { label: "Specific risks discussed with this patient", size: "medium" },
            { label: "Patient questions, preferences or concerns", size: "medium" },
            { label: "Additional notes, communication support used", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
          { kind: "smallprint", body: "Keep this signed form with the clinical notes and provide a copy on request." },
        ],
      },
    ],
  },

  /* ─── TR-02 · Composite Bonding ──────────────────────────────────────── */
  {
    id: "composite-bonding",
    num: "02",
    ref: "TR-BOND-01",
    category: "treatment",
    title: "Composite Bonding Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Aesthetic composite consent record",
    summary: "Aesthetic build-ups, edge bonding and composite veneers.",
    pages: [
      {
        kicker: "Composite bonding consent · Page 1 of 2",
        title: "Composite Bonding",
        lede: "Use this form for direct composite work placed for aesthetic improvement, edge build-up or composite veneers.",
        statusChip: { title: "Aesthetic restoration", body: "Tooth-coloured material bonded to enamel and dentine." },
        ribbon: { mark: "i", body: "Discuss shade, shape, longevity, maintenance and staining expectations before treatment." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Teeth and surfaces planned", full: true, size: "medium" },
            { label: "Agreed shade and shape", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Bonding plan", options: ["Edge bonding", "Single-tooth build-up", "Multiple-tooth composite", "Composite veneer set", "Diastema closure", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Composite resin will be bonded onto the prepared tooth surfaces. Minimal or no removal of tooth structure is usually required. The result is shaped and polished at the same visit." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Improve shape, edge length, contour, position and colour appearance of the front teeth." },
            { title: "Alternatives", body: "No treatment, orthodontics, whitening, porcelain veneers, crowns or simple polishing/recontouring." },
            { title: "No treatment", body: "The appearance, chipping, wear or spacing will continue but no clinical harm is expected." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Composite may stain over time, especially at the margins.",
              "Edges may chip and need polishing or repair.",
              "Bite adjustment may be needed.",
              "Composite is not as long-lasting as porcelain.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Underlying tooth colour may show through in some lights.",
              "Sensitivity to cold or air for a short period.",
              "Some shape changes may be very limited without orthodontics first.",
              "Loss of bonding requires re-treatment.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Shape and shade preferences should be re-checked at fit. Patients can pause for further discussion at any time." },
      },
      {
        kicker: "Composite bonding consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Record patient understanding of expected appearance, longevity and maintenance.",
        statusChip: { title: "Aesthetic outcomes", body: "Photos and shade reference should be agreed before treatment." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand that composite is a long-term but not permanent restoration.",
              "I understand that staining, chipping and polishing will be expected over time.",
              "I have reviewed pre-treatment photos or a wax-up where appropriate.",
            ]},
            right: { variant: "alert", title: "Aftercare and maintenance", items: [
              "Avoid biting nails, pen lids, ice or hard objects.",
              "Reduce staining drinks where possible or rinse afterwards.",
              "Attend recommended polishing and review appointments.",
              "Wear a night guard if recommended for grinding or clenching.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand what will be done", body: "Bonding, shape, shade and approximate longevity have been explained." },
            { title: "I understand the alternatives", body: "Whitening, orthodontics, veneers, crowns or no treatment have been considered." },
            { title: "I understand the risks and costs", body: "Cost, maintenance and re-treatment expectations are clear." },
            { title: "I have had the chance to ask questions", body: "All my aesthetic questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the bonding plan described on this form." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Patient aesthetic priorities and concerns", size: "medium" },
            { label: "Reference photos, shade and wax-up records", size: "medium" },
            { label: "Additional risks discussed for this case", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-03 · Crown, Onlay and Inlay ─────────────────────────────────── */
  {
    id: "crown-onlay-inlay",
    num: "03",
    ref: "TR-CROWN-01",
    category: "treatment",
    title: "Crown, Onlay and Inlay Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Indirect single-tooth restoration consent",
    summary: "Indirect cuspal coverage and intracoronal restorations.",
    pages: [
      {
        kicker: "Crown/onlay/inlay consent · Page 1 of 2",
        title: "Crown, Onlay or Inlay",
        lede: "Use this form for laboratory or chair-side milled restorations that cover or restore a single tooth indirectly.",
        statusChip: { title: "Indirect restoration", body: "Crown, onlay, inlay or overlay made outside the mouth." },
        ribbon: { mark: "i", body: "Check pulpal status, occlusion, parafunction, periodontal support and material expectations." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Tooth/teeth to be restored", full: true, size: "small" },
            { label: "Material agreed", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Restoration type", options: ["Full crown", "Onlay", "Inlay", "Overlay", "Veneer-crown combination", "Other"] },
            { label: "Material", options: ["Lithium disilicate (e.g. emax)", "Zirconia", "Gold/precious alloy", "PFM", "Composite/CAD-CAM composite", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "The tooth will be prepared, an impression or scan taken, a temporary placed, and an indirect restoration fitted at a later visit. Adjustments to bite, shape and shade may be needed at fit." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Restore broken or heavily restored teeth, protect remaining structure, restore function and improve appearance." },
            { title: "Alternatives", body: "Large direct restoration, root canal then crown, extraction or no treatment." },
            { title: "No treatment", body: "The tooth may fracture, become unrestorable, develop pulpal disease or be lost." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Sensitivity after preparation and around the temporary.",
              "Need for bite adjustment after fit.",
              "Temporary restorations may come off and need re-cementing.",
              "Some tooth structure must be removed irreversibly.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Pulp may not tolerate the preparation, leading to root canal treatment or loss of the tooth.",
              "Crown margin may discolour or recede over time.",
              "Porcelain or veneer surfaces can chip.",
              "Allergic or local reaction to cement or materials is rare.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If the tooth is found to be unrestorable, an alternative plan will be discussed before completing." },
      },
      {
        kicker: "Crown/onlay/inlay consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Document the agreed plan, temporary phase and maintenance expectations.",
        statusChip: { title: "Two-visit plan", body: "Preparation, temporary, fit and review where applicable." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand a permanent change will be made to the tooth.",
              "I understand the cost, material choice and longevity expectations.",
              "I accept that further treatment may be needed if problems arise.",
            ]},
            right: { variant: "alert", title: "Temporary and aftercare", items: [
              "Eat carefully on the temporary and avoid sticky foods.",
              "Floss carefully — pull through rather than lifting up to avoid dislodging.",
              "Contact the practice if the temporary comes off.",
              "Wear a night guard if recommended.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand what will be done", body: "Preparation, temporary, fit and review have been explained." },
            { title: "I understand the alternatives", body: "Direct restoration, extraction or no treatment have been considered." },
            { title: "I understand the risks and costs", body: "Risks of pulpal damage, future root canal, fracture or crown failure are clear." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered and my preferences recorded." },
            { title: "I consent to proceed", body: "I agree to the indirect restoration plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific clinical findings and risks", size: "medium" },
            { label: "Patient priorities, shade or shape preferences", size: "medium" },
            { label: "Lab notes, shade or photos taken", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-04 · Veneer ─────────────────────────────────────────────────── */
  {
    id: "veneer",
    num: "04",
    ref: "TR-VENEER-01",
    category: "treatment",
    title: "Porcelain Veneer Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Indirect veneer consent record",
    summary: "Porcelain and indirect composite veneers.",
    pages: [
      {
        kicker: "Veneer consent · Page 1 of 2",
        title: "Porcelain or Indirect Veneer",
        lede: "Use this form for laboratory-made veneers bonded to anterior teeth to alter appearance.",
        statusChip: { title: "Aesthetic restoration", body: "Permanent change to tooth shape and surface." },
        ribbon: { mark: "i", body: "Discuss shade, shape, longevity and the irreversible nature of preparation. Consider whitening first." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Teeth planned for veneers", full: true, size: "small" },
            { label: "Material agreed and shade", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Preparation type", options: ["No-prep / minimal-prep", "Conventional veneer prep", "Combined with crown(s)", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "A thin layer of enamel may be removed from the front of the tooth. An impression or scan is taken, temporaries are placed where needed, and veneers are bonded at a later visit." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Improve colour, shape, alignment, gaps or worn edges of the front teeth." },
            { title: "Alternatives", body: "Whitening, composite bonding, orthodontics, crowns, no treatment." },
            { title: "No treatment", body: "Aesthetic concerns remain. Worn edges may continue to wear if no protection is provided." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Permanent removal of some enamel.",
              "Sensitivity during the temporary phase.",
              "Veneers can chip, debond or stain at margins over time.",
              "Bite changes may need adjustment.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Pulpal injury can lead to root canal treatment.",
              "Veneers can fracture, especially on edges.",
              "Final colour may differ slightly from preview.",
              "Veneer life expectancy is finite and they need replacing eventually.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Shape and shade will be checked at try-in. Patients can request changes before final bonding." },
      },
      {
        kicker: "Veneer consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of the irreversible nature of veneers and ongoing care.",
        statusChip: { title: "Before signing", body: "Confirm trial smile, photos and reference shade have been agreed." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand veneers are a permanent change.",
              "I understand whitening cannot easily be done after veneers without affecting match.",
              "I have reviewed photos, trial smile or mock-up where used.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Avoid biting hard objects, nails, ice or pen lids.",
              "Wear a night guard if recommended.",
              "Maintain excellent oral hygiene and attend reviews.",
              "Report any chips, looseness or sensitivity promptly.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Preparation, temporaries, try-in and fit have been explained." },
            { title: "I understand the alternatives", body: "Whitening, bonding, orthodontics, crowns and no treatment have been considered." },
            { title: "I understand the risks and costs", body: "Cost, longevity and re-treatment expectations are clear." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the veneer plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific aesthetic preferences", size: "medium" },
            { label: "Photos, shade, mock-up references", size: "medium" },
            { label: "Bite, parafunction or hygiene risks discussed", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-05 · Bridge ─────────────────────────────────────────────────── */
  {
    id: "bridge",
    num: "05",
    ref: "TR-BRIDGE-01",
    category: "treatment",
    title: "Dental Bridge Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Fixed bridgework consent record",
    summary: "Conventional and resin-bonded bridges.",
    pages: [
      {
        kicker: "Bridge consent · Page 1 of 2",
        title: "Dental Bridge",
        lede: "Use this form when one or more missing teeth are to be replaced with a fixed bridge.",
        statusChip: { title: "Fixed replacement", body: "Bonded to adjacent abutment teeth." },
        ribbon: { mark: "i", body: "Confirm abutment tooth condition, bite, parafunction, periodontal support and discuss alternatives." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Teeth to be replaced", full: true, size: "small" },
            { label: "Abutment teeth", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Bridge type", options: ["Conventional fixed-fixed", "Resin-bonded (Maryland)", "Cantilever", "Hybrid/combined", "Other"] },
            { label: "Material", options: ["Zirconia", "Lithium disilicate (e.g. emax)", "PFM", "Gold/precious alloy", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Adjacent teeth are prepared to act as abutments (for conventional bridges) or bonded with a wing (for resin-bonded bridges). The bridge is made in a laboratory and cemented in place." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Replace missing teeth, restore function and appearance, prevent drift of adjacent teeth." },
            { title: "Alternatives", body: "Implant-supported crown, denture, no replacement, orthodontic space closure." },
            { title: "No treatment", body: "Adjacent and opposing teeth may drift, with bite and gum changes over time." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Preparation of healthy tooth structure for conventional bridges.",
              "Sensitivity during the temporary phase.",
              "Bite adjustments may be needed.",
              "Bridges have a finite lifespan and require replacement eventually.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Abutment teeth can fail through caries, fracture or root canal problems.",
              "Resin-bonded bridges can debond and need re-cementing.",
              "Loss of an abutment usually means losing the whole bridge.",
              "Aesthetic compromises may exist where gum recession occurs.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If abutment teeth prove unsuitable, an alternative plan will be discussed before cementation." },
      },
      {
        kicker: "Bridge consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of bridge function, cleaning and review expectations.",
        statusChip: { title: "Long-term care", body: "Hygiene under the pontic is critical." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the bridge replaces missing teeth using neighbouring teeth as anchors.",
              "I understand cost and lifespan expectations.",
              "I understand cleaning under the pontic is essential.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Use floss threaders or interdental brushes under the bridge daily.",
              "Avoid biting hard objects.",
              "Attend reviews and recall hygiene appointments.",
              "Report any looseness, sensitivity or bleeding around abutments.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Preparation, temporaries, fit and review have been explained." },
            { title: "I understand the alternatives", body: "Implant, denture or no treatment have been considered." },
            { title: "I understand the risks and costs", body: "Cost, longevity and the impact on abutment teeth are clear." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the bridge plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Abutment risk factors", size: "medium" },
            { label: "Cleaning aids issued", size: "medium" },
            { label: "Aesthetic and material preferences", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-06 · Denture ────────────────────────────────────────────────── */
  {
    id: "denture",
    num: "06",
    ref: "TR-DENTURE-01",
    category: "treatment",
    title: "Removable Denture Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Partial and complete denture consent",
    summary: "Acrylic, cobalt-chrome, immediate and complete dentures.",
    pages: [
      {
        kicker: "Denture consent · Page 1 of 2",
        title: "Removable Denture",
        lede: "Use this form for new, replacement, immediate or transitional removable dentures.",
        statusChip: { title: "Removable prosthesis", body: "Acrylic, metal-based or flexible material." },
        ribbon: { mark: "i", body: "Manage expectations on adaptation, retention, speech and appearance. Discuss alternatives carefully." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Arches/teeth being replaced", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Denture type", options: ["Complete upper", "Complete lower", "Acrylic partial", "Cobalt-chrome partial", "Flexible partial", "Immediate denture", "Replacement", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Impressions and bite records are taken, try-ins are completed and the denture is delivered. Adjustments are usually needed in the first few visits." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Restore function, appearance and confidence where teeth are missing." },
            { title: "Alternatives", body: "Bridge, implants, no replacement, orthodontic options where applicable." },
            { title: "No treatment", body: "Tooth drift, bite collapse, ageing appearance and chewing difficulty may occur." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Adaptation takes time — speech, eating and saliva may feel different.",
              "Several adjustment visits are usually required.",
              "Sore spots may develop and need easing.",
              "Lower complete dentures may be unstable, especially in flat ridges.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Increased risk of decay or gum disease on partial denture abutments.",
              "Allergy or sensitivity to denture materials is rare.",
              "Bone resorption continues over time and dentures will need relining or remaking.",
              "Immediate dentures need relining as the gum heals.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Try-in stages allow change in shade, shape and tooth set-up before final processing." },
      },
      {
        kicker: "Denture consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of adaptation, cleaning and recall.",
        statusChip: { title: "Aftercare", body: "Remove at night, clean and store appropriately." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand it takes time to get used to a denture.",
              "I understand it is not the same as natural teeth.",
              "I will attend follow-up adjustments to make sure the denture is comfortable.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Remove dentures at night and clean daily.",
              "Brush remaining teeth and the gums thoroughly.",
              "Avoid hot water or bleach on dentures.",
              "Report soreness early so adjustments can be made.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Impression stages, try-in, fit and review have been explained." },
            { title: "I understand the alternatives", body: "Bridge, implant or no replacement have been considered." },
            { title: "I understand the risks and costs", body: "Cost, lifespan and need for adjustments are clear." },
            { title: "I have had the chance to ask questions", body: "My questions and aesthetic priorities have been recorded." },
            { title: "I consent to proceed", body: "I agree to the denture plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Shade, shape, midline and aesthetic priorities", size: "medium" },
            { label: "Bite, anatomy or denture-bearing limitations", size: "medium" },
            { label: "Cleaning aids and aftercare advice given", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-08 · Surgical / Wisdom Tooth Extraction ─────────────────────── */
  {
    id: "surgical-extraction",
    num: "08",
    ref: "TR-SURGEXT-01",
    category: "treatment",
    title: "Surgical or Wisdom Tooth Extraction Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Surgical extraction consent record",
    summary: "Surgical removal of buried, impacted or fractured teeth.",
    pages: [
      {
        kicker: "Surgical extraction consent · Page 1 of 2",
        title: "Surgical or Wisdom Tooth Extraction",
        lede: "Use this form when the planned extraction is likely to require raising a flap, removing bone or sectioning the tooth.",
        statusChip: { title: "Surgical procedure", body: "Greater risk profile than routine extraction." },
        ribbon: { mark: "i", body: "Consider nerve proximity, sinus relationship, medical history, anticoagulants and possible need for referral." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Tooth/teeth to be removed", full: true, size: "small" },
            { label: "Anaesthesia plan", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Anaesthesia and setting", options: ["Local anaesthetic", "Local anaesthetic + IV sedation", "Referral to oral surgery", "General anaesthetic referral", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "The gum may be lifted to expose the tooth and bone. Bone may be removed and the tooth may be sectioned to allow safe extraction. Stitches are usually placed at the end." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Remove a tooth that is impacted, fractured, buried, infected or causing problems for neighbouring structures." },
            { title: "Alternatives", body: "Monitoring, coronectomy (lower wisdom teeth), referral, orthodontic alignment, no treatment depending on diagnosis." },
            { title: "No treatment", body: "Infection, pain, damage to neighbouring teeth, cyst formation or worsening symptoms may occur." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Swelling, bruising, jaw stiffness and discomfort for several days.",
              "Bleeding and mild oozing for the first 24 hours.",
              "Dry socket — particularly in lower wisdom teeth.",
              "Stitches and a longer recovery than a routine extraction.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Damage to adjacent teeth, fillings or restorations.",
              "Sinus opening with upper back teeth.",
              "Altered or temporarily lost sensation of the lip, chin or tongue with lower teeth.",
              "Jaw fracture is rare but possible in difficult cases.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If the procedure proves more complex than expected, the clinician may need to refer or reschedule rather than proceed unsafely." },
      },
      {
        kicker: "Surgical extraction consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of recovery, escort, time off and warning signs.",
        statusChip: { title: "Recovery", body: "Plan time off work, transport and rest as needed." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Before treatment", items: [
              "I have disclosed bleeding disorders, anticoagulants, bisphosphonates, radiotherapy history and relevant conditions.",
              "I understand the recovery may take longer than a routine extraction.",
              "I have arranged time and (if sedation) an escort.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Bite firmly on gauze and follow bleeding instructions.",
              "Avoid rinsing, smoking, vaping and alcohol for at least 24 hours.",
              "Take pain relief as advised and contact the practice for severe symptoms.",
              "Attend any suture removal or review appointments.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "The procedure has been explained", body: "I understand the surgical nature of the extraction and the recovery profile." },
            { title: "I understand the alternatives", body: "Coronectomy, monitoring, referral or no treatment have been considered." },
            { title: "I understand the risks", body: "Nerve, sinus, bleeding, infection and dry socket risks have been explained." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the surgical procedure described on this form." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific anatomical or medical risks", size: "medium" },
            { label: "Radiographic findings and proximity to nerve/sinus", size: "medium" },
            { label: "Aftercare advice and contact instructions given", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-09 · Root Canal Treatment ───────────────────────────────────── */
  {
    id: "root-canal",
    num: "09",
    ref: "TR-RCT-01",
    category: "treatment",
    title: "Root Canal Treatment Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Endodontic treatment consent record",
    summary: "Primary and re-treatment endodontics.",
    pages: [
      {
        kicker: "Root canal consent · Page 1 of 2",
        title: "Root Canal Treatment",
        lede: "Use this form for primary or retreatment endodontics where the pulp tissue is removed and the canals are cleaned, shaped and filled.",
        statusChip: { title: "Endodontic procedure", body: "Often two visits with rubber dam isolation." },
        ribbon: { mark: "i", body: "Confirm pulpal and periapical diagnosis, restorability, anatomy, calcification and bite before starting." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Tooth to be treated", full: true, size: "small" },
            { label: "Number of canals expected", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Treatment type", options: ["Primary root canal treatment", "Re-treatment of previous RCT", "Pulpotomy as interim measure", "Referral to specialist", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Under local anaesthetic and rubber dam, the canal system is accessed, cleaned and disinfected. A temporary or final root filling is placed. A definitive restoration (often a crown) is usually planned afterwards." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Save a tooth with irreversibly damaged or infected pulp tissue." },
            { title: "Alternatives", body: "Extraction with or without replacement, referral to a specialist, no treatment for the time being." },
            { title: "No treatment", body: "Pain, infection, abscess, spreading infection or eventual loss of the tooth." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Tenderness and discomfort between visits and after treatment.",
              "Multiple appointments and need for a final restoration.",
              "Treated teeth become more brittle and need protective restoration.",
              "Re-infection is possible even with careful treatment.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Instrument fracture, perforation or blockage of the canal system.",
              "Persistent infection that needs surgery, retreatment or extraction.",
              "Tooth fracture during or after treatment.",
              "Allergy to materials used is rare.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If the tooth proves untreatable or unrestorable, an alternative plan including extraction will be discussed before progressing further." },
      },
      {
        kicker: "Root canal consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of multi-visit plan, success rates and the need for a coronal restoration.",
        statusChip: { title: "After RCT", body: "A definitive restoration is usually needed promptly." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the treatment success rate is high but not guaranteed.",
              "I understand a permanent restoration (often a crown) is needed.",
              "I understand referral is an option if the case is complex.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Avoid biting hard food on the tooth between visits.",
              "Maintain hygiene around the temporary.",
              "Report swelling, severe pain or temporary loss.",
              "Book the definitive restoration promptly.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Access, cleaning, root filling and final restoration have been explained." },
            { title: "I understand the alternatives", body: "Extraction, referral or no treatment have been considered." },
            { title: "I understand the risks", body: "Possibility of failure, fracture, retreatment or extraction has been explained." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the endodontic treatment plan." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Pulpal and periapical diagnosis", size: "medium" },
            { label: "Restorability assessment and final restoration plan", size: "medium" },
            { label: "Complexity and any specialist discussion", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-10 · Periodontal Treatment ──────────────────────────────────── */
  {
    id: "periodontal",
    num: "10",
    ref: "TR-PERIO-01",
    category: "treatment",
    title: "Periodontal Treatment Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Non-surgical periodontal therapy consent",
    summary: "Initial and step 2 non-surgical periodontal therapy.",
    pages: [
      {
        kicker: "Periodontal consent · Page 1 of 2",
        title: "Periodontal Treatment",
        lede: "Use this form for non-surgical management of periodontitis, including instrumentation under local anaesthetic.",
        statusChip: { title: "Step 2 therapy", body: "Subgingival instrumentation with behaviour support." },
        ribbon: { mark: "i", body: "Confirm BPE/full pocket chart, risk factors (smoking, diabetes, plaque control) and patient engagement before treatment." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Quadrants/areas to be treated", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Therapy plan", options: ["Single visit full mouth", "Quadrant-based course", "Single quadrant focused therapy", "Adjunctive systemic antibiotics considered", "Referral to specialist", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Subgingival deposits are removed using hand and ultrasonic instruments, usually with local anaesthetic. Oral hygiene support, risk factor advice and re-evaluation are part of the course." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Reduce inflammation, pocket depths and bleeding, slow disease progression and stabilise the periodontium." },
            { title: "Alternatives", body: "Hygiene maintenance only, specialist referral, surgical periodontal therapy, no treatment." },
            { title: "No treatment", body: "Continued attachment and bone loss may lead to tooth mobility and tooth loss." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Sensitivity, especially to cold, for days to weeks.",
              "Gum recession may become more visible as inflammation resolves.",
              "Mild soreness or bleeding during initial healing.",
              "Multiple visits and ongoing maintenance are usually needed.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Without good plaque control, the disease will recur.",
              "Some teeth may remain non-responsive and need surgery or extraction.",
              "Existing restoration margins may feel rough as deposits are removed.",
              "Smokers and uncontrolled diabetics may respond less well.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Outcome depends on patient engagement, hygiene and risk factor control. The plan is reviewed at re-evaluation." },
      },
      {
        kicker: "Periodontal consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient agreement to support the treatment with plaque control and risk factor change.",
        statusChip: { title: "Patient role", body: "Hygiene and lifestyle changes are central to success." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand periodontal disease is chronic and needs ongoing care.",
              "I am willing to follow the hygiene and lifestyle advice given.",
              "I understand smoking and uncontrolled diabetes worsen the outcome.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Brush twice daily with the technique advised.",
              "Use interdental brushes or floss daily.",
              "Attend re-evaluation and maintenance appointments.",
              "Report any new symptoms or worsening bleeding.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Subgingival instrumentation and supportive care have been explained." },
            { title: "I understand the alternatives", body: "Hygiene only, referral, surgery or no treatment have been considered." },
            { title: "I understand the risks", body: "Sensitivity, recession, recurrence and the need for maintenance are clear." },
            { title: "I have had the chance to ask questions", body: "My questions and goals have been recorded." },
            { title: "I consent to proceed", body: "I agree to the periodontal treatment plan." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Risk factors and modifications planned", size: "medium" },
            { label: "Specific oral hygiene aids issued", size: "medium" },
            { label: "Re-evaluation and maintenance schedule", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-11 · Tooth Whitening ────────────────────────────────────────── */
  {
    id: "whitening",
    num: "11",
    ref: "TR-WHITE-01",
    category: "treatment",
    title: "Tooth Whitening Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Home and in-surgery whitening consent",
    summary: "Hydrogen peroxide and carbamide peroxide whitening.",
    pages: [
      {
        kicker: "Whitening consent · Page 1 of 2",
        title: "Tooth Whitening",
        lede: "Use this form for take-home tray whitening, in-surgery whitening or combination protocols.",
        statusChip: { title: "Cosmetic whitening", body: "Regulated product used at agreed concentration." },
        ribbon: { mark: "i", body: "Confirm oral health, restorations, expectations and contraindications (pregnancy, under 18 except specific cases) before issuing whitening." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Whitening product and concentration", full: true, size: "small" },
            { label: "Pre-treatment shade", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Whitening protocol", options: ["Take-home trays — daytime", "Take-home trays — overnight", "In-surgery whitening", "Combination home + in-surgery", "Internal (non-vital) whitening", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Custom trays are made (where used) and a peroxide-based gel is used as directed. The gel acts on enamel and dentine pigments to lighten the natural tooth colour." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Lighten the colour of natural teeth for aesthetic reasons." },
            { title: "Alternatives", body: "Microabrasion, polishing, composite bonding, veneers, crowns, no treatment." },
            { title: "No treatment", body: "Tooth colour remains the same; no clinical harm." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Sensitivity to cold during and after treatment.",
              "Temporary gum irritation if gel contacts soft tissue.",
              "Variable response — some teeth lighten less than others.",
              "Whitening fades over time and may need top-ups.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Existing white-fillings, crowns or veneers will not lighten and may need replacing for colour match.",
              "Heavily stained or tetracycline teeth respond poorly.",
              "Internal whitening of root-treated teeth has additional risks.",
              "Pregnancy and breastfeeding contraindicate whitening.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Shade is reviewed during treatment; patients can pause if sensitivity becomes troublesome." },
      },
      {
        kicker: "Whitening consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of legal use, sensitivity management and maintenance.",
        statusChip: { title: "Legal note", body: "Whitening must only be carried out by registered professionals." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand whitening will not change the colour of existing restorations.",
              "I understand sensitivity is common and usually settles after treatment.",
              "I will follow the instructions and avoid overusing the gel.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Avoid staining drinks and foods during active whitening.",
              "Use desensitising toothpaste if sensitivity occurs.",
              "Store gel as advised.",
              "Attend review to confirm final shade and discuss any restorations.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "The protocol, expected duration and shade goal have been explained." },
            { title: "I understand the alternatives", body: "Other cosmetic options have been considered." },
            { title: "I understand the risks", body: "Sensitivity, gum irritation and variable results have been explained." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the whitening plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Restoration update plan after whitening", size: "medium" },
            { label: "Sensitivity management advice given", size: "medium" },
            { label: "Top-up and maintenance plan", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-12 · Dental Implant ─────────────────────────────────────────── */
  {
    id: "implant",
    num: "12",
    ref: "TR-IMPLANT-01",
    category: "treatment",
    title: "Dental Implant Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Implant placement and restoration consent",
    summary: "Surgical placement and prosthetic restoration of implants.",
    pages: [
      {
        kicker: "Implant consent · Page 1 of 2",
        title: "Dental Implant",
        lede: "Use this form for surgical placement of one or more dental implants and the planned restoration.",
        statusChip: { title: "Surgical and prosthetic", body: "Multi-stage treatment with healing period." },
        ribbon: { mark: "i", body: "Confirm planning records (CBCT, study models or scans), medical history, smoking, periodontal status and prosthetic plan." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Site(s) for implant placement", full: true, size: "small" },
            { label: "Planned restoration", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Procedure plan", options: ["Single implant", "Multiple implants", "Implant + bone graft", "Sinus lift planned separately", "Immediate placement after extraction", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Under local anaesthetic (with or without sedation), the gum is lifted and an implant is placed in the bone. A healing period of weeks to months follows before the restoration is fitted." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Replace missing teeth without affecting adjacent natural teeth, restoring function and appearance." },
            { title: "Alternatives", body: "Bridge, denture, no replacement, orthodontic space closure." },
            { title: "No treatment", body: "Adjacent and opposing teeth may drift, bone may resorb at the missing tooth site." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Swelling, bruising and discomfort for days after surgery.",
              "Multiple appointments over months.",
              "Need for excellent hygiene to maintain implants.",
              "Some bite adjustment and refinement at restoration stage.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Failure of integration requiring removal of the implant.",
              "Damage to nerves, sinus, adjacent teeth or roots.",
              "Peri-implantitis (gum and bone infection around the implant).",
              "Need for bone or soft tissue grafting, sometimes only apparent during surgery.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If bone or anatomy proves unfavourable during surgery, the plan may be modified or rescheduled with further discussion." },
      },
      {
        kicker: "Implant consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of multi-stage plan, costs, time off and lifelong maintenance.",
        statusChip: { title: "Lifelong care", body: "Hygiene and recall are essential to long-term success." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the surgery, healing and prosthetic phases.",
              "I understand smoking and uncontrolled diabetes increase failure risk.",
              "I commit to attending review and hygiene appointments.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Follow post-operative instructions carefully.",
              "Use prescribed cleaning aids around the healing site.",
              "Avoid smoking during healing where possible.",
              "Attend reviews and long-term maintenance.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Surgery, healing and restoration phases have been explained." },
            { title: "I understand the alternatives", body: "Bridge, denture or no replacement have been considered." },
            { title: "I understand the risks and costs", body: "Surgical risks, prosthetic risks, total costs and maintenance burden are clear." },
            { title: "I have had the chance to ask questions", body: "My questions and concerns have been answered." },
            { title: "I consent to proceed", body: "I agree to the implant treatment plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Planning records reviewed (CBCT, scans, models)", size: "medium" },
            { label: "Site-specific risks (sinus, nerve, bone, soft tissue)", size: "medium" },
            { label: "Cost estimate and stage timing", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-13 · Bone Graft / Sinus Lift ────────────────────────────────── */
  {
    id: "bone-graft",
    num: "13",
    ref: "TR-GRAFT-01",
    category: "treatment",
    title: "Bone Graft and Sinus Lift Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Hard tissue augmentation consent",
    summary: "Socket preservation, ridge augmentation and sinus lift procedures.",
    pages: [
      {
        kicker: "Bone graft consent · Page 1 of 2",
        title: "Bone Graft or Sinus Lift",
        lede: "Use this form for surgical augmentation procedures undertaken to support current or future implant placement.",
        statusChip: { title: "Augmentation surgery", body: "Bone substitute, membrane and sometimes sinus floor elevation." },
        ribbon: { mark: "i", body: "Discuss material (synthetic, xenograft, allograft, autograft), patient values and possible religious considerations." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Site(s) of augmentation", full: true, size: "small" },
            { label: "Graft material agreed", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Procedure", options: ["Socket preservation", "Ridge augmentation", "Sinus lift (internal/crestal)", "Sinus lift (external/lateral)", "Combined with implant", "Other"] },
            { label: "Graft material", options: ["Synthetic bone substitute", "Xenograft (bovine/porcine)", "Allograft (human)", "Autograft (patient's own)", "Combination", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "The gum is lifted, the bone defect is prepared, graft material is placed and stabilised, often under a membrane, and the gum is sutured back." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Build up bone volume to enable safe implant placement now or in the future." },
            { title: "Alternatives", body: "Shorter or angled implants, alternative tooth replacement (bridge, denture), no treatment." },
            { title: "No treatment", body: "Implant placement may not be possible or may have a poorer prognosis." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Swelling, bruising and discomfort for several days.",
              "Healing time of months before further treatment.",
              "Need for prescribed mouthwashes and medication.",
              "Some bone resorption is expected during healing.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Membrane exposure or graft loss.",
              "Infection at the graft site.",
              "Sinus perforation or sinusitis (with sinus lifts).",
              "Failure of the graft requiring repeat surgery.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Final implant timing is decided at review based on healing." },
      },
      {
        kicker: "Bone graft consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of healing time and the requirement for careful aftercare.",
        statusChip: { title: "Healing first", body: "Several months may be needed before restoration." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I have been informed of the graft material and accept it.",
              "I understand healing takes months before further treatment.",
              "I understand surgical risks including infection and graft loss.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Avoid nose-blowing and rinsing after sinus lift surgery.",
              "Follow medication and mouthwash instructions.",
              "Avoid pressure on the surgical site (e.g. denture wear unless authorised).",
              "Attend all reviews to monitor healing.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Augmentation technique and material have been explained." },
            { title: "I understand the alternatives", body: "Shorter implants, alternative replacement or no treatment have been considered." },
            { title: "I understand the risks", body: "Graft loss, infection, sinus complications and need for repeat surgery are clear." },
            { title: "I have had the chance to ask questions", body: "Questions about material source and values have been addressed." },
            { title: "I consent to proceed", body: "I agree to the augmentation procedure described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific risk factors and findings", size: "medium" },
            { label: "Material source explanation and patient acceptance", size: "medium" },
            { label: "Post-op contact and review schedule", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-14 · Orthodontic / Aligner ──────────────────────────────────── */
  {
    id: "orthodontic",
    num: "14",
    ref: "TR-ORTHO-01",
    category: "treatment",
    title: "Orthodontic and Aligner Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Fixed appliance and clear aligner consent",
    summary: "Adult and adolescent fixed appliance or aligner treatment.",
    pages: [
      {
        kicker: "Orthodontic consent · Page 1 of 2",
        title: "Orthodontic Treatment",
        lede: "Use this form for fixed appliance, removable appliance or clear aligner orthodontic treatment.",
        statusChip: { title: "Tooth movement", body: "Stages of alignment with retention afterwards." },
        ribbon: { mark: "i", body: "Confirm diagnosis, periodontal health, restorative status, retention plan and patient compliance expectations." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Appliance type and arches", full: true, size: "small" },
            { label: "Estimated duration", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Appliance type", options: ["Clear aligners", "Fixed labial appliance", "Fixed lingual appliance", "Removable appliance", "Combined approach", "Other"] },
            { label: "Extractions or IPR", options: ["Interproximal reduction (IPR) only", "Extraction(s) planned", "No reduction or extraction", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Brackets, aligners or appliances are used to move teeth into a new position, followed by a retention phase to keep teeth stable." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Improve tooth alignment, bite, facial aesthetics or pre-restorative tooth position." },
            { title: "Alternatives", body: "Cosmetic restorations (bonding, veneers, crowns), surgical orthodontics, no treatment, referral to a specialist." },
            { title: "No treatment", body: "The malocclusion remains. Some bites worsen over time with wear or tooth migration." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Discomfort and soreness after adjustments or new aligners.",
              "Ulceration from brackets or aligners initially.",
              "Speech changes during early aligner wear.",
              "Retention is needed long-term to prevent relapse.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Root resorption (shortening of roots).",
              "Gum recession, decalcification or decay from poor hygiene.",
              "Bite changes or TMJ symptoms during treatment.",
              "Need for further treatment if the result is not as planned.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Treatment progress will be reviewed and the plan may evolve based on response and compliance." },
      },
      {
        kicker: "Orthodontic consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient acceptance of long-term retention requirements.",
        statusChip: { title: "Retention", body: "Retainers, often for life, are essential to maintain results." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand retention is required indefinitely to prevent relapse.",
              "I will maintain excellent oral hygiene during treatment.",
              "I understand the projected time is an estimate and may change.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Wear aligners or retainers as instructed.",
              "Brush, floss and (if fixed) use interdental aids around appliances.",
              "Attend all review appointments.",
              "Replace lost or broken appliances promptly.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "Appliance type, expected duration and retention plan have been explained." },
            { title: "I understand the alternatives", body: "Cosmetic restorations, specialist referral or no treatment have been considered." },
            { title: "I understand the risks", body: "Root resorption, recession, decalcification and relapse risks are clear." },
            { title: "I have had the chance to ask questions", body: "My questions and aesthetic goals have been recorded." },
            { title: "I consent to proceed", body: "I agree to the orthodontic treatment plan and retention." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific goals and limitations of treatment", size: "medium" },
            { label: "Retention plan agreed (bonded retainer/removable retainer)", size: "medium" },
            { label: "Hygiene and review schedule", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient, parent or authorised representative signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-15 · Conscious Sedation ─────────────────────────────────────── */
  {
    id: "sedation",
    num: "15",
    ref: "TR-SED-01",
    category: "treatment",
    title: "Conscious Sedation Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Inhalation and IV sedation consent",
    summary: "Inhalation and intravenous conscious sedation.",
    pages: [
      {
        kicker: "Sedation consent · Page 1 of 2",
        title: "Conscious Sedation",
        lede: "Use this form when treatment is to be carried out with conscious sedation in addition to local anaesthesia.",
        statusChip: { title: "Sedation alongside treatment", body: "Patient remains rousable throughout." },
        ribbon: { mark: "i", body: "Confirm ASA grade, medical history, fasting status, escort arrangements and recovery plan before sedation." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Sedationist" },
            { label: "Operating clinician" },
            { label: "Appointment date" },
            { label: "Planned dental treatment", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Sedation technique", options: ["Inhalation sedation (N2O/O2)", "IV midazolam", "Combined inhalation + IV", "Other"] },
            { label: "Escort and recovery", options: ["Responsible adult escort confirmed", "Recovery transport agreed", "Same-day work/childcare arrangements explained", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Sedative medication is administered to reduce anxiety. The patient remains conscious and able to respond. Standard monitoring is used throughout, with recovery monitored before discharge." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Make dental treatment manageable for an anxious patient or for more challenging procedures." },
            { title: "Alternatives", body: "Local anaesthesia alone, behavioural management, referral for general anaesthesia, no treatment." },
            { title: "No treatment", body: "Dental needs remain unaddressed; anxiety may worsen avoidance over time." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Drowsiness and amnesia for the appointment.",
              "Bruising at IV site (for IV sedation).",
              "Reduced ability to make decisions for the rest of the day.",
              "Required escort and no driving for the day.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Over-sedation requiring reversal medication.",
              "Allergic or paradoxical reaction.",
              "Cardiovascular or respiratory changes — managed with monitoring.",
              "Unsuccessful sedation requiring rescheduling.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Consent for sedation does not waive consent for the underlying dental treatment, which is recorded separately." },
      },
      {
        kicker: "Sedation consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient and escort understanding of pre-procedure and recovery instructions.",
        statusChip: { title: "Escort required", body: "A responsible adult must escort and care for the patient." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Pre-procedure", items: [
              "I have followed fasting and medication instructions.",
              "I have arranged a responsible adult escort.",
              "I will not drive or operate machinery for the rest of the day.",
              "I have a safe place to rest and supervision available.",
            ]},
            right: { variant: "alert", title: "After-procedure", items: [
              "I will not sign legal documents or make important decisions for 24 hours.",
              "I will avoid alcohol for 24 hours.",
              "I will contact the practice or emergency services for severe symptoms.",
              "I will attend any follow-up appointments.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the sedation plan", body: "Technique, monitoring, escort and recovery have been explained." },
            { title: "I understand the alternatives", body: "Local anaesthesia, referral for GA or no treatment have been considered." },
            { title: "I understand the risks", body: "Drowsiness, over-sedation, allergy and rescheduling risks are clear." },
            { title: "I have had the chance to ask questions", body: "My questions and concerns have been answered." },
            { title: "I consent to proceed", body: "I agree to the sedation plan in addition to the planned dental treatment." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "ASA grade and medical considerations", size: "medium" },
            { label: "Pre-op observations and discharge plan", size: "medium" },
            { label: "Escort details", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Sedationist signature", "Printed name and GDC number", "Date"] },
            { lines: ["Escort signature (where required)", "Printed name", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-16 · Hygienist / Therapist Direct Access ────────────────────── */
  {
    id: "direct-access",
    num: "16",
    ref: "TR-DIRECT-01",
    category: "treatment",
    title: "Hygienist and Therapist Direct Access Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Direct access scope and limits consent",
    summary: "Direct access to dental hygienist or therapist within scope.",
    pages: [
      {
        kicker: "Direct access consent · Page 1 of 2",
        title: "Direct Access Treatment",
        lede: "Use this form when a patient is seeing a dental hygienist or therapist without first seeing a dentist.",
        statusChip: { title: "Scope of practice", body: "Care within the registrant's scope only." },
        ribbon: { mark: "i", body: "Confirm the patient understands the scope, indemnity arrangements and when onward referral to a dentist is appropriate." },
        sections: [
          { kind: "fields", title: "Patient and clinician details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Clinician" },
            { label: "Appointment date" },
            { label: "Care expected at today's visit", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Scope discussed", options: ["Examination within scope", "Scaling and polishing", "Periodontal therapy", "Fluoride application", "Sealants", "Direct restorations (therapists only)", "Tooth whitening on dentist's prescription", "Other"] },
          ]},
          { kind: "material", title: "Direct access explained", body: "Dental hygienists and therapists are registered professionals who can see patients directly, within their scope of practice. Treatment outside scope (e.g. extractions for a hygienist) is not provided directly." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Provide preventive and supportive dental care directly without first seeing a dentist." },
            { title: "Alternatives", body: "Care provided after dentist examination and treatment plan." },
            { title: "No treatment", body: "Disease may progress without preventive care; dental disease may be missed without dentist screening." },
          ]},
          { kind: "pair", title: "Limits and onward referral",
            left:  { variant: "risk", title: "Scope limits", items: [
              "Care provided is limited to the scope of practice of the treating clinician.",
              "X-rays are taken only when justified and within scope.",
              "Treatment that is outside scope will be referred to a dentist.",
            ]},
            right: { variant: "alert", title: "When dentist review is recommended", items: [
              "If pain, swelling or infection is suspected.",
              "If new caries or restorative issues are identified.",
              "If complex periodontal or surgical needs are identified.",
              "Routinely, in line with practice policy.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If concerns are found beyond scope, the patient will be advised to see a dentist." },
      },
      {
        kicker: "Direct access consent · Page 2 of 2",
        title: "Confirmation and Acknowledgements",
        lede: "Patient understanding of scope and referral expectations.",
        statusChip: { title: "Patient choice", body: "Direct access remains the patient's informed choice." },
        sections: [
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand direct access", body: "I am happy to be seen directly by a hygienist or therapist within their scope." },
            { title: "I understand the limits", body: "Some treatments require dentist examination or referral." },
            { title: "I understand the risks", body: "Some dental issues may not be picked up without a full dental examination." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the planned direct access care today." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific dental concerns raised today", size: "medium" },
            { label: "Onward referral or recall plan", size: "medium" },
            { label: "Communication or accessibility support used", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-17 · Minor Oral Surgery / Biopsy ────────────────────────────── */
  {
    id: "minor-oral-surgery",
    num: "17",
    ref: "TR-MOS-01",
    category: "treatment",
    title: "Minor Oral Surgery and Biopsy Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Soft and hard tissue minor surgery consent",
    summary: "Apicectomy, biopsy, frenectomy and small soft-tissue surgery.",
    pages: [
      {
        kicker: "Minor oral surgery consent · Page 1 of 2",
        title: "Minor Oral Surgery or Biopsy",
        lede: "Use this form for minor surgical procedures including biopsy, apicectomy, frenectomy, exposure of a tooth or small soft-tissue removal.",
        statusChip: { title: "Minor surgery", body: "Carried out under local anaesthetic in primary care." },
        ribbon: { mark: "i", body: "Confirm diagnosis or clinical indication, consider need for histology, photos, and any urgent referral pathway." },
        sections: [
          { kind: "fields", title: "Patient and procedure details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Procedure planned and site", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Procedure type", options: ["Soft tissue biopsy", "Hard tissue biopsy", "Frenectomy", "Operculectomy", "Apicectomy", "Exposure of unerupted tooth", "Excision of small lesion", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "Under local anaesthetic, the gum or affected area is opened, the necessary procedure is carried out and stitches are placed where needed. Samples are sent for laboratory examination if a biopsy is taken." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Treat, diagnose or remove a small oral problem within primary care scope." },
            { title: "Alternatives", body: "Monitoring, conservative treatment, referral to oral surgery or oral medicine, no treatment." },
            { title: "No treatment", body: "Symptoms may persist or worsen; diagnosis may be delayed where biopsy is appropriate." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Swelling, bruising and discomfort for several days.",
              "Stitches and a follow-up appointment.",
              "Restricted diet and activity for a short period.",
              "Wait time for histology results where applicable.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Bleeding, infection or delayed healing.",
              "Altered sensation depending on site.",
              "Need for further treatment depending on histology findings.",
              "Scarring of soft tissue at the surgical site.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "If unexpected findings or anatomy are encountered, the plan may change and will be discussed before any major deviation." },
      },
      {
        kicker: "Minor oral surgery consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of recovery, follow-up and biopsy results process.",
        statusChip: { title: "Histology", body: "Results are discussed at the agreed follow-up." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the procedure and its purpose.",
              "I understand that, where a sample is taken, the result must be followed up.",
              "I have made arrangements for recovery time as needed.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Follow post-op instructions and prescribed medication.",
              "Avoid spicy, hot or hard foods initially.",
              "Avoid smoking, vaping and alcohol during early healing.",
              "Attend follow-up for review and results.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the procedure", body: "The plan, indication and any sample-taking have been explained." },
            { title: "I understand the alternatives", body: "Monitoring, referral or no treatment have been considered." },
            { title: "I understand the risks", body: "Bleeding, infection, scarring and the need for further treatment are clear." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the surgical procedure described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Specific clinical findings or photographs taken", size: "medium" },
            { label: "Histology lab and follow-up arrangement", size: "medium" },
            { label: "Onward referral plan if findings dictate", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },

  /* ─── TR-18 · Bite Splint / Nightguard ───────────────────────────────── */
  {
    id: "bite-splint",
    num: "18",
    ref: "TR-SPLINT-01",
    category: "treatment",
    title: "Bite Splint and Nightguard Consent",
    documentType: "Treatment Consent",
    practiceSubtitle: "Occlusal splint and nightguard consent",
    summary: "Soft and hard occlusal splints for parafunction or TMD.",
    pages: [
      {
        kicker: "Bite splint consent · Page 1 of 2",
        title: "Bite Splint or Nightguard",
        lede: "Use this form for fabrication of an occlusal splint or nightguard to manage tooth wear, parafunction or TMD symptoms.",
        statusChip: { title: "Removable appliance", body: "Custom-made splint worn as instructed." },
        ribbon: { mark: "i", body: "Confirm diagnosis, occlusal assessment, restorative status and patient expectations before fabrication." },
        sections: [
          { kind: "fields", title: "Patient and treatment details", layout: "2-col", items: [
            { label: "Patient full name" },
            { label: "Date of birth" },
            { label: "Treating clinician" },
            { label: "Appointment date" },
            { label: "Splint type and arch", full: true, size: "small" },
          ]},
          { kind: "options", items: [
            { label: "Splint design", options: ["Soft thermoformed nightguard", "Hard acrylic full coverage splint", "Anterior bite plane (Lucia/jig)", "Stabilisation splint", "Other"] },
          ]},
          { kind: "material", title: "Proposed treatment", body: "An impression or scan is taken and a splint is made in the laboratory. The splint is fitted at a later appointment with adjustments to achieve an even bite." },
          { kind: "summary", items: [
            { title: "Purpose",      body: "Protect teeth from wear and fracture, manage muscle and joint symptoms and reduce parafunctional damage." },
            { title: "Alternatives", body: "Behavioural management, restorative protection (crowns, onlays), referral for TMD, no treatment." },
            { title: "No treatment", body: "Wear, fracture and TMD symptoms may continue or worsen." },
          ]},
          { kind: "pair", title: "Specific risks and limitations",
            left:  { variant: "risk", title: "Common or expected", items: [
              "Salivation or speech changes when getting used to the splint.",
              "Need for periodic adjustment.",
              "Splints wear over time and may need replacing.",
              "Soft splints may encourage clenching in some patients.",
            ]},
            right: { variant: "rose", title: "Less common but important", items: [
              "Splints can break or become lost.",
              "Bite changes may occur with long-term wear.",
              "Splints do not stop bruxism but reduce its consequences.",
              "If symptoms do not respond, referral for TMD may be needed.",
            ]},
          },
        ],
        ongoing: { title: "Consent is ongoing", body: "Splint design and bite scheme may be reviewed if symptoms or wear patterns change." },
      },
      {
        kicker: "Bite splint consent · Page 2 of 2",
        title: "Confirmation and Aftercare",
        lede: "Patient understanding of fit, wear schedule and review.",
        statusChip: { title: "Daily use", body: "Wear as instructed for the recommended hours." },
        sections: [
          { kind: "pair",
            left:  { variant: "patient", title: "Patient understanding", items: [
              "I understand the splint protects teeth but does not cure bruxism.",
              "I will wear the splint as instructed.",
              "I understand reviews and replacements may be needed.",
            ]},
            right: { variant: "alert", title: "Aftercare", items: [
              "Clean the splint daily with a brush and cool water.",
              "Avoid hot water, mouthwash or alcohol-based cleaners.",
              "Store in the supplied case when not in use.",
              "Bring the splint to all reviews.",
            ]},
          },
          { kind: "cards", title: "Patient confirmation", items: [
            { title: "I understand the plan", body: "Splint type, wear schedule and review have been explained." },
            { title: "I understand the alternatives", body: "Restorative protection, TMD referral or no treatment have been considered." },
            { title: "I understand the risks", body: "Adjustment needs, splint life and limitations are clear." },
            { title: "I have had the chance to ask questions", body: "My questions have been answered." },
            { title: "I consent to proceed", body: "I agree to the splint plan described." },
          ]},
          { kind: "notes", title: "Personalised notes", items: [
            { label: "Diagnosis and trigger factors", size: "medium" },
            { label: "Wear instructions and review schedule", size: "medium" },
            { label: "Restorative implications", size: "medium" },
          ]},
          { kind: "signatures", panels: [
            { lines: ["Patient signature", "Printed name", "Date"] },
            { lines: ["Clinician signature", "Printed name and GDC number", "Date"] },
          ]},
        ],
      },
    ],
  },
];

export const findConsentCategory = (slug) => consentCategories.find((c) => c.slug === slug);
export const findConsent = (id) => consentsFixture.find((c) => c.id === id);
