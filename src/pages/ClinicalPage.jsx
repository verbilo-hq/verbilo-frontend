import { useState } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import styles from "./ClinicalPage.module.css";

/* ── Data ──────────────────────────────────────────────────────────────────── */

const TABS = [
  { id: "protocols",    label: "Clinical Protocols",        icon: "book"        },
  { id: "consent",      label: "Patient Information Leaflets", icon: "file"     },
  { id: "consentforms", label: "Consent Forms",             icon: "checksquare" },
  { id: "guidelines",   label: "Guidelines",                icon: "bookmark"    },
  { id: "referrals",    label: "Referrals",                 icon: "send"        },
  { id: "safeguarding", label: "Safeguarding",              icon: "shield"      },
];

const emergencyDrugs = [
  { name: "Adrenaline (Epinephrine)", indication: "Anaphylaxis", dose: "0.5 mg (500 mcg)", route: "IM — anterolateral thigh", notes: "1:1000 solution, 0.5 mL. Repeat after 5 min if no improvement. Call 999." },
  { name: "Chlorphenamine",           indication: "Anaphylaxis (adjunct)",         dose: "10 mg",              route: "IV or IM",               notes: "Give after adrenaline. Slow IV over 1 min." },
  { name: "Hydrocortisone",           indication: "Anaphylaxis / Adrenal crisis",  dose: "200 mg",             route: "IV or IM",               notes: "After adrenaline. Prevents late-phase reaction." },
  { name: "Aspirin (dispersible)",    indication: "Suspected acute MI",            dose: "300 mg",             route: "Oral — chewed",          notes: "Do not give if genuinely contraindicated. Call 999." },
  { name: "GTN Spray",                indication: "Angina / Cardiac chest pain",   dose: "400 mcg (1 spray)",  route: "Sublingual",             notes: "Repeat after 5 min if no effect. Max 2 doses. Call 999 if no relief." },
  { name: "Salbutamol Inhaler",       indication: "Acute bronchospasm / Asthma",   dose: "2–10 puffs",         route: "Inhaled via spacer",     notes: "Repeat every 10 min. Call 999 if severe or no response." },
  { name: "Oral Glucose",             indication: "Hypoglycaemia (conscious)",     dose: "15–20 g glucose",    route: "Oral",                   notes: "Glucogel / Dextrogel / 3 glucose tablets. Repeat at 15 min if needed." },
  { name: "Glucagon",                 indication: "Hypoglycaemia (unconscious)",   dose: "1 mg",               route: "IM or SC",               notes: "Reconstitute before use. Cannot give oral glucose. Call 999." },
  { name: "Buccal Midazolam",         indication: "Status epilepticus",            dose: "10 mg (adult)",      route: "Buccal pouch",           notes: "Call 999 if seizure >5 min or does not resolve." },
  { name: "Oxygen",                   indication: "All medical emergencies",       dose: "10–15 L/min",        route: "Non-rebreather mask",    notes: "Titrate to SpO₂ >94%. Use nasal cannula at lower flow if tolerated." },
];

const laDrugs = [
  { agent: "Lidocaine 2% + 1:80,000 adrenaline",    mgPerCart: 36, maxMgKg: 4.4, maxAbs: 300 },
  { agent: "Articaine 4% + 1:100,000 adrenaline",   mgPerCart: 72, maxMgKg: 7.0, maxAbs: 500 },
  { agent: "Articaine 4% + 1:200,000 adrenaline",   mgPerCart: 72, maxMgKg: 7.0, maxAbs: 500 },
  { agent: "Prilocaine 3% + felypressin",            mgPerCart: 54, maxMgKg: 6.0, maxAbs: 400 },
  { agent: "Mepivacaine 3% plain",                   mgPerCart: 54, maxMgKg: 4.4, maxAbs: 300 },
  { agent: "Bupivacaine 0.5% + 1:200,000 adrenaline", mgPerCart: 9, maxMgKg: 2.0, maxAbs: 150 },
];

const antibiotics = [
  { indication: "Dental abscess with systemic features",        first: "Amoxicillin 500 mg TDS × 5 days",       alt: "Metronidazole 400 mg TDS × 5 days (pen allergy)",    notes: "Only if systemic features. Drainage is primary treatment." },
  { indication: "Pericoronitis with systemic involvement",      first: "Metronidazole 400 mg TDS × 3–5 days",   alt: "Amoxicillin + Metronidazole if severe",               notes: "Local irrigation first. Antibiotics for systemic features only." },
  { indication: "Acute necrotising ulcerative gingivitis",      first: "Metronidazole 400 mg TDS × 3 days",     alt: "Amoxicillin 500 mg TDS if severe",                    notes: "Plus debridement and chlorhexidine irrigation." },
  { indication: "Surgical prophylaxis — high-risk patients",    first: "Amoxicillin 2 g single dose, 1 hr pre-op", alt: "Clindamycin 600 mg (penicillin allergy)",           notes: "Only for specific NICE/SDCEP indications. Not routine." },
  { indication: "Infective endocarditis prophylaxis",           first: "Not routinely recommended (NICE CG64)", alt: "Discuss with cardiologist for highest-risk conditions", notes: "Good oral hygiene is primary prevention. Do NOT prescribe routinely." },
];

const protocolCategories = [
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
    { name: "Radiograph Selection Criteria (FGDP)",  desc: "Evidence-based selection guide for BW, PA, OPT, and CBCT.",                        reviewed: "Dec 2023" },
    { name: "Intraoral Radiograph Technique Guide",  desc: "Paralleling technique, positioning jigs, and image quality criteria.",             reviewed: "Oct 2023" },
    { name: "OPT & Cephalometric Protocol",          desc: "Patient positioning, machine settings, and QA criteria.",                          reviewed: "Oct 2023" },
    { name: "CBCT Justification & Consent",          desc: "Indication criteria, consent process, dose reporting, and record documentation.",  reviewed: "Nov 2023" },
    { name: "Radiograph Quality Audit Grading",      desc: "Excellent / diagnostically acceptable / unacceptable — recording protocol.",       reviewed: "Jan 2024" },
    { name: "Radiography in Pregnancy",              desc: "Risk communication, consent, and dose minimisation approach.",                      reviewed: "Sep 2023" },
  ]},
  { id: "perio", label: "Periodontal",               icon: "barchart", items: [
    { name: "BPE Screening Protocol",                desc: "Scoring criteria, recording method, and treatment planning by BPE code (0–*).",    reviewed: "Jan 2024" },
    { name: "BSP 2019 Staging & Grading",            desc: "Full periodontal assessment, staging I–IV, and grading A–C.",                      reviewed: "Jan 2024" },
    { name: "Periodontal Treatment Steps 1–4",       desc: "Structured active therapy protocol, patient monitoring, and endpoints.",            reviewed: "Jan 2024" },
    { name: "Supportive Periodontal Therapy (SPT)", desc: "Recall intervals, reassessment criteria, and long-term management pathway.",        reviewed: "Nov 2023" },
    { name: "Furcation Management Protocol",         desc: "Detection, Glickman/Hamp classification, and treatment options by grade.",         reviewed: "Oct 2023" },
  ]},
  { id: "endo", label: "Endodontics",                icon: "zap",      items: [
    { name: "Pulp Vitality Testing Protocol",        desc: "EPT, cold, and heat testing sequence — interpretation and recording guide.",       reviewed: "Jan 2024" },
    { name: "RCT Aseptic Technique",                 desc: "Rubber dam placement, access cavity design, and contamination prevention.",        reviewed: "Jan 2024" },
    { name: "Irrigation & Intracanal Medicament",    desc: "NaOCl concentration guide, EDTA use, Ca(OH)₂ placement protocol.",               reviewed: "Jan 2024" },
    { name: "Obturation Protocol",                   desc: "Working length verification, master cone selection, and technique guide.",         reviewed: "Nov 2023" },
    { name: "RCT Retreatment — Indications",         desc: "Post removal, separated instrument protocol, and specialist referral criteria.",   reviewed: "Oct 2023" },
  ]},
  { id: "surgery", label: "Implants & Oral Surgery", icon: "star",     items: [
    { name: "Pre-Implant Assessment Checklist",      desc: "Medical history, bone assessment, CBCT criteria, and consent workflow.",           reviewed: "Feb 2024" },
    { name: "Surgical Extraction Protocol",          desc: "Flap design, sectioning technique, socket irrigation, and haemostasis.",          reviewed: "Jan 2024" },
    { name: "Post-Surgical Patient Instructions",    desc: "Bleeding control, diet, hygiene, analgesia, and complication flags.",             reviewed: "Jan 2024" },
    { name: "Dry Socket (Alveolar Osteitis)",        desc: "Diagnosis, Alvogyl / Bismuth Iodoform Paste placement, and review protocol.",     reviewed: "Nov 2023" },
    { name: "Implant Maintenance Protocol",          desc: "Hygiene regime, screw torque checks, and peri-implantitis pathway.",              reviewed: "Jan 2024" },
  ]},
  { id: "whitening", label: "Whitening & Aesthetics", icon: "tooth",   items: [
    { name: "Home Whitening Protocol",               desc: "Patient selection, tray fabrication, concentration guide, and review.",            reviewed: "Feb 2024" },
    { name: "In-Surgery Whitening Protocol",         desc: "Gingival protection, lamp settings, shade recording, and aftercare.",             reviewed: "Feb 2024" },
    { name: "Sensitivity Management",               desc: "Pre-treatment fluoride, desensitising agents, and patient advice.",               reviewed: "Jan 2024" },
    { name: "Whitening Consent & Contraindications", desc: "Age restrictions, pregnancy, tetracycline, and informed consent requirements.",   reviewed: "Jan 2024" },
  ]},
];


const pils = [
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

/* ─── Consent Forms ─── */
const SOURCE_CFG = {
  "SDCEP":             { bg: "rgba(0,105,116,0.1)",   color: "#006974" },
  "BDA":               { bg: "rgba(21,101,192,0.1)",  color: "#1565c0" },
  "CGDent":            { bg: "rgba(106,27,154,0.1)",  color: "#6a1b9a" },
  "Dental Protection": { bg: "rgba(46,125,50,0.1)",   color: "#2e7d32" },
};

const consentCategories = [
  { id: "general", label: "General Treatment", icon: "file", forms: [
    { name: "General Consent to Treatment",          desc: "Routine low-risk care: examination, radiographs, scale & polish, fillings, and preventive treatment.",                                                          source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Continuation / Variation of Treatment", desc: "Used when the agreed treatment plan changes significantly during an active course of care.",                                                                     source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Photography / Clinical Records",        desc: "Consent to take intraoral and extraoral photographs for clinical records, referral, teaching, or audit.",                                                        source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
  ]},
  { id: "surgical", label: "Oral Surgery", icon: "heart", forms: [
    { name: "Simple Tooth Extraction",               desc: "Covers procedure, risks (dry socket, nerve injury, root fracture, sinus involvement), aftercare, and alternatives.",                                             source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Surgical Extraction / Wisdom Tooth",    desc: "Covers surgical approach, flap design, bone removal, risks of inferior alveolar or lingual nerve injury, swelling, trismus, and post-op instructions.",         source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Minor Oral Surgery (General)",          desc: "Covers soft tissue surgery, biopsy, frenectomy, apicectomy, and implant-related surgical procedures.",                                                           source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
  ]},
  { id: "endodontic", label: "Endodontics", icon: "zap", forms: [
    { name: "Root Canal Treatment (RCT)",            desc: "Covers procedure, risks (instrument separation, perforation, discolouration), success rates (~85–90%), and alternatives including extraction.",                   source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Root Canal Retreatment",                desc: "Covers reason for retreatment, reduced prognosis vs primary RCT, risks of post removal, and alternatives including extraction or apicectomy.",                   source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
  ]},
  { id: "restorative", label: "Restorative", icon: "edit", forms: [
    { name: "Amalgam Restoration",                   desc: "Covers material properties, mercury content, contraindications (pregnancy, allergy, renal disease), estimated lifespan, and composite alternative.",             source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Composite Restoration",                 desc: "Covers bonding mechanism, postoperative sensitivity, staining risk, lifespan (~7–10 years), and when amalgam may be preferable.",                               source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Dental Crown / Onlay",                  desc: "Covers irreversible tooth preparation, temporary crown stage, risks (sensitivity, pulp damage, fracture), lifespan, and alternatives.",                          source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
    { name: "Dental Bridge",                         desc: "Covers abutment preparation, irreversibility, hygiene requirements, lifespan (~10–15 years), failure risk, and implant as an alternative.",                      source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
    { name: "Porcelain Veneer",                      desc: "Covers degree of tooth reduction, irreversibility, chipping risk, colour-matching limitations, lifespan (~10 years), and alternatives.",                         source: "CGDent",            url: "https://cgdent.uk/resources/"                                                             },
  ]},
  { id: "prosthodontic", label: "Prosthetics", icon: "clipboard", forms: [
    { name: "Complete (Full) Dentures",              desc: "Covers adaptation period, functional limitations vs natural teeth, hygiene requirements, progressive bone resorption, and implant-retained alternative.",         source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Partial Dentures",                      desc: "Covers design rationale, clasps and their effect on abutment teeth, hygiene requirements, lifespan, and alternatives.",                                           source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Dental Implant",                        desc: "Covers surgical risks, osseointegration failure rate (~5–10%), smoking and medical contraindications, maintenance, costs, and long-term prognosis.",              source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
  ]},
  { id: "periodontal", label: "Periodontal", icon: "barchart", forms: [
    { name: "Non-Surgical Periodontal Treatment",    desc: "Covers scaling and root surface debridement, post-treatment sensitivity, bleeding, expected outcomes, maintenance programme, and prognosis.",                     source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Periodontal Surgery",                   desc: "Covers surgical access, risks (recession, sensitivity, wound dehiscence), post-operative instructions, and criteria for specialist referral.",                    source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
  ]},
  { id: "cosmetic", label: "Cosmetic & Aesthetic", icon: "star", forms: [
    { name: "Tooth Whitening",                       desc: "Covers active ingredients (hydrogen / carbamide peroxide), sensitivity risk, outcome variability, contraindications, and touch-up requirements.",                 source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Composite Bonding / Edge Bonding",      desc: "Covers additive vs reductive approach, staining and chipping risk, lifespan (~5 years), maintenance and polishing needs, and alternatives.",                     source: "CGDent",            url: "https://cgdent.uk/resources/"                                                             },
  ]},
  { id: "orthodontic", label: "Orthodontics", icon: "target", forms: [
    { name: "Fixed Orthodontic Appliance",           desc: "Covers decalcification risk, root resorption, estimated duration, retention requirements, and relapse risk if retainers are not worn.",                           source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
    { name: "Removable Appliance / Clear Aligners",  desc: "Covers compliance requirement, outcome limitations vs fixed appliances, refinements process, retention phase, and relapse risk.",                                 source: "BDA",               url: "https://www.bda.org/advice/templates-checklists-and-audits/"                             },
  ]},
  { id: "sedation", label: "Sedation", icon: "clock", forms: [
    { name: "Conscious Sedation (IV Midazolam)",     desc: "Covers medication, amnesia effect, mandatory adult escort, fasting instructions, post-sedation driving and alcohol restrictions, and risks.",                     source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
    { name: "Inhalation Sedation (Nitrous Oxide)",   desc: "Covers relative analgesia, contraindications (COPD, vitamin B12 deficiency, first trimester pregnancy), recovery time, and suitability.",                        source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/templates/"                                                  },
  ]},
  { id: "special", label: "Special Circumstances", icon: "shield", forms: [
    { name: "Treatment Refusal — Informed Refusal",  desc: "Documents that the patient understands the risks of declining recommended treatment and has made a fully informed decision.",                                      source: "Dental Protection", url: "https://www.dentalprotection.org/uk/guides/consent"                                      },
    { name: "Child / Under 16 — Parental Consent",  desc: "Parental or guardian consent for under-16s. Includes section to record Gillick competence assessment where the child may consent independently.",                 source: "SDCEP",             url: "https://www.psm.sdcep.org.uk/topics/ethical-practice/consent/"                           },
    { name: "Patient Lacking Mental Capacity",       desc: "Best-interests decision record under Mental Capacity Act 2005. References LPA or IMCA where applicable. Required when patient cannot consent.",                   source: "Dental Protection", url: "https://www.dentalprotection.org/uk/articles/mental-capacity-and-consent"               },
  ]},
];

const guidelineSources = [
  { org: "GDC", color: "#006974", items: [
    { name: "Standards for the Dental Team",       year: "2013 (updated)", summary: "Core professional standards for all GDC registrants.",                          url: "https://www.gdc-uk.org/standards-guidance/standards-and-guidance/standards-for-the-dental-team" },
    { name: "Guidance on Prescribing Medicines",   year: "2019",           summary: "Prescribing responsibilities and record-keeping requirements.",                  url: "https://www.gdc-uk.org/standards-guidance/standards-and-guidance/gdc-guidance-for-dental-professionals/guidance-on-prescribing-medicines" },
    { name: "Scope of Practice",                   year: "2013 (updated 2025)", summary: "Defines what each registrant category can and cannot do.",                  url: "https://www.gdc-uk.org/standards-guidance/standards-and-guidance/scope-of-practice" },
  ]},
  { org: "SDCEP", color: "#2E7D32", items: [
    { name: "Drug Prescribing for Dentistry",                        year: "2016 (live resource)", summary: "Comprehensive prescribing in dental practice reference guide.",     url: "https://www.sdcep.org.uk/published-guidance/drug-prescribing/" },
    { name: "Management of Acute Dental Problems",                   year: "2013",                 summary: "Triaging and managing dental emergencies including abscess.",        url: "https://www.sdcep.org.uk/published-guidance/acute-dental-problems/" },
    { name: "Prevention & Treatment of Periodontal Diseases",        year: "2025 (2nd Ed.)",       summary: "Structured care pathway aligned to staging and grading.",            url: "https://www.sdcep.org.uk/published-guidance/periodontal-care/" },
    { name: "Decontamination into Practice (withdrawn — see HTM 01-05)", year: "2016",             summary: "Superseded by HTM 01-05. Retained for reference only.",              url: "https://www.sdcep.org.uk/published-guidance/decontamination/" },
  ]},
  { org: "CGDent / RCS", color: "#1565C0", items: [
    { name: "Selection Criteria for Dental Radiography (3rd Ed.)", year: "2018", summary: "Evidence-based radiograph selection — essential daily reference.",              url: "https://cgdent.uk/selection-criteria-for-dental-radiography/" },
    { name: "Clinical Examination & Record Keeping",               year: "2016", summary: "Standards for dental examinations and clinical note quality.",                  url: "https://cgdent.uk/clinical-examination-and-record-keeping/" },
  ]},
  { org: "BSP", color: "#7B1FA2", items: [
    { name: "UK Clinical Practice Guidelines for Periodontitis (S3)", year: "2021", summary: "Step-by-step treatment pathway aligned to 2018 classification.",            url: "https://www.bsperio.org.uk/professionals/bsp-uk-clinical-practice-guidelines-for-the-treatment-of-periodontitis" },
    { name: "EFP S3 Treatment Guidelines — Stage I–III Periodontitis", year: "2020", summary: "Evidence-based guidance on active periodontal therapy.",                   url: "https://www.bsperio.org.uk/news/s3-treatment-guidelines-for-periodontitis" },
  ]},
  { org: "NICE", color: "#E53935", items: [
    { name: "Dental Checks: Intervals Between Reviews (CG19)", year: "2004 / 2021", summary: "Recall intervals from 3 to 24 months based on risk.",                       url: "https://www.nice.org.uk/guidance/cg19" },
    { name: "Dental Abscess — Antimicrobial Prescribing (CKS)", year: "updated",   summary: "When to prescribe, first-choice agents, and treatment duration.",            url: "https://cks.nice.org.uk/topics/dental-abscess/" },
    { name: "Endocarditis: Prophylaxis Guidance (CG64)",        year: "2008 / 2016", summary: "Antibiotic prophylaxis NOT recommended routinely. See guidance.",          url: "https://www.nice.org.uk/guidance/cg64" },
  ]},
  { org: "UKHSA / NHS England", color: "#F57C00", items: [
    { name: "Dental Antimicrobial Stewardship Toolkit",                    year: "2016 (updated 2023)", summary: "Responsible antibiotic use and the TARGET antibiotics toolkit.",   url: "https://www.gov.uk/guidance/dental-antimicrobial-stewardship-toolkit" },
    { name: "HTM 01-05: Decontamination in Primary Care Dental Practices", year: "2013 (updated 2024)", summary: "Definitive IPC and decontamination standard for dental practices.", url: "https://www.england.nhs.uk/publication/decontamination-in-primary-care-dental-practices-htm-01-05/" },
  ]},
];

const referralPathways = [
  { label: "Oral Surgery / OMFS", icon: "clinical", docs: [
    { name: "Oral Surgery Referral Form",               type: "PDF",  updated: "Feb 2024" },
    { name: "Surgical Extraction Pathway Guide",        type: "PDF",  updated: "Jan 2024" },
    { name: "Impacted Third Molar Referral Criteria",   type: "PDF",  updated: "Nov 2023" },
    { name: "Biopsy & Soft Tissue Lesion Pathway",      type: "DOCX", updated: "Oct 2023" },
  ]},
  { label: "2-Week Wait — Oral Cancer", icon: "alert", urgent: true, docs: [
    { name: "2WW Urgent Referral Form (NHS England)",   type: "PDF",  updated: "Feb 2024" },
    { name: "Oral Cancer Red Flags — Referral Criteria",type: "PDF",  updated: "Jan 2024" },
    { name: "Soft Tissue Lesion Monitoring Chart",      type: "DOCX", updated: "Nov 2023" },
    { name: "Patient Communication — Urgent Referral",  type: "PDF",  updated: "Dec 2023" },
  ]},
  { label: "Orthodontics", icon: "star", docs: [
    { name: "Orthodontic Referral Form (Adults)",       type: "PDF",  updated: "Feb 2024" },
    { name: "Orthodontic Referral Form (Under 18s)",    type: "PDF",  updated: "Feb 2024" },
    { name: "Invisalign Clinical Pathway",              type: "PDF",  updated: "Jan 2024" },
    { name: "Retention Protocol & Follow-Up Pathway",   type: "PDF",  updated: "Oct 2023" },
  ]},
  { label: "Endodontic Specialists", icon: "zap", docs: [
    { name: "Endodontic Specialist Referral Form",      type: "PDF",  updated: "Jan 2024" },
    { name: "Root Canal Retreatment Pathway",           type: "PDF",  updated: "Feb 2024" },
    { name: "Apicectomy Referral Criteria",             type: "PDF",  updated: "Dec 2023" },
    { name: "CBCT Request for Endo Cases",              type: "DOCX", updated: "Nov 2023" },
  ]},
  { label: "Periodontal Specialists", icon: "barchart", docs: [
    { name: "Periodontal Specialist Referral Form",     type: "PDF",  updated: "Jan 2024" },
    { name: "Supporting Periodontal Data Summary",      type: "DOCX", updated: "Nov 2023" },
    { name: "Stage III / IV Referral Criteria",         type: "PDF",  updated: "Dec 2023" },
    { name: "Peri-Implantitis Specialist Pathway",      type: "PDF",  updated: "Oct 2023" },
  ]},
  { label: "Restorative & Implants", icon: "award", docs: [
    { name: "Implant Referral Form",                    type: "PDF",  updated: "Feb 2024" },
    { name: "Complex Restorative Referral Form",        type: "PDF",  updated: "Jan 2024" },
    { name: "Implant Pre-Assessment Criteria",          type: "PDF",  updated: "Nov 2023" },
  ]},
];

const safeguardingContacts = [
  { role: "Practice Safeguarding Lead",         name: "Mark Thompson",      phone: "020 7946 0000" },
  { role: "NSPCC Helpline (Child Protection)",  name: "NSPCC",              phone: "0808 800 5000" },
  { role: "Local Authority MASH (Children)",    name: "Westminster MASH",   phone: "020 7641 4000" },
  { role: "Adult Social Care Safeguarding",     name: "Westminster Council", phone: "020 7641 2070" },
  { role: "NHS Prevent Lead",                   name: "NHS England (London)", phone: "020 7932 3700" },
];

const safeguardingDocs = [
  { name: "Child Safeguarding Policy & Procedure",         reviewed: "Jan 2024" },
  { name: "Adult Safeguarding Policy",                     reviewed: "Jan 2024" },
  { name: "Recognising Abuse — Signs & Indicators",        reviewed: "Nov 2023" },
  { name: "How to Make a Safeguarding Referral",           reviewed: "Jan 2024" },
  { name: "Prevent Duty Guidance for Healthcare Staff",    reviewed: "Nov 2023" },
  { name: "FGM — Identifying & Reporting Obligations",     reviewed: "Dec 2023" },
  { name: "Domestic Abuse — Recognition & Signposting",    reviewed: "Oct 2023" },
];

/* ── Shared small components ───────────────────────────────────────────────── */

const DocRow = ({ name, reviewed, pages, type = "PDF" }) => (
  <div className={styles.docRow}>
    <div className={styles.docIconWrap}>
      <I name="file" size={14} color="var(--primary)" />
    </div>
    <div className={styles.docInfo}>
      <span className={styles.docName}>{name}</span>
      <span className={styles.docMeta}>PDF{pages ? ` · ${pages}p` : ""} · Reviewed {reviewed}</span>
    </div>
    <div className={styles.docActions}>
      <button className={styles.docBtn} title="Preview"><I name="eye" size={13} color="var(--primary)" /></button>
      <button className={styles.docBtn} title="Download"><I name="download" size={13} color="var(--primary)" /></button>
    </div>
  </div>
);

/* ── Emergency reference modal ─────────────────────────────────────────────── */

const EmergencyModal = ({ type, laWeight, onWeightChange, onClose }) => {
  const titles = { drugs: "Emergency Drugs — Doses & Routes", la: "Local Anaesthetic Maximum Doses", antibiotics: "Antibiotic Prescribing Guide" };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.emergencyModal} onClick={e => e.stopPropagation()}>
        <div className={styles.emergencyModalHeader}>
          <div>
            <span className={styles.emergencyModalEyebrow}>Quick Reference</span>
            <h3 className={styles.emergencyModalTitle}>{titles[type]}</h3>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}><I name="xcircle" size={22} /></button>
        </div>

        {type === "drugs" && (
          <div className={styles.emergencyTableWrap}>
            <div className={styles.emergencyTableHead}>
              <span style={{ flex: 2 }}>Drug</span>
              <span style={{ flex: 1.5 }}>Indication</span>
              <span style={{ flex: 1 }}>Dose</span>
              <span style={{ flex: 1 }}>Route</span>
              <span style={{ flex: 2 }}>Notes</span>
            </div>
            {emergencyDrugs.map(d => (
              <div key={d.name} className={styles.emergencyTableRow}>
                <span style={{ flex: 2 }} className={styles.emergencyDrugName}>{d.name}</span>
                <span style={{ flex: 1.5 }} className={styles.emergencyIndication}>{d.indication}</span>
                <span style={{ flex: 1 }} className={styles.emergencyDose}>{d.dose}</span>
                <span style={{ flex: 1 }} className={styles.emergencyRoute}>{d.route}</span>
                <span style={{ flex: 2 }} className={styles.emergencyNotes}>{d.notes}</span>
              </div>
            ))}
          </div>
        )}

        {type === "la" && (
          <div className={styles.laWrap}>
            <div className={styles.laCalcRow}>
              <label className={styles.laCalcLabel}>Patient weight</label>
              <input
                type="number" min={10} max={200} step={1}
                className={styles.laWeightInput}
                value={laWeight}
                onChange={e => onWeightChange(Number(e.target.value))}
              />
              <span className={styles.laCalcUnit}>kg</span>
              <p className={styles.laCalcNote}>Adjust weight to calculate maximum safe cartridges for this patient.</p>
            </div>
            <div className={styles.emergencyTableWrap}>
              <div className={styles.emergencyTableHead}>
                <span style={{ flex: 3 }}>Agent (1.8 mL cartridge)</span>
                <span style={{ flex: 1, textAlign: "center" }}>mg/cartridge</span>
                <span style={{ flex: 1, textAlign: "center" }}>Max mg/kg</span>
                <span style={{ flex: 1, textAlign: "center" }}>Max dose (abs.)</span>
                <span style={{ flex: 1, textAlign: "center" }}>Max cartridges</span>
              </div>
              {laDrugs.map(d => {
                const maxMg    = Math.min(d.maxMgKg * laWeight, d.maxAbs);
                const maxCarts = (maxMg / d.mgPerCart).toFixed(1);
                return (
                  <div key={d.agent} className={styles.emergencyTableRow}>
                    <span style={{ flex: 3 }} className={styles.emergencyDrugName}>{d.agent}</span>
                    <span style={{ flex: 1, textAlign: "center" }}>{d.mgPerCart} mg</span>
                    <span style={{ flex: 1, textAlign: "center" }}>{d.maxMgKg} mg/kg</span>
                    <span style={{ flex: 1, textAlign: "center" }}>{d.maxAbs} mg</span>
                    <span style={{ flex: 1, textAlign: "center" }} className={styles.laMaxCarts}>{maxCarts}</span>
                  </div>
                );
              })}
            </div>
            <p className={styles.laDisclaimer}><I name="alert" size={12} /> Always apply clinical judgement. Doses are maximum limits — use the minimum effective dose.</p>
          </div>
        )}

        {type === "antibiotics" && (
          <div className={styles.emergencyTableWrap}>
            <div className={styles.emergencyTableHead}>
              <span style={{ flex: 2 }}>Indication</span>
              <span style={{ flex: 2 }}>First Choice</span>
              <span style={{ flex: 2 }}>Alternative / Allergy</span>
              <span style={{ flex: 2 }}>Notes</span>
            </div>
            {antibiotics.map(a => (
              <div key={a.indication} className={styles.emergencyTableRow}>
                <span style={{ flex: 2 }} className={styles.emergencyDrugName}>{a.indication}</span>
                <span style={{ flex: 2 }} className={styles.emergencyDose}>{a.first}</span>
                <span style={{ flex: 2 }}>{a.alt}</span>
                <span style={{ flex: 2 }} className={styles.emergencyNotes}>{a.notes}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────────────────────────── */

export const ClinicalPage = () => {
  const [activeTab,         setActiveTab]         = useState("protocols");
  const [activeProtoCat,    setActiveProtoCat]    = useState("emergency");
  const [activeGuideline,   setActiveGuideline]   = useState(null);
  const [activeReferral,    setActiveReferral]    = useState(null);
  const [activeConsentCat,  setActiveConsentCat]  = useState(null);
  const [emergencyModal,    setEmergencyModal]    = useState(null);
  const [laWeight,          setLaWeight]          = useState(70);
  const [searchQuery,       setSearchQuery]       = useState("");
  const activeProto = protocolCategories.find(c => c.id === activeProtoCat);

  /* ── Search index ── */
  const searchIndex = [
    ...protocolCategories.flatMap(cat => cat.items.map(p => ({
      section: "Protocols", label: cat.label, name: p.name, desc: p.desc,
      action: () => { setActiveTab("protocols"); setActiveProtoCat(cat.id); setSearchQuery(""); },
    }))),
    ...pils.map(p => ({
      section: "Patient Leaflets", label: p.category, name: p.name, desc: "",
      action: () => { setActiveTab("consent"); setSearchQuery(""); },
    })),
    ...consentCategories.flatMap(cat => cat.forms.map(f => ({
      section: "Consent Forms", label: cat.label, name: f.name, desc: f.desc,
      action: () => { setActiveTab("consentforms"); setActiveConsentCat(cat.label); setSearchQuery(""); },
    }))),
    ...guidelineSources.flatMap(g => g.items.map(item => ({
      section: "Guidelines", label: g.org, name: item.name, desc: item.summary,
      action: () => { setActiveTab("guidelines"); setSearchQuery(""); },
    }))),
    ...referralPathways.flatMap(r => r.docs.map(d => ({
      section: "Referrals", label: r.label, name: d.name, desc: `${d.type} · Updated ${d.updated}`,
      action: () => { setActiveTab("referrals"); setActiveReferral(r.label); setSearchQuery(""); },
    }))),
    ...safeguardingDocs.map(d => ({
      section: "Safeguarding", label: "Policy Document", name: d.name, desc: `Reviewed ${d.reviewed}`,
      action: () => { setActiveTab("safeguarding"); setSearchQuery(""); },
    })),
  ];

  const q = searchQuery.trim().toLowerCase();
  const searchResults = q.length >= 2
    ? searchIndex.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q)
      )
    : [];

  return (
    <div>
      <SearchBar
        placeholder="Search protocols, consent forms, guidelines, referral forms..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <TopBar
        title="Clinical Resources Hub"
        subtitle="Protocols, consent forms, clinical guidelines, and referral pathways — everything outside your practice software."
      />

      {/* ── Emergency Reference banner ── */}
      <div className={styles.emergencyBanner}>
        <div className={styles.emergencyBannerLeft}>
          <div className={styles.emergencyBannerIcon}><I name="heart" size={20} color="#fff" /></div>
          <div>
            <div className={styles.emergencyBannerTitle}>Emergency & Prescribing Reference</div>
            <div className={styles.emergencyBannerSub}>Quick-access drug doses, LA calculator, and antibiotic guidance</div>
          </div>
        </div>
        <div className={styles.emergencyBannerActions}>
          <button className={styles.emergencyBannerBtn} onClick={() => setEmergencyModal("drugs")}>
            <I name="heart" size={13} /> Emergency Drugs
          </button>
          <button className={styles.emergencyBannerBtn} onClick={() => setEmergencyModal("la")}>
            <I name="zap" size={13} /> LA Dose Calculator
          </button>
          <button className={styles.emergencyBannerBtn} onClick={() => setEmergencyModal("antibiotics")}>
            <I name="shield" size={13} /> Antibiotic Guide
          </button>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className={styles.tabNav}>
        {TABS.map(t => (
          <button key={t.id}
            className={activeTab === t.id ? `${styles.tabBtn} ${styles.tabBtnActive}` : styles.tabBtn}
            onClick={() => setActiveTab(t.id)}>
            <I name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════ SEARCH RESULTS ══════════════ */}
      {q.length >= 2 && (
        <div className={styles.tabContent}>
          {searchResults.length === 0 ? (
            <div className={styles.searchEmpty}>
              <I name="search" size={28} color="var(--on-surface-variant)" />
              <p>No results for <strong>"{searchQuery}"</strong></p>
            </div>
          ) : (
            <>
              <p className={styles.searchCount}>{searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for <strong>"{searchQuery}"</strong></p>
              <div className={styles.searchResultList}>
                {searchResults.map((item, i) => (
                  <button key={i} className={styles.searchResultRow} onClick={item.action}>
                    <div className={styles.searchResultLeft}>
                      <div className={styles.searchResultMeta}>
                        <span className={styles.searchResultSection}>{item.section}</span>
                        <span className={styles.searchResultLabel}>{item.label}</span>
                      </div>
                      <span className={styles.searchResultName}>{item.name}</span>
                      {item.desc && <span className={styles.searchResultDesc}>{item.desc}</span>}
                    </div>
                    <I name="arrow" size={14} color="var(--primary)" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════ PROTOCOLS tab ══════════════ */}
      {!q && activeTab === "protocols" && (
        <div className={styles.tabContent}>
          <div className={styles.protoCatRow}>
            {protocolCategories.map(c => (
              <button key={c.id}
                className={activeProtoCat === c.id ? `${styles.protoCatBtn} ${styles.protoCatBtnActive}` : styles.protoCatBtn}
                onClick={() => setActiveProtoCat(c.id)}>
                <I name={c.icon} size={14} />
                {c.label}
              </button>
            ))}
          </div>

          {activeProto && (
            <Card hover={false} className={styles.protoCard}>
              <div className={styles.protoCardHeader}>
                <div className={styles.protoCardTitleWrap}>
                  <div className={styles.protoCardIcon}><I name={activeProto.icon} size={18} color="var(--primary)" /></div>
                  <div>
                    <h3 className={styles.protoCardTitle}>{activeProto.label}</h3>
                    <p className={styles.protoCardCount}>{activeProto.items.length} protocols</p>
                  </div>
                </div>
                <BtnSecondary style={{ fontSize: 12, padding: "7px 14px" }}>
                  <I name="download" size={13} /> Download All
                </BtnSecondary>
              </div>
              <div className={styles.protoList}>
                {activeProto.items.map(p => (
                  <div key={p.name} className={styles.protoRow}>
                    <div className={styles.protoRowMain}>
                      <span className={styles.protoName}>{p.name}</span>
                      <span className={styles.protoDesc}>{p.desc}</span>
                    </div>
                    <div className={styles.protoRowRight}>
                      <span className={styles.protoReviewed}>Reviewed {p.reviewed}</span>
                      <button className={styles.docBtn} title="View"><I name="eye" size={14} color="var(--primary)" /></button>
                      <button className={styles.docBtn} title="Download"><I name="download" size={14} color="var(--primary)" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ══════════════ PATIENT INFORMATION LEAFLETS tab ══════════════ */}
      {!q && activeTab === "consent" && (
        <div className={styles.tabContent}>
          <p className={styles.guidelineIntro}>
            <I name="info" size={14} /> Consent forms are managed electronically within your practice management software. The leaflets below are for printing or emailing to patients before or after treatment.
          </p>
          <Card hover={false} className={styles.pilCard} style={{ maxWidth: 780 }}>
            <div className={styles.pilHeader}>
              <h3 className={styles.pilTitle}>Patient Information Leaflets</h3>
              <span className={styles.pilCount}>{pils.length} leaflets</span>
            </div>
            <div className={styles.pilList}>
              {pils.map(p => (
                <div key={p.name} className={styles.pilRow}>
                  <div className={styles.pilRowLeft}>
                    <span className={styles.pilName}>{p.name}</span>
                    <span className={styles.pilCategory}>{p.category}</span>
                  </div>
                  <div className={styles.docActions}>
                    <button className={styles.docBtn} title="Download"><I name="download" size={13} color="var(--primary)" /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════ CONSENT FORMS tab ══════════════ */}
      {!q && activeTab === "consentforms" && (
        <div className={styles.tabContent}>
          <p className={styles.guidelineIntro}>
            <I name="info" size={14} /> These are backup paper consent forms for use when electronic consent via your practice management software is unavailable. Templates are sourced from UK professional bodies — click the source badge to access the originals.
          </p>
          <div className={styles.referralGrid}>
            {consentCategories.map(cat => {
              const isOpen = activeConsentCat === cat.label;
              return (
                <div key={cat.id} className={styles.referralItem}>
                  <button
                    className={isOpen ? `${styles.referralToggle} ${styles.referralToggleOpen}` : styles.referralToggle}
                    onClick={() => setActiveConsentCat(isOpen ? null : cat.label)}
                  >
                    <div className={styles.referralToggleLeft}>
                      <div className={styles.referralToggleIcon}>
                        <I name={cat.icon} size={16} color={isOpen ? "#fff" : "var(--primary)"} />
                      </div>
                      <span>{cat.label}</span>
                      <span className={styles.consentFormCount}>{cat.forms.length}</span>
                    </div>
                    <I name="chevrondown" size={16} color={isOpen ? "#fff" : "var(--on-surface-variant)"}
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {isOpen && (
                    <div className={styles.referralPanel}>
                      {cat.forms.map(f => (
                        <div key={f.name} className={styles.referralDocRow}>
                          <div className={styles.docIconWrap}>
                            <I name="file" size={13} color="var(--primary)" />
                          </div>
                          <div className={styles.docInfo}>
                            <span className={styles.docName}>{f.name}</span>
                            <span className={styles.docMeta}>{f.desc}</span>
                          </div>
                          <div className={styles.docActions}>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.consentSourceBadge}
                              style={{ background: SOURCE_CFG[f.source].bg, color: SOURCE_CFG[f.source].color }}
                              title={`Download template from ${f.source}`}
                            >
                              {f.source}
                            </a>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.docBtn}
                              title="Download template"
                            >
                              <I name="download" size={12} color="var(--primary)" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════ GUIDELINES tab ══════════════ */}
      {!q && activeTab === "guidelines" && (
        <div className={styles.tabContent}>
          <p className={styles.guidelineIntro}>
            <I name="info" size={14} /> External guidelines are maintained by their issuing bodies — links open to the latest published version. Last verified February 2024.
          </p>
          <div className={styles.guidelineGrid}>
            {guidelineSources.map(g => (
              <Card key={g.org} hover={false} className={styles.guidelineCard}>
                <div className={styles.guidelineCardHeader}>
                  <span className={styles.guidelineOrg} style={{ background: g.color }}>{g.org}</span>
                  <span className={styles.guidelineItemCount}>{g.items.length} guidelines</span>
                </div>
                {g.items.map(item => (
                  <div key={item.name} className={styles.guidelineRow}>
                    <div className={styles.guidelineRowMain}>
                      <span className={styles.guidelineName}>{item.name}</span>
                      <span className={styles.guidelineSummary}>{item.summary}</span>
                    </div>
                    <div className={styles.guidelineRowRight}>
                      <span className={styles.guidelineYear}>{item.year}</span>
                      <button className={styles.docBtn} title="Open" onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}><I name="external" size={13} color="var(--primary)" /></button>
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════ REFERRALS tab ══════════════ */}
      {!q && activeTab === "referrals" && (
        <div className={styles.tabContent}>
          <div className={styles.referralGrid}>
            {referralPathways.map(r => {
              const isOpen = activeReferral === r.label;
              return (
                <div key={r.label} className={styles.referralItem}>
                  <button
                    className={isOpen
                      ? `${styles.referralToggle} ${styles.referralToggleOpen} ${r.urgent ? styles.referralToggleUrgent : ""}`
                      : `${styles.referralToggle} ${r.urgent ? styles.referralToggleUrgent : ""}`}
                    onClick={() => setActiveReferral(isOpen ? null : r.label)}>
                    <div className={styles.referralToggleLeft}>
                      <div className={styles.referralToggleIcon}><I name={r.icon} size={16} color={r.urgent ? "#fff" : "var(--primary)"} /></div>
                      <span>{r.label}</span>
                      {r.urgent && <span className={styles.urgentPill}>Urgent</span>}
                    </div>
                    <I name="chevrondown" size={16} color={isOpen || r.urgent ? "#fff" : "var(--on-surface-variant)"}
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {isOpen && (
                    <div className={styles.referralPanel}>
                      {r.docs.map(d => (
                        <div key={d.name} className={styles.referralDocRow}>
                          <div className={styles.docIconWrap}><I name="file" size={13} color="var(--primary)" /></div>
                          <div className={styles.docInfo}>
                            <span className={styles.docName}>{d.name}</span>
                            <span className={styles.docMeta}>{d.type} · Updated {d.updated}</span>
                          </div>
                          <div className={styles.docActions}>
                            <button className={styles.docBtn} title="Preview"><I name="eye" size={12} color="var(--primary)" /></button>
                            <button className={styles.docBtn} title="Download"><I name="download" size={12} color="var(--primary)" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════ SAFEGUARDING tab ══════════════ */}
      {!q && activeTab === "safeguarding" && (
        <div className={styles.tabContent}>
          <div className={styles.safeguardingLayout}>
            <div>
              <Card hover={false} className={styles.sgContactsCard}>
                <h3 className={styles.sgCardTitle}><I name="phone" size={16} color="var(--error)" /> Emergency Contacts</h3>
                <p className={styles.sgCardSub}>If you have an immediate concern about a child or adult, contact the relevant authority without delay.</p>
                {safeguardingContacts.map(c => (
                  <div key={c.role} className={styles.sgContactRow}>
                    <div className={styles.sgContactInfo}>
                      <span className={styles.sgContactRole}>{c.role}</span>
                      <span className={styles.sgContactName}>{c.name}</span>
                    </div>
                    <a className={styles.sgContactPhone} href={`tel:${c.phone.replace(/\s/g,'')}`}>
                      <I name="phone" size={13} /> {c.phone}
                    </a>
                  </div>
                ))}
              </Card>

              <Card hover={false} className={styles.sgAlertCard}>
                <div className={styles.sgAlertIcon}><I name="alert" size={20} color="var(--error)" /></div>
                <div>
                  <div className={styles.sgAlertTitle}>Mandatory Reporting — FGM</div>
                  <div className={styles.sgAlertBody}>Dental professionals in England have a legal duty to report known cases of FGM in girls under 18 to the police. This is a mandatory, non-discretionary duty.</div>
                </div>
              </Card>
            </div>

            <div>
              <Card hover={false} className={styles.sgDocsCard}>
                <h3 className={styles.sgCardTitle}><I name="file" size={16} color="var(--primary)" /> Policies & Guidance</h3>
                <div className={styles.sgDocList}>
                  {safeguardingDocs.map(d => (
                    <DocRow key={d.name} name={d.name} reviewed={d.reviewed} />
                  ))}
                </div>
              </Card>

              <Card hover={false} className={styles.sgPathwayCard}>
                <h3 className={styles.sgCardTitle} style={{ marginBottom: 16 }}><I name="arrow" size={16} color="var(--primary)" /> Reporting Pathway</h3>
                {[
                  { step: "1", label: "Identify concern",    desc: "Document observations factually in the patient record." },
                  { step: "2", label: "Discuss with lead",   desc: "Contact the Practice Safeguarding Lead: Mark Thompson." },
                  { step: "3", label: "Refer if necessary",  desc: "Refer to MASH or adult social care. Do not delay if at risk." },
                  { step: "4", label: "Record & follow up",  desc: "Document all actions, decisions, and outcomes in writing." },
                ].map(s => (
                  <div key={s.step} className={styles.sgStep}>
                    <div className={styles.sgStepNum}>{s.step}</div>
                    <div>
                      <div className={styles.sgStepLabel}>{s.label}</div>
                      <div className={styles.sgStepDesc}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}

      {emergencyModal && (
        <EmergencyModal
          type={emergencyModal}
          laWeight={laWeight}
          onWeightChange={setLaWeight}
          onClose={() => setEmergencyModal(null)}
        />
      )}
    </div>
  );
};
