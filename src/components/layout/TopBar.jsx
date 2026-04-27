import { I } from "../Icon";
import { Avatar } from "../ui/Avatar";
import styles from "./TopBar.module.css";

export const TopBar = ({ title, subtitle }) => (
  <div className={styles.bar}>
    <div>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
    <div className={styles.actions}>
      <div className={styles.bell}>
        <I name="bell" size={18} />
      </div>
      <div className={styles.user}>
        <div className={styles.userText}>
          <div className={styles.userName}>Dr. Alexander Chen</div>
          <div className={styles.userRole}>Lead Dentist</div>
        </div>
        <Avatar name="Alexander Chen" size={40} />
      </div>
    </div>
  </div>
);
