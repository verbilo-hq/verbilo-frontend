/**
 * Protocol-compliance aggregation service.
 *
 * The Clinical Director adopts protocols on behalf of the whole group. Each
 * clinician individually acknowledges that they've read and will follow the
 * protocol. For a multi-practice group, the CD and each Practice Manager
 * need a helicopter view of:
 *
 *   - which adopted protocols are fully acknowledged across the group,
 *   - which sites are lagging,
 *   - which clinicians have outstanding reading,
 *   - which protocol has the biggest acknowledgement gap (most useful to
 *     prioritise chasing).
 *
 * All four numbers fall out of two existing tables — `users` and
 * `protocol_signatures` (kind = "acknowledgement"). No new schema; this
 * service is pure aggregation on data we already store.
 *
 * "Clinician" denominator: every user in the tenant whose role is not in
 * `NON_CLINICAL_ROLES` (i.e. exclude super_admin and auditor). Clinical
 * Directors, hygienists, therapists, nurses, IPC/decon/IRMER leads,
 * practice managers and general staff all count — in UK groups every one
 * of those people would be expected to read clinical SOPs relevant to
 * their work. Per-role applicability (e.g. perio only for clinicians who
 * see perio cases) is a future refinement; for the helicopter view, every
 * clinician × every adopted protocol is the meaningful denominator.
 */

import { listUsers } from "./users.service";
import {
  getAdoption, listAcknowledgements,
} from "./protocolSignatures.service";
import { UserRole } from "./types";

const NON_CLINICAL_ROLES = new Set([UserRole.super_admin, UserRole.auditor]);

/** All users in the tenant who are expected to acknowledge clinical SOPs. */
export function listClinicians(tenantId, { siteId } = {}) {
  return listUsers(tenantId, { active: true })
    .filter((u) => !NON_CLINICAL_ROLES.has(u.role))
    .filter((u) => !siteId || u.siteId === siteId);
}

/** Whole-group summary: adoption + acknowledgement counts. */
export function groupSummary(tenantId, protocols) {
  const adopted = protocols.filter((p) =>
    getAdoption(tenantId, p.id, p.version.number)
  );
  const clinicians = listClinicians(tenantId);
  let totalAcks = 0;
  for (const p of adopted) {
    totalAcks += listAcknowledgements(tenantId, p.id, p.version.number).length;
  }
  const totalPossible = adopted.length * clinicians.length;
  return {
    adoptedCount:   adopted.length,
    totalProtocols: protocols.length,
    clinicianCount: clinicians.length,
    totalPossible,
    totalAcks,
    overallPct: totalPossible > 0 ? Math.round((totalAcks / totalPossible) * 100) : 0,
  };
}

/** Per-site rollup — how many of a site's clinicians have acknowledged
 *  EVERY adopted protocol. Lets the CD see at a glance which practices
 *  are lagging. */
export function siteRollup(tenantId, protocols, site) {
  const adopted = protocols.filter((p) => getAdoption(tenantId, p.id, p.version.number));
  const clinicians = listClinicians(tenantId, { siteId: site.id });
  let fullyAcked = 0;
  let partialAckSum = 0;
  for (const c of clinicians) {
    let myAckCount = 0;
    for (const p of adopted) {
      if (listAcknowledgements(tenantId, p.id, p.version.number).some((a) => a.userId === c.id)) {
        myAckCount++;
      }
    }
    if (adopted.length > 0 && myAckCount === adopted.length) fullyAcked++;
    partialAckSum += myAckCount;
  }
  const totalPossible = adopted.length * clinicians.length;
  return {
    site,
    clinicianCount: clinicians.length,
    fullyAckedCount: fullyAcked,
    fullyAckedPct: clinicians.length > 0 ? Math.round((fullyAcked / clinicians.length) * 100) : 0,
    coveragePct:   totalPossible > 0 ? Math.round((partialAckSum / totalPossible) * 100) : 0,
  };
}

/** Per-protocol detail — who has acknowledged, who hasn't, gap size. */
export function protocolCompliance(tenantId, protocol, { siteId } = {}) {
  const adoption = getAdoption(tenantId, protocol.id, protocol.version.number);
  const clinicians = listClinicians(tenantId, { siteId });
  if (!adoption) {
    return {
      protocol, adopted: false, adoption: null,
      acked: [], pending: clinicians,
      pct: 0,
    };
  }
  const acks = listAcknowledgements(tenantId, protocol.id, protocol.version.number);
  const ackedUserIds = new Set(acks.map((a) => a.userId).filter(Boolean));
  const acked   = clinicians.filter((c) => ackedUserIds.has(c.id));
  const pending = clinicians.filter((c) => !ackedUserIds.has(c.id));
  return {
    protocol, adopted: true, adoption,
    acks, acked, pending,
    pct: clinicians.length > 0 ? Math.round((acked.length / clinicians.length) * 100) : 0,
  };
}

/** Per-clinician detail — what they've signed, what's still outstanding. */
export function clinicianCompliance(tenantId, protocols, user) {
  const adopted = protocols.filter((p) => getAdoption(tenantId, p.id, p.version.number));
  const acked = [];
  const pending = [];
  for (const p of adopted) {
    const has = listAcknowledgements(tenantId, p.id, p.version.number)
      .some((a) => a.userId === user.id);
    (has ? acked : pending).push(p);
  }
  return {
    user,
    adoptedCount:  adopted.length,
    ackedCount:    acked.length,
    pendingCount:  pending.length,
    acked, pending,
    pct: adopted.length > 0 ? Math.round((acked.length / adopted.length) * 100) : 0,
  };
}

/** Protocols sorted by gap size — biggest gap first. Used for the
 *  "what to chase" focus on the dashboard. Only includes adopted
 *  protocols where there is at least one pending clinician. */
export function gapFocus(tenantId, protocols, { siteId } = {}) {
  const compliances = protocols
    .map((p) => protocolCompliance(tenantId, p, { siteId }))
    .filter((c) => c.adopted && c.pending.length > 0);
  return compliances.sort((a, b) => a.pct - b.pct);
}

/** Clinicians sorted by their personal compliance % ascending — lets the
 *  PM see who's furthest behind. */
export function clinicianGapList(tenantId, protocols, { siteId } = {}) {
  const clinicians = listClinicians(tenantId, { siteId });
  return clinicians
    .map((u) => clinicianCompliance(tenantId, protocols, u))
    .sort((a, b) => a.pct - b.pct);
}
