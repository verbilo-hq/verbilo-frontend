/**
 * Paediatric Dentistry Clinical Protocol — PAED-08
 * First Permanent Molar Issues — MIH, Caries & Restorative Decisions
 *
 * Provenance: drafted by Verbilo from UK public clinical guidance.
 */

import {
  PAED_CLINICAL_INTENT, PAED_LOCAL_SIGNOFF_NOTE, PAED_MINIMUM_RECORD_SET,
  PAED_VERSION_BASE, PAED_REF,
} from "./paed-common";

export const PAED_08 = {
  id: "doc-paed-08",
  reference: "PAED-08",
  packKey: "clinical_governance",
  category: "Paediatric",
  type: "sop",
  title: "First Permanent Molar Issues — MIH, Caries & Restorative Decisions",
  subtitle: "Molar-incisor hypomineralisation, caries in 6s, planned extraction timing and orthodontic implications.",

  clinicalIntent: PAED_CLINICAL_INTENT,
  localSignOffNote: PAED_LOCAL_SIGNOFF_NOTE,

  metaStrip: {
    appliesTo: "Children with caries, hypomineralisation or symptomatic first permanent molars",
    frequency: "At every paediatric examination from 6 years onward, and as molars erupt",
    lead:      "Dentist (with orthodontic input where indicated)",
    evidence:  "Diagnosis, extent, restorative or extraction plan and orthodontic referral where required",
  },

  standardLabel: "First-permanent-molar standard",
  protocolStandard: "First permanent molars are strategic teeth with long-term occlusal and aesthetic implications. Caries or MIH on these teeth must be assessed early, with timely orthodontic input where extraction is considered to optimise spontaneous space closure.",

  workflow: [
    { n: 1, title: "Identify and grade the problem",   desc: "Distinguish caries from MIH (chalky-creamy / yellow-brown defect with normal contralateral or normal incisor). Grade MIH severity (sensitivity, breakdown, atypical caries)." },
    { n: 2, title: "Manage prevention first",           desc: "High-strength fluoride, sensitivity desensitisers, sealants on susceptible sites. For mild MIH, conservative management may be sufficient." },
    { n: 3, title: "Restore appropriately",              desc: "Use adhesive restorations (glass-ionomer for newly erupted; composite once isolation feasible). Avoid amalgam for MIH; consider preformed metal crowns for extensive MIH breakdown." },
    { n: 4, title: "Consider planned extraction",        desc: "For poor-prognosis molars (extensive MIH/caries, repeated failure) consider planned extraction at the optimal dental age (around 8–10 years, dental age via radiograph) for best spontaneous space closure. Liaise with orthodontist." },
    { n: 5, title: "Compensating extractions",            desc: "For lower-6 planned extraction, consider compensating extraction of upper-6 to maintain occlusion. Orthodontic advice essential." },
  ],

  decisionTable: {
    title: "First-Permanent-Molar Decision Guide",
    columns: ["Finding", "Recommended approach"],
    rows: [
      ["Healthy 6 with high caries risk",          "Fissure sealant + intensive prevention + risk-based recall."],
      ["MIH, mild (sensitivity only)",             "Sensitivity management, fluoride varnish, sealant, monitoring."],
      ["MIH, moderate (post-eruptive breakdown)",   "Adhesive restorations; preformed metal crown for extensive breakdown."],
      ["MIH, severe (extensive breakdown, repeated failure)", "Consider planned extraction at optimal age with orthodontic input."],
      ["Carious 6 with poor restorative prognosis", "Discuss extraction timing with orthodontist to optimise space closure."],
      ["Carious 6, restorable",                      "Restore conservatively with adhesive technique; monitor and reinforce prevention."],
    ],
  },

  safetyBox: {
    title: "Refer to orthodontist before extraction if",
    items: [
      "Considering planned extraction of any first permanent molar — timing matters.",
      "Patient is < 8 or > 11 years and dental age is not yet established.",
      "Asymmetric loss is planned — balancing/compensating considerations needed.",
      "Hypodontia or crowding may alter the extraction plan.",
      "Family declines orthodontic review — record the discussion and revised plan.",
    ],
  },

  minimumRecordSet: PAED_MINIMUM_RECORD_SET,

  auditPrompts: [
    "First-permanent-molar status reviewed at every recall.",
    "MIH diagnosis recorded separately from caries.",
    "Restorative approach matches severity.",
    "Orthodontic referral arranged before extraction decisions.",
    "Compensating/balancing plan documented.",
  ],

  clinicalSources: [
    PAED_REF.bspdGuidelines,
    PAED_REF.niceMolar,
    PAED_REF.sdcepCaries,
    PAED_REF.dbohQRG,
    PAED_REF.localReferral,
  ],

  version: {
    ...PAED_VERSION_BASE,
    changeSummary: "Initial published version. Drafted from BSPD UK national clinical guidelines on first permanent molars, MIH management literature, SDCEP caries guidance and Delivering Better Oral Health. Requires Clinical Director review and local approval before live adoption.",
  },
};
