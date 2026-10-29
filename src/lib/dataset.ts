import type { Creation, PatternId, StudioState } from "../state/types";
import { DEFAULT_STATE } from "../state/defaults";
import { PATTERNS } from "../data/patterns";
import { MATERIALS } from "../data/materials";
import { SHAPES } from "../data/shapes";

/* ==========================================================================
   MORPH/UI — Import / export du jeu de données.
   Format JSON versionné. Aucune donnée ne quitte l'appareil : le fichier est
   produit localement et relu localement.
   ========================================================================== */

export interface Dataset {
  app: "MORPH/UI";
  version: 1;
  exportedAt: string;
  favorites: PatternId[];
  creations: Creation[];
  currentState: StudioState;
}

export function buildDataset(
  favorites: PatternId[],
  creations: Creation[],
  currentState: StudioState
): Dataset {
  return {
    app: "MORPH/UI",
    version: 1,
    exportedAt: new Date().toISOString(),
    favorites,
    creations,
    currentState,
  };
}

/** Déclenche le téléchargement du fichier JSON. */
export function downloadDataset(dataset: Dataset): void {
  const json = JSON.stringify(dataset, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `morphui-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // On libère l'URL au tour suivant : Safari a besoin d'un délai.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Validation stricte : on refuse un fichier qui n'est pas de nous. */
export function parseDataset(raw: string):
  | { ok: true; data: Dataset }
  | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "Ce fichier n'est pas un JSON valide." };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "Contenu inattendu : un objet était attendu." };
  }

  const obj = parsed as Record<string, unknown>;
  if (obj.app !== "MORPH/UI") {
    return { ok: false, error: "Ce fichier ne vient pas de MORPH/UI." };
  }
  if (obj.version !== 1) {
    return { ok: false, error: `Version ${String(obj.version)} non supportée.` };
  }

  const validPatterns = new Set(PATTERNS.map((p) => p.id));
  const validMaterials = new Set(MATERIALS.map((m) => m.id));
  const validShapes = new Set(SHAPES.map((s) => s.id));

  // Favoris : on ignore silencieusement les identifiants inconnus.
  const favorites = Array.isArray(obj.favorites)
    ? (obj.favorites.filter(
        (f): f is PatternId => typeof f === "string" && validPatterns.has(f as PatternId)
      ) as PatternId[])
    : [];

  // Créations : on ne garde que les entrées structurellement valides.
  const creations: Creation[] = Array.isArray(obj.creations)
    ? (obj.creations
        .filter((c): c is Record<string, unknown> => typeof c === "object" && c !== null)
        .filter((c) => typeof c.id === "string" && typeof c.name === "string" && typeof c.state === "object")
        .map((c) => {
          const s = c.state as Record<string, unknown>;
          return {
            id: String(c.id),
            name: String(c.name),
            createdAt: typeof c.createdAt === "number" ? c.createdAt : Date.now(),
            state: {
              ...DEFAULT_STATE,
              ...s,
              pattern: validPatterns.has(s.pattern as PatternId)
                ? (s.pattern as PatternId)
                : DEFAULT_STATE.pattern,
              material: validMaterials.has(s.material as never)
                ? (s.material as StudioState["material"])
                : DEFAULT_STATE.material,
              shape: validShapes.has(s.shape as never)
                ? (s.shape as StudioState["shape"])
                : DEFAULT_STATE.shape,
            },
          } as Creation;
        })
        .filter((c) => c.name.length > 0))
    : [];

  const stateRaw = (typeof obj.currentState === "object" && obj.currentState !== null
    ? obj.currentState
    : {}) as Partial<StudioState>;

  const currentState: StudioState = { ...DEFAULT_STATE, ...stateRaw };

  return { ok: true, data: { app: "MORPH/UI", version: 1, exportedAt: String(obj.exportedAt ?? ""), favorites, creations, currentState } };
}
