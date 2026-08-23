/**
 * Dental Group — 6 sites with deliberately varied
 * decontamination profiles so the system can demonstrate per-site
 * SOP / evidence / audit activation.
 *
 * Site ids + names are now CANONICAL: each legacy governance site id is folded
 * onto the shared taxonomy via resolveSiteId() and labelled via siteName()
 * (services/sites.js). The fold is brighton→southall, hove→reading,
 * worthing→new-cross, crawley→london, guildford→manchester,
 * portsmouth→birmingham. Shape (id/name/location/active/initialStatus/profile/
 * leads) is unchanged — only id + name + location VALUES become canonical so
 * the whole app converges on one set of sites + names.
 */

import { SiteStatus } from "../types";
import { resolveSiteId, siteName } from "../../sites";

/* Resolve a legacy governance site id → canonical id + display name once, so
 * the record below stays readable and the fold lives in exactly one place. */
const canonical = (legacyId) => {
  const id = resolveSiteId(legacyId);
  const name = siteName(id);
  return { id, name, location: name };
};

const C = {
  brighton:   canonical("site-brighton"),
  hove:       canonical("site-hove"),
  worthing:   canonical("site-worthing"),
  crawley:    canonical("site-crawley"),
  guildford:  canonical("site-guildford"),
  portsmouth: canonical("site-portsmouth"),
};

export const DEMO_SITES = [
  {
    id:       C.brighton.id,
    name:     C.brighton.name,
    location: C.brighton.location,
    active:   true,
    // Fully configured + live
    initialStatus: SiteStatus.live,
    profile: {
      applied: true,
      processOnSite: true,
      processCentrally: false,
      manualCleaning: true,
      ultrasonicBath: true,
      washerDisinfector: true,
      autoclave: true,
      instrumentsPouched: true,
      waterlineManagement: true,
      amalgamWaste: true,
      sharpsDisposal: true,
      clinicalWasteTransferNotes: true,
    },
    leads: {
      localDeconLeadUserId:  "user-decon-brighton",
      localIpcLeadUserId:    "user-ipc-brighton",
      practiceManagerUserId: "user-pm-brighton",
      localReviewerUserId:   "user-gov",
    },
  },
  {
    id:       C.hove.id,
    name:     C.hove.name,
    location: C.hove.location,
    active:   true,
    initialStatus: SiteStatus.live,
    profile: {
      applied: true,
      processOnSite: true,
      processCentrally: false,
      manualCleaning: true,
      ultrasonicBath: true,
      washerDisinfector: false,   // no WD
      autoclave: true,
      instrumentsPouched: true,
      waterlineManagement: true,
      amalgamWaste: false,        // no amalgam waste
      sharpsDisposal: true,
      clinicalWasteTransferNotes: true,
    },
    leads: {
      localDeconLeadUserId:  "user-decon-hove",
      localIpcLeadUserId:    "user-ipc-hove",
      practiceManagerUserId: "user-pm-hove",
      localReviewerUserId:   "user-gov",
    },
  },
  {
    id:       C.worthing.id,
    name:     C.worthing.name,
    location: C.worthing.location,
    active:   true,
    initialStatus: SiteStatus.evidence_overdue,
    profile: {
      applied: true,
      processOnSite: true,
      processCentrally: false,
      manualCleaning: false,      // contingency only — flagged off for activation
      ultrasonicBath: false,      // no ultrasonic
      washerDisinfector: true,
      autoclave: true,
      instrumentsPouched: true,
      waterlineManagement: true,
      amalgamWaste: true,
      sharpsDisposal: true,
      clinicalWasteTransferNotes: true,
    },
    leads: {
      localDeconLeadUserId:  "user-decon-worthing",
      localIpcLeadUserId:    "user-ipc-worthing",
      practiceManagerUserId: "user-pm-worthing",
      localReviewerUserId:   "user-gov",
    },
  },
  {
    id:       C.crawley.id,
    name:     C.crawley.name,
    location: C.crawley.location,
    active:   true,
    initialStatus: SiteStatus.review_due,
    profile: {
      applied: true,
      processOnSite: true,
      processCentrally: false,
      manualCleaning: true,
      ultrasonicBath: true,
      washerDisinfector: false,
      autoclave: true,
      instrumentsPouched: false,   // not routinely pouched
      waterlineManagement: true,
      amalgamWaste: false,
      sharpsDisposal: true,
      clinicalWasteTransferNotes: true,
    },
    leads: {
      localDeconLeadUserId:  "user-decon-crawley",
      localIpcLeadUserId:    "user-ipc-crawley",
      practiceManagerUserId: "user-pm-crawley",
      localReviewerUserId:   "user-gov",
    },
  },
  {
    id:       C.guildford.id,
    name:     C.guildford.name,
    location: C.guildford.location,
    active:   true,
    initialStatus: SiteStatus.partially_configured,
    // Partial config: a couple of flags set but no leads and no equipment
    profile: {
      applied: true,
      processOnSite: true,
      processCentrally: false,
      manualCleaning: true,
      ultrasonicBath: false,
      washerDisinfector: false,
      autoclave: true,
      instrumentsPouched: false,
      waterlineManagement: false,
      amalgamWaste: false,
      sharpsDisposal: true,
      clinicalWasteTransferNotes: true,
    },
    leads: {
      // Deliberately incomplete — Practice Manager only; no decon/ipc/reviewer
      practiceManagerUserId: "user-pm-guildford",
    },
  },
  {
    id:       C.portsmouth.id,
    name:     C.portsmouth.name,
    location: C.portsmouth.location,
    active:   false,
    initialStatus: SiteStatus.not_configured,
    // Onboarding — not applied to the pack at all
    profile: {
      applied: false,
      processOnSite: false,
      processCentrally: false,
      manualCleaning: false,
      ultrasonicBath: false,
      washerDisinfector: false,
      autoclave: false,
      instrumentsPouched: false,
      waterlineManagement: false,
      amalgamWaste: false,
      sharpsDisposal: false,
      clinicalWasteTransferNotes: false,
    },
    leads: {},
  },
];
