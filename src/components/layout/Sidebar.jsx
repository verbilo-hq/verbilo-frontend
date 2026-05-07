import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import styles from "./Sidebar.module.css";

const navItems = [
  { id: "dashboard", label: "Dashboard",            icon: "dashboard"                    },
  { id: "manager",   label: "Manager Hub",          icon: "layers",   roles: ["manager"] },
  { id: "clinical",  label: "Clinical Resources",   icon: "clinical"                     },
  { id: "staff",     label: "Staff Directory",      icon: "staff"                        },
  { id: "marketing", label: "Marketing Hub",        icon: "marketing"                    },
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

export const Sidebar = ({ current, onNav, currentUser }) => (
  <aside className={styles.sidebar}>
    <div className={styles.brand}>
      <div className={styles.brandRow}>
        <div className={styles.logo}>
          <I name="tooth" size={20} />
        </div>
        <div>
          <div className={styles.brandTitle}>Inspire Dental Group</div>
          <div className={styles.brandSubtitle}>Clinical Sanctuary</div>
        </div>
      </div>
    </div>

    <nav className={styles.nav}>
      {navItems.filter(item => !item.roles || item.roles.includes(currentUser?.role)).map((item) => {
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
      {currentUser && (
        <div className={styles.currentUser}>
          <Avatar name={currentUser.displayName} size={32} />
          <div className={styles.currentUserInfo}>
            <span className={styles.currentUserName}>{currentUser.displayName}</span>
            <span className={styles.currentUserRole}>
              {roleLabel[currentUser.role] || currentUser.role}
            </span>
          </div>
        </div>
      )}

<a onClick={() => onNav("login")} className={styles.footerLink}>
        <I name="logout" size={16} /> Logout
      </a>
      <p className={styles.copyright}>
        © 2026 BrainPower Technologies Ltd. All rights reserved.
      </p>
    </div>
  </aside>
);
