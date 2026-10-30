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

.morph-component[aria-expanded="true"],
.morph-component[aria-selected="true"] {
  background-color: ${rgba(state.color, Number((state.transparency * 0.55).toFixed(2)))};
  box-shadow: 0 0 calc(var(--glow) * 34px) ${rgba(state.color, Number(clamp01(state.glow * 0.6).toFixed(2)))};
}

@media (prefers-reduced-motion: reduce) {
  .morph-component { transition-duration: 1ms; }
}`;
}

/* --------------------------------------------------------------- Tailwind */
export function exportTailwind(state: StudioState): string {
  const pattern = PATTERN_MAP[state.pattern];
  const material = MATERIAL_MAP[state.material];

  // Le rayon effectif, en valeur Tailwind arbitraire.
  const radius =
    state.shape === "pill" ? "rounded-full" : `rounded-[${effectiveRadius(state)}px]`;

  // Flou : n'a de sens que sur les matériaux translucides.
  const backdrop = material.blurReactive
    ? `backdrop-blur-[${state.blur}px] backdrop-saturate-150`
    : "";

  // Transparence : même logique.
  const alpha = material.alphaReactive
    ? `bg-white/[${(state.transparency * 0.28).toFixed(2)}]`
    : "";

  // Halo : exprimé en ombre arbitraire, dans la couleur d'accent.
  const glowClass =
    state.glow > 0.02
      ? `shadow-[0_0_${Math.round(state.glow * 26)}px_${rgba(state.color, Number(clamp01(state.glow * 0.42).toFixed(2)))}]`
      : "";

  const shadowClass = `shadow-[0_${Math.round(state.shadow * 22)}px_${Math.round(state.shadow * 44)}px_rgba(0,0,0,${(state.shadow * 0.5).toFixed(2)})]`;

  const scaleClass = state.size === 1 ? "" : `scale-[${state.size.toFixed(2)}]`;

  const durationMs = Math.round(220 / state.speed);
  const easeClass = state.spring > 0.5 ? "ease-[cubic-bezier(0.34,1.56,0.64,1)]" : "ease-[cubic-bezier(0.22,1,0.36,1)]";

  const classes = [
    radius,
    backdrop,
    alpha,
    `border border-[${state.color}]/40`,
    glowClass,
    shadowClass,
    scaleClass,
    `duration-[${durationMs}ms]`,
    easeClass,
    "transition",
  ]
    .filter(Boolean)
    .join("\n    ");

  return `// MORPH/UI — export Tailwind CSS
// Pattern  : ${pattern.name}
// Material : ${material.name}
//
// PRÉREQUIS : Tailwind v3.4+ (syntaxe des valeurs arbitraires).
// Le composant n'est PAS autonome — il suppose la feuille MORPH/UI pour la
// texture du matériau et les keyframes du pattern.

export function MorphComponent({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
    ${classes}
  "
    >
      {children}
    </button>
  );
}

/* ============================================================
   Correspondance avec le Studio
   ------------------------------------------------------------
   Shape       → ${radius}
   Blur        → ${material.blurReactive ? `${state.blur}px (backdrop-blur)` : "sans effet sur ce matériau"}
   Transparency→ ${material.alphaReactive ? state.transparency.toFixed(2) : "sans effet sur ce matériau"}
   Shadow      → ${state.shadow.toFixed(2)}
   Glow        → ${state.glow.toFixed(2)}
   Size        → ${state.size.toFixed(2)}
   Speed       → ${durationMs} ms de transition
   Spring      → ${state.spring.toFixed(2)}

   LIMITES
   - Le matériau ${material.name} n'est pas exprimable en classes utilitaires :
     sa texture vient de materials.css. Ajoutez la classe .m--${state.material}
     à côté des classes ci-dessus, ou copiez l'onglet CSS.
   - Les valeurs arbitraires Tailwind (rounded-[/blur-[...]) ne sont pas
     générées si vous utilisez la purge avec un safelist incomplet : pensez
     à ajouter ces classes au safelist de tailwind.config.
   - Les keyframes du pattern ${pattern.name} restent dans patterns.css.
   ============================================================ */`;
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
   matériau et les keyframes du pattern existent. */

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
   - Le réglage Animation Speed (${state.speed.toFixed(2)}×) passe par --speed-mul.
   - Le comportement propre au pattern (${pattern.name}) est détaillé dans la
     section Documentation : ce composant en fournit l'OSSATURE. */`;
}

/* ---------------------------------------------------------- Framer Motion */
export function exportFramer(state: StudioState): string {
  const pattern = PATTERN_MAP[state.pattern];
  const bounce = state.spring;

  const damping = Math.round(26 - bounce * 12);
  const stiffness = Math.round(220 + bounce * 200);

  return `/* MORPH/UI — export Framer Motion
   Pattern : ${pattern.name}
   Spring  : bounce ${bounce.toFixed(2)} → stiffness ${stiffness} / damping ${damping}

   Dépendances : framer-motion (>= 11). Le composant n'est PAS autonome. */

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
     direct en Framer Motion. Limitation assumée. */`;
}

/* ------------------------------------------------------------- Limitations */
export function exportLimitations(state: StudioState, format: "css" | "tailwind" | "react" | "framer"): string[] {
  const out: string[] = [
    "Le code exporté suppose la feuille de style MORPH/UI chargée (classes de matériau et keyframes de pattern). Ce n'est pas un composant 100 % autonome.",
  ];

  const material = MATERIAL_MAP[state.material];

  if (material.blurReactive) {
    out.push(
      `Le matériau ${material.name} utilise backdrop-filter : prévoir un repli opaque si le navigateur ne le supporte pas.`
    );
  }

  if (!material.blurReactive && !material.alphaReactive) {
    out.push(
      `Sur ${material.name}, les réglages Blur et Transparency sont publiés mais sans effet visible — c'est une propriété du matériau, pas un bug.`
    );
  }

  if (format === "tailwind") {
    out.push(
      `Tailwind ne peut pas exprimer la texture du matériau ${material.name} : sa classe .m--${state.material} reste nécessaire, ou copiez l'onglet CSS.`
    );
    out.push(
      "Les valeurs arbitraires (rounded-[24px], backdrop-blur-[18px], shadow-[...]) doivent être ajoutées au safelist de tailwind.config si vous utilisez la purge."
    );
    out.push(
      "Tailwind n'a pas d'équivalent pour Animation Speed, Spring et l'opacité composée : seul le rayon, le flou, l'ombre et le halo sont traduits."
    );
  }

  if (format === "react" || format === "framer") {
    out.push(
      "Les exports React et Framer Motion ne reproduisent pas les comportements multi-éléments (métaballes, menu radial, dock). Seule l'ossature du composant principal est fournie."
    );
  }

  out.push(
    `Le pattern ${PATTERN_MAP[state.pattern].name} nécessite des keyframes CSS spécifiques : ils proviennent de la feuille MORPH/UI, pas du bloc exporté.`
  );

  return out;
}
