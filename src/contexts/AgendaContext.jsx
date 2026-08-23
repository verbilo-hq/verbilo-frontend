/**
 * AgendaContext — single source of truth for the Today's Compliance
 * Agenda + Operational Logs shared state.
 *
 * Why this is a context (not page-local state):
 *   • The Today's Agenda sliding drawer (mounted in AppHeader) and the
 *     Operational Logs page (sidebar tab) both write and read the same
 *     "did I log this task today?" state. If a clinician signs off
 *     "Clinical Vaccine Fridge Temp" from the drawer at 09:12, the
 *     Operational Logs page must reflect that completion the next time
 *     they navigate to it — and vice versa.
 *
 * Shape:
 *   • drawerOpen / toggleDrawer / closeDrawer  — drawer UI state
 *   • completedToday  { [tplId]: { at, operator } }
 *   • activeAlerts    { [tplId]: { breach, signal } }
 *   • ledger          [{ id, time, template, operator, status, statusLabel }]
 *   • markCompleted(templateId, payload)
 *       → derives breach state from the payload, prepends ledger row,
 *         flips completedToday, sets activeAlerts, fires toast.
 *   • toast / setToast — global toast surface (rendered at provider root)
 *
 * Mock-state caveats for the local-dev MVP:
 *   • All state is in memory; resets on full reload.
 *   • Autoclave 1 is pre-seeded as already-completed so the drawer/page
 *     starts with one item visibly done, two overdue, one remaining.
 *   • SEED_LEDGER hardcodes two historical rows so the Operational Logs
 *     Recent Activity table doesn't read as empty on first paint. */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLogbookTemplate } from "../services/logbooks/logbookTemplates";
import { personName } from "../services/people";
import { siteName, resolveSiteId } from "../services/sites";

/* Friendly display titles per template — also used by the Operational
 * Logs card grid + the agenda drawer rows. Kept here so both surfaces
 * resolve names identically. */
export const DISPLAY_TITLES = {
  autoclave_daily:             "Autoclave 1 Parameter Check",
  foil_test_daily:             "Foil Test",
  vaccine_fridge_daily:        "Clinical Vaccine Fridge Temp",
  medication_fridge_daily:     "Medication / Material Fridge",
  decon_climate_daily:         "Decontamination Room Climate",
  suction_line_daily:          "Suction Line Flush",
  compressor_scavenging_daily: "Compressor & Scavenging",
  surgery_setup_daily:         "Surgery Setup",
  emergency_kit_seal_daily:    "Emergency Drug Kit Seal",
  waterline_dipslides_weekly:  "Waterline Dipslide Testing",
  protein_residue_weekly:      "Protein Residue Test",
  soil_test_weekly:            "Soil Test",
};

/* Seed two historical ledger rows so the table reads as a real
 * workflow on first paint. The autoclave pre-seed below adds a third
 * row dynamically on provider mount. */
/* Extended ledger row schema (Recent Activity Ledger):
 *   { id, time, templateId, template, operator, siteName, status,
 *     statusLabel, values, signature, at }
 * The new fields (templateId, siteName, values, signature, at) power
 * the "View Entry" archive modal + the smart filter bar's site +
 * date range dropdowns. */
const SEED_LEDGER = [
  {
    id:          "seed-1",
    time:        "14:32",
    templateId:  "vaccine_fridge_daily",
    template:    "Clinical Vaccine Fridge Temp",
    operator:    personName("clinical-lead"),
    siteName:    siteName(resolveSiteId("Brighton")),
    status:      "completed",
    statusLabel: "Completed",
    values:      {},          // empty → View Entry falls back to mock values
    signature:   personName("clinical-lead"),
    at:          new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),  // ~4h ago today
  },
  {
    id:          "seed-2",
    time:        "09:15",
    templateId:  "decon_climate_daily",
    template:    "Decontamination Room Climate",
    operator:    personName("lead-nurse"),
    siteName:    siteName(resolveSiteId("Hove")),
    status:      "completed",
    statusLabel: "Completed",
    values:      {},
    signature:   personName("lead-nurse"),
    at:          new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),  // ~9h ago today
  },
];

/* Pre-seed: Autoclave 1 ships as already-completed today so the
 * agenda drawer opens with a realistic mix of statuses. */
const PRE_COMPLETED = {
  autoclave_daily: {
    at:       new Date().toISOString(),
    operator: personName("associate-dentist"),
  },
};
const PRE_LEDGER_ROW = {
  id:          "seed-autoclave",
  time:        "07:45",
  templateId:  "autoclave_daily",
  template:    DISPLAY_TITLES.autoclave_daily,
  operator:    personName("associate-dentist"),
  siteName:    siteName(resolveSiteId("Brighton")),
  status:      "completed",
  statusLabel: "Completed",
  values:      {},
  signature:   personName("associate-dentist"),
  at:          new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
};

const AgendaContext = createContext(null);

export function AgendaProvider({ children }) {
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [completedToday, setCompletedToday] = useState(PRE_COMPLETED);
  const [activeAlerts,   setActiveAlerts]   = useState({});
  const [ledger,         setLedger]         = useState([PRE_LEDGER_ROW, ...SEED_LEDGER]);
  const [toast,          setToast]          = useState(null);

  /* Auto-dismiss the toast after 2.6s — matches the prior local
   * implementation in OperationalLogsPage. */
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleDrawer = () => setDrawerOpen((v) => !v);
  const closeDrawer  = () => setDrawerOpen(false);
  const openDrawer   = () => setDrawerOpen(true);

  /* Shared submission handler — called by both the Operational Logs
   * card grid AND the agenda drawer's "Start Task" modal. Derives the
   * breach state, prepends the ledger row (with full submission
   * metadata so the View Entry archive modal can replay it later),
   * flips completedToday, fires the toast.
   *
   * Optional `siteName` lets callers stamp which practice the entry
   * belongs to — the Operational Logs page passes the active site so
   * the smart filter bar's Site Location dropdown can scope the
   * ledger. */
  const markCompleted = (templateId, payload, siteName = null) => {
    const tpl = getLogbookTemplate(templateId);

    // Scan numeric fields for any out-of-bounds reading — surfaces as
    // an Active Equipment Alert + Alert ledger pill.
    let breach = false;
    let signal = "";
    for (const q of tpl?.questions ?? []) {
      if (q.input_type !== "numeric_threshold") continue;
      const v = Number(payload.values[q.id]);
      if (Number.isNaN(v)) continue;
      if (v < q.min || v > q.max) {
        breach = true;
        signal = `${q.text} → ${v}${q.unit ? ' ' + q.unit : ''}`;
        break;
      }
    }

    const operator = (payload.signature || "").trim() || "Unknown operator";
    const now      = new Date();
    const hh       = String(now.getHours()).padStart(2, "0");
    const mm       = String(now.getMinutes()).padStart(2, "0");

    setCompletedToday((prev) => ({
      ...prev,
      [templateId]: { at: now.toISOString(), operator },
    }));
    setActiveAlerts((prev) => ({
      ...prev,
      [templateId]: { breach, signal },
    }));
    setLedger((prev) => [
      {
        id:          `local-${Date.now()}`,
        time:        `${hh}:${mm}`,
        templateId,                          // for View Entry template lookup
        template:    DISPLAY_TITLES[templateId] ?? tpl?.title ?? templateId,
        operator,
        siteName:    siteName ?? "—",        // for the Site Location filter
        status:      breach ? "alert" : "completed",
        statusLabel: breach ? "Alert" : "Completed",
        values:      payload.values ?? {},   // for View Entry pre-populate
        signature:   payload.signature ?? operator,
        at:          now.toISOString(),      // for the Date Range filter
      },
      ...prev,
    ].slice(0, 12));

    // Truthful microcopy: this ledger is client-side session state, not a
    // tamper-proof store — don't claim "immutable"/"securely saved". The
    // durable, locked audit trail lives on the backend audit_session tables.
    setToast("Log saved to the activity ledger.");
  };

  const value = useMemo(() => ({
    drawerOpen, toggleDrawer, closeDrawer, openDrawer,
    completedToday, activeAlerts, ledger,
    markCompleted,
    toast, setToast,
  }), [drawerOpen, completedToday, activeAlerts, ledger, toast]);

  return (
    <AgendaContext.Provider value={value}>
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const ctx = useContext(AgendaContext);
  if (!ctx) {
    throw new Error("useAgenda must be used within an AgendaProvider");
  }
  return ctx;
}
