import { createContext, useContext, useState, useCallback } from "react";
import { enabledIndustries, INDUSTRY_LS_KEY, getInitialIndustry } from "../services/industry";

const IndustryContext = createContext(null);

export function IndustryProvider({ children }) {
  const [industry, setIndustryState] = useState(getInitialIndustry);

  // Only ENABLED sectors are selectable — ids outside the deployment's
  // enabled list (see ENABLED_INDUSTRY_IDS) are ignored, so consumers can
  // never switch the app onto a sector this build doesn't offer.
  const setIndustry = useCallback((next) => {
    const resolved = typeof next === "string"
      ? enabledIndustries.find((i) => i.id === next)
      : enabledIndustries.find((i) => i.id === next?.id);
    if (!resolved) return;
    setIndustryState(resolved);
    try { localStorage.setItem(INDUSTRY_LS_KEY, resolved.id); } catch { /* noop */ }
  }, []);

  return (
    <IndustryContext.Provider value={{ industry, setIndustry, industries: enabledIndustries }}>
      {children}
    </IndustryContext.Provider>
  );
}

export function useIndustry() {
  const ctx = useContext(IndustryContext);
  if (!ctx) throw new Error("useIndustry must be used within IndustryProvider");
  return ctx;
}
