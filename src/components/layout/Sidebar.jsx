import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../auth/AuthContext";
import { useTenant } from "../../auth/TenantContext";
import styles from "./Sidebar.module.css";

const navItems = [
  { id: "dashboard", label: "Dashboard",            icon: "dashboard"                    },
  { id: "manager",   label: "Manager Hub",          icon: "layers",   roles: ["manager"] },
  { id: "clinical",  label: "Clinical Resources",   icon: "clinical"                     },
  { id: "staff",     label: "Staff Directory",      icon: "staff"                        },
  { id: "marketing", label: "Brand Hub",             icon: "marketing"                    },
  { id: "hr",        label: "HR Hub",               icon: "building"                     },
  { id: "training",  label: "Training Hub",         icon: "training"                     },
  { id: "cpd",       label: "CPD Hub",              icon: "award"                        },
  { id: "cqc",       label: "CQC Compliance Hub",   icon: "checksquare"                  },
  { id: "lab",       label: "Lab Work Hub",         icon: "clipboard"                    },
];

const roleLabel = {
  manager:     "Practice Manager",
  dentist:     "Dentist",
  nurse:       "Dental Nurse",
  hygienist:   "Hygienist / Therapist",
  receptionist:"Receptionist",
};

export const Sidebar = ({ current, onNav }) => {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();

  // Tenant config from public lookup overrides anything in /users/me — backend
  // is the source of truth for which modules are enabled.
  const tenantName  = tenant?.name ?? user?.tenant?.name ?? "Verbilo";
  const sectorLabel = tenant?.sector ?? user?.tenant?.sector ?? "";
  const enabledModules = tenant?.enabledModules ?? user?.tenant?.enabledModules ?? null;

  return (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>
      <div className={styles.brandRow}>
        <div className={styles.logo}>
          <I name="tooth" size={20} />
        </div>
        <div>
          <div className={styles.brandTitle}>{tenantName}</div>
          {sectorLabel && (
            <div className={styles.brandSubtitle}>
              {sectorLabel.charAt(0).toUpperCase() + sectorLabel.slice(1)}
            </div>
          )}
        </div>
      </div>
    </div>

    <nav className={styles.nav}>
      {navItems
        .filter((item) => {
          if (!enabledModules || enabledModules.length === 0) return true;
          return enabledModules.includes(item.id);
        })
        .filter((item) => !item.roles || item.roles.includes(user?.role)).map((item) => {
        const active = current === item.id;
        return (
          <a
            key={item.id}
            onClick={() => onNav(item.id)}
            className={active ? `${styles.link} ${styles.linkActive}` : styles.link}
          >
            <I name={item.icon} size={18} />
            {item.label}
          </a>
        );
      })}
    </nav>

    <div className={styles.footer}>
      {/* Logged-in user */}
      {user && (
        <div className={styles.currentUser}>
          <Avatar name={user.displayName} size={32} />
          <div className={styles.currentUserInfo}>
            <span className={styles.currentUserName}>{user.displayName}</span>
            <span className={styles.currentUserRole}>
              {roleLabel[user.role] || user.role}
            </span>
          </div>
        </div>
      )}

      <div className={styles.storageWrap}>
        <div className={styles.storageHeader}>
          <I name="cloud" size={12} color="var(--on-surface-variant)" />
          <span className={styles.storageLabel}>Storage</span>
          <span className={styles.storagePercent}>21%</span>
        </div>
        <div className={styles.storageTrack}>
          <div className={styles.storageBar} />
        </div>
        <div className={styles.storageInfo}>213 GB of 1 TB used</div>
      </div>

      <a onClick={logout} className={styles.footerLink}>
        <I name="logout" size={16} /> Logout
      </a>
      <p className={styles.copyright}>
        © 2026 BrainPower Technologies Ltd. All rights reserved.
      </p>
    </div>
  </aside>
  );
};
