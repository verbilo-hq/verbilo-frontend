import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const isVisible = (element) => {
  if (!element || element.hidden) return false;
  // offsetParent is null for elements with display:none or detached subtrees.
  if (element.offsetParent === null && element.tagName !== "BODY") return false;
  // Closed <details> or aria-hidden subtrees should be skipped.
  if (element.getAttribute("aria-hidden") === "true") return false;
  return true;
};

/**
 * Modal accessibility helper hook.
 *
 * Provides four guarantees per WCAG 2.1.2 / 2.4.3:
 *   1. Escape closes the modal (no keyboard trap).
 *   2. Tab / Shift+Tab cycle within the modal (focus trap) when the caller
 *      attaches the returned ref to the modal container.
 *   3. `body` scroll is locked while a modal is open so the page underneath
 *      doesn't drift.
 *   4. On unmount, focus returns to the element that opened the modal.
 *
 * Skips Escape if `event.defaultPrevented` is already set — this lets nested
 * widgets (e.g. an open ThemedSelect menu) handle their own Escape first
 * without accidentally closing the outer modal.
 *
 * @param {(): void} onClose - called when the user presses Escape.
 * @param {{ enabled?: boolean }} [options] - opt-out hatch (defaults to true).
 * @returns {{ current: HTMLElement | null }} ref to attach to the modal container.
 */
export function useModalA11y(onClose, { enabled = true } = {}) {
  const containerRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!enabled) return undefined;

    previouslyFocusedRef.current =
      typeof document !== "undefined" ? document.activeElement : null;

    const previousOverflow =
      typeof document !== "undefined" ? document.body.style.overflow : "";
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    const handleKey = (event) => {
      // Escape — but only if nothing inside already claimed the keydown
      // (e.g. an open <ThemedSelect> menu calls preventDefault on its
      // internal Escape so its own close handler wins).
      if (event.key === "Escape") {
        if (event.defaultPrevented) return;
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(
        container.querySelectorAll(FOCUSABLE_SELECTOR),
      ).filter(isVisible);
      if (focusables.length === 0) {
        // No focusable children — at minimum keep focus on the container
        // itself so the page behind isn't reachable via Tab.
        event.preventDefault();
        if (typeof container.focus === "function") container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !container.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);

    // Move initial focus into the modal so a Tab press immediately cycles
    // within instead of escaping to the page underneath. Defer one tick so
    // React has finished the first paint.
    const focusTimer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;
      if (!container.hasAttribute("role")) container.setAttribute("role", "dialog");
      if (!container.hasAttribute("aria-modal")) container.setAttribute("aria-modal", "true");
      if (container.contains(document.activeElement)) return;
      const first = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).find(isVisible);
      if (first) {
        try {
          first.focus({ preventScroll: true });
        } catch {
          /* element may have been removed — fall through */
        }
      }
    }, 0);

    return () => {
      window.removeEventListener("keydown", handleKey);
      clearTimeout(focusTimer);
      if (typeof document !== "undefined") {
        document.body.style.overflow = previousOverflow;
      }
      const target = previouslyFocusedRef.current;
      if (target && typeof target.focus === "function") {
        queueMicrotask(() => {
          try {
            target.focus({ preventScroll: true });
          } catch {
            /* element may have been removed from the DOM — fall through */
          }
        });
      }
    };
  }, [enabled]);

  return containerRef;
}
