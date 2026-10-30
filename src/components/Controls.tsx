import type { ReactNode } from "react";
import { useCallback, useId, useState } from "react";
import { ADVANCED_CONTROLS } from "../state/defaults";
import { ANCHORS } from "../state/anchor";
import { MATERIAL_MAP } from "../data/materials";
import type { AnchorId, ControlKey } from "../state/types";
import { useStudio } from "../state/context";

/* --------------------------------------------------------------- Slider */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  hint?: string;
  disabled?: boolean;
  disabledReason?: string;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  hint,
  disabled = false,
  disabledReason,
  onChange,
}: SliderProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const hintId = `${id}-hint`;
  const decimals = step < 0.1 ? 2 : 0;

  return (
    <div style={{ display: "grid", gap: 4, opacity: disabled ? 0.5 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <label
          htmlFor={id}
          style={{ fontSize: "0.8125rem", color: disabled ? "var(--text-faint)" : "var(--text-dim)" }}
        >
          {label}
        </label>
        <output
          className="mono"
          htmlFor={id}
          style={{ color: disabled ? "var(--text-faint)" : "var(--text)" }}
        >
          {value.toFixed(decimals)}
          {unit}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--brand-light)", height: 28 }}
      />
      {hint && !disabled && (
        <p id={hintId} className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)", margin: 0, lineHeight: 1.5 }}>
          {hint}
        </p>
      )}
      {disabled && disabledReason && (
        <p id={noteId} className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)", margin: 0, lineHeight: 1.5 }}>
          {disabledReason}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- Segments */
interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ id: T; label: string }>;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
      <legend className="eyebrow" style={{ marginBottom: 6 }}>
        {label}
      </legend>
      <div className="tabs" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === value}
            className="tabs__btn"
            onClick={() => onChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------ Groupe repliable */
interface GroupProps {
  title: string;
  /** Fermé par défaut partout : c'est la règle du projet. */
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
}

export function Group({ title, defaultOpen = false, badge, children }: GroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className="group">
      <button
        type="button"
        className="group__head"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="group__caret" aria-hidden="true">›</span>
          {title}
        </span>
        {badge && <span className="chip">{badge}</span>}
      </button>
      <div id={id} className="group__body" style={open ? undefined : { display: "none" }}>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------- Contrôles avancés §11 */
export function AdvancedControls() {
  const { state, set, patch } = useStudio();
  const material = MATERIAL_MAP[state.material];

  const anchorDisabled = state.pattern !== "sheet-drag";

  const disabledReasonFor = useCallback(
    (key: ControlKey): string | undefined => {
      if (key === "blur" && !material.blurReactive) {
        return `${material.name} ne produit pas de flou d'arrière-plan : Blur n'a pas d'effet ici.`;
      }
      if (key === "transparency" && !material.alphaReactive) {
        return `${material.name} est opaque par nature : Transparency n'a pas d'effet ici.`;
      }
      if (key === "glow" && !material.glowReactive) {
        return `${material.name} ne produit pas de halo : Glow n'a pas d'effet ici.`;
      }
      return undefined;
    },
    [material]
  );

  return (
    <>
      <Segmented<AnchorId>
        label={anchorDisabled ? "Anchor (inactif pour ce pattern)" : "Anchor"}
        value={state.anchor}
        options={ANCHORS.map((a) => ({ id: a.id, label: a.name }))}
        onChange={(v) => patch({ anchor: v })}
      />
      {anchorDisabled && (
        <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)", margin: 0, lineHeight: 1.5 }}>
          L'ancrage ne s'applique qu'au pattern Sheet Drag : ailleurs, le placement est
          déterminé par la composition du composant.
        </p>
      )}

      {ADVANCED_CONTROLS.map((c) => {
        const reason = disabledReasonFor(c.key);
        return (
          <Slider
            key={c.key}
            label={c.label}
            value={state[c.key]}
            min={c.min}
            max={c.max}
            step={c.step}
            unit={c.unit}
            hint={HINTS[c.key]}
            disabled={reason !== undefined}
            disabledReason={reason}
            onChange={(v) => set(c.key, v)}
          />
        );
      })}
    </>
  );
}

const HINTS: Record<ControlKey, string> = {
  blur: "Flou appliqué à l'arrière-plan vu à travers la surface. À 0, la surface devient nette.",
  speed: "Multiplie la durée de toutes les animations. En dessous de 1, les transitions sont ralenties.",
  radius: "Rayon des angles. Piloté par la forme choisie : Pill et Sharp l'ignorent.",
  shadow: "Intensité de l'ombre portée sous l'objet. À 0, l'objet paraît posé à plat.",
  glow: "Intensité du halo lumineux autour de l'objet, dans la couleur d'accent.",
  transparency: "Opacité de la surface. À 1, l'objet est totalement opaque.",
  spring: "Amplitude du rebond : pilote la physique des ressorts, du dock et du menu radial.",
  size: "Échelle de l'objet principal, de 60 % à 160 %.",
};
