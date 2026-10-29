import type { StudioState } from "../state/types";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";
import { SHAPE_MAP } from "../data/shapes";
import { effectiveRadius } from "../state/StudioProvider";

/* ==========================================================================
   Générateurs d'export.
   Règle tenue : le code produit reflète EXACTEMENT StudioState. Quand un
   réglage n'a pas de traduction fidèle dans un format, on l'écrit dans les
   limitations plutôt que d'inventer une ligne de code décorative.
   ========================================================================== */

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = Number.parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const rgba = (hex: string, a: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Jeu de variables CSS dérivé de l'état : le pont réglage → rendu. */
export function cssVariableMap(state: StudioState): Array<[string, string]> {
  return [
    ["--accent", state.color],
    ["--blur", `${state.blur}px`],
    ["--radius", state.shape === "pill" ? "999px" : `${effectiveRadius(state)}px`],
    ["--shadow", state.shadow.toFixed(2)],
    ["--glow", state.glow.toFixed(2)],
    ["--alpha", state.transparency.toFixed(2)],
    ["--bounce", state.spring.toFixed(2)],
    ["--size", state.size.toFixed(2)],
    ["--speed-mul", (1 / state.speed).toFixed(2)],
  ];
}

export function cssVariables(state: StudioState): string {
  return cssVariableMap(state)
    .map(([k, v]) => `${k}: ${v};`)
    .join("\n  ");
}

/* ------------------------------------------------------------------- CSS */
export function exportCss(state: StudioState): string {
  const pattern = PATTERN_MAP[state.pattern];
  const material = MATERIAL_MAP[state.material];
  const shape = SHAPE_MAP[state.shape];

  return `/* ============================================================
   MORPH/UI — export CSS
   Pattern  : ${pattern.name} (${pattern.category})
   Material : ${material.name}
   Shape    : ${shape.name} — ${shape.note}
   Ce bloc suppose la feuille de style MORPH/UI chargée pour la classe de
   matériau .m--${state.material} et pour les keyframes du pattern.
   ============================================================ */

:root {
  ${cssVariables(state)}
}

.morph-component {
  /* Géométrie */
  border-radius: var(--radius);
  padding: 16px 24px;
  transform: scale(var(--size));

  /* Matériau : ${material.name} */
  background-color: ${rgba(state.color, Number((state.transparency * 0.28).toFixed(2)))};
  backdrop-filter: blur(var(--blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--blur)) saturate(150%);
  border: 1px solid ${rgba(state.color, 0.42)};

  /* Profondeur */
  box-shadow:
    0 0 calc(var(--glow) * 26px) ${rgba(state.color, Number(clamp01(state.glow * 0.42).toFixed(2)))},
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 calc(var(--shadow) * 22px) calc(var(--shadow) * 44px) rgba(0, 0, 0, calc(var(--shadow) * 0.5));

  color: #F4F1F8;
  transition:
    border-radius calc(220ms * var(--speed-mul)) cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow calc(220ms * var(--speed-mul)) cubic-bezier(0.22, 1, 0.36, 1);
}

.morph-component:active {
  transform: scale(calc(var(--size) * 0.97));
}

/* États actifs — vitesse appliquée : ${state.speed.toFixed(2)}× */
.morph-component[aria-expanded="true"],
.morph-component[aria-selected="true"] {
  background-color: ${rgba(state.color, Number((state.transparency * 0.55).toFixed(2)))};
  box-shadow: 0 0 calc(var(--glow) * 34px) ${rgba(state.color, Number(clamp01(state.glow * 0.6).toFixed(2)))};
}

@media (prefers-reduced-motion: reduce) {
  .morph-component { transition-duration: 1ms; }
}`;
}

/* ----------------------------------------------------------------- React */
export function exportReact(state: StudioState): string {
  const pattern = PATTERN_MAP[state.pattern];
  const material = MATERIAL_MAP[state.material];

  const varLines = cssVariableMap(state)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");

  return `/* MORPH/UI — export React (TypeScript)
   Pattern : ${pattern.name}
   Material: ${material.name}

   Prérequis : importer la feuille de style MORPH/UI pour que la classe de
   matériau et les keyframes du pattern existent. Pour un composant autonome,
   copiez d'abord l'onglet CSS. */

import { useCallback, useState } from "react";
import type { CSSProperties } from "react";

const vars = {
${varLines}
} as CSSProperties;

interface Props {
  label?: string;
}

export function MorphComponent({ label = "${pattern.name}" }: Props) {
  const [active, setActive] = useState(false);
  const toggle = useCallback(() => setActive((v) => !v), []);

  return (
    <button
      type="button"
      className="morph-component m--${state.material} shape--${state.shape}"
      style={vars}
      aria-pressed={active}
      aria-expanded={active}
      onClick={toggle}
    >
      {label}
    </button>
  );
}

/* Notes d'intégration
   - aria-pressed / aria-expanded reflètent l'état réel « active ».
   - Le réglage Animation Speed (${state.speed.toFixed(2)}×) passe par --speed-mul,
     consommé par les transitions CSS.
   - Le comportement propre au pattern (${pattern.name}) est détaillé dans la
     section Documentation : ce composant en fournit l'OSSATURE. */`;
}

/* ---------------------------------------------------------- Framer Motion */
export function exportFramer(state: StudioState): string {
  const pattern = PATTERN_MAP[state.pattern];
  const bounce = state.spring;

  // Physique dérivée du réglage Spring/Bounce.
  const damping = Math.round(26 - bounce * 12);
  const stiffness = Math.round(220 + bounce * 200);

  return `/* MORPH/UI — export Framer Motion
   Pattern : ${pattern.name}
   Spring  : bounce ${bounce.toFixed(2)} → stiffness ${stiffness} / damping ${damping}

   Dépendances : framer-motion (>= 11). Le composant n'est PAS autonome :
   il importe la librairie et suppose la feuille CSS MORPH/UI chargée. */

import { motion } from "framer-motion";

const spring = {
  type: "spring" as const,
  stiffness: ${stiffness},
  damping: ${damping},
};

export function MorphMotion() {
  return (
    <motion.button
      type="button"
      className="morph-component m--${state.material} shape--${state.shape}"
      aria-label="${pattern.name}"
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: ${state.size.toFixed(2)}, opacity: 1 }}
      whileTap={{ scale: ${(state.size * 0.94).toFixed(2)} }}
      whileHover={{ y: ${(-4 * (1 + bounce)).toFixed(1)} }}
      transition={spring}
    >
      ${pattern.name}
    </motion.button>
  );
}

/* Variantes de transition
   - stiffness ${stiffness} / damping ${damping} : la physique suit directement
     le curseur Spring / Bounce.
   - Le réglage Animation Speed (${state.speed.toFixed(2)}×) n'a pas d'équivalent
     direct en Framer Motion, où la durée découle de la physique. Limitation
     assumée : utilisez le format CSS pour piloter ce réglage. */`;
}

/* ------------------------------------------------------------- Limitations */
export function exportLimitations(state: StudioState): string[] {
  const out: string[] = [
    "Le code exporté suppose la feuille de style MORPH/UI chargée (classes de matériau et keyframes de pattern). Ce n'est pas un composant 100 % autonome.",
  ];

  if (
    state.material === "frosted-glass" ||
    state.material === "clear-glass" ||
    state.material === "translucent-gel"
  ) {
    out.push(
      "Ce matériau utilise backdrop-filter : prévoir un repli opaque si le navigateur ne le supporte pas (Safari ancien, Firefox désactivé)."
    );
  }
  if (state.material === "brushed-metal" || state.material === "iridescent-crystal") {
    out.push(
      `Le matériau ${MATERIAL_MAP[state.material].name} repose sur plusieurs dégradés CSS et sur color-mix(). Son rendu dépend du support de cette fonction par le navigateur.`
    );
  }

  out.push(
    "Les réglages Blur et Transparency n'ont d'effet que sur les matériaux translucides : sur Solid Surface ou Brushed Metal, la variable est publiée mais reste sans effet visible."
  );

  out.push(
    "Les exports React et Framer Motion ne reproduisent pas les comportements multi-éléments (métaballes, menu radial, dock). Seule l'ossature du composant principal est fournie ; la section Documentation décrit l'implémentation complète de chaque pattern."
  );

  out.push(
    `Le pattern ${PATTERN_MAP[state.pattern].name} nécessite des keyframes CSS spécifiques : ils proviennent de la feuille MORPH/UI, pas du bloc exporté.`
  );

  return out;
}
