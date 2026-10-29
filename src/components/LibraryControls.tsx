import { Group, Segmented, Slider } from "./Controls";
import { useStudio } from "../state/context";
import { PATTERNS, PATTERN_MAP } from "../data/patterns";
import { MATERIALS } from "../data/materials";
import { SHAPES } from "../data/shapes";
import { COLORS } from "../data/colors";
import type { MaterialId, PatternId, ShapeId } from "../state/types";

/* ------------------------------------------------- Pattern (§7) */
export function PatternPicker() {
  const { state, set } = useStudio();
  return (
    <Group title="Interaction Pattern" badge="12" defaultOpen>
      <div style={{ display: "grid", gap: 6 }}>
        {PATTERNS.map((p) => {
          const active = p.id === state.pattern;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => set("pattern", p.id as PatternId)}
              aria-pressed={active}
              style={{
                display: "grid",
                gap: 2,
                minHeight: 44,
                padding: "8px 12px",
                textAlign: "left",
                borderRadius: "var(--r-sm)",
                border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 46%, transparent)" : "var(--border)"}`,
                background: active ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "var(--surface-2)",
                color: "var(--text)",
              }}
            >
              <span style={{ fontSize: "0.875rem", fontWeight: active ? 600 : 500 }}>{p.name}</span>
              <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                {p.category} · {p.complexity}
              </span>
            </button>
          );
        })}
      </div>
    </Group>
  );
}

/* ------------------------------------------------- Material (§8) */
export function MaterialPicker() {
  const { state, set } = useStudio();
  return (
    <Group title="Material" badge="9" defaultOpen>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {MATERIALS.map((m) => {
          const active = m.id === state.material;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => set("material", m.id as MaterialId)}
              aria-pressed={active}
              title={m.tagline}
              style={{
                display: "grid",
                gap: 6,
                padding: 6,
                borderRadius: "var(--r-sm)",
                border: `1px solid ${active ? "color-mix(in srgb, var(--accent) 60%, transparent)" : "var(--border)"}`,
                background: "transparent",
                color: active ? "var(--text)" : "var(--text-dim)",
              }}
            >
              {/* Pastille d'aperçu : applique RÉELLEMENT la classe du matériau. */}
              <span
                className={`m m--${m.id}`}
                aria-hidden="true"
                style={{ height: 34, borderRadius: 8, display: "block" }}
              />
              <span style={{ fontSize: "0.5625rem", lineHeight: 1.25, textAlign: "center" }}>{m.name}</span>
            </button>
          );
        })}
      </div>
      <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
        {MATERIAL_LOOKUP[state.material].tagline}
      </p>
    </Group>
  );
}
import { MATERIAL_MAP as MATERIAL_LOOKUP } from "../data/materials";

/* ------------------------------------------------- Shape (§9) */
export function ShapePicker() {
  const { state, set } = useStudio();
  return (
    <Group title="Shape" badge="5">
      <Segmented
        label="Formes"
        value={state.shape}
        options={SHAPES.map((s) => ({ id: s.id as ShapeId, label: s.name }))}
        onChange={(v) => set("shape", v)}
      />
      <Slider
        label="Border Radius"
        value={state.radius}
        min={0}
        max={48}
        step={1}
        unit="px"
        disabled={state.shape === "pill" || state.shape === "sharp"}
        disabledReason={
          state.shape === "pill"
            ? "Pill force un rayon maximal : le réglage est sans effet."
            : state.shape === "sharp"
              ? "Sharp force un rayon nul : le réglage est sans effet."
              : undefined
        }
        onChange={(v) => set("radius", v)}
      />
    </Group>
  );
}

/* ------------------------------------------------- Color (§10) */
export function ColorPicker() {
  const { state, set, patch } = useStudio();
  return (
    <Group title="Color" badge="12">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
        {COLORS.map((c) => {
          const active = state.colorPreset === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => patch({ color: c.hex, colorPreset: c.id })}
              aria-pressed={active}
              aria-label={`Couleur ${c.name}`}
              title={c.name}
              style={{
                aspectRatio: "1",
                minHeight: 40,
                borderRadius: "50%",
                background: c.hex,
                border: active ? "3px solid var(--text)" : "1px solid var(--border)",
                outline: active ? "2px solid color-mix(in srgb, var(--accent) 70%, transparent)" : "none",
                outlineOffset: 2,
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <label htmlFor="custom-color" style={{ fontSize: "0.8125rem", color: "var(--text-dim)" }}>
          Couleur personnalisée
        </label>
        <input
          id="custom-color"
          type="color"
          value={state.color}
          onChange={(e) => patch({ color: e.target.value, colorPreset: "custom" })}
          style={{
            width: 56,
            height: 40,
            padding: 2,
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r-sm)",
          }}
        />
        <span className="mono" style={{ color: "var(--text-faint)" }}>{state.color}</span>
      </div>

      {state.colorPreset === "custom" && <span className="chip">custom</span>}
    </Group>
  );
}

/* -------------------------------------------------- Description du pattern */
export function PatternInfo() {
  const { state } = useStudio();
  const p = PATTERN_MAP[state.pattern];

  return (
    <div className="panel">
      <div className="panel__head">
        <div>
          <div className="eyebrow">{p.category}</div>
          <h3 style={{ marginTop: 2 }}>{p.name}</h3>
        </div>
        <span className="chip">{p.complexity}</span>
      </div>
      <div className="panel__body">
        <p className="muted" style={{ fontSize: "0.875rem" }}>{p.description}</p>

        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Cas d'usage</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.8125rem", color: "var(--text-dim)", display: "grid", gap: 4 }}>
            {p.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <div className="eyebrow">Compatibilité</div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-dim)" }}>
            <strong style={{ color: "var(--text)" }}>Mobile ·</strong> {p.mobile}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-dim)" }}>
            <strong style={{ color: "var(--text)" }}>Desktop ·</strong> {p.desktop}
          </p>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Avantages</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.8125rem", color: "var(--text-dim)", display: "grid", gap: 4 }}>
            {p.pros.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Limites</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.8125rem", color: "var(--text-dim)", display: "grid", gap: 4 }}>
            {p.cons.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Accessibilité</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.8125rem", color: "var(--text-dim)", display: "grid", gap: 4 }}>
            {p.a11y.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
