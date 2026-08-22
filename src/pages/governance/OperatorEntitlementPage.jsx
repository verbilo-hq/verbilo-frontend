/**
 * Operator Entitlement Register (IRMER pack only).
 *
 * One matrix per applied site. Columns split into three groups:
 *   1. Equipment-class entitlements (intraoral / OPG / CBCT / handheld) —
 *      driven by the site's radiography profile flags.
 *   2. Process-competency entitlements (image acquisition / processing / QA).
 *   3. IRMER duty-holder entitlements (referrer / practitioner / operator) —
 *      relevant rows only render for users carrying those duty-holder roles.
 *
 * Rows are users with IRMER-relevant primary OR secondary roles. Clicking a
 * cell opens a dialog to set entitled state, dates, evidence and approval
 * (`assertCan("entitlement.edit", { siteId })` gates the mutation — the
 * site-level RPS can manage entitlements for their own site).
 */

import { useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { formatDate } from "./Shared";
import {
  listEntitlements, setEntitlement, revokeEntitlement,
  entitlementStatusBucket, ENTITLEMENT_BUCKETS,
} from "../../services/governance/operatorEntitlement.service";
import { getProfile } from "../../services/governance/siteProfiles.service";
import { getPackInstance } from "../../services/governance/packs.service";
import {
  EntitlementType, ENTITLEMENT_TYPE_LABEL,
  EQUIPMENT_ENTITLEMENT_TYPES, ROLE_ENTITLEMENT_TYPES, PROCESS_ENTITLEMENT_TYPES,
  UserRole, ROLE_LABEL,
} from "../../services/governance/types";
import { userHasRole } from "../../services/governance/users.service";
import { can } from "../../services/governance/permissions";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/** Users whose primary OR secondary role makes them an IRMER duty-holder. */
const IRMER_DUTY_HOLDER_ROLES = [
  UserRole.operator, UserRole.practitioner, UserRole.referrer,
  UserRole.irmer_lead, UserRole.radiation_protection_supervisor,
  UserRole.staff, UserRole.practice_manager,
];

const SITE_FLAG_FOR_CLASS = {
  [EntitlementType.intraoral]: "intraoralXray",
  [EntitlementType.opg]:       "opgXray",
  [EntitlementType.cbct]:      "cbctXray",
  [EntitlementType.handheld]:  "handheldXray",
};

function equipmentTypesForSite(profile) {
  if (!profile) return EQUIPMENT_ENTITLEMENT_TYPES;
  return EQUIPMENT_ENTITLEMENT_TYPES.filter((c) => profile[SITE_FLAG_FOR_CLASS[c]]);
}

/** Only render a role-entitlement column if at least one user actually carries
 *  that role at this site. Keeps the matrix tidy. */
function roleTypesPresentAtSite(users, siteId) {
  const out = [];
  for (const t of ROLE_ENTITLEMENT_TYPES) {
    const someoneCarries = users.some((u) => u.siteId === siteId && (
      (t === EntitlementType.referrer    && userHasRole(u, UserRole.referrer)) ||
      (t === EntitlementType.practitioner && userHasRole(u, UserRole.practitioner)) ||
      (t === EntitlementType.operator    && userHasRole(u, UserRole.operator))
    ));
    if (someoneCarries) out.push(t);
  }
  return out;
}

function columnsForSite(profile, users) {
  if (!profile) return [];
  return [
    ...equipmentTypesForSite(profile),
    ...PROCESS_ENTITLEMENT_TYPES,
    ...roleTypesPresentAtSite(users, profile.siteId),
  ];
}

/** Decide whether the (user, type) pair makes sense as an entitlement cell. */
function shouldShowCell(user, type) {
  if (EQUIPMENT_ENTITLEMENT_TYPES.includes(type)) return true;        // equipment cols apply to everyone at the site
  if (PROCESS_ENTITLEMENT_TYPES.includes(type)) return true;          // process cols apply to everyone
  if (type === EntitlementType.referrer)     return userHasRole(user, UserRole.referrer);
  if (type === EntitlementType.practitioner) return userHasRole(user, UserRole.practitioner);
  if (type === EntitlementType.operator)     return userHasRole(user, UserRole.operator);
  return false;
}

const EditDialog = ({ user, entry, onClose, onSaved }) => {
  const [entitled, setEntitled] = useState(entry.entitlement?.entitled ?? true);
  const [entitlementDate, setEntitlementDate] = useState(entry.entitlement?.entitlementDate?.split("T")[0] ?? "");
  const [reviewDate, setReviewDate] = useState(entry.entitlement?.reviewDate?.split("T")[0] ?? "");
  const [expiryDate, setExpiryDate] = useState(entry.entitlement?.expiryDate?.split("T")[0] ?? "");
  const [hasEvidence, setHasEvidence] = useState(!!entry.entitlement?.evidenceFileKey);
  const [notes, setNotes] = useState(entry.entitlement?.notes ?? "");

  const handleSave = () => {
    setEntitlement(user, {
      targetUserId: entry.user.id,
      siteId: entry.site.id,
      equipmentClass: entry.entitlementType,
      entitled,
      entitlementDate: entitlementDate ? new Date(entitlementDate).toISOString() : null,
      reviewDate: reviewDate ? new Date(reviewDate).toISOString() : null,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
      evidenceFileKey: hasEvidence ? (entry.entitlement?.evidenceFileKey ?? `attestation:${entry.user.id}:${entry.entitlementType}`) : null,
      notes: notes || null,
    });
    onSaved();
    onClose();
  };

  return (
    <div className={styles.scrim} onClick={onClose}>
      <Card hover={false} className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Operator entitlement</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <I name="xcircle" size={18} color="var(--outline)" />
          </button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div className={styles.cardTitle}>{entry.user.displayName ?? entry.user.username}</div>
          <div className={styles.cardLead}>
            {ROLE_LABEL[entry.user.role]} · {entry.site.name} · {ENTITLEMENT_TYPE_LABEL[entry.entitlementType]}
          </div>
        </div>

        <div className={styles.wizFormGrid}>
          <div className={styles.wizField} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.wizLabel}>Entitlement</label>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button"
                className={entitled ? `${styles.flagRow} ${styles.flagRowOn}` : styles.flagRow}
                onClick={() => setEntitled(true)} style={{ flex: 1 }}>
                <I name="check" size={11} /> Entitled
              </button>
              <button type="button"
                className={!entitled ? `${styles.flagRow} ${styles.flagRowOn}` : styles.flagRow}
                onClick={() => setEntitled(false)} style={{ flex: 1 }}>
                <I name="xcircle" size={11} /> Not entitled
              </button>
            </div>
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Entitlement date</label>
            <input type="date" className={styles.wizInput} value={entitlementDate}
              onChange={(e) => setEntitlementDate(e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Review date</label>
            <input type="date" className={styles.wizInput} value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Expiry date</label>
            <input type="date" className={styles.wizInput} value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)} />
          </div>
          <div className={styles.wizField}>
            <label className={styles.wizLabel}>Evidence on file</label>
            <button type="button"
              className={hasEvidence ? `${styles.flagRow} ${styles.flagRowOn}` : styles.flagRow}
              onClick={() => setHasEvidence(!hasEvidence)}>
              <div className={hasEvidence ? `${styles.flagCheck} ${styles.flagCheckOn}` : styles.flagCheck}>
                {hasEvidence && <I name="check" size={11} color="white" />}
              </div>
              <span>{hasEvidence ? "Training certificate recorded" : "No evidence recorded"}</span>
            </button>
          </div>
          <div className={styles.wizField} style={{ gridColumn: "1 / -1" }}>
            <label className={styles.wizLabel}>Notes</label>
            <textarea rows={2} className={styles.wizInput} value={notes}
              onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <BtnPrimary onClick={handleSave}>
            <I name="check" size={13} color="var(--on-primary)" /> Save
          </BtnPrimary>
          {entry.entitlement && (
            <BtnSecondary onClick={() => { revokeEntitlement(user, entry.entitlement.id); onSaved(); onClose(); }}>
              <I name="xcircle" size={13} /> Revoke
            </BtnSecondary>
          )}
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
        </div>
      </Card>
    </div>
  );
};

const CellPill = ({ entitlement, canEdit, onOpen, notApplicable }) => {
  if (notApplicable) {
    return (
      <span style={{ color: "var(--outline)", fontSize: 11 }}>—</span>
    );
  }
  if (!entitlement) {
    return (
      <button className={styles.iconBtn} onClick={onOpen} disabled={!canEdit}
        title={canEdit ? "Set entitlement" : "Not recorded"}
        style={{ padding: "4px 10px", borderRadius: 12, background: "var(--surface-container)" }}>
        <span style={{ color: "var(--outline)", fontSize: 11 }}>missing</span>
      </button>
    );
  }
  const bucket = entitlementStatusBucket(entitlement);
  const meta = ENTITLEMENT_BUCKETS[bucket];
  return (
    <button className={styles.iconBtn} onClick={onOpen} disabled={!canEdit}
      style={{ padding: 0, background: "transparent", border: "none", cursor: canEdit ? "pointer" : "default" }}
      title={`${meta.label}${entitlement.reviewDate ? ` · review ${formatDate(entitlement.reviewDate)}` : ""}`}>
      <Pill bg={`color-mix(in srgb, ${meta.color} 14%, transparent)`} color={meta.color} small>
        {meta.label}
      </Pill>
    </button>
  );
};

export const OperatorEntitlementPage = ({ user, allUsers, sites, siteFilter }) => {
  const [tick, setTick] = useState(0);
  const [editing, setEditing] = useState(null);
  const refresh = () => setTick((t) => t + 1);

  const pack = getPackInstance(user.tenantId, RADIOGRAPHY_PACK_KEY);

  const dutyHolderUsers = useMemo(
    () => allUsers.filter((u) => IRMER_DUTY_HOLDER_ROLES.some((r) => userHasRole(u, r))),
    [allUsers],
  );

  const visibleSites = useMemo(() => {
    const base = siteFilter ? sites.filter((s) => s.id === siteFilter) : sites;
    if (!pack) return [];
    return base
      .map((site) => {
        const profile = getProfile(user.tenantId, site.id, pack.id);
        if (!profile?.applied) return null;
        const usersAtSite = dutyHolderUsers.filter((u) => u.siteId === site.id);
        const columns = columnsForSite({ ...profile, siteId: site.id }, dutyHolderUsers);
        return { site, profile, columns, usersAtSite };
      })
      .filter(Boolean)
      .filter((row) => row.columns.length > 0 && row.usersAtSite.length > 0);
  }, [sites, siteFilter, tick, pack?.id, dutyHolderUsers]);  // eslint-disable-line react-hooks/exhaustive-deps

  const allEntitlements = useMemo(
    () => listEntitlements(user.tenantId),
    [tick, user.tenantId],
  );

  // Coverage stats — per entitlement type across visible sites.
  const stats = useMemo(() => {
    const out = {};
    const ALL = [...EQUIPMENT_ENTITLEMENT_TYPES, ...PROCESS_ENTITLEMENT_TYPES, ...ROLE_ENTITLEMENT_TYPES];
    for (const type of ALL) {
      let total = 0, entitled = 0, review = 0, expired = 0, noEv = 0;
      for (const { site, columns, usersAtSite } of visibleSites) {
        if (!columns.includes(type)) continue;
        for (const u of usersAtSite) {
          if (!shouldShowCell(u, type)) continue;
          total += 1;
          const ent = allEntitlements.find((e) => e.userId === u.id && e.siteId === site.id && e.equipmentClass === type);
          if (!ent) { noEv += 1; continue; }
          const b = entitlementStatusBucket(ent);
          if (b === "entitled")    entitled += 1;
          else if (b === "review_due") review += 1;
          else if (b === "expired")    expired += 1;
          else if (b === "no_evidence") noEv += 1;
        }
      }
      out[type] = { total, entitled, review, expired, noEv, pct: total ? Math.round((entitled / total) * 100) : 0 };
    }
    return out;
  }, [visibleSites, allEntitlements]);

  if (!pack) {
    return <div style={{ padding: 20 }}>Radiography pack not configured.</div>;
  }

  return (
    <div>
      <h2 className={styles.areaTitle}>Operator Entitlement Register</h2>
      <p className={styles.areaLead}>
        IRMER 2017 requires the employer to maintain entitlement records for every
        practitioner, operator and referrer, for each modality, process and duty-holder role they
        are authorised to carry out. Click any cell to record entitlement, training evidence and
        the next review date.
      </p>

      <div className={styles.dashGrid} style={{ marginBottom: 18 }}>
        {[...EQUIPMENT_ENTITLEMENT_TYPES, ...PROCESS_ENTITLEMENT_TYPES, ...ROLE_ENTITLEMENT_TYPES].map((type) => {
          const s = stats[type];
          if (!s || s.total === 0) return null;
          return (
            <Card key={type} hover={false} className={styles.statTile}>
              <div className={styles.statTileLabel}>{ENTITLEMENT_TYPE_LABEL[type]}</div>
              <div className={styles.statTileValue}>{s.pct}%</div>
              <div className={styles.statTileHelper}>
                {s.entitled}/{s.total} entitled
                {s.review > 0 && ` · ${s.review} review`}
                {s.expired > 0 && ` · ${s.expired} expired`}
                {s.noEv > 0 && ` · ${s.noEv} missing`}
              </div>
            </Card>
          );
        })}
      </div>

      {visibleSites.length === 0 ? (
        <Card hover={false} className={styles.emptyCard}>
          <I name="usercheck" size={28} color="var(--outline-variant)" />
          <p>No applied radiography sites with IRMER duty-holders. Apply this pack to at least one site and assign roles to register entitlements.</p>
        </Card>
      ) : visibleSites.map(({ site, profile, columns, usersAtSite }) => {
        const canEdit = can(user, "entitlement.edit", { siteId: site.id });
        const profileMissing = !profile.rpsUserId;
        return (
          <Card key={site.id} hover={false} style={{ padding: 0, marginBottom: 18, overflow: "hidden" }}>
            <div style={{ padding: 16, borderBottom: "1px solid var(--outline-variant)" }}>
              <h3 className={styles.cardTitle}>{site.name}</h3>
              <p className={styles.cardLead}>
                {site.location ?? "—"}{profileMissing && " · "}
                {profileMissing && <span style={{ color: "#b36000" }}>RPS not assigned — site configuration incomplete</span>}
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className={styles.exportTable}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Operator</th>
                    {columns.map((c) => (
                      <th key={c} style={{ textAlign: "left" }}>{ENTITLEMENT_TYPE_LABEL[c]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersAtSite.map((opr) => (
                    <tr key={opr.id}>
                      <td>
                        <div className={styles.cardTitle}>{opr.displayName ?? opr.username}</div>
                        <div className={styles.cardLead}>{opr.jobTitle ?? ROLE_LABEL[opr.role]}</div>
                      </td>
                      {columns.map((type) => {
                        const ent = allEntitlements.find((e) =>
                          e.userId === opr.id && e.siteId === site.id && e.equipmentClass === type,
                        );
                        const showCell = shouldShowCell(opr, type);
                        return (
                          <td key={type}>
                            <CellPill
                              entitlement={ent}
                              canEdit={canEdit && showCell}
                              notApplicable={!showCell}
                              onOpen={() => setEditing({ user: opr, site, entitlementType: type, entitlement: ent })}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}

      {editing && (
        <EditDialog
          user={user}
          entry={editing}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
    </div>
  );
};
