/**
 * Role-based authorisation for the Governance & SOPs module.
 *
 * Authoritative on the frontend today; a server-side equivalent is required
 * before this is exposed beyond demo. Every mutation in the governance
 * services calls `assertCan(user, action, target?)` before writing.
 */

import { UserRole } from "./types";

/** True if `user.role === role` OR the user carries `role` in their
 *  `secondaryRoles[]` array. Used so a practice manager can also serve as the
 *  site RPS, or the IPC Lead can also be the group IRMER Lead. */
function hasRole(user, role) {
  if (!user) return false;
  if (user.role === role) return true;
  if (Array.isArray(user.secondaryRoles) && user.secondaryRoles.includes(role)) return true;
  return false;
}

function hasAnyRole(user, set) {
  if (!user) return false;
  if (set.has(user.role)) return true;
  if (Array.isArray(user.secondaryRoles)) {
    for (const r of user.secondaryRoles) if (set.has(r)) return true;
  }
  return false;
}

const PUBLISH_ROLES = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.clinical_director,
  UserRole.governance_lead,
]);

const APPROVE_ROLES = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.clinical_director,
  UserRole.governance_lead,
]);

const REGISTER_EDITORS = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.governance_lead,
  UserRole.ipc_lead,
  UserRole.decontamination_lead,
  UserRole.irmer_lead,
  UserRole.practice_manager,
]);

const EVIDENCE_UPLOADERS = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.governance_lead,
  UserRole.ipc_lead,
  UserRole.decontamination_lead,
  UserRole.irmer_lead,
  UserRole.radiation_protection_supervisor,
  UserRole.practice_manager,
  UserRole.site_lead,
]);

const EVIDENCE_REVIEWERS = new Set([
  UserRole.super_admin,
  UserRole.governance_lead,
  UserRole.ipc_lead,
  UserRole.irmer_lead,
  UserRole.clinical_director,
]);

const ACK_ASSIGN_ROLES = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.governance_lead,
]);

const ENTITLEMENT_EDITORS = new Set([
  UserRole.super_admin,
  UserRole.group_admin,
  UserRole.governance_lead,
  UserRole.irmer_lead,
]);

const READ_ONLY_ROLES = new Set([UserRole.auditor, UserRole.staff, UserRole.referrer, UserRole.operator, UserRole.practitioner]);

/**
 * @param {object} user        { id, role, tenantId, siteId }
 * @param {string} action      e.g. 'document.publish', 'evidence.upload'
 * @param {object} [target]    Object the action will operate on; may include
 *                              tenantId / siteId / scope / status etc.
 * @returns {boolean}
 */
export function can(user, action, target = null) {
  if (!user || !user.role) return false;
  if (hasRole(user, UserRole.super_admin)) return true;
  // Auditors can read everything in their tenant, edit nothing.
  // Staff / referrer / operator / practitioner can additionally complete their
  // own acknowledgements (the dental clinical roles still need to ack policies).
  // A user with a primary read-only role but a secondaryRole granting more
  // permissions (e.g. an Operator who is also the site RPS) escapes this gate.
  if (READ_ONLY_ROLES.has(user.role) && !action.endsWith(".read")) {
    const hasElevatedSecondary = Array.isArray(user.secondaryRoles)
      && user.secondaryRoles.some((r) => !READ_ONLY_ROLES.has(r));
    if (!hasElevatedSecondary) {
      if (action === "acknowledgement.complete" && user.role !== UserRole.auditor) return true;
      return false;
    }
  }
  // Tenant boundary: a non-super-admin can never act on another tenant.
  if (target?.tenantId && user.tenantId && target.tenantId !== user.tenantId) return false;

  switch (action) {
    // ── Pack instance ──
    case "pack.configure":
    case "pack.edit_setup":
      return hasRole(user, UserRole.group_admin) || hasRole(user, UserRole.governance_lead);
    case "pack.submit_for_approval":
      return hasRole(user, UserRole.group_admin) || hasRole(user, UserRole.governance_lead);
    case "pack.approve":
      return hasAnyRole(user, APPROVE_ROLES);
    case "pack.reset":
      // Demo-only: gov/admin roles can reset a pack to fresh state to walk a
      // client through the setup wizard again.
      return hasRole(user, UserRole.group_admin)
          || hasRole(user, UserRole.governance_lead)
          || hasRole(user, UserRole.super_admin);

    // ── Sites & profiles ──
    case "site.edit":
    case "site.profile.edit":
      // Group-level roles + the practice manager / site lead / RPS of that site
      if (hasAnyRole(user, REGISTER_EDITORS)) return true;
      if (hasRole(user, UserRole.site_lead) && target?.siteId === user.siteId) return true;
      if (hasRole(user, UserRole.radiation_protection_supervisor) && target?.siteId === user.siteId) return true;
      return false;

    // ── Equipment register ──
    case "equipment.edit":
      if (hasAnyRole(user, REGISTER_EDITORS)) return true;
      if (hasRole(user, UserRole.site_lead) && target?.siteId === user.siteId) return true;
      if (hasRole(user, UserRole.radiation_protection_supervisor) && target?.siteId === user.siteId) return true;
      return false;

    // ── Operator entitlement (IRMER) ──
    case "entitlement.edit":
      if (hasAnyRole(user, ENTITLEMENT_EDITORS)) return true;
      // The site-level RPS can manage entitlements for their own site.
      if (hasRole(user, UserRole.radiation_protection_supervisor) && target?.siteId === user.siteId) return true;
      return false;
    case "entitlement.read":
      return true;

    // ── Controlled documents ──
    case "document.create_draft":
    case "document.edit_draft":
      return hasAnyRole(user, REGISTER_EDITORS);
    case "document.submit_for_review":
      return hasAnyRole(user, REGISTER_EDITORS);
    case "document.approve":
    case "document.reject":
    case "document.request_changes":
      return hasAnyRole(user, APPROVE_ROLES);
    case "document.publish":
      return hasAnyRole(user, PUBLISH_ROLES);
    case "document.archive":
      return hasAnyRole(user, PUBLISH_ROLES);
    case "document.read":
      // Staff and auditors only see published documents — the service layer
      // filters the list. Permission here just allows the read attempt.
      return true;

    // ── Acknowledgements ──
    case "acknowledgement.assign":
      return hasAnyRole(user, ACK_ASSIGN_ROLES);
    case "acknowledgement.complete":
      // Anyone can complete their OWN acknowledgement.
      return !target?.userId || target.userId === user.id;
    case "acknowledgement.read":
      return true;

    // ── Evidence ──
    case "evidence.upload":
      return hasAnyRole(user, EVIDENCE_UPLOADERS);
    case "evidence.review":
      return hasAnyRole(user, EVIDENCE_REVIEWERS);
    case "evidence.read":
      return true;

    // ── Audits ──
    case "audit.schedule":
      return hasAnyRole(user, REGISTER_EDITORS) || hasAnyRole(user, APPROVE_ROLES);
    case "audit.complete":
      return hasAnyRole(user, REGISTER_EDITORS)
        || hasRole(user, UserRole.site_lead)
        || hasRole(user, UserRole.radiation_protection_supervisor);

    default:
      return false;
  }
}

export function assertCan(user, action, target = null) {
  if (!can(user, action, target)) {
    const err = new Error(`Forbidden: ${user?.role ?? "anon"} cannot ${action}`);
    err.code = "FORBIDDEN";
    throw err;
  }
}

/** Convenience: filter a list of documents to ones the user can see. */
export function visibleDocuments(user, documents) {
  if (!user) return [];
  if (user.role === UserRole.staff) {
    // Staff only see published docs.
    return documents.filter((d) => d.status === "published");
  }
  return documents;
}
