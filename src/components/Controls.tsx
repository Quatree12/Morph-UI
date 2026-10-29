import type { ReactNode } from "react";
import { useCallback, useId, useState } from "react";
import { ADVANCED_CONTROLS } from "../state/defaults";
import type { ControlKey } from "../state/types";
import { useStudio } from "../state/context";

/* --------------------------------------------------------------- Slider */
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
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
  disabled = false,
  disabledReason,
  onChange,
}: SliderProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const decimals = step < 0.1 ? 2 : 0;

  return (
    <div style={{ display: "grid", gap: 6, opacity: disabled ? 0.45 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <label htmlFor={id} style={{ fontSize: "0.8125rem", color: disabled ? "var(--text-faint)" : "var(--text-dim)" }}>
          {label}
        </label>
        <output className="mono" htmlFor={id} style={{ color: disabled ? "var(--text-faint)" : "var(--text)" }}>
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
        aria-describedby={disabled && disabledReason ? noteId : undefined}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", height: 28 }}
      />
      {disabled && disabledReason && (
        <p id={noteId} className="mono" style={{ color: "var(--text-faint)", fontSize: "0.6875rem" }}>
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
            style={o.id === value ? { background: "color-mix(in srgb, var(--accent) 22%, transparent)", color: "var(--text)" } : undefined}
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
  defaultOpen?: boolean;
  children: ReactNode;
  badge?: string;
}

export function Group({ title, defaultOpen = true, badge, children }: GroupProps) {
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
          <span className="group__caret" aria-hidden="true">
            ›
          </span>
          {title}
        </span>
        {badge && <span className="chip">{badge}</span>}
      </button>
      <div id={id} className="group__body" hidden={!open}>
        {children}
      </div>
    </section>
  );
}

/* ------------------------------------------------- Contrôles avancés §11 */
export function AdvancedControls() {
  const { state, set } = useStudio();

  const isDisabled = useCallback(
    (key: ControlKey) => {
      // Un réglage est désactivé s'il n'a réellement aucun effet sur la maquette :
      // on explique pourquoi au lieu d'afficher un faux contrôle (§11).
      if (key === "blur") return false; // le blur agit sur les matériaux translucides
      return false;
    },
    []
  );

  return (
    <>
      {ADVANCED_CONTROLS.map((c) => (
        <Slider
          key={c.key}
          label={c.label}
          value={state[c.key]}
          min={c.min}
          max={c.max}
          step={c.step}
          unit={c.unit}
          disabled={isDisabled(c.key)}
          onChange={(v) => set(c.key, v)}
        />
      ))}
    </>
  );
}
