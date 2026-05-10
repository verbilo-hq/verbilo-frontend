import { pct } from "./shared.logic";

export const cpdProgressPct = (hours, required) => pct(hours ?? 0, required);

export const cpdStatusKey = (hoursPct) =>
  hoursPct >= 75 ? "success" : hoursPct >= 40 ? "warning" : "error";

export const cpdRemainingHours = (logged, required) =>
  Math.max(0, (required ?? 0) - (logged ?? 0));
