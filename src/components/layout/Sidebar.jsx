import { I } from "../Icon";
import styles from "./Sidebar.module.css";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "clinical", label: "Clinical Resources", icon: "clinical" },
  { id: "staff", label: "Staff Directory", icon: "staff" },
  { id: "marketing", label: "Marketing Hub", icon: "marketing" },
  { id: "hr", label: "HR Hub", icon: "building" },
  { id: "training", label: "Training Hub", icon: "training" },
  { id: "admin", label: "Document Upload Centre", icon: "upload" },
];

export const Sidebar = ({ current, onNav }) => (
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
      {navItems.map((item) => {
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
      <a className={styles.footerLink}>
        <I name="settings" size={16} /> Settings
      </a>
      <a onClick={() => onNav("login")} className={styles.footerLink}>
        <I name="logout" size={16} /> Logout
      </a>
      <p className={styles.copyright}>
        © 2026 BrainPower Technologies Ltd. All rights reserved.
      </p>
    </div>
  </aside>
);
