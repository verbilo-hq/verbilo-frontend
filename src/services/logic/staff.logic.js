import { parseRenewalDate } from "../../lib/parseRenewalDate";

const DAY_MS = 86400000;

/**
 * Returns the list of staff with a GDC renewal in the next 60 days
 * (or already overdue), suitable for rendering in alert banners.
 */
export function gdcAlertsFor(staffList, today = new Date()) {
  const t = new Date(today);
  t.setHours(0, 0, 0, 0);
  return (staffList ?? []).flatMap((s) => {
    const d = parseRenewalDate(s.gdcRenewal);
    if (!d) return [];
    const daysLeft = Math.round((d - t) / DAY_MS);
    if (daysLeft > 60) return [];
    return [{
      id: s.id,
      name: s.name,
      roleType: s.roleType,
      roleLabel: s.roleLabel,
      renewal: s.gdcRenewal,
      overdue: daysLeft < 0,
      daysLeft,
    }];
  });
}
