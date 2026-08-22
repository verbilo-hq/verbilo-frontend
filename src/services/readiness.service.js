/**
 * Canonical contract for the three readiness-style metrics shown in Verbilo.
 *
 * These metrics intentionally answer different questions. Keeping their names,
 * definitions and calculations here prevents UI surfaces from presenting them
 * as interchangeable measures of overall CQC inspection readiness.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export const READINESS_METRICS = Object.freeze({
  auditScheduleHealth: Object.freeze({
    label: "Audit schedule health",
    shortLabel: "Schedule Health",
    definition: "Live-pack audit schedules that are not overdue, divided by all Live-pack audit schedules in the selected view.",
  }),
  cqcAuditCoverage: Object.freeze({
    label: "CQC audit coverage",
    shortLabel: "Current",
    definition: "Required CQC audit tools with an in-date submission, divided by all required CQC audit tools in the selected site or group view.",
  }),
  operationalReadiness: Object.freeze({
    label: "Operationally ready",
    shortLabel: "Operations",
    definition: "Practices with at least 85% mandatory training, no more than two open corrective actions, and no overdue equipment.",
  }),
});

export function calculateAuditScheduleHealth(schedules = [], now = Date.now()) {
  const weekFromNow = now + (7 * DAY_MS);
  const overdue = schedules.filter((schedule) => schedule.overdue);
  const dueSoon = schedules.filter((schedule) => {
    const dueAt = Date.parse(schedule.nextDueDate ?? "");
    return !schedule.overdue && Number.isFinite(dueAt) && dueAt <= weekFromNow;
  });
  const total = schedules.length;
  const onTrack = total - overdue.length;
  const pct = total === 0 ? 100 : Math.round((onTrack / total) * 100);

  return { total, onTrack, overdue, dueSoon, pct };
}

export function calculateCurrentCoverage(items = [], isItemCurrent) {
  const total = items.length;
  const current = items.reduce(
    (count, item) => count + (isItemCurrent(item) ? 1 : 0),
    0,
  );
  const overdue = total - current;
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);

  return { total, current, overdue, pct };
}

export function isOperationallyReady({
  trainingPct = 0,
  openActions = 0,
  equipmentOverdue = 0,
} = {}) {
  return trainingPct >= 85 && openActions <= 2 && equipmentOverdue === 0;
}
