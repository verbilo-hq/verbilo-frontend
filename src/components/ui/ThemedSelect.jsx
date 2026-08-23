import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ThemedSelect.module.css";

const normalizeOption = (option) =>
  typeof option === "string" ? { value: option, label: option } : option;

const menuPositionFor = (button) => {
  const rect = button.getBoundingClientRect();
  const gap = 6;
  const viewportPad = 8;
  const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
  const spaceAbove = rect.top - viewportPad;
  const maxPreferredHeight = 280;
  const opensUp = spaceBelow < 180 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(
    160,
    Math.min(maxPreferredHeight, opensUp ? spaceAbove - gap : spaceBelow - gap),
  );

  return {
    left: Math.max(viewportPad, rect.left),
    top: opensUp
      ? Math.max(viewportPad, rect.top - maxHeight - gap)
      : Math.min(window.innerHeight - viewportPad, rect.bottom + gap),
    width: rect.width,
    maxHeight,
  };
};

export const ThemedSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  invalid = false,
  variant = "form",
  ariaLabel,
}) => {
  const id = useId();
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const normalizedOptions = useMemo(() => options.map(normalizeOption), [options]);
  const selected = normalizedOptions.find((option) => option.value === value);
  const hasSelection = selected && selected.value !== "";

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    setMenuStyle(menuPositionFor(buttonRef.current));
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();

    const onDocMouseDown = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onWindowChange = () => updateMenuPosition();

    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("resize", onWindowChange);
      window.removeEventListener("scroll", onWindowChange, true);
    };
  }, [open]);

  const chooseOption = (option) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleButtonKeyDown = (event) => {
    if (disabled) return;
    if (["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className={styles.selectRoot}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.selectButton} ${
          variant === "pill" ? styles.selectButtonPill : ""
        } ${open ? styles.selectButtonOpen : ""} ${
          invalid ? styles.selectButtonInvalid : ""
        } ${disabled ? styles.selectButtonDisabled : ""}`}
        onClick={() => {
          if (!disabled) setOpen((value) => !value);
        }}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-label={ariaLabel}
      >
        <span
          className={`${styles.selectButtonText} ${
            hasSelection ? "" : styles.selectPlaceholder
          }`}
        >
          {selected?.label || placeholder}
        </span>
      </button>

      {open &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            id={`${id}-listbox`}
            className={styles.selectMenu}
            role="listbox"
            style={{
              left: menuStyle.left,
              top: menuStyle.top,
              width: menuStyle.width,
              maxHeight: menuStyle.maxHeight,
            }}
          >
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                className={`${styles.selectOption} ${
                  option.value === value ? styles.selectOptionActive : ""
                } ${option.disabled ? styles.selectOptionDisabled : ""}`}
                onClick={() => chooseOption(option)}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};
