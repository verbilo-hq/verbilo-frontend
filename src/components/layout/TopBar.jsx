import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";
import { useTenant } from "../../auth/TenantContext";
import { roleLabel } from "../../lib/sector";
import styles from "./TopBar.module.css";

export const TopBar = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const sector = tenant?.sector ?? user?.tenant?.sector ?? "";
  const displayName = user?.displayName || user?.username || "";
  const labelForRole = roleLabel(user?.role, sector, user?.clinicalSpecialty);

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
