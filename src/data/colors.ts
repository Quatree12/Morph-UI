export interface ColorDef {
  id: string;
  name: string;
  hex: string;
}

/** 12 accents prédéfinis. Le picker natif permet en plus une couleur custom. */
export const COLORS: ColorDef[] = [
  { id: "violet", name: "Violet", hex: "#C1A8FF" },
  { id: "lime", name: "Lime", hex: "#D6FA72" },
  { id: "turquoise", name: "Turquoise", hex: "#6FE3D2" },
  { id: "rose", name: "Rose", hex: "#FF9EC4" },
  { id: "blue", name: "Bleu", hex: "#7AA2FF" },
  { id: "orange", name: "Orange", hex: "#FFAE6B" },
  { id: "coral", name: "Rouge corail", hex: "#FF6B6B" },
  { id: "ivory", name: "Ivoire", hex: "#F4EDE0" },
  { id: "lilac", name: "Lilas", hex: "#E0C3FF" },
  { id: "electric", name: "Bleu électrique", hex: "#4D7CFF" },
  { id: "yellow", name: "Jaune", hex: "#FFE066" },
  { id: "white", name: "Blanc", hex: "#FFFFFF" },
];

export const COLOR_MAP: Record<string, ColorDef> = Object.fromEntries(
  COLORS.map((c) => [c.id, c])
);
