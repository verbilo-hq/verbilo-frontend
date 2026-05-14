export const clinicalTabsFixture = [
  { id: "protocols",    label: "Clinical Protocols",            icon: "book"        },
  { id: "consent",      label: "Patient Information Leaflets",  icon: "file"        },
  { id: "consentforms", label: "Consent Forms",                 icon: "checksquare" },
  { id: "guidelines",   label: "Guidelines",                    icon: "bookmark"    },
  { id: "referrals",    label: "Referrals",                     icon: "send"        },
  { id: "safeguarding", label: "Safeguarding",                  icon: "shield"      },
];

export const emergencyDrugsFixture = [
  { name: "Adrenaline (Epinephrine)", indication: "Anaphylaxis",                   dose: "0.5 mg (500 mcg)",  route: "IM — anterolateral thigh", notes: "1:1000 solution, 0.5 mL. Repeat after 5 min if no improvement. Call 999." },
  { name: "Chlorphenamine",           indication: "Anaphylaxis (adjunct)",         dose: "10 mg",             route: "IV or IM",                 notes: "Give after adrenaline. Slow IV over 1 min." },
  { name: "Hydrocortisone",           indication: "Anaphylaxis / Adrenal crisis",  dose: "200 mg",            route: "IV or IM",                 notes: "After adrenaline. Prevents late-phase reaction." },
  { name: "Aspirin (dispersible)",    indication: "Suspected acute MI",            dose: "300 mg",            route: "Oral — chewed",            notes: "Do not give if genuinely contraindicated. Call 999." },
  { name: "GTN Spray",                indication: "Angina / Cardiac chest pain",   dose: "400 mcg (1 spray)", route: "Sublingual",               notes: "Repeat after 5 min if no effect. Max 2 doses. Call 999 if no relief." },
  { name: "Salbutamol Inhaler",       indication: "Acute bronchospasm / Asthma",   dose: "2–10 puffs",        route: "Inhaled via spacer",       notes: "Repeat every 10 min. Call 999 if severe or no response." },
  { name: "Oral Glucose",             indication: "Hypoglycaemia (conscious)",     dose: "15–20 g glucose",   route: "Oral",                     notes: "Glucogel / Dextrogel / 3 glucose tablets. Repeat at 15 min if needed." },
  { name: "Glucagon",                 indication: "Hypoglycaemia (unconscious)",   dose: "1 mg",              route: "IM or SC",                 notes: "Reconstitute before use. Cannot give oral glucose. Call 999." },
  { name: "Buccal Midazolam",         indication: "Status epilepticus",            dose: "10 mg (adult)",     route: "Buccal pouch",             notes: "Call 999 if seizure >5 min or does not resolve." },
  { name: "Oxygen",                   indication: "All medical emergencies",       dose: "10–15 L/min",       route: "Non-rebreather mask",      notes: "Titrate to SpO₂ >94%. Use nasal cannula at lower flow if tolerated." },
];

export const laDrugsFixture = [
  { agent: "Lidocaine 2% + 1:80,000 adrenaline",    mgPerCart: 36, maxMgKg: 4.4, maxAbs: 300 },
  { agent: "Articaine 4% + 1:100,000 adrenaline",   mgPerCart: 72, maxMgKg: 7.0, maxAbs: 500 },
  { agent: "Articaine 4% + 1:200,000 adrenaline",   mgPerCart: 72, maxMgKg: 7.0, maxAbs: 500 },
  { agent: "Prilocaine 3% + felypressin",           mgPerCart: 54, maxMgKg: 6.0, maxAbs: 400 },
  { agent: "Mepivacaine 3% plain",                  mgPerCart: 54, maxMgKg: 4.4, maxAbs: 300 },
  { agent: "Bupivacaine 0.5% + 1:200,000 adrenaline", mgPerCart: 9, maxMgKg: 2.0, maxAbs: 150 },
];

export const antibioticsFixture = [
  { indication: "Dental abscess with systemic features",     first: "Amoxicillin 500 mg TDS × 5 days",          alt: "Metronidazole 400 mg TDS × 5 days (pen allergy)",     notes: "Only if systemic features. Drainage is primary treatment." },
  { indication: "Pericoronitis with systemic involvement",   first: "Metronidazole 400 mg TDS × 3–5 days",      alt: "Amoxicillin + Metronidazole if severe",                notes: "Local irrigation first. Antibiotics for systemic features only." },
  { indication: "Acute necrotising ulcerative gingivitis",   first: "Metronidazole 400 mg TDS × 3 days",        alt: "Amoxicillin 500 mg TDS if severe",                     notes: "Plus debridement and chlorhexidine irrigation." },
  { indication: "Surgical prophylaxis — high-risk patients", first: "Amoxicillin 2 g single dose, 1 hr pre-op", alt: "Clindamycin 600 mg (penicillin allergy)",              notes: "Only for specific NICE/SDCEP indications. Not routine." },
  { indication: "Infective endocarditis prophylaxis",        first: "Not routinely recommended (NICE CG64)",    alt: "Discuss with cardiologist for highest-risk conditions", notes: "Good oral hygiene is primary prevention. Do NOT prescribe routinely." },
];

export const protocolCategoriesFixture = [
  { id: "emergency", label: "Medical Emergencies",      icon: "heart",    items: [
    { name: "Anaphylaxis Management",                desc: "Recognition, immediate drug treatment, and 999 protocol.",                           reviewed: "Jan 2024" },
    { name: "Cardiac Arrest (Basic Life Support)",   desc: "CPR sequence, AED deployment, and paramedic handover protocol.",                     reviewed: "Jan 2024" },
    { name: "Acute MI & Angina",                     desc: "GTN administration, aspirin, and ambulance pathway.",                                reviewed: "Jan 2024" },
    { name: "Hypoglycaemic Episode",                 desc: "Conscious and unconscious pathways, glucagon reconstitution and use.",               reviewed: "Jan 2024" },
    { name: "Status Epilepticus",                    desc: "Buccal midazolam administration, positioning, and 999 criteria.",                    reviewed: "Jan 2024" },
    { name: "Acute Asthma Attack",                   desc: "Salbutamol via spacer, severity assessment, escalation pathway.",                    reviewed: "Jan 2024" },
    { name: "Syncope (Vasovagal Faint)",             desc: "Positioning, monitoring, and differential diagnosis checklist.",                     reviewed: "Nov 2023" },
    { name: "Choking / Airway Obstruction",          desc: "Back blows, abdominal thrusts, unconscious patient protocol.",                       reviewed: "Nov 2023" },
  ]},
  { id: "ipc", label: "Decontamination & IPC",       icon: "shield",   items: [
    { name: "Instrument Decontamination Cycle",      desc: "Pre-clean, ultrasonic wash, inspection, packaging, sterilization, and storage.",    reviewed: "Feb 2024" },
    { name: "Autoclave Validation & Records",        desc: "Daily, weekly, and quarterly checks. Bowie-Dick test procedure.",                   reviewed: "Feb 2024" },
    { name: "Washer-Disinfector Protocol",           desc: "Cycle verification, temperature monitoring, and maintenance log.",                  reviewed: "Jan 2024" },
    { name: "Sharps Handling & Needlestick",         desc: "Safe use, disposal, post-exposure prophylaxis, and incident reporting.",            reviewed: "Jan 2024" },
    { name: "Clinical Waste Segregation",            desc: "Colour-coded stream guide for dental waste classification (HTM 07-01).",            reviewed: "Nov 2023" },
    { name: "Surgical Hand Hygiene",                 desc: "WHO 5 moments, product selection, and audit criteria.",                             reviewed: "Nov 2023" },
    { name: "PPE Selection Guide",                   desc: "Gloves, masks, visors, and gowns by procedure type and aerosol risk.",              reviewed: "Jan 2024" },
    { name: "Dental Water Line Management",          desc: "HTM 01-05 compliance, biofilm control, and weekly testing schedule.",               reviewed: "Dec 2023" },
  ]},
  { id: "radiology", label: "Radiography & IRMER",   icon: "monitor",  items: [
    { name: "IRMER 2017 — Local Rules & Procedures", desc: "Employer procedures, dose reference levels, and written referral criteria.",        reviewed: "Dec 2023" },
    { name: "Radiograph Selection Criteria (FGDP)",  desc: "Evidence-based selection guide for BW, PA, OPT, and CBCT.",                          reviewed: "Dec 2023" },
    { name: "Intraoral Radiograph Technique Guide",  desc: "Paralleling technique, positioning jigs, and image quality criteria.",              reviewed: "Oct 2023" },
    { name: "OPT & Cephalometric Protocol",          desc: "Patient positioning, machine settings, and QA criteria.",                           reviewed: "Oct 2023" },
    { name: "CBCT Justification & Consent",          desc: "Indication criteria, consent process, dose reporting, and record documentation.",   reviewed: "Nov 2023" },
    { name: "Radiograph Quality Audit Grading",      desc: "Excellent / diagnostically acceptable / unacceptable — recording protocol.",        reviewed: "Jan 2024" },
    { name: "Radiography in Pregnancy",              desc: "Risk communication, consent, and dose minimisation approach.",                       reviewed: "Sep 2023" },
  ]},
  { id: "perio", label: "Periodontal",               icon: "barchart", items: [
    { name: "BPE Screening Protocol",                desc: "Scoring criteria, recording method, and treatment planning by BPE code (0–*).",     reviewed: "Jan 2024" },
    { name: "BSP 2019 Staging & Grading",            desc: "Full periodontal assessment, staging I–IV, and grading A–C.",                       reviewed: "Jan 2024" },
    { name: "Periodontal Treatment Steps 1–4",       desc: "Structured active therapy protocol, patient monitoring, and endpoints.",            reviewed: "Jan 2024" },
    { name: "Supportive Periodontal Therapy (SPT)", desc: "Recall intervals, reassessment criteria, and long-term management pathway.",         reviewed: "Nov 2023" },
    { name: "Furcation Management Protocol",         desc: "Detection, Glickman/Hamp classification, and treatment options by grade.",          reviewed: "Oct 2023" },
  ]},
  { id: "endo", label: "Endodontics",                icon: "zap",      items: [
    { name: "Pulp Vitality Testing Protocol",        desc: "EPT, cold, and heat testing sequence — interpretation and recording guide.",        reviewed: "Jan 2024" },
    { name: "RCT Aseptic Technique",                 desc: "Rubber dam placement, access cavity design, and contamination prevention.",         reviewed: "Jan 2024" },
    { name: "Irrigation & Intracanal Medicament",    desc: "NaOCl concentration guide, EDTA use, Ca(OH)₂ placement protocol.",                  reviewed: "Jan 2024" },
    { name: "Obturation Protocol",                   desc: "Working length verification, master cone selection, and technique guide.",          reviewed: "Nov 2023" },
    { name: "RCT Retreatment — Indications",         desc: "Post removal, separated instrument protocol, and specialist referral criteria.",    reviewed: "Oct 2023" },
  ]},
  { id: "surgery", label: "Implants & Oral Surgery", icon: "star",     items: [
    { name: "Pre-Implant Assessment Checklist",      desc: "Medical history, bone assessment, CBCT criteria, and consent workflow.",            reviewed: "Feb 2024" },
    { name: "Surgical Extraction Protocol",          desc: "Flap design, sectioning technique, socket irrigation, and haemostasis.",            reviewed: "Jan 2024" },
    { name: "Post-Surgical Patient Instructions",    desc: "Bleeding control, diet, hygiene, analgesia, and complication flags.",               reviewed: "Jan 2024" },
    { name: "Dry Socket (Alveolar Osteitis)",        desc: "Diagnosis, Alvogyl / Bismuth Iodoform Paste placement, and review protocol.",       reviewed: "Nov 2023" },
    { name: "Implant Maintenance Protocol",          desc: "Hygiene regime, screw torque checks, and peri-implantitis pathway.",                reviewed: "Jan 2024" },
  ]},
  { id: "whitening", label: "Whitening & Aesthetics", icon: "tooth",   items: [
    { name: "Home Whitening Protocol",               desc: "Patient selection, tray fabrication, concentration guide, and review.",              reviewed: "Feb 2024" },
    { name: "In-Surgery Whitening Protocol",         desc: "Gingival protection, lamp settings, shade recording, and aftercare.",               reviewed: "Feb 2024" },
    { name: "Sensitivity Management",                desc: "Pre-treatment fluoride, desensitising agents, and patient advice.",                  reviewed: "Jan 2024" },
    { name: "Whitening Consent & Contraindications", desc: "Age restrictions, pregnancy, tetracycline, and informed consent requirements.",     reviewed: "Jan 2024" },
  ]},
];

export const pilsFixture = [
  { name: "After Your Extraction — What to Expect",          category: "Oral Surgery"  },
  { name: "Root Canal Treatment — What to Expect",           category: "Endodontics"   },
  { name: "Caring for Your New Crown or Bridge",             category: "Restorative"   },
  { name: "Your Guide to Dental Implants",                   category: "Implants"      },
  { name: "Caring for Your Fixed Brace",                     category: "Orthodontics"  },
  { name: "Whitening — Before & After Care",                 category: "Aesthetics"    },
  { name: "Understanding Gum Disease",                       category: "Periodontal"   },
  { name: "Managing Dental Anxiety",                         category: "Patient Care"  },
  { name: "Children's Dental Health (0–5 Years)",            category: "Paediatric"    },
  { name: "Fissure Sealants — Information for Parents",      category: "Paediatric"    },
  { name: "Understanding Your Dentures",                     category: "Prosthetics"   },
  { name: "Your Mouthguard — Care & Use",                    category: "Appliances"    },
];

export const safeguardingContactsFixture = [
  { role: "Practice Safeguarding Lead",         name: "Mark Thompson",       phone: "020 7946 0000" },
  { role: "NSPCC Helpline (Child Protection)",  name: "NSPCC",               phone: "0808 800 5000" },
  { role: "Local Authority MASH (Children)",    name: "Westminster MASH",    phone: "020 7641 4000" },
  { role: "Adult Social Care Safeguarding",     name: "Westminster Council", phone: "020 7641 2070" },
  { role: "NHS Prevent Lead",                   name: "NHS England (London)", phone: "020 7932 3700" },
];

export const safeguardingDocsFixture = [
  { name: "Child Safeguarding Policy & Procedure",         reviewed: "Jan 2024" },
  { name: "Adult Safeguarding Policy",                     reviewed: "Jan 2024" },
  { name: "Recognising Abuse — Signs & Indicators",        reviewed: "Nov 2023" },
  { name: "How to Make a Safeguarding Referral",           reviewed: "Jan 2024" },
  { name: "Prevent Duty Guidance for Healthcare Staff",    reviewed: "Nov 2023" },
  { name: "FGM — Identifying & Reporting Obligations",     reviewed: "Dec 2023" },
  { name: "Domestic Abuse — Recognition & Signposting",    reviewed: "Oct 2023" },
];
