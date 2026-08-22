/**
 * Pack approval cascade — what happens when the Clinical Director clicks
 * "Approve & Publish" on a pack that's in `awaiting_approval`.
 *
 * Orchestrates the existing per-service publish / assign / schedule helpers
 * so the pack going live actually means everything attached to it goes live:
 *   - Every draft / in_review / approved doc in the pack is published
 *   - Staff acknowledgement tasks are generated for each published doc
 *   - Audit schedules are activated per applied site × audit type
 *   - Rejected docs are left alone (author needs to fix them first)
 *   - Already-published docs are skipped (no-op)
 */

import { Store, TABLES } from "./store";
import { DocumentStatus } from "./types";
import { logAction } from "./auditTrail";
import {
  listDocuments, publishVersion, getCurrentVersion,
} from "./documents.service";
import { assignOnPublish } from "./acknowledgements.service";
import { generateScheduleForLivePack } from "./audits.service";

const PUBLISHABLE_STATUSES = [
  DocumentStatus.draft,
  DocumentStatus.in_review,
  DocumentStatus.approved,
];

/**
 * Dry-run: what would happen if the CD clicked Approve right now? Returns
 * counts + the list of affected docs / schedules — used to populate the
 * approval screen summary before any mutation happens.
 */
export function previewApprovalCascade(tenantId, packKey, appliedProfiles, allUsers) {
  const packDocs = listDocuments(tenantId, { packKey, includeArchived: false });
  const toPublish = packDocs.filter((d) => PUBLISHABLE_STATUSES.includes(d.status));
  const rejected = packDocs.filter((d) => d.status === DocumentStatus.rejected);
  const alreadyPublished = packDocs.filter((d) => d.status === DocumentStatus.published);

  // Approximate ack count — for each publishable doc that requires ack, count
  // the staff at applied sites who'd be assigned. Matches the rules in
  // assignOnPublish().
  const ackRoles = new Set(["staff", "site_lead", "practice_manager", "clinical_director", "ipc_lead", "decontamination_lead"]);
  const appliedSiteIds = new Set(appliedProfiles.map((p) => p.siteId));
  let ackCount = 0;
  for (const d of toPublish) {
    if (!d.acknowledgementRequired) continue;
    const targets = (allUsers ?? []).filter((u) => {
      if (!ackRoles.has(u.role)) return false;
      const scope = d.scope === "site" ? new Set([d.appliesToSiteId].filter(Boolean)) : appliedSiteIds;
      if (scope.size > 0 && u.siteId && !scope.has(u.siteId)) return false;
      return true;
    });
    ackCount += targets.length;
  }

  // Audit schedules that will be created (one per [site, auditType] without
  // an existing schedule). For preview accuracy we mirror the logic in
  // generateScheduleForLivePack.
  const existingSchedules = Store.list(tenantId, TABLES.audits);
  const existingKey = new Set(existingSchedules.map((s) => `${s.siteId}::${s.auditType}`));
  // Pull AUDIT_TYPES indirectly from auditTypesForPack via the schedules helper
  // — for the preview we estimate using all types not currently scheduled.
  // (Full enumeration happens server-side inside generateScheduleForLivePack.)
  const newScheduleEstimate = Math.max(
    0,
    appliedProfiles.length * 7 - existingSchedules.length, // rough estimate
  );

  return {
    toPublish,
    rejected,
    alreadyPublished,
    ackCount,
    newScheduleEstimate,
    existingScheduleCount: existingSchedules.length,
  };
}

/**
 * Run the cascade. Returns a summary of what was done so the UI can show a
 * post-approval toast/confirmation.
 */
export function publishPackForApproval(user, packKey, packInstance, appliedProfiles, allUsers, sites) {
  const tenantId = user.tenantId;
  const packDocs = listDocuments(tenantId, { packKey, includeArchived: false });

  const sitesWithApplied = sites.map((s) => ({
    ...s,
    appliedToPack: appliedProfiles.some((p) => p.siteId === s.id),
  }));

  const published = [];
  const skippedRejected = [];
  let acksCreated = 0;

  for (const doc of packDocs) {
    if (doc.status === DocumentStatus.rejected) {
      skippedRejected.push(doc);
      continue;
    }
    if (!PUBLISHABLE_STATUSES.includes(doc.status)) continue;

    const version = getCurrentVersion(tenantId, doc.id);
    if (!version) continue;

    // Promote to approved-equivalent then publish. publishVersion accepts
    // draft OR approved versions and handles the transition + archiving of
    // older published versions.
    const result = publishVersion(user, doc.id, version.id, {
      major: true,
      reviewCycleMonths: packInstance.reviewCycleMonths ?? 12,
    });
    if (!result) continue;
    published.push(doc);

    const acks = assignOnPublish(user, doc.id, version.id, {
      major: true,
      allUsers,
      sites: sitesWithApplied,
    });
    acksCreated += acks.length;
  }

  // Activate audit schedules for the applied sites, honouring any per-audit
  // frequency / owner overrides set in the Audit & Evidence Setup step.
  const newSchedules = generateScheduleForLivePack(user, appliedProfiles, packInstance);

  logAction(user, {
    objectType: "pack",
    objectId: packInstance.id,
    action: "approval_cascade",
    newValue: {
      packKey,
      publishedCount: published.length,
      acksCreated,
      schedulesCreated: newSchedules.length,
      rejectedSkipped: skippedRejected.length,
    },
  });

  return {
    published,
    acksCreated,
    schedulesCreated: newSchedules.length,
    skippedRejected,
  };
}

/**
 * Record a "return for changes" with the reviewer's comment. The actual
 * status transition (back to in_setup) is handled by transitionPack.
 */
export function recordReturnComment(user, packInstance, packKey, comment) {
  logAction(user, {
    objectType: "pack",
    objectId: packInstance.id,
    action: "return_for_changes",
    previousValue: { packKey, status: packInstance.status },
    newValue: { comment: (comment ?? "").trim() || "(no comment)" },
  });
}
