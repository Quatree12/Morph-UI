import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { StudioContext } from "./context";
import { DEFAULT_STATE } from "./defaults";
import type { Creation, PatternId, StudioContextValue, StudioState } from "./types";
import { loadCreations, loadFavorites, loadReducedMotion, saveCreations, saveFavorites, saveReducedMotion } from "./storage";
import { SHAPE_MAP } from "../data/shapes";
import { MATERIALS } from "../data/materials";

export function StudioProvider({ children }: { children: ReactNode }) {
  /* ---------------------------------------------------- État des réglages */
  const [state, setState] = useState<StudioState>(DEFAULT_STATE);
  const [favorites, setFavorites] = useState<PatternId[]>(() => loadFavorites());
  const [creations, setCreations] = useState<Creation[]>(() => loadCreations());
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => loadReducedMotion());

  const set = useCallback(
    <K extends keyof StudioState>(key: K, value: StudioState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const patch = useCallback((partial: Partial<StudioState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => setState({ ...DEFAULT_STATE }), []);

  /* --------------------------------------------------------- Favoris */
  const toggleFavorite = useCallback((id: PatternId) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: PatternId) => favorites.includes(id), [favorites]);

  /* -------------------------------------------------------- Créations */
  const saveCreation = useCallback(
    (name: string, snapshot?: StudioState) => {
      const entry: Creation = {
        id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim() || "Création sans nom",
        state: { ...(snapshot ?? state) },
        createdAt: Date.now(),
      };
      setCreations((prev) => {
        const next = [entry, ...prev];
        saveCreations(next);
        return next;
      });
    },
    [state]
  );

  const deleteCreation = useCallback((id: string) => {
    setCreations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCreations(next);
      return next;
    });
  }, []);

  const duplicateCreation = useCallback((id: string) => {
    setCreations((prev) => {
      const source = prev.find((c) => c.id === id);
      if (!source) return prev;
      const copy: Creation = {
        ...source,
        id: `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        name: `${source.name} (copie)`,
        createdAt: Date.now(),
      };
      const next = [copy, ...prev];
      saveCreations(next);
      return next;
    });
  }, []);

  const loadCreation = useCallback((id: string) => {
    setCreations((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) setState({ ...found.state });
      return prev;
    });
  }, []);

  /* -------------------------------------------------- Préférence motion */
  const setReducedMotion = useCallback((v: boolean) => {
    setReducedMotionState(v);
    saveReducedMotion(v);
  }, []);

  /* -------------------------------------------------------------------
     Application des variables dérivées sur <html>.
     C'est LE point qui garantit la fidélité réglage → rendu : chaque champ
     de StudioState devient une variable CSS consommée par les matériaux,
     les formes et les patterns.
     ------------------------------------------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", state.color);
    root.style.setProperty("--blur", `${state.blur}px`);
    root.style.setProperty("--radius", `${state.radius}`);
    root.style.setProperty("--shadow", state.shadow.toFixed(3));
    root.style.setProperty("--glow", state.glow.toFixed(3));
    root.style.setProperty("--alpha", state.transparency.toFixed(3));
    root.style.setProperty("--bounce", state.spring.toFixed(3));
    root.style.setProperty("--size", state.size.toFixed(3));
    // La vitesse se traduit en multiplicateur de durée.
    root.style.setProperty("--speed-mul", (1 / state.speed).toFixed(3));
  }, [
    state.color,
    state.blur,
    state.radius,
    state.shadow,
    state.glow,
    state.transparency,
    state.spring,
    state.size,
    state.speed,
  ]);

  // Le réglage explicite (Settings) force la préférence système.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.reducedMotion = reducedMotion ? "true" : "false";
    root.classList.toggle("force-reduced-motion", reducedMotion);
  }, [reducedMotion]);

  const value = useMemo<StudioContextValue>(
    () => ({
      state,
      set,
      patch,
      reset,
      favorites,
      toggleFavorite,
      isFavorite,
      creations,
      saveCreation,
      deleteCreation,
      duplicateCreation,
      loadCreation,
      reducedMotion,
      setReducedMotion,
    }),
    [
      state,
      set,
      patch,
      reset,
      favorites,
      toggleFavorite,
      isFavorite,
      creations,
      saveCreation,
      deleteCreation,
      duplicateCreation,
      loadCreation,
      reducedMotion,
      setReducedMotion,
    ]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

/* ------------------------------------------------------------------------
   Sélecteurs dérivés — utilisés par le Playground et l'export de code.
   ------------------------------------------------------------------------ */

/** Rayon effectif en px, selon la forme choisie et le réglage Border Radius. */
export function effectiveRadius(state: StudioState): number {
  if (state.shape === "pill") return 999;
  if (state.shape === "sharp") return 0;
  return Math.round(state.radius * SHAPE_MAP[state.shape].radiusScale);
}

/** Classe de matériau à appliquer à l'objet principal. */
export function materialClass(state: StudioState): string {
  return `m m--${state.material}`;
}

/** Le matériau a-t-il une définition connue ? (garde-fou de cohérence) */
export function isKnownMaterial(id: string): boolean {
  return MATERIALS.some((m) => m.id === id);
}
