import styles from "./Buttons.module.css";

/* Shared button primitives. All forward `disabled` and spread the remaining
 * props (aria-*, aria-busy, data-*, an optional className, …) onto the native
 * <button>, so submit-guards, loading/busy states and accessible names that
 * callers pass actually take effect. */

const make = (variant) =>
  function Btn({ children, onClick, style, type = "button", disabled = false, className, ...rest }) {
    return (
      <button
        {...rest}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${styles.btn} ${styles[variant]}${className ? ` ${className}` : ""}`}
        style={style}
      >
        {children}
      </button>
    );
  };

export const BtnPrimary   = make("primary");
export const BtnSecondary = make("secondary");
export const BtnOutline   = make("outline");
