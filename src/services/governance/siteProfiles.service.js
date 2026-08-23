/**
 * Site Governance Profile — one per (site, packInstance).
 *
 * Persists per-site process flags + local leads for the active governance pack.
 * Schema varies by pack:
 *   - decontamination_ipc → decon flags + decon/ipc/practice/reviewer leads
 *   - radiography_irmer   → radiography flags + irmer/rps leads + rpa/mpe provider
 *
 * Both pack profiles share the same `TABLES.site_profiles` table, partitioned
 * by `packInstanceId`. UI components pass the active pack key in and the
 * service uses the matching flag/lead definitions when computing completion
 * and reconciling site status.
 */

import { Store, TABLES, uuid } from "./store";
import { SiteStatus, SITE_PROFILE_FLAGS_BY_PACK, SITE_PROFILE_FLAGS } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { getPackInstance, DECON_PACK_KEY } from "./packs.service";
import { updateSiteStatus, getSite } from "./sites.service";

const LEADS_BY_PACK = {
  decontamination_ipc: [
    "localDeconLeadUserId",
    "localIpcLeadUserId",
    "practiceManagerUserId",
    "localReviewerUserId",
  ],
  radiography_irmer: [
    "irmerLeadUserId",
    "rpsUserId",
    // RPA / MPE are external providers — counted toward completion as a single
    // composite "filled when name is set" check below; not stored as userIds.
  ],
};

const PROVIDER_FIELDS_BY_PACK = {
  decontamination_ipc: [],
  radiography_irmer: ["rpaProviderName", "mpeProviderName"],
};

function flagsForPack(packKey) {
  return SITE_PROFILE_FLAGS_BY_PACK[packKey] ?? SITE_PROFILE_FLAGS;
}

function leadFieldsForPack(packKey) {
  return LEADS_BY_PACK[packKey] ?? LEADS_BY_PACK.decontamination_ipc;
}

function providerFieldsForPack(packKey) {
  return PROVIDER_FIELDS_BY_PACK[packKey] ?? [];
}

function emptyProfile(tenantId, siteId, packInstanceId, packKey) {
  const flags = flagsForPack(packKey).reduce((acc, f) => ({ ...acc, [f.id]: false }), {});
  const leads = leadFieldsForPack(packKey).reduce((acc, k) => ({ ...acc, [k]: null }), {});
  const providers = providerFieldsForPack(packKey).reduce((acc, k) => ({ ...acc, [k]: "" }), {});
  return {
    id: uuid(),
    tenantId,
    siteId,
    packInstanceId,
    packKey,
    applied: false,
    status: SiteStatus.not_configured,
    ...flags,
    ...leads,
    ...providers,
  };
}

export function getProfile(tenantId, siteId, packInstanceId) {
  return Store.list(tenantId, TABLES.site_profiles).find(
    (r) => r.siteId === siteId && r.packInstanceId === packInstanceId,
  ) ?? null;
}

/** Returns existing profile or inserts a new (empty, not-applied) one. */
export function ensureProfile(user, siteId, packKey = DECON_PACK_KEY) {
  const pack = getPackInstance(user.tenantId, packKey);
  if (!pack) return null;
  const existing = getProfile(user.tenantId, siteId, pack.id);
  if (existing) return existing;
  return Store.insert(
    user.tenantId,
    TABLES.site_profiles,
    emptyProfile(user.tenantId, siteId, pack.id, packKey),
  );
}

export function listProfiles(tenantId, packInstanceId) {
  return Store.list(tenantId, TABLES.site_profiles).filter((r) => r.packInstanceId === packInstanceId);
}

export function setApplied(user, siteId, applied, packKey = DECON_PACK_KEY) {
  assertCan(user, "site.profile.edit", { siteId });
  const profile = ensureProfile(user, siteId, packKey);
  if (!profile) return null;
  const next = Store.update(user.tenantId, TABLES.site_profiles, profile.id, { applied });
  logAction(user, {
    objectType: "site_profile",
    objectId: profile.id,
    siteId,
    action: applied ? "apply" : "exclude",
    previousValue: { applied: profile.applied },
    newValue: { applied },
  });
  reconcileSiteStatus(user, siteId, packKey);
  return next;
}

export function updateProfile(user, siteId, patch, packKey = DECON_PACK_KEY) {
  assertCan(user, "site.profile.edit", { siteId });
  const profile = ensureProfile(user, siteId, packKey);
  if (!profile) return null;
  const next = Store.update(user.tenantId, TABLES.site_profiles, profile.id, patch);
  logAction(user, {
    objectType: "site_profile",
    objectId: profile.id,
    siteId,
    action: "edit",
    previousValue: profile,
    newValue: next,
  });
  reconcileSiteStatus(user, siteId, packKey);
  return next;
}

/** Returns the list of profile flags + counts (filled/total) for a profile. */
export function profileCompletion(profile, packKey) {
  const key = packKey ?? profile?.packKey ?? DECON_PACK_KEY;
  const flags = flagsForPack(key);
  const leads = leadFieldsForPack(key);
  const providers = providerFieldsForPack(key);
  const total = flags.length + leads.length + providers.length;
  if (!profile) return { filled: 0, total, pct: 0 };
  let filled = 0;
  for (const f of flags) if (profile[f.id]) filled += 1;
  for (const k of leads) if (profile[k]) filled += 1;
  for (const k of providers) if (profile[k]) filled += 1;
  return { filled, total, pct: total ? Math.round((filled / total) * 100) : 0 };
}

function reconcileSiteStatus(user, siteId, packKey = DECON_PACK_KEY) {
  const pack = getPackInstance(user.tenantId, packKey);
  const profile = getProfile(user.tenantId, siteId, pack?.id);
  const site = getSite(user.tenantId, siteId);
  if (!profile || !site) return;
  let nextStatus = SiteStatus.not_configured;
  if (!profile.applied) {
    nextStatus = SiteStatus.not_configured;
  } else {
    const { pct } = profileCompletion(profile, packKey);
    if (pct === 0) nextStatus = SiteStatus.not_configured;
    else if (pct < 100) nextStatus = SiteStatus.partially_configured;
    else nextStatus = SiteStatus.ready_for_approval;
  }
  if (site.status !== nextStatus) updateSiteStatus(user, siteId, nextStatus);
}
