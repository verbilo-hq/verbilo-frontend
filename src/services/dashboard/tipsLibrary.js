/**
 * Tip of the Day library — 9 personas × 25 tips each = 225 tips total.
 *
 * Each persona pool gets a deterministic day-of-year rotation, so every
 * user in the same role sees the same tip on the same day (consistent
 * for team discussions). The carousel's prev/next pagination passes an
 * `offset` to scrub forward/backward through the rotation without
 * leaving the day's "real" tip behind.
 *
 * 25 tips × 1 per day = nearly a full month before any single user sees
 * a repeat. Content is content from professional bodies (GDC, FGDP,
 * SDCEP, NICE, NEBDN, etc.) — advisory micro-education, not platform
 * widgets, so PMS-adjacent references are fine here.
 *
 * Tip shape: { id, category, tip }
 *   id        — stable across versions for bookmarking
 *   category  — guidance source / topic header
 *   tip       — the full advisory sentence(s)
 */

export const TIPS_LIBRARY = {
  /* ─── 1. Dentists (qualified) ───────────────────────────────────── */
  dentist: [
    { id: "d1",  category: "GDC Standard 1.1",          tip: "Always put patients' interests first by ensuring informed consent is refreshed at every single treatment stage, not just at the initial assessment appointment." },
    { id: "d2",  category: "IR(ME)R 2017 Compliance",   tip: "When logging a radiograph justification, clearly document the specific clinical indicators in the patient notes before taking the exposure." },
    { id: "d3",  category: "Clinical Record Keeping",   tip: "Ensure your clinical notes pass an FGDP audit baseline by using a consistent template that records negative findings, such as the absence of oral lesions." },
    { id: "d4",  category: "Antibiotic Stewardship",    tip: "Refer to the latest SDCEP guidelines before prescribing antibiotics; always check if local operative measures can resolve the acute dental condition first." },
    { id: "d5",  category: "Duty of Candour (Reg 20)",  tip: "If a clinical error occurs that causes harm, explain things to the patient fully and promptly, offer an apology, and document the conversation meticulously." },
    { id: "d6",  category: "BPE Scoring Requirements",  tip: "Ensure full pocketing screens are conducted for all new adult patients and updated at routine check-ups to meet standard periodontal tracking guidelines." },
    { id: "d7",  category: "Referral Pathway Clarity",  tip: "When submitting an endodontic or orthodontic referral, explicitly list the complexity scoring to prevent unnecessary assessment delays for the patient." },
    { id: "d8",  category: "Rubber Dam Usage",          tip: "Standard protocol dictates using a rubber dam for all endodontic treatments; if it cannot be placed due to anatomy, explicitly log the alternative moisture control used." },
    { id: "d9",  category: "Medical History Verification", tip: "Never rely on a historical medical form; verbally verify systemic health and medication changes with the patient at every single course of treatment." },
    { id: "d10", category: "CPD Reflection Loops",      tip: "When logging verifiable CPD hours, ensure you write a brief reflective statement explaining how this learning impacts your daily clinical delivery." },
    { id: "d11", category: "Local Anaesthetic Logging", tip: "Always record the brand, expiration date, batch number, and volume of local anaesthetic administered in the patient's chart for complete accountability." },
    { id: "d12", category: "Sharps Safety Compliance",  tip: "To comply with the Health and Safety (Sharp Instruments in Healthcare) Regulations, never re-sheath needles manually; utilise a compliant single-handed locking device." },
    { id: "d13", category: "Chaperone Documentation",   tip: "When conducting intimate clinical examinations or treating vulnerable patients, always note the presence and full name of your clinical chaperone." },
    { id: "d14", category: "Laboratory Work Traceability", tip: "Ensure all laboratory prescriptions are fully completed, signed, and that the lab's conformity statement is scanned directly into the patient record." },
    { id: "d15", category: "Infection Control Reminders", tip: "Always remove your clinical gloves and perform hand hygiene before handling computer mice, keyboards, or writing prescriptions at your surgery desk." },
    { id: "d16", category: "Composite Layering & Curing", tip: "Maintain optimal depth control when building composite restorations; curing in increments larger than 2mm can lead to incomplete polymerisation and post-op sensitivity." },
    { id: "d17", category: "Implants & Surgical Safety", tip: "Ensure a comprehensive surgical safety checklist is completed with your assistant prior to initiating any invasive implant or bone-grafting procedure." },
    { id: "d18", category: "Mental Capacity Act (MCA)", tip: "If you suspect a patient lacks the capacity to consent to a procedure, conduct a formal two-stage capacity assessment and document the best-interest decisions." },
    { id: "d19", category: "Equipment Fault Reporting", tip: "If a dental chair or delivery unit component behaves erratically, immediately stop treatment, tag the machine out of service, and inform the PM." },
    { id: "d20", category: "Patient Communication",     tip: "Avoid technical jargon when explaining complex crown or bridge treatment plans; use clear analogies and provide a written estimate before starting care." },
    { id: "d21", category: "Record Modification Integrity", tip: "If you must correct a clinical note entry after the day of treatment, never delete the original text; add a dated, signed addendum explaining the retrospective change." },
    { id: "d22", category: "Implant Assessment Metrics", tip: "When planning implant placement, explicitly record bone density estimates, localised anatomical risks, and the proximity to the inferior alveolar nerve in your written consent protocol." },
    { id: "d23", category: "Prescription Legibility",   tip: "When issuing manual private prescriptions, always write the patient's weight if they are a minor, state the drug strength clearly, and avoid using abbreviations like 'u' for units." },
    { id: "d24", category: "Conscious Sedation Monitoring", tip: "For intravenous sedation cases, ensure the patient's arterial oxygen saturation (SpO₂) and pulse rate are monitored continuously and recorded at minimum 5-minute intervals." },
    { id: "d25", category: "Periodontal Maintenance",   tip: "For BPE scores of 3 or 4, ensure the patient is explicitly advised of the link between active smoking, glycaemic volatility, and rapid attachment loss before concluding the treatment plan." },
  ],

  /* ─── 2. Hygienists & Therapists ────────────────────────────────── */
  hygienist: [
    { id: "h1",  category: "Scope of Practice",         tip: "Ensure you are working strictly within your GDC-defined scope of practice and that any direct-access care protocols are signed off by the group." },
    { id: "h2",  category: "Periodontal Charting",      tip: "Complete a full 6-point pocket chart for any patient showing widespread BPE scores of 3 or 4 to ensure precise baseline tracking." },
    { id: "h3",  category: "Aerosol Generating Procedures", tip: "When using ultrasonic scalers, ensure appropriate high-volume aspiration is deployed at all times to minimise the spread of airborne bio-burden." },
    { id: "h4",  category: "Implants & Scaling",        tip: "Never use standard stainless-steel scalers around titanium implant abutments; select plastic, carbon-reinforced, or specialised titanium tips to avoid surface scratching." },
    { id: "h5",  category: "Safeguarding Vigilance",    tip: "As a clinician spending considerable time with regular patients, note and report any unusual patterns of dental neglect or unexplained intra-oral bruising." },
    { id: "h6",  category: "Oral Health Education",     tip: "Frame preventative advice positively by focusing on what the patient can gain, and ensure you log their exact current brushing routine in the notes." },
    { id: "h7",  category: "Fissure Sealant Isolation", tip: "The success of a preventative fissure sealant depends entirely on moisture control; always maximise isolation with cotton rolls or dry guards." },
    { id: "h8",  category: "Fluoride Varnish Safety",   tip: "Before applying high-concentration fluoride varnish to a minor, verify they have no history of asthma hospitalisations or severe product allergies." },
    { id: "h9",  category: "Ergonomic Posture",         tip: "Protect your musculoskeletal health by adjusting the operator stool height so your hips are slightly higher than your knees during long scaling sessions." },
    { id: "h10", category: "Dietary Counselling",       tip: "When delivering sugar reduction advice to high-caries risk patients, log a 3-day food diary evaluation in the records to show active compliance." },
    { id: "h11", category: "Hand Scaling Sharpness",    tip: "Dull instruments burn calculus rather than removing it cleanly; schedule a brief five-minute block every morning to check and sharpen your curettes." },
    { id: "h12", category: "Medical Alert Scanning",    tip: "Scan the medical alerts dashboard before calling a patient through; patients taking bisphosphonates require specific management pathways for periodontal care." },
    { id: "h13", category: "Recall Interval Alignment", tip: "Align patient recall intervals directly with their individual risk profile using NICE guidelines, rather than defaulting every patient to a standard 6-month cycle." },
    { id: "h14", category: "Smoking Cessation",         tip: "Deliver brief, impactful smoking cessation advice to all tobacco users and provide a clear pathway or leaflet to local NHS stopping services." },
    { id: "h15", category: "Perio-Systemic Link",       tip: "Educate diabetic patients on the bidirectional relationship between blood glucose control and periodontal health to add holistic clinical value." },
    { id: "h16", category: "Aspiration Management",     tip: "Instruct your dental nurse on precise aspiration positioning during air-polishing procedures to maximise patient comfort and prevent soft tissue abrasion." },
    { id: "h17", category: "Patient Motivation",        tip: "Use plaque scoring metrics visually with the patient using a mirror; tracking an objective number gives them a goal to beat next time." },
    { id: "h18", category: "Dentin Hypersensitivity",   tip: "When addressing root sensitivity, differentiate between structural recession and active acid erosion before recommending desensitising treatments or varnishes." },
    { id: "h19", category: "Sterilisation Tracking",    tip: "Double-check that the sterilisation tracking barcodes from your instrument cassettes are scanned into your clinical session entry before starting treatment." },
    { id: "h20", category: "Handoff Communication",     tip: "When a patient is referred to you by a dentist, verify the diagnostic prescription is clearly visible in the system before applying treatment." },
    { id: "h21", category: "Direct Access Boundaries",  tip: "When treating a patient via direct access, ensure the patient signs a specific boundary acknowledgment form stating they understand you are not screening for comprehensive dental decay." },
    { id: "h22", category: "Therapist Prescriptions",   tip: "When completing a restoration prescribed by a dentist, verify that the cavity depth indication and material choice parameters are fully detailed in the written referral note." },
    { id: "h23", category: "Ultrasonic Tip Wear",       tip: "Ensure your ultrasonic scaling tips are checked against a wear guide monthly; a tip that has lost 2mm of length loses 50% of its clinical efficiency and burns calculus." },
    { id: "h24", category: "LA Delivery Limits",        tip: "Always calculate the maximum safe local anaesthetic dosage based on patient weight before administering infiltrations or blocks, particularly for paediatric therapy cases." },
    { id: "h25", category: "Perio-Cardiovascular",      tip: "Educate high-risk periodontal patients on how chronic oral inflammation contributes to systemic vascular risks, logging this preventative communication in their records." },
  ],

  /* ─── 3. Dental Nurses (qualified DCP) ──────────────────────────── */
  nurse: [
    { id: "n1",  category: "HTM 01-05 Compliance",      tip: "Ensure the data logging cycle parameters for the autoclave are verified and physically signed off at the start and end of every decontamination session." },
    { id: "n2",  category: "Waterline Management",      tip: "Purge dental unit waterlines for at least two minutes at the start of the day and for 30 seconds between every single patient appointment." },
    { id: "n3",  category: "Decon Room Zoning",         tip: "Maintain a strict physical boundary between dirty, inspection, and clean zones in the decontamination room to prevent accidental cross-contamination." },
    { id: "n4",  category: "Protein Residue Testing",   tip: "Complete and log your weekly protein residue tests on instruments to verify that your manual cleaning or ultrasonic stages are functioning correctly." },
    { id: "n5",  category: "Pouch Validation Rules",    tip: "When sealing sterilised instruments in pouches, ensure the expiration date stamp does not obscure the chemical indicator block on the packaging." },
    { id: "n6",  category: "Materials Preparation",     tip: "Anticipate the clinician's workflow by preparing restorative materials right before insertion; leaving composites or bonding agents open to daylight can cause premature setting." },
    { id: "n7",  category: "Suction Filter Cleaning",   tip: "Clean and flush the main chairside suction lines and filter baskets at the end of every day using an approved non-foaming enzymatic solution." },
    { id: "n8",  category: "PPE Enforcement",           tip: "Ensure your clinical mask is changed every two hours or as soon as it becomes damp to preserve an effective particulate filtration barrier." },
    { id: "n9",  category: "Matrix Band Checks",        tip: "Inspect matrix bands and strips for kinks or defects before handing them to the dentist; a damaged band compromises the proximal restoration contact point." },
    { id: "n10", category: "Aspiration Control",        tip: "Position the high-volume aspirator tip just behind the tooth being prepped to catch water spray efficiently without blocking the dentist's mirror view." },
    { id: "n11", category: "Waste Segregation",         tip: "Place heavily blood-soaked gauze and extracted teeth into the yellow clinical waste container, while standard cotton rolls go into the orange alternative tray." },
    { id: "n12", category: "Emergency Drug Kit",        tip: "Verify weekly that all components of the emergency oxygen cylinder are present, pressurised, and that no emergency drugs have expired." },
    { id: "n13", category: "Ultrasonic Bath Management", tip: "Change the fluid in your ultrasonic cleaner at least twice a day, or sooner if it appears visibly soiled, to prevent debris accumulation." },
    { id: "n14", category: "Implant Kit Traceability",  tip: "Ensure tracking stickers from sterile implant components are handed over to the nurse logging the clinical notes immediately for entry." },
    { id: "n15", category: "Surface Disinfection",      tip: "When wiping down surgery surfaces between patients, apply a two-wipe technique: one wipe to physically clean, and a second to actively disinfect." },
    { id: "n16", category: "Amalgam Separator",         tip: "Check the level indicator on your amalgam separator unit weekly to ensure it does not overflow and breach environmental waste codes." },
    { id: "n17", category: "Handpiece Maintenance",     tip: "Always lubricate high and low-speed handpieces after cleaning but before autoclaving; sterilising an unlubricated handpiece causes rapid internal bearing failure." },
    { id: "n18", category: "Stock Rotation",            tip: "Practice a strict 'First-In, First-Out' inventory strategy when restocking materials to prevent expensive bonding systems or cements from expiring in the back." },
    { id: "n19", category: "Cold Disinfection Warning", tip: "Never use cold chemical soak solutions for sterilising critical surgical items; if an instrument can withstand heat, it must pass through an autoclave." },
    { id: "n20", category: "Patient Handover Care",     tip: "When escorting a patient from the surgery back to reception, pass clear verbal instructions to the front desk regarding their next required appointment length." },
    { id: "n21", category: "Autoclave Helix Test",      tip: "Run a Helix process challenge test at the start of every B-type vacuum autoclave cycle day to verify effective steam penetration throughout hollow instrument lumens." },
    { id: "n22", category: "Instrument Transport",      tip: "Always utilise colour-coded, puncture-proof, locked containers when moving contaminated instruments from the surgery to the central decontamination room to prevent sharps exposure." },
    { id: "n23", category: "Pressure Vessel Scans",     tip: "Before activating sterilisation machinery, physically inspect the silicone door gaskets for cracks, mineral buildup, or alignment defects that could compromise the pressure seal." },
    { id: "n24", category: "Mercury Spill Kit",         tip: "Ensure you know the exact location of the practice mercury spill kit; never use a standard vacuum cleaner or high-volume suction to clear broken silver amalgam capsules." },
    { id: "n25", category: "Drug Expiry Sweeps",        tip: "Conduct your monthly emergency drug kit sweeps on the final working day of each month, logging batch codes and highlighting items expiring within the next 90 days." },
  ],

  /* ─── 4. Practice Managers ──────────────────────────────────────── */
  practice_manager: [
    { id: "pm1",  category: "CQC Provider Compliance", tip: "Ensure your local staff training log matrix is 100% updated before the first of the month; missing training records are a major red flag during inspections." },
    { id: "pm2",  category: "UDA Target Tracking",     tip: "Review the practice's aggregate UDA performance data weekly to identify if clinicians are dropping below their expected target pace early in the contract cycle." },
    { id: "pm3",  category: "Staff Immunisation",      tip: "Keep a secure, up-to-date folder containing Hep B immunisation and antibody titre results for all clinical personnel working on the premises." },
    { id: "pm4",  category: "Mock Inspection Drills",  tip: "Run an unannounced 15-minute mock inspection audit on a single surgery once a month to ensure decontamination protocols are being executed consistently." },
    { id: "pm5",  category: "Locum Verification",      tip: "Before a locum dentist or nurse treats their first patient, verify their active GDC registration, indemnity certificate, and current DBS disclosure clearance." },
    { id: "pm6",  category: "Patient Complaint Mgmt",  tip: "Acknowledge all written or verbal patient complaints within 3 working days, providing a copy of the practice's formal complaints handling policy." },
    { id: "pm7",  category: "Equipment Asset Mgmt",    tip: "Schedule pressure vessel inspections for your compressors and autoclaves at the statutory intervals to comply with safety regulations." },
    { id: "pm8",  category: "Anonymous Feedback",      tip: "Review the internal dashboard suggestion box every Friday afternoon to catch and resolve operational bottlenecks or staff morale issues early." },
    { id: "pm9",  category: "Radiation Protection",    tip: "Ensure the local Radiation Protection Advisor (RPA) documentation and local rules are physically signed by all members of staff handling X-ray machinery." },
    { id: "pm10", category: "Fire Safety Checks",      tip: "Test the practice fire alarm system weekly from different call points, and log the completion along with fire warden training dates." },
    { id: "pm11", category: "Incident Log Compliance", tip: "Ensure any workplace injuries or needle-stick accidents are documented in the accident book and assessed for RIDDOR reporting criteria within 24 hours." },
    { id: "pm12", category: "Stock Overhead Mgmt",     tip: "Monitor material spending against monthly practice revenue budgets; high clinical inventory overheads directly compress net practice profitability." },
    { id: "pm13", category: "COSHH Sheet Updates",     tip: "Keep your Control of Substances Hazardous to Health safety data folders updated with current sheets for all newer clinical materials or cleaning chemistry." },
    { id: "pm14", category: "Performance Reviews",     tip: "Conduct structured annual appraisals for support staff that focus on clear milestones, such as completing advanced dental nursing certifications." },
    { id: "pm15", category: "Facilities Risk",         tip: "Walk the patient journey path once a week to inspect for slips, trips, or structural issues, ensuring full compliance with disability access rules." },
    { id: "pm16", category: "Lab Invoice Recon",       tip: "Cross-check incoming laboratory statements against actual completed patient records before signing off monthly laboratory bills for payment." },
    { id: "pm17", category: "Team Meeting Structure",  tip: "Dedicate the first 15 minutes of your monthly staff meetings to a clinical compliance focus topic, ensuring minutes are taken and distributed to all roles." },
    { id: "pm18", category: "Data Protection (GDPR)",  tip: "Ensure all team members lock their computer workstations whenever they leave a clinical surgery or front desk reception area unattended." },
    { id: "pm19", category: "NHS Claims Submissions",  tip: "Remind clinicians to submit their completed courses of treatment within the standard 2-month window to prevent contract rejection penalties." },
    { id: "pm20", category: "Employer Liability",      tip: "Ensure all compulsory workplace insurance certificates and health and safety posters are physically displayed in the staff breakroom or common hallway." },
    { id: "pm21", category: "Legionella Water Temps",  tip: "Complete and log your monthly sentinel tap water temperature checks; hot water must reach at least 50°C within one minute, and cold water must stay below 20°C within two minutes." },
    { id: "pm22", category: "DBS Renewal Tracking",    tip: "Implement a proactive tracking trigger to refresh Enhanced DBS checks for all clinical and patient-facing team members every 3 years, keeping a clear log in the master staff file." },
    { id: "pm23", category: "NHS BSA Schedule",        tip: "Review your monthly NHS BSA contract activity schedules within 5 days of receipt to identify and rectify rejected claims before they permanently drop off your contract delivery total." },
    { id: "pm24", category: "Business Continuity",     tip: "Review the practice IT backup architecture quarterly; physically verify that the encrypted offsite or cloud server sync completed successfully without data corruption." },
    { id: "pm25", category: "CQC Regulation 18",       tip: "Audit your staff induction logs to prove that every new hire completed a structured, role-specific safety orientation before they were permitted to work unsupervised." },
  ],

  /* ─── 5. Area Managers ──────────────────────────────────────────── */
  area_manager: [
    { id: "am1",  category: "Multi-Site Standardisation", tip: "Ensure cross-site uniformity by auditing that all clinics are running identical, group-approved standard operating procedures (SOPs)." },
    { id: "am2",  category: "Group Procurement",       tip: "Review multi-site spending data to identify clinics that are purchasing outside of your group's preferred dental vendor contract." },
    { id: "am3",  category: "KPI Analysis",            tip: "Track multi-site compliance percentages on your centralised dashboard to quickly target support toward lagging practices before issues escalate." },
    { id: "am4",  category: "Retention Metrics",       tip: "High clinical staff turnover damages patient continuity; run bi-annual exit interview analysis to detect underlying cultural or financial pain points." },
    { id: "am5",  category: "Acquisition Integration", tip: "When onboarding a newly acquired clinic, freeze local protocols and push the core group templates across their system within the first 14 days." },
    { id: "am6",  category: "Staff Resource Mgmt",     tip: "Utilise a group-wide dashboard overview to efficiently deploy cross-trained nurses or cross-booking associate dentists to sites experiencing short-term gaps." },
    { id: "am7",  category: "Compliance Escalation",   tip: "Establish a clear escalation pathway for clinics that repeatedly fail internal compliance metrics, involving the Clinical Director early." },
    { id: "am8",  category: "Private Income Growth",   tip: "Monitor the ratio of private fee-per-hour revenue across your region to pinpoint practices that require localised marketing or treatment coordinator support." },
    { id: "am9",  category: "CQC Group Readiness",     tip: "Ensure all practice managers within your region maintain standard audit readiness states so that an unexpected inspection at one site doesn't disrupt others." },
    { id: "am10", category: "CapEx Planning",          tip: "Review equipment lifecycles across your clinics to prioritise compressor or chair replacements before emergency failures disrupt operations." },
    { id: "am11", category: "Patient NPS",             tip: "Compare patient satisfaction metrics across your site portfolio monthly to identify and replicate customer-service wins from your top practices." },
    { id: "am12", category: "Contract Performance",    tip: "Review group NHS contract tracking reports mid-month to prevent year-end under-delivery or over-delivery penalties across your practices." },
    { id: "am13", category: "Group CPD Planning",      tip: "Organise centralised training days for compliance core subjects to lower group training costs and ensure consistent education across sites." },
    { id: "am14", category: "Waste Mgmt Consolidation", tip: "Audit regional hazardous waste transfer notes to confirm all practices are utilising the group's authorised corporate waste vendor." },
    { id: "am15", category: "Manager Mentorship",      tip: "Pair newly appointed local practice managers with experienced managers in your region to accelerate operational competency and reduce onboarding friction." },
    { id: "am16", category: "Brand Uniformity",        tip: "Perform quarterly site visits focused on brand presentation, ensuring client-facing collateral, uniforms, and external signage match corporate standards." },
    { id: "am17", category: "Data Protection Audits",  tip: "Ensure practice managers are running quarterly access audits to revoke data permissions for team members who have left the company." },
    { id: "am18", category: "Referral Pattern Analysis", tip: "Track specialist referral patterns within your group to ensure complex cases are directed to internal specialists before referring outside." },
    { id: "am19", category: "Overtime Spending",       tip: "Review nurse overtime logs across clinics; high overtime frequently indicates unoptimised scheduling or underlying recruitment gaps." },
    { id: "am20", category: "Board Reporting",         tip: "Condense complex regional compliance data into simplified risk profiles, showing executive stakeholders exactly how safety targets are being met." },
    { id: "am21", category: "Materials Margin Audits", tip: "Audit the material expenditure ratio against gross clinical revenue across all region clinics monthly; variations over 10% typically point to stock hoarding or unapproved local ordering." },
    { id: "am22", category: "Group Policy Versions",   tip: "When group clinical governance updates an SOP, use the tracking hub to verify that every local practice manager has archived old versions and trained their team on the new mandate within 7 days." },
    { id: "am23", category: "Incident Trend Tracking", tip: "Analyse the region's centralised accident and needle-stick log matrix quarterly to identify structural equipment patterns or training deficiencies across specific branches." },
    { id: "am24", category: "UDA Forecast Interventions", tip: "If a practice's mid-year UDA trajectory shows a projected under-delivery of more than 5%, schedule an immediate operational review to re-allocate targets or adjust clinical capacity." },
    { id: "am25", category: "Asset Protection Audits", tip: "Perform unannounced checks on local pressure vessel and radiation equipment service certificates during regional site visits to protect the group against statutory safety breaches." },
  ],

  /* ─── 6. Clinical Directors ─────────────────────────────────────── */
  clinical_director: [
    { id: "cd1",  category: "Clinical Policy Governance", tip: "Author and update all master templates with the latest regulatory changes from organisations like the GDC, SDCEP, and FGDP." },
    { id: "cd2",  category: "Significant Event Audits", tip: "Lead the clinical investigation for any serious clinical event or near-miss within the group to ensure the team learns from the issue." },
    { id: "cd3",  category: "Materials Selection",     tip: "Evaluate and clear all clinical materials and devices before they are approved for use across the group's practice network." },
    { id: "cd4",  category: "Peer Review Management",  tip: "Establish a constructive, cross-practice peer review network where associates can securely review anonymised patient records to elevate quality." },
    { id: "cd5",  category: "Performance Support",     tip: "Provide empathetic, structured mentorship pathways for any clinical associate whose audit data flags potential variations in care quality." },
    { id: "cd6",  category: "New Treatment Safeguards", tip: "Before approving a practice to offer advanced treatments like sedation or implants, audit their facilities and qualifications against safety checklists." },
    { id: "cd7",  category: "Ethical Marketing Audits", tip: "Review clinical marketing materials to ensure all claims regarding treatment outcomes align directly with GDC advertising guidelines." },
    { id: "cd8",  category: "Radiographic Quality",    tip: "Monitor group-wide digital image quality score percentages to ensure all sites maintain high diagnostic standards with low remake rates." },
    { id: "cd9",  category: "Consent Frameworks",      tip: "Review and update standard patient consent templates to incorporate current legal standards following major case law changes." },
    { id: "cd10", category: "Research & Sector Evolution", tip: "Track emerging medical and dental research to update group clinical pathways ahead of national policy changes." },
    { id: "cd11", category: "Risk Mgmt Reports",       tip: "Present an annual Clinical Governance report to executive stakeholders detailing structural steps taken to minimise clinical risks." },
    { id: "cd12", category: "Antimicrobial Prescribing", tip: "Execute annual, group-wide audits on antibiotic prescriptions to ensure all clinicians align with national stewardship targets." },
    { id: "cd13", category: "Specialist Credentials",  tip: "Maintain strict oversight of the clinical credentials, portfolios, and cases of clinicians running advanced tier-2 or specialist procedures." },
    { id: "cd14", category: "Duty of Candour Oversight", tip: "Personally review any active Regulation 20 cases to ensure the group's written and verbal apologies meet legal and ethical benchmarks." },
    { id: "cd15", category: "Sedation Safety",         tip: "Ensure all practices offering conscious sedation fully comply with IACSD guidelines, including strict equipment calibration records." },
    { id: "cd16", category: "Lab Partner QA",          tip: "Perform annual clinical quality evaluations of external dental laboratories before extending group contracts or preferred statuses." },
    { id: "cd17", category: "Associate Onboarding",    tip: "Design the clinical governance framework for onboarding new graduates or overseas clinicians to ensure patient safety from day one." },
    { id: "cd18", category: "Record Keeping Audits",   tip: "Run random quarterly record audits across the group's digital databases to ensure notes support defensible clinical workflows." },
    { id: "cd19", category: "Clinical Waste Compliance", tip: "Review aggregate group biological and chemical waste protocols to ensure group practices align with environmental codes." },
    { id: "cd20", category: "Outcome Metrics",         tip: "Implement tracking systems for complex treatment successes and implant survival rates to benchmark the group's clinical standard against industry data." },
    { id: "cd21", category: "IR(ME)R Practitioner Audits", tip: "Conduct formal annual audits to verify that every dentist operating an X-ray set on group premises has documented current core radiation protection training hours." },
    { id: "cd22", category: "Sedation Adverse Events", tip: "Maintain a mandatory centralised log for all conscious sedation complications across the estate, ensuring a formal multi-site clinical review is executed within 48 hours of any incident." },
    { id: "cd23", category: "Bio-Compatibility Clearance", tip: "Ensure all newly introduced endodontic sealers or bone-grafting materials pass independent verification against international safety standards before adding them to the approved group procurement list." },
    { id: "cd24", category: "Duty of Candour Escalation", tip: "Ensure local practice managers have an immediate, direct line to your desk the moment an incident meets the statutory criteria for a formal Regulation 20 notification." },
    { id: "cd25", category: "Skill Verification",      tip: "Before authorising an associate to market complex treatments like clear aligners or facial aesthetics under the corporate brand, review their case portfolio and certificate validity." },
  ],

  /* ─── 7. Receptionists / Front Desk ─────────────────────────────── */
  receptionist: [
    { id: "r1",  category: "GDPR Identity Verification", tip: "Always verify a patient's full name, address, and date of birth before discussing treatment plans or financial balances over the phone." },
    { id: "r2",  category: "Medical History Workflow", tip: "Ensure every patient completing a digital or paper medical history form fills in every section, paying extra attention to signature boxes." },
    { id: "r3",  category: "Urgent Phone Triage",      tip: "Use the group-approved triage script to identify true dental emergencies (like swelling or trauma) and prioritise them for same-day slots." },
    { id: "r4",  category: "Patient Fee Discussions",  tip: "Present treatment cost estimates clearly and provide a printed or digital breakdown before scheduling long treatment sessions." },
    { id: "r5",  category: "Workstation Data Privacy", tip: "Turn your computer monitor away from public view and never leave paper day-lists visible to patients standing at the front desk." },
    { id: "r6",  category: "NHS Exemptions",           tip: "When checking in an NHS patient, request to see valid physical or digital proof of their benefit exemption status." },
    { id: "r7",  category: "No-Show Tracking",         tip: "Log short-notice cancellations and failure-to-attend events immediately so clinical staff can update their schedules." },
    { id: "r8",  category: "Patient Check-in",         tip: "Greet patients by name within 10 seconds of them approaching the front desk to create a warm, professional first impression." },
    { id: "r9",  category: "Appointment Optimisation", tip: "Avoid creating awkward 15-minute schedule gaps; block treatments closely to maximise the clinical team's productivity." },
    { id: "r10", category: "Review Collection",        tip: "When a patient shares a positive comment about their treatment experience, warmly invite them to complete the practice's online review link." },
    { id: "r11", category: "Cash Drawer Handling",     tip: "Count out change carefully and cross-reference your POS card machine totals with the software terminal balance at every shift change." },
    { id: "r12", category: "Patient Phone Management", tip: "If you must place a calling patient on hold, always ask for their permission first and wait for their response before muting." },
    { id: "r13", category: "Arriving Patient Comms",   tip: "If a surgery is running more than 15 minutes behind schedule, proactively inform arriving patients and manage their waiting expectations." },
    { id: "r14", category: "Waiting Room Risk",        tip: "Keep the reception counter clean and check the patient waiting room regularly to ensure paths are clear of toys or bags." },
    { id: "r15", category: "Email Communications",     tip: "Double-check the recipient's email address spelling before sending out digital copies of patient charts or referral letters." },
    { id: "r16", category: "Treatment Estimates",      tip: "Ensure every patient scheduled for private cosmetic care leaves the practice with a signed, written copy of their estimate." },
    { id: "r17", category: "Post-Operative Follow-up", tip: "Schedule follow-up calls for patients who underwent complex surgical treatments the previous day to check on their recovery." },
    { id: "r18", category: "New Patient Onboarding",   tip: "When a new patient calls to register, clearly explain payment expectations and details about local parking layouts." },
    { id: "r19", category: "Practice Policy Updates",  tip: "Read new practice framework documents before your shift to answer patient questions about updated opening hours or fee updates." },
    { id: "r20", category: "Patient Checkout",         tip: "Before a patient leaves the building, verify that their next required routine check-up or hygiene visit is scheduled in the calendar." },
    { id: "r21", category: "GDPR Verbal Disclosure",   tip: "Never confirm a patient's telephone number or home address out loud at the desk if other individuals are waiting in line; ask them to verify their postcode or date of birth instead." },
    { id: "r22", category: "NHS PR Form Verification", tip: "Ensure every patient receiving NHS dental treatment signs and dates the PR form on the day treatment begins, verifying that their exemption checkboxes are completely filled." },
    { id: "r23", category: "Emergency Slot Allocation", tip: "When a patient calls with acute dental pain, follow the structured triage pathway to assess for systemic signs like difficulty breathing or swallowing before offering a priority slot." },
    { id: "r24", category: "PCI-DSS Card Processing",  tip: "Never write down a payment card number or CVV code on paper day-lists or sticky notes; all over-the-phone transactions must be typed directly into the secure payment terminal." },
    { id: "r25", category: "Delay Notice Etiquette",   tip: "If a clinician's schedule falls behind by more than 20 minutes, intercept the arriving patient at check-in, explain the delay clearly, and offer a realistic updated wait time." },
  ],

  /* ─── 8. Foundation Dentists (Year 1) ───────────────────────────── */
  foundation_dentist: [
    { id: "fd1",  category: "The Pace Transition",     tip: "If a complex procedure starts running over your scheduled appointment slot, do not panic or rush. Secure optimal moisture control, place a stable temporary dressing, and safely reschedule the patient for completion." },
    { id: "fd2",  category: "BPE Tracking Compliance", tip: "When charting for a new patient, remember that a BPE score of 3 or 4 legally triggers the requirement for a full, detailed 6-point pocket chart before executing complex periodontal therapy." },
    { id: "fd3",  category: "NHS Claim Timelines",     tip: "Get into the habit of transmitting your completed FP17 claims within the week of treatment completion to avoid falling behind on your baseline UDA targets or hitting contract rejection limits." },
    { id: "fd4",  category: "Antibiotic Stewardship",  tip: "Never prescribe antibiotics just to clear a busy emergency slot; ensure local operative measures (like starting an open-drain pulpotomy or extracting a mobile tooth) are performed first where clinically indicated." },
    { id: "fd5",  category: "Radiation Justification", tip: "Always document your precise, explicit clinical indications inside the patient chart before pressing the exposure button on an X-ray unit to meet statutory IR(ME)R compliance." },
    { id: "fd6",  category: "The ES Safety Valve",     tip: "If a surgical extraction or a root canal separation leaves you unsure of your next anatomical move, stop immediately. Tag your Educational Supervisor (ES) for an on-site look before altering your flap design or osteotomy depth." },
    { id: "fd7",  category: "Retrospective Note Safety", tip: "If you realise you missed a critical clinical detail in yesterday's notes, never edit or overwrite the original entry. Add a separate, dated, and signed addendum titled 'Retrospective Entry.'" },
    { id: "fd8",  category: "Rubber Dam Mandatory",    tip: "Standard clinical protocol requires a rubber dam for all endodontic procedures. If anatomical presentation makes isolation impossible, you must document the exact alternative moisture control strategy used." },
    { id: "fd9",  category: "Consent Consistency",     tip: "Informed consent is an ongoing discussion, not a one-time paper exercise. Re-verify the patient's agreement on costs, risks, and options at the beginning of every single treatment session." },
    { id: "fd10", category: "Prescription Formatting", tip: "When writing a manual prescription for a minor, always include their exact age and weight on the slip; never use non-standard abbreviations like 'u' for units or 'ml' without clear dosage numbers." },
    { id: "fd11", category: "Laboratory Tracking",     tip: "Scan the specific laboratory conformity statement directly into the patient record the moment it arrives with a crown or bridge; this provides absolute materials traceability." },
    { id: "fd12", category: "Medical History Re-checks", tip: "Never assume a historical medical alert form is completely accurate. Verbally confirm systemic health shifts, recent surgeries, and medication changes with the patient before administering local anaesthetic." },
    { id: "fd13", category: "Local Anaesthetic Logging", tip: "Always chart the exact brand, expiration date, batch code, and total volume (in milligrams or cartridges) of local anaesthetic solution deposited during a block or infiltration." },
    { id: "fd14", category: "Ergonomic Positioning",   tip: "Protect your long-term health by taking 10 seconds to adjust your operator chair height before starting an access cavity. Your thighs should sit slightly downward-slanted relative to your hips." },
    { id: "fd15", category: "Composite Increment Control", tip: "To minimise post-operative sensitivity and counter polymerisation shrinkage, build and cure your posterior composite restorations in strict increments no larger than 2mm." },
    { id: "fd16", category: "Sharps Disposal",         tip: "Comply with sharps safety regulations by utilising a single-handed mechanical locking device to remove needles; never manually re-sheath a contaminated needle under any circumstances." },
    { id: "fd17", category: "Chaperone Documentation", tip: "Always log the full name of the dental nurse present in the surgery during any clinical examination or treatment sequence to preserve a clear record of chaperone protection." },
    { id: "fd18", category: "Mental Capacity Gateways", tip: "If you suspect a patient lacks the capacity to consent to a complex procedure, halt care, perform a formal two-stage capacity check, and document the best-interest decision pathway clearly." },
    { id: "fd19", category: "Equipment Hazard Alerts", tip: "If a handpiece or delivery line begins running erratically, stop using it immediately, tag the unit clearly as 'Out of Service,' and pass the issue straight to your Practice Manager." },
    { id: "fd20", category: "Clear Communication",     tip: "Avoid confusing technical dental terms when discussing treatment plans. Use visual tools or simple analogies, and hand over a printed cost breakdown before scheduling long visits." },
    { id: "fd21", category: "Implant Referral Paths",  tip: "When documenting an advanced multi-disciplinary or implant referral, explicitly outline the patient's basic periodontal stability and caries risk factors to ensure a clean referral handoff." },
    { id: "fd22", category: "Paediatric Fluoride",     tip: "Before applying high-concentration fluoride varnish to a child, check their medical chart to verify they have no history of asthma hospitalisations or severe product allergies." },
    { id: "fd23", category: "Periodontal Links",       tip: "Ensure patients presenting with high BPE scores are educated on how active smoking and blood glucose volatility directly accelerate attachment loss before finalising their treatment pathways." },
    { id: "fd24", category: "Conscious Sedation",      tip: "When treating a patient under intravenous sedation, continuous pulse oximetry is a legal requirement; ensure arterial oxygen saturation (SpO₂) is manually verified and logged every 5 minutes." },
    { id: "fd25", category: "CPD Reflection Tracking", tip: "When adding verifiable CPD hours to your portfolio, include a short personal reflection stating exactly how the lesson learned modifies your daily clinical technique." },
  ],

  /* ─── 9. Trainee Dental Nurses ──────────────────────────────────── */
  trainee_nurse: [
    { id: "tn1",  category: "Decontamination Zoning", tip: "Maintain a strict physical boundary in the decontamination room; never lay contaminated instrument trays into the designated 'Clean Inspection' zone before sterilisation." },
    { id: "tn2",  category: "Waterline Purging",     tip: "Purge your dental unit waterlines for a minimum of two minutes at the start of every working day and for 30 seconds between successive patient appointments to control biofilm buildup." },
    { id: "tn3",  category: "Autoclave Validation",  tip: "At the start of every sterilisation cycle shift, verify that the autoclave data logger or printout matches the required temperature and pressure targets before signing off the log." },
    { id: "tn4",  category: "Material Setting Alerts", tip: "Keep in mind that leaving composite materials, bonding resins, or specialised luting cements exposed to bright ambient surgery lighting can cause them to undergo premature setting before chairside placement." },
    { id: "tn5",  category: "Aspirator Placement",   tip: "Position the high-volume aspirator tip slightly behind the tooth being prepped to catch water spray effectively without obstructing the dentist's mirror line or access path." },
    { id: "tn6",  category: "Suction Filter Care",   tip: "Flush and clean the main chairside suction lines and collection baskets at the conclusion of every day using an approved, non-foaming enzymatic solution." },
    { id: "tn7",  category: "PPE Replacement",       tip: "Swap out your clinical face mask every two hours, or immediately if it becomes damp, to maintain a reliable barrier against particulate and moisture filtration." },
    { id: "tn8",  category: "Pouch Label Clearance", tip: "When stamping or handwriting the tracking date on an instrument pouch, ensure the ink or stamp placement does not cover the chemical indicator grid printed on the bag." },
    { id: "tn9",  category: "Matrix Band Inspection", tip: "Inspect metal matrix bands or cellulose strips for microscopic crimps or defects before passing them to the dentist; a damaged band will ruin the contact point of a restoration." },
    { id: "tn10", category: "Clinical Waste Segregation", tip: "Place items containing blood or extracted teeth directly into the yellow hazardous clinical waste container, while standard cotton rolls go into the orange alternative tray." },
    { id: "tn11", category: "Emergency Kit Surveillance", tip: "Check the emergency oxygen cylinder pressure gauge and verification seals weekly, ensuring no medications in the emergency drug kit are within 90 days of expiration." },
    { id: "tn12", category: "Ultrasonic Bath Refresh", tip: "Empty, clean, and refresh the chemical solution in your ultrasonic bath at least twice a day — or sooner if the fluid appears visually cloudy — to maintain cavitation efficiency." },
    { id: "tn13", category: "Implant Tracking Handoffs", tip: "Hand over the tracking lot stickers from sterile implant packages or specialised biomaterials to the logging clinician immediately for direct data entry into the patient chart." },
    { id: "tn14", category: "Two-Wipe Disinfection", tip: "When wiping down surgery work surfaces between patients, implement a strict two-wipe method: use the first wipe to physically remove bio-burden, and a second to actively disinfect the area." },
    { id: "tn15", category: "Amalgam Separator Sweeps", tip: "Monitor the visual level indicator on your surgery's amalgam separator unit weekly to ensure it is replaced before overflowing and breaching environmental standards." },
    { id: "tn16", category: "Handpiece Lubrication", tip: "Always clean and thoroughly lubricate high-speed and low-speed handpieces after cleaning them but before putting them into the autoclave; heat-sterilising an unlubricated tool damages the internal bearings." },
    { id: "tn17", category: "First-In, First-Out",   tip: "Practice a strict 'First-In, First-Out' rotation model when restocking surgery cabinets to prevent expensive bonding agents, acid etchants, or cements from expiring in the back of the drawer." },
    { id: "tn18", category: "Cold Disinfection Limits", tip: "Never use cold liquid chemical soak solutions to sterilise critical surgical items. If an instrument can withstand heat, it must pass through an autoclave to be legally safe." },
    { id: "tn19", category: "Patient Reception Handoffs", tip: "When walking a patient from the dental chair back to the reception desk, give clear verbal parameters to the front desk team regarding the exact duration needed for their next appointment." },
    { id: "tn20", category: "Autoclave Helix Verification", tip: "Run a formal Helix steam penetration test at the start of every B-type vacuum autoclave cycle day to verify that steam is clearing air pockets inside hollow instrument tubes." },
    { id: "tn21", category: "Mercury Accident Prep", tip: "Know the exact location of your practice's mercury spill kit; never use a standard vacuum cleaner or the chairside high-volume suction lines to clear a broken silver amalgam capsule." },
    { id: "tn22", category: "Instrument Transport Safety", tip: "Always use colour-coded, puncture-proof, locked boxes when moving contaminated instruments down corridors to the decontamination room to avoid accidental sharps exposure." },
    { id: "tn23", category: "Pressure Gasket Inspections", tip: "Before turning on any sterilisation machinery, check the silicone door gaskets for cracks or mineral scaling that could disrupt a proper pressure seal." },
    { id: "tn24", category: "GDPR Data Privacy",     tip: "Turn your surgery computer monitor away from public view and never leave paper day-lists visible on counters where patients or visitors can glimpse personal details." },
    { id: "tn25", category: "Medical History Verification", tip: "When handing a patient a medical history form, verify that every section has a selection marked and that the signature box is dated on the day treatment begins." },
  ],
};

/* ─── Selectors ────────────────────────────────────────────────────── */

/** Returns the tip for the current day, optionally offset by carousel pagination. */
export function getTipForToday(personaId, offset = 0) {
  const pool = TIPS_LIBRARY[personaId] ?? TIPS_LIBRARY.dentist;
  const dayIndex = Math.floor(Date.now() / 86400000) + offset;
  /* Positive modulo wrap so back-stepping from index 0 lands on the
   * last tip in the pool, not a negative index. */
  return pool[((dayIndex % pool.length) + pool.length) % pool.length];
}

export function getTipCount(personaId) {
  return (TIPS_LIBRARY[personaId] ?? TIPS_LIBRARY.dentist).length;
}

export function getTipIndex(personaId, offset = 0) {
  const len = getTipCount(personaId);
  const dayIndex = Math.floor(Date.now() / 86400000) + offset;
  return ((dayIndex % len) + len) % len;
}
