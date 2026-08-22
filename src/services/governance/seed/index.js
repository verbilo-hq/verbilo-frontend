/**
 * Demo seed orchestrator. Idempotent — runs once per tenant unless the
 * sentinel `verbilo.governance.{tenantId}._seeded_v2` is cleared.
 *
 * Builds the Dental Group dataset:
 *   - 6 sites with varied decontamination profiles
 *   - 30+ users with the specified role assignments
 *   - Equipment register per site
 *   - 22 group documents + 7 site appendices in varied lifecycle states
 *   - Acknowledgements distributed across published doc versions
 *   - Evidence requirements + records linked to site / document / equipment
 *   - Audit schedules per site per audit type, with completion + RAG
 *
 * Everything carries the tenantId of whoever is running the demo, so a real
 * customer logging in with a different tenantId never sees this data.
 */

import { Store, TABLES, uuid, batch as storeBatch } from "../store";
import {
  DocumentScope, DocumentStatus, PackStatus, SiteStatus, UserRole,
  EvidenceKind, EvidenceStatus, AuditRagStatus, AckStatus, EquipmentType,
  AUDIT_TYPES,
} from "../types";
import { resolveSiteId } from "../../sites";
import { DEMO_SITES } from "./sites";
import { DEMO_USERS } from "./users";
import { DEMO_EQUIPMENT } from "./equipment";
import { DEMO_DOCUMENTS, DEMO_APPENDICES } from "./documents";
import { seedRadiography } from "./radiography";
import { seedMedicalEmergencies } from "./medical-emergencies";

export const DECON_PACK_KEY = "decontamination_ipc";

const SEED_DONE_KEY = (tenantId) => `verbilo.governance.${tenantId}._seeded_v8`;

const today = new Date();
const at = (daysOffset) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/**
 * Insert a row at a specific id (overrides the auto-uuid in Store.insert).
 *
 * Canonicalises any site-reference FIELD on the row (`siteId` / `appliesToSiteId`)
 * onto the shared taxonomy via resolveSiteId(). This is the single write seam all
 * three pack seeders (decon / radiography / medical-emergencies) route through, so
 * every stored row's siteId matches the now-canonical `sites` table regardless of
 * the legacy `site-brighton`/… literals still used inside the source data arrays.
 *
 * Note we deliberately DON'T rewrite internal id strings like
 * `profile-rad-${siteId}` / `siteProfileId` — those are pack-internal join keys
 * that stay consistent on both sides (profile.id ↔ equipment.siteProfileId), and
 * no page joins them against the sites table. resolveSiteId is idempotent, so
 * rows already on canonical ids pass through unchanged.
 */
function insertWithId(tenantId, table, row) {
  const next = { ...row };
  if (typeof next.siteId === "string" && next.siteId) {
    next.siteId = resolveSiteId(next.siteId);
  }
  if (typeof next.appliesToSiteId === "string" && next.appliesToSiteId) {
    next.appliesToSiteId = resolveSiteId(next.appliesToSiteId);
  }
  return Store.insert(tenantId, table, next);
}

/** Build the body of a document version. */
function bodyFor(doc, version) {
  return doc.body ?? `# ${doc.title}\n\n_Group-wide controlled document — version ${version.versionNumber}._\n\n## Purpose\nDefines the controlled procedure for ${doc.category.replace(/_/g, " ")} across applied sites.\n\n## Procedure\nWhen this document goes live, the platform auto-populates local detail (equipment, leads, audit schedule) from each site's Profile + Equipment Register.\n\n## Change summary\n${version.changeSummary || "Initial published version"}\n\n## References\n${(doc.references ?? ["HTM 01-05"]).join(" · ")}`;
}

/* ─── Public API ─────────────────────────────────────────────────────────── */

export function ensureSeed(user) {
  if (!user?.tenantId) return;
  // One-shot heal for tenants whose data pre-dates Store.insert's id check —
  // earlier seed runs occasionally appended duplicate rows. Runs once per
  // tenant per browser, then a sentinel skips it. Cheap if nothing's wrong.
  healDuplicateRows(user.tenantId);
  if (localStorage.getItem(SEED_DONE_KEY(user.tenantId))) return;
  storeBatch(() => seed(user));
  try { localStorage.setItem(SEED_DONE_KEY(user.tenantId), new Date().toISOString()); } catch { /* noop */ }
}

const HEAL_KEY = (tenantId) => `verbilo.governance.${tenantId}._healed_v1`;
const TABLES_TO_DEDUP = [
  "users", "sites", "pack_instances", "site_profiles", "equipment_records",
  "governance_documents", "document_versions", "staff_acknowledgements",
  "evidence_records", "audit_schedules", "operator_entitlements",
  "org_settings", "audit_trail", "protocol_signatures", "practice_branding",
];
function healDuplicateRows(tenantId) {
  if (localStorage.getItem(HEAL_KEY(tenantId))) return;
  let totalRemoved = 0;
  for (const tbl of TABLES_TO_DEDUP) {
    const rows = Store.list(tenantId, tbl);
    const seen = new Set();
    const deduped = rows.filter((r) => {
      if (!r?.id || seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    if (deduped.length !== rows.length) {
      Store.clear(tenantId, tbl);
      for (const r of deduped) Store.insert(tenantId, tbl, r);
      totalRemoved += rows.length - deduped.length;
    }
  }
  if (totalRemoved > 0) {
    // eslint-disable-next-line no-console
    console.info(`[governance] healed ${totalRemoved} duplicate row(s) for tenant ${tenantId}`);
  }
  try { localStorage.setItem(HEAL_KEY(tenantId), new Date().toISOString()); } catch { /* noop */ }
}

/** Forced re-seed — clears the tenant's data and runs fresh. */
export function resetAndReseed(user) {
  if (!user?.tenantId) return;
  Store.clearAllForTenant(user.tenantId);
  storeBatch(() => seed(user));
  try { localStorage.setItem(SEED_DONE_KEY(user.tenantId), new Date().toISOString()); } catch { /* noop */ }
}

/* ─── Seed body ──────────────────────────────────────────────────────────── */

function seed(user) {
  const tenantId = user.tenantId;

  /* 1. Users */
  for (const u of DEMO_USERS) {
    insertWithId(tenantId, TABLES.users, {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      email: u.email,
      role: u.role,
      secondaryRoles: u.secondaryRoles ?? [],
      siteId: u.siteId,
      active: true,
      jobTitle: u.jobTitle ?? null,
    });
  }

  /* 2. Sites */
  for (const s of DEMO_SITES) {
    insertWithId(tenantId, TABLES.sites, {
      id: s.id,
      name: s.name,
      location: s.location,
      active: s.active,
      status: s.initialStatus,
    });
  }

  /* 2b. Organisation settings — singleton; pulled into every pack as defaults */
  insertWithId(tenantId, TABLES.org_settings, {
    id: "org-settings",
    groupName: "Dental Group",
    logoDataUrl: null,
    brandColor: "#006974",
    clinicalDirectorUserId: "user-cd",
    governanceLeadUserId: "user-gov",
    defaultApproverUserId: "user-cd",
    defaultReviewerUserId: "user-gov",
    defaultReviewCycleMonths: 12,
    documentNumberingFormat: "{tenant}-{pack}-{seq}",
    defaultAckDays: 14,
    evidenceRetentionYears: 7,
  });

  /* 3. Pack instance — live with full org setup populated */
  const pack = insertWithId(tenantId, TABLES.packs, {
    id: "pack-decon-ipc",
    packKey: DECON_PACK_KEY,
    status: PackStatus.live,
    groupName: "Dental Group",
    brandColor: "#006974",
    logoDataUrl: "",
    reviewCycleMonths: 12,
    clinicalDirectorUserId: "user-cd",
    groupIpcLeadUserId:     "user-ipc-group",
    groupDeconLeadUserId:   "user-decon-group",
    defaultApproverUserId:  "user-cd",
    defaultReviewerUserId:  "user-gov",
  });

  /* 4. Site profiles — applied + flags + leads per site */
  for (const s of DEMO_SITES) {
    insertWithId(tenantId, TABLES.site_profiles, {
      id: `profile-${s.id}`,
      siteId: s.id,
      packInstanceId: pack.id,
      ...s.profile,
      localDeconLeadUserId:  s.leads.localDeconLeadUserId  ?? null,
      localIpcLeadUserId:    s.leads.localIpcLeadUserId    ?? null,
      practiceManagerUserId: s.leads.practiceManagerUserId ?? null,
      localReviewerUserId:   s.leads.localReviewerUserId   ?? null,
      status: s.initialStatus,
    });
  }

  /* 5. Equipment register.
   * The decon site_profiles `id` derives from DEMO_SITES (now canonical), so the
   * equipment→profile join key must resolve `e.siteId` (still a legacy literal in
   * equipment.js) onto the SAME canonical id — otherwise listForSite (which matches
   * siteProfileId === profile.id) finds nothing. insertWithId also canonicalises the
   * `siteId` field itself. */
  for (const e of DEMO_EQUIPMENT) {
    insertWithId(tenantId, TABLES.equipment, {
      ...e,
      siteProfileId: `profile-${resolveSiteId(e.siteId)}`,
    });
  }

  /* 6. Documents (group-wide + appendices) */
  const allDocs = [...DEMO_DOCUMENTS, ...DEMO_APPENDICES];
  for (const d of allDocs) {
    let currentVersionId = null;
    let docStatus = d.versions[d.versions.length - 1].status;

    // For docs with multiple versions, status follows the published one (or latest)
    const published = d.versions.find((v) => v.status === DocumentStatus.published);
    const reviewDue = d.versions.find((v) => v.status === DocumentStatus.review_due);
    const expired   = d.versions.find((v) => v.status === DocumentStatus.expired);
    const inReview  = d.versions.find((v) => v.status === DocumentStatus.in_review);
    if (published)      docStatus = DocumentStatus.published;
    else if (reviewDue) docStatus = DocumentStatus.review_due;
    else if (expired)   docStatus = DocumentStatus.expired;
    else if (inReview)  docStatus = DocumentStatus.in_review;

    insertWithId(tenantId, TABLES.documents, {
      id: d.id,
      tenantId,
      packKey: DECON_PACK_KEY,
      packInstanceId: pack.id,
      title: d.title,
      type: d.type,
      category: d.category,
      scope: d.scope ?? DocumentScope.group,
      appliesToSiteId: d.appliesToSiteId ?? null,
      appliesToRole: d.appliesToRole ?? null,
      parentDocumentId: d.parentDocumentId ?? null,
      requiredFlag: d.requiredFlag ?? null,
      currentVersionId: null,
      status: docStatus,
      references: d.references ?? [],
      acknowledgementRequired: (d.type === "policy" || d.type === "sop" || d.type === "appendix"),
      linkedAuditType: d.linkedAuditType ?? null,
    });

    for (const v of d.versions) {
      const versionId = `version-${d.id}-v${v.versionNumber}`;
      const isLive = v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired;
      const reviewOffset = typeof v.reviewDaysFromNow === "number" ? v.reviewDaysFromNow : 365 - (v.publishedDaysAgo ?? 0);
      insertWithId(tenantId, TABLES.document_versions, {
        id: versionId,
        documentId: d.id,
        versionNumber: v.versionNumber,
        major: !v.versionNumber.includes(".") || v.versionNumber.endsWith(".0"),
        body: bodyFor(d, v),
        ownerUserId: "user-decon-group",
        approverUserId: isLive ? "user-cd" : null,
        reviewerUserId: "user-gov",
        status: v.status,
        submittedAt:    v.submittedDaysAgo  ? at(-v.submittedDaysAgo)  : (isLive ? at(-(v.publishedDaysAgo ?? 0) - 7) : null),
        approvedAt:     isLive              ? at(-(v.publishedDaysAgo ?? 0) - 2) : null,
        publishedAt:    isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        effectiveDate:  isLive              ? at(-(v.publishedDaysAgo ?? 0))     : null,
        nextReviewDate: isLive              ? at(reviewOffset)                     : null,
        archivedAt:     v.archivedDaysAgo   ? at(-v.archivedDaysAgo)               : null,
        changeSummary:  v.changeSummary ?? (v.versionNumber === "1.0" ? "Initial published version" : "Revision"),
      });
      // Doc's currentVersionId points to the published (or latest live) row
      if (v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired) {
        currentVersionId = versionId;
      } else if (!currentVersionId && v.status === DocumentStatus.in_review) {
        currentVersionId = versionId;
      } else if (!currentVersionId) {
        currentVersionId = versionId;
      }
    }
    Store.update(tenantId, TABLES.documents, d.id, { currentVersionId });
  }

  /* 7. Acknowledgements — one per (live version × staff at applied sites) */
  const appliedSiteIds = DEMO_SITES.filter((s) => s.profile.applied).map((s) => s.id);
  const ackUsers = DEMO_USERS.filter((u) =>
    [UserRole.staff, UserRole.site_lead, UserRole.practice_manager, UserRole.ipc_lead, UserRole.decontamination_lead, UserRole.clinical_director].includes(u.role)
    && (u.siteId === null || appliedSiteIds.includes(u.siteId)),
  );

  // Determine per-doc applicable sites by joining site profile flags with doc.requiredFlag
  const sitesById = Object.fromEntries(DEMO_SITES.map((s) => [s.id, s]));
  function applicableSites(doc) {
    if (doc.scope === DocumentScope.site) return [doc.appliesToSiteId];
    return appliedSiteIds.filter((sid) => {
      if (!doc.requiredFlag) return true;
      return !!sitesById[sid].profile[doc.requiredFlag];
    });
  }

  // Realistic ack distribution (deterministic — seeded by string hash so repeats are stable)
  function hashIdx(seed, mod) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
    return Math.abs(h) % mod;
  }

  for (const d of allDocs) {
    if (!(d.type === "policy" || d.type === "sop" || d.type === "appendix")) continue;
    const liveVersion = d.versions.find((v) => v.status === DocumentStatus.published || v.status === DocumentStatus.review_due || v.status === DocumentStatus.expired);
    if (!liveVersion) continue;
    const versionId = `version-${d.id}-v${liveVersion.versionNumber}`;
    const sites = applicableSites(d);
    const candidates = ackUsers.filter((u) => u.siteId === null || sites.includes(u.siteId));
    for (const u of candidates) {
      const r = hashIdx(`${d.id}::${u.id}`, 10);
      // 70% acknowledged, 15% assigned (still pending), 15% overdue
      let status = AckStatus.acknowledged;
      let acknowledgedAt = at(-(liveVersion.publishedDaysAgo ?? 60) + r * 2);
      let dueDate = at((liveVersion.publishedDaysAgo ?? 60) > 60 ? -10 - r : 14);
      if (r >= 7 && r < 9) { status = AckStatus.assigned;   acknowledgedAt = null; dueDate = at(14 - r); }
      else if (r >= 9)     { status = AckStatus.overdue;    acknowledgedAt = null; dueDate = at(-15 - r); }
      insertWithId(tenantId, TABLES.acknowledgements, {
        id: `ack-${d.id}-${u.id}`,
        documentId: d.id,
        documentVersionId: versionId,
        userId: u.id,
        siteId: u.siteId,
        assignedAt: at(-(liveVersion.publishedDaysAgo ?? 60)),
        dueDate,
        acknowledgedAt,
        reminderCount: status === AckStatus.overdue ? 2 : 0,
        status,
      });
    }
  }

  /* 8. Evidence register — one record per (doc × applicable site) for SOPs / logs / audits */
  function kindFor(doc) {
    switch (doc.type) {
      case "log_template":      return EvidenceKind.log_entry;
      case "audit_tool":        return EvidenceKind.audit_result;
      case "policy":            return EvidenceKind.attestation;
      case "sop":               return EvidenceKind.attestation;
      case "appendix":          return EvidenceKind.attestation;
      case "evidence_template": return EvidenceKind.file;
      default:                  return EvidenceKind.file;
    }
  }

  // Generate evidence: linked to (site, doc) and to equipment where requiredFlag matches
  for (const d of allDocs) {
    const sites = applicableSites(d);
    for (const sid of sites) {
      const r = hashIdx(`${d.id}::${sid}::ev`, 10);
      const status =
        r < 6 ? EvidenceStatus.accepted :
        r < 7 ? EvidenceStatus.submitted :
        r < 8 ? EvidenceStatus.required :
        r < 9 ? EvidenceStatus.overdue :
                EvidenceStatus.expired;
      // `sid` is canonical (from DEMO_SITES); `e.siteId` is still a legacy literal
      // in equipment.js — resolve before comparing so the equipment link matches.
      const equipment = DEMO_EQUIPMENT.find((e) => resolveSiteId(e.siteId) === sid && (
        (d.requiredFlag === "autoclave"          && e.type === EquipmentType.autoclave) ||
        (d.requiredFlag === "washerDisinfector"  && e.type === EquipmentType.washer_disinfector) ||
        (d.requiredFlag === "ultrasonicBath"     && e.type === EquipmentType.ultrasonic_bath) ||
        (d.requiredFlag === "waterlineManagement" && e.type === EquipmentType.waterline_system)
      ));
      insertWithId(tenantId, TABLES.evidence, {
        id: `ev-${d.id}-${sid}`,
        siteId: sid,
        packInstanceId: pack.id,
        documentId: d.id,
        equipmentId: equipment?.id ?? null,
        auditScheduleId: null,
        kind: kindFor(d),
        title: d.title,
        status,
        dueDate: at(status === EvidenceStatus.required ? 14 : status === EvidenceStatus.overdue ? -15 : null),
        uploadedAt: status === EvidenceStatus.accepted || status === EvidenceStatus.submitted ? at(-r) : null,
        uploadedByUserId: status === EvidenceStatus.accepted || status === EvidenceStatus.submitted ? "user-decon-group" : null,
        fileKey: null,
        notes: null,
        expiryDate: status === EvidenceStatus.expired ? at(-30) : null,
        reviewedAt: status === EvidenceStatus.accepted ? at(-r + 1) : null,
        reviewedByUserId: status === EvidenceStatus.accepted ? "user-gov" : null,
      });
    }
    // For docs that don't apply to a site (e.g. amalgam doc at hove), mark not_applicable
    const inapplicable = appliedSiteIds.filter((sid) => !sites.includes(sid));
    for (const sid of inapplicable) {
      insertWithId(tenantId, TABLES.evidence, {
        id: `ev-${d.id}-${sid}-na`,
        siteId: sid,
        packInstanceId: pack.id,
        documentId: d.id,
        equipmentId: null,
        auditScheduleId: null,
        kind: kindFor(d),
        title: `${d.title} (not applicable)`,
        status: EvidenceStatus.not_applicable,
        dueDate: null,
        uploadedAt: null,
        uploadedByUserId: null,
        fileKey: null,
        notes: "Not applicable at this site per Site Decontamination Profile.",
      });
    }
  }

  /* 9. Audit schedules — per applied site × per audit type */
  for (const sid of appliedSiteIds) {
    const profile = sitesById[sid].profile;
    for (const at_ of AUDIT_TYPES) {
      // Skip waterline audit if site doesn't have waterline management
      if (at_.id === "waterline" && !profile.waterlineManagement) continue;
      const r = hashIdx(`${sid}::${at_.id}`, 10);
      const overdue = r >= 8;
      const completed = r < 6;
      const score = completed ? 65 + (r * 5) : null;
      const rag = !completed ? AuditRagStatus.unknown :
                  score >= 90 ? AuditRagStatus.green :
                  score >= 75 ? AuditRagStatus.amber :
                                AuditRagStatus.red;
      insertWithId(tenantId, TABLES.audits, {
        id: `audit-${sid}-${at_.id}`,
        siteId: sid,
        packInstanceId: pack.id,
        auditType: at_.id,
        frequency: at_.defaultFreq,
        ownerUserId: sitesById[sid].leads.localIpcLeadUserId ?? "user-ipc-group",
        nextDueDate: at(overdue ? -10 - r : 14 + r),
        lastCompletedAt: completed ? at(-(15 + r * 3)) : null,
        lastScore: score,
        ragStatus: rag,
        overdue,
      });
    }
  }

  /* 10. Audit-trail seed — a few representative events.
   * userDisplay is a denormalised snapshot — resolve it from the reseeded
   * DEMO_USERS so the trail shows the same real roster names as the user
   * records (no invented "Dr Sarah Johnson"/"Sophie Patel"/… strings). */
  const displayNameOf = (userId) =>
    DEMO_USERS.find((u) => u.id === userId)?.displayName ?? "—";
  const trailEvents = [
    { objectType: "pack", action: "approve", at: at(-145), userId: "user-cd",       userDisplay: displayNameOf("user-cd"),   newValue: { status: "live" } },
    { objectType: "document", objectId: "doc-sop-autoclave", action: "publish_major", at: at(-260), userId: "user-cd", userDisplay: displayNameOf("user-cd"), newValue: { versionNumber: "1.1" } },
    { objectType: "document", objectId: "doc-sop-clinical-waste", action: "publish",  at: at(-120), userId: "user-cd", userDisplay: displayNameOf("user-cd"), newValue: { versionNumber: "1.1" } },
    { objectType: "document", objectId: "doc-sop-steriliser-testing", action: "submit_for_review", at: at(-8), userId: "user-decon-group", userDisplay: displayNameOf("user-decon-group"), newValue: { status: "in_review" } },
    { objectType: "site_profile", objectId: "profile-site-guildford", action: "edit", at: at(-30), userId: "user-pm-guildford", userDisplay: displayNameOf("user-pm-guildford"), siteId: "site-guildford", newValue: { partial: true } },
  ];
  for (const e of trailEvents) {
    insertWithId(tenantId, TABLES.audit_trail, {
      ...e,
      id: `trail-${uuid()}`,
      objectId: e.objectId ?? null,
      previousValue: null,
    });
  }

  /* 11. Radiography & IRMER pack — second governance pack seeded alongside */
  seedRadiography(user, { insertWithId });

  /* 12. Medical Emergencies pack — third governance pack seeded alongside */
  seedMedicalEmergencies(user, { insertWithId });
}
