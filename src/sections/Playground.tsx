import { useState } from "react";
import { useStudio } from "../state/context";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";
import { PhoneFrame } from "../previews/PhoneFrame";
import { PATTERN_RENDERERS, GooFilter } from "../previews";
import { Group, AdvancedControls } from "../components/Controls";
import { PatternPicker, MaterialPicker, ShapePicker, ColorPicker, PatternInfo } from "../components/LibraryControls";

export function Playground() {
  const { state, reset, saveCreation } = useStudio();
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const Renderer = PATTERN_RENDERERS[state.pattern];
  const pattern = PATTERN_MAP[state.pattern];

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <GooFilter />

      <header className="section-head">
        <div className="eyebrow">Playground / Component Studio</div>
        <h1>Studio</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Réglez à gauche, observez au centre : chaque contrôle écrit une variable CSS réellement
          consommée par la maquette. Pattern actif : <strong>{pattern.name}</strong>, matériau{" "}
          <strong>{MATERIAL_MAP[state.material].name}</strong>.
        </p>
      </header>

      {/* La maquette passe en premier sur mobile : ordre DOM = ordre de lecture. */}
      <div className="studio">
        <div className="panel" style={{ order: 2 }}>
          <div className="panel__head">
            <div className="eyebrow">Réglages</div>
            <button type="button" className="btn btn--sm btn--ghost" onClick={reset}>
              Reset
            </button>
          </div>
          <div className="panel__body">
            <PatternPicker />
            <MaterialPicker />
            <ShapePicker />
            <ColorPicker />
            <Group title="Advanced" badge="8" defaultOpen={false}>
              <AdvancedControls />
            </Group>
          </div>
        </div>

        <div className="panel" style={{ order: 1, display: "grid", gap: "var(--s-3)" }}>
          <div className="panel__head">
            <div className="eyebrow">Live Preview</div>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => setExpanded((v) => !v)}
              aria-pressed={expanded}
            >
              {expanded ? "Réduire" : "Agrandir"}
            </button>
          </div>
          <div className="panel__body">
            <PhoneFrame expanded={expanded}>
              <Renderer bounce={state.spring} />
            </PhoneFrame>
            <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)", textAlign: "center" }}>
              Interactions réelles : touchez les composants dans la maquette.
            </p>
          </div>
        </div>

        <div style={{ order: 3, display: "grid", gap: "var(--s-4)" }}>
          <PatternInfo />

          <div className="panel">
            <div className="panel__head">
              <div className="eyebrow">Save creation</div>
            </div>
            <div className="panel__body">
              <label htmlFor="creation-name" style={{ fontSize: "0.8125rem", color: "var(--text-dim)" }}>
                Nom de la configuration
              </label>
              <input
                id="creation-name"
                type="text"
                value={name}
                placeholder="Ex. Dock néon lime"
                onChange={(e) => setName(e.target.value)}
                style={{
                  minHeight: 44,
                  padding: "0 var(--s-3)",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                }}
              />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  saveCreation(name);
                  setName("");
                }}
              >
                Enregistrer dans Saved
              </button>
              <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                Persistance locale (localStorage) sur cet appareil. Aucune synchronisation distante.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
