import type { AnchorId } from "./types";

export interface AnchorDef {
  id: AnchorId;
  name: string;
  side: "bottom" | "top";
  hint: string;
}

export const ANCHORS: AnchorDef[] = [
  { id: "bottom", name: "Bas", side: "bottom", hint: "Glisser vers le haut pour déplier." },
  { id: "top", name: "Haut", side: "top", hint: "Glisser vers le bas pour déplier." },
];

export const ANCHOR_MAP: Record<AnchorId, AnchorDef> = Object.fromEntries(
  ANCHORS.map((a) => [a.id, a])
) as Record<AnchorId, AnchorDef>;
