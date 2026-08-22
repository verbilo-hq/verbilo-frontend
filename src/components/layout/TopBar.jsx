import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";
import { useTenant } from "../../auth/TenantContext";
import { userRoleLabel } from "../../lib/sector";
import styles from "./TopBar.module.css";

export const TopBar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const sector = tenant?.sector ?? user?.tenant?.sector ?? "";
  const displayName = user?.displayName || user?.username || "";
  // VER-60: user.role is a User enum (employee / practice_manager /
  // company_admin / verbilo_super_admin / etc.) — render via
  // userRoleLabel which knows the per-sector vocabulary AND that
  // verbilo_* roles are sector-agnostic. clinicalSpecialty doesn't
  // apply to User rows (that's a StaffMember field).
  const labelForRole = userRoleLabel(user?.role, sector);

  return (
    <div className={styles.bar}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.actions}>
        <div className={styles.bell}>
          <I name="bell" size={18} />
        </div>
        {displayName && (
          <div className={styles.user}>
            <div className={styles.userText}>
              <div className={styles.userName}>{displayName}</div>
              {labelForRole && <div className={styles.userRole}>{labelForRole}</div>}
            </div>
            <Avatar name={displayName} size={40} />
          </div>
        )}
      </div>
    </div>
  );
};
