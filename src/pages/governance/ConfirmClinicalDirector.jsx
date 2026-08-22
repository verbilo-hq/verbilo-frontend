/**
 * One-screen Confirm Clinical Director step.
 *
 * Rendered the first time a user opens the Clinical Governance pack card if
 * the group has not yet named a Clinical Director (Tier-2 onboarding data).
 * Until a CD is named, the protocol library is gated — clinicians cannot
 * acknowledge protocols that the group has not formally adopted, and adoption
 * requires a named CD acting on behalf of the group.
 *
 * Eligible roles: clinical_director (the obvious case) plus governance_lead
 * and super_admin so that a PM or principal can be seated as the CD's
 * deputy during onboarding (real groups occasionally use this pattern when
 * the CD is contracted rather than employed).
 */

import { useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { BtnPrimary } from "../../components/ui/Buttons";
import { BackButton, roleLabel } from "./Shared";
import { setClinicalDirector } from "../../services/governance/packs.service";
import { UserRole } from "../../services/governance/types";
import styles from "./Governance.module.css";

const ELIGIBLE_ROLES = new Set([
  UserRole.clinical_director,
  UserRole.governance_lead,
  UserRole.super_admin,
]);

export const ConfirmClinicalDirector = ({ user, allUsers, onConfirmed, onCancel }) => {
  const eligible = allUsers.filter((u) => ELIGIBLE_ROLES.has(u.role));
  const [selected, setSelected] = useState(
    eligible.find((u) => u.role === UserRole.clinical_director)?.id ?? eligible[0]?.id ?? ""
  );

  const handleConfirm = () => {
    if (!selected) return;
    setClinicalDirector(user, selected);
    onConfirmed();
  };

  return (
    <div>
      <BackButton onClick={onCancel} label="Back to catalogue" />

      <div className={styles.pvDocHeader}>
        <div className={styles.pvDocEyebrow}>Clinical Governance · Before you open the library</div>
        <h2 className={styles.pvDocTitle}>Confirm your Clinical Director</h2>
        <p className={styles.pvDocSubtitle}>
          The Clinical Director adopts each clinical protocol on behalf of the group. After
          adoption, every clinician opens the protocol, reads it and acknowledges it. Each
          signature is logged with name, role and timestamp for inspection.
        </p>
      </div>

      <Card hover={false} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className={styles.wizField}>
          <label className={styles.wizLabel}>Clinical Director</label>
          <select
            className={styles.wizSelect}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            {eligible.length === 0 && <option value="">No eligible users — add a clinician first</option>}
            {eligible.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName} — {roleLabel(u.role)}
              </option>
            ))}
          </select>
          <span className={styles.wizHint}>
            Only the named CD can adopt a protocol on behalf of the group. Other clinicians
            acknowledge it after adoption. The CD can be changed later from the pack settings.
          </span>
        </div>

        <div>
          <BtnPrimary onClick={handleConfirm} disabled={!selected}>
            <I name="check" size={12} color="var(--on-primary)" /> Confirm and open library
          </BtnPrimary>
        </div>
      </Card>
    </div>
  );
};
