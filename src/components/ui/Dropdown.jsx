import { useState } from "react";
import { I } from "../Icon";
import { useClickOutside } from "../../hooks/useClickOutside";
import styles from "./Dropdown.module.css";

/**
 * Generic dropdown — replaces both StaffPage.CustomSelect and DashboardPage.IconSelect.
 *
 * Props:
 *  - value: string|null
 *  - onChange: (value) => void
 *  - options: Array<string | { value, label?, icon? }>
 *  - placeholder?: string
 *  - variant?: "pill" | "field" — pill is the rounded filter chip used on the staff
 *    directory; field is the rectangular form input used in modals.
 *  - showIcon?: boolean — render the option's icon next to its label.
 */
export const Dropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select…",
  variant = "field",
  showIcon = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = normalised.find((o) => o.value === value);

  const triggerClass =
    variant === "pill"
      ? value
        ? `${styles.pillTrigger} ${styles.pillTriggerActive}`
        : styles.pillTrigger
      : styles.fieldTrigger;

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen((o) => !o)}
      >
        {showIcon && selected?.icon && (
          <I name={selected.icon} size={16} color="var(--primary)" />
        )}
        <span className={styles.triggerLabel}>
          {selected?.label ?? placeholder}
        </span>
        <I name="chevrondown" size={13} color="var(--on-surface-variant)" />
      </button>
      {open && (
        <div className={styles.panel}>
          {variant === "pill" && (
            <div
              className={!value ? `${styles.option} ${styles.optionSelected}` : styles.option}
              onClick={() => { onChange(""); setOpen(false); }}
            >
              {placeholder}
            </div>
          )}
          {normalised.map((o) => (
            <div
              key={o.value}
              className={value === o.value ? `${styles.option} ${styles.optionSelected}` : styles.option}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {showIcon && o.icon && (
                <I
                  name={o.icon}
                  size={15}
                  color={value === o.value ? "var(--primary)" : "var(--on-surface-variant)"}
                />
              )}
              <span>{o.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
