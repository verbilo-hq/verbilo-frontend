import { pct } from "./shared.logic";

export const udaPaceTarget = (contracted, monthsElapsed, totalMonths) =>
  totalMonths > 0 ? Math.round((contracted / totalMonths) * monthsElapsed) : 0;

export const udaOnTrack = (delivered, target) =>
  delivered >= target * 0.95;

export const udaCompletePct = (delivered, contracted) => pct(delivered, contracted);
