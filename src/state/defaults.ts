import type { StudioState } from "./types";

/** État initial : sert aussi de cible au bouton Reset. */
export const DEFAULT_STATE: StudioState = {
  pattern: "liquid-glass",
  material: "frosted-glass",
  shape: "pill",
  color: "#C1A8FF",
  colorPreset: "violet",
  anchor: "bottom",

  blur: 18,
  speed: 1,
  radius: 24,
  shadow: 0.55,
  glow: 0.4,
  transparency: 0.72,
  spring: 0.5,
  size: 1,
};

export const ADVANCED_CONTROLS = [
  { key: "blur", label: "Blur", min: 0, max: 40, step: 1, unit: "px" },
  { key: "speed", label: "Animation Speed", min: 0.4, max: 2.2, step: 0.05, unit: "×" },
  { key: "radius", label: "Border Radius", min: 0, max: 48, step: 1, unit: "px" },
  { key: "shadow", label: "Shadow Intensity", min: 0, max: 1, step: 0.01, unit: "" },
  { key: "glow", label: "Glow Intensity", min: 0, max: 1, step: 0.01, unit: "" },
  { key: "transparency", label: "Transparency", min: 0.15, max: 1, step: 0.01, unit: "" },
  { key: "spring", label: "Spring / Bounce", min: 0, max: 1, step: 0.01, unit: "" },
  { key: "size", label: "Size", min: 0.6, max: 1.6, step: 0.01, unit: "×" },
] as const;
