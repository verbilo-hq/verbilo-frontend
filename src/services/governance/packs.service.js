/**
 * Governance Pack Instance — one per (tenant, packKey).
 * Stores org-level setup data + transitions the pack-level state machine.
 */

import { Store, TABLES } from "./store";
import { PackStatus } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { DECON_PACK_KEY } from "./seed";
import { listPackConfigs, getPackConfig } from "./packConfig";

export { DECON_PACK_KEY };

/** Catalogue is now sourced from packConfig.js — single source of truth for
 *  every pack's name, subtitle, description, standards, icon, colour and
 *  included items. Every pack is treated identically: same setup wizard,
 *  same "Start Setup" entry point, no per-pack status badges on the card. */
export function listPackCatalogue() {
  return listPackConfigs();
}

export function getPackCatalogueEntry(packKey) {
  return getPackConfig(packKey);
}

export function getPackInstance(tenantId, packKey = DECON_PACK_KEY) {
  return Store.list(tenantId, TABLES.packs).find((r) => r.packKey === packKey) ?? null;
}

/** Returns the User row currently named as the group's Clinical Director for
 *  the given pack (defaults to clinical_governance — the only pack where the
 *  CD is the legal adopter today). Returns null if no CD is named yet. */
export function getClinicalDirector(tenantId, packKey = "clinical_governance") {
  const pack = getPackInstance(tenantId, packKey);
  if (!pack?.clinicalDirectorUserId) return null;
  return Store.get(tenantId, TABLES.users, pack.clinicalDirectorUserId);
}

/** Set / change the named Clinical Director for the group. Used by the
 *  one-screen Confirm Clinical Director step before the protocol library is
 *  opened for the first time. The pack instance is created on demand if it
 *  doesn't already exist. */
export function setClinicalDirector(user, userId, packKey = "clinical_governance") {
  const pack = ensurePackInstance(user.tenantId, packKey);
  const prev = { ...pack };
  const next = Store.update(user.tenantId, TABLES.packs, pack.id, { clinicalDirectorUserId: userId });
  logAction(user, {
    objectType: "pack",
    objectId: pack.id,
    action: "set_clinical_director",
    previousValue: { clinicalDirectorUserId: prev.clinicalDirectorUserId },
    newValue: { clinicalDirectorUserId: userId },
  });
  return next;
}

/** Returns the group / organisation display name for this tenant. Reads from
 *  any existing pack instance that has `groupName` set. Once we have a real
 *  Tenant table, this swaps to a single read on that table. */
export function getTenantName(tenantId) {
  const withName = Store.list(tenantId, TABLES.packs).find((p) => p.groupName);
  return withName?.groupName ?? "Your dental group";
}

/** Returns the existing pack instance for (tenant, packKey), or creates a
 *  fresh `not_started` instance if none exists. Called when a user enters the
 *  setup wizard for a pack that hasn't been touched before. */
export function ensurePackInstance(tenantId, packKey) {
  const existing = getPackInstance(tenantId, packKey);
  if (existing) return existing;
  return Store.insert(tenantId, TABLES.packs, {
    packKey,
    status: PackStatus.not_started,
    groupName: "",
    brandColor: "#1e6dd8",
    reviewCycleMonths: 12,
    clinicalDirectorUserId: null,
    defaultApproverUserId: null,
    defaultReviewerUserId: null,
    equipmentCategoriesEnabled: {},
  });
}

export function updatePackSetup(user, patch, packKey = DECON_PACK_KEY) {
  assertCan(user, "pack.configure");
  const pack = getPackInstance(user.tenantId, packKey);
  if (!pack) return null;
  const prev = { ...pack };
  // Setting any field implicitly moves us into in_setup.
  const next = Store.update(user.tenantId, TABLES.packs, pack.id, {
    ...patch,
    status: pack.status === "not_started" ? PackStatus.in_setup : pack.status,
  });
  logAction(user, {
    objectType: "pack",
    objectId: pack.id,
    action: "configure",
    previousValue: prev,
    newValue: next,
  });
  return next;
}

export function transitionPack(user, event, packKey = DECON_PACK_KEY) {
  const pack = getPackInstance(user.tenantId, packKey);
  if (!pack) return null;
  let next = pack;
  switch (event) {
    case "submit_for_approval":
      assertCan(user, "pack.submit_for_approval");
      if (pack.status !== PackStatus.in_setup) return pack;
      next = Store.update(user.tenantId, TABLES.packs, pack.id, { status: PackStatus.awaiting_approval });
      break;
    case "approve":
      assertCan(user, "pack.approve");
      if (pack.status !== PackStatus.awaiting_approval) return pack;
      next = Store.update(user.tenantId, TABLES.packs, pack.id, { status: PackStatus.live });
      break;
    case "return":
      assertCan(user, "pack.approve");
      if (pack.status !== PackStatus.awaiting_approval) return pack;
      next = Store.update(user.tenantId, TABLES.packs, pack.id, { status: PackStatus.in_setup });
      break;
    default:
      return pack;
  }
  logAction(user, {
    objectType: "pack",
    objectId: pack.id,
    action: event,
    previousValue: { status: pack.status },
    newValue: { status: next.status },
  });
  return next;
}

/**
 * Reset a single pack to "fresh demo" state — wipes the pack instance and
 * everything tied to it (site profiles, acknowledgements, evidence, audit
 * schedules, pack-related audit-trail rows) so the catalogue card shows the
 * pack as `not_configured` and opening it drops into the setup wizard.
 *
 * Preserves: users, sites, equipment, documents, document_versions.
 *
 * Intended for demo flows where a sales engineer walks a prospective client
 * through "fresh setup → live" then resets for the next client.
 */
export function resetPackForDemo(user, packKey) {
  if (!user?.tenantId || !packKey) return false;
  assertCan(user, "pack.reset");
  const tenantId = user.tenantId;

  const pack = getPackInstance(tenantId, packKey);
  if (!pack) {
    // Already in fresh state — nothing to reset, but record the no-op for
    // demo-flow visibility.
    logAction(user, { objectType: "pack", action: "reset_for_demo", newValue: { packKey, note: "already not configured" } });
    return true;
  }
  const packId = pack.id;

  // Acknowledgements — keyed by documentId, so collect docIds for this pack
  // and remove every ack pointing at one of them.
  const docs = Store.list(tenantId, TABLES.documents).filter((d) => d.packKey === packKey);
  const docIds = new Set(docs.map((d) => d.id));
  for (const ack of Store.list(tenantId, TABLES.acknowledgements)) {
    if (docIds.has(ack.documentId)) Store.remove(tenantId, TABLES.acknowledgements, ack.id);
  }

  // Site profiles — keyed by packInstanceId.
  for (const sp of Store.list(tenantId, TABLES.site_profiles)) {
    if (sp.packInstanceId === packId) Store.remove(tenantId, TABLES.site_profiles, sp.id);
  }

  // Evidence — keyed by packInstanceId (or packKey on newer rows).
  for (const ev of Store.list(tenantId, TABLES.evidence)) {
    if (ev.packInstanceId === packId || ev.packKey === packKey) Store.remove(tenantId, TABLES.evidence, ev.id);
  }

  // Audit schedules.
  for (const a of Store.list(tenantId, TABLES.audits)) {
    if (a.packInstanceId === packId || a.packKey === packKey) Store.remove(tenantId, TABLES.audits, a.id);
  }

  // Operator entitlements — only ones tied to this pack.
  for (const ent of Store.list(tenantId, TABLES.operator_entitlements)) {
    if (ent.packKey === packKey) Store.remove(tenantId, TABLES.operator_entitlements, ent.id);
  }

  // Pack-related audit-trail entries.
  for (const t of Store.list(tenantId, TABLES.audit_trail)) {
    if (t.objectType === "pack" && t.objectId === packId) Store.remove(tenantId, TABLES.audit_trail, t.id);
  }

  // Finally drop the pack instance row itself. The catalogue card will now
  // render the pack as `not_configured` and opening it enters the wizard.
  Store.remove(tenantId, TABLES.packs, packId);

  logAction(user, {
    objectType: "pack",
    action: "reset_for_demo",
    previousValue: { packKey, status: pack.status, packId },
    newValue: { packKey, status: "not_configured" },
  });
  return true;
}
