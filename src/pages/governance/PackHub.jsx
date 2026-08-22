import { I } from "../../components/Icon";
import { Card } from "../../components/ui/Card";
import { Pill } from "../../components/ui/Pill";
import { BtnPrimary } from "../../components/ui/Buttons";
import {
  listPackCatalogue, getPackInstance, resetPackForDemo,
} from "../../services/governance/packs.service";
import { can } from "../../services/governance/permissions";
import { PackStatus } from "../../services/governance/types";
import { useCap } from "../../services/devRole";
import styles from "./Governance.module.css";

const STATUS_PILL = {
  not_configured:    { label: "Not configured",   bg: "rgba(88,97,97,0.14)",   color: "#586161" },
  not_started:       { label: "Not configured",   bg: "rgba(88,97,97,0.14)",   color: "#586161" },
  in_setup:          { label: "In setup",         bg: "rgba(13,85,165,0.14)",  color: "#0d55a5" },
  awaiting_approval: { label: "Awaiting approval", bg: "rgba(106,27,154,0.14)", color: "#6a1b9a" },
  live:              { label: "Live",             bg: "rgba(37,111,42,0.14)",   color: "#256f2a" },
  archived:          { label: "Archived",         bg: "rgba(82,91,118,0.14)",   color: "#525b76" },
};

/**
 * Governance Packs catalogue.
 *
 * Cards share a layout but their primary action depends on the pack:
 *   - Configuration packs (Decon, Radiography, IRMER, Fire, etc.) → `Start
 *     Setup`, routing into the per-pack setup wizard.
 *   - Document packs (Clinical Governance) → `Open library`, routing straight
 *     into the controlled-protocol library because there is nothing for the
 *     practice to configure — the SOPs are centrally maintained and just need
 *     adoption.
 * Each pack also surfaces its named lead role (`Lead: ...`) so the PM can see
 * at a glance who is responsible before they open it.
 */
export const PackHub = ({ user, onOpenPack, onPackChanged, justActivatedPackKey = null, onDismissJustActivated }) => {
  /* Look up the just-activated pack's catalogue entry once so the banner
   * has its name without scanning the list inside JSX. Returns null when
   * the prop is unset (most renders) — banner is suppressed. */
  const justActivatedEntry = justActivatedPackKey
    ? listPackCatalogue().find((p) => p.key === justActivatedPackKey)
    : null;

  // Clinical Governance has its own sidebar entry ("Clinical Protocols"
  // under Clinical & Compliance) which opens the protocol library directly.
  // Hide it from the pack catalogue to avoid duplicate entry points and to
  // keep the catalogue focused on configurable packs.
  const packs = listPackCatalogue().filter((p) => p.key !== "clinical_governance");
  // Permission gate first (real auth), then dev-role override (Phase-1 cap)
  // so a Staff viewer never sees the reset link even with a permissive token.
  const canSetupPack    = useCap("pack_setup");
  const canResetForDemo = useCap("pack_reset_for_demo");
  const canResetPacks = !!user && can(user, "pack.reset") && canResetForDemo;

  const handleResetPack = (packKey, packName) => {
    if (!canResetPacks) return;
    if (!confirm(`Reset "${packName}" to fresh state for the next demo? This wipes the pack instance, site profiles, acknowledgements, evidence and audit schedules for this pack only. Documents remain in the library.`)) return;
    resetPackForDemo(user, packKey);
    onPackChanged?.();
  };

  return (
    <div>
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>Governance packs</h2>
        <p className={styles.introLead}>
          Controlled governance frameworks for UK dental groups. Each pack is a complete operational
          system — policies, SOPs, evidence requirements, audits, acknowledgements and version
          control. The platform supplies the framework; your group configures the local detail
          per site.
        </p>
      </div>

      {justActivatedEntry && (
        <div className={styles.packLiveBanner} role="status">
          <I name="check" size={14} color="#2e7d32" />
          <div className={styles.packLiveBannerText}>
            <strong>{justActivatedEntry.name}</strong> is now Live — SOPs published, audits scheduled and
            acknowledgements out to staff.
          </div>
          <button
            type="button"
            className={styles.packLiveBannerOpen}
            onClick={() => { onDismissJustActivated?.(); onOpenPack(justActivatedPackKey); }}
          >
            View pack →
          </button>
          <button
            type="button"
            className={styles.packLiveBannerDismiss}
            onClick={() => onDismissJustActivated?.()}
            title="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.packGrid}>
        {packs.map((pack) => {
          const instance = user ? getPackInstance(user.tenantId, pack.key) : null;
          const status = instance?.status ?? "not_configured";
          const pill = STATUS_PILL[status] ?? STATUS_PILL.not_configured;
          const isLibraryPack = pack.entryView === "library";
          const isLive = status === PackStatus.live;
          const isInSetup = status === PackStatus.in_setup || status === PackStatus.awaiting_approval;
          const isConfigured = !!instance;

          let label = pack.entryLabel ?? "Start Setup";
          let icon = isLibraryPack ? "eye" : "zap";
          if (!isLibraryPack) {
            if (isLive) { label = "Open pack"; icon = "arrow-right"; }
            else if (isInSetup) { label = "Continue setup"; icon = "arrow-right"; }
          }

          const showReset = canResetPacks && !isLibraryPack && isConfigured;

          // Client-specific packs have no SaaS-provided master templates —
          // they're entirely client-configured. Mark them visually so users
          // know the difference at a glance.
          const isClientSpecific = pack.key === "audit_evidence" || pack.key === "site_specific_sops";

          return (
            <Card
              key={pack.key}
              hover={false}
              className={`${styles.packCard} ${isClientSpecific ? styles.packCardClientSpecific : ""}`}
            >
              <div className={styles.packCardHead}>
                <div className={styles.packCardHeadLeft}>
                  <div
                    className={styles.packCardIcon}
                    style={{ background: `color-mix(in srgb, ${pack.color} 14%, transparent)` }}
                  >
                    <I name={pack.icon} size={26} color={pack.color} />
                  </div>
                  {isClientSpecific && (
                    <span className={styles.packCardClientLabel} title="Built per client — no SaaS-provided master templates.">
                      Client Specific
                    </span>
                  )}
                </div>
                {!isLibraryPack && (
                  <Pill bg={pill.bg} color={pill.color}>{pill.label}</Pill>
                )}
              </div>

              <div className={styles.packCardSub}>{pack.subtitle}</div>
              <h3 className={styles.packCardTitle}>{pack.name}</h3>
              <p className={styles.packCardDesc}>{pack.description}</p>

              <div className={styles.packCardMeta}>
                <div className={styles.packCardMetaItem}>
                  <I name="shield" size={13} color="var(--outline)" />
                  <span>{pack.standards.join(" · ")}</span>
                </div>
                {pack.lead && (
                  <div className={styles.packCardMetaItem}>
                    <I name="user" size={13} color="var(--outline)" />
                    <span>Lead: {pack.lead}</span>
                  </div>
                )}
              </div>

              <div className={styles.packCardActions}>
                {/* Library packs (Clinical Governance) are always openable —
                    they're read-only browse, not configuration. Configurable
                    packs require the pack_setup capability. */}
                <BtnPrimary
                  onClick={() => onOpenPack(pack.key)}
                  disabled={!isLibraryPack && !canSetupPack}
                  style={{ flex: 1, justifyContent: "center", opacity: (isLibraryPack || canSetupPack) ? 1 : 0.5, cursor: (isLibraryPack || canSetupPack) ? "pointer" : "not-allowed" }}
                  title={(isLibraryPack || canSetupPack) ? undefined : "Your role can't configure this pack — switch role to Group Admin or Governance Lead."}
                >
                  <I name={icon} size={13} color="var(--on-primary)" /> {label}
                </BtnPrimary>
              </div>

              {/* Demo scaffolding — dev builds only, never in production. */}
              {import.meta.env.DEV && showReset && (
                <button
                  type="button"
                  className={styles.packCardResetLink}
                  onClick={() => handleResetPack(pack.key, pack.name)}
                  title="Wipe this pack's setup so the next demo starts from a clean catalogue card"
                >
                  <I name="refresh-cw" size={11} color="var(--outline)" /> Reset for demo
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
