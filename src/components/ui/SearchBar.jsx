import { I } from "../Icon";
import styles from "./SearchBar.module.css";

export const SearchBar = ({ placeholder, value, onChange }) => (
  <div className={styles.container}>
    <div className={styles.bar}>
      <I name="search" size={18} />
      <input
        placeholder={placeholder}
        className={styles.input}
        value={value ?? ""}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
      />
    </div>
  </div>
);
