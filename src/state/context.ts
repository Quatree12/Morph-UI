import { createContext, useContext } from "react";
import type { StudioContextValue } from "./types";

export const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio() doit être utilisé dans <StudioProvider>.");
  return ctx;
}
