import { I } from "../Icon";
import styles from "./SearchBar.module.css";

export const SearchBar = ({ placeholder }) => (
  <div className={styles.container}>
    <div className={styles.bar}>
      <I name="search" size={18} />
      <input placeholder={placeholder} className={styles.input} />
    </div>
  </div>
);
