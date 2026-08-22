import { Fragment, useEffect, useMemo, useState } from "react";
import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { BtnPrimary, BtnSecondary } from "../../components/ui/Buttons";
import { Pill } from "../../components/ui/Pill";
import { BackButton, formatDate, useSetHeaderActions } from "./Shared";
import { EquipmentRegisterDeconStep } from "./EquipmentRegisterDeconStep";
import { EquipmentRegisterRadiographyStep } from "./EquipmentRegisterRadiographyStep";
import { EquipmentRegisterMedEmergStep } from "./EquipmentRegisterMedEmergStep";
import { CredentialsRegisterSafeguardingStep } from "./CredentialsRegisterSafeguardingStep";
import { GenericRegisterStep } from "./GenericRegisterStep";
import { getStepHeader, getRegisterSchema } from "../../services/governance/packStepOverrides";
import { listAssetsBySite } from "../../services/governance/equipmentAssets.service";
import {
  generateStep8Slots, countStep8Slots, findCbctRiskProfiles,
} from "../../services/governance/radiographySlots";
import {
  getPackInstance, ensurePackInstance, updatePackSetup, transitionPack,
  getPackCatalogueEntry, getTenantName, DECON_PACK_KEY,
} from "../../services/governance/packs.service";
import {
  ensureProfile, getProfile, setApplied, updateProfile, profileCompletion,
} from "../../services/governance/siteProfiles.service";
import {
  listForSite, createEquipment, removeEquipment,
} from "../../services/governance/equipment.service";
import {
  activateFromMasterLibrary, ensureSiteAppendicesForPack,
  saveDraftBody, submitForReview, getCurrentVersion, setSopSelection,
  confirmSopSkipAfterReEvaluation,
} from "../../services/governance/documents.service";
import { tierFor, SopTier, SOP_TIER_META, findReEvaluationCandidates } from "../../services/governance/sopTiers";
import { listMasterTemplates } from "../../services/governance/masterTemplates.service";
import {
  previewApprovalCascade, publishPackForApproval, recordReturnComment,
} from "../../services/governance/approvals.service";
import { Store, TABLES } from "../../services/governance/store";
import { getPackConfig } from "../../services/governance/packConfig";
import {
  getOrgSettingsWithDefaults, ensureOrgSettings,
} from "../../services/governance/orgSettings.service";
import {
  PackStatus, DocumentStatus, UserRole, EQUIPMENT_TYPE_LABEL, EQUIPMENT_TYPES_BY_PACK,
  SITE_PROFILE_FLAGS_BY_PACK, auditTypesForPack,
} from "../../services/governance/types";
import { SopPreview } from "../../components/SopPreview";
import { useCap } from "../../services/devRole";
import styles from "./Governance.module.css";

/* ─── Wizard step config ─────────────────────────────────────────────────── */
const WIZARD_STEPS = [
  { id: "intro",     label: "Pack selection"      },
  { id: "defaults",  label: "Confirm defaults"    },
  { id: "sites",     label: "Sites in scope"      },
  { id: "profiles",  label: "Site profiles"       },
  { id: "equipment", label: "Equipment register"  },
  { id: "group",     label: "Pack roles & cadence" },
  { id: "documents", label: "Documents to review" },
  { id: "appendices",label: "Site appendices"    },
  { id: "audits",    label: "Audit & evidence"   },
  { id: "review",    label: "Review & submit"     },
];

/* Per-site local-lead fields (vs the group-level leads on the pack instance). */
const LOCAL_LEAD_FIELDS_BY_PACK = {
  decontamination_ipc: [
    { id: "localDeconLeadUserId",  label: "Local Decontamination Lead", filter: ["decontamination_lead", "ipc_lead", "practice_manager"] },
    { id: "localIpcLeadUserId",    label: "Local IPC Lead",             filter: ["ipc_lead", "practice_manager"] },
    { id: "practiceManagerUserId", label: "Practice Manager",           filter: ["practice_manager"] },
    { id: "localReviewerUserId",   label: "Local Reviewer",             filter: ["governance_lead", "ipc_lead", "practice_manager", "decontamination_lead"] },
  ],
  radiography_irmer: [
    { id: "irmerLeadUserId", label: "Local Radiation Practitioner / Clinical Lead", filter: ["irmer_lead", "clinical_director", "practice_manager"] },
    { id: "rpsUserId",       label: "Radiation Protection Supervisor (RPS)", filter: ["clinical_director", "irmer_lead", "practice_manager"] },
  ],
  medical_emergencies: [
    // Consolidated post-CQC review: the separate Med-Emergency Lead and
    // BLS Lead always devolved to the same statutory role, so they're
    // merged into a single Resuscitation & Medical Emergency Lead. The
    // Practice Manager row stays as the operational counterpart; the
    // legacy 3rd row (localResusLeadUserId) is dropped.
    { id: "localResusMedEmergencyLeadUserId", label: "Local Resuscitation & Medical Emergency Lead", filter: ["clinical_director", "governance_lead", "practice_manager"] },
    { id: "practiceManagerUserId",            label: "Practice Manager",                              filter: ["practice_manager"] },
  ],
  safeguarding_governance: [
    // CQC + Working Together To Safeguard Children mandate one DSL per site
    // with the Practice Manager as the operational counterpart. The Deputy
    // DSL is tracked on the Step 5 credentials register, not as a per-site
    // lead dropdown (deputy doesn't need governance-platform routing rights).
    { id: "localDsLUserId",        label: "Local Designated Safeguarding Lead (DSL)", filter: ["clinical_director", "governance_lead", "practice_manager"] },
    { id: "practiceManagerUserId", label: "Practice Manager",                          filter: ["practice_manager"] },
  ],
  complaints_incidents: [
    { id: "designatedComplaintsOfficerUserId", label: "Designated Complaints Officer", filter: ["governance_lead", "clinical_director", "practice_manager"] },
    { id: "practiceManagerUserId",             label: "Practice Manager",              filter: ["practice_manager"] },
  ],
  practice_operations: [
    { id: "headReceptionistUserId",     label: "Head Receptionist / Business Manager", filter: ["practice_manager", "site_lead", "group_admin"] },
    { id: "clinicalComplianceLeadUserId", label: "Clinical Compliance Lead",            filter: ["clinical_director", "governance_lead", "practice_manager"] },
  ],
  audit_evidence: [
    { id: "groupAuditCoordinatorUserId", label: "Group Audit Coordinator",    filter: ["governance_lead", "auditor", "group_admin"] },
    { id: "internalReviewerUserId",      label: "Internal Clinical Reviewer", filter: ["clinical_director", "governance_lead", "auditor"] },
  ],
  site_specific_sops: [
    { id: "registeredProviderUserId",    label: "Registered Provider / Principal", filter: ["clinical_director", "group_admin", "practice_manager"] },
    { id: "deputyComplianceOfficerUserId", label: "Deputy Compliance Officer",     filter: ["governance_lead", "clinical_director", "practice_manager"] },
  ],
};

/* Maps a site-profile flag → equipment types it enables. Types absent from
 * this map (e.g. waste contractor) are always available regardless of flags. */
const FLAG_TO_EQUIPMENT_TYPES_BY_PACK = {
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
  medical_emergencies: {
    drugBoxPresent:      ["emergency_drug_box"],
    aedPresent:          ["aed_defibrillator"],
    oxygenPresent:       ["oxygen_cylinder"],
    suctionPresent:      ["portable_suction"],
    bagValveMaskPresent: ["bag_valve_mask"],
    bloodGlucosePresent: ["blood_glucose_meter"],
  },
};

/* ─── Primitives ─────────────────────────────────────────────────────────── */
const ProgressHeader = ({ step }) => (
  <div className={styles.wizardProgress}>
    {WIZARD_STEPS.map((s, i) => {
      const isDone = i < step;
      const isCurrent = i === step;
      return (
        <div key={s.id} className={styles.wizardStepWrap}>
          <div className={[
            styles.wizardDot,
            isDone ? styles.wizardDotDone : "",
            isCurrent ? styles.wizardDotCurrent : "",
          ].filter(Boolean).join(" ")}>
            {isDone ? <I name="check" size={11} color="white" /> : i + 1}
          </div>
          <div className={[
            styles.wizardLabel,
            isCurrent ? styles.wizardLabelCurrent : "",
          ].filter(Boolean).join(" ")}>{s.label}</div>
          {i < WIZARD_STEPS.length - 1 && (
            <div className={isDone ? `${styles.wizardConnector} ${styles.wizardConnectorDone}` : styles.wizardConnector} />
          )}
        </div>
      );
    })}
  </div>
);

const Field = ({ label, children, hint }) => (
  <div className={styles.wizField}>
    <label className={styles.wizLabel}>{label}{hint && <span className={styles.wizHint}> · {hint}</span>}</label>
    {children}
  </div>
);

const userOption = (u) => `${u.displayName ?? u.username} (${u.role})`;
const usersForRoles = (allUsers, roleFilters) =>
  allUsers.filter((u) => roleFilters.some((r) => u.role === r || u.secondaryRoles?.includes(r)));

/* ─── Site-profile flag groupings ─────────────────────────────────────────
 * Per-pack category metadata for Step 4. When a pack's flag list carries
 * `category` fields (currently radiography only), the FlagGroups renderer
 * splits them into titled sub-sections. Other packs fall back to a single
 * "Equipment & processes" block. */
const FLAG_CATEGORY_META = {
  // Radiography
  imaging:         { icon: "wrench",    title: "Imaging Modalities",            subtitle: "Equipment in clinical use at this site" },
  processing:      { icon: "layers",    title: "Processing System",             subtitle: "Image capture / processing tech stack" },
  operational:     { icon: "clipboard", title: "Operational Focus",             subtitle: "Workflow & governance toggles" },
  // Medical Emergencies & Resuscitation
  clinical_scope:  { icon: "wrench",    title: "Clinical Modalities & Scope",   subtitle: "Drives advanced kit + age-specific dosing templates" },
  policy_workflow: { icon: "clipboard", title: "Policy & Workflow Requirements", subtitle: "Operational governance & evidence" },
  // Safeguarding Governance
  demographics:    { icon: "baby",      title: "Patient Demographics & Scope",  subtitle: "Drives child-protection vs MCA / DoLS workflows" },
  reporting:       { icon: "clipboard", title: "Local Reporting Architecture",  subtitle: "Statutory agency declarations & acknowledgements" },
};

/* Renders one or more grouped sections of flag toggles. Hides `mandatory`
 * flags (they're kept silently true in profile state via a useEffect at
 * the SiteProfilesStep root). When no flag carries a `category`, falls
 * back to a single unlabelled section. */
function FlagGroups({ flags, profile, onToggle }) {
  const visible = flags.filter((f) => !f.mandatory);
  const hasCategories = visible.some((f) => !!f.category);

  if (!hasCategories) {
    return (
      <div className={styles.siteSplitSection}>
        <div className={styles.siteSplitSectionTitle}>Equipment &amp; processes</div>
        <FlagGrid flags={visible} profile={profile} onToggle={onToggle} />
      </div>
    );
  }

  const groups = Object.keys(FLAG_CATEGORY_META)
    .map((key) => ({ key, meta: FLAG_CATEGORY_META[key], flags: visible.filter((f) => f.category === key) }))
    .filter((g) => g.flags.length > 0);

  return (
    <>
      {groups.map((g) => (
        <div key={g.key} className={styles.siteSplitSection}>
          <div className={styles.siteSplitSectionTitle} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <I name={g.meta.icon} size={13} color="var(--on-surface-variant)" />
            <span>{g.meta.title}</span>
            {g.meta.subtitle && (
              <span style={{
                fontSize: 11, fontWeight: 500, color: "var(--on-surface-variant)",
                textTransform: "none", letterSpacing: 0,
              }}>· {g.meta.subtitle}</span>
            )}
          </div>
          <FlagGrid flags={g.flags} profile={profile} onToggle={onToggle} />
        </div>
      ))}
    </>
  );
}

function FlagGrid({ flags, profile, onToggle }) {
  return (
    <div className={styles.flagGrid}>
      {flags.map((f) => {
        const on = !!profile[f.id];
        return (
          <button
            key={f.id}
            type="button"
            className={on ? `${styles.flagRow} ${styles.flagRowOn}` : styles.flagRow}
            onClick={() => onToggle(f.id)}
          >
            <div className={on ? `${styles.flagCheck} ${styles.flagCheckOn}` : styles.flagCheck}>
              {on && <I name="check" size={11} color="white" />}
            </div>
            <div style={{ flex: 1, textAlign: "left", fontWeight: 600, fontSize: 13 }}>{f.label}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Step 1 · Confirm Defaults (read-only, sourced from org_settings) ──── */
const ConfirmDefaultsStep = ({ user, allUsers }) => {
  const tenantId = user.tenantId;
  useEffect(() => { ensureOrgSettings(tenantId); }, [tenantId]);
  const settings = getOrgSettingsWithDefaults(tenantId);
  const nameOf = (id) => id ? (allUsers.find((u) => u.id === id)?.displayName ?? "(unknown)") : "(not set)";
  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Confirm Defaults</h3>
      <p className={styles.wizStepLead}>
        These are your organisation-wide defaults — they apply across every governance pack.
        Pack-specific overrides happen in step 6 (Pack roles &amp; cadence).
      </p>
      <div className={styles.wizHintBox}>
        <I name="info" size={13} color="var(--primary)" />
        <span>To edit these values, go to <strong>Admin Centre → Organisation Settings</strong>.</span>
      </div>
      <div className={styles.reviewGrid}>
        <Card hover={false} className={styles.reviewCard}>
          <div className={styles.reviewCardHead}><h4 className={styles.reviewCardTitle}>Group identity</h4></div>
          <ul className={styles.reviewList}>
            <li>Name: {settings.groupName || "(not set)"}</li>
            <li>Brand colour: <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: settings.brandColor, border: "1px solid var(--outline-variant)" }} />
              {settings.brandColor}
            </span></li>
            <li>Logo: {settings.logoDataUrl ? "Uploaded" : "(none)"}</li>
          </ul>
        </Card>
        <Card hover={false} className={styles.reviewCard}>
          <div className={styles.reviewCardHead}><h4 className={styles.reviewCardTitle}>Governance roles</h4></div>
          <ul className={styles.reviewList}>
            <li>Clinical Director: {nameOf(settings.clinicalDirectorUserId)}</li>
            <li>Governance Lead: {nameOf(settings.governanceLeadUserId)}</li>
            <li>Default Approver: {nameOf(settings.defaultApproverUserId)}</li>
            <li>Default Reviewer: {nameOf(settings.defaultReviewerUserId)}</li>
          </ul>
        </Card>
        <Card hover={false} className={styles.reviewCard}>
          <div className={styles.reviewCardHead}><h4 className={styles.reviewCardTitle}>Document defaults</h4></div>
          <ul className={styles.reviewList}>
            <li>Review cycle: {settings.defaultReviewCycleMonths} months</li>
            <li>Acknowledgement deadline: {settings.defaultAckDays} days</li>
            <li>Evidence retention: {settings.evidenceRetentionYears} years</li>
            <li>Numbering format: {settings.documentNumberingFormat}</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

/* ─── Step 0 · Pack Selection (intro) ────────────────────────────────────── */
const IntroStep = ({ packEntry }) => (
  <div className={styles.wizStep}>
    <h3 className={styles.wizStepTitle}>Pack Selection</h3>
    <p className={styles.wizStepLead}>
      You're configuring the <strong>{packEntry?.name ?? "governance pack"}</strong>. Continue
      through the remaining steps — most fields are pre-filled with sensible defaults and can be
      edited later.
    </p>
    <p className={styles.cardLead} style={{ marginTop: 8 }}>
      Platform-provided template — your group configures sites, leads and equipment in the next steps.
    </p>
  </div>
);

/* ─── Step 1 · Sites in Scope ────────────────────────────────────────────── */
const SitesStep = ({ tenantId, instance, sites, user, onChange, packKey }) => {
  const profiles = sites.map((s) => ({ site: s, profile: getProfile(tenantId, s.id, instance.id) }));
  const appliedCount = profiles.filter((p) => p.profile?.applied).length;
  const packName = getPackCatalogueEntry(packKey)?.name ?? "Governance Pack";
  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Sites in Scope</h3>
      <p className={styles.wizStepLead}>
        Choose which practices the {packName} applies to. Each applied site will configure its own
        profile and equipment register in the next two steps.
      </p>
      <div className={styles.siteGrid}>
        {profiles.map(({ site, profile }) => {
          const applied = profile?.applied ?? false;
          return (
            <Card
              key={site.id}
              hover={false}
              className={applied ? `${styles.siteApplyCard} ${styles.siteApplyCardActive}` : styles.siteApplyCard}
              onClick={() => { setApplied(user, site.id, !applied, packKey); onChange(); }}
            >
              <div className={styles.siteApplyTop}>
                <div className={applied ? `${styles.siteCheckbox} ${styles.siteCheckboxOn}` : styles.siteCheckbox}>
                  {applied && <I name="check" size={11} color="white" />}
                </div>
                <Pill
                  bg={site.active ? "rgba(46,125,50,0.10)" : "var(--surface-container)"}
                  color={site.active ? "#2e7d32" : "var(--on-surface-variant)"}
                  small
                >
                  {site.active ? "Active" : "Inactive"}
                </Pill>
              </div>
              <h4 className={styles.siteApplyName}>{site.name}</h4>
              <div className={styles.siteApplyLocation}>{site.location ?? "—"}</div>
            </Card>
          );
        })}
      </div>
      <div className={styles.wizHintBox}>
        <I name="info" size={13} color="var(--primary)" />
        <span><strong>{appliedCount}</strong> of {sites.length} sites selected.</span>
      </div>
    </div>
  );
};

/* ─── Step 2 · Group-wide defaults ──────────────────────────────────────── */
const GroupDefaultsStep = ({ instance, onPatch, allUsers, packKey }) => {
  const config = getPackConfig(packKey);
  const auditDefaults = config?.auditDefaults ?? { frequency: "monthly", reminderDays: 14, retentionYears: 7 };
  const providers = config?.externalProviders ?? [];
  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>{getStepHeader("group", packKey) ?? "Pack Roles & Cadence Defaults"}</h3>
      <p className={styles.wizStepLead}>
        Set the framework for the whole group: who's accountable, who approves and reviews, and
        the default audit cadence. Per-site local leads come next.
      </p>

      <Card hover={false} style={{ padding: 18 }}>
        <h4 className={styles.cardTitle}>Roles &amp; ownership</h4>
        <div className={styles.wizFormGrid} style={{ marginTop: 12 }}>
          <Field label="Clinical Director" hint="Approves the pack + major versions">
            <select
              data-highlight="clinicalDirectorUserId"
              className={styles.wizSelect}
              value={instance.clinicalDirectorUserId ?? ""}
              onChange={(e) => onPatch({ clinicalDirectorUserId: e.target.value || null })}
            >
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.clinical_director]).map((u) => (
                <option key={u.id} value={u.id}>{userOption(u)}</option>
              ))}
            </select>
          </Field>
          {(config?.roles ?? []).map((role) => (
            <Field key={role.id} label={role.label} hint={role.hint}>
              <select
                data-highlight={role.id}
                className={styles.wizSelect}
                value={instance[role.id] ?? ""}
                onChange={(e) => onPatch({ [role.id]: e.target.value || null })}
              >
                <option value="">— select user —</option>
                {usersForRoles(allUsers, role.filter ?? []).map((u) => (
                  <option key={u.id} value={u.id}>{userOption(u)}</option>
                ))}
              </select>
            </Field>
          ))}
          <Field label="Default Approver" hint="Receives documents for clinical approval">
            <select className={styles.wizSelect} value={instance.defaultApproverUserId ?? ""}
              onChange={(e) => onPatch({ defaultApproverUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.clinical_director, UserRole.governance_lead, UserRole.group_admin])
                .map((u) => <option key={u.id} value={u.id}>{userOption(u)}</option>)}
            </select>
          </Field>
          <Field label="Default Reviewer" hint="Receives draft documents for review">
            <select className={styles.wizSelect} value={instance.defaultReviewerUserId ?? ""}
              onChange={(e) => onPatch({ defaultReviewerUserId: e.target.value || null })}>
              <option value="">— select user —</option>
              {usersForRoles(allUsers, [UserRole.governance_lead, UserRole.ipc_lead, UserRole.decontamination_lead, UserRole.irmer_lead])
                .map((u) => <option key={u.id} value={u.id}>{userOption(u)}</option>)}
            </select>
          </Field>
        </div>
      </Card>

      {providers.length > 0 && (
        <Card hover={false} style={{ padding: 18 }}>
          <h4 className={styles.cardTitle}>External providers</h4>
          <p className={styles.cardLead}>
            Named external advisers — surfaced on every site's local rules and evidence pack.
          </p>
          <div className={styles.wizFormGrid} style={{ marginTop: 12 }}>
            {providers.map((p) => (
              <Fragment key={p.id}>
                <Field label={p.label} hint="Provider organisation">
                  <input className={styles.wizInput} value={instance[p.id] ?? ""}
                    onChange={(e) => onPatch({ [p.id]: e.target.value })}
                    placeholder={p.placeholder} />
                </Field>
                <Field label={p.contactLabel} hint="Email or phone">
                  <input className={styles.wizInput} value={instance[p.contactId] ?? ""}
                    onChange={(e) => onPatch({ [p.contactId]: e.target.value })}
                    placeholder={p.contactPlaceholder} />
                </Field>
              </Fragment>
            ))}
          </div>
        </Card>
      )}

      <Card hover={false} style={{ padding: 18 }}>
        <h4 className={styles.cardTitle}>Audit &amp; evidence defaults</h4>
        <p className={styles.cardLead}>Starting cadence + retention. Each audit type can override these later.</p>
        <div className={styles.wizFormGrid} style={{ marginTop: 12 }}>
          <Field label="Default audit frequency">
            <select className={styles.wizSelect} value={instance.defaultAuditFrequency ?? auditDefaults.frequency}
              onChange={(e) => onPatch({ defaultAuditFrequency: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannually">Six-Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </Field>
          <Field label="Protocol review cycle" hint="How often each protocol is re-reviewed">
            <select className={styles.wizSelect} value={instance.reviewCycleMonths ?? 12}
              onChange={(e) => onPatch({ reviewCycleMonths: Number(e.target.value) })}>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={18}>18 months</option>
              <option value={24}>24 months</option>
            </select>
          </Field>
          <Field label="Reminder lead time" hint="Days before due date">
            <select className={styles.wizSelect} value={instance.evidenceReminderDays ?? auditDefaults.reminderDays}
              onChange={(e) => onPatch({ evidenceReminderDays: Number(e.target.value) })}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
          </Field>
          <Field label="Evidence retention" hint="How long uploaded evidence is kept">
            <select className={styles.wizSelect} value={instance.evidenceRetentionYears ?? auditDefaults.retentionYears}
              onChange={(e) => onPatch({ evidenceRetentionYears: Number(e.target.value) })}>
              <option value={3}>3 years</option>
              <option value={5}>5 years</option>
              <option value={7}>7 years (CQC default)</option>
              <option value={11}>11 years (paediatric)</option>
            </select>
          </Field>
          <Field label="Overdue escalation" hint="Auto-flag when N days overdue">
            <select className={styles.wizSelect} value={instance.overdueEscalationDays ?? 7}
              onChange={(e) => onPatch({ overdueEscalationDays: Number(e.target.value) })}>
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </Field>
        </div>
      </Card>
    </div>
  );
};

/* ─── Shared site rail used by per-site steps 3 + 4 ──────────────────────── */
const SiteRail = ({ appliedProfiles, sites, activeSiteId, onSelect, completion }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {appliedProfiles.map((p) => {
      const site = sites.find((s) => s.id === p.siteId);
      const pct = completion(p);
      const isActive = activeSiteId === p.siteId;
      return (
        <button
          key={p.id}
          type="button"
          data-highlight={`site-profile-${p.siteId}`}
          className={isActive ? `${styles.siteRailRow} ${styles.siteRailRowActive}` : styles.siteRailRow}
          onClick={() => onSelect(p.siteId)}
        >
          <div className={styles.siteRailRowName}>{site?.name ?? "Unknown"}</div>
          {pct != null && <div className={styles.siteRailRowPct}>{pct}%</div>}
        </button>
      );
    })}
  </div>
);

const EmptyAppliedSitesNotice = ({ title, lead }) => (
  <div className={styles.wizStep}>
    <h3 className={styles.wizStepTitle}>{title}</h3>
    <div className={styles.wizHintBox}>
      <I name="info" size={13} color="var(--primary)" />
      <span>{lead}</span>
    </div>
  </div>
);

/* ─── Step 3 · Per-site profiles ─────────────────────────────────────────── */
const SiteProfilesStep = ({ user, sites, appliedProfiles, allUsers, packKey, onChange }) => {
  const flags = SITE_PROFILE_FLAGS_BY_PACK[packKey] ?? [];
  const leadFields = LOCAL_LEAD_FIELDS_BY_PACK[packKey] ?? [];
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);

  useEffect(() => {
    // If the selected site is no longer applied, fall back to the first applied site.
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  /* Mandatory flags (statutorily required for the pack — e.g. all IRMER
   * compliance flags) are hidden from the UI but must be kept true in
   * profile state so downstream audits / master SOPs that gate on them
   * still activate. On entering this step, silently set any mandatory
   * flag to true on every applied profile where it's currently false. */
  useEffect(() => {
    const mandatoryFlags = flags.filter((f) => f.mandatory);
    if (mandatoryFlags.length === 0) return;
    let touched = false;
    for (const p of appliedProfiles) {
      const patch = {};
      for (const f of mandatoryFlags) if (!p[f.id]) patch[f.id] = true;
      if (Object.keys(patch).length > 0) {
        updateProfile(user, p.siteId, patch, packKey);
        touched = true;
      }
    }
    if (touched) onChange();
  // We intentionally depend on `flags` and the count of applied sites; we
  // don't want this re-running every time a user toggles an unrelated flag.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packKey, appliedProfiles.length]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Site Profiles"
        lead="Go back to Sites in scope and select at least one practice. Each applied site needs a profile before you can submit for approval."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);
  const completionFor = (profile) => profileCompletion(profile, packKey).pct;

  const toggleFlag = (flagId) => {
    if (!activeProfile) return;
    updateProfile(user, activeProfile.siteId, { [flagId]: !activeProfile[flagId] }, packKey);
    onChange();
  };
  const setLead = (fieldId, value) => {
    if (!activeProfile) return;
    updateProfile(user, activeProfile.siteId, { [fieldId]: value || null }, packKey);
    onChange();
  };

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>{getStepHeader("profiles", packKey) ?? "Site Profiles"}</h3>
      <p className={styles.wizStepLead}>
        For each applied site, answer the yes/no questions and assign local leads. Your answers
        determine which SOPs and audits activate at that site.
      </p>
      <div className={styles.siteSplit}>
        <aside className={styles.siteSplitRail}>
          <div className={styles.siteSplitRailLabel}>Applied sites</div>
          <SiteRail
            appliedProfiles={appliedProfiles}
            sites={sites}
            activeSiteId={activeSiteId}
            onSelect={setActiveSiteId}
            completion={completionFor}
          />
        </aside>
        <div className={styles.siteSplitPane}>
          {activeProfile && (
            <>
              <h4 className={styles.cardTitle} style={{ marginBottom: 4 }}>{activeSite?.name}</h4>
              <p className={styles.cardLead}>{activeSite?.location}</p>

              <FlagGroups
                flags={flags}
                profile={activeProfile}
                onToggle={toggleFlag}
                packKey={packKey}
              />

              {leadFields.length > 0 && (
                <div className={styles.siteSplitSection}>
                  <div className={styles.siteSplitSectionTitle}>Local leads</div>
                  <div className={styles.wizFormGrid}>
                    {leadFields.map((field) => (
                      <Field key={field.id} label={field.label}>
                        <select className={styles.wizSelect} value={activeProfile[field.id] ?? ""}
                          onChange={(e) => setLead(field.id, e.target.value)}>
                          <option value="">— select user —</option>
                          {usersForRoles(allUsers, field.filter).map((u) => (
                            <option key={u.id} value={u.id}>{userOption(u)}</option>
                          ))}
                        </select>
                      </Field>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Step 4 · Per-site Equipment Register ───────────────────────────────── */
const EquipmentRegisterStep = ({ user, sites, appliedProfiles, packKey, onChange }) => {
  const allTypes = EQUIPMENT_TYPES_BY_PACK[packKey] ?? [];
  const flagMap = FLAG_TO_EQUIPMENT_TYPES_BY_PACK[packKey] ?? {};
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [addingType, setAddingType] = useState("");
  const [draft, setDraft] = useState({});

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Equipment Register"
        lead="Go back to Sites in scope first — equipment is recorded per site."
      />
    );
  }

  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);

  // Equipment types enabled at the active site = types whose governing flag is
  // true, plus any types not governed by a flag at all.
  const enabledTypes = (() => {
    if (!activeProfile) return [];
    const enabledByFlag = new Set();
    for (const [flag, types] of Object.entries(flagMap)) {
      if (activeProfile[flag]) types.forEach((t) => enabledByFlag.add(t));
    }
    const flagGoverned = new Set(Object.values(flagMap).flat());
    return allTypes.filter((t) => enabledByFlag.has(t) || !flagGoverned.has(t));
  })();

  const records = activeSiteId ? listForSite(user.tenantId, activeSiteId, packKey) : [];
  const recordsByType = records.reduce((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  const startAdd = (type) => {
    setAddingType(type);
    setDraft({ type, makeModel: "", serialNumber: "", roomLocation: "", nextServiceDate: "" });
  };
  const cancelAdd = () => { setAddingType(""); setDraft({}); };
  const saveAdd = () => {
    if (!draft.makeModel?.trim()) return;
    createEquipment(user, activeSiteId, draft, packKey);
    cancelAdd();
    onChange();
  };
  const removeRow = (id) => { removeEquipment(user, id); onChange(); };

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Equipment Register</h3>
      <p className={styles.wizStepLead}>
        Record actual equipment per site. Only the categories enabled in each site's profile are
        shown — go back to <strong>Site profiles</strong> to enable more.
      </p>
      <div className={styles.siteSplit}>
        <aside className={styles.siteSplitRail}>
          <div className={styles.siteSplitRailLabel}>Applied sites</div>
          <SiteRail
            appliedProfiles={appliedProfiles}
            sites={sites}
            activeSiteId={activeSiteId}
            onSelect={(id) => { setActiveSiteId(id); cancelAdd(); }}
            completion={() => null}
          />
        </aside>
        <div className={styles.siteSplitPane}>
          {activeProfile && (
            <>
              <h4 className={styles.cardTitle} style={{ marginBottom: 4 }}>{activeSite?.name}</h4>
              <p className={styles.cardLead}>{records.length} equipment record{records.length === 1 ? "" : "s"} on file</p>

              {enabledTypes.length === 0 && (
                <div className={styles.wizHintBox} style={{ marginTop: 14 }}>
                  <I name="info" size={13} color="var(--primary)" />
                  <span>No equipment categories enabled. Go back to <strong>Site profiles</strong> for this site to enable equipment.</span>
                </div>
              )}

              {enabledTypes.map((type) => {
                const rows = recordsByType[type] ?? [];
                const label = EQUIPMENT_TYPE_LABEL[type] ?? type;
                const isAdding = addingType === type;
                return (
                  <div key={type} className={styles.siteSplitSection}>
                    <div className={styles.siteSplitSectionHead}>
                      <div className={styles.siteSplitSectionTitle}>{label}</div>
                      {!isAdding && (
                        <button type="button" className={styles.linkBtn} onClick={() => startAdd(type)}>
                          + Add {label.toLowerCase()}
                        </button>
                      )}
                    </div>
                    {rows.length === 0 && !isAdding && (
                      <div className={styles.equipmentEmpty}>No {label.toLowerCase()} recorded yet.</div>
                    )}
                    {rows.map((r) => (
                      <div key={r.id} className={styles.equipmentRow}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.makeModel}</div>
                          <div style={{ fontSize: 11, color: "var(--on-surface-variant)" }}>
                            {[r.serialNumber && `SN ${r.serialNumber}`, r.roomLocation].filter(Boolean).join(" · ") || "—"}
                          </div>
                        </div>
                        <div className={styles.equipmentService}>
                          {r.nextServiceDate ? `Next service ${formatDate(r.nextServiceDate)}` : "Service date not set"}
                        </div>
                        <button type="button" className={styles.linkBtn} onClick={() => removeRow(r.id)}>Remove</button>
                      </div>
                    ))}
                    {isAdding && (
                      <div className={styles.equipmentAddCard}>
                        <div className={styles.wizFormGrid}>
                          <Field label="Make / model">
                            <input className={styles.wizInput} value={draft.makeModel ?? ""}
                              onChange={(e) => setDraft({ ...draft, makeModel: e.target.value })}
                              placeholder="e.g. Melag Vacuklav 40B+" autoFocus />
                          </Field>
                          <Field label="Serial number" hint="optional">
                            <input className={styles.wizInput} value={draft.serialNumber ?? ""}
                              onChange={(e) => setDraft({ ...draft, serialNumber: e.target.value })}
                              placeholder="e.g. LON-AUT-001" />
                          </Field>
                          <Field label="Room / location" hint="optional">
                            <input className={styles.wizInput} value={draft.roomLocation ?? ""}
                              onChange={(e) => setDraft({ ...draft, roomLocation: e.target.value })}
                              placeholder="e.g. Decon Room" />
                          </Field>
                          <Field label="Next service" hint="optional">
                            <input className={styles.wizInput} type="date" value={draft.nextServiceDate ?? ""}
                              onChange={(e) => setDraft({ ...draft, nextServiceDate: e.target.value })} />
                          </Field>
                        </div>
                        <div className={styles.wizActions}>
                          <BtnPrimary onClick={saveAdd} disabled={!draft.makeModel?.trim()}>
                            <I name="check" size={12} color="var(--on-primary)" /> Save
                          </BtnPrimary>
                          <BtnSecondary onClick={cancelAdd}>Cancel</BtnSecondary>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Step 6 · Documents & SOPs to Review ───────────────────────────────── */
const DOC_TYPE_LABEL = {
  policy: "Policy", sop: "SOP", log_template: "Log template",
  audit_tool: "Audit tool", evidence_template: "Evidence template", appendix: "Appendix",
};
const DOC_STATUS_META = {
  draft:     { label: "Draft",      color: "#1565c0" },
  in_review: { label: "In review",  color: "#6a1b9a" },
  approved:  { label: "Approved",   color: "#15803d" },
  published: { label: "Published",  color: "#15803d" },
  rejected:  { label: "Rejected",   color: "#c62828" },
  template:  { label: "Template",   color: "#757575" },
  review_due:{ label: "Review due", color: "#f57c00" },
  expired:   { label: "Expired",    color: "#c62828" },
  archived:  { label: "Archived",   color: "#757575" },
};

/* Derive a human-readable doc code per pack from type + per-pack index.
 * Format: TYPE-PACK-NN (e.g. SOP-DEC-01, POL-RAD-03). Computed in-place
 * per render so it stays stable as long as the doc list ordering does. */
const DOC_TYPE_CODE = {
  sop: "SOP", policy: "POL", log_template: "LOG", audit_tool: "AUD",
  appendix: "APP", evidence_template: "EVI",
};
const PACK_CODE = {
  decontamination_ipc: "DEC", radiography_irmer: "RAD", medical_emergencies: "EMR",
  safeguarding_governance: "SAF", complaints_incidents: "CMP",
  practice_operations: "OPS", audit_evidence: "AUD", site_specific_sops: "SIT",
};
function docCode(doc, allDocs) {
  const typeCode = DOC_TYPE_CODE[doc.type] ?? "DOC";
  const packCode = PACK_CODE[doc.packKey] ?? "GEN";
  const sameType = allDocs.filter((x) => x.type === doc.type);
  const idx = sameType.findIndex((x) => x.id === doc.id) + 1;
  return `${typeCode}-${packCode}-${String(idx).padStart(2, "0")}`;
}

/* Renders a role cell from a resolveRoleUser() result. Explicit assignments
 * render plainly; inherited values render in italics with a small
 * "(Group default)" / "(Org default)" suffix so the user sees at a glance
 * which assignments are inherited vs explicitly set per-doc. */
function RoleCell({ r }) {
  if (!r?.user) return <span style={{ color: "var(--on-surface-variant)" }}>—</span>;
  if (r.source === "explicit") {
    return <span style={{ color: "var(--on-surface-variant)" }}>{r.user.displayName}</span>;
  }
  const hint = r.source === "pack" ? "Group default" : "Org default";
  return (
    <span style={{ color: "var(--on-surface-variant)", fontStyle: "italic", opacity: 0.88 }}>
      {r.user.displayName}{" "}
      <span style={{ fontSize: 10, opacity: 0.7, fontStyle: "normal" }}>({hint})</span>
    </span>
  );
}

const DocumentsToReviewStep = ({ user, allUsers, packKey, packInstance, appliedProfiles, onChange }) => {
  const tenantId = user.tenantId;
  const flagsUnion = useMemo(() => {
    const u = {};
    for (const p of appliedProfiles) {
      for (const k of Object.keys(p)) if (p[k] === true) u[k] = true;
    }
    return u;
  }, [appliedProfiles]);

  const [openDocId, setOpenDocId] = useState(null);
  const [skipModal, setSkipModal] = useState(null); // { master } | null
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  // Three-layer fallback resolver for role columns (Owner / Reviewer /
  // Approver): explicit doc version field → pack-level default (Step 6) →
  // org-level default (Admin Centre → Organisation Settings). Returns
  // {user, source} so cells can render an inherited-from-Group/Org hint.
  const orgSettings = useMemo(() => getOrgSettingsWithDefaults(tenantId), [tenantId, tick]);
  const findUser = (id) => allUsers.find((u) => u.id === id);
  const resolveRoleUser = (versionUserId, packKeyField, orgKeyField) => {
    const explicit = findUser(versionUserId);
    if (explicit) return { user: explicit, source: "explicit" };
    const packDefault = findUser(packInstance?.[packKeyField]);
    if (packDefault) return { user: packDefault, source: "pack" };
    const orgDefault = findUser(orgSettings?.[orgKeyField]);
    if (orgDefault) return { user: orgDefault, source: "org" };
    return { user: null, source: "none" };
  };

  // Auto-activate on entering this step — idempotent (matches by sourceMasterTemplateId or title).
  useEffect(() => {
    if (!packInstance?.id) return;
    activateFromMasterLibrary(user, packInstance.id, packKey, flagsUnion);
    refresh();
    onChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packInstance?.id, packKey, JSON.stringify(flagsUnion)]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Documents & SOPs to Review"
        lead="Go back to Sites in scope first — documents activate based on which sites are applied + each site's profile."
      />
    );
  }

  // eslint-disable-next-line no-unused-vars
  const _tick = tick; // force re-read on tick
  const allDocs = Store.list(tenantId, TABLES.documents).filter((d) => d.packKey === packKey);
  const overrides = packInstance?.sopSelectionOverrides ?? {};

  /* Pattern C — group every master template into its tier section. For each
   * master we resolve flag-gating, current draft / live status, and the
   * user's override decision. The UI renders three collapsible tier sections
   * (Statutory locked-on / Recommended skippable / Optional opt-in-only). */
  const masters = listMasterTemplates(packKey).filter((m) => m.status === "active");
  const docsByMasterId = new Map();
  for (const d of allDocs) {
    if (d.sourceMasterTemplateId) docsByMasterId.set(d.sourceMasterTemplateId, d);
  }
  const rows = masters.map((m) => {
    const tier      = tierFor(m);
    const flagGated = m.requiredFlag && !flagsUnion[m.requiredFlag];
    const override  = overrides[m.id] ?? null;
    const doc       = docsByMasterId.get(m.id) ?? null;
    const isLive    = doc && doc.status !== DocumentStatus.archived;
    return { master: m, tier, flagGated, override, doc, isLive };
  });
  const tierGroups = {
    [SopTier.statutory]:   rows.filter((r) => r.tier === SopTier.statutory),
    [SopTier.recommended]: rows.filter((r) => r.tier === SopTier.recommended),
    [SopTier.optional]:    rows.filter((r) => r.tier === SopTier.optional),
  };
  const publishedCount = allDocs.filter((d) => d.status === DocumentStatus.approved || d.status === DocumentStatus.published).length;
  const counts = {
    statutory:        tierGroups[SopTier.statutory].length,
    recommendedLive:  tierGroups[SopTier.recommended].filter((r) => r.isLive).length,
    recommendedSkip:  tierGroups[SopTier.recommended].filter((r) => r.override === "skip").length,
    optionalLive:     tierGroups[SopTier.optional].filter((r) => r.isLive).length,
    optionalTotal:    tierGroups[SopTier.optional].length,
    flagGated:        rows.filter((r) => r.flagGated).length,
  };

  const handleSkip = (master, payload) => {
    setSopSelection(user, packInstance.id, master.id, "skip", payload);
    refresh();
    onChange?.();
  };
  const handleOptIn = (master) => {
    setSopSelection(user, packInstance.id, master.id, "opt-in");
    // Re-run activation so the newly opted-in master materialises as a draft.
    activateFromMasterLibrary(user, packInstance.id, packKey, flagsUnion);
    refresh();
    onChange?.();
  };
  const handleReset = (master) => {
    setSopSelection(user, packInstance.id, master.id, "reset");
    refresh();
    onChange?.();
  };
  const handleConfirmSkip = (master) => {
    confirmSopSkipAfterReEvaluation(user, packInstance.id, master.id);
    refresh();
    onChange?.();
  };

  /* Re-evaluation candidates — SOPs the user previously skipped that are
   * now applicable because a gating flag flipped on at Step 4. Surfaces as
   * an amber banner above the tier sections with [Activate] / [Keep skipped]
   * inline actions. Pass skipReasons so rows already confirmed under the
   * new flag context are filtered out (no re-nagging on every render). */
  const skipReasons = packInstance?.sopSkipReasons ?? {};
  const reEvaluationRows = findReEvaluationCandidates(rows, skipReasons);

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Documents &amp; SOPs to Review</h3>
      <p className={styles.wizStepLead}>
        SOPs are grouped by tier. <strong>Statutory</strong> activate automatically and can't be skipped.
        <strong> Recommended</strong> activate by default — skip with a reason if you use a bespoke version.
        <strong> Optional</strong> SOPs stay inactive until you opt in.
      </p>

      <div className={styles.docCountStrip}>
        <span className={styles.docCount}><strong>{counts.statutory}</strong> statutory</span>
        <span className={styles.docCount}><strong>{counts.recommendedLive}</strong> recommended active</span>
        {counts.recommendedSkip > 0 && (
          <span className={styles.docCount}><strong>{counts.recommendedSkip}</strong> recommended skipped</span>
        )}
        <span className={styles.docCount}><strong>{counts.optionalLive}/{counts.optionalTotal}</strong> optional opted-in</span>
        {publishedCount > 0 && (
          <span className={styles.docCount}><strong>{publishedCount}</strong> already approved / published</span>
        )}
        {counts.flagGated > 0 && (
          <span className={styles.docCount}><strong>{counts.flagGated}</strong> not applicable</span>
        )}
      </div>

      {reEvaluationRows.length > 0 && (
        <ReEvaluationBanner
          rows={reEvaluationRows}
          skipReasons={skipReasons}
          onActivate={handleReset}
          onConfirmSkip={handleConfirmSkip}
        />
      )}

      {[SopTier.statutory, SopTier.recommended, SopTier.optional].map((tierKey) => (
        <TierSection
          key={tierKey}
          tierKey={tierKey}
          rows={tierGroups[tierKey]}
          tenantId={tenantId}
          packKey={packKey}
          resolveRoleUser={resolveRoleUser}
          onOpenDoc={setOpenDocId}
          onSkip={(m) => setSkipModal({ master: m })}
          onOptIn={handleOptIn}
          onReset={handleReset}
        />
      ))}

      {skipModal && (
        <SopSkipReasonModal
          master={skipModal.master}
          onCancel={() => setSkipModal(null)}
          onConfirm={(payload) => { handleSkip(skipModal.master, payload); setSkipModal(null); }}
        />
      )}

      {openDocId && (
        <DocumentEditorModal
          docId={openDocId}
          user={user}
          allUsers={allUsers}
          onClose={() => setOpenDocId(null)}
          onChange={() => { refresh(); onChange?.(); }}
        />
      )}
    </div>
  );
};

/* ─── Pattern C — ReEvaluationBanner ───────────────────────────────────
 * Surfaces SOPs the user previously skipped that have become applicable
 * again because a gating flag flipped on at Step 4. The user can either
 * activate (clears the skip + creates a fresh draft) or confirm-skip
 * (refreshes the audit-trail with a "re-decided under new context" entry
 * so CQC inspectors can see the decision wasn't stale). */
const SOP_SKIP_REASON_LABELS = {
  bespoke_in_use: "Using bespoke version",
  not_applicable: "Not applicable",
  deferred:       "Deferred",
  other:          "Other",
};

const ReEvaluationBanner = ({ rows, skipReasons, onActivate, onConfirmSkip }) => {
  return (
    <Card hover={false} className={styles.reEvalBanner}>
      <div className={styles.reEvalBannerHead}>
        <I name="alert" size={14} color="#b76e00" />
        <div>
          <strong>{rows.length}</strong> previously-skipped SOP{rows.length === 1 ? " is" : "s are"} now applicable
          <div className={styles.reEvalBannerSub}>
            A gating flag was enabled after these SOPs were skipped — re-decide before the pack goes live.
          </div>
        </div>
      </div>
      <div className={styles.reEvalList}>
        {rows.map(({ master }) => {
          const skipMeta = skipReasons[master.id] ?? null;
          const reasonLabel = skipMeta ? (SOP_SKIP_REASON_LABELS[skipMeta.reason] ?? skipMeta.reason) : "—";
          const skippedDate = skipMeta?.at ? formatDate(skipMeta.at) : "—";
          return (
            <div key={master.id} className={styles.reEvalRow}>
              <div className={styles.reEvalRowMain}>
                <div className={styles.reEvalRowTitle}>{master.title}</div>
                <div className={styles.reEvalRowMeta}>
                  Skipped {skippedDate} · {reasonLabel}
                  {skipMeta?.notes && <> · <em>{skipMeta.notes}</em></>}
                  {" · flag "}<code>{master.requiredFlag}</code>{" is now on"}
                </div>
              </div>
              <div className={styles.reEvalRowActions}>
                <button className={styles.linkBtn} onClick={() => onActivate(master)}>+ Activate</button>
                <button className={styles.linkBtnSubtle} onClick={() => onConfirmSkip(master)}>Keep skipped</button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* ─── Pattern C — TierSection ───────────────────────────────────────────
 * One collapsible section per tier (Statutory / Recommended / Optional).
 * Statutory rows are locked-on (lock icon, no skip button). Recommended
 * rows expose a Skip button → opens SopSkipReasonModal. Optional rows
 * expose Activate / Skip toggles. Flag-gated rows render dimmed with a
 * "needs <flag>" hint and are not actionable until the user goes back to
 * Step 4. */
const TierSection = ({ tierKey, rows, tenantId, packKey, resolveRoleUser, onOpenDoc, onSkip, onOptIn, onReset }) => {
  const meta = SOP_TIER_META[tierKey];
  // Default-open for Statutory + Recommended; collapsed for Optional so the
  // primary scroll isn't dominated by add-ons no one usually wants.
  const defaultOpen = tierKey !== SopTier.optional;
  if (rows.length === 0) return null;

  const liveRows     = rows.filter((r) => r.isLive);
  const skippedRows  = rows.filter((r) => !r.isLive && r.override === "skip");
  const availableRows = rows.filter((r) => !r.isLive && r.override !== "skip");

  return (
    <details open={defaultOpen} className={styles.tierSection}>
      <summary className={styles.tierSectionHead}>
        <span className={styles.tierBadge} style={{ background: `color-mix(in srgb, ${meta.color} 14%, transparent)`, color: meta.color }}>
          <I name={meta.icon} size={11} color={meta.color} />
          {meta.label}
        </span>
        <span className={styles.tierTitle}>{meta.plural}</span>
        <span className={styles.tierCount}>
          {liveRows.length}/{rows.length} active
          {skippedRows.length > 0 && <> · {skippedRows.length} skipped</>}
        </span>
      </summary>

      <p className={styles.tierHelp}>{meta.helpText}</p>

      <Card hover={false} style={{ overflow: "hidden", marginTop: 6 }}>
        {rows.length === 0 && (
          <div className={styles.docEmpty}>No master templates in this tier for this pack.</div>
        )}
        {rows.map((r) => (
          <TierRow
            key={r.master.id}
            row={r}
            tierKey={tierKey}
            tenantId={tenantId}
            packKey={packKey}
            resolveRoleUser={resolveRoleUser}
            onOpenDoc={onOpenDoc}
            onSkip={onSkip}
            onOptIn={onOptIn}
            onReset={onReset}
          />
        ))}
      </Card>
    </details>
  );
};

const TierRow = ({ row, tierKey, tenantId, packKey, resolveRoleUser, onOpenDoc, onSkip, onOptIn, onReset }) => {
  const { master, flagGated, override, doc, isLive } = row;
  const meta = SOP_TIER_META[tierKey];
  const isStatutory = tierKey === SopTier.statutory;
  const isOptional  = tierKey === SopTier.optional;

  // Dim flag-gated + skipped + optional-not-opted-in rows.
  const dimmed = flagGated || (!isLive && override === "skip") || (!isLive && isOptional);

  let statusPill;
  if (flagGated) {
    statusPill = <Pill bg="var(--surface-low)" color="var(--on-surface-variant)" small>Needs <code>{master.requiredFlag}</code></Pill>;
  } else if (!isLive && override === "skip") {
    statusPill = <Pill bg="rgba(198, 40, 40, 0.10)" color="#c62828" small>Skipped</Pill>;
  } else if (!isLive && isOptional) {
    statusPill = <Pill bg="var(--surface-low)" color="var(--on-surface-variant)" small>Available</Pill>;
  } else if (doc) {
    const sc = DOC_STATUS_META[doc.status] ?? DOC_STATUS_META.draft;
    statusPill = <Pill bg={`color-mix(in srgb, ${sc.color} 14%, transparent)`} color={sc.color} small>{sc.label}</Pill>;
  }

  const version = doc ? getCurrentVersion(tenantId, doc.id) : null;
  const primaryRoleId = getPackConfig(packKey)?.roles?.[0]?.id ?? "groupIpcLeadUserId";
  const ownerR    = doc ? resolveRoleUser(version?.ownerUserId,    primaryRoleId,           "governanceLeadUserId") : null;
  const reviewerR = doc ? resolveRoleUser(version?.reviewerUserId, "defaultReviewerUserId", "defaultReviewerUserId") : null;

  return (
    <div
      className={styles.tierRow}
      style={{ opacity: dimmed ? 0.55 : 1, cursor: doc ? "pointer" : "default" }}
      onClick={() => doc && onOpenDoc(doc.id)}
    >
      <span className={styles.docTitleCell}>
        {isStatutory && <I name="lock" size={11} color={meta.color} />}
        {!isStatutory && <I name="file" size={13} color="var(--outline)" />}
        <span>{master.title}</span>
      </span>
      <span>{statusPill}</span>
      <span className={styles.dim}>{ownerR?.user?.displayName ?? "—"}</span>
      <span className={styles.dim}>{reviewerR?.user?.displayName ?? "—"}</span>
      <span style={{ textAlign: "right", display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={(e) => e.stopPropagation()}>
        {/* Tier-specific actions */}
        {isStatutory && (
          <span className={styles.tierLockedHint}><I name="lock" size={10} /> Always on</span>
        )}
        {!isStatutory && !flagGated && isLive && (
          <button className={styles.linkBtnDanger} onClick={() => onSkip(master)}>Skip…</button>
        )}
        {!isStatutory && !flagGated && !isLive && override === "skip" && (
          <button className={styles.linkBtn} onClick={() => onReset(master)}>Restore</button>
        )}
        {isOptional && !flagGated && !isLive && override !== "skip" && (
          <button className={styles.linkBtn} onClick={() => onOptIn(master)}>+ Activate</button>
        )}
      </span>
    </div>
  );
};

/* Skip-reason modal — captures *why* a Recommended SOP was opted out so the
 * pack instance has a defensible audit trail. CQC inspectors regularly ask
 * "why don't you have SOP X?" — "we just didn't pick it" is not an answer. */
const SOP_SKIP_REASONS = [
  { value: "bespoke_in_use",  label: "Using our own bespoke version" },
  { value: "not_applicable",  label: "Not applicable to this practice" },
  { value: "deferred",        label: "Deferred — will activate later" },
  { value: "other",           label: "Other (see notes)" },
];

const SopSkipReasonModal = ({ master, onCancel, onConfirm }) => {
  const [reason, setReason] = useState("bespoke_in_use");
  const [notes,  setNotes]  = useState("");
  const needsNotes = reason === "other";
  const canConfirm = !!reason && (!needsNotes || notes.trim().length > 0);

  return (
    <div className={styles.docModalScrim} onClick={onCancel}>
      <div className={styles.docModalCard} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <header style={{ padding: "18px 22px 12px", borderBottom: "1px solid var(--outline-variant)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#c62828", marginBottom: 4 }}>
            Skip recommended SOP
          </div>
          <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>{master.title}</h3>
        </header>
        <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--on-surface-variant)", lineHeight: 1.5 }}>
            Skipping this SOP means it won't activate when the pack goes Live. The reason is logged in
            the audit trail and visible to inspectors.
          </p>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>
              Reason<span style={{ color: "#c62828", marginLeft: 3 }}>*</span>
            </span>
            <select className="ui-control" value={reason} onChange={(e) => setReason(e.target.value)}>
              {SOP_SKIP_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--on-surface-variant)" }}>
              Notes{needsNotes && <span style={{ color: "#c62828", marginLeft: 3 }}>*</span>}
            </span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              placeholder={needsNotes ? "Required when reason is Other — explain briefly." : "Optional — e.g. reference to internal SOP document."}
              style={{ padding: "9px 11px", fontSize: 13, border: "1px solid var(--outline-variant)", borderRadius: 8, background: "var(--surface)", color: "var(--on-surface)", resize: "vertical", fontFamily: "inherit" }} />
          </label>
        </div>
        <footer style={{ display: "flex", gap: 10, padding: "14px 22px", borderTop: "1px solid var(--outline-variant)", justifyContent: "flex-end" }}>
          <BtnSecondary onClick={onCancel}>Cancel</BtnSecondary>
          <BtnPrimary onClick={() => onConfirm({ reason, notes: notes.trim() || null })} disabled={!canConfirm}
            style={{ opacity: canConfirm ? 1 : 0.5 }}>
            Skip with reason
          </BtnPrimary>
        </footer>
      </div>
    </div>
  );
};

/* Per-document editor modal: localise body + assign owner/reviewer/approver +
 * submit for review. Published docs render read-only here (full lifecycle is
 * managed in the document register). */
const DocumentEditorModal = ({ docId, user, allUsers, onClose, onChange }) => {
  const tenantId = user.tenantId;
  const doc = Store.get(tenantId, TABLES.documents, docId);
  const version = doc ? Store.get(tenantId, TABLES.document_versions, doc.currentVersionId) : null;

  const [body, setBody] = useState(version?.body ?? "");
  const [owner, setOwner] = useState(version?.ownerUserId ?? "");
  const [reviewer, setReviewer] = useState(version?.reviewerUserId ?? "");
  const [approver, setApprover] = useState(version?.approverUserId ?? "");

  if (!doc || !version) {
    return (
      <div className={styles.docModalScrim} onClick={onClose}>
        <div className={styles.docModalCard} onClick={(e) => e.stopPropagation()}>
          <p style={{ padding: 24 }}>Document not found.</p>
          <BtnSecondary onClick={onClose}>Close</BtnSecondary>
        </div>
      </div>
    );
  }

  // Editable while the document is still being authored or actioned by the
  // reviewer (draft / in_review / rejected). Only locks once the version is
  // approved or published — those are immutable per audit/version-control
  // rules; an edit there must create a new draft version via Publish.
  const isEditable =
    doc.status === DocumentStatus.draft ||
    doc.status === DocumentStatus.in_review ||
    doc.status === DocumentStatus.rejected;
  const sc = DOC_STATUS_META[doc.status] ?? DOC_STATUS_META.draft;

  const usersOption = (u) => `${u.displayName ?? u.username} (${u.role})`;
  const ownersOptions = allUsers.filter((u) => ["decontamination_lead", "ipc_lead", "governance_lead", "irmer_lead", "practice_manager", "group_admin"]
    .some((r) => u.role === r || u.secondaryRoles?.includes(r)));
  const reviewersOptions = allUsers.filter((u) => ["governance_lead", "clinical_director", "ipc_lead", "decontamination_lead", "irmer_lead"]
    .some((r) => u.role === r || u.secondaryRoles?.includes(r)));
  const approversOptions = allUsers.filter((u) => ["clinical_director", "governance_lead"]
    .some((r) => u.role === r || u.secondaryRoles?.includes(r)));

  const saveChanges = () => {
    if (body !== version.body) {
      saveDraftBody(user, docId, body, "Localised from master template");
    }
    Store.update(tenantId, TABLES.document_versions, version.id, {
      ownerUserId: owner || null,
      reviewerUserId: reviewer || null,
      approverUserId: approver || null,
    });
    onChange();
  };
  const submit = () => {
    saveChanges();
    submitForReview(user, docId, "Submitted from setup wizard");
    onChange();
    onClose();
  };

  return (
    <div className={styles.docModalScrim} onClick={onClose}>
      <div className={styles.docModalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.docModalHead}>
          <div>
            <h3 className={styles.docModalTitle}>{doc.title}</h3>
            <p className={styles.docModalSub}>
              {DOC_TYPE_LABEL[doc.type] ?? doc.type} · v{version.versionNumber} ·{" "}
              <Pill bg={`color-mix(in srgb, ${sc.color} 14%, transparent)`} color={sc.color} small>{sc.label}</Pill>
            </p>
          </div>
          <button onClick={onClose} className={styles.docModalClose}>
            <I name="xcircle" size={18} color="var(--outline)" />
          </button>
        </div>

        <div className={styles.docModalBody}>
          <div className={styles.docModalGrid}>
            <Field label="Owner" hint="Day-to-day owner of this document">
              <select className={styles.wizSelect} value={owner ?? ""}
                onChange={(e) => setOwner(e.target.value)} disabled={!isEditable}>
                <option value="">— select user —</option>
                {ownersOptions.map((u) => <option key={u.id} value={u.id}>{usersOption(u)}</option>)}
              </select>
            </Field>
            <Field label="Reviewer" hint="Reviews the draft before approval">
              <select className={styles.wizSelect} value={reviewer ?? ""}
                onChange={(e) => setReviewer(e.target.value)} disabled={!isEditable}>
                <option value="">— select user —</option>
                {reviewersOptions.map((u) => <option key={u.id} value={u.id}>{usersOption(u)}</option>)}
              </select>
            </Field>
            <Field label="Approver" hint="Final sign-off (typically Clinical Director)">
              <select className={styles.wizSelect} value={approver ?? ""}
                onChange={(e) => setApprover(e.target.value)} disabled={!isEditable}>
                <option value="">— select user —</option>
                {approversOptions.map((u) => <option key={u.id} value={u.id}>{usersOption(u)}</option>)}
              </select>
            </Field>
          </div>

          <div className={styles.docModalSplit}>
            <div className={styles.docModalEditCol}>
              <div className={styles.docModalEditLabel}>
                {isEditable
                  ? `Localise body (markdown)${doc.status === DocumentStatus.in_review ? " — open for reviewer edits" : ""}`
                  : "Body (read-only — approved / published)"}
              </div>
              <textarea className={styles.docModalEdit} value={body}
                onChange={(e) => setBody(e.target.value)} disabled={!isEditable}
                rows={22} />
            </div>
            <div className={styles.docModalPreviewCol}>
              <div className={styles.docModalEditLabel}>Polished preview</div>
              <SopPreview body={body} template={{
                title: doc.title, version: version.versionNumber,
                status: doc.status, id: doc.id, packKey: doc.packKey,
              }} />
            </div>
          </div>
        </div>

        <div className={styles.docModalFooter}>
          <BtnSecondary onClick={onClose}>Close</BtnSecondary>
          {isEditable && (
            <>
              <BtnSecondary onClick={saveChanges}>
                <I name="check" size={12} /> Save changes
              </BtnSecondary>
              <BtnPrimary onClick={submit} disabled={!owner || !reviewer || !approver}>
                <I name="send" size={12} color="var(--on-primary)" /> Submit for review
              </BtnPrimary>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Step 7 · Site-Specific Appendices ─────────────────────────────────── */
const SiteAppendicesStep = ({ user, allUsers, sites, packKey, packInstance, appliedProfiles, onChange }) => {
  const tenantId = user.tenantId;
  const [activeSiteId, setActiveSiteId] = useState(appliedProfiles[0]?.siteId ?? null);
  const [openDocId, setOpenDocId] = useState(null);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    if (!appliedProfiles.some((p) => p.siteId === activeSiteId)) {
      setActiveSiteId(appliedProfiles[0]?.siteId ?? null);
    }
  }, [appliedProfiles, activeSiteId]);

  // Auto-create skeleton appendices for every (parent SOP, applied site) pair
  // where the site has the parent's flag enabled. Idempotent.
  useEffect(() => {
    if (!packInstance?.id || appliedProfiles.length === 0) return;
    const sitesById = Object.fromEntries(sites.map((s) => [s.id, s]));
    const equipmentBySiteProfileId = {};
    for (const e of Store.list(tenantId, TABLES.equipment)) {
      (equipmentBySiteProfileId[e.siteProfileId] ??= []).push(e);
    }
    ensureSiteAppendicesForPack(user, packKey, packInstance, appliedProfiles, sitesById, equipmentBySiteProfileId);
    refresh();
    onChange?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packInstance?.id, packKey, appliedProfiles.length]);

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Site-Specific Appendices"
        lead="Go back to Sites in scope first — appendices are created per applied site."
      />
    );
  }

  // eslint-disable-next-line no-unused-vars
  const _tick = tick;
  const activeProfile = appliedProfiles.find((p) => p.siteId === activeSiteId);
  const activeSite = sites.find((s) => s.id === activeSiteId);

  // Build the list for the active site:
  //   - All flag-bound group SOPs for this pack that the site has enabled →
  //     either an existing appendix or a stub row pointing at the parent.
  const allDocs = Store.list(tenantId, TABLES.documents).filter((d) => d.packKey === packKey);
  const groupSops = allDocs.filter(
    (d) => d.scope === "group" && d.requiredFlag
      && ![DocumentStatus.archived, DocumentStatus.template].includes(d.status),
  );
  const appendicesBySiteParent = new Map();
  for (const d of allDocs.filter((d) => d.type === "appendix" && d.appliesToSiteId && d.parentDocumentId)) {
    appendicesBySiteParent.set(`${d.parentDocumentId}::${d.appliesToSiteId}`, d);
  }
  const eligibleRows = activeProfile
    ? groupSops
        .filter((parent) => activeProfile[parent.requiredFlag])
        .map((parent) => ({
          parent,
          appendix: appendicesBySiteParent.get(`${parent.id}::${activeSite.id}`) ?? null,
        }))
    : [];

  /* Radiography only — per-asset modality slots driven by Step 4 flags ×
   * Step 5 equipment register. Each registered intraoral / OPG / CBCT /
   * handheld unit becomes its own appendix row with a specialised title.
   * Decon + other packs stay on the flag-bound parent-SOP model above. */
  const isRadiography = packKey === "radiography_irmer";
  const equipmentByProfileId = useMemo(() => {
    if (!isRadiography) return {};
    const map = {};
    for (const e of Store.list(tenantId, TABLES.equipment)) {
      (map[e.siteProfileId] ??= []).push(e);
    }
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId, isRadiography, _tick]);
  const radiographyAssetSlots = isRadiography && activeProfile
    ? generateStep8Slots(activeProfile, equipmentByProfileId[activeProfile.id] ?? [])
    : [];
  const totalSlots = eligibleRows.length + radiographyAssetSlots.length;

  // Site rail with appendix count per site. For radiography, factor the
  // per-asset slot count into completeness so the rail badge reflects the
  // *full* workload (parent appendices + per-asset modality appendices).
  const completionFor = (profile) => {
    const flagSopTotal = groupSops.filter((p) => profile[p.requiredFlag]).length;
    const flagSopDone = groupSops.filter((p) => profile[p.requiredFlag] && appendicesBySiteParent.has(`${p.id}::${profile.siteId}`)).length;
    const assetSlotTotal = isRadiography
      ? countStep8Slots(profile, equipmentByProfileId[profile.id] ?? [])
      : 0;
    const total = flagSopTotal + assetSlotTotal;
    if (total === 0) return null;
    // Per-asset slots are skeletons we generate on the fly — count them as
    // "in progress" not "done" until a corresponding appendix doc exists.
    const done = flagSopDone;
    return Math.round((done / total) * 100);
  };

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Site-Specific Appendices</h3>
      <p className={styles.wizStepLead}>
        For each equipment-bound SOP, every applied site gets a local appendix — make / model,
        serial, room, contacts and local procedure variations. Skeleton appendices are auto-created
        from your equipment register; review and complete the local detail before submitting.
      </p>
      <div className={styles.siteSplit}>
        <aside className={styles.siteSplitRail}>
          <div className={styles.siteSplitRailLabel}>Applied sites</div>
          <SiteRail
            appliedProfiles={appliedProfiles}
            sites={sites}
            activeSiteId={activeSiteId}
            onSelect={setActiveSiteId}
            completion={completionFor}
          />
        </aside>
        <div className={styles.siteSplitPane}>
          {activeProfile && activeSite && (
            <>
              <h4 className={styles.cardTitle} style={{ marginBottom: 4 }}>{activeSite.name}</h4>
              <p className={styles.cardLead}>
                {totalSlots} appendix slot{totalSlots === 1 ? "" : "s"} based on this site's profile
                {isRadiography && radiographyAssetSlots.length > 0 && (
                  <> · {radiographyAssetSlots.length} per-asset modality log{radiographyAssetSlots.length === 1 ? "" : "s"}</>
                )}
              </p>

              {totalSlots === 0 && (
                <div className={styles.wizHintBox} style={{ marginTop: 14 }}>
                  <I name="info" size={13} color="var(--primary)" />
                  <span>
                    {isRadiography
                      ? <>This site has no radiation-bound equipment enabled — no appendices needed. Toggle an imaging modality on in <strong>Site profiles</strong> and register the unit in the <strong>Equipment register</strong>.</>
                      : <>This site has no flag-bound equipment / processes enabled — no appendices needed. Enable equipment in <strong>Site profiles</strong> to add some.</>}
                  </span>
                </div>
              )}

              {isRadiography && radiographyAssetSlots.length > 0 && (
                <Card hover={false} style={{ overflow: "hidden", marginBottom: 14 }}>
                  <div className={styles.appendixTableHead}>
                    <span>Per-asset modality appendix</span>
                    <span>Source asset</span>
                    <span>Status</span>
                    <span></span>
                  </div>
                  {radiographyAssetSlots.map((slot) => (
                    <div key={slot.key} className={styles.appendixTableRow} style={{ cursor: "default" }}>
                      <span className={styles.docTitleCell}>
                        <I name={slot.highRisk ? "alert" : "file"} size={13} color={slot.highRisk ? "#c62828" : "var(--outline)"} />
                        <span>{activeSite.name} — {slot.titleSuffix}</span>
                      </span>
                      <span className={styles.dim}>
                        {slot.asset.makeModel ?? "—"}{slot.asset.serialNumber ? ` · S/N ${slot.asset.serialNumber}` : ""}
                      </span>
                      <span>
                        <Pill bg="var(--surface-low)" color="var(--on-surface-variant)" small>
                          {slot.highRisk ? "High-risk · pending" : "Pending"}
                        </Pill>
                      </span>
                      <span style={{ textAlign: "right" }}>
                        <span className={styles.dim}>Auto-generated on approval</span>
                      </span>
                    </div>
                  ))}
                </Card>
              )}

              {eligibleRows.length > 0 && (
                <Card hover={false} style={{ overflow: "hidden" }}>
                  <div className={styles.appendixTableHead}>
                    <span>Parent SOP</span>
                    <span>Appendix</span>
                    <span>Status</span>
                    <span></span>
                  </div>
                  {eligibleRows.map(({ parent, appendix }) => {
                    const version = appendix ? getCurrentVersion(tenantId, appendix.id) : null;
                    const sc = appendix ? (DOC_STATUS_META[appendix.status] ?? DOC_STATUS_META.draft) : null;
                    return (
                      <div key={parent.id} className={styles.appendixTableRow}
                        onClick={() => appendix && setOpenDocId(appendix.id)}
                        style={{ cursor: appendix ? "pointer" : "default" }}>
                        <span className={styles.docTitleCell}>
                          <I name="file" size={13} color="var(--outline)" />
                          <span>{parent.title}</span>
                        </span>
                        <span className={styles.dim}>
                          {appendix ? `${activeSite.name} Appendix · v${version?.versionNumber ?? "—"}` : "— not yet created —"}
                        </span>
                        <span>
                          {appendix ? (
                            <Pill bg={`color-mix(in srgb, ${sc.color} 14%, transparent)`} color={sc.color} small>{sc.label}</Pill>
                          ) : (
                            <Pill bg="var(--surface-low)" color="var(--on-surface-variant)" small>Pending</Pill>
                          )}
                        </span>
                        <span style={{ textAlign: "right" }}>
                          {appendix ? (
                            <button className={styles.linkBtn} onClick={(e) => { e.stopPropagation(); setOpenDocId(appendix.id); }}>
                              Open
                            </button>
                          ) : (
                            <span className={styles.dim}>—</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {openDocId && (
        <DocumentEditorModal
          docId={openDocId}
          user={user}
          allUsers={allUsers}
          onClose={() => setOpenDocId(null)}
          onChange={() => { refresh(); onChange?.(); }}
        />
      )}
    </div>
  );
};

/* ─── Step 8 · Audit & Evidence Setup ───────────────────────────────────── */
const FREQUENCY_LABELS = {
  weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly",
  biannually: "Six-Monthly", annually: "Annually",
};

const AuditEvidenceSetupStep = ({ instance, onPatch, allUsers, sites, packKey, appliedProfiles }) => {
  const auditTypes = auditTypesForPack(packKey);
  const config = getPackConfig(packKey);
  const trackedItems = config?.trackedItems ?? [];
  const freqOverrides = instance?.auditFrequencyOverrides ?? {};
  const ownerOverrides = instance?.auditOwnerOverrides ?? {};

  // For each audit type, compute which applied sites it'll generate a schedule for.
  const sitesForAuditType = (t) =>
    appliedProfiles.filter((p) => {
      if (t.requiredFlag && !p[t.requiredFlag]) return false;
      if (t.id === "waterline" && !p.waterlineManagement) return false;
      return true;
    });

  const eligibleAudits = auditTypes.filter((t) => sitesForAuditType(t).length > 0);
  const skippedAudits = auditTypes.filter((t) => sitesForAuditType(t).length === 0);

  const usersForAuditOwner = allUsers.filter((u) =>
    ["governance_lead", "ipc_lead", "decontamination_lead", "irmer_lead",
     "practice_manager", "auditor", "clinical_director", "group_admin"]
      .some((r) => u.role === r || u.secondaryRoles?.includes(r))
  );

  const setFreq = (typeId, value) => {
    onPatch({ auditFrequencyOverrides: { ...freqOverrides, [typeId]: value } });
  };
  const setOwner = (typeId, value) => {
    onPatch({ auditOwnerOverrides: { ...ownerOverrides, [typeId]: value || null } });
  };

  if (appliedProfiles.length === 0) {
    return (
      <EmptyAppliedSitesNotice
        title="Audit & Evidence Setup"
        lead="Go back to Sites in scope first — audit schedules activate per applied site."
      />
    );
  }

  const totalSchedules = eligibleAudits.reduce((sum, t) => sum + sitesForAuditType(t).length, 0);

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Audit &amp; Evidence Setup</h3>
      <p className={styles.wizStepLead}>
        Confirm how often each audit runs and who owns it. On approval the platform creates one
        schedule per (site × audit type). Defaults come from the pack — override per audit where
        your group's cadence differs.
      </p>

      <div className={styles.docCountStrip}>
        <span className={styles.docCount}><strong>{eligibleAudits.length}</strong> audit types active</span>
        <span className={styles.docCount}><strong>{totalSchedules}</strong> schedules will be created</span>
        {skippedAudits.length > 0 && (
          <span className={styles.docCount}><strong>{skippedAudits.length}</strong> not applicable</span>
        )}
      </div>

      <Card hover={false} style={{ overflow: "hidden", marginTop: 6 }}>
        <div className={styles.auditTableHead}>
          <span>Audit</span>
          <span>Frequency</span>
          <span>Owner</span>
          <span>Sites</span>
        </div>
        {eligibleAudits.map((t) => {
          const applicable = sitesForAuditType(t);
          const currentFreq = freqOverrides[t.id] ?? t.defaultFreq;
          const isOverride = freqOverrides[t.id] && freqOverrides[t.id] !== t.defaultFreq;
          return (
            <div key={t.id} className={styles.auditTableRow}>
              <span className={styles.auditCell}>
                <div className={styles.auditTitle}>{t.label}</div>
                <div className={styles.auditMeta}>
                  default {FREQUENCY_LABELS[t.defaultFreq] ?? t.defaultFreq}
                  {t.requiredFlag && <> · gated by <code>{t.requiredFlag}</code></>}
                </div>
              </span>
              <span>
                <select className={styles.wizSelect} value={currentFreq}
                  onChange={(e) => setFreq(t.id, e.target.value)}
                  style={isOverride ? { borderColor: "var(--primary)" } : undefined}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannually">Six-Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </span>
              <span>
                <select className={styles.wizSelect} value={ownerOverrides[t.id] ?? ""}
                  onChange={(e) => setOwner(t.id, e.target.value)}>
                  <option value="">— per-site default —</option>
                  {usersForAuditOwner.map((u) => (
                    <option key={u.id} value={u.id}>{u.displayName ?? u.username} ({u.role})</option>
                  ))}
                </select>
              </span>
              {/* Sites cell — count-primary label that scales cleanly for
               * 10+ sites without crowding the column. Single site shows
               * the full name; two sites show both names; three or more
               * collapse to "N sites" with the full list on hover. The
               * cell is bounded by the fixed 210px grid track so it can
               * never overflow into the adjacent column. */}
              {(() => {
                const siteNames = applicable
                  .map((p) => sites.find((s) => s.id === p.siteId)?.name)
                  .filter(Boolean);
                let label;
                if (siteNames.length === 0)      label = "—";
                else if (siteNames.length === 1) label = siteNames[0];
                else if (siteNames.length === 2) label = siteNames.join(", ");
                else                              label = `${siteNames.length} sites`;
                return (
                  <span
                    title={siteNames.length > 2 ? siteNames.join(", ") : undefined}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      minWidth: 0, overflow: "hidden",
                    }}
                  >
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      minWidth: 22, height: 20, padding: "0 7px",
                      background: "var(--surface-low)", color: "var(--on-surface)",
                      borderRadius: 999, fontSize: 11, fontWeight: 700,
                      flexShrink: 0,
                    }}>{applicable.length}</span>
                    <span style={{
                      color: "var(--on-surface-variant)", fontSize: 12,
                      flex: 1, minWidth: 0,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{label}</span>
                  </span>
                );
              })()}
            </div>
          );
        })}
      </Card>

      {skippedAudits.length > 0 && (
        <Card hover={false} style={{ padding: 14, marginTop: 12 }}>
          <details>
            <summary className={styles.skippedSummary}>
              <I name="info" size={13} color="var(--on-surface-variant)" />
              <strong>{skippedAudits.length}</strong> audit type{skippedAudits.length === 1 ? "" : "s"} not applicable to any site
            </summary>
            {/* Reassuring contextual note + per-row reason rendered inside a
             * tinted sub-panel so it reads as an informational drawer rather
             * than a tucked-away technical list. */}
            <div style={{
              marginTop: 10,
              background: "color-mix(in srgb, var(--primary) 5%, var(--surface-low))",
              border: "1px solid var(--outline-variant)",
              borderRadius: 8,
              padding: "12px 14px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12, color: "var(--on-surface)" }}>
                <I name="info" size={13} color="var(--primary)" />
                <span>
                  These audit tracking frameworks are automatically hidden because the matching
                  equipment / process flags weren't enabled in any applied site's <strong>Site Profile</strong>.
                  Enable the relevant flag(s) in Step 4 and they'll re-appear here.
                </span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                {skippedAudits.map((t) => (
                  <li key={t.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    padding: "8px 12px", background: "var(--surface)", borderRadius: 6,
                    fontSize: 12,
                  }}>
                    <strong style={{ color: "var(--on-surface)", fontWeight: 600 }}>{t.label}</strong>
                    {t.requiredFlag && (
                      <span style={{ color: "var(--on-surface-variant)", fontSize: 11 }}>
                        needs <code style={{
                          fontSize: 10, padding: "1px 6px", borderRadius: 4,
                          background: "var(--surface-low)", color: "var(--on-surface)",
                        }}>{t.requiredFlag}</code>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </Card>
      )}

      {trackedItems.length > 0 && (
        <Card hover={false} style={{ padding: 18, marginTop: 12 }}>
          <h4 className={styles.cardTitle}>Evidence tracked once live</h4>
          <p className={styles.cardLead}>
            On approval the platform starts tracking these evidence items per site. Retention =
            {" "}{instance.evidenceRetentionYears ?? 7} years (set in Organisation Settings).
          </p>
          <ul className={styles.reviewList} style={{ marginTop: 8 }}>
            {trackedItems.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Card>
      )}
    </div>
  );
};

/* ─── Step 9 · Review & Submit ───────────────────────────────────────────── */
const ReviewStep = ({ user, instance, sites, appliedProfiles, allUsers, packKey, onJumpTo, onSubmit }) => {
  const config = getPackConfig(packKey);
  const flags = SITE_PROFILE_FLAGS_BY_PACK[packKey] ?? [];
  const auditTypes = auditTypesForPack(packKey);
  const directorName = allUsers.find((u) => u.id === instance.clinicalDirectorUserId)?.displayName ?? "—";
  const primaryRole = config?.roles?.[0];
  const secondaryLeadLabel = primaryRole?.label ?? "Pack Lead";
  const secondaryLeadName = primaryRole
    ? (allUsers.find((u) => u.id === instance[primaryRole.id])?.displayName ?? "—")
    : "—";
  const auditsForProfile = (profile) =>
    auditTypes.filter((a) => !a.requiredFlag || profile[a.requiredFlag]);
  const enabledFlagLabels = (profile) =>
    flags.filter((f) => profile[f.id]).map((f) => f.label);
  /* Decon writes to the v2 `equipment_assets` table (keyed by siteProfileId);
   * every other pack still uses the legacy `equipment_records` table (keyed
   * by siteId via listForSite). Branch per pack so neither path reads stale
   * data — was the root cause of "Equipment: 0 records" on Decon. */
  const equipmentCountFor = (profile) => {
    if (packKey === DECON_PACK_KEY) {
      const g = listAssetsBySite(user.tenantId, profile.id);
      return g.decon.length + g.water.length + g.waste.length + g.engineer.length;
    }
    return listForSite(user.tenantId, profile.siteId, packKey).length;
  };

  return (
    <div className={styles.wizStep}>
      <h3 className={styles.wizStepTitle}>Review &amp; Submit for Approval</h3>
      <p className={styles.wizStepLead}>
        Submit the pack for Clinical Director approval. Once approved, the platform activates the
        SOPs, audits and evidence requirements listed below at each site.
      </p>

      <div className={styles.reviewGrid}>
        <Card hover={false} className={styles.reviewCard}>
          <div className={styles.reviewCardHead}>
            <h4 className={styles.reviewCardTitle}>Sites in scope</h4>
            <button className={styles.linkBtn} onClick={() => onJumpTo(2)}>Edit</button>
          </div>
          <ul className={styles.reviewList}>
            <li>{appliedProfiles.length} of {sites.length} sites applied</li>
            {appliedProfiles.slice(0, 4).map((p) => (
              <li key={p.id}>{sites.find((s) => s.id === p.siteId)?.name ?? "Unknown"}</li>
            ))}
            {appliedProfiles.length > 4 && <li>… and {appliedProfiles.length - 4} more</li>}
          </ul>
        </Card>
        <Card hover={false} className={styles.reviewCard}>
          <div className={styles.reviewCardHead}>
            <h4 className={styles.reviewCardTitle}>Pack roles &amp; cadence</h4>
            <button className={styles.linkBtn} onClick={() => onJumpTo(5)}>Edit</button>
          </div>
          <ul className={styles.reviewList}>
            <li>Clinical Director: {directorName}</li>
            <li>{secondaryLeadLabel}: {secondaryLeadName}</li>
            <li>Audit frequency: {instance.defaultAuditFrequency ?? "—"}</li>
            <li>Evidence retention: {instance.evidenceRetentionYears ?? 7} years</li>
          </ul>
        </Card>
      </div>

      <Card hover={false} style={{ padding: 18, marginTop: 14 }}>
        <h4 className={styles.cardTitle}>Per-site activation</h4>
        <p className={styles.cardLead}>
          Based on each site's profile flags, here's what the platform will activate at every
          applied site on approval.
        </p>
        <div className={styles.siteCompList} style={{ marginTop: 14, gap: 12 }}>
          {appliedProfiles.map((p) => {
            const site = sites.find((s) => s.id === p.siteId);
            const audits = auditsForProfile(p);
            const procs = enabledFlagLabels(p);
            const eqCount = equipmentCountFor(p);
            return (
              <div key={p.id} className={styles.reviewSiteCard}>
                <div className={styles.reviewSiteHead}>
                  <strong>{site?.name ?? "Unknown"}</strong>
                  <span style={{ display: "flex", gap: 12 }}>
                    <button className={styles.linkBtn} onClick={() => onJumpTo(3)}>Edit profile</button>
                    <button className={styles.linkBtn} onClick={() => onJumpTo(4)}>Edit equipment</button>
                  </span>
                </div>
                <div className={styles.reviewSiteRow}>
                  <span className={styles.reviewSiteLabel}>Processes:</span>
                  <span>{procs.length ? procs.join(" · ") : "— none enabled —"}</span>
                </div>
                <div className={styles.reviewSiteRow}>
                  <span className={styles.reviewSiteLabel}>Equipment:</span>
                  <span>{eqCount} record{eqCount === 1 ? "" : "s"}</span>
                </div>
                <div className={styles.reviewSiteRow}>
                  <span className={styles.reviewSiteLabel}>Audits activated:</span>
                  <span>{audits.length ? audits.map((a) => a.label).join(" · ") : "— none —"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <SubmitGate
        user={user}
        instance={instance}
        appliedProfiles={appliedProfiles}
        sites={sites}
        allUsers={allUsers}
        packKey={packKey}
        onSubmit={onSubmit}
        onJumpTo={onJumpTo}
      />
    </div>
  );
};

/* "Required before submit" checklist — gates the Submit button. Each rule
 * returns a {ok, label, fixStep, hint} entry. The button is disabled until
 * every required rule passes; soft warnings stay visible but don't block. */
const SubmitGate = ({ user, instance, appliedProfiles, sites, allUsers, packKey, onSubmit, onJumpTo }) => {
  const config = getPackConfig(packKey);
  const flags = SITE_PROFILE_FLAGS_BY_PACK[packKey] ?? [];
  const primaryRole = config?.roles?.[0];

  /* Radiography-only: CBCT high-risk gate. If any applied site has
   * `cbctXray = true` (Step 4) but no `cbct_xray` asset in the equipment
   * register (Step 5), IRMER doesn't permit go-live — there's no machine
   * for the appendix to bind to. Block submission until the user either
   * registers the CBCT unit or clears the flag. */
  const cbctRiskProfiles = (() => {
    if (packKey !== "radiography_irmer" || !user || appliedProfiles.length === 0) return [];
    const byProfileId = {};
    for (const e of Store.list(user.tenantId, TABLES.equipment)) {
      (byProfileId[e.siteProfileId] ??= []).push(e);
    }
    return findCbctRiskProfiles(appliedProfiles, byProfileId);
  })();
  const cbctRiskSiteNames = cbctRiskProfiles
    .map((r) => sites.find((s) => s.id === r.siteId)?.name)
    .filter(Boolean);

  // Each rule: required (hard gate) or soft (warning only).
  const rules = [
    {
      key: "sites",
      label: "At least one applicable site selected",
      ok: appliedProfiles.length > 0,
      required: true,
      fixStep: 2,
      hint: "Toggle at least one practice on in Sites in scope.",
    },
    {
      key: "cd",
      label: "Clinical Director assigned",
      ok: !!instance?.clinicalDirectorUserId,
      required: true,
      fixStep: 5,
      fixHighlight: "clinicalDirectorUserId",
      hint: "Pick the CD in Pack roles & cadence (or set a group default in Admin Centre → Organisation Settings).",
    },
    ...(primaryRole ? [{
      key: primaryRole.id,
      label: `${primaryRole.label} assigned`,
      ok: !!instance?.[primaryRole.id],
      required: true,
      fixStep: 5,
      fixHighlight: primaryRole.id,
      hint: `Pick the ${primaryRole.label} in Pack roles & cadence.`,
    }] : []),
    {
      key: "profilesAtLeastOneFlag",
      label: "Every applied site has at least one equipment / process flag enabled",
      ok: appliedProfiles.every((p) => flags.some((f) => p[f.id])),
      required: true,
      fixStep: 3,
      // Highlight the first failing site's flag grid so the user lands on the
      // exact profile that needs attention.
      fixHighlight: (() => {
        const first = appliedProfiles.find((p) => !flags.some((f) => p[f.id]));
        return first ? `site-profile-${first.siteId}` : "site-profile";
      })(),
      hint: "Each site profile needs at least one yes/no flag turned on, otherwise no SOPs activate there.",
    },
    {
      key: "profilesComplete",
      label: "All applied site profiles 100% complete",
      ok: appliedProfiles.every((p) => profileCompletion(p, packKey).pct === 100),
      required: false,
      fixStep: 3,
      hint: "Local leads are missing on one or more sites — recommended but not blocking.",
    },
    /* Radiography-only hard gate. Only injected when there's actual CBCT
     * risk — keeps the checklist clean for the 99% of practices that
     * don't run a cone-beam unit. Deep-links to the equipment register
     * so the user can register the missing CBCT serial in one click. */
    ...(cbctRiskProfiles.length > 0 ? [{
      key: "cbctRiskAssetMissing",
      label: cbctRiskSiteNames.length === 1
        ? `CBCT is in scope at ${cbctRiskSiteNames[0]} but no CBCT unit is registered`
        : `CBCT is in scope at ${cbctRiskProfiles.length} sites but no CBCT unit is registered`,
      ok: false,
      required: true,
      fixStep: 4,
      hint: "IRMER requires every in-scope CBCT to be traceable to a registered unit. Register the CBCT serial in the Equipment register, or clear the CBCT flag in Site profiles.",
    }] : []),
  ];

  const blocking = rules.filter((r) => r.required && !r.ok);
  const warnings = rules.filter((r) => !r.required && !r.ok);
  // Two gates: completeness (no required fields missing) AND role
  // capability (only roles with pack_submit_approval can actually submit).
  const canSubmitByRole = useCap("pack_submit_approval");
  const canSubmit = blocking.length === 0 && canSubmitByRole;

  return (
    <Card hover={false} style={{ padding: 18, marginTop: 14 }}>
      <h4 className={styles.cardTitle}>Required before submit</h4>
      <p className={styles.cardLead}>
        Submission is blocked until every required item is met. Soft warnings flag things you'd
        normally fix but don't block the cascade.
      </p>
      <ul className={styles.gateList}>
        {rules.map((r) => (
          <li key={r.key} className={r.ok ? styles.gateOk : (r.required ? styles.gateFail : styles.gateWarn)}>
            <span className={styles.gateMark}>
              {r.ok ? "✓" : (r.required ? "✗" : "!")}
            </span>
            <span className={styles.gateLabel}>{r.label}</span>
            {!r.ok && (
              <button className={styles.linkBtn} onClick={() => onJumpTo(r.fixStep, r.fixHighlight)}>Fix →</button>
            )}
          </li>
        ))}
      </ul>
      {blocking.length > 0 && (
        <div className={styles.gateBlockerNote}>
          {blocking.length} blocker{blocking.length === 1 ? "" : "s"} — fix above before submitting.
        </div>
      )}
      {blocking.length === 0 && warnings.length > 0 && (
        <div className={styles.gateWarnNote}>
          {warnings.length} soft warning{warnings.length === 1 ? "" : "s"} — submission allowed, but worth tidying up.
        </div>
      )}

      <div className={styles.wizActions} style={{ marginTop: 10 }}>
        <BtnPrimary onClick={onSubmit} disabled={!canSubmit}
          style={{ opacity: canSubmit ? 1 : 0.5 }}>
          <I name="send" size={13} color="var(--on-primary)" /> Submit for Approval
        </BtnPrimary>
      </div>
    </Card>
  );
};

/* ─── Awaiting Approval screen — shown when pack.status === awaiting_approval
 * Renders a dry-run preview of the approval cascade so the CD can see what
 * will happen on Approve & Publish (docs, acks, schedules), plus a Return
 * for changes flow with a comment field. */
const AwaitingApprovalScreen = ({
  instance, packEntry, tenantId, packKey,
  appliedProfiles, sites, allUsers,
  onApprove, onReturn, onExit,
}) => {
  const preview = previewApprovalCascade(tenantId, packKey, appliedProfiles, allUsers);
  const directorName = allUsers.find((u) => u.id === instance.clinicalDirectorUserId)?.displayName ?? "—";
  const canApproveLive = useCap("pack_approve_live");
  const [returning, setReturning] = useState(false);
  const [returnComment, setReturnComment] = useState("");
  const [confirming, setConfirming] = useState(false);

  const byStatus = {
    draft:     preview.toPublish.filter((d) => d.status === DocumentStatus.draft),
    in_review: preview.toPublish.filter((d) => d.status === DocumentStatus.in_review),
    approved:  preview.toPublish.filter((d) => d.status === DocumentStatus.approved),
  };

  return (
    <div>
      <div className={styles.approvalHeader}>
        <Pill bg="rgba(106,27,154,0.10)" color="#6a1b9a" small>Awaiting Approval</Pill>
        <h2 className={styles.areaTitle}>{packEntry?.name ?? "Governance Pack"} — Approval</h2>
        <p className={styles.areaLead} style={{ marginTop: -4 }}>
          Submitted {formatDate(instance.updatedAt ?? instance.createdAt)} ·
          {" "}Clinical Director: <strong>{directorName}</strong>
        </p>
      </div>

      <div className={styles.approvalSummary}>
        <Card hover={false} className={styles.approvalSummaryCard}>
          <div className={styles.approvalSummaryNum}>{appliedProfiles.length}</div>
          <div className={styles.approvalSummaryLabel}>Sites in scope</div>
        </Card>
        <Card hover={false} className={styles.approvalSummaryCard}>
          <div className={styles.approvalSummaryNum}>{preview.toPublish.length}</div>
          <div className={styles.approvalSummaryLabel}>Documents to publish</div>
        </Card>
        <Card hover={false} className={styles.approvalSummaryCard}>
          <div className={styles.approvalSummaryNum}>{preview.ackCount}</div>
          <div className={styles.approvalSummaryLabel}>Staff acks to generate</div>
        </Card>
        <Card hover={false} className={styles.approvalSummaryCard}>
          <div className={styles.approvalSummaryNum}>~{preview.newScheduleEstimate}</div>
          <div className={styles.approvalSummaryLabel}>Audit schedules to activate</div>
        </Card>
      </div>

      {preview.rejected.length > 0 && (
        <Card hover={false} className={styles.approvalWarning}>
          <div className={styles.approvalWarningHead}>
            <I name="alert" size={14} color="#c62828" />
            <strong>{preview.rejected.length}</strong> rejected document{preview.rejected.length === 1 ? "" : "s"} will be left in place — author must fix before they can be published.
          </div>
          <ul className={styles.approvalDocList}>
            {preview.rejected.map((d) => <li key={d.id}>{d.title}</li>)}
          </ul>
        </Card>
      )}

      <Card hover={false} style={{ padding: 18, marginTop: 12 }}>
        <h4 className={styles.cardTitle}>What will be published</h4>
        <p className={styles.cardLead}>
          Every draft / in-review / approved document in this pack is published in one cascade.
          Already-published docs are left in place ({preview.alreadyPublished.length} of those).
        </p>

        {byStatus.draft.length > 0 && (
          <ApprovalDocGroup label="Drafts" color="#1565c0" docs={byStatus.draft} />
        )}
        {byStatus.in_review.length > 0 && (
          <ApprovalDocGroup label="In review" color="#6a1b9a" docs={byStatus.in_review} />
        )}
        {byStatus.approved.length > 0 && (
          <ApprovalDocGroup label="Approved (not yet published)" color="#2e7d32" docs={byStatus.approved} />
        )}
        {preview.toPublish.length === 0 && (
          <div className={styles.wizHintBox} style={{ marginTop: 10 }}>
            <I name="info" size={13} color="var(--primary)" />
            <span>Nothing new to publish — every applicable doc is already published. Approving will activate audit schedules and flip the pack live.</span>
          </div>
        )}
      </Card>

      <Card hover={false} style={{ padding: 18, marginTop: 12 }}>
        <h4 className={styles.cardTitle}>Sites going live</h4>
        <ul className={styles.approvalSiteList}>
          {appliedProfiles.map((p) => {
            const site = sites.find((s) => s.id === p.siteId);
            return <li key={p.id}>{site?.name ?? "Unknown"}{site?.location ? ` — ${site.location}` : ""}</li>;
          })}
        </ul>
      </Card>

      {!returning ? (
        <div className={styles.approvalActions}>
          {!confirming ? (
            <BtnPrimary
              onClick={() => setConfirming(true)}
              disabled={!canApproveLive}
              style={{ opacity: canApproveLive ? 1 : 0.5, cursor: canApproveLive ? "pointer" : "not-allowed" }}
              title={canApproveLive ? undefined : "Only the Clinical Director can approve and publish this pack."}
            >
              <I name="checkcircle" size={13} color="var(--on-primary)" /> Approve &amp; Publish All
            </BtnPrimary>
          ) : (
            <div className={styles.approvalConfirm}>
              <span>
                This will publish <strong>{preview.toPublish.length}</strong> docs and generate
                <strong> {preview.ackCount}</strong> ack tasks. Sure?
              </span>
              <BtnPrimary onClick={onApprove}>
                <I name="checkcircle" size={13} color="var(--on-primary)" /> Yes, publish
              </BtnPrimary>
              <BtnSecondary onClick={() => setConfirming(false)}>Cancel</BtnSecondary>
            </div>
          )}
          <BtnSecondary onClick={() => setReturning(true)}>
            <I name="back" size={13} /> Return for changes
          </BtnSecondary>
        </div>
      ) : (
        <Card hover={false} style={{ padding: 18, marginTop: 12 }}>
          <h4 className={styles.cardTitle}>Return for changes</h4>
          <p className={styles.cardLead}>
            Pack goes back to <strong>In setup</strong> so the author can address your comments.
            Your note is logged to the audit trail.
          </p>
          <textarea className={styles.approvalCommentBox} rows={4}
            placeholder="What needs to change before this can be approved?"
            value={returnComment}
            onChange={(e) => setReturnComment(e.target.value)} />
          <div className={styles.approvalActions}>
            <BtnPrimary onClick={() => onReturn(returnComment)} disabled={!returnComment.trim()}>
              <I name="back" size={13} color="var(--on-primary)" /> Return with comment
            </BtnPrimary>
            <BtnSecondary onClick={() => { setReturning(false); setReturnComment(""); }}>Cancel</BtnSecondary>
          </div>
        </Card>
      )}
    </div>
  );
};

const ApprovalDocGroup = ({ label, color, docs }) => (
  <div className={styles.approvalDocGroup}>
    <div className={styles.approvalDocGroupHead}>
      <Pill bg={`color-mix(in srgb, ${color} 14%, transparent)`} color={color} small>{label}</Pill>
      <span className={styles.approvalDocGroupCount}>{docs.length}</span>
    </div>
    <ul className={styles.approvalDocList}>
      {docs.slice(0, 10).map((d) => <li key={d.id}>{d.title}</li>)}
      {docs.length > 10 && <li className={styles.dim}>… and {docs.length - 10} more</li>}
    </ul>
  </div>
);

/* ─── Top-level wizard container ─────────────────────────────────────────── */
export const PackSetup = ({ user, allUsers, sites, onExit, onPackLive, packKey = DECON_PACK_KEY }) => {
  const tenantId = user.tenantId;
  const initialInstance = ensurePackInstance(tenantId, packKey);
  const [step, setStep] = useState(0);
  // When a "Fix" link on the Review step jumps to an earlier step it can also
  // pass a `highlightId` — a stable string the destination step uses to scroll
  // the matching field into view + apply a focus ring. Cleared on the next
  // step change so it only fires once.
  const [highlightId, setHighlightId] = useState(null);
  const jumpTo = (nextStep, highlight) => {
    setStep(nextStep);
    setHighlightId(highlight ?? null);
  };
  /* After the step renders, find the element flagged with the matching
   * data-highlight attribute, scroll it into view and add a pulse-ring
   * class. Auto-clears the ring + state after a few seconds so it doesn't
   * stick around if the user navigates elsewhere. */
  useEffect(() => {
    if (!highlightId) return;
    // Give the new step a moment to mount.
    const raf = requestAnimationFrame(() => {
      const el = document.querySelector(`[data-highlight="${highlightId}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add(styles.highlightPulse);
      // If the target is a form control, focus it for keyboard users.
      if (typeof el.focus === "function") {
        try { el.focus({ preventScroll: true }); } catch { /* noop */ }
      }
      setTimeout(() => el.classList.remove(styles.highlightPulse), 3000);
    });
    const t = setTimeout(() => setHighlightId(null), 3500);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [highlightId, step]);
  const [tick, setTick] = useState(0);

  const instance = getPackInstance(tenantId, packKey) ?? initialInstance;
  const packEntry = getPackCatalogueEntry(packKey);

  // Push the Back-to-catalogue button into the Governance & SOPs header's
  // right slot for as long as the wizard is mounted. Cleared on unmount.
  useSetHeaderActions(<BackButton onClick={onExit} label="Back to catalogue" />);

  useEffect(() => {
    for (const s of sites) ensureProfile(user, s.id, packKey);
  }, [packKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const patchOrg = (patch) => { updatePackSetup(user, patch, packKey); setTick((t) => t + 1); };
  const refresh = () => setTick((t) => t + 1);

  const profiles = sites.map((s) => getProfile(tenantId, s.id, instance.id)).filter(Boolean);
  const appliedProfiles = profiles.filter((p) => p.applied);

  const handleSubmit = () => {
    // Wizard requires `in_setup` to submit. If the user walked through
    // without saving any pack-level field, it's still `not_started` —
    // promote it via an empty patch (updatePackSetup auto-bumps the status).
    if (instance.status === PackStatus.not_started) {
      updatePackSetup(user, {}, packKey);
    }
    transitionPack(user, "submit_for_approval", packKey);
    refresh();
  };
  const handleApprove = () => {
    // Cascade: publish all draft / in_review / approved docs, generate ack
    // tasks for the published versions, activate audit schedules per site,
    // then flip the pack to live.
    publishPackForApproval(user, packKey, instance, appliedProfiles, allUsers, sites);
    transitionPack(user, "approve", packKey);
    onPackLive();
  };
  const handleReturn = (comment) => {
    recordReturnComment(user, instance, packKey, comment);
    transitionPack(user, "return", packKey);
    refresh();
  };

  if (instance.status === PackStatus.awaiting_approval) {
    return (
      <AwaitingApprovalScreen
        instance={instance}
        packEntry={packEntry}
        tenantId={tenantId}
        packKey={packKey}
        appliedProfiles={appliedProfiles}
        sites={sites}
        allUsers={allUsers}
        onApprove={handleApprove}
        onReturn={handleReturn}
        onExit={onExit}
      />
    );
  }

  // Safety net: if a live pack somehow lands in PackSetup (e.g. a stale URL
  // or future navigation accident), jump straight to the live dashboard
  // instead of re-rendering the wizard.
  if (instance.status === PackStatus.live) {
    onPackLive?.();
    return null;
  }

  return (
    <div>
      <h2 className={styles.areaTitle}>{packEntry?.name ?? "Governance Pack"} — Setup</h2>
      <p className={styles.areaLead} style={{ marginTop: -4, marginBottom: 14 }}>
        Setting up for <strong>{getTenantName(tenantId)}</strong>
      </p>
      <ProgressHeader step={step} />

      <Card hover={false} style={{ marginTop: 16, padding: 0, overflow: "hidden" }}>
        <div className={styles.wizardBody}>
          {step === 0 && <IntroStep packEntry={packEntry} />}
          {step === 1 && <ConfirmDefaultsStep user={user} allUsers={allUsers} />}
          {step === 2 && <SitesStep tenantId={tenantId} instance={instance} sites={sites} user={user} onChange={refresh} packKey={packKey} />}
          {step === 3 && <SiteProfilesStep user={user} sites={sites} appliedProfiles={appliedProfiles} allUsers={allUsers} packKey={packKey} onChange={refresh} />}
          {step === 4 && (
            // Pack-specialised equipment / credentials registers:
            //   • Decon: v2 4-category (Decon / Water / Waste / Engineer)
            //   • Radiography: 4 physical modalities, conditionally rendered
            //     from Step 4 flags, IRR17-compliant field schema
            //   • Med Emergencies: 3 RCUK-aligned containers (AED / O₂ / kit)
            //   • Safeguarding: NO hardware — swaps to credentials register
            //     (DSL Level 3 / Team L1-L2 matrix / DBS records)
            //   • Everything else: legacy flag-gated v1 component
            packKey === DECON_PACK_KEY ? (
              <EquipmentRegisterDeconStep user={user} sites={sites} appliedProfiles={appliedProfiles} onChange={refresh} />
            ) : packKey === "radiography_irmer" ? (
              <EquipmentRegisterRadiographyStep user={user} sites={sites} appliedProfiles={appliedProfiles} onChange={refresh} />
            ) : packKey === "medical_emergencies" ? (
              <EquipmentRegisterMedEmergStep user={user} sites={sites} appliedProfiles={appliedProfiles} onChange={refresh} />
            ) : packKey === "safeguarding_governance" ? (
              <CredentialsRegisterSafeguardingStep user={user} sites={sites} allUsers={allUsers} appliedProfiles={appliedProfiles} onChange={refresh} />
            ) : getRegisterSchema(packKey) ? (
              // Long-tail packs (Complaints / Practice Ops / Audit /
              // Site-Specific) drive Step 5 from the central schema map.
              <GenericRegisterStep user={user} sites={sites} allUsers={allUsers} appliedProfiles={appliedProfiles} packKey={packKey} onChange={refresh} />
            ) : (
              <EquipmentRegisterStep user={user} sites={sites} appliedProfiles={appliedProfiles} packKey={packKey} onChange={refresh} />
            )
          )}
          {step === 5 && <GroupDefaultsStep instance={instance} onPatch={patchOrg} allUsers={allUsers} packKey={packKey} />}
          {step === 6 && <DocumentsToReviewStep user={user} allUsers={allUsers} packKey={packKey} packInstance={instance} appliedProfiles={appliedProfiles} onChange={refresh} />}
          {step === 7 && <SiteAppendicesStep user={user} allUsers={allUsers} sites={sites} packKey={packKey} packInstance={instance} appliedProfiles={appliedProfiles} onChange={refresh} />}
          {step === 8 && <AuditEvidenceSetupStep instance={instance} onPatch={patchOrg} allUsers={allUsers} sites={sites} packKey={packKey} appliedProfiles={appliedProfiles} />}
          {step === 9 && (
            <ReviewStep
              user={user}
              instance={instance}
              sites={sites}
              appliedProfiles={appliedProfiles}
              allUsers={allUsers}
              packKey={packKey}
              onJumpTo={jumpTo}
              onSubmit={handleSubmit}
            />
          )}
        </div>
        <div className={styles.wizardFooter}>
          <BtnSecondary onClick={() => (step === 0 ? onExit() : setStep(step - 1))}>
            <I name="back" size={12} /> {step === 0 ? "Back to catalogue" : "Back"}
          </BtnSecondary>
          <div style={{ flex: 1 }} />
          {step < WIZARD_STEPS.length - 1 && (
            <BtnPrimary onClick={() => setStep(step + 1)}>
              Next: {WIZARD_STEPS[step + 1].label} <I name="arrow" size={12} color="var(--on-primary)" />
            </BtnPrimary>
          )}
        </div>
      </Card>
    </div>
  );
};
