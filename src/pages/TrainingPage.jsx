import { useState, useMemo, useRef, useEffect } from "react";
import { I } from "../components/Icon";
import { Pill } from "../components/ui/Pill";
import { Card } from "../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../components/ui/Buttons";
import { Avatar } from "../components/ui/Avatar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { SearchBar } from "../components/ui/SearchBar";
import styles from "./TrainingPage.module.css";

/* ─── Static module data ───
 * Lesson + quiz content for hand-authored modules. Modules without an entry
 * here fall back to a generic outline (see getModuleContent below).
 */
const moduleContent = {
  m1: {
    lessons: [
      { title: "The CQC's Role in Dental Regulation", dur: "20 min", type: "video", desc: "The Care Quality Commission was established under the Health and Social Care Act 2008. All dental practices providing regulated activities must register with the CQC. Inspections assess whether practices meet the Fundamental Standards set out in the 2014 regulations (updated 2015). Around 10% of dental practices are inspected each year." },
      { title: "The 5 Key Questions & Quality Statements", dur: "25 min", type: "video", desc: "Since 2024, the CQC uses a Single Assessment Framework with 34 Quality Statements replacing the old KLOEs. The five key questions remain: Safe, Effective, Caring, Responsive, and Well-Led. Each is rated Outstanding, Good, Requires Improvement, or Inadequate. The 'Well-Led' requirement was introduced following the Francis Report into Mid Staffordshire NHS Foundation Trust." },
      { title: "Evidence Categories & What Inspectors Review", dur: "22 min", type: "video", desc: "Inspectors gather evidence from six categories: people's experiences (patient feedback, surveys), staff feedback and interviews, partner feedback (commissioners, GDC), onsite inspection observations, internal processes (incident management, record-keeping), and outcome data. They will review training records, risk assessments, audits, complaints logs, and staff personnel files." },
      { title: "Preparing Your Practice: The Compliance Portfolio", dur: "30 min", type: "interactive", desc: "Building an inspection-ready evidence portfolio: organising policies by KLOE, maintaining audit trails, documenting staff training matrices, collecting patient feedback systematically, and keeping equipment maintenance logs. Inspections are usually announced 2 weeks in advance, but can be unannounced in response to concerns or complaints from staff or patients." },
      { title: "Mock Inspection Walkthrough", dur: "35 min", type: "interactive", desc: "Simulated CQC inspection day: presenting your practice's self-assessment at the start, managing inspector access to clinical areas, preparing staff for open-ended questions about patient outcomes, handling document requests, and understanding the inspector's assessment methodology. Inspectors speak to all team members including receptionists, nurses, and associates." },
      { title: "Post-Inspection: Action Plans & Enforcement", dur: "15 min", type: "reading", desc: "Understanding inspection reports, responding to recommendations, creating SMART action plans, and the enforcement escalation pathway (requirement notices, warning notices, conditions, suspension, cancellation). Practices rated 'Requires Improvement' or 'Inadequate' face re-inspection. All ratings are published publicly on the CQC website." },
    ],
    quiz: [
      { q: "Under the CQC's Single Assessment Framework (2024), how many Quality Statements replaced the old KLOEs?", options: ["15", "24", "34", "42"], correct: 2 },
      { q: "Which report led to the introduction of the 'Well-Led' key question?", options: ["The Shipman Inquiry", "The Francis Report (Mid Staffordshire)", "The Morecambe Bay Investigation", "The Kennedy Report"], correct: 1 },
      { q: "How much advance notice does the CQC typically give for a routine comprehensive inspection?", options: ["24 hours", "1 week", "2 weeks", "1 month"], correct: 2 },
      { q: "What percentage of dental practices does the CQC aim to inspect each year?", options: ["5%", "10%", "25%", "50%"], correct: 1 },
    ],
  },
  m2: {
    lessons: [
      { title: "Dental Practice Revenue Streams", dur: "22 min", type: "video", desc: "Understanding NHS contract income (UDA values, band 1/2/3 charges), private fee structures, plan income (Denplan, Practice Plan), hygiene revenue, and ancillary income. Analysing the mix between NHS and private and its impact on practice viability." },
      { title: "Budgeting & Financial Planning", dur: "25 min", type: "video", desc: "Creating annual budgets, forecasting revenue against costs, managing laboratory fees, materials costs, staff costs (typically 50-60% of turnover), premises costs, and equipment depreciation. Understanding profit and loss statements and balance sheets for dental practices." },
      { title: "NHS UDA Performance Monitoring", dur: "20 min", type: "video", desc: "Tracking UDA delivery against contract targets, understanding clawback mechanisms (where practices fail to deliver contracted UDAs), managing the year-end reconciliation process, and strategies for maintaining consistent UDA delivery throughout the contract year." },
      { title: "Cost Control & Efficiency", dur: "18 min", type: "interactive", desc: "Stock management and ordering optimisation, negotiating laboratory and supplier contracts, managing associate fee splits (typically 40-50% of gross), controlling consumables wastage, and energy efficiency measures." },
      { title: "Financial Reporting & KPIs", dur: "15 min", type: "reading", desc: "Key financial metrics for dental practices: revenue per surgery hour, cost per UDA, average patient value, hygiene hourly rate, lab cost percentages, and benchmarking against industry averages. Using your practice management software reports for financial analysis." },
    ],
    quiz: [
      { q: "What percentage of practice turnover do staff costs typically represent?", options: ["20-30%", "35-45%", "50-60%", "65-75%"], correct: 2 },
      { q: "What happens when an NHS dental practice fails to deliver its contracted UDAs?", options: ["No consequence", "Clawback of funding", "Automatic contract renewal", "CQC investigation"], correct: 1 },
      { q: "What is the typical associate fee split range in UK dental practice?", options: ["20-30% of gross", "40-50% of gross", "60-70% of gross", "80-90% of gross"], correct: 1 },
    ],
  },
  m3: {
    lessons: [
      { title: "Employment Contracts & Legal Framework", dur: "22 min", type: "video", desc: "Under the Employment Rights Act 1996, employees must receive a written statement of employment particulars from day one (updated from 2 months by the Employment Rights (Employment Particulars and Paid Annual Leave) (Amendment) Regulations 2018). Covering contract types: permanent, fixed-term, zero-hours, and associate (self-employed) agreements in dentistry." },
      { title: "ACAS Code & Disciplinary Procedures", dur: "25 min", type: "video", desc: "The ACAS Code of Practice on disciplinary and grievance procedures provides the framework all employers should follow. Steps: investigation, notification, hearing with right to be accompanied, decision, and right of appeal. Employment Tribunals can increase awards by up to 25% where the ACAS Code has not been followed." },
      { title: "Staff Appraisals & Performance Management", dur: "20 min", type: "video", desc: "Conducting effective annual appraisals and mid-year reviews, setting SMART objectives, documenting performance concerns, implementing performance improvement plans (PIPs), and managing capability procedures. CQC inspectors specifically check staff appraisal records." },
      { title: "Equality Act 2010 & Protected Characteristics", dur: "18 min", type: "video", desc: "The nine protected characteristics (age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation). Understanding direct and indirect discrimination, harassment, victimisation, and the duty to make reasonable adjustments for disabled employees." },
      { title: "Practical HR Scenarios", dur: "30 min", type: "interactive", desc: "Case studies: managing long-term sickness absence, handling flexible working requests (Employment Relations (Flexible Working) Act 2023 — employees can request from day one), maternity/paternity rights, redundancy procedures, and managing associate/self-employment status for HMRC purposes." },
    ],
    quiz: [
      { q: "From what point must an employee receive a written statement of employment particulars?", options: ["Within 1 month", "Within 2 months", "From day one of employment", "After probation"], correct: 2 },
      { q: "How many protected characteristics are covered by the Equality Act 2010?", options: ["5", "7", "9", "11"], correct: 2 },
      { q: "By how much can an Employment Tribunal increase an award if the ACAS Code of Practice was not followed?", options: ["10%", "15%", "25%", "50%"], correct: 2 },
      { q: "Under the 2023 Flexible Working Act, when can employees first request flexible working?", options: ["After 6 months", "After 1 year", "After 2 years", "From day one"], correct: 3 },
    ],
  },
  m4: {
    lessons: [
      { title: "Health & Safety at Work Act 1974", dur: "18 min", type: "video", desc: "The primary legislation governing workplace safety. Employer duties under Section 2 (duty to employees), Section 3 (duty to non-employees including patients), and Section 7 (employee duties). Practices with 5+ employees must have a written health and safety policy." },
      { title: "COSHH Regulations 2002", dur: "22 min", type: "video", desc: "Control of Substances Hazardous to Health in dental practice: assessing risks from chemicals (impression materials, disinfectants, bleaching agents, amalgam), mercury hygiene, glutaraldehyde exposure, and maintaining COSHH assessment files with Safety Data Sheets. Employers must prevent or adequately control exposure and provide training under Regulation 12." },
      { title: "RIDDOR 2013 — Reporting Requirements", dur: "15 min", type: "video", desc: "Reporting of Injuries, Diseases and Dangerous Occurrences Regulations 2013. Reportable events include: fatalities, specified injuries (fractures, amputations, loss of sight), over-7-day incapacitation injuries, occupational diseases (including hepatitis from sharps injuries), and dangerous occurrences. Reports must be made to HSE's online system without delay." },
      { title: "Fire Safety (Regulatory Reform Order 2005)", dur: "20 min", type: "video", desc: "The 'Responsible Person' (usually the practice manager/owner) must carry out a fire risk assessment, maintain fire detection and warning systems, ensure clear escape routes, provide fire safety training to all staff, and keep records. Fire drills should be conducted at least twice yearly. Fire extinguishers must be serviced annually." },
      { title: "Risk Assessment in Practice", dur: "20 min", type: "interactive", desc: "Conducting workplace risk assessments: identifying hazards, evaluating who might be harmed and how, implementing control measures, recording findings, and reviewing regularly. Covering manual handling, DSE assessments, lone working, sharps safety (Health and Safety (Sharp Instruments in Healthcare) Regulations 2013), and slips/trips." },
      { title: "Compliance Documentation & Audit", dur: "12 min", type: "reading", desc: "Maintaining compliance records: accident book (must be GDPR-compliant), COSHH files, risk assessment register, fire log book, equipment maintenance records, and training records. CQC inspectors review these documents during inspections." },
    ],
    quiz: [
      { q: "At what number of employees must a practice have a written health and safety policy?", options: ["1 or more", "3 or more", "5 or more", "10 or more"], correct: 2 },
      { q: "Under RIDDOR 2013, an over-incapacitation injury must be reported if the employee is unable to work for more than how many days?", options: ["3 consecutive days", "5 consecutive days", "7 consecutive days", "14 consecutive days"], correct: 2 },
      { q: "How often should fire drills be conducted in a dental practice?", options: ["Monthly", "Quarterly", "At least twice a year", "Annually"], correct: 2 },
      { q: "Which regulation specifically covers sharps injuries in healthcare settings?", options: ["COSHH 2002", "RIDDOR 2013", "Health and Safety (Sharp Instruments in Healthcare) Regulations 2013", "PUWER 1998"], correct: 2 },
    ],
  },
  m5: {
    lessons: [
      { title: "UK GDPR & Data Protection Act 2018", dur: "22 min", type: "video", desc: "The seven data protection principles (lawfulness/fairness/transparency, purpose limitation, data minimisation, accuracy, storage limitation, integrity/confidentiality, accountability). Dental practices process both personal data and special category health data, requiring explicit consent or legitimate medical basis under Article 9." },
      { title: "Lawful Bases for Processing Patient Data", dur: "18 min", type: "video", desc: "The six lawful bases (consent, contract, legal obligation, vital interests, public task, legitimate interests). For health data in dental practice, the typical basis is 'provision of healthcare' under Schedule 1, Part 1, Paragraph 2 of the DPA 2018. Understanding when consent is and isn't required." },
      { title: "Subject Access Requests (SARs)", dur: "20 min", type: "video", desc: "Patients have the right to access their records under Article 15 of UK GDPR. Practices must respond within one calendar month (extendable by two months for complex requests). Requests are free of charge. You cannot refuse a SAR because it's inconvenient — only if it's manifestly unfounded or excessive." },
      { title: "Data Breaches & the ICO", dur: "15 min", type: "video", desc: "Reportable breaches must be notified to the Information Commissioner's Office within 72 hours. A breach is reportable if it poses a risk to individuals' rights and freedoms. Recording all breaches (reportable or not) in a breach register. Maximum fine under UK GDPR: £17.5 million or 4% of annual turnover." },
      { title: "Caldicott Principles & Dental Records", dur: "18 min", type: "interactive", desc: "The eight Caldicott Principles for handling patient-identifiable information. Appointing a Caldicott Guardian (or equivalent in primary care). Records retention: NHS dental records must be retained for 10 years after treatment (or until age 25 for children, whichever is longer). Secure storage, encryption, and disposal requirements." },
    ],
    quiz: [
      { q: "Within what timeframe must a Subject Access Request be fulfilled under UK GDPR?", options: ["7 days", "14 days", "1 calendar month", "3 months"], correct: 2 },
      { q: "Within how many hours must a reportable data breach be notified to the ICO?", options: ["24 hours", "48 hours", "72 hours", "7 days"], correct: 2 },
      { q: "How long must NHS dental records be retained after treatment?", options: ["5 years", "7 years", "10 years", "25 years"], correct: 2 },
      { q: "How many data protection principles are there under UK GDPR?", options: ["5", "6", "7", "8"], correct: 2 },
    ],
  },
  m6: {
    lessons: [
      { title: "NHS Complaints Framework", dur: "20 min", type: "video", desc: "The NHS complaints procedure (Local Authority Social Services and NHS Complaints Regulations 2009) requires all practices to have a designated complaints handler. Complaints must be acknowledged within 3 working days. The practice must investigate and provide a written response, typically within 6 months." },
      { title: "Handling Complaints Effectively", dur: "22 min", type: "video", desc: "The six-step process: acknowledge, investigate, respond, learn, implement, and monitor. Using the LEARN framework (Listen, Empathise, Apologise, React, Notify). Duty of Candour (Regulation 20) requires practices to be open and transparent when things go wrong, including offering an apology." },
      { title: "Escalation & the Dental Complaints Service", dur: "15 min", type: "video", desc: "If patients are dissatisfied with the practice response, they can escalate to: the NHS Dental Complaints Service (for private treatment), the Parliamentary and Health Service Ombudsman (for NHS treatment), or the GDC (for fitness to practise concerns). Understanding when complaints may become clinical negligence claims." },
      { title: "Root Cause Analysis & Learning", dur: "18 min", type: "interactive", desc: "Using root cause analysis (RCA) tools: fishbone diagrams, 5 Whys technique, and significant event analysis (SEA). Documenting lessons learned, sharing anonymised learning with the team, and implementing system changes to prevent recurrence." },
      { title: "Patient Feedback & Experience", dur: "12 min", type: "reading", desc: "Proactively gathering patient feedback through surveys (Friends and Family Test), online reviews management, patient participation groups, and using feedback data to demonstrate 'Responsive' and 'Caring' to CQC inspectors." },
    ],
    quiz: [
      { q: "Within how many working days must an NHS complaint be acknowledged?", options: ["1 working day", "3 working days", "5 working days", "10 working days"], correct: 1 },
      { q: "Which regulation imposes the Duty of Candour on healthcare providers?", options: ["Regulation 10", "Regulation 15", "Regulation 20", "Regulation 25"], correct: 2 },
      { q: "Where should a patient escalate an unresolved complaint about private dental treatment?", options: ["CQC", "NHS England", "The Dental Complaints Service", "The GMC"], correct: 2 },
    ],
  },
  m7: {
    lessons: [
      { title: "Skill-Mix Planning in Dental Practice", dur: "18 min", type: "video", desc: "Understanding the roles and scope of practice for each team member (GDC Scope of Practice 2013): dentists, hygienists, therapists, dental nurses, orthodontic therapists, and clinical dental technicians. Optimising skill-mix to maximise productivity — e.g., using therapists for routine NHS work and hygienists for prevention programmes." },
      { title: "Rota Management & Scheduling", dur: "20 min", type: "video", desc: "Working Time Regulations 1998: maximum 48-hour working week (opt-out available), minimum 11 consecutive hours rest in 24 hours, minimum 20-minute break after 6 hours. Calculating annual leave entitlement (5.6 weeks including bank holidays). Managing part-time, flexible working, and multi-site rotas." },
      { title: "Locum & Temporary Staff Management", dur: "15 min", type: "video", desc: "Sourcing locums (agencies, direct contracts), conducting pre-employment checks (GDC registration, indemnity, DBS, right to work), ensuring locums are familiar with practice protocols, and managing the IR35 implications of engaging self-employed associates and locums." },
      { title: "Staff-to-Patient Ratios & Capacity Planning", dur: "15 min", type: "interactive", desc: "Calculating surgery utilisation rates, optimal appointment book structures, managing DNA rates, and planning for peak demand periods. Using practice management software data to forecast staffing needs." },
    ],
    quiz: [
      { q: "Under the Working Time Regulations 1998, what is the maximum average working week?", options: ["35 hours", "40 hours", "48 hours", "60 hours"], correct: 2 },
      { q: "What is the statutory minimum annual leave entitlement (including bank holidays)?", options: ["4 weeks", "4.8 weeks", "5.6 weeks", "6 weeks"], correct: 2 },
      { q: "After how many continuous hours of work must an employee receive a rest break?", options: ["4 hours", "5 hours", "6 hours", "8 hours"], correct: 2 },
    ],
  },
  m8: {
    lessons: [
      { title: "NHS Dental Contract Types", dur: "22 min", type: "video", desc: "Understanding GDS (General Dental Services) and PDS (Personal Dental Services) contracts. The UDA (Unit of Dental Activity) system: Band 1 (examination, diagnosis, prevention — 1 UDA), Band 2 (includes fillings, extractions, root canal — 3 UDAs), Band 3 (includes crowns, dentures, bridges — 12 UDAs). Contract values vary by region." },
      { title: "UDA Performance Monitoring", dur: "20 min", type: "video", desc: "Tracking UDA delivery against annual contract targets using BSA Compass data. Understanding tolerance levels (typically 96% minimum delivery). Managing the reconciliation process at year-end. Strategies for consistent UDA delivery: appointment book management, recall optimisation, and reducing failed attendance." },
      { title: "Clawback Prevention & Contract Negotiation", dur: "18 min", type: "video", desc: "Clawback occurs when practices under-deliver against their UDA target — the NHS reclaims funding proportionally. Strategies to avoid clawback: monitoring monthly run-rates, managing associate leave carefully, and having contingency plans. Understanding contract variations, hand-backs, and the process for renegotiating contract values." },
      { title: "NHS Dental Charges & Patient Exemptions", dur: "15 min", type: "reading", desc: "Current NHS dental charge bands, patient exemption categories (under 18, pregnant/12 months post-birth, income-based benefits, NHS Low Income Scheme). Managing FP17 form submission, charge verification, and the consequences of incorrect exemption claims." },
    ],
    quiz: [
      { q: "How many UDAs does a Band 2 course of treatment generate?", options: ["1 UDA", "2 UDAs", "3 UDAs", "5 UDAs"], correct: 2 },
      { q: "What is the typical minimum UDA delivery threshold before clawback applies?", options: ["80%", "90%", "96%", "100%"], correct: 2 },
      { q: "Which system does NHS BSA use for contract monitoring?", options: ["Dental Dashboard", "Compass", "NHSBSA Portal", "FP17 Tracker"], correct: 1 },
    ],
  },
  m9: {
    lessons: [
      { title: "Digital Marketing for Dental Practices", dur: "20 min", type: "video", desc: "Building and maintaining a professional website (GDC requirements for advertising — Standards for the Dental Team 9.1). SEO for dental practices, Google Business Profile optimisation, managing online reviews (Google, NHS Choices). Understanding ASA and GDC advertising regulations — you cannot use the word 'specialist' unless GDC-registered as one." },
      { title: "Social Media Strategy", dur: "18 min", type: "video", desc: "Platform selection (Instagram for before/after, Facebook for community engagement, LinkedIn for recruitment). Content planning, patient consent for photography (GDPR-compliant consent forms), managing negative comments, and the GDC's guidance on social media use by dental professionals." },
      { title: "Patient Referral & Retention Programmes", dur: "15 min", type: "video", desc: "Building internal referral networks, patient loyalty programmes, membership/plan conversions (Denplan, Practice Plan, DPAS), and recall optimisation strategies. Understanding the lifetime value of a dental patient and the cost of patient acquisition." },
      { title: "Brand Consistency & Local Marketing", dur: "15 min", type: "interactive", desc: "Developing a consistent brand identity across all touchpoints, local community engagement, practice open days, school visits, and corporate partnerships. Measuring marketing ROI and tracking new patient sources." },
    ],
    quiz: [
      { q: "Under GDC rules, when can a dentist use the title 'specialist' in marketing?", options: ["After 5 years' experience", "After completing a masters degree", "Only when registered on the GDC Specialist List", "When recommended by colleagues"], correct: 2 },
      { q: "Which organisation regulates dental advertising claims in the UK?", options: ["CQC", "ASA (Advertising Standards Authority)", "NHS England", "BDA"], correct: 1 },
      { q: "What consent is required before using patient photos in marketing materials?", options: ["Verbal consent only", "Written GDPR-compliant consent", "No consent needed if anonymised", "GDC approval"], correct: 1 },
    ],
  },
  m10: {
    lessons: [
      { title: "Leadership Styles in Healthcare", dur: "20 min", type: "video", desc: "Understanding transformational, transactional, and situational leadership models applied to dental practice. The NHS Leadership Academy's Healthcare Leadership Model and its nine leadership dimensions. Moving from 'managing' to 'leading' — the difference between compliance and engagement." },
      { title: "Effective Communication & Team Dynamics", dur: "22 min", type: "video", desc: "Communication models for clinical teams, running effective team meetings and daily huddles, giving constructive feedback (SBI model — Situation, Behaviour, Impact), and managing multidisciplinary team dynamics between clinicians, nurses, and administrative staff." },
      { title: "Conflict Resolution", dur: "18 min", type: "video", desc: "Thomas-Kilmann Conflict Mode Instrument (competing, collaborating, compromising, avoiding, accommodating). De-escalation techniques, mediation approaches, and knowing when to escalate to formal HR procedures. Managing inter-associate disputes and clinician-nurse relationship challenges." },
      { title: "Change Management", dur: "20 min", type: "interactive", desc: "Kotter's 8-step change model applied to dental practice: creating urgency, building a coalition, forming a vision, communicating the change, empowering action, creating quick wins, building on change, and anchoring in culture. Common changes in dental practice: new software systems, clinical protocols, or NHS contract changes." },
      { title: "Building a Culture of Clinical Excellence", dur: "15 min", type: "reading", desc: "Embedding a learning culture, encouraging significant event analysis, supporting CPD and professional development, creating psychological safety for reporting near-misses, and using team-based approaches to quality improvement. The link between leadership quality and CQC 'Well-Led' ratings." },
    ],
    quiz: [
      { q: "How many dimensions does the NHS Healthcare Leadership Model include?", options: ["5", "7", "9", "12"], correct: 2 },
      { q: "In the SBI feedback model, what does 'B' stand for?", options: ["Benchmark", "Behaviour", "Business", "Belief"], correct: 1 },
      { q: "How many steps are in Kotter's change management model?", options: ["5", "6", "8", "10"], correct: 2 },
      { q: "Which CQC key question is most directly linked to leadership quality?", options: ["Safe", "Effective", "Caring", "Well-Led"], correct: 3 },
    ],
  },
  d1: {
    lessons: [
      { title: "Medical Emergency Recognition", dur: "15 min", type: "video", desc: "Recognising signs and symptoms of common medical emergencies in the dental setting including anaphylaxis, cardiac arrest, and syncope." },
      { title: "Basic Life Support & AED", dur: "20 min", type: "video", desc: "Adult and child BLS algorithms, chest compression technique, rescue breaths, and automated external defibrillator operation." },
      { title: "Emergency Drug Kit", dur: "18 min", type: "video", desc: "Required emergency drugs, dosages, routes of administration, and drug expiry management." },
      { title: "Oxygen Administration", dur: "12 min", type: "video", desc: "Oxygen delivery devices, flow rates for different emergencies, and pulse oximetry monitoring." },
      { title: "Scenario-Based Practice", dur: "30 min", type: "interactive", desc: "Interactive emergency scenarios: anaphylaxis during LA, vasovagal syncope, asthma attack, and hypoglycaemia." },
      { title: "Emergency Equipment Audit", dur: "10 min", type: "reading", desc: "Monthly equipment checklist, drug storage requirements, and record-keeping obligations." },
    ],
    quiz: [
      { q: "What is the correct adult chest compression rate per minute?", options: ["60-80", "80-100", "100-120", "120-140"], correct: 2 },
      { q: "Which drug is the first-line treatment for anaphylaxis?", options: ["Hydrocortisone", "Chlorphenamine", "Adrenaline 1:1000", "Salbutamol"], correct: 2 },
      { q: "At what ratio should chest compressions to rescue breaths be delivered in adult BLS?", options: ["15:2", "30:2", "15:1", "30:1"], correct: 1 },
      { q: "Where should adrenaline be administered during anaphylaxis?", options: ["Intravenously", "Intramuscularly (anterolateral thigh)", "Subcutaneously", "Sublingually"], correct: 1 },
    ],
  },
  d2: {
    lessons: [
      { title: "IRMER Regulations Overview", dur: "20 min", type: "video", desc: "The Ionising Radiation (Medical Exposure) Regulations 2017, roles of referrer, practitioner, and operator." },
      { title: "Justification & Optimisation", dur: "18 min", type: "video", desc: "Clinical justification for each exposure, selection criteria guidelines, and the ALARA principle." },
      { title: "Image Quality & Grading", dur: "22 min", type: "video", desc: "Radiograph quality assessment, grading systems, reject analysis, and quality assurance programmes." },
      { title: "Radiation Dose & Protection", dur: "15 min", type: "video", desc: "Patient dose reduction, thyroid collars, rectangular collimation, and pregnancy considerations." },
      { title: "Digital Radiography Systems", dur: "20 min", type: "video", desc: "Sensor types, phosphor plates, image processing, and digital workflow optimisation." },
    ],
    quiz: [
      { q: "Under IRMER 2017, who is responsible for justifying a radiographic exposure?", options: ["The operator", "The practitioner", "The referrer", "The patient"], correct: 1 },
      { q: "What does ALARA stand for?", options: ["As Low As Readily Available", "As Low As Reasonably Achievable", "Always Limit All Radiation Application", "As Limited As Reasonably Allowed"], correct: 1 },
      { q: "What is the recommended grading system for dental radiograph quality?", options: ["Pass/Fail", "Grade 1-3", "A-D", "Excellent/Acceptable/Unacceptable"], correct: 1 },
    ],
  },
  n1: {
    lessons: [
      { title: "GDC Standards for Dental Nurses", dur: "15 min", type: "video", desc: "GDC Scope of Practice, Standards for the Dental Team, and professional responsibilities of registered dental nurses." },
      { title: "Radiography for Dental Nurses", dur: "22 min", type: "video", desc: "Taking radiographs under prescription, positioning techniques, infection control during radiography, and image quality." },
      { title: "Fluoride Varnish Application", dur: "18 min", type: "video", desc: "Delivering Better Oral Health guidelines, application technique, patient selection, and consent requirements." },
      { title: "Oral Health Education Delivery", dur: "20 min", type: "video", desc: "Chairside OHE techniques, tailoring advice to patient needs, dietary counselling, and interdental cleaning instruction." },
      { title: "Extended Duties Framework", dur: "12 min", type: "reading", desc: "Overview of additional skills dental nurses can develop, competency requirements, and indemnity considerations." },
    ],
    quiz: [
      { q: "How often must dental nurses renew their GDC registration?", options: ["Every year", "Every 2 years", "Every 3 years", "Every 5 years"], correct: 0 },
      { q: "What concentration of sodium fluoride varnish is typically used in dental practice?", options: ["0.1%", "1%", "2.26%", "5%"], correct: 2 },
      { q: "Under whose prescription can a dental nurse take radiographs?", options: ["Any dentist", "An IRMER practitioner", "A senior nurse", "The practice manager"], correct: 1 },
    ],
  },
  h1: {
    lessons: [
      { title: "BSP Classification of Periodontal Disease", dur: "25 min", type: "video", desc: "2017 World Workshop classification, staging and grading, and clinical application in treatment planning." },
      { title: "BPE Screening & Full Charting", dur: "20 min", type: "video", desc: "Basic Periodontal Examination technique, when to escalate to full charting, probing depth measurement, and bleeding on probing." },
      { title: "Risk Assessment & Patient Factors", dur: "18 min", type: "video", desc: "Smoking, diabetes, genetics, stress — assessing patient risk profiles and modifying treatment plans accordingly." },
      { title: "Treatment Planning & S&RP Protocols", dur: "22 min", type: "video", desc: "Non-surgical periodontal therapy phases, scaling and root planing technique, re-evaluation timelines, and referral criteria." },
      { title: "Outcome Evaluation & Maintenance", dur: "15 min", type: "video", desc: "Measuring treatment success, supportive periodontal therapy intervals, and long-term monitoring strategies." },
    ],
    quiz: [
      { q: "In the 2017 classification, what does Stage III periodontitis indicate?", options: ["Initial periodontitis", "Moderate periodontitis", "Severe periodontitis with potential tooth loss", "Advanced periodontitis requiring surgery"], correct: 2 },
      { q: "A BPE score of 4 indicates what?", options: ["Healthy", "Bleeding on probing", "Pocket 4-5mm", "Pocket 6mm or more"], correct: 3 },
      { q: "How long after completion of non-surgical therapy should re-evaluation typically occur?", options: ["2 weeks", "4-6 weeks", "8-12 weeks", "6 months"], correct: 2 },
    ],
  },
};

const roles = [
  { id: "all", label: "All Roles", icon: "staff" },
  { id: "manager", label: "Practice Managers", icon: "briefcase" },
  { id: "dentist", label: "Dentists", icon: "clinical" },
  { id: "nurse", label: "Dental Nurses", icon: "heart" },
  { id: "hygienist", label: "Hygienists", icon: "star" },
];

const modules = [
  { id: "m1", role: "manager", cat: "Compliance", title: "CQC Inspection Preparation & Self-Assessment", desc: "Complete guide to preparing for CQC inspections including mock audit walkthroughs, evidence gathering, and the 5 Key Lines of Enquiry.", cpd: 6, dur: "6 hrs", type: "Course", status: "mandatory", pct: 0 },
  { id: "m2", role: "manager", cat: "Finance", title: "Practice Financial Management & Budgeting", desc: "Revenue forecasting, cost control, NHS UDA tracking, private fee-setting, and P&L analysis for dental practices.", cpd: 4, dur: "4 hrs", type: "Workshop", status: "recommended", pct: 0 },
  { id: "m3", role: "manager", cat: "HR & Law", title: "Employment Law & HR Procedures", desc: "Contracts, disciplinary processes, grievance handling, staff appraisals, and Equality Act compliance.", cpd: 5, dur: "5 hrs", type: "Course", status: "mandatory", pct: 45 },
  { id: "m4", role: "manager", cat: "Compliance", title: "Health & Safety (COSHH, RIDDOR, Fire)", desc: "Risk assessments, COSHH regulations, RIDDOR reporting, fire safety protocols, and workplace safety audits.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "m5", role: "manager", cat: "Data", title: "Information Governance & GDPR", desc: "Data protection principles, Subject Access Requests, breach reporting, data retention, and Caldicott Guardian responsibilities.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 80 },
  { id: "m6", role: "manager", cat: "Operations", title: "Complaints Handling & Patient Experience", desc: "NHS complaint procedures, response timeframes, root cause analysis, and turning feedback into service improvement.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
  { id: "m7", role: "manager", cat: "Operations", title: "Workforce Planning & Rota Management", desc: "Skill-mix optimisation, holiday management, locum procurement, and staff-to-patient ratio planning.", cpd: 2, dur: "2 hrs", type: "Webinar", status: "optional", pct: 0 },
  { id: "m8", role: "manager", cat: "Finance", title: "NHS Contract Management & UDA Tracking", desc: "Understanding NHS dental contract types, UDA performance monitoring, clawback prevention, and contract negotiation.", cpd: 3, dur: "3 hrs", type: "Course", status: "recommended", pct: 0 },
  { id: "m9", role: "manager", cat: "Growth", title: "Practice Marketing & Patient Acquisition", desc: "Digital marketing, Google Business profile, patient referral programmes, social media strategy, and brand consistency.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "optional", pct: 30 },
  { id: "m10", role: "manager", cat: "Leadership", title: "Leadership & Team Development", desc: "Communication skills, conflict resolution, team motivation, change management, and clinical leadership principles.", cpd: 4, dur: "4 hrs", type: "Course", status: "recommended", pct: 0 },
  { id: "d1", role: "dentist", cat: "Emergency", title: "Medical Emergencies & CPR (Annual)", desc: "BLS/AED refresher, anaphylaxis management, drug dosages, oxygen administration, and emergency equipment checks.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
  { id: "d2", role: "dentist", cat: "Radiology", title: "Radiography & IRMER Regulations", desc: "Justification, optimisation, dose limitation, quality assurance, and IRMER practitioner/operator responsibilities.", cpd: 5, dur: "5 hrs", type: "E-Learning", status: "mandatory", pct: 60 },
  { id: "d3", role: "dentist", cat: "Infection Control", title: "Infection Prevention & Decontamination", desc: "HTM 01-05 compliance, instrument reprocessing, hand hygiene audit, PPE protocols, and water line management.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "d4", role: "dentist", cat: "Safeguarding", title: "Safeguarding Children & Vulnerable Adults", desc: "Recognising signs of abuse, referral pathways, Mental Capacity Act, Deprivation of Liberty, and professional responsibilities.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "d5", role: "dentist", cat: "Legal", title: "Consent, Record-Keeping & Ethics", desc: "Montgomery principles, valid consent processes, clinical note standards, GDC ethical framework, and fitness to practise.", cpd: 3, dur: "3 hrs", type: "Course", status: "mandatory", pct: 40 },
  { id: "d6", role: "dentist", cat: "Oral Medicine", title: "Oral Cancer Recognition & Referral", desc: "Two-week wait referral criteria, clinical examination techniques, risk factor assessment, and photographic documentation.", cpd: 2, dur: "2 hrs", type: "Masterclass", status: "recommended", pct: 0 },
  { id: "d7", role: "dentist", cat: "Sedation", title: "Conscious Sedation Updates", desc: "IACSD standards, patient assessment, monitoring protocols, recovery procedures, and emergency management during sedation.", cpd: 6, dur: "6 hrs", type: "Course", status: "recommended", pct: 0 },
  { id: "d8", role: "dentist", cat: "Restorative", title: "Advanced Restorative Techniques", desc: "New composite systems, ceramic bonding protocols, rubber dam mastery, and minimally invasive dentistry principles.", cpd: 4, dur: "4 hrs", type: "Masterclass", status: "recommended", pct: 0 },
  { id: "d9", role: "dentist", cat: "Digital", title: "Digital Dentistry (CAD/CAM, CBCT, Scanning)", desc: "iTero/3Shape workflows, CBCT interpretation, digital smile design, and same-day crown fabrication.", cpd: 6, dur: "6 hrs", type: "Practical", status: "recommended", pct: 25 },
  { id: "d10", role: "dentist", cat: "Implants", title: "Implantology Case Planning", desc: "Patient selection, radiographic assessment, surgical guide design, prosthetic planning, and managing complications.", cpd: 8, dur: "8 hrs", type: "Course", status: "optional", pct: 0 },
  { id: "d11", role: "dentist", cat: "Endodontics", title: "Endodontic Advances & Retreatment", desc: "Rotary NiTi systems, apex locators, obturation techniques, retreatment protocols, and managing procedural errors.", cpd: 4, dur: "4 hrs", type: "Masterclass", status: "recommended", pct: 0 },
  { id: "d12", role: "dentist", cat: "Prescribing", title: "Prescribing & Antimicrobial Stewardship", desc: "FGDP prescribing guidelines, antibiotic resistance awareness, appropriate prescribing for dental infections, and drug interactions.", cpd: 2, dur: "2 hrs", type: "E-Learning", status: "mandatory", pct: 0 },
  { id: "n1", role: "nurse", cat: "Core CPD", title: "Dental Nursing Core CPD", desc: "Radiography for dental nurses, fluoride varnish application, oral health education delivery, and extended duties framework.", cpd: 5, dur: "5 hrs", type: "E-Learning", status: "mandatory", pct: 70 },
  { id: "n2", role: "nurse", cat: "Emergency", title: "Medical Emergencies & BLS", desc: "Basic Life Support, AED operation, anaphylaxis protocol, managing fainting and seizures, and oxygen administration.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
  { id: "n3", role: "nurse", cat: "Infection Control", title: "Cross-Infection Control & Decontamination", desc: "Instrument decontamination cycles, autoclave validation, hand hygiene auditing, PPE donning/doffing, and waste segregation.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "n4", role: "nurse", cat: "Materials", title: "Dental Materials Handling & Mixing", desc: "Impression materials, composite handling, cement mixing ratios, temporary crown fabrication, and material storage.", cpd: 2, dur: "2 hrs", type: "Practical", status: "recommended", pct: 0 },
  { id: "n5", role: "nurse", cat: "Safeguarding", title: "Safeguarding & Mental Capacity", desc: "Recognising abuse indicators, referral procedures, Mental Capacity Act basics, Gillick competence, and Fraser guidelines.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "n6", role: "nurse", cat: "Patient Care", title: "Oral Health Education Delivery", desc: "Tailoring OHI for patients, motivational interviewing basics, dietary advice, interdental cleaning instruction, and child OHE.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 50 },
  { id: "n7", role: "nurse", cat: "Clinical Skills", title: "Dental Photography & Impressions", desc: "Intraoral photography techniques, shade matching, alginate impression best practice, and digital impression support.", cpd: 2, dur: "2 hrs", type: "Practical", status: "optional", pct: 0 },
  { id: "n8", role: "nurse", cat: "Operations", title: "Stock Control & Equipment Maintenance", desc: "Inventory management, expiry date tracking, equipment daily checks, handpiece maintenance, and ordering procedures.", cpd: 1, dur: "1 hr", type: "E-Learning", status: "recommended", pct: 0 },
  { id: "n9", role: "nurse", cat: "Patient Care", title: "Supporting Anxious & Phobic Patients", desc: "Anxiety management techniques, communication strategies, distraction methods, and supporting sedation procedures.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
  { id: "n10", role: "nurse", cat: "Extended Duties", title: "Extended Duties Training", desc: "Impression taking, fluoride varnish application, placing rubber dam, and taking radiographs under prescription.", cpd: 6, dur: "6 hrs", type: "Course", status: "optional", pct: 0 },
  { id: "h1", role: "hygienist", cat: "Periodontics", title: "Periodontal Assessment & Treatment Planning", desc: "BSP guidelines implementation, BPE screening, full periodontal charting, risk assessment, and treatment outcome evaluation.", cpd: 5, dur: "5 hrs", type: "Course", status: "mandatory", pct: 40 },
  { id: "h2", role: "hygienist", cat: "Clinical Skills", title: "Scaling & Root Surface Debridement", desc: "Ultrasonic and hand scaling techniques, subgingival instrumentation, sharpening protocols, and ergonomic positioning.", cpd: 4, dur: "4 hrs", type: "Practical", status: "mandatory", pct: 100 },
  { id: "h3", role: "hygienist", cat: "Patient Care", title: "Behaviour Change & Motivational Interviewing", desc: "Stages of change model, OARS techniques, shared decision-making, and sustained oral hygiene behaviour modification.", cpd: 3, dur: "3 hrs", type: "Workshop", status: "recommended", pct: 0 },
  { id: "h4", role: "hygienist", cat: "Emergency", title: "Medical Emergencies & BLS", desc: "Basic Life Support refresher, anaphylaxis management, drug dosages, and emergency kit checks.", cpd: 3, dur: "3 hrs", type: "Practical", status: "mandatory", pct: 0 },
  { id: "h5", role: "hygienist", cat: "Safeguarding", title: "Safeguarding & Vulnerable Patients", desc: "Safeguarding adults and children, domestic abuse recognition, referral pathways, and professional duty to report.", cpd: 3, dur: "3 hrs", type: "E-Learning", status: "mandatory", pct: 100 },
  { id: "h6", role: "hygienist", cat: "Implants", title: "Peri-Implant Disease Management", desc: "Peri-mucositis vs peri-implantitis, risk factors, non-surgical management, maintenance protocols, and implant-specific instrumentation.", cpd: 3, dur: "3 hrs", type: "Masterclass", status: "recommended", pct: 0 },
  { id: "h7", role: "hygienist", cat: "Prevention", title: "Fluoride Varnish & Fissure Sealants", desc: "Evidence-based fluoride application, Delivering Better Oral Health toolkit, sealant placement technique, and recall intervals.", cpd: 2, dur: "2 hrs", type: "E-Learning", status: "mandatory", pct: 80 },
  { id: "h8", role: "hygienist", cat: "Patient Care", title: "Smoking Cessation Counselling", desc: "Very Brief Advice model, NHS stop smoking referral, nicotine replacement options, and motivational strategies.", cpd: 2, dur: "2 hrs", type: "Workshop", status: "recommended", pct: 0 },
  { id: "h9", role: "hygienist", cat: "Anaesthesia", title: "Local Anaesthesia Updates", desc: "Technique refinements, inferior dental block alternatives, articaine evidence, and managing complications.", cpd: 3, dur: "3 hrs", type: "Practical", status: "recommended", pct: 0 },
  { id: "h10", role: "hygienist", cat: "Restorative", title: "Direct Restorations (Therapists)", desc: "Class I-V composite restorations, ART technique, pulp protection decisions, and paediatric restorations.", cpd: 6, dur: "6 hrs", type: "Course", status: "optional", pct: 0 },
];

/* ─── Internal Inspire Dental modules ──────────────────────────────────────── */
const internalModules = [
  { id: "i1", title: "Inspire Dental Group Induction",        cat: "Onboarding",  dur: "45 min", cpd: 0, desc: "Practice values, team structure, facilities walkthrough, key contacts, and what to expect in your first weeks at Inspire.", roles: "all",                      updatedAt: "Jan 2026" },
  { id: "i2", title: "Practice Management System",   cat: "Systems",     dur: "30 min", cpd: 0, desc: "Full walkthrough of your practice management system — patient records, appointment scheduling, charting, NHS FP17 submission, and reporting dashboards.", roles: "all",              updatedAt: "Feb 2026" },
  { id: "i3", title: "Patient Journey & Service Standards",   cat: "Patient Care",dur: "25 min", cpd: 0, desc: "Our 5-star patient journey from first contact to recall. Communication standards, greeting protocols, and the Inspire experience.", roles: "all",              updatedAt: "Jan 2026" },
  { id: "i4", title: "Inspire Infection Control Protocol",    cat: "Compliance",  dur: "20 min", cpd: 1, desc: "Practice-specific decontamination workflows, zone maps, PPE station locations, and HTM 01-05 implementation at Inspire.", roles: "dentist,nurse,hygienist", isNew: true, updatedAt: "Mar 2026" },
  { id: "i5", title: "Emergency Procedures at Inspire",       cat: "Safety",      dur: "15 min", cpd: 0, desc: "Emergency drug kit and AED locations, fire evacuation plan, first aid contacts, and incident escalation procedures for this practice.", roles: "all",          updatedAt: "Jan 2026" },
  { id: "i6", title: "Complaint Handling at Inspire",         cat: "Operations",  dur: "20 min", cpd: 0, desc: "Our complaint procedure — intake, investigation, response timeline, and using patient feedback to drive service improvement.", roles: "all",                  updatedAt: "Feb 2026" },
  { id: "i7", title: "NHS & Private Fee Collection",          cat: "Finance",     dur: "20 min", cpd: 0, desc: "Charging bands, exemption verification, card terminal operation, handling payment queries, and end-of-day reconciliation.", roles: "receptionist,manager",     updatedAt: "Jan 2026" },
  { id: "i8", title: "Stock Control & Ordering at Inspire",   cat: "Operations",  dur: "15 min", cpd: 0, desc: "Inventory par levels, ordering from approved suppliers, expiry date checks, and the stock request process at Inspire.", roles: "nurse,manager",                updatedAt: "Jan 2026" },
];

/* ─── How To video series ─────────────────────────────────────────────────── */
const GTV = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const howToVideos = [
  { id: "ht1",  title: "How to Set Up a Dental Surgery",              dur: "3 min",  cat: "Clinical",              roles: "nurse,dentist",          color: "#006974", videoSrc: `${GTV}ForBiggerBlazes.mp4`              },
  { id: "ht2",  title: "How to Process Instruments (HTM 01-05)",      dur: "5 min",  cat: "Decontamination",       roles: "nurse,dentist",          color: "#005c66", videoSrc: `${GTV}ForBiggerEscapes.mp4`             },
  { id: "ht3",  title: "How to Take a BPE Score",                     dur: "2 min",  cat: "Clinical",              roles: "dentist,hygienist",      color: "#006974", videoSrc: `${GTV}ForBiggerFun.mp4`                 },
  { id: "ht4",  title: "How to Book an NHS Appointment",               dur: "3 min",  cat: "Reception",             roles: "receptionist,manager",   color: "#6A1B9A", videoSrc: `${GTV}ForBiggerJoyrides.mp4`            },
  { id: "ht5",  title: "How to Submit an FP17 Form",                   dur: "4 min",  cat: "NHS Admin",             roles: "receptionist,manager",   color: "#7B1FA2", videoSrc: `${GTV}ForBiggerMeltdowns.mp4`           },
  { id: "ht6",  title: "How to Handle a Medical Emergency",            dur: "4 min",  cat: "Emergency",             roles: "all",                    color: "#C62828", videoSrc: `${GTV}BigBuckBunny.mp4`                 },
  { id: "ht7",  title: "How to Maintain Dental Handpieces",            dur: "3 min",  cat: "Equipment",             roles: "nurse",                  color: "#1565C0", videoSrc: `${GTV}ElephantsDream.mp4`               },
  { id: "ht8",  title: "How to Take an Alginate Impression",           dur: "4 min",  cat: "Clinical",              roles: "nurse,dentist",          color: "#00695C", videoSrc: `${GTV}SubaruOutbackOnStreetAndDirt.mp4` },
  { id: "ht9",  title: "How to Conduct a Periapical Radiograph",       dur: "5 min",  cat: "Radiology",             roles: "nurse,dentist",          color: "#2E7D32", videoSrc: `${GTV}TearsOfSteel.mp4`                 },
  { id: "ht10", title: "How to Give Oral Hygiene Instruction",         dur: "3 min",  cat: "Prevention",            roles: "hygienist,nurse",        color: "#1B5E20", videoSrc: `${GTV}VolkswagenGTIReview.mp4`          },
  { id: "ht11", title: "How to Use the CQC Evidence Folder",           dur: "4 min",  cat: "Compliance",            roles: "manager",                color: "#E65100", videoSrc: `${GTV}WeAreGoingOnBullrun.mp4`          },
  { id: "ht12", title: "How to Complete a Daily Autoclave Check",      dur: "2 min",  cat: "Decontamination",       roles: "nurse,dentist",          color: "#BF360C", videoSrc: `${GTV}WhatCarCanDo.mp4`                 },
  { id: "ht13", title: "How to Recognise Signs of Abuse in Patients",  dur: "4 min",  cat: "Safeguarding",          roles: "all",                    color: "#AD1457", videoSrc: `${GTV}ForBiggerBlazes.mp4`              },
  { id: "ht14", title: "How to Make a Safeguarding Referral",          dur: "3 min",  cat: "Safeguarding",          roles: "all",                    color: "#880E4F", videoSrc: `${GTV}ForBiggerEscapes.mp4`             },
  { id: "ht15", title: "How to Handle a Patient Complaint",            dur: "4 min",  cat: "Patient Communication", roles: "all",                    color: "#1565C0", videoSrc: `${GTV}ForBiggerFun.mp4`                 },
  { id: "ht16", title: "How to Obtain Valid Patient Consent",          dur: "3 min",  cat: "Patient Communication", roles: "dentist,hygienist,nurse", color: "#0D47A1", videoSrc: `${GTV}ForBiggerJoyrides.mp4`            },
];

const statusColors = {
  mandatory: "var(--error)",
  recommended: "var(--primary)",
  optional: "var(--outline)",
  internal: "#9C27B0",
  howto: "#E91E63",
};

const typeColors = {
  Course: "var(--primary)",
  "E-Learning": "var(--success)",
  Workshop: "var(--warning)",
  Masterclass: "#9C27B0",
  Practical: "#E91E63",
  Webinar: "var(--secondary)",
};

const skillCardGradients = [
  "linear-gradient(135deg, #006974 0%, #004d55 100%)",
  "linear-gradient(135deg, #005c66 0%, #003d44 100%)",
  "linear-gradient(135deg, #007a88 0%, #005c66 100%)",
];

const typeIcons = { video: "play", interactive: "monitor", reading: "book" };

const getModuleContent = (m) => {
  if (moduleContent[m.id]) return moduleContent[m.id];
  return {
    lessons: [
      { title: "Introduction & Learning Objectives", dur: "10 min", type: "video", desc: `Overview of ${m.title} — key topics, learning outcomes, and how this module contributes to your CPD.` },
      { title: "Core Theory & Principles", dur: "20 min", type: "video", desc: `Essential knowledge and evidence base underpinning ${m.cat.toLowerCase()} practice in the dental setting.` },
      { title: "Practical Application", dur: "25 min", type: "interactive", desc: `Hands-on scenarios and case studies applying ${m.title.toLowerCase()} concepts to real clinical situations.` },
      { title: "Guidelines & Standards", dur: "15 min", type: "reading", desc: `Relevant GDC, CQC, and professional body standards that relate to ${m.cat.toLowerCase()}.` },
      { title: "Reflection & Action Planning", dur: "10 min", type: "reading", desc: "Reflective practice exercise and personal action plan to embed learning into your daily practice." },
    ],
    quiz: [
      { q: `What is the primary learning objective of ${m.title}?`, options: ["Compliance only", "Clinical skill development", "Both compliance and clinical development", "Administrative efficiency"], correct: 2 },
      { q: "How should you apply the learning from this module?", options: ["Only during inspections", "In daily practice", "Only when supervised", "Only for new patients"], correct: 1 },
      { q: "How often should this training be refreshed?", options: ["Never", "Every 5 years", "As per GDC/CQC guidance", "Only if requested"], correct: 2 },
    ],
  };
};

/* ─── Module viewer (full-screen) ─── */
const ModuleViewer = ({ activeModule, onClose }) => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const content = getModuleContent(activeModule);
  const lesson = content.lessons[activeLesson];
  const totalLessons = content.lessons.length;
  const lessonPct = Math.round(((activeLesson + 1) / totalLessons) * 100);
  const allAnswered = Object.keys(quizAnswers).length === content.quiz.length;
  const allCorrect = content.quiz.every((q, i) => quizAnswers[i] === q.correct);

  const startQuiz = () => {
    setQuizMode(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div>
      <div className={styles.viewerNav}>
        <div className={styles.viewerBack}>
          <div onClick={onClose} className={styles.viewerBackBtn}>
            <I name="arrow" size={16} color="var(--on-surface)" />
          </div>
          <div>
            <p className={styles.viewerCategory}>
              {activeModule.cat} • {activeModule.type}
            </p>
            <h2 className={styles.viewerTitle}>{activeModule.title}</h2>
          </div>
        </div>
        <div className={styles.viewerMeta}>
          <div className={styles.viewerProgressBlock}>
            <span className={styles.viewerProgressLabel}>Progress</span>
            <div className={styles.viewerProgressInner}>
              <div className={styles.viewerProgressBar}>
                <ProgressBar pct={quizSubmitted ? 100 : lessonPct} h={4} />
              </div>
              <span className={styles.viewerProgressValue}>
                {quizSubmitted ? 100 : lessonPct}%
              </span>
            </div>
          </div>
          <Pill bg="rgba(0,105,116,0.07)" color="var(--primary)">
            {activeModule.cpd} CPD hrs
          </Pill>
        </div>
      </div>

      <div className={styles.viewerLayout}>
        <div>
          {!quizMode ? (
            <>
              <div className={styles.player}>
                <div className={styles.playerBlobA} />
                <div className={styles.playerBlobB} />
                <div className={styles.playerPlay}>
                  <I name={typeIcons[lesson.type] || "play"} size={28} color="white" />
                </div>
                <span className={styles.playerLabel}>
                  {lesson.type === "video"
                    ? "Click to play video"
                    : lesson.type === "interactive"
                    ? "Interactive Exercise"
                    : "Reading Material"}
                </span>
                <span className={styles.playerDuration}>{lesson.dur}</span>
                <div className={styles.playerProgress}>
                  <div className={styles.playerProgressFill} />
                </div>
              </div>

              <Card hover={false} className={styles.lessonCard}>
                <div className={styles.lessonHeader}>
                  <div>
                    <Pill bg="rgba(0,105,116,0.07)" color="var(--primary)" small>
                      Lesson {activeLesson + 1} of {totalLessons}
                    </Pill>
                    <h3 className={styles.lessonTitle}>{lesson.title}</h3>
                  </div>
                  <div className={styles.lessonDuration}>
                    <I name="clock" size={14} />
                    <span className={styles.lessonDurationText}>{lesson.dur}</span>
                  </div>
                </div>
                <p className={styles.lessonDesc}>{lesson.desc}</p>
              </Card>

              <div className={styles.lessonNav}>
                <BtnSecondary
                  onClick={() => activeLesson > 0 && setActiveLesson(activeLesson - 1)}
                  style={{ opacity: activeLesson === 0 ? 0.4 : 1, padding: "10px 20px", fontSize: 12 }}
                >
                  ← Previous Lesson
                </BtnSecondary>
                {activeLesson < totalLessons - 1 ? (
                  <BtnPrimary
                    onClick={() => setActiveLesson(activeLesson + 1)}
                    style={{ padding: "10px 20px", fontSize: 12 }}
                  >
                    Next Lesson <I name="arrow" size={14} />
                  </BtnPrimary>
                ) : (
                  <BtnPrimary onClick={startQuiz} style={{ padding: "10px 20px", fontSize: 12 }}>
                    Take Assessment <I name="award" size={14} />
                  </BtnPrimary>
                )}
              </div>
            </>
          ) : (
            <Card hover={false} className={styles.quizCard}>
              <div className={styles.quizHeader}>
                <div className={styles.quizIcon}>
                  <I name="award" size={22} color="var(--primary)" />
                </div>
                <div>
                  <h3 className={styles.quizTitle}>Knowledge Assessment</h3>
                  <p className={styles.quizSubtitle}>
                    {content.quiz.length} questions • Pass mark: 100%
                  </p>
                </div>
              </div>

              {content.quiz.map((question, qi) => {
                const isCorrect = quizAnswers[qi] === question.correct;
                let blockClass = styles.questionBlock;
                if (quizSubmitted) {
                  blockClass += isCorrect
                    ? ` ${styles.questionBlockCorrect}`
                    : ` ${styles.questionBlockWrong}`;
                }
                return (
                  <div key={qi} className={blockClass}>
                    <p className={styles.questionText}>{qi + 1}. {question.q}</p>
                    <div className={styles.optionList}>
                      {question.options.map((opt, oi) => {
                        const selected = quizAnswers[qi] === oi;
                        const showCorrect = quizSubmitted && oi === question.correct;
                        const showWrong = quizSubmitted && selected && !isCorrect;

                        let optClass = styles.option;
                        if (showCorrect) optClass += ` ${styles.optionCorrect}`;
                        else if (showWrong) optClass += ` ${styles.optionWrong}`;
                        else if (selected) optClass += ` ${styles.optionSelected}`;
                        if (quizSubmitted) optClass += ` ${styles.optionLocked}`;

                        let radioClass = styles.optionRadio;
                        if (showCorrect) radioClass += ` ${styles.optionRadioCorrect}`;
                        else if (showWrong) radioClass += ` ${styles.optionRadioWrong}`;
                        else if (selected) radioClass += ` ${styles.optionRadioFilled}`;

                        return (
                          <div
                            key={oi}
                            onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                            className={optClass}
                          >
                            <div className={radioClass}>
                              {(selected || showCorrect) && (
                                <I name={showWrong ? "xcircle" : "check"} size={12} color="white" />
                              )}
                            </div>
                            <span className={styles.optionText}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <BtnPrimary
                  onClick={() => allAnswered && setQuizSubmitted(true)}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px 24px",
                    opacity: allAnswered ? 1 : 0.5,
                  }}
                >
                  Submit Assessment ({Object.keys(quizAnswers).length}/{content.quiz.length} answered)
                </BtnPrimary>
              ) : (
                <div className={styles.quizResult}>
                  {allCorrect ? (
                    <div>
                      <div className={`${styles.quizResultIcon} ${styles.quizResultIconPass}`}>
                        <I name="checkcircle" size={36} color="var(--success)" />
                      </div>
                      <h4 className={styles.quizResultTitle} style={{ color: "var(--success)" }}>
                        Assessment Passed!
                      </h4>
                      <p className={styles.quizResultSub}>
                        {activeModule.cpd} CPD hours have been logged to your record.
                      </p>
                      <BtnPrimary onClick={onClose} style={{ marginTop: 16 }}>
                        Return to Training Hub <I name="arrow" size={14} />
                      </BtnPrimary>
                    </div>
                  ) : (
                    <div>
                      <div className={`${styles.quizResultIcon} ${styles.quizResultIconFail}`}>
                        <I name="xcircle" size={36} color="var(--error)" />
                      </div>
                      <h4 className={styles.quizResultTitle} style={{ color: "var(--error)" }}>
                        Not Quite — Review & Retry
                      </h4>
                      <p className={styles.quizResultSub}>
                        Review the correct answers above, then try again.
                      </p>
                      <BtnPrimary
                        onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                        style={{ marginTop: 16 }}
                      >
                        Retry Assessment
                      </BtnPrimary>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        <div>
          <Card hover={false} className={styles.outlineCard}>
            <h4 className={styles.outlineTitle}>Lesson Outline</h4>
            <div className={styles.outlineList}>
              {content.lessons.map((l, li) => {
                const isCurrent = li === activeLesson && !quizMode;
                const isCompleted = li < activeLesson || quizMode;
                let badgeClass = styles.outlineBadge;
                if (isCompleted) badgeClass += ` ${styles.outlineBadgeDone}`;
                else if (isCurrent) badgeClass += ` ${styles.outlineBadgeCurrent}`;

                return (
                  <div
                    key={li}
                    onClick={() => { setActiveLesson(li); setQuizMode(false); }}
                    className={isCurrent ? `${styles.outlineRow} ${styles.outlineRowCurrent}` : styles.outlineRow}
                  >
                    <div className={badgeClass}>
                      {isCompleted ? (
                        <I name="check" size={12} color="white" />
                      ) : (
                        <span className={styles.outlineBadgeText}>{li + 1}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.outlineLessonTitle}>{l.title}</div>
                      <div className={styles.outlineLessonMeta}>{l.dur} • {l.type}</div>
                    </div>
                  </div>
                );
              })}

              <div
                onClick={() => setQuizMode(true)}
                className={
                  quizMode
                    ? `${styles.outlineRow} ${styles.outlineRowCurrent} ${styles.outlineQuizRow}`
                    : `${styles.outlineRow} ${styles.outlineQuizRow}`
                }
              >
                <div
                  className={
                    quizSubmitted
                      ? `${styles.outlineBadge} ${styles.outlineBadgeDone}`
                      : quizMode
                      ? `${styles.outlineBadge} ${styles.outlineBadgeCurrent}`
                      : styles.outlineBadge
                  }
                >
                  {quizSubmitted ? (
                    <I name="check" size={12} color="white" />
                  ) : (
                    <I name="award" size={12} color={quizMode ? "white" : "var(--outline)"} />
                  )}
                </div>
                <div>
                  <div className={styles.outlineLessonTitle}>Assessment</div>
                  <div className={styles.outlineLessonMeta}>{content.quiz.length} questions</div>
                </div>
              </div>
            </div>
          </Card>

          <Card hover={false} className={styles.moduleInfoCard}>
            <h4 className={styles.outlineTitle}>Module Info</h4>
            {[
              { label: "CPD Hours", value: `${activeModule.cpd} verifiable hours`, icon: "award" },
              { label: "Duration", value: activeModule.dur, icon: "clock" },
              { label: "Type", value: activeModule.type, icon: "play" },
              { label: "Category", value: activeModule.cat, icon: "folder" },
              { label: "Priority", value: activeModule.status, icon: "shield" },
            ].map((info) => (
              <div key={info.label} className={styles.moduleInfoRow}>
                <I name={info.icon} size={14} color="var(--outline)" />
                <div>
                  <span className={styles.moduleInfoLabel}>{info.label}</span>
                  <div className={styles.moduleInfoValue}>{info.value}</div>
                </div>
              </div>
            ))}
          </Card>

          <BtnSecondary onClick={() => {}} style={{ width: "100%", justifyContent: "center", marginBottom: 8, fontSize: 12 }}>
            <I name="download" size={14} /> Download Resources
          </BtnSecondary>
          <BtnSecondary onClick={() => {}} style={{ width: "100%", justifyContent: "center", fontSize: 12 }}>
            <I name="bookmark" size={14} /> Save for Later
          </BtnSecondary>
        </div>
      </div>
    </div>
  );
};

/* ─── Internal module card ───────────────────────────────────────────────────── */
const InternalCard = ({ module: m, onLaunch }) => {
  const handleClick = () => {
    if (m.url) window.open(m.url, "_blank", "noopener,noreferrer");
    else onLaunch({ ...m, type: "Internal", status: "internal" });
  };
  return (
    <div className={styles.internalCard} onClick={handleClick}>
      <div className={styles.internalCardAccent} />
      <div className={styles.internalCardBody}>
        <div className={styles.internalCardTop}>
          <Pill bg="rgba(156,39,176,0.09)" color="#9C27B0" small>{m.cat}</Pill>
          {m.isNew && <Pill bg="rgba(0,105,116,0.09)" color="var(--primary)" small>New</Pill>}
          {m.isUserAdded
            ? <Pill bg="rgba(233,30,99,0.09)" color="#E91E63" small>Uploaded</Pill>
            : <Pill bg="rgba(0,0,0,0.05)" color="var(--on-surface-variant)" small>Sample</Pill>
          }
        </div>
        <h4 className={styles.internalCardTitle}>{m.title}</h4>
        <p className={styles.internalCardDesc}>{m.desc}</p>
        <div className={styles.internalCardFooter}>
          <span className={styles.internalCardMeta}>
            <I name="clock" size={12} color="var(--outline)" /> {m.dur}
            {m.cpd > 0 && <> · <I name="award" size={12} color="var(--outline)" /> {m.cpd} CPD hr</>}
          </span>
          <span className={styles.internalCardUpdated}>Updated {m.updatedAt}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── How To video modal ───────────────────────────────────────────────────────── */
const HowToVideoModal = ({ video: v, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const src = v.url || v.videoSrc;

  return (
    <div className={styles.htPlayerBackdrop} onClick={onClose}>
      <div className={styles.htPlayerInner} onClick={e => e.stopPropagation()}>
        <div className={styles.htPlayerHeader}>
          <div>
            <div className={styles.htPlayerMeta}>{v.cat} · {v.dur}</div>
            <div className={styles.htPlayerTitle}>{v.title}</div>
          </div>
          <button className={styles.htPlayerClose} onClick={onClose}>
            <I name="xcircle" size={22} color="var(--on-surface-variant)" />
          </button>
        </div>
        <video className={styles.htPlayerVideo} src={src} controls autoPlay />
      </div>
    </div>
  );
};

/* ─── How To card ─────────────────────────────────────────────────────────────── */
const HowToCard = ({ video: v, onPlay }) => (
  <div className={styles.howToCard} onClick={() => onPlay(v)}>
    <div className={styles.howToThumb} style={{ background: v.color }}>
      <div className={styles.howToPlay}>
        <I name="play" size={16} color="white" />
      </div>
      {!v.isUserAdded && <span className={styles.howToSampleBadge}>Sample</span>}
      <span className={styles.howToDur}>{v.dur}</span>
    </div>
    <div className={styles.howToBody}>
      <span className={styles.howToCat}>{v.cat}</span>
      <p className={styles.howToTitle}>{v.title}</p>
    </div>
  </div>
);

/* ─── Color palette for How To thumbnails ────────────────────────────────────── */
const CAT_COLORS = {
  Clinical: "#006974", Decontamination: "#005c66", Periodontics: "#007a88",
  Reception: "#6A1B9A", "NHS Admin": "#7B1FA2", Emergency: "#C62828",
  Equipment: "#1565C0", Radiology: "#2E7D32", Prevention: "#1B5E20",
  Compliance: "#E65100", Operations: "#BF360C", Safeguarding: "#AD1457",
  "Patient Communication": "#1565C0", Leadership: "#4527A0", Finance: "#00695C",
};
const FALLBACK_COLORS = ["#006974","#9C27B0","#1565C0","#2E7D32","#E65100","#C62828"];
const pickColor = cat => CAT_COLORS[cat] || FALLBACK_COLORS[cat.length % FALLBACK_COLORS.length];

/* ─── Upload Training Module modal ──────────────────────────────────────────── */
const INTERNAL_CATS = ["Compliance", "Onboarding", "Operations", "Patient Care", "Safety", "Systems"];

const AddTrainingModal = ({ onClose, onAdd, existingCats }) => {
  const [title,     setTitle]     = useState("");
  const [cat,       setCat]       = useState("");
  const [customCat, setCustomCat] = useState("");
  const [dur,       setDur]       = useState("");
  const [desc,      setDesc]      = useState("");
  const [cpd,       setCpd]       = useState("0");
  const [audience,  setAudience]  = useState("all");
  const [errors,    setErrors]    = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [dragOver,  setDragOver]  = useState(false);
  const fileInputRef = useRef(null);

  const allCats = [...new Set([...INTERNAL_CATS, ...existingCats])].sort();
  const finalCat = cat === "__new__" ? customCat.trim() : cat;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    setVideoFile(file);
    setErrors(p => ({ ...p, file: "" }));
    const vid = document.createElement("video");
    vid.preload = "metadata";
    const objUrl = URL.createObjectURL(file);
    vid.src = objUrl;
    vid.onloadedmetadata = () => {
      const secs = Math.round(vid.duration);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setDur(s > 0 ? `${m}:${String(s).padStart(2, "0")} min` : `${m} min`);
      URL.revokeObjectURL(objUrl);
    };
    if (!title.trim()) {
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    setDur("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Required";
    if (!finalCat)     e.cat   = "Select or enter a category";
    if (!videoFile)    e.file  = "Please select a video file to upload";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const objectUrl = URL.createObjectURL(videoFile);
    const now = new Date();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    onAdd({
      id:          `int-user-${Date.now()}`,
      title:       title.trim(),
      cat:         finalCat,
      dur:         dur.trim() || "—",
      desc:        desc.trim() || "Uploaded training module.",
      cpd:         parseFloat(cpd) || 0,
      roles:       audience,
      url:         objectUrl,
      isUserAdded: true,
      updatedAt:   `${months[now.getMonth()]} ${now.getFullYear()}`,
      fileName:    videoFile.name,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.htModal} onClick={e => e.stopPropagation()}>
        <div className={styles.htModalHeader}>
          <div>
            <h3 className={styles.htModalTitle}>Upload Training Module</h3>
            <p className={styles.htModalSub}>Record your training content and upload it — it appears in the Inspire Dental Training grid immediately</p>
          </div>
          <button className={styles.htModalClose} onClick={onClose}>
            <I name="xcircle" size={20} color="var(--on-surface-variant)" />
          </button>
        </div>

        <div className={styles.htModalBody}>
          <div className={styles.htFormGrid}>

            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Video File *</label>
              <div
                className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ""} ${errors.file ? styles.uploadZoneErr : ""} ${videoFile ? styles.uploadZoneFilled : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
                {videoFile ? (
                  <div className={styles.uploadFilled}>
                    <I name="checkcircle" size={22} color="#4CAF50" />
                    <div className={styles.uploadFileInfo}>
                      <div className={styles.uploadFileName}>{videoFile.name}</div>
                      <div className={styles.uploadFileMeta}>
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB{dur ? ` · ${dur}` : ""}
                      </div>
                    </div>
                    <button className={styles.uploadChangeBtn} onClick={clearFile}>Change</button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <div className={styles.uploadIconPurple}>
                      <I name="upload" size={24} color="#9C27B0" />
                    </div>
                    <span className={styles.uploadPromptText}>Tap to select video or drag & drop</span>
                    <span className={styles.uploadPromptSub}>MP4, MOV, AVI · Recorded on phone or any device</span>
                  </div>
                )}
              </div>
              {errors.file && <span className={styles.htFieldErr}>{errors.file}</span>}
            </div>

            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Module Title *</label>
              <input
                className={`${styles.htFieldInput} ${errors.title ? styles.htFieldInputErr : ""}`}
                placeholder="e.g. New Patient Consultation Workflow"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
              />
              {errors.title && <span className={styles.htFieldErr}>{errors.title}</span>}
            </div>

            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Description</label>
              <textarea
                className={`${styles.htFieldInput} ${styles.htFieldTextarea}`}
                placeholder="Briefly describe what this module covers…"
                value={desc}
                rows={3}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>Category *</label>
              <select
                className={`${styles.htFieldSelect} ${errors.cat ? styles.htFieldInputErr : ""}`}
                value={cat}
                onChange={e => { setCat(e.target.value); setErrors(p => ({ ...p, cat: "" })); }}
              >
                <option value="">Select category…</option>
                {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__new__">+ Add new category</option>
              </select>
              {cat === "__new__" && (
                <input
                  className={`${styles.htFieldInput} ${errors.cat ? styles.htFieldInputErr : ""}`}
                  placeholder="New category name"
                  value={customCat}
                  onChange={e => { setCustomCat(e.target.value); setErrors(p => ({ ...p, cat: "" })); }}
                  style={{ marginTop: 6 }}
                />
              )}
              {errors.cat && <span className={styles.htFieldErr}>{errors.cat}</span>}
            </div>

            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>Duration</label>
              <input
                className={styles.htFieldInput}
                placeholder="Auto-detected on upload"
                value={dur}
                onChange={e => setDur(e.target.value)}
              />
            </div>

            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>CPD Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                className={styles.htFieldInput}
                placeholder="0"
                value={cpd}
                onChange={e => setCpd(e.target.value)}
              />
            </div>

            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>Target Audience</label>
              <select className={styles.htFieldSelect} value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="all">All Staff</option>
                <option value="dentist">Dentists</option>
                <option value="nurse">Dental Nurses</option>
                <option value="hygienist">Hygienists</option>
                <option value="manager">Practice Managers</option>
                <option value="receptionist">Receptionists</option>
              </select>
            </div>

          </div>
        </div>

        <div className={styles.htModalFooter}>
          <BtnSecondary onClick={onClose} style={{ padding: "10px 20px", fontSize: 13 }}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleAdd} style={{ padding: "10px 24px", fontSize: 13 }}>
            <I name="upload" size={14} /> Upload Module
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ─── Add How To Video modal ─────────────────────────────────────────────────── */
const AddHowToModal = ({ onClose, onAdd, existingCats }) => {
  const [title,     setTitle]     = useState("");
  const [cat,       setCat]       = useState("");
  const [customCat, setCustomCat] = useState("");
  const [dur,       setDur]       = useState("");
  const [audience,  setAudience]  = useState("all");
  const [errors,    setErrors]    = useState({});
  const [videoFile, setVideoFile] = useState(null);
  const [dragOver,  setDragOver]  = useState(false);
  const fileInputRef = useRef(null);

  const finalCat = cat === "__new__" ? customCat.trim() : cat;

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("video/")) return;
    setVideoFile(file);
    setErrors(p => ({ ...p, file: "" }));
    // Auto-detect duration from video metadata
    const vid = document.createElement("video");
    vid.preload = "metadata";
    const objUrl = URL.createObjectURL(file);
    vid.src = objUrl;
    vid.onloadedmetadata = () => {
      const secs = Math.round(vid.duration);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      setDur(s > 0 ? `${m}:${String(s).padStart(2, "0")} min` : `${m} min`);
      URL.revokeObjectURL(objUrl);
    };
    // Auto-fill title from filename if still empty
    if (!title.trim()) {
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Required";
    if (!finalCat)     e.cat   = "Select or enter a category";
    if (!videoFile)    e.file  = "Please select a video file to upload";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const objectUrl = URL.createObjectURL(videoFile);
    onAdd({
      id:          `ht-user-${Date.now()}`,
      title:       title.trim(),
      cat:         finalCat,
      dur:         dur.trim() || "—",
      url:         objectUrl,
      audience,
      color:       pickColor(finalCat),
      isUserAdded: true,
      fileName:    videoFile.name,
      fileSize:    videoFile.size,
    });
    onClose();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setVideoFile(null);
    setDur("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.htModal} onClick={e => e.stopPropagation()}>
        <div className={styles.htModalHeader}>
          <div>
            <h3 className={styles.htModalTitle}>Upload How To Video</h3>
            <p className={styles.htModalSub}>Record on your phone and upload directly — it will appear in the grid and be searchable straight away</p>
          </div>
          <button className={styles.htModalClose} onClick={onClose}>
            <I name="xcircle" size={20} color="var(--on-surface-variant)" />
          </button>
        </div>

        <div className={styles.htModalBody}>
          <div className={styles.htFormGrid}>

            {/* Upload zone */}
            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Video File *</label>
              <div
                className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ""} ${errors.file ? styles.uploadZoneErr : ""} ${videoFile ? styles.uploadZoneFilled : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
                {videoFile ? (
                  <div className={styles.uploadFilled}>
                    <I name="checkcircle" size={22} color="#4CAF50" />
                    <div className={styles.uploadFileInfo}>
                      <div className={styles.uploadFileName}>{videoFile.name}</div>
                      <div className={styles.uploadFileMeta}>
                        {(videoFile.size / (1024 * 1024)).toFixed(1)} MB{dur ? ` · ${dur}` : ""}
                      </div>
                    </div>
                    <button className={styles.uploadChangeBtn} onClick={clearFile}>Change</button>
                  </div>
                ) : (
                  <div className={styles.uploadPrompt}>
                    <div className={styles.uploadIcon}>
                      <I name="upload" size={24} color="#E91E63" />
                    </div>
                    <span className={styles.uploadPromptText}>Tap to select video or drag & drop</span>
                    <span className={styles.uploadPromptSub}>MP4, MOV, AVI · Recorded on phone or any device</span>
                  </div>
                )}
              </div>
              {errors.file && <span className={styles.htFieldErr}>{errors.file}</span>}
            </div>

            {/* Title */}
            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Video Title *</label>
              <input
                className={`${styles.htFieldInput} ${errors.title ? styles.htFieldInputErr : ""}`}
                placeholder="e.g. How to set up the dental chair"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
              />
              {errors.title && <span className={styles.htFieldErr}>{errors.title}</span>}
            </div>

            {/* Category */}
            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>Category *</label>
              <select
                className={`${styles.htFieldSelect} ${errors.cat ? styles.htFieldInputErr : ""}`}
                value={cat}
                onChange={e => { setCat(e.target.value); setErrors(p => ({ ...p, cat: "" })); }}
              >
                <option value="">Select category…</option>
                {existingCats.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="__new__">+ Add new category</option>
              </select>
              {cat === "__new__" && (
                <input
                  className={`${styles.htFieldInput} ${errors.cat ? styles.htFieldInputErr : ""}`}
                  placeholder="New category name"
                  value={customCat}
                  onChange={e => { setCustomCat(e.target.value); setErrors(p => ({ ...p, cat: "" })); }}
                  style={{ marginTop: 6 }}
                />
              )}
              {errors.cat && <span className={styles.htFieldErr}>{errors.cat}</span>}
            </div>

            {/* Duration (auto-filled but editable) */}
            <div className={styles.htField}>
              <label className={styles.htFieldLabel}>Duration</label>
              <input
                className={styles.htFieldInput}
                placeholder="Auto-detected on upload"
                value={dur}
                onChange={e => setDur(e.target.value)}
              />
            </div>

            {/* Audience */}
            <div className={styles.htFieldFull}>
              <label className={styles.htFieldLabel}>Target Audience</label>
              <select className={styles.htFieldSelect} value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="all">All Staff</option>
                <option value="dentist">Dentists</option>
                <option value="nurse">Dental Nurses</option>
                <option value="hygienist">Hygienists</option>
                <option value="manager">Practice Managers</option>
                <option value="receptionist">Receptionists</option>
              </select>
            </div>

          </div>
        </div>

        <div className={styles.htModalFooter}>
          <BtnSecondary onClick={onClose} style={{ padding: "10px 20px", fontSize: 13 }}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleAdd} style={{ padding: "10px 24px", fontSize: 13 }}>
            <I name="upload" size={14} /> Upload to Series
          </BtnPrimary>
        </div>
      </div>
    </div>
  );
};

/* ─── Main hub ─── */
export const TrainingPage = ({ currentUser }) => {
  const [searchQuery,    setSearchQuery]    = useState("");
  const [activeModule,   setActiveModule]   = useState(null);
  const [playingHowTo,   setPlayingHowTo]   = useState(null);
  const [userInternalModules, setUserInternalModules] = useState([]);
  const [showAddTraining,     setShowAddTraining]     = useState(false);
  const [userHowTos,          setUserHowTos]          = useState([]);
  const [showAddHowTo,        setShowAddHowTo]        = useState(false);
  const [howToCategory,       setHowToCategory]       = useState("All");
  const [howToSearch,         setHowToSearch]         = useState("");

  const allInternalModules = useMemo(() => [...internalModules, ...userInternalModules], [userInternalModules]);
  const allHowToVideos = useMemo(() => [...howToVideos, ...userHowTos], [userHowTos]);
  const howToCats = useMemo(() => {
    const cats = [...new Set(allHowToVideos.map(v => v.cat))].sort();
    return ["All", ...cats];
  }, [allHowToVideos]);
  const visibleHowTos = useMemo(() => {
    let vids = howToCategory === "All"
      ? allHowToVideos
      : allHowToVideos.filter(v => v.cat === howToCategory);
    const q = howToSearch.trim().toLowerCase();
    if (q) vids = vids.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.cat.toLowerCase().includes(q) ||
      v.roles.toLowerCase().includes(q)
    );
    return vids;
  }, [allHowToVideos, howToCategory, howToSearch]);

  // All content flattened for search (internal modules + how-to videos only)
  const allContent = useMemo(() => [
    ...allInternalModules.map(m => ({ ...m, _type: "internal", type: "Internal", status: "internal" })),
    ...allHowToVideos.map(m => ({ ...m, _type: "howto", type: "Video", status: "howto", cpd: 0 })),
  ], [allInternalModules, allHowToVideos]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allContent.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.cat.toLowerCase().includes(q) ||
      (item.desc  && item.desc.toLowerCase().includes(q)) ||
      (item.type  && item.type.toLowerCase().includes(q)) ||
      (item.roles && item.roles.includes(q)) ||
      (item.role  && item.role.includes(q))
    );
  }, [searchQuery, allContent]);

  const launchModule = m => setActiveModule(m);

  const typeMetaMap = {
    internal: { label: "Inspire Training", bg: "rgba(156,39,176,0.09)", color: "#9C27B0" },
    howto:    { label: "How To",           bg: "rgba(233,30,99,0.09)",  color: "#E91E63" },
  };

  if (activeModule) {
    return <ModuleViewer activeModule={activeModule} onClose={() => setActiveModule(null)} />;
  }

  return (
    <div>
      <SearchBar
        placeholder="Search Inspire training modules and how-to guides..."
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* ── Page header ── */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Educational Excellence</p>
          <h1 className={styles.title}>Training Hub</h1>
          <p className={styles.lead}>
            Role-specific training, mandatory compliance, and clinical CPD — all mapped to GDC and CQC requirements.
          </p>
        </div>
        {currentUser && (
          <div className={styles.userBlock}>
            <Avatar name={currentUser.displayName} size={36} />
            <div>
              <div className={styles.userName}>{currentUser.displayName}</div>
              <div className={styles.userRole}>{currentUser.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Search results view ── */}
      {searchQuery.trim() ? (
        <div>
          <p className={styles.searchResultsMeta}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
            <strong>"{searchQuery}"</strong>
          </p>
          {searchResults.length === 0 ? (
            <div className={styles.searchEmpty}>
              <I name="search" size={36} color="var(--outline)" />
              <p>No training found matching your search.</p>
            </div>
          ) : (
            <div className={styles.searchResultsList}>
              {searchResults.map(item => {
                const meta = typeMetaMap[item._type];
                return (
                  <div
                    key={`${item._type}-${item.id}`}
                    className={styles.searchResultItem}
                    onClick={() => launchModule(item)}
                  >
                    <div className={styles.searchResultLeft}>
                      <Pill bg={meta.bg} color={meta.color} small>{meta.label}</Pill>
                      <div>
                        <div className={styles.searchResultTitle}>{item.title}</div>
                        <div className={styles.searchResultMeta}>
                          {item.cat}{item.dur ? ` · ${item.dur}` : ""}{item.cpd > 0 ? ` · ${item.cpd} CPD hrs` : ""}
                        </div>
                      </div>
                    </div>
                    <I name="arrow" size={14} color="var(--outline)" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
        <div className={styles.layout}>
          {/* ════ Main column ════ */}
          <div>

            {/* ══ SECTION 1: Inspire Dental Training ══ */}
            <div className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionHeaderIcon} style={{ background: "rgba(156,39,176,0.1)" }}>
                  <I name="building" size={15} color="#9C27B0" />
                </div>
                <div style={{ flex: 1 }}>
                  <span className={styles.sectionHeaderTitle}>Inspire Dental Training</span>
                  <span className={styles.sectionHeaderSub}>Internal modules created by the Inspire team · {allInternalModules.length} modules</span>
                </div>
                <button onClick={() => setShowAddTraining(true)} className={styles.uploadTrainingBtn}>
                  <I name="upload" size={13} /> Upload Training
                </button>
              </div>
              <div className={styles.internalGrid}>
                {allInternalModules.map(m => (
                  <InternalCard key={m.id} module={m} onLaunch={launchModule} />
                ))}
              </div>
            </div>

          </div>

            {/* ════ Sidebar ════ */}
            <div>
              {/* Library overview */}
              <div className={styles.sidebarCpd}>
                <h3 className={styles.sidebarCpdTitle}>Training Library</h3>
                <p className={styles.sidebarCpdLead}>Inspire Dental Group — London Flagship</p>
                <div className={styles.cpdMeta} style={{ marginTop: 20 }}>
                  {[
                    { label: "Internal Modules",  val: `${allInternalModules.length} modules`  },
                    { label: "How To Videos",     val: `${allHowToVideos.length} videos`        },
                    { label: "Total Resources",   val: `${allInternalModules.length + allHowToVideos.length} items` },
                  ].map(r => (
                    <div key={r.label} className={styles.cpdMetaRow}>
                      <span className={styles.cpdMetaLabel}>{r.label}</span>
                      <span className={styles.cpdMetaValue}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload shortcuts */}
              <Card hover={false} className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>Add Content</h4>
                <div className={styles.summaryRow} style={{ cursor: "pointer" }} onClick={() => setShowAddTraining(true)}>
                  <div className={styles.summaryLeft}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(156,39,176,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <I name="upload" size={13} color="#9C27B0" />
                    </div>
                    <span className={styles.summaryLabel}>Upload Training Module</span>
                  </div>
                  <I name="arrow" size={13} color="var(--outline)" />
                </div>
                <div className={styles.summaryRow} style={{ cursor: "pointer" }} onClick={() => setShowAddHowTo(true)}>
                  <div className={styles.summaryLeft}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(233,30,99,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <I name="upload" size={13} color="#E91E63" />
                    </div>
                    <span className={styles.summaryLabel}>Upload How To Video</span>
                  </div>
                  <I name="arrow" size={13} color="var(--outline)" />
                </div>
              </Card>

              {/* CPD redirect nudge */}
              <Card hover={false} className={styles.summaryCard}>
                <h4 className={styles.summaryTitle}>External CPD?</h4>
                <p style={{ fontSize: 12, color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: 14 }}>
                  Attended a BDA course, GDC webinar, or external conference? Log it and track your hours in the CPD Tracker.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}>
                  <I name="external" size={13} color="var(--primary)" /> Go to CPD Tracker
                </div>
              </Card>
            </div>
          </div>

        {/* ══ SECTION 2: How To Series ══ */}
        <div className={styles.sectionBlock}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionHeaderIcon} style={{ background: "rgba(233,30,99,0.1)" }}>
              <I name="play" size={15} color="#E91E63" />
            </div>
            <div style={{ flex: 1 }}>
              <span className={styles.sectionHeaderTitle}>How To Series</span>
              <span className={styles.sectionHeaderSub}>Short video guides for everyday tasks · {allHowToVideos.length} videos</span>
            </div>
            <button onClick={() => setShowAddHowTo(true)} className={styles.addVideoBtn}>
              <I name="upload" size={13} /> Add Video
            </button>
          </div>

          <div className={styles.howToCatBar}>
            {howToCats.map(cat => (
              <button
                key={cat}
                className={howToCategory === cat ? `${styles.howToCatBtn} ${styles.howToCatBtnActive}` : styles.howToCatBtn}
                onClick={() => setHowToCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ width: 220 }}>
              <SearchBar
                placeholder="Search How To videos…"
                value={howToSearch}
                onChange={setHowToSearch}
              />
            </div>
          </div>

          {visibleHowTos.length === 0 ? (
            <div className={styles.searchEmpty}>
              <I name="search" size={36} color="var(--outline)" />
              <p>No videos matching your search.</p>
            </div>
          ) : (
            <div className={styles.howToGrid}>
              {visibleHowTos.map(v => (
                <HowToCard key={v.id} video={v} onPlay={setPlayingHowTo} />
              ))}
            </div>
          )}
        </div>
        </>
      )}

      {showAddTraining && (
        <AddTrainingModal
          onClose={() => setShowAddTraining(false)}
          onAdd={mod => setUserInternalModules(prev => [...prev, mod])}
          existingCats={[...new Set(allInternalModules.map(m => m.cat))]}
        />
      )}

      {showAddHowTo && (
        <AddHowToModal
          onClose={() => setShowAddHowTo(false)}
          onAdd={video => { setUserHowTos(prev => [...prev, video]); setHowToCategory("All"); }}
          existingCats={howToCats.filter(c => c !== "All")}
        />
      )}

      {playingHowTo && (
        <HowToVideoModal video={playingHowTo} onClose={() => setPlayingHowTo(null)} />
      )}
    </div>
  );
};
