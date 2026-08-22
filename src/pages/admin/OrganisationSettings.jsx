/**
 * Admin Centre → Organisation Settings.
 *
 * One row per tenant. Holds the group-wide defaults pulled into every
 * governance pack at setup time, so the user doesn't re-pick the same
 * Clinical Director / Default Approver / Reviewer / retention rules for
 * every pack.
 *
 * Pack-level overrides still win — the wizard's "Confirm Defaults" step
 * shows these as the baseline and lets each pack override where needed.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Card } from "../../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { I } from "../../components/Icon";
import {
  getOrgSettings, ensureOrgSettings, updateOrgSettings, DEFAULT_ORG_SETTINGS,
} from "../../services/governance/orgSettings.service";
import { listUsers } from "../../services/governance/users.service";
import { Store, TABLES } from "../../services/governance/store";
import { UserRole } from "../../services/governance/types";
import styles from "./OrganisationSettings.module.css";

/* Pull initial values from any existing pack instance so the dev tenant
   inherits Dental Group's existing CD / leads on first load. Used only when the
   org_settings row hasn't been created yet. */
function pullSeedFromExistingPack(tenantId) {
  const packs = Store.list(tenantId, TABLES.packs);
  if (!packs.length) return {};
  const p = packs[0];
  return {
    groupName: p.groupName ?? "",
    logoDataUrl: p.logoDataUrl ?? null,
    brandColor: p.brandColor ?? DEFAULT_ORG_SETTINGS.brandColor,
    clinicalDirectorUserId: p.clinicalDirectorUserId ?? null,
    defaultApproverUserId: p.defaultApproverUserId ?? null,
    defaultReviewerUserId: p.defaultReviewerUserId ?? null,
    defaultReviewCycleMonths: p.reviewCycleMonths ?? DEFAULT_ORG_SETTINGS.defaultReviewCycleMonths,
  };
}

const usersForRoles = (allUsers, roleFilters) =>
  allUsers.filter((u) => roleFilters.some((r) => u.role === r || u.secondaryRoles?.includes(r)));
const userOption = (u) => `${u.displayName ?? u.username} (${u.role})`;

const Field = ({ label, hint, children }) => (
  <div className={styles.field}>
    <label className={styles.label}>{label}{hint && <span className={styles.hint}> · {hint}</span>}</label>
    {children}
  </div>
);

export function OrganisationSettings() {
  const { user: authUser } = useAuth();
  const tenantId = authUser?.tenantId ?? "demo-tenant";
  // Build a governance-shaped actor for the permission gate
  const actor = useMemo(() => ({
    id: authUser?.id ?? authUser?.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId,
    siteId: authUser?.siteId ?? null,
    role: authUser?.role ?? UserRole.super_admin,
    secondaryRoles: authUser?.secondaryRoles ?? [],
  }), [authUser, tenantId]);

  const [form, setForm] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!tenantId) return;
    // Ensure the row exists (lazy migration from existing pack instance).
    let row = getOrgSettings(tenantId);
    if (!row) {
      row = ensureOrgSettings(tenantId, pullSeedFromExistingPack(tenantId));
    }
    setForm({ ...DEFAULT_ORG_SETTINGS, ...row });
    setAllUsers(listUsers(tenantId));
  }, [tenantId]);

  if (!form) return <div className={styles.loading}>Loading…</div>;

  const patch = (p) => setForm((f) => ({ ...f, ...p }));
  const save = () => {
    updateOrgSettings(actor, form);
    setSavedAt(new Date().toLocaleTimeString());
  };
  const onLogoFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ logoDataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Organisation Settings</h1>
          <p className={styles.lead}>
            Group-wide defaults pulled into every governance pack at setup time. Pack-specific
            overrides can be applied later in each pack's wizard.
          </p>
        </div>
        <div className={styles.actions}>
          {savedAt && <span className={styles.savedNote}>Saved {savedAt}</span>}
          <BtnPrimary onClick={save}>
            <I name="check" size={13} color="var(--on-primary)" /> Save settings
          </BtnPrimary>
        </div>
      </header>

      <Card hover={false} className={styles.card}>
        <h3 className={styles.cardTitle}>Group identity</h3>
        <div className={styles.grid}>
          <Field label="Group / organisation name">
            <input className={styles.input} value={form.groupName ?? ""}
              onChange={(e) => patch({ groupName: e.target.value })}
              placeholder="e.g. Dental Group" />
          </Field>
          <Field label="Brand colour" hint="Used on pack headers + exports">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.brandColor ?? "#1e6dd8"}
                onChange={(e) => patch({ brandColor: e.target.value })}
                style={{ width: 36, height: 32, border: "1px solid var(--outline-variant)", borderRadius: 6, padding: 0, background: "none", cursor: "pointer" }} />
              <input className={styles.input} value={form.brandColor ?? ""}
                onChange={(e) => patch({ brandColor: e.target.value })}
                placeholder="#1e6dd8" style={{ flex: 1 }} />
            </div>
          </Field>
          <Field label="Logo" hint="Upload a PNG / SVG, stored locally in browser">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {form.logoDataUrl ? (
                <img src={form.logoDataUrl} alt="logo" className={styles.logoPreview} />
              ) : (
                <div className={styles.logoEmpty}><I name="image" size={18} color="var(--outline)" /></div>
              )}
              <input type="file" accept="image/*" onChange={(e) => onLogoFile(e.target.files?.[0])} />
              {form.logoDataUrl && (
                <BtnSecondary onClick={() => patch({ logoDataUrl: null })}>Remove</BtnSecondary>
              )}
            </div>
          </Field>
        </div>
      </Card>

      <Card hover={false} className={styles.card}>
        <h3 className={styles.cardTitle}>Governance roles</h3>
        <p className={styles.cardLead}>
          These people are the default for every pack. Each pack can still override them in step 6
          (Roles & Responsibilities) if a different person owns that pack.
        </p>
        <div className={styles.grid}>
          <Field label="Clinical Director" hint="Approves clinical documents across all packs">
            <select className={styles.input} value={form.clinicalDirectorUserId ?? ""}
              onChange={(e) => patch({ clinicalDirectorUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.clinical_director]).map((u) => (
                <option key={u.id} value={u.id}>{userOption(u)}</option>
              ))}
            </select>
          </Field>
          <Field label="Governance Lead" hint="Owns governance workflows across all packs">
            <select className={styles.input} value={form.governanceLeadUserId ?? ""}
              onChange={(e) => patch({ governanceLeadUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.governance_lead]).map((u) => (
                <option key={u.id} value={u.id}>{userOption(u)}</option>
              ))}
            </select>
          </Field>
          <Field label="Default Approver" hint="Receives docs for clinical approval">
            <select className={styles.input} value={form.defaultApproverUserId ?? ""}
              onChange={(e) => patch({ defaultApproverUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.clinical_director, UserRole.governance_lead, UserRole.group_admin])
                .map((u) => <option key={u.id} value={u.id}>{userOption(u)}</option>)}
            </select>
          </Field>
          <Field label="Default Reviewer" hint="Receives draft docs for review">
            <select className={styles.input} value={form.defaultReviewerUserId ?? ""}
              onChange={(e) => patch({ defaultReviewerUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.governance_lead, UserRole.ipc_lead, UserRole.decontamination_lead, UserRole.irmer_lead])
                .map((u) => <option key={u.id} value={u.id}>{userOption(u)}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      <Card hover={false} className={styles.card}>
        <h3 className={styles.cardTitle}>Document defaults</h3>
        <p className={styles.cardLead}>
          Baseline values applied to every published document. Each pack can override its own
          cadence in step 9 (Audit &amp; Evidence Setup).
        </p>
        <div className={styles.grid}>
          <Field label="Default review cycle" hint="How often each document is re-reviewed">
            <select className={styles.input} value={form.defaultReviewCycleMonths ?? 12}
              onChange={(e) => patch({ defaultReviewCycleMonths: Number(e.target.value) })}>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={18}>18 months</option>
              <option value={24}>24 months</option>
            </select>
          </Field>
          <Field label="Default acknowledgement deadline" hint="Days staff have to acknowledge">
            <select className={styles.input} value={form.defaultAckDays ?? 14}
              onChange={(e) => patch({ defaultAckDays: Number(e.target.value) })}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
          </Field>
          <Field label="Evidence retention" hint="How long uploaded evidence is kept">
            <select className={styles.input} value={form.evidenceRetentionYears ?? 7}
              onChange={(e) => patch({ evidenceRetentionYears: Number(e.target.value) })}>
              <option value={3}>3 years</option>
              <option value={5}>5 years</option>
              <option value={7}>7 years (CQC default)</option>
              <option value={11}>11 years (paediatric)</option>
            </select>
          </Field>
        </div>
      </Card>
    </div>
  );
}
