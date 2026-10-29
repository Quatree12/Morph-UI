import { useState } from "react";
import { PATTERNS, PATTERN_MAP } from "../data/patterns";
import { useStudio } from "../state/context";
import { PhoneFrame } from "../previews/PhoneFrame";
import { PATTERN_RENDERERS } from "../previews";
import { MATERIALS, MATERIAL_MAP } from "../data/materials";
import { SHAPES } from "../data/shapes";
import { COLORS } from "../data/colors";
import type { MaterialId, PatternId, ShapeId } from "../state/types";

export function Compare() {
  const { state, set, patch } = useStudio();
  const [a, setA] = useState<PatternId>("liquid-glass");
  const [b, setB] = useState<PatternId>("radial-menu");

  const pa = PATTERN_MAP[a];
  const pb = PATTERN_MAP[b];
  const Ra = PATTERN_RENDERERS[a];
  const Rb = PATTERN_RENDERERS[b];

  const rows: Array<{ label: string; a: string; b: string }> = [
    { label: "Catégorie", a: pa.category, b: pb.category },
    { label: "Complexité", a: pa.complexity, b: pb.complexity },
    { label: "Matériau courant", a: MATERIAL_MAP[state.material].name, b: MATERIAL_MAP[state.material].name },
    { label: "Cas d'usage", a: pa.useCases.join(" · "), b: pb.useCases.join(" · ") },
    { label: "Mobile", a: pa.mobile, b: pb.mobile },
    { label: "Desktop", a: pa.desktop, b: pb.desktop },
    { label: "Avantages", a: pa.pros.join(" · "), b: pb.pros.join(" · ") },
    { label: "Limites", a: pa.cons.join(" · "), b: pb.cons.join(" · ") },
    { label: "Accessibilité", a: pa.a11y.join(" · "), b: pb.a11y.join(" · ") },
  ];

  const columns: Array<{ id: PatternId; setter: (v: PatternId) => void; R: typeof Ra; label: string; tag: string }> = [
    { id: a, setter: setA, R: Ra, label: "Pattern A", tag: "cmp-a" },
    { id: b, setter: setB, R: Rb, label: "Pattern B", tag: "cmp-b" },
  ];

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Compare / Pattern Comparison</div>
        <h1>Comparateur</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Deux patterns côte à côte, réagissant aux mêmes réglages partagés. Sur mobile, les
          colonnes s'empilent verticalement.
        </p>
      </header>

      {/* -------------------------------------------------- Aperçus synchronisés */}
      <div className="compare-grid">
        {columns.map((col) => (
          <div key={col.tag} className="panel">
            <div className="panel__head">
              <div className="eyebrow">{col.label}</div>
              <span className="chip">{PATTERN_MAP[col.id].category}</span>
            </div>
            <div className="panel__body">
              <label htmlFor={col.tag} className="visually-hidden">
                Choisir le {col.label}
              </label>
              <select
                id={col.tag}
                value={col.id}
                onChange={(e) => col.setter(e.target.value as PatternId)}
                style={selectStyle}
              >
                {PATTERNS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <PhoneFrame>
                <col.R bounce={state.spring} />
              </PhoneFrame>
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------ Réglages partagés */}
      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Réglages appliqués aux deux aperçus</div>
        </div>
        <div className="panel__body">
          <div style={{ display: "grid", gap: "var(--s-3)", maxWidth: 460 }}>
            <label style={fieldStyle}>
              Matériau
              <select
                value={state.material}
                onChange={(e) => set("material", e.target.value as MaterialId)}
                style={selectStyle}
              >
                {MATERIALS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>
            <label style={fieldStyle}>
              Forme
              <select
                value={state.shape}
                onChange={(e) => set("shape", e.target.value as ShapeId)}
                style={selectStyle}
              >
                {SHAPES.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
            <label style={fieldStyle}>
              Couleur
              <select
                value={state.colorPreset === "custom" ? "custom" : state.colorPreset}
                onChange={(e) => {
                  const hit = COLORS.find((c) => c.id === e.target.value);
                  if (hit) patch({ color: hit.hex, colorPreset: hit.id });
                }}
                style={selectStyle}
              >
                {state.colorPreset === "custom" && (
                  <option value="custom">Personnalisé ({state.color})</option>
                )}
                {COLORS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
            Ces sélecteurs écrivent le même état partagé que le Playground : les deux aperçus
            réagissent simultanément.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------- Tableau comparatif */}
      <div className="table-scroll card">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Critère</th>
              <th>{pa.name}</th>
              <th>{pb.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>{r.label}</td>
                <td>{r.a}</td>
                <td>{r.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const selectStyle = {
  minHeight: 44,
  padding: "0 var(--s-2)",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--border)",
  background: "var(--surface-2)",
} as const;

const fieldStyle = {
  display: "grid",
  gap: 4,
  fontSize: "0.8125rem",
  color: "var(--text-dim)",
} as const;
