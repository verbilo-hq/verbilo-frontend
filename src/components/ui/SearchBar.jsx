import { I } from "../Icon";
import styles from "./SearchBar.module.css";

/**
 * Search input primitive.
 *
 * Controlled when the parent supplies `onChange` (value + handler); otherwise
 * uncontrolled so the field is still typeable rather than a dead read-only box
 * (a controlled `value` with no `onChange` silently rejects all keystrokes).
 * Pages that need the query should always pass `onChange` to drive filtering.
 */
export const SearchBar = ({ placeholder, value, onChange }) => {
  const controlled = onChange != null;
  return (
    <div className={styles.container} role="search">
      <div className={styles.bar}>
        <I name="search" size={18} />
        <input
          type="search"
          placeholder={placeholder}
          aria-label={placeholder || "Search"}
          className={styles.input}
          {...(controlled
            ? { value: value ?? "", onChange: (e) => onChange(e.target.value) }
            : { defaultValue: value ?? "" })}
        />
      </div>
    </div>
  );
};
