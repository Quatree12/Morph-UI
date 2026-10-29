import type { ShapeId } from "../state/types";

export interface ShapeDef {
  id: ShapeId;
  name: string;
  /** Valeur de border-radius relative au rayon courant du Playground. */
  radiusScale: number;
  /** Masque CSS additionnel (squircle), appliqué via .shape--<id>. */
  note: string;
}

export const SHAPES: ShapeDef[] = [
  { id: "pill", name: "Pill", radiusScale: 999, note: "Rayon max : forme capsule." },
  { id: "rounded", name: "Rounded", radiusScale: 1, note: "Suit le réglage Border Radius." },
  { id: "circle", name: "Circle", radiusScale: 0.5, note: "Rayon = 50 % de la dimension." },
  {
    id: "squircle",
    name: "Squircle",
    radiusScale: 1.4,
    note: "Superellipse approchée par masque + rayon élevé.",
  },
  { id: "sharp", name: "Sharp", radiusScale: 0, note: "Angle vif, rayon nul." },
];

export const SHAPE_MAP: Record<ShapeId, ShapeDef> = Object.fromEntries(
  SHAPES.map((s) => [s.id, s])
) as Record<ShapeId, ShapeDef>;
