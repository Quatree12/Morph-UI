import type { Creation, PatternId } from "./types";

/* ==========================================================================
   Persistance locale — localStorage uniquement.
   Aucune synchronisation distante n'est prétendue : il n'y a ni compte ni
   backend dans ce projet. Les données restent donc sur cet appareil.
   ========================================================================== */

const KEY_FAV = "morphui.favorites.v1";
const KEY_CRE = "morphui.creations.v1";
const KEY_RM = "morphui.reducedMotion.v1";

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // Stockage indisponible (Safari navigation privée) ou JSON corrompu.
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** true si localStorage est réellement utilisable. Affiché dans Settings. */
export function storageAvailable(): boolean {
  try {
    const probe = "__morphui_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export const loadFavorites = (): PatternId[] => safeRead<PatternId[]>(KEY_FAV, []);
export const saveFavorites = (v: PatternId[]) => safeWrite(KEY_FAV, v);

export const loadCreations = (): Creation[] => safeRead<Creation[]>(KEY_CRE, []);
export const saveCreations = (v: Creation[]) => safeWrite(KEY_CRE, v);

export const loadReducedMotion = (): boolean => safeRead<boolean>(KEY_RM, false);
export const saveReducedMotion = (v: boolean) => safeWrite(KEY_RM, v);

export function clearAll(): void {
  try {
    window.localStorage.removeItem(KEY_FAV);
    window.localStorage.removeItem(KEY_CRE);
  } catch {
    /* ignore */
  }
}
