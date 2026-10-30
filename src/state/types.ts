/* ==========================================================================
   MORPH/UI — Modèle d'état partagé
   ========================================================================== */

export type PatternId =
  | "liquid-glass"
  | "gooey"
  | "expandable-button"
  | "floating-dock"
  | "experimental-nav"
  | "morphing-shapes"
  | "radial-menu"
  | "kinetic"
  | "lens"
  | "collapsible"
  | "expressive-motion"
  | "contextual-toolbar"
  | "sheet-drag"
  | "parallax-layers"
  | "swipe-stack"
  | "ripple-surface";

/** 15 matériaux : les 9 d'origine + 6 nouveaux. */
export type MaterialId =
  | "frosted-glass"
  | "clear-glass"
  | "liquid-chrome"
  | "soft-matte"
  | "neon-glow"
  | "iridescent-crystal"
  | "brushed-metal"
  | "translucent-gel"
  | "solid-surface"
  | "holographic-foil"
  | "frosted-acrylic"
  | "carbon-fiber"
  | "ceramic-glaze"
  | "sandblasted-stone"
  | "liquid-mercury";

/** 9 formes : les 5 d'origine + 4 nouvelles. */
export type ShapeId =
  | "pill"
  | "rounded"
  | "circle"
  | "squircle"
  | "sharp"
  | "blob"
  | "diamond"
  | "arch"
  | "notched";

/** Ancrage du panneau : le contrôle Anchor n'agit que sur Sheet Drag. */
export type AnchorId = "bottom" | "top";

export type Complexity = "simple" | "intermédiaire" | "avancé";

/** Champs de réglages avancés. */
export type ControlKey =
  | "blur"
  | "speed"
  | "radius"
  | "shadow"
  | "glow"
  | "transparency"
  | "spring"
  | "size";

export interface StudioState {
  pattern: PatternId;
  material: MaterialId;
  shape: ShapeId;
  color: string;
  colorPreset: string;
  anchor: AnchorId;

  blur: number;
  speed: number;
  radius: number;
  shadow: number;
  glow: number;
  transparency: number;
  spring: number;
  size: number;
}

export interface Creation {
  id: string;
  name: string;
  state: StudioState;
  createdAt: number;
}

export interface DatasetPayload {
  favorites?: PatternId[];
  creations?: Creation[];
  currentState?: StudioState;
}

export interface StudioContextValue {
  state: StudioState;
  set: <K extends keyof StudioState>(key: K, value: StudioState[K]) => void;
  patch: (partial: Partial<StudioState>) => void;
  reset: () => void;

  favorites: PatternId[];
  toggleFavorite: (id: PatternId) => void;
  isFavorite: (id: PatternId) => boolean;

  creations: Creation[];
  saveCreation: (name: string, state?: StudioState) => void;
  deleteCreation: (id: string) => void;
  duplicateCreation: (id: string) => void;
  loadCreation: (id: string) => void;

  replaceAll: (data: DatasetPayload) => void;

  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}
