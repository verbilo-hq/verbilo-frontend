import { useState, useEffect } from "react";
import { I } from "../components/Icon";
import { Card } from "../components/ui/Card";
import { BtnSecondary } from "../components/ui/Buttons";
import { SearchBar } from "../components/ui/SearchBar";
import { TopBar } from "../components/layout/TopBar";
import { useModalA11y } from "../hooks/useModalA11y";
import {
  listClinicalTabs, listEmergencyDrugs, listLaDrugs, listAntibiotics,
  listProtocolCategories, listPils, listPilCategories, getPil,
  listConsents, listConsentCategories, getConsent,
  listReferralSpecialties, getReferralDocument,
  listSafeguardingContacts, listSafeguardingDocs,
  listPerioQuickRef, listEndoQuickRef, listIosQuickRef, listWhiteningQuickRef,
  listDeconQuickRef, listRadiographyQuickRef, listMedEmergQuickRef,
} from "../services/clinical.service";
import { PilViewer } from "./PilViewer";
import { ConsentViewer } from "./ConsentViewer";
import { ReferralDocViewer } from "./ReferralDocViewer";
import { PilBrandingAdmin } from "./PilBrandingAdmin";
import { useAuth } from "../auth/AuthContext";
import { listSites } from "../services/governance/sites.service";
import { ensureSeed } from "../services/governance/seed";
import { brandingFor, ensureDemoBranding } from "../services/governance/practiceBranding.service";
import styles from "./ClinicalPage.module.css";

/* ── Domain reference data (consent forms, guideline orgs, referral pathways)
   stays page-local — purely static medical reference, unlikely to come from a backend.
   Mutable / backend-relevant data lives in src/services/clinical.service.js ── */

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

/* ── Chairside Quick Reference cards ───────────────────────────────────────── */

/* Auto-tag short cells that match a known severity / risk keyword so clinicians
 * can scan tables for the row that matters rather than reading every cell.
 * Long cells stay as prose — they carry context. */
const CHIP_RULES = [
  { match: /^(emergency|999.*)$/i,                          tone: "danger" },
  { match: /^(stop|stop\.?|stop whitening\.?)$/i,           tone: "danger" },
  { match: /^higher$/i,                                     tone: "danger" },
  { match: /^not lawful\.?$/i,                              tone: "danger" },
  { match: /^avoid\.?$/i,                                   tone: "danger" },
  { match: /^(refer|refer to omfs)\.?$/i,                   tone: "danger" },
  { match: /^same-day$/i,                                   tone: "warn"   },
  { match: /^caution\.?$/i,                                 tone: "warn"   },
  { match: /^pause\.?$/i,                                   tone: "warn"   },
  { match: /^defer\.?$/i,                                   tone: "warn"   },
  { match: /^counsel(\s\+\splan)?\.?$/i,                    tone: "warn"   },
  { match: /^stabilise first\.?$/i,                         tone: "warn"   },
  { match: /^same-week$/i,                                  tone: "info"   },
  { match: /^within 1 week$/i,                              tone: "info"   },
  { match: /^refer within 1 week$/i,                        tone: "info"   },
  { match: /^days(\s\/\ssame-day)?$/i,                      tone: "info"   },
  { match: /^low$/i,                                        tone: "ok"     },
  { match: /^continue\.?$/i,                                tone: "ok"     },
];

const chipFor = (text) => {
  if (typeof text !== "string") return null;
  const t = text.trim();
  if (t.length === 0 || t.length > 26) return null;
  for (const r of CHIP_RULES) if (r.match.test(t)) return { tone: r.tone, label: t.replace(/\.$/, "") };
  return null;
};

const QuickRefChip = ({ tone, children }) => (
  <span className={`${styles.qrefChip} ${styles[`qrefChip-${tone}`]}`}>{children}</span>
);

const Cell = ({ value }) => {
  const chip = chipFor(value);
  return chip ? <QuickRefChip tone={chip.tone}>{chip.label}</QuickRefChip> : <>{value}</>;
};

const QuickRefSourcesFoot = ({ sources }) => {
  const [open, setOpen] = useState(false);
  if (!sources?.length) return null;
  return (
    <div className={styles.qrefFoot}>
      <button type="button" className={styles.qrefFootToggle} onClick={() => setOpen((v) => !v)}>
        <I name="external" size={11} color="var(--on-surface-variant)" />
        <span>Sources ({sources.length})</span>
        <I name="chevrondown" size={11} color="var(--on-surface-variant)"
           style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div className={styles.qrefFootSources}>
          {sources.map((s, i) => (
            s.url
              ? <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className={styles.qrefSourceLink}>
                  <I name="external" size={10} color="var(--primary)" /> {s.name}
                </a>
              : <span key={i} className={styles.qrefSourceLinkPlain}>{s.name}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickRefNotesFoot = ({ notes }) => {
  const [open, setOpen] = useState(false);
  if (!notes?.length) return null;
  return (
    <div className={styles.qrefFoot}>
      <button type="button" className={`${styles.qrefFootToggle} ${styles.qrefFootToggleWatch}`} onClick={() => setOpen((v) => !v)}>
        <I name="alert" size={11} color="#b36000" />
        <span>Watch-outs ({notes.length})</span>
        <I name="chevrondown" size={11} color="#b36000"
           style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <ul className={styles.qrefFootNotes}>
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      )}
    </div>
  );
};

const QuickRefTableBody = ({ card }) => (
  <>
    {card.columns && card.rows && (
      <table className={styles.qrefTable}>
        <thead>
          <tr>{card.columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {card.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => <td key={j}><Cell value={cell} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    )}

    {card.subTables && (
      <div className={styles.qrefSubTables}>
        {card.subTables.map((t) => (
          <div key={t.title} className={styles.qrefSubTable}>
            <div className={styles.qrefSubTableTitle}>{t.title}</div>
            <table className={styles.qrefTable} style={{ marginTop: 0 }}>
              <thead>
                <tr>{t.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {t.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j}><Cell value={cell} /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    )}
  </>
);

/** Compute Stage / Grade from clinician inputs per BSP 2018 + S3 2021. */
function deriveStaging({ interdentalCAL, boneLossPct, ageYears, toothLossDueToPerio }) {
  const cal = Number(interdentalCAL);
  const bone = Number(boneLossPct);
  const age = Number(ageYears);
  const lost = Number(toothLossDueToPerio);

  if (!cal || !bone || !age) return { stage: null, grade: null, severity: "" };

  // Stage
  let stage;
  if (cal >= 5 && lost >= 5) stage = "IV";
  else if (cal >= 5) stage = "III";
  else if (cal >= 3) stage = "II";
  else stage = "I";

  // Grade (bone loss % / age)
  const ratio = bone / age;
  let grade;
  if (ratio < 0.25) grade = "A";
  else if (ratio <= 1.0) grade = "B";
  else grade = "C";

  const severityMap = {
    I:   "Initial periodontitis",
    II:  "Moderate periodontitis",
    III: "Severe — potential for additional tooth loss",
    IV:  "Severe — potential for loss of dentition",
  };
  return { stage, grade, severity: severityMap[stage] };
}

const QuickRefDecisionBody = ({ card }) => {
  const [values, setValues] = useState({});
  const result = deriveStaging(values);
  const set = (id, v) => setValues((p) => ({ ...p, [id]: v }));

  return (
    <>
      <div className={styles.qrefDecisionInputs}>
        {card.inputs.map((inp) => (
          <div key={inp.id} className={styles.qrefInputField}>
            <label className={styles.qrefInputLabel}>{inp.label}</label>
            <input
              type={inp.type}
              min={inp.min} max={inp.max} step={inp.step}
              className={styles.qrefInputBox}
              value={values[inp.id] ?? ""}
              onChange={(e) => set(inp.id, e.target.value)}
            />
            {inp.hint && <span className={styles.qrefInputHint}>{inp.hint}</span>}
          </div>
        ))}
      </div>

      <div className={styles.qrefResult}>
        {result.stage ? (
          <>
            <div className={styles.qrefResultBlock}>
              <span className={styles.qrefResultLabel}>Stage</span>
              <span className={styles.qrefResultValue}>{result.stage}</span>
              <span className={styles.qrefResultSeverity}>{result.severity}</span>
            </div>
            <div className={styles.qrefResultBlock}>
              <span className={styles.qrefResultLabel}>Grade</span>
              <span className={styles.qrefResultValue}>{result.grade}</span>
              <span className={styles.qrefResultSeverity}>
                {result.grade === "A" ? "Slow progression" :
                 result.grade === "B" ? "Moderate progression" :
                 "Rapid progression"}
              </span>
            </div>
          </>
        ) : (
          <span className={styles.qrefResultPlaceholder}>Enter all four values to compute Stage & Grade.</span>
        )}
      </div>

      <div className={styles.qrefSubsectionTitle}>Modifiers</div>
      <ul className={styles.qrefModifiers}>
        {card.modifiers.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
    </>
  );
};

const QuickRefFlowBody = ({ card }) => {
  const [openStep, setOpenStep] = useState(1);
  return (
    <div className={styles.qrefFlow}>
      {card.steps.map((s) => {
        const open = openStep === s.n;
        return (
          <div key={s.n} className={styles.qrefFlowStep}>
            <button
              className={styles.qrefFlowStepHead}
              onClick={() => setOpenStep(open ? null : s.n)}
            >
              <div className={styles.qrefFlowStepNum}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div className={styles.qrefFlowStepTitle}>{s.title}</div>
                <div className={styles.qrefFlowStepTargets}>{s.targets.join(" · ")}</div>
              </div>
              <I name="chevrondown" size={14} color="var(--on-surface-variant)"
                 style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
            {open && (
              <div className={styles.qrefFlowStepBody}>
                <ul className={styles.qrefFlowActions}>
                  {s.actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
                <div className={styles.qrefFlowEndpoint}>
                  <span className={styles.qrefFlowEndpointTag}>Endpoint</span>
                  <span>{s.endpoint}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const QuickRefAccordionCard = ({ card, open, onToggle }) => {
  const body =
    card.format === "decision" ? <QuickRefDecisionBody card={card} /> :
    card.format === "flow"     ? <QuickRefFlowBody     card={card} /> :
                                  <QuickRefTableBody    card={card} />;
  return (
    <div className={`${styles.qrefAccordion} ${open ? styles.qrefAccordionOpen : ""}`}>
      <button type="button" className={styles.qrefAccordionHead} onClick={onToggle} aria-expanded={open}>
        <div className={styles.qrefCardIcon}>
          <I name={card.icon} size={15} color="var(--primary)" />
        </div>
        <div className={styles.qrefAccordionMeta}>
          <div className={styles.qrefCardTitle}>{card.label}</div>
          <p className={styles.qrefCardSummary}>{card.summary}</p>
        </div>
        <I name="chevrondown" size={14} color="var(--on-surface-variant)"
           style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>
      {open && (
        <div className={styles.qrefAccordionBody}>
          {body}
          <div className={styles.qrefFootRow}>
            <QuickRefNotesFoot notes={card.notes} />
            <QuickRefSourcesFoot sources={card.sources} />
          </div>
        </div>
      )}
    </div>
  );
};

const ChairsideQuickRef = ({ cards }) => {
  const [openId, setOpenId] = useState(cards[0]?.id ?? null);
  return (
    <div className={styles.qrefList}>
      {cards.map((card) => (
        <QuickRefAccordionCard
          key={card.id}
          card={card}
          open={openId === card.id}
          onToggle={() => setOpenId(openId === card.id ? null : card.id)}
        />
      ))}
    </div>
  );
};

/* ── Emergency reference modal ─────────────────────────────────────────────── */

const EmergencyModal = ({ type, emergencyDrugs, laDrugs, antibiotics, laWeight, onWeightChange, onClose }) => {
  const dialogRef = useModalA11y(onClose);
  const titles = { drugs: "Emergency Drugs — Doses & Routes", la: "Local Anaesthetic Maximum Doses", antibiotics: "Antibiotic Prescribing Guide" };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div ref={dialogRef} className={styles.emergencyModal} onClick={e => e.stopPropagation()} aria-labelledby="emergency-modal-title">
        <div className={styles.emergencyModalHeader}>
          <div>
            <span className={styles.emergencyModalEyebrow}>Quick Reference</span>
            <h3 id="emergency-modal-title" className={styles.emergencyModalTitle}>{titles[type]}</h3>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close emergency reference"><I name="xcircle" size={22} /></button>
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
                <span style={{ flex: 3 }}>Agent (2.2 mL cartridge)</span>
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

/* ── Patient leaflet icon mapping ──────────────────────────────────────────
   Each leaflet id maps to a Lucide icon name registered in components/Icon.jsx.
   Category fall-back is used if a leaflet id is missing from this table. */
const PIL_ICONS = {
  "diet-oral-health":       "apple",
  "pregnancy":              "baby",
  "smoking":                "nosmoking",
  "oral-cancer":            "ribbon",
  "children-0-5":           "baby",
  "tooth-whitening":        "sparkles",
  "gum-disease":            "shieldalert",
  "children-6-12":          "smile",
  "teenagers":              "training",
  "thumb-sucking":          "heart",
  "white-fillings":         "wrench",
  "veneers":                "smile",
  "crown-bridge":           "crown",
  "implants":               "anchor",
  "dentures":               "smile",
  "replace-missing-tooth":  "plus",
  "wisdom-teeth":           "brain",
  "after-extraction":       "heart",
  "sinus-lift-graft":       "bone",
  "frenectomy":             "scissors",
  "root-canal":             "activity",
  "hygienist-visits":       "sparkles",
  "bad-breath":             "wind",
  "mouth-ulcers":           "alert",
  "cold-sores":             "droplets",
  "sensitive-teeth":        "zap",
  "bruxism":                "moon",
  "tmd":                    "activity",
  "sports-mouthguards":     "shield",
  "sleep-apnoea":           "bed",
  "fissure-sealants":       "shield",
  "diabetes":               "heartpulse",
  "heart-conditions":       "heartpulse",
  "cancer-treatment":       "pill",
  "dry-mouth":              "droplets",
  "eating-disorders":       "heart",
  "carers-mouth-care":      "hearthandshake",
  "first-visit":            "building",
  "nhs-vs-private":         "creditcard",
  "dental-xrays":           "scan",
  "new-filling-crown":      "wrench",
  "travelling":             "plane",
  "dental-emergencies":     "alert",
  "dental-anxiety":         "brain",
  "seniors":                "sun",
};

const PIL_CATEGORY_ICONS = {
  preventive: "shield",
  children:   "baby",
  cosmetic:   "sparkles",
  surgery:    "clinical",
  gum:        "activity",
  function:   "moon",
  groups:     "person",
  practical:  "book",
  other:      "bookmark",
};

const resolvePilIcon = (id, catSlug) => PIL_ICONS[id] || PIL_CATEGORY_ICONS[catSlug] || "book";

/* ── Consent form icon mapping ─────────────────────────────────────────────
   Mirrors the PIL approach. id → Lucide icon, with category fall-back. */
const CONSENT_ICONS = {
  // Core
  "general-treatment":       "clipboard",
  "private-treatment-plan":  "creditcard",
  "medical-history":         "heartpulse",
  "data-protection":         "lock",
  "photography":             "camera",
  "electronic-comms":        "mail",
  "child-consent":           "baby",
  "mental-capacity":         "brain",
  "nhs-supplement":          "file",
  // Treatment
  "filling":                 "wrench",
  "composite-bonding":       "sparkles",
  "crown-onlay-inlay":       "crown",
  "veneer":                  "smile",
  "bridge":                  "construction",
  "denture":                 "smile",
  "extraction":              "scissors",
  "surgical-extraction":     "microscope",
  "root-canal":              "activity",
  "periodontal":             "shieldalert",
  "whitening":               "sparkles",
  "implant":                 "anchor",
  "bone-graft":              "bone",
  "orthodontic":             "construction",
  "sedation":                "pill",
  "direct-access":           "hearthandshake",
  "minor-oral-surgery":      "scissors",
  "bite-splint":             "moon",
};

const CONSENT_CATEGORY_ICONS = {
  core:      "file",
  treatment: "clinical",
};

const resolveConsentIcon = (id, catSlug) => CONSENT_ICONS[id] || CONSENT_CATEGORY_ICONS[catSlug] || "file";

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

  const [TABS,                  setTabs]                  = useState([]);
  const [emergencyDrugs,        setEmergencyDrugs]        = useState([]);
  const [laDrugs,               setLaDrugs]               = useState([]);
  const [antibiotics,           setAntibiotics]           = useState([]);
  const [protocolCategories,    setProtocolCategories]    = useState([]);
  const [pils,                  setPils]                  = useState([]);
  const [pilCats,               setPilCats]               = useState([]);
  const [activePil,             setActivePil]             = useState(null);
  const [pilQuery,              setPilQuery]              = useState("");
  const [pilFilter,             setPilFilter]             = useState("all");
  const [pilSites,              setPilSites]              = useState([]);
  const [pilSiteId,             setPilSiteId]             = useState(() => localStorage.getItem("verbilo.pil.siteId") || null);
  const [consents,              setConsents]              = useState([]);
  const [consentCats,           setConsentCats]           = useState([]);
  const [activeConsent,         setActiveConsent]         = useState(null);
  const [consentQuery,          setConsentQuery]          = useState("");
  const [consentFilter,         setConsentFilter]         = useState("all");
  const [referralSpecs,         setReferralSpecs]         = useState([]);
  const [activeRefDoc,          setActiveRefDoc]          = useState(null);
  const [brandingOpen,          setBrandingOpen]          = useState(false);
  const [brandingTick,          setBrandingTick]          = useState(0); // bump to refresh after save
  const { user } = useAuth();
  const [safeguardingContacts,  setSafeguardingContacts]  = useState([]);
  const [safeguardingDocs,      setSafeguardingDocs]      = useState([]);
  const [perioQuickRef,         setPerioQuickRef]         = useState([]);
  const [endoQuickRef,          setEndoQuickRef]          = useState([]);
  const [iosQuickRef,           setIosQuickRef]           = useState([]);
  const [whiteningQuickRef,     setWhiteningQuickRef]     = useState([]);
  const [deconQuickRef,         setDeconQuickRef]         = useState([]);
  const [radiographyQuickRef,   setRadiographyQuickRef]   = useState([]);
  const [medEmergQuickRef,      setMedEmergQuickRef]      = useState([]);

  useEffect(() => {
    listClinicalTabs().then(setTabs);
    listEmergencyDrugs().then(setEmergencyDrugs);
    listLaDrugs().then(setLaDrugs);
    listAntibiotics().then(setAntibiotics);
    listProtocolCategories().then(setProtocolCategories);
    listPils().then(setPils);
    listPilCategories().then(setPilCats);
    listConsents().then(setConsents);
    listConsentCategories().then(setConsentCats);
    listReferralSpecialties().then(setReferralSpecs);
    listSafeguardingContacts().then(setSafeguardingContacts);
    listSafeguardingDocs().then(setSafeguardingDocs);
    listPerioQuickRef().then(setPerioQuickRef);
    listEndoQuickRef().then(setEndoQuickRef);
    listIosQuickRef().then(setIosQuickRef);
    listWhiteningQuickRef().then(setWhiteningQuickRef);
    listDeconQuickRef().then(setDeconQuickRef);
    listRadiographyQuickRef().then(setRadiographyQuickRef);
    listMedEmergQuickRef().then(setMedEmergQuickRef);
  }, []);

  // Sites + branding seed (only needed for PIL letterhead). Mirror the
  // GovernanceShell pattern: fall back to a demo tenant when the auth user
  // hasn't been enriched yet, so the leaflet UI works in dev / demo flows.
  const pilUser = user ? {
    id: user.id ?? user.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId: user.tenantId ?? "demo-tenant",
    siteId:   user.siteId ?? null,
    username: user.username ?? "dev",
    role:     user.role ?? "super_admin",
  } : null;

  useEffect(() => {
    if (!pilUser) return;
    ensureSeed(pilUser);
    ensureDemoBranding(pilUser);
    setPilSites(listSites(pilUser.tenantId));
  }, [pilUser?.tenantId, brandingTick]);

  const pilBranding = pilUser ? brandingFor(pilUser.tenantId, pilSiteId) : null;
  const setActiveSite = (id) => {
    setPilSiteId(id);
    if (id) localStorage.setItem("verbilo.pil.siteId", id);
    else    localStorage.removeItem("verbilo.pil.siteId");
  };

  const activeProto = protocolCategories.find(c => c.id === activeProtoCat);

  /* ── Search index ── */
  const searchableText = (value) => {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(searchableText).join(" ");
    if (typeof value === "object") return Object.values(value).map(searchableText).join(" ");
    return "";
  };
  const quickReferenceGroups = [
    { categoryId: "perio", label: "Periodontology", cards: perioQuickRef },
    { categoryId: "endo", label: "Endodontics", cards: endoQuickRef },
    { categoryId: "surgery", label: "Oral Surgery", cards: iosQuickRef },
    { categoryId: "whitening", label: "Whitening", cards: whiteningQuickRef },
    { categoryId: "ipc", label: "Decontamination & IPC", cards: deconQuickRef },
    { categoryId: "radiology", label: "Radiography", cards: radiographyQuickRef },
    { categoryId: "emergency", label: "Medical Emergencies", cards: medEmergQuickRef },
  ];
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
    ...quickReferenceGroups.flatMap(group => group.cards.map(card => ({
      section: "Chairside Quick Reference",
      label: group.label,
      name: card.label,
      desc: card.summary ?? "",
      searchText: searchableText(card),
      action: () => {
        setActiveTab("protocols");
        setActiveProtoCat(group.categoryId);
        setSearchQuery("");
      },
    }))),
  ];

  const q = searchQuery.trim().toLowerCase();
  const searchResults = q.length >= 2
    ? searchIndex.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q) ||
        item.searchText?.toLowerCase().includes(q)
      )
    : [];

  return (
    <div>
      <SearchBar
        placeholder="Search protocols, quick references, consent forms, guidelines..."
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

          {/* Chairside Quick Reference cards for clinical specialties.
              Controlled SOPs live in the Clinical Governance pack — these
              tabs surface evergreen lookup content for the clinician
              mid-treatment (no version control, no acknowledgement). */}
          {activeProtoCat === "perio" ? (
            <ChairsideQuickRef cards={perioQuickRef} />
          ) : activeProtoCat === "endo" ? (
            <ChairsideQuickRef cards={endoQuickRef} />
          ) : activeProtoCat === "surgery" ? (
            <ChairsideQuickRef cards={iosQuickRef} />
          ) : activeProtoCat === "whitening" ? (
            <ChairsideQuickRef cards={whiteningQuickRef} />
          ) : activeProtoCat === "ipc" ? (
            <ChairsideQuickRef cards={deconQuickRef} />
          ) : activeProtoCat === "radiology" ? (
            <ChairsideQuickRef cards={radiographyQuickRef} />
          ) : activeProtoCat === "emergency" ? (
            <ChairsideQuickRef cards={medEmergQuickRef} />
          ) : activeProto && (
            <Card hover={false} className={styles.protoCard}>
              <div className={styles.protoCardHeader}>
                <div className={styles.protoCardTitleWrap}>
                  <div className={styles.protoCardIcon}><I name={activeProto.icon} size={18} color="var(--primary)" /></div>
                  <div>
                    <h3 className={styles.protoCardTitle}>{activeProto.label}</h3>
                    <p className={styles.protoCardCount}>{activeProto.items.length} protocols</p>
                  </div>
                </div>
                <BtnSecondary style={{ fontSize: 12, padding: "7px 14px" }} disabled title="Bulk protocol download is not available yet">
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
      {!q && activeTab === "consent" && (() => {
        const queryLc = pilQuery.trim().toLowerCase();
        const filtered = pils.filter((p) => {
          if (pilFilter !== "all" && p.category !== pilFilter) return false;
          if (!queryLc) return true;
          const catLabel = pilCats.find((c) => c.slug === p.category)?.label ?? "";
          return (
            p.title.toLowerCase().includes(queryLc) ||
            (p.summary ?? "").toLowerCase().includes(queryLc) ||
            catLabel.toLowerCase().includes(queryLc)
          );
        });
        return (
        <div className={styles.tabContent}>
          <div className={styles.pilTopBar}>
            <p className={styles.guidelineIntro} style={{ margin: 0, flex: 1 }}>
              <I name="info" size={14} /> A complete library of plain-English patient leaflets, grouped by topic. Click any card to open the leaflet, then print on practice letterhead or save as PDF.
            </p>
            {pilSites.length > 0 && (
              <label className={styles.pilSitePicker} title="Print under this site’s letterhead">
                <span className={styles.pilSitePickerLabel}>Letterhead</span>
                <select className={styles.pilSitePickerSelect} value={pilSiteId ?? ""} onChange={(e) => setActiveSite(e.target.value || null)}>
                  <option value="">Group default</option>
                  {pilSites.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </label>
            )}
            <button className={styles.pilActionBtn} onClick={() => setBrandingOpen(true)}>
              <I name="settings" size={13} /> Manage branding
            </button>
          </div>

          <div className={styles.pilSearchRow}>
            <div className={styles.pilSearchField}>
              <I name="search" size={16} color="var(--on-surface-variant)" />
              <input
                type="search"
                className={styles.pilSearchInput}
                placeholder="Search leaflets by title, topic or description…"
                value={pilQuery}
                onChange={(e) => setPilQuery(e.target.value)}
              />
              {pilQuery && (
                <button type="button" className={styles.pilSearchClear} onClick={() => setPilQuery("")} title="Clear search">
                  <I name="close" size={14} />
                </button>
              )}
            </div>
          </div>

          <div className={styles.pilFilterChips}>
            <button
              type="button"
              className={`${styles.pilChip} ${pilFilter === "all" ? styles.pilChipActive : ""}`}
              onClick={() => setPilFilter("all")}
            >
              All
              <span className={styles.pilChipCount}>{pils.length}</span>
            </button>
            {pilCats.map((cat) => {
              const count = pils.filter((p) => p.category === cat.slug).length;
              if (count === 0) return null;
              const active = pilFilter === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`${styles.pilChip} ${active ? styles.pilChipActive : ""}`}
                  onClick={() => setPilFilter(cat.slug)}
                  style={active ? { background: cat.color, borderColor: cat.color } : { color: cat.color }}
                >
                  <I name={PIL_CATEGORY_ICONS[cat.slug] || "book"} size={13} />
                  {cat.label}
                  <span className={styles.pilChipCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className={styles.pilEmpty}>
              <div className={styles.pilEmptyTitle}>No leaflets match that search.</div>
              <div>Try clearing the filters or searching by topic, e.g. "smoking", "implant", "anxiety".</div>
            </div>
          )}

          {pilCats.map((cat) => {
            const leaflets = filtered.filter((p) => p.category === cat.slug);
            if (leaflets.length === 0) return null;
            const catIcon = PIL_CATEGORY_ICONS[cat.slug] || "book";
            return (
              <div key={cat.slug} className={styles.pilCategoryGroup}>
                <div className={styles.pilCategoryHead}>
                  <span
                    className={styles.pilCategoryIcon}
                    style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)`, color: cat.color }}
                  >
                    <I name={catIcon} size={18} color={cat.color} />
                  </span>
                  <span className={styles.pilCategoryNum} style={{ color: cat.color }}>{cat.number}</span>
                  <span className={styles.pilCategoryLabelLg} style={{ color: cat.color }}>{cat.label}</span>
                  <span className={styles.pilCategoryCount}>{leaflets.length} leaflet{leaflets.length === 1 ? "" : "s"}</span>
                </div>
                <div className={styles.pilGrid}>
                  {leaflets.map((p) => {
                    const iconName = resolvePilIcon(p.id, p.category);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={styles.pilTileBtn}
                        onClick={async () => { const full = await getPil(p.id); setActivePil(full); }}
                      >
                        <div className={styles.pilTileTop}>
                          <span
                            className={styles.pilTileIcon}
                            style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)` }}
                          >
                            <I name={iconName} size={22} color={cat.color} />
                          </span>
                          <div className={styles.pilTileBody}>
                            <span className={styles.pilTileNum}>Leaflet {p.num}</span>
                            <div className={styles.pilTileTitle}>{p.title}</div>
                            {p.summary && <div className={styles.pilTileSummary}>{p.summary}</div>}
                          </div>
                        </div>
                        <div className={styles.pilTileFoot}>
                          <span className={styles.pilTileFootLabel} style={{ color: cat.color }}>{cat.label}</span>
                          <span className={styles.pilTileIconBtn} title="View leaflet">
                            <I name="eye" size={14} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {activePil && (
            <PilViewer
              leaflet={activePil}
              category={pilCats.find((c) => c.slug === activePil.category)}
              branding={pilBranding}
              sites={pilSites}
              currentSiteId={pilSiteId}
              onSiteChange={setActiveSite}
              onManageBranding={() => setBrandingOpen(true)}
              onClose={() => setActivePil(null)}
            />
          )}
          {brandingOpen && pilUser && (
            <PilBrandingAdmin
              user={pilUser}
              sites={pilSites}
              onClose={() => setBrandingOpen(false)}
              onSaved={() => setBrandingTick((n) => n + 1)}
            />
          )}
        </div>
      );})()}

      {/* ══════════════ CONSENT FORMS tab ══════════════ */}
      {!q && activeTab === "consentforms" && (() => {
        const queryLc = consentQuery.trim().toLowerCase();
        const filtered = consents.filter((c) => {
          if (consentFilter !== "all" && c.category !== consentFilter) return false;
          if (!queryLc) return true;
          const catLabel = consentCats.find((x) => x.slug === c.category)?.label ?? "";
          return (
            c.title.toLowerCase().includes(queryLc) ||
            (c.summary ?? "").toLowerCase().includes(queryLc) ||
            (c.documentType ?? "").toLowerCase().includes(queryLc) ||
            (c.ref ?? "").toLowerCase().includes(queryLc) ||
            catLabel.toLowerCase().includes(queryLc)
          );
        });
        return (
        <div className={styles.tabContent}>
          <div className={styles.pilTopBar}>
            <p className={styles.guidelineIntro} style={{ margin: 0, flex: 1 }}>
              <I name="info" size={14} /> Practice-ready consent forms — click any card to open the fill-and-print version on your practice letterhead.
            </p>
            {pilSites.length > 0 && (
              <label className={styles.pilSitePicker} title="Print under this site's letterhead">
                <span className={styles.pilSitePickerLabel}>Letterhead</span>
                <select className={styles.pilSitePickerSelect} value={pilSiteId ?? ""} onChange={(e) => setActiveSite(e.target.value || null)}>
                  <option value="">Group default</option>
                  {pilSites.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </label>
            )}
            <button className={styles.pilActionBtn} onClick={() => setBrandingOpen(true)}>
              <I name="settings" size={13} /> Manage branding
            </button>
          </div>

          <div className={styles.pilSearchRow}>
            <div className={styles.pilSearchField}>
              <I name="search" size={16} color="var(--on-surface-variant)" />
              <input
                type="search"
                className={styles.pilSearchInput}
                placeholder="Search consent forms by title, treatment or reference…"
                value={consentQuery}
                onChange={(e) => setConsentQuery(e.target.value)}
              />
              {consentQuery && (
                <button type="button" className={styles.pilSearchClear} onClick={() => setConsentQuery("")} title="Clear search">
                  <I name="close" size={14} />
                </button>
              )}
            </div>
          </div>

          <div className={styles.pilFilterChips}>
            <button
              type="button"
              className={`${styles.pilChip} ${consentFilter === "all" ? styles.pilChipActive : ""}`}
              onClick={() => setConsentFilter("all")}
            >
              All
              <span className={styles.pilChipCount}>{consents.length}</span>
            </button>
            {consentCats.map((cat) => {
              const count = consents.filter((c) => c.category === cat.slug).length;
              if (count === 0) return null;
              const active = consentFilter === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`${styles.pilChip} ${active ? styles.pilChipActive : ""}`}
                  onClick={() => setConsentFilter(cat.slug)}
                  style={active ? { background: cat.color, borderColor: cat.color } : { color: cat.color }}
                >
                  <I name={CONSENT_CATEGORY_ICONS[cat.slug] || "file"} size={13} />
                  {cat.label}
                  <span className={styles.pilChipCount}>{count}</span>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className={styles.pilEmpty}>
              <div className={styles.pilEmptyTitle}>No consent forms match that search.</div>
              <div>Try clearing the filters or searching by treatment, e.g. "implant", "sedation", "child".</div>
            </div>
          )}

          {consentCats.map((cat) => {
            const forms = filtered.filter((c) => c.category === cat.slug);
            if (forms.length === 0) return null;
            const catIcon = CONSENT_CATEGORY_ICONS[cat.slug] || "file";
            return (
              <div key={cat.slug} className={styles.pilCategoryGroup}>
                <div className={styles.pilCategoryHead}>
                  <span
                    className={styles.pilCategoryIcon}
                    style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)`, color: cat.color }}
                  >
                    <I name={catIcon} size={18} color={cat.color} />
                  </span>
                  <span className={styles.pilCategoryNum} style={{ color: cat.color }}>{cat.number}</span>
                  <span className={styles.pilCategoryLabelLg} style={{ color: cat.color }}>{cat.label}</span>
                  <span className={styles.pilCategoryCount}>{forms.length} form{forms.length === 1 ? "" : "s"}</span>
                </div>
                <div className={styles.pilGrid}>
                  {forms.map((f) => {
                    const iconName = resolveConsentIcon(f.id, f.category);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        className={styles.pilTileBtn}
                        onClick={async () => { const full = await getConsent(f.id); setActiveConsent(full); }}
                      >
                        <div className={styles.pilTileTop}>
                          <span
                            className={styles.pilTileIcon}
                            style={{ background: `color-mix(in srgb, ${cat.color} 12%, transparent)` }}
                          >
                            <I name={iconName} size={22} color={cat.color} />
                          </span>
                          <div className={styles.pilTileBody}>
                            <span className={styles.pilTileNum}>Form {f.num}{f.ref ? ` · ${f.ref}` : ""}</span>
                            <div className={styles.pilTileTitle}>{f.title}</div>
                            {f.summary && <div className={styles.pilTileSummary}>{f.summary}</div>}
                          </div>
                        </div>
                        <div className={styles.pilTileFoot}>
                          <span className={styles.pilTileFootLabel} style={{ color: cat.color }}>{cat.label}</span>
                          <span className={styles.pilTileIconBtn} title="View consent form">
                            <I name="eye" size={14} />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {activeConsent && (
            <ConsentViewer
              consent={activeConsent}
              category={consentCats.find((c) => c.slug === activeConsent.category)}
              branding={pilBranding}
              sites={pilSites}
              currentSiteId={pilSiteId}
              onSiteChange={setActiveSite}
              onManageBranding={() => setBrandingOpen(true)}
              onClose={() => setActiveConsent(null)}
            />
          )}
        </div>
      );})()}

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
              const packMatch = referralSpecs.find(
                (s) => s.label.toLowerCase() === r.label.toLowerCase()
              );
              return (
                <div key={r.label} className={styles.referralItem}>
                  <button
                    className={isOpen
                      ? `${styles.referralToggle} ${styles.referralToggleOpen} ${r.urgent ? styles.referralToggleUrgent : ""}`
                      : `${styles.referralToggle} ${r.urgent ? styles.referralToggleUrgent : ""}`}
                    onClick={() => setActiveReferral(isOpen ? null : r.label)}>
                    <div className={styles.referralToggleLeft}>
                      <div className={styles.referralToggleIcon}><I name={packMatch?.icon ?? r.icon} size={16} color={r.urgent ? "#fff" : (packMatch?.color ?? "var(--primary)")} /></div>
                      <span>{r.label}</span>
                      {r.urgent && <span className={styles.urgentPill}>Urgent</span>}
                      {packMatch && !r.urgent && (
                        <span className={styles.refPackCardCode} style={{ marginLeft: 4 }}>
                          {packMatch.documents.length} docs
                        </span>
                      )}
                    </div>
                    <I name="chevrondown" size={16} color={isOpen || r.urgent ? "#fff" : "var(--on-surface-variant)"}
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>
                  {isOpen && (packMatch ? (
                    <div className={styles.refPackBody}>
                      {packMatch.intro && <p className={styles.refPackIntro}>{packMatch.intro}</p>}
                      <div className={styles.refPackGrid}>
                        {packMatch.documents.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            className={styles.refPackCard}
                            onClick={async () => {
                              const full = await getReferralDocument(packMatch.id, d.id);
                              setActiveRefDoc(full);
                            }}
                          >
                            <div className={styles.refPackCardTop}>
                              <span
                                className={styles.refPackCardIcon}
                                style={{ background: `color-mix(in srgb, ${packMatch.color} 12%, transparent)` }}
                              >
                                <I name="file" size={16} color={packMatch.color} />
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div className={styles.refPackCardType}>{d.type}</div>
                                <div className={styles.refPackCardTitle}>{d.title}</div>
                              </div>
                            </div>
                            {d.purpose && <div className={styles.refPackCardPurpose}>{d.purpose}</div>}
                            <div className={styles.refPackCardFoot}>
                              <span className={styles.refPackCardCode}>{d.code}</span>
                              <span className={styles.refPackCardMeta}>Updated {d.updated}</span>
                              {d.urgent && <span className={styles.refPackCardUrgent}>Urgent</span>}
                              {!d.hasContent && !d.urgent && <span className={styles.refPackCardStub}>Stub</span>}
                              <span className={styles.refPackCardOpen} title="Open document">
                                <I name="eye" size={13} />
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
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
                  ))}
                </div>
              );
            })}
          </div>
          {activeRefDoc && (
            <ReferralDocViewer
              doc={activeRefDoc}
              branding={pilBranding}
              sites={pilSites}
              currentSiteId={pilSiteId}
              onSiteChange={setActiveSite}
              onManageBranding={() => setBrandingOpen(true)}
              onClose={() => setActiveRefDoc(null)}
            />
          )}
          {brandingOpen && pilUser && (
            <PilBrandingAdmin
              user={pilUser}
              sites={pilSites}
              onClose={() => setBrandingOpen(false)}
              onSaved={() => setBrandingTick((n) => n + 1)}
            />
          )}
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
                  { step: "2", label: "Discuss with lead",   desc: "Contact the Practice Safeguarding Lead: Maya Manager." },
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
          emergencyDrugs={emergencyDrugs}
          laDrugs={laDrugs}
          antibiotics={antibiotics}
          laWeight={laWeight}
          onWeightChange={setLaWeight}
          onClose={() => setEmergencyModal(null)}
        />
      )}
    </div>
  );
};
