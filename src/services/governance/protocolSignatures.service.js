/**
 * Protocol electronic sign-off — one row per signature event.
 *
 * Two signature kinds are recorded:
 *
 *   - "adoption"        — captured ONCE per (tenant, protocolId, versionNumber).
 *                         Made by the group's Clinical Director (or someone
 *                         acting with delegated authority). Says: the group has
 *                         adopted this SOP at version N. Until this row exists
 *                         the protocol is not adopted and clinicians cannot
 *                         acknowledge against it.
 *   - "acknowledgement" — captured per (clinician, protocol version). Says:
 *                         "I've read and understood." Tracked so the practice
 *                         manager / inspector can see who is compliant. Many
 *                         rows per protocol version.
 *
 * Production swap: replace the localStorage calls with the swap-commented
 * `fetchJson` equivalents — the row shape matches the future Prisma model.
 *
 * Backward compatibility: pre-split rows without a `kind` field are treated as
 * "acknowledgement" on read. We don't backfill; new writes always set kind.
 */

import { Store, TABLES, uuid } from "./store";
import { logAction } from "./auditTrail";

const ACK = "acknowledgement";
const ADO = "adoption";

function normaliseKind(row) {
  return row.kind ?? ACK;
}

export function listSignatures(tenantId, { protocolId, versionNumber, kind } = {}) {
  return Store.list(tenantId, TABLES.protocol_signatures).filter((r) => {
    if (protocolId && r.protocolId !== protocolId) return false;
    if (versionNumber && r.versionNumber !== versionNumber) return false;
    if (kind && normaliseKind(r) !== kind) return false;
    return true;
  });
  // return fetchJson(`/protocols/${protocolId}/signatures?version=${versionNumber}&kind=${kind ?? ""}`);
}

/** The single adoption signature for a protocol version, if any. */
export function getAdoption(tenantId, protocolId, versionNumber) {
  return listSignatures(tenantId, { protocolId, versionNumber, kind: ADO })[0] ?? null;
}

/** All clinician acknowledgements for a protocol version. */
export function listAcknowledgements(tenantId, protocolId, versionNumber) {
  return listSignatures(tenantId, { protocolId, versionNumber, kind: ACK });
}

/** Has a specific user already signed this version with the given kind? */
export function hasUserSigned(tenantId, protocolId, versionNumber, userId, kind = ACK) {
  return listSignatures(tenantId, { protocolId, versionNumber, kind })
    .some((r) => r.userId === userId);
}

/** Capture a signature event. The caller specifies kind = "adoption" or
 *  "acknowledgement". Adoption is rejected if an adoption already exists for
 *  this version — the protocol is adopted at most once per version. */
export function signProtocol(user, { protocolId, versionNumber, typedName, typedRole, kind = ACK }) {
  if (!user?.tenantId) return null;
  if (!typedName?.trim()) {
    const err = new Error("A typed name is required to sign a protocol.");
    err.code = "INVALID";
    throw err;
  }
  if (kind === ADO && getAdoption(user.tenantId, protocolId, versionNumber)) {
    const err = new Error("This protocol version has already been adopted by the group.");
    err.code = "ALREADY_ADOPTED";
    throw err;
  }
  const row = Store.insert(user.tenantId, TABLES.protocol_signatures, {
    id: uuid(),
    kind,
    protocolId,
    versionNumber,
    userId: user.id ?? null,
    typedName: typedName.trim(),
    typedRole: (typedRole ?? "").trim(),
    userDisplay: user.displayName ?? user.username ?? typedName.trim(),
    signedAt: new Date().toISOString(),
  });
  logAction(user, {
    objectType: "protocol_signature",
    objectId: protocolId,
    action: kind === ADO ? "adopt" : "acknowledge",
    newValue: { versionNumber, typedName: row.typedName, typedRole: row.typedRole, kind },
  });
  return row;
  // await fetchJson(`/protocols/${protocolId}/signatures`, { method: "POST", body: row });
}

/** Revoke a previously captured signature. Recorded as a separate audit-trail
 *  event; the row is removed. Revoking an adoption re-opens the protocol for a
 *  fresh adoption by the named CD. */
export function revokeSignature(user, signatureId) {
  const row = Store.get(user.tenantId, TABLES.protocol_signatures, signatureId);
  if (!row) return null;
  Store.remove(user.tenantId, TABLES.protocol_signatures, signatureId);
  logAction(user, {
    objectType: "protocol_signature",
    objectId: row.protocolId,
    action: "revoke",
    previousValue: row,
  });
  return row;
}
