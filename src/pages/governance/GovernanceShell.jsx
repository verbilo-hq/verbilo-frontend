/**
 * Internal state-routed shell for the Governance & SOPs / Governance Packs area.
 *
 * Routes (state-driven, no router):
 *   - hub        — pack catalogue
 *   - setup      — pack setup wizard (org-level)
 *   - scope      — sub-sections inside the live pack, rendered as TABS:
 *       overview | protocols | sites | audits | evidence | people | history
 *     plus drill-in views: site, document, export
 *
 * Tabs replace the previous left sidebar so the layout matches the simplified
 * mockup: header (pack name + Switch / Export) → tab bar → site filter →
 * tab body.
 *
 * The shell holds a `siteFilter` — "all" or a siteId — which propagates to
 * every scoped page so the dashboard, registers and aggregates can be filtered
 * per practice.
 */

import { useEffect, useRef, useState } from "react";
import { I } from "../../components/Icon";
import { useAuth } from "../../auth/AuthContext";
import { Pill } from "../../components/ui/Pill";
import { BtnSecondary } from "../../components/ui/Buttons";
import { ensureSeed, resetAndReseed } from "../../services/governance/seed";
import {
  getPackInstance, getPackCatalogueEntry, DECON_PACK_KEY, getClinicalDirector,
  listPackCatalogue,
} from "../../services/governance/packs.service";
import { listSites, getSite } from "../../services/governance/sites.service";
import { listUsers } from "../../services/governance/users.service";
import { PackStatus, UserRole } from "../../services/governance/types";
import { PackHub } from "./PackHub";
import { PackSetup } from "./PackSetup";
import { ConfirmClinicalDirector } from "./ConfirmClinicalDirector";
import { ProtocolLibrary, getProtocolByReference } from "./ProtocolLibrary";
import { ProtocolViewer } from "./ProtocolViewer";
import { ProtocolCompliance } from "./ProtocolCompliance";
import { SiteList, SiteProfile } from "./SitePages";
import { DocumentRegister, DocumentDetail } from "./DocumentPages";
import { EvidenceRegister, AuditsPage } from "./AckEvidenceAuditPages";
// AuditRunPage is the single API-first wrapper around AuditFormRunner. Its
// development fallback preserves legacy demo schedules when the local backend
// has not been seeded. See AuditRunPage.README.md.
import { AuditRunPage } from "./AuditRunPage";
import { Store, TABLES } from "../../services/governance/store";
import { PeopleTab } from "./PeopleTab";
import { HistoryTab } from "./HistoryTab";
import { DeconPackDashboard, IRMERPackDashboard } from "./Dashboard";
import { ExportEvidencePack } from "./ExportEvidencePack";
import styles from "./Governance.module.css";

const RADIOGRAPHY_PACK_KEY = "radiography_irmer";

/* ─── Demo user resolver ──────────────────────────────────────────────────── */
function useGovernanceUser(authUser) {
  if (!authUser) return null;
  let demoRole = import.meta.env.DEV ? UserRole.super_admin : UserRole.staff;
  try {
    const override = localStorage.getItem("verbilo.demo.role");
    if (override && Object.values(UserRole).includes(override)) demoRole = override;
  } catch { /* noop */ }
  return {
    id: authUser.id ?? authUser.cognitoId ?? "00000000-0000-0000-0000-000000000001",
    tenantId: authUser.tenantId ?? "demo-tenant",
    siteId: authUser.siteId ?? null,
    username: authUser.username ?? "dev",
    displayName: authUser.displayName ?? "Dev User",
    role: authUser.role ?? demoRole,
  };
}

/* ─── Tab definitions ─────────────────────────────────────────────────────── */

const TABS = [
  { id: "overview",  label: "Overview"  },
  { id: "protocols", label: "Protocols" },
  { id: "sites",     label: "Sites"     },
  { id: "audits",    label: "Audits"    },
  { id: "evidence",  label: "Evidence"  },
  { id: "people",    label: "People"    },
  { id: "history",   label: "History"   },
];

const PackTabs = ({ active, onChange }) => (
  <div className={styles.packTabBar}>
    {TABS.map((t) => (
      <button
        key={t.id}
        className={active === t.id ? `${styles.packTabLink} ${styles.packTabLinkActive}` : styles.packTabLink}
        onClick={() => onChange(t.id)}
      >
        {t.label}
      </button>
    ))}
  </div>
);

/* Maps PackStatus → { label, color } for the status pill / dot. Used by
 * both the inline header pill and every row in the PackSwitcher menu. */
const STATUS_META = {
  [PackStatus.live]:               { label: "Live",              color: "#2e7d32" },
  [PackStatus.awaiting_approval]:  { label: "Awaiting Approval", color: "#6a1b9a" },
  [PackStatus.in_setup]:           { label: "In Setup",          color: "#1565c0" },
  [PackStatus.changes_requested]:  { label: "Changes Requested", color: "#ef6c00" },
};
const NOT_CONFIGURED_META = { label: "Not configured", color: "#94a3b8" };

const statusMetaFor = (pack) =>
  pack ? (STATUS_META[pack.status] ?? STATUS_META[PackStatus.in_setup]) : NOT_CONFIGURED_META;

/**
 * PackSwitcher — clickable title that opens a dropdown listing every pack
 * at this tenant with its live status, so the user can one-click between
 * packs without round-tripping through the catalogue.
 *
 * Click outside or Escape closes the menu. Selecting the *current* pack
 * is a no-op (just closes). Selecting a Live pack jumps to its overview;
 * any other status jumps to the setup wizard for that pack.
 */
const PackSwitcher = ({ tenantId, activePackKey, activePack, packCatalogueEntry, onSwitch, onGoToHub }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const title = packCatalogueEntry?.name ?? "Governance Pack";
  const activeStatus = statusMetaFor(activePack);

  // Close on outside-click + Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    const onKey      = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Build one row per pack in the catalogue, hydrated with its current
  // instance status. Catalogue order is preserved so it matches the hub.
  const rows = listPackCatalogue().map((entry) => {
    const inst = getPackInstance(tenantId, entry.key);
    const meta = statusMetaFor(inst);
    return { entry, inst, meta };
  });
  const liveCount       = rows.filter((r) => r.inst?.status === PackStatus.live).length;
  const inFlightCount   = rows.filter((r) => r.inst && r.inst.status !== PackStatus.live).length;
  const notConfigCount  = rows.length - liveCount - inFlightCount;

  return (
    <div className={styles.packSwitcher} ref={rootRef}>
      <button
        type="button"
        className={styles.packSwitcherTrigger}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        title="Switch between governance packs"
      >
        <span>{title}</span>
        <Pill bg={`color-mix(in srgb, ${activeStatus.color} 14%, transparent)`} color={activeStatus.color} small>
          {activeStatus.label}
        </Pill>
        <span className={styles.packSwitcherChevron}>▾</span>
      </button>

      {open && (
        <div className={styles.packSwitcherMenu} role="menu">
          <div className={styles.packSwitcherMenuLabel}>
            Your governance packs · {liveCount} live · {inFlightCount} in flight · {notConfigCount} not configured
          </div>
          {rows.map(({ entry, inst, meta }) => {
            const isActive = entry.key === activePackKey;
            return (
              <button
                key={entry.key}
                type="button"
                role="menuitem"
                className={isActive ? `${styles.packSwitcherRow} ${styles.packSwitcherRowActive}` : styles.packSwitcherRow}
                onClick={() => { setOpen(false); if (!isActive) onSwitch(entry.key, inst); }}
              >
                <span className={styles.packSwitcherDot} style={{ background: meta.color }} title={meta.label} />
                <span>
                  <div className={styles.packSwitcherName}>{entry.name}</div>
                  <div className={styles.packSwitcherSub}>
                    {meta.label}
                    {isActive && " · currently viewing"}
                  </div>
                </span>
                <Pill bg={`color-mix(in srgb, ${meta.color} 14%, transparent)`} color={meta.color} small>
                  {meta.label}
                </Pill>
              </button>
            );
          })}
          <div className={styles.packSwitcherFoot}>
            <span>Need to configure a new pack?</span>
            <button type="button" className={styles.packSwitcherFootLink}
              onClick={() => { setOpen(false); onGoToHub(); }}>
              Open full catalogue →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PackHeader = ({ tenantId, pack, activePackKey, packCatalogueEntry, onSwitch, onGoToHub, onExport, onReset }) => (
  <div className={styles.packHeader}>
    <div className={styles.packHeaderLeft}>
      <div className={styles.packHeaderEyebrow}>Governance & SOPs · {pack?.groupName ?? ""}</div>
      <div className={styles.packHeaderTitle}>
        <PackSwitcher
          tenantId={tenantId}
          activePackKey={activePackKey}
          activePack={pack}
          packCatalogueEntry={packCatalogueEntry}
          onSwitch={onSwitch}
          onGoToHub={onGoToHub}
        />
      </div>
    </div>
    <div className={styles.packHeaderActions}>
      <BtnSecondary onClick={onExport}>
        <I name="download" size={12} /> Export Evidence
      </BtnSecondary>
      <button className={styles.linkBtn} onClick={onReset} title="Wipe local demo data and re-seed">
        <I name="refresh" size={11} /> Reset demo
      </button>
    </div>
  </div>
);

const SiteFilter = ({ sites, value, onChange }) => (
  <div className={styles.siteFilterRow}>
    <span className={styles.siteFilterLabel}>Site:</span>
    <select
      className={styles.siteFilterSelect}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="all">All sites ({sites.length})</option>
      {sites.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  </div>
);

/* ─── Shell root ──────────────────────────────────────────────────────────── */

export const GovernanceShell = ({ initialView, onExitShell, standalone = false } = {}) => {
  const { user: authUser } = useAuth();
  const user = useGovernanceUser(authUser);

  // First-load seed
  useEffect(() => { if (user) ensureSeed(user); }, [user?.tenantId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Parent can seed the initial view — e.g. GovernancePage routing the
  // Clinical Governance landing tile straight into the protocol library.
  // When entered via initialView and the user is at that top-level view,
  // Back calls onExitShell (back to landing) instead of stepping inside.
  const [view, setView] = useState(initialView ?? { kind: "hub" });
  const enteredViaInitial = !!initialView;
  const [siteFilter, setSiteFilter] = useState("all");
  /* Protocol-library category filter — lifted here so it survives the
   * library → protocol → back-to-library navigation cycle. null = All. */
  const [libraryCategory, setLibraryCategory] = useState(null);
  /* When the approval cascade flips a pack live, we land back at the
   * catalogue with this set so PackHub can render a transient confirmation
   * banner. Cleared as soon as the user navigates anywhere else. */
  const [justActivatedPackKey, setJustActivatedPackKey] = useState(null);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  if (!user) return <div style={{ padding: 24 }}>Loading…</div>;

  const sites = listSites(user.tenantId);
  const allUsers = listUsers(user.tenantId);
  const activePackKey = view.packKey ?? DECON_PACK_KEY;
  const pack = getPackInstance(user.tenantId, activePackKey);
  const packCatalogueEntry = getPackCatalogueEntry(activePackKey);

  /* No auto-route to live operational state — every pack now opens the
     storyboard so the user sees the workflow explainer first. */

  const handleReset = () => {
    if (!confirm("Reset all governance demo data for this tenant? This rebuilds the Dental Group dataset.")) return;
    resetAndReseed(user);
    setView({ kind: "hub" });
    refresh();
  };

  /* ── View renderer ────────────────────────────────────────────────────── */

  if (view.kind === "hub") {
    return (
      <PackHub
        user={user}
        onPackChanged={refresh}
        // Transient confirmation banner key — set by onPackLive when the
        // approval cascade just flipped a pack live. Cleared by PackHub
        // when the user dismisses the banner or opens any pack.
        justActivatedPackKey={justActivatedPackKey}
        onDismissJustActivated={() => setJustActivatedPackKey(null)}
        // Configuration packs enter the setup wizard. Document packs (Clinical
        // Governance) skip the wizard and open straight into their library —
        // there is no per-practice configuration for those because the
        // protocols are pre-authored and version-controlled centrally. The
        // ONE exception: a document pack still needs its Tier-2 lead named
        // (Clinical Director for Clinical Governance) before the library is
        // governance-grade, so we route through ConfirmClinicalDirector first
        // if no CD is on record.
        onOpenPack={(packKey) => {
          const cfg = getPackCatalogueEntry(packKey);
          if (cfg?.entryView !== "library") {
            // Live packs open into the dashboard (scope view); packs still in
            // setup / awaiting_approval / not_started open into the wizard.
            const pack = getPackInstance(user.tenantId, packKey);
            if (pack?.status === PackStatus.live) {
              setView({ kind: "scope", section: "overview", packKey });
            } else {
              setView({ kind: "setup", packKey });
            }
            return;
          }
          if (packKey === "clinical_governance" && !getClinicalDirector(user.tenantId)) {
            setView({ kind: "confirm_cd", packKey });
            return;
          }
          setView({ kind: "library", packKey });
        }}
      />
    );
  }

  if (view.kind === "confirm_cd") {
    return (
      <ConfirmClinicalDirector
        user={user}
        allUsers={allUsers}
        onConfirmed={() => setView({ kind: "library", packKey: activePackKey })}
        onCancel={() => setView({ kind: "hub" })}
      />
    );
  }

  if (view.kind === "setup") {
    return (
      <PackSetup
        user={user}
        allUsers={allUsers}
        sites={sites}
        packKey={activePackKey}
        onExit={() => setView({ kind: "hub" })}
        // After the approval cascade flips the pack live, land back at the
        // catalogue so the user sees the full pack landscape (with this
        // pack now Live, and any other packs they haven't configured yet).
        // PackHub picks up justActivatedPackKey and renders a transient
        // confirmation banner with a one-click "View this pack" link in
        // case the user does want to drill in immediately.
        onPackLive={() => {
          setJustActivatedPackKey(activePackKey);
          setView({ kind: "hub" });
        }}
        // Kept for any future configuration pack that wants a quick jump into
        // a linked library; Clinical Governance no longer reaches this view.
        onOpenLibrary={() => setView({ kind: "library", packKey: activePackKey })}
      />
    );
  }

  if (view.kind === "library") {
    // For document packs (no wizard), back normally returns to the catalogue.
    // But if the shell was opened straight into this library via initialView
    // (e.g. the landing's Clinical Governance tile), the catalogue is empty
    // for this pack — exit the shell entirely so Back returns to the landing.
    // For configuration packs that link in via setup, back returns to setup.
    const libraryEntry = getPackCatalogueEntry(activePackKey);
    const libraryBack = libraryEntry?.entryView === "library"
      ? (enteredViaInitial && onExitShell
          ? () => onExitShell()
          : () => setView({ kind: "hub" }))
      : () => setView({ kind: "setup", packKey: activePackKey });
    return (
      <ProtocolLibrary
        user={user}
        onBack={libraryBack}
        standalone={standalone}
        onOpenProtocol={(reference) => setView({ kind: "protocol", packKey: activePackKey, protocolRef: reference })}
        onOpenCompliance={() => setView({ kind: "compliance", packKey: activePackKey })}
        activeCategory={libraryCategory}
        onChangeCategory={setLibraryCategory}
      />
    );
  }

  if (view.kind === "compliance") {
    return (
      <ProtocolCompliance
        user={user}
        onBack={() => setView({ kind: "library", packKey: activePackKey })}
        onOpenProtocol={(reference) => setView({ kind: "protocol", packKey: activePackKey, protocolRef: reference })}
      />
    );
  }

  /* `run_audit` is a focused full-page view — no tabs, just the runner.
   * Submission (or cancel) flips back to the audits tab on the same pack.
   *
   * Look the schedule up locally so we can pass (auditTypeId + packKey
   * + siteId) into AuditRunPage. The backend resolves the platform-master
   * audit_template via (packKey, auditTypeId), so the frontend never
   * needs to know template UUIDs. */
  if (view.kind === "run_audit") {
    const schedule = view.scheduleId
      ? Store.get(user.tenantId, TABLES.audits, view.scheduleId)
      : null;
    // Resolve the globally-selected site (header dropdown). When "all" is
    // selected, leave null and AuditRunPage will fall back to the
    // schedule's siteId. When a specific site is picked, that wins for
    // the audit-header display + offline-mode site lookup.
    const globalActiveSite = siteFilter !== "all"
      ? sites.find((s) => s.id === siteFilter) ?? null
      : null;
    if (!schedule) {
      return (
        <div style={{ padding: 24 }}>
          Schedule not found.
          <button onClick={() => setView({ kind: "scope", section: "audits", packKey: activePackKey })}>
            Back to audits
          </button>
        </div>
      );
    }
    return (
      <AuditRunPage
        user={user}
        // globalActiveSite wins when set (header dropdown picked a specific
        // site); otherwise AuditRunPage falls back to the schedule's siteId.
        activeSite={globalActiveSite}
        entryView={{
          scheduleId:  schedule.id,
          siteId:      globalActiveSite?.id ?? schedule.siteId,
          auditTypeId: schedule.auditType,
          packKey:     activePackKey,
        }}
        onDone={() => setView({ kind: "scope", section: "audits", packKey: activePackKey })}
        onCancel={() => setView({ kind: "scope", section: "audits", packKey: activePackKey })}
      />
    );
  }

  if (view.kind === "protocol") {
    const protocol = getProtocolByReference(view.protocolRef);
    if (!protocol) {
      return <div style={{ padding: 24 }}>Protocol not found.</div>;
    }
    return (
      <ProtocolViewer
        user={user}
        protocol={protocol}
        onBack={() => setView({ kind: "library", packKey: activePackKey })}
      />
    );
  }

  const section = view.section ?? "overview";
  const siteIdFilter = siteFilter === "all" ? null : siteFilter;
  const setSection = (sec, extra = {}) => setView({ kind: "scope", section: sec, packKey: activePackKey, ...extra });

  /* Active tab for the tab-bar highlight: drill-in views still highlight the
     parent tab they came from. */
  const activeTab =
    section === "site"     ? "sites"
  : section === "document" ? "protocols"
  : section === "export"   ? "overview"
  : section;

  let body = null;
  if (section === "overview") {
    body = activePackKey === RADIOGRAPHY_PACK_KEY
      ? <IRMERPackDashboard user={user} allUsers={allUsers} siteFilter={siteIdFilter} onJumpTab={setSection} />
      : <DeconPackDashboard user={user} allUsers={allUsers} siteFilter={siteIdFilter} packKey={activePackKey} onJumpTab={setSection} />;
  } else if (section === "protocols") {
    body = <DocumentRegister user={user} packKey={activePackKey} onOpen={(documentId) => setSection("document", { documentId })} allUsers={allUsers} siteFilter={siteIdFilter} />;
  } else if (section === "sites") {
    body = <SiteList user={user} sites={sites} packKey={activePackKey} onOpen={(siteId) => setSection("site", { siteId })} />;
  } else if (section === "audits") {
    body = (
      <AuditsPage
        user={user}
        packKey={activePackKey}
        siteFilter={siteIdFilter}
        onStartAudit={(scheduleId) =>
          setView({ kind: "run_audit", scheduleId, packKey: activePackKey })}
      />
    );
  } else if (section === "evidence") {
    body = <EvidenceRegister user={user} packKey={activePackKey} onOpenDocument={(documentId) => setSection("document", { documentId })} siteFilter={siteIdFilter} />;
  } else if (section === "people") {
    body = <PeopleTab user={user} allUsers={allUsers} sites={sites} packKey={activePackKey} siteFilter={siteIdFilter} onOpenDocument={(documentId) => setSection("document", { documentId })} />;
  } else if (section === "history") {
    body = <HistoryTab user={user} packKey={activePackKey} allUsers={allUsers} sites={sites} />;
  } else if (section === "site" && view.siteId) {
    const site = getSite(user.tenantId, view.siteId);
    if (site) body = (
      <SiteProfile
        user={user}
        site={site}
        allUsers={allUsers}
        packKey={activePackKey}
        onBack={() => setSection("sites")}
        onOpenDocument={(documentId) => setSection("document", { documentId })}
      />
    );
  } else if (section === "document" && view.documentId) {
    body = (
      <DocumentDetail
        user={user}
        documentId={view.documentId}
        onBack={() => setSection("protocols")}
        allUsers={allUsers}
        sites={sites}
        onOpenDocument={(documentId) => setSection("document", { documentId })}
      />
    );
  } else if (section === "export") {
    body = (
      <ExportEvidencePack
        user={user}
        packKey={activePackKey}
        siteFilter={siteIdFilter}
        allUsers={allUsers}
      />
    );
  }

  // Site filter is only meaningful on tabs that aggregate by site.
  const showSiteFilter = ["overview", "protocols", "audits", "evidence", "people"].includes(section);

  return (
    <div className={styles.tabsLayout}>
      <PackHeader
        tenantId={user.tenantId}
        pack={pack}
        activePackKey={activePackKey}
        packCatalogueEntry={packCatalogueEntry}
        // Dropdown row click — Live packs jump to overview, anything else
        // (in_setup / awaiting_approval / not configured) jumps to the wizard
        // for that pack so the user picks up where they left off.
        onSwitch={(packKey, instance) => {
          if (instance?.status === PackStatus.live) {
            setView({ kind: "scope", section: "overview", packKey });
          } else {
            setView({ kind: "setup", packKey });
          }
        }}
        // "Open full catalogue" footer link in the dropdown.
        onGoToHub={() => setView({ kind: "hub" })}
        onExport={() => setSection("export")}
        onReset={handleReset}
      />
      <PackTabs active={activeTab} onChange={(id) => setSection(id)} />
      {showSiteFilter && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <SiteFilter sites={sites} value={siteFilter} onChange={setSiteFilter} />
        </div>
      )}
      {body ?? <div>Section not found.</div>}
    </div>
  );
};
