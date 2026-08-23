import { ThemedSelect } from "../ui/ThemedSelect";
import { visibleSites } from "../../services/scope";
import styles from "./ScopeSwitcher.module.css";

/**
 * In-scope site picker — mirrors how the org map lets you switch between the
 * areas/sites you're scoped to. Shows only the sites `visibleSites(user)`
 * returns (Group/Company → all six; Area Manager → their area; Practice/
 * team/self → just their own site). Renders nothing when the user has a
 * single site and no "All" option is offered.
 *
 * Props:
 *   user      — the logged-in user (carries scopeType/areaId/siteId)
 *   value     — currently selected site id (or "all")
 *   onChange  — (siteId) => void
 *   allowAll  — prepend an "All sites" option (for roll-up pages)
 *   label     — small leading label (default "Site")
 */
export function ScopeSwitcher({ user, value, onChange, allowAll = false, label = "Site" }) {
  const sites = visibleSites(user);
  if (sites.length <= 1 && !allowAll) return null;

  const options = [
    ...(allowAll ? [{ value: "all", label: "All sites" }] : []),
    ...sites.map((s) => ({ value: s.id, label: s.name })),
  ];

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.select}>
        <ThemedSelect
          value={value}
          onChange={onChange}
          options={options}
          ariaLabel="Switch site"
          variant="pill"
        />
      </div>
    </div>
  );
}
