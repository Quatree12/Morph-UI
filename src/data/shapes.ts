import type { ShapeId } from "../state/types";

export interface ShapeDef {
  id: ShapeId;
  name: string;
  /** Valeur de border-radius relative au rayon courant du Playground. */
  radiusScale: number;
  /** Le réglage Border Radius a-t-il un effet sur cette forme ? */
  radiusDriven: boolean;
  note: string;
}

export const SHAPES: ShapeDef[] = [
  {
    id: "pill",
    name: "Pill",
    radiusScale: 999,
    radiusDriven: false,
    note: "Rayon maximal : forme capsule.",
  },
  {
    id: "rounded",
    name: "Rounded",
    radiusScale: 1,
    radiusDriven: true,
    note: "Suit le réglage Border Radius.",
  },
  {
    id: "circle",
    name: "Circle",
    radiusScale: 0.5,
    radiusDriven: false,
    note: "Disque parfait.",
  },
  {
    id: "squircle",
    name: "Squircle",
    radiusScale: 1.4,
    radiusDriven: true,
    note: "Superellipse approchée par masque + rayon élevé.",
  },
  {
    id: "sharp",
    name: "Sharp",
    radiusScale: 0,
    radiusDriven: false,
    note: "Angle vif, rayon nul.",
  },
  {
    id: "blob",
    name: "Blob",
    radiusScale: 1,
    radiusDriven: true,
    note: "Silhouette organique, coins asymétriques. Le réglage décale la forme.",
  },
  {
    id: "diamond",
    name: "Diamond",
    radiusScale: 0,
    radiusDriven: false,
    note: "Losange obtenu par clip-path. Le rayon n'a pas d'effet.",
  },
  {
    id: "arch",
    name: "Arch",
    radiusScale: 1,
    radiusDriven: true,
    note: "Arche : arrondi haut, base droite. Le rayon pilote la courbure.",
  },
  {
    id: "notched",
    name: "Notched",
    radiusScale: 1,
    radiusDriven: true,
    note: "Coin supérieur droit coupé, façon onglet ou badge d'onglet.",
  },
];

export const SHAPE_MAP: Record<ShapeId, ShapeDef> = Object.fromEntries(
  SHAPES.map((s) => [s.id, s])
) as Record<ShapeId, ShapeDef>;
