/* ==========================================================================
   MORPH/UI — Modèle d'état partagé
   Un seul objet StudioState pilote le Playground, le code exporté et les
   créations sauvegardées.
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

export type MaterialId =
  | "frosted-glass"
  | "clear-glass"
  | "liquid-chrome"
  | "soft-matte"
  | "neon-glow"
  | "iridescent-crystal"
  | "brushed-metal"
  | "translucent-gel"
  | "solid-surface";

export type ShapeId = "pill" | "rounded" | "circle" | "squircle" | "sharp";

export type Complexity = "simple" | "intermédiaire" | "avancé";

/** Champs de réglages avancés. Sert à désactiver proprement un contrôle
 *  quand un pattern n'en a pas besoin (explication au lieu d'un faux réglage). */
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
  /** Couleur d'accent, en hexadécimal (issue d'une pastille ou du picker). */
  color: string;
  /** Nom du preset couleur actif, ou "custom" si l'utilisateur a pipeté. */
  colorPreset: string;

  /* --- Contrôles avancés --- */
  blur: number;         // 0 → 40  (px)
  speed: number;        // 0.4 → 2.2 (multiplicateur)
  radius: number;       // 0 → 48  (px)
  shadow: number;       // 0 → 1
  glow: number;         // 0 → 1
  transparency: number; // 0.15 → 1  (1 = opaque)
  spring: number;       // 0 → 1  (rebond des animations)
  size: number;         // 0.6 → 1.6 (échelle du composant)
}

/** Une création sauvegardée dans Favorites / Creations. */
export interface Creation {
  id: string;
  name: string;
  state: StudioState;
  createdAt: number;
}

/** Données d'un import JSON : tout est optionnel, on ne remplace que le fourni. */
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

  /* Favoris */
  favorites: PatternId[];
  toggleFavorite: (id: PatternId) => void;
  isFavorite: (id: PatternId) => boolean;

  /* Créations */
  creations: Creation[];
  saveCreation: (name: string, state?: StudioState) => void;
  deleteCreation: (id: string) => void;
  duplicateCreation: (id: string) => void;
  loadCreation: (id: string) => void;

  /* Import : remplace tout ou partie du jeu de données */
  replaceAll: (data: DatasetPayload) => void;

  /* Réglages globaux de l'app */
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
}
