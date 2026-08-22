/**
 * Controlled documents + their versions.
 *
 * Lifecycle (status state machine):
 *   template → draft → in_review → approved → published
 *                              ↓
 *                          rejected → draft
 *
 * Plus terminal/derived states: review_due, expired, archived.
 *
 * Rules implemented here:
 *   - Editing a published document creates a new draft version, never mutates
 *     the published version directly.
 *   - A published document's `currentVersionId` always points to the most
 *     recent live version.
 *   - Major version bumps invalidate existing acknowledgements (handled in
 *     acknowledgements.service.js when publish() is called).
 *   - Archived versions remain accessible to authorised users via
 *     `listVersions(documentId)`.
 *   - Staff only see documents with status === 'published' (filtered by
 *     `visibleDocuments` in permissions.js).
 */

import { Store, TABLES, uuid } from "./store";
import { DocumentStatus, DocumentScope } from "./types";
import { assertCan } from "./permissions";
import { logAction } from "./auditTrail";
import { listMasterTemplates } from "./masterTemplates.service";
import { tierFor, shouldActivate, SopTier } from "./sopTiers";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function nextVersionNumber(versions, major) {
  // versions ordered any way; pick highest semver-ish.
  let maxMajor = 0;
  let maxMinor = 0;
  for (const v of versions) {
    const m = /^(\d+)\.(\d+)/.exec(v.versionNumber);
    if (!m) continue;
    const M = +m[1];
    const N = +m[2];
    if (M > maxMajor || (M === maxMajor && N > maxMinor)) {
      maxMajor = M;
      maxMinor = N;
    }
  }
  if (versions.length === 0) return "1.0";
  return major ? `${maxMajor + 1}.0` : `${maxMajor}.${maxMinor + 1}`;
}

function defaultReviewDate(months = 12) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

/* ─── Reads ────────────────────────────────────────────────────────────────── */

export function listDocuments(tenantId, { packKey, type, category, status, scope, includeArchived } = {}) {
  const rows = Store.list(tenantId, TABLES.documents).filter((d) => {
    if (packKey && d.packKey !== packKey) return false;
    if (type && d.type !== type) return false;
    if (category && d.category !== category) return false;
    if (status && d.status !== status) return false;
    if (scope && d.scope !== scope) return false;
    if (!includeArchived && d.status === DocumentStatus.archived) return false;
    return true;
  });
  return rows;
}

export function getDocument(tenantId, id) {
  return Store.get(tenantId, TABLES.documents, id);
}

export function listVersions(tenantId, documentId) {
  return Store.list(tenantId, TABLES.document_versions).filter((v) => v.documentId === documentId);
}

export function getCurrentVersion(tenantId, documentId) {
  const doc = getDocument(tenantId, documentId);
  if (!doc?.currentVersionId) return null;
  return Store.get(tenantId, TABLES.document_versions, doc.currentVersionId);
}

/* ─── Mutations ────────────────────────────────────────────────────────────── */

/**
 * Activate template docs into draft state when the user wants to start editing
 * them — only the docs whose `requiredFlag` is enabled by at least one
 * applied site profile remain. Returns the activated docs.
 *
 * Legacy path: reads tenant-scoped docs with status='template'. Kept for
 * back-compat; new flow goes through `activateFromMasterLibrary` below.
 */
export function activateRelevantDocuments(user, packInstanceId, siteProfileFlagsUnion) {
  const docs = Store.list(user.tenantId, TABLES.documents).filter(
    (d) => d.packKey && (d.status === DocumentStatus.template),
  );
  const activated = [];
  for (const d of docs) {
    if (d.requiredFlag && !siteProfileFlagsUnion[d.requiredFlag]) continue;
    const next = Store.update(user.tenantId, TABLES.documents, d.id, {
      status: DocumentStatus.draft,
      packInstanceId,
    });
    const currentVersion = Store.get(user.tenantId, TABLES.document_versions, d.currentVersionId);
    if (currentVersion) {
      Store.update(user.tenantId, TABLES.document_versions, currentVersion.id, {
        status: DocumentStatus.draft,
      });
    }
    logAction(user, {
      objectType: "document",
      objectId: d.id,
      action: "activate",
      previousValue: { status: DocumentStatus.template },
      newValue: { status: DocumentStatus.draft },
    });
    activated.push(next);
  }
  return activated;
}

/**
 * Clone relevant master templates from the SaaS Master Template Library into
 * the tenant's document register as drafts. Idempotent — skips any master
 * already represented in the tenant docs (matched by sourceMasterTemplateId
 * or by title). Returns a summary so the wizard step can show what happened.
 */
export function activateFromMasterLibrary(user, packInstanceId, packKey, siteProfileFlagsUnion) {
  const masters = listMasterTemplates(packKey).filter((m) => m.status === "active");
  const tenantDocs = Store.list(user.tenantId, TABLES.documents).filter((d) => d.packKey === packKey);
  const existingMasterIds = new Set(tenantDocs.filter((d) => d.sourceMasterTemplateId).map((d) => d.sourceMasterTemplateId));
  const existingTitles = new Set(tenantDocs.map((d) => d.title));

  /* Pattern C — tier-aware activation. Pull the pack's selection overrides
   * map: { [masterTemplateId]: 'skip' | 'opt-in' }. Statutory ignores the
   * map; recommended honours 'skip'; optional only activates on 'opt-in'. */
  const packInstance = Store.get(user.tenantId, TABLES.packs, packInstanceId);
  const overrides = packInstance?.sopSelectionOverrides ?? {};

  const activated = [];
  const skipped = [];
  const skippedByUser = [];      // skipped because the user opted out
  const optionalAvailable = [];  // optional masters not yet opted-in
  const alreadyPresent = [];

  for (const m of masters) {
    if (existingMasterIds.has(m.id) || existingTitles.has(m.title)) {
      alreadyPresent.push(m);
      continue;
    }
    if (m.requiredFlag && !siteProfileFlagsUnion[m.requiredFlag]) {
      skipped.push(m);
      continue;
    }
    // Tier-aware gating. shouldActivate() handles statutory-locked-on,
    // recommended-skippable, optional-opt-in-only.
    if (!shouldActivate(m, overrides)) {
      if (tierFor(m) === SopTier.optional) optionalAvailable.push(m);
      else skippedByUser.push(m);
      continue;
    }

    const docId = uuid();
    const versionId = uuid();
    Store.insert(user.tenantId, TABLES.documents, {
      id: docId,
      tenantId: user.tenantId,
      packKey,
      packInstanceId,
      sourceMasterTemplateId: m.id,
      title: m.title,
      type: m.type,
      category: m.category,
      scope: DocumentScope.group,
      appliesToSiteId: null,
      appliesToRole: null,
      requiredFlag: m.requiredFlag ?? null,
      linkedAuditType: m.linkedAuditType ?? null,
      references: m.references ?? [],
      acknowledgementRequired: m.acknowledgementRequired ?? true,
      currentVersionId: versionId,
      status: DocumentStatus.draft,
    });
    Store.insert(user.tenantId, TABLES.document_versions, {
      id: versionId,
      documentId: docId,
      versionNumber: m.version ?? "1.0",
      major: true,
      body: m.body ?? "",
      ownerUserId: null,
      reviewerUserId: null,
      approverUserId: null,
      status: DocumentStatus.draft,
    });
    logAction(user, {
      objectType: "document",
      objectId: docId,
      action: "activate_from_master",
      newValue: { sourceMasterTemplateId: m.id, title: m.title, packKey },
    });
    activated.push({ docId, master: m });
  }

  return { activated, skipped, skippedByUser, optionalAvailable, alreadyPresent };
}

/**
 * Pattern C — record the user's tier-level decision for one master template.
 * Persists the decision on the pack instance, logs an audit-trail entry,
 * and (for skip-after-already-activated) archives the existing draft.
 *
 *   action:  'skip'   — user opts out of a recommended SOP (or reverses
 *                       an earlier opt-in on an optional SOP)
 *            'opt-in' — user opts in to an optional SOP (or reverses an
 *                       earlier skip on a recommended one)
 *            'reset'  — user clears their override; behaviour reverts to
 *                       tier default (statutory + recommended on, optional off)
 *
 *   reason / notes are required when action is 'skip' (UI must enforce);
 *   captured for the audit trail.
 *
 * The caller should then re-run activateFromMasterLibrary to materialise
 * any new opt-ins. This function does NOT trigger activation itself —
 * keeping the two concerns separate makes the activation logic single-pass.
 */
export function setSopSelection(user, packInstanceId, masterTemplateId, action, { reason = null, notes = null } = {}) {
  assertCan(user, "pack.edit_setup");
  const pack = Store.get(user.tenantId, TABLES.packs, packInstanceId);
  if (!pack) return null;

  const master = listMasterTemplates(pack.packKey).find((m) => m.id === masterTemplateId);
  if (!master) {
    // eslint-disable-next-line no-console
    console.warn(`[setSopSelection] Master template ${masterTemplateId} not found in pack ${pack.packKey}`);
    return null;
  }

  // Statutory SOPs cannot be skipped — enforced server-side as a defence
  // in depth even if the UI accidentally exposes the action.
  if (tierFor(master) === SopTier.statutory && action === "skip") {
    // eslint-disable-next-line no-console
    console.warn(`[setSopSelection] Refused to skip statutory SOP ${master.title} (id ${masterTemplateId}).`);
    return null;
  }

  const prevOverrides = pack.sopSelectionOverrides ?? {};
  const prevReasons   = pack.sopSkipReasons       ?? {};

  const nextOverrides = { ...prevOverrides };
  const nextReasons   = { ...prevReasons };

  if (action === "reset") {
    delete nextOverrides[masterTemplateId];
    delete nextReasons[masterTemplateId];
  } else {
    nextOverrides[masterTemplateId] = action;
    if (action === "skip") {
      nextReasons[masterTemplateId] = {
        reason,
        notes,
        userId: user.id,
        at:     new Date().toISOString(),
      };
    } else {
      // opt-in clears any prior skip-reason from the audit slot
      delete nextReasons[masterTemplateId];
    }
  }

  Store.update(user.tenantId, TABLES.packs, packInstanceId, {
    sopSelectionOverrides: nextOverrides,
    sopSkipReasons:        nextReasons,
  });

  // If the user is skipping a SOP that's already been activated as a
  // draft, archive the live row. Don't touch approved / published ones —
  // those require the formal archive flow with reviewer sign-off.
  if (action === "skip") {
    const liveDoc = Store.list(user.tenantId, TABLES.documents).find(
      (d) => d.packKey === pack.packKey
        && d.sourceMasterTemplateId === masterTemplateId
        && d.status === DocumentStatus.draft,
    );
    if (liveDoc) {
      Store.update(user.tenantId, TABLES.documents, liveDoc.id, {
        status: DocumentStatus.archived,
      });
    }
  }

  logAction(user, {
    objectType: "pack",
    objectId:   packInstanceId,
    action:     "sop_selection_change",
    newValue:   { masterTemplateId, masterTitle: master.title, tier: tierFor(master), action, reason, notes },
  });

  return { overrides: nextOverrides, reasons: nextReasons };
}

/**
 * Pattern C — confirm a previous skip *after* the gating flag has flipped on.
 *
 * Use case: a Recommended SOP gated by flag X was skipped when X was off.
 * The user later enables X at a site, making the SOP applicable again.
 * The platform surfaces a re-evaluation banner. If the user chooses
 * "Keep skipped" rather than activate, we don't change the override —
 * we just stamp `confirmedAt` on the existing skip reason and log an
 * audit-trail entry so inspectors can see the decision was made under
 * the new flag context (not just a stale skip from before X was applicable).
 *
 * Returns the updated reasons map, or null if no prior skip exists to
 * confirm (caller's UI must have called this in error).
 */
export function confirmSopSkipAfterReEvaluation(user, packInstanceId, masterTemplateId) {
  assertCan(user, "pack.edit_setup");
  const pack = Store.get(user.tenantId, TABLES.packs, packInstanceId);
  if (!pack) return null;

  const prevReasons = pack.sopSkipReasons ?? {};
  const existing = prevReasons[masterTemplateId];
  if (!existing) {
    // eslint-disable-next-line no-console
    console.warn(`[confirmSopSkipAfterReEvaluation] No prior skip reason for master ${masterTemplateId} — cannot confirm.`);
    return null;
  }

  const master = listMasterTemplates(pack.packKey).find((m) => m.id === masterTemplateId);
  const nextReasons = {
    ...prevReasons,
    [masterTemplateId]: {
      ...existing,
      confirmedAt:  new Date().toISOString(),
      confirmedBy:  user.id,
      confirmReason: "flag_change_re_evaluation",
    },
  };

  Store.update(user.tenantId, TABLES.packs, packInstanceId, {
    sopSkipReasons: nextReasons,
  });

  logAction(user, {
    objectType: "pack",
    objectId:   packInstanceId,
    action:     "sop_skip_confirmed",
    newValue:   {
      masterTemplateId,
      masterTitle: master?.title,
      reason:      existing.reason,
      originalAt:  existing.at,
      confirmedAt: nextReasons[masterTemplateId].confirmedAt,
      context:     "flag_change_re_evaluation",
    },
  });

  return { reasons: nextReasons };
}

/* Per-pack: which equipment types are governed by which site profile flag.
 * Used to populate site appendix bodies with relevant equipment register data. */
const FLAG_TO_EQ_TYPES_BY_PACK = {
  decontamination_ipc: {
    autoclave:           ["autoclave"],
    washerDisinfector:   ["washer_disinfector"],
    ultrasonicBath:      ["ultrasonic_bath"],
    waterlineManagement: ["waterline_system"],
  },
  radiography_irmer: {
    intraoralXray:  ["intraoral_xray"],
    opgXray:        ["opg_xray"],
    cbctXray:       ["cbct_xray"],
    handheldXray:   ["handheld_xray"],
    digitalSensors: ["digital_sensor"],
    phosphorPlates: ["phosphor_plate_scanner"],
  },
};

/**
 * Auto-create site-specific appendices for every flag-bound group SOP × every
 * applied site whose profile enables that flag. Idempotent — skips any
 * (parent SOP, site) pair that already has an appendix. Pre-fills the body
 * from the site's equipment register where the parent has a known flag→type
 * mapping. Returns the IDs of newly created appendices.
 */
export function ensureSiteAppendicesForPack(user, packKey, packInstance, appliedProfiles, sitesById, equipmentBySiteProfileId) {
  const tenantId = user.tenantId;
  // Eligible parents: this pack's group-scope docs with a requiredFlag, in a
  // live or in-flight state (skip archived/template).
  const packDocs = Store.list(tenantId, TABLES.documents).filter(
    (d) => d.packKey === packKey
      && d.scope === "group"
      && d.requiredFlag
      && ![DocumentStatus.archived, DocumentStatus.template].includes(d.status),
  );
  const existingAppendices = Store.list(tenantId, TABLES.documents).filter(
    (d) => d.type === "appendix" && d.parentDocumentId && d.appliesToSiteId,
  );
  const existingKey = new Set(existingAppendices.map((d) => `${d.parentDocumentId}::${d.appliesToSiteId}`));
  const flagToTypes = FLAG_TO_EQ_TYPES_BY_PACK[packKey] ?? {};

  const created = [];
  for (const parent of packDocs) {
    for (const profile of appliedProfiles) {
      if (!profile[parent.requiredFlag]) continue;
      const key = `${parent.id}::${profile.siteId}`;
      if (existingKey.has(key)) continue;
      const site = sitesById[profile.siteId];
      if (!site) continue;
      const equipment = (equipmentBySiteProfileId[profile.id] ?? []);
      const relevantTypes = flagToTypes[parent.requiredFlag] ?? [];
      const relevantEq = relevantTypes.length
        ? equipment.filter((e) => relevantTypes.includes(e.type))
        : [];

      const docId = uuid();
      const versionId = uuid();
      Store.insert(tenantId, TABLES.documents, {
        id: docId,
        tenantId,
        packKey,
        packInstanceId: packInstance.id,
        title: `${parent.title} — ${site.name} Appendix`,
        type: "appendix",
        category: parent.category,
        scope: "site",
        appliesToSiteId: site.id,
        parentDocumentId: parent.id,
        requiredFlag: parent.requiredFlag,
        linkedAuditType: parent.linkedAuditType,
        references: [],
        acknowledgementRequired: true,
        currentVersionId: versionId,
        status: DocumentStatus.draft,
      });
      Store.insert(tenantId, TABLES.document_versions, {
        id: versionId,
        documentId: docId,
        versionNumber: "1.0",
        major: true,
        body: generateAppendixBody({ parent, site, equipment: relevantEq }),
        ownerUserId: null,
        reviewerUserId: null,
        approverUserId: null,
        status: DocumentStatus.draft,
      });
      logAction(user, {
        objectType: "document",
        objectId: docId,
        siteId: site.id,
        action: "create_site_appendix",
        newValue: { parentDocumentId: parent.id, appliesToSiteId: site.id, title: `${parent.title} — ${site.name} Appendix` },
      });
      created.push({ docId, parentId: parent.id, siteId: site.id });
    }
  }
  return created;
}

function generateAppendixBody({ parent, site, equipment }) {
  const equipBlock = equipment.length
    ? equipment.map((e) => [
        `- **${e.makeModel}**`,
        e.serialNumber ? `  - Serial: ${e.serialNumber}` : null,
        e.roomLocation ? `  - Location: ${e.roomLocation}` : null,
        e.serviceProvider ? `  - Service provider: ${e.serviceProvider}` : null,
        e.nextServiceDate ? `  - Next service: ${e.nextServiceDate.split("T")[0]}` : null,
      ].filter(Boolean).join("\n")).join("\n\n")
    : "_No equipment recorded for this category — add entries in the Equipment Register before publishing this appendix._";

  return `# ${parent.title} — ${site.name} Appendix

Site-specific addendum to the group document **${parent.title}**. Read alongside the parent SOP — this appendix records local equipment, room layout, contacts and any practice-specific variations.

**Site:** ${site.name}${site.location ? ` · ${site.location}` : ""}
**Parent SOP:** ${parent.title}
**Scope:** ${site.name} only

## 1. Equipment at this site

${equipBlock}

## 2. Local logbook location

_To be completed by site — e.g. "Decontamination room, top drawer of left cabinet"._

## 3. Responsible person

_To be completed by site — name and role of the local owner for this SOP._

## 4. Service provider & fault escalation

_To be completed by site — primary engineer contact, out-of-hours number, escalation route to IPC Lead / Practice Manager._

## 5. Local SOP variations

_To be completed by site — any practice-specific variation from the group SOP (e.g. different cycle types, different waste contractor, additional checks)._

## 6. Local notes

_To be completed by site — anything else relevant: photos of equipment, copies of training certificates, local risk assessments._

---

_Approval: this appendix must be approved by the Clinical Director or Governance Lead before it goes live to staff at ${site.name}._`;
}

export function saveDraftBody(user, documentId, body, changeSummary = "") {
  assertCan(user, "document.edit_draft");
  const doc = getDocument(user.tenantId, documentId);
  if (!doc) return null;

  // Find the current editable version. If the doc is published, create a NEW
  // draft version — never mutate the live version.
  let editable;
  if (doc.status === DocumentStatus.published || doc.status === DocumentStatus.review_due) {
    const versions = listVersions(user.tenantId, documentId);
    const pending = versions.find((version) =>
      [DocumentStatus.draft, DocumentStatus.rejected, DocumentStatus.template].includes(version.status),
    );
    if (pending) {
      editable = Store.update(user.tenantId, TABLES.document_versions, pending.id, {
        body,
        changeSummary: changeSummary || pending.changeSummary,
        status: DocumentStatus.draft,
      });
      logAction(user, {
        objectType: "document_version",
        objectId: editable.id,
        action: "edit",
        newValue: { versionNumber: editable.versionNumber },
      });
      return editable;
    }
    const newVersionNumber = nextVersionNumber(versions, false);
    editable = Store.insert(user.tenantId, TABLES.document_versions, {
      id: uuid(),
      documentId,
      versionNumber: newVersionNumber,
      major: false,
      body,
      ownerUserId: user.id,
      approverUserId: null,
      reviewerUserId: null,
      status: DocumentStatus.draft,
      submittedAt: null,
      approvedAt: null,
      publishedAt: null,
      effectiveDate: null,
      nextReviewDate: null,
      archivedAt: null,
      changeSummary: changeSummary || "Edits to live document — new draft created.",
    });
    // Doc status doesn't change to draft (still published live). We track the
    // pending draft via versions list.
  } else {
    // Current draft / template / rejected — update its body in place.
    const versions = listVersions(user.tenantId, documentId);
    const editableExisting = versions.find((v) =>
      [DocumentStatus.draft, DocumentStatus.rejected, DocumentStatus.template].includes(v.status),
    );
    if (editableExisting) {
      editable = Store.update(user.tenantId, TABLES.document_versions, editableExisting.id, {
        body,
        changeSummary: changeSummary || editableExisting.changeSummary,
        status: DocumentStatus.draft,
      });
    } else {
      const newVersionNumber = nextVersionNumber(versions, false);
      editable = Store.insert(user.tenantId, TABLES.document_versions, {
        id: uuid(),
        documentId,
        versionNumber: newVersionNumber,
        major: false,
        body,
        ownerUserId: user.id,
        approverUserId: null,
        reviewerUserId: null,
        status: DocumentStatus.draft,
        submittedAt: null,
        approvedAt: null,
        publishedAt: null,
        effectiveDate: null,
        nextReviewDate: null,
        archivedAt: null,
        changeSummary,
      });
    }
    Store.update(user.tenantId, TABLES.documents, documentId, { status: DocumentStatus.draft });
  }
  logAction(user, {
    objectType: "document_version",
    objectId: editable.id,
    action: "edit",
    newValue: { versionNumber: editable.versionNumber },
  });
  return editable;
}

export function submitForReview(user, documentId, versionId, reviewerUserId) {
  assertCan(user, "document.submit_for_review");
  const version = Store.get(user.tenantId, TABLES.document_versions, versionId);
  const doc = getDocument(user.tenantId, documentId);
  if (!doc || !version || version.documentId !== documentId || version.status !== DocumentStatus.draft) return null;
  const next = Store.update(user.tenantId, TABLES.document_versions, versionId, {
    status: DocumentStatus.in_review,
    submittedAt: new Date().toISOString(),
    reviewerUserId: reviewerUserId ?? null,
  });
  if (doc.currentVersionId === versionId || ![DocumentStatus.published, DocumentStatus.review_due].includes(doc.status)) {
    Store.update(user.tenantId, TABLES.documents, documentId, { status: DocumentStatus.in_review });
  }
  logAction(user, {
    objectType: "document_version",
    objectId: versionId,
    action: "submit_for_review",
    newValue: { status: DocumentStatus.in_review },
  });
  return next;
}

export function approveVersion(user, documentId, versionId, approverUserId) {
  assertCan(user, "document.approve");
  const version = Store.get(user.tenantId, TABLES.document_versions, versionId);
  const doc = getDocument(user.tenantId, documentId);
  if (!doc || !version || version.documentId !== documentId || version.status !== DocumentStatus.in_review) return null;
  const next = Store.update(user.tenantId, TABLES.document_versions, versionId, {
    status: DocumentStatus.approved,
    approvedAt: new Date().toISOString(),
    approverUserId: approverUserId ?? user.id,
  });
  if (doc.currentVersionId === versionId || ![DocumentStatus.published, DocumentStatus.review_due].includes(doc.status)) {
    Store.update(user.tenantId, TABLES.documents, documentId, { status: DocumentStatus.approved });
  }
  logAction(user, {
    objectType: "document_version",
    objectId: versionId,
    action: "approve",
    newValue: { status: DocumentStatus.approved },
  });
  return next;
}

export function rejectVersion(user, documentId, versionId, reason = "") {
  assertCan(user, "document.reject");
  const version = Store.get(user.tenantId, TABLES.document_versions, versionId);
  const doc = getDocument(user.tenantId, documentId);
  if (!doc || !version || version.documentId !== documentId || version.status !== DocumentStatus.in_review) return null;
  const next = Store.update(user.tenantId, TABLES.document_versions, versionId, {
    status: DocumentStatus.rejected,
    changeSummary: reason,
  });
  if (doc.currentVersionId === versionId || ![DocumentStatus.published, DocumentStatus.review_due].includes(doc.status)) {
    Store.update(user.tenantId, TABLES.documents, documentId, { status: DocumentStatus.rejected });
  }
  logAction(user, {
    objectType: "document_version",
    objectId: versionId,
    action: "reject",
    newValue: { reason },
  });
  return next;
}

/**
 * Publish a version. Archives the previous published version (if any) and
 * updates the document.currentVersionId. Optionally signals a major bump,
 * which the acknowledgements service uses to invalidate existing acks.
 */
export function publishVersion(user, documentId, versionId, { major = false, reviewCycleMonths = 12, effectiveDate } = {}) {
  assertCan(user, "document.publish");
  const version = Store.get(user.tenantId, TABLES.document_versions, versionId);
  const doc = getDocument(user.tenantId, documentId);
  if (!version || !doc || version.documentId !== documentId) return null;
  if (version.status !== DocumentStatus.approved && version.status !== DocumentStatus.draft) return null;

  // Archive any currently-published version
  const versions = listVersions(user.tenantId, documentId);
  for (const v of versions) {
    if (v.id === versionId) continue;
    if (v.status === DocumentStatus.published) {
      Store.update(user.tenantId, TABLES.document_versions, v.id, {
        status: DocumentStatus.archived,
        archivedAt: new Date().toISOString(),
      });
    }
  }

  const now = new Date();
  const next = Store.update(user.tenantId, TABLES.document_versions, versionId, {
    status: DocumentStatus.published,
    publishedAt: now.toISOString(),
    effectiveDate: effectiveDate ?? now.toISOString(),
    nextReviewDate: defaultReviewDate(reviewCycleMonths),
    major,
  });
  Store.update(user.tenantId, TABLES.documents, documentId, {
    status: DocumentStatus.published,
    currentVersionId: versionId,
  });
  logAction(user, {
    objectType: "document_version",
    objectId: versionId,
    action: major ? "publish_major" : "publish",
    newValue: { versionNumber: version.versionNumber, major },
  });
  return next;
}

export function archiveDocument(user, documentId) {
  assertCan(user, "document.archive");
  const doc = getDocument(user.tenantId, documentId);
  if (!doc) return null;
  const versions = listVersions(user.tenantId, documentId);
  for (const v of versions) {
    if (v.status === DocumentStatus.published) {
      Store.update(user.tenantId, TABLES.document_versions, v.id, {
        status: DocumentStatus.archived,
        archivedAt: new Date().toISOString(),
      });
    }
  }
  const next = Store.update(user.tenantId, TABLES.documents, documentId, { status: DocumentStatus.archived });
  logAction(user, { objectType: "document", objectId: documentId, action: "archive" });
  return next;
}

/** Re-derive review_due / expired statuses for all published docs in the tenant. */
export function reconcileReviewDueStatuses(tenantId) {
  const now = Date.now();
  const docs = Store.list(tenantId, TABLES.documents);
  for (const d of docs) {
    if (d.status !== DocumentStatus.published && d.status !== DocumentStatus.review_due) continue;
    const v = Store.get(tenantId, TABLES.document_versions, d.currentVersionId);
    if (!v?.nextReviewDate) continue;
    const due = Date.parse(v.nextReviewDate);
    if (!Number.isFinite(due)) continue;
    if (due < now) {
      Store.update(tenantId, TABLES.documents, d.id, { status: DocumentStatus.review_due });
    }
  }
}
