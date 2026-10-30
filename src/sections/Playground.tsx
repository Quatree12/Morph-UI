import { useEffect, useState } from "react";
import { useStudio } from "../state/context";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";
import { PhoneFrame } from "../previews/PhoneFrame";
import { PATTERN_RENDERERS, GooFilter } from "../previews";
import { Group, AdvancedControls } from "../components/Controls";
import { PatternPicker, MaterialPicker, ShapePicker, ColorPicker, PatternInfo } from "../components/LibraryControls";

export function Playground() {
  const { state, reset, saveCreation } = useStudio();
  const [fullscreen, setFullscreen] = useState(false);
  const [name, setName] = useState("");
  const Renderer = PATTERN_RENDERERS[state.pattern];
  const pattern = PATTERN_MAP[state.pattern];

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <GooFilter />

      <header className="section-head">
        <div className="eyebrow">Playground / Component Studio</div>
        <h1>Studio</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Pattern actif : <strong>{pattern.name}</strong>, matériau{" "}
          <strong>{MATERIAL_MAP[state.material].name}</strong>.
        </p>
      </header>

      {/* Maquette collante : elle reste visible pendant qu'on règle. */}
      <div className="studio-preview">
        <div className="panel">
          <div className="panel__head">
            <div className="eyebrow">Live Preview</div>
            <div style={{ display: "flex", gap: "var(--s-2)", flexShrink: 0 }}>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => setFullscreen(true)}
                aria-haspopup="dialog"
                title="Agrandir l'aperçu"
              >
                <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>⤢</span>
                <span className="visually-hidden">Agrandir l'aperçu</span>
              </button>
              <button type="button" className="btn btn--sm btn--ghost" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
          <div className="panel__body">
            {/* Aucune consigne générique ici : chaque pattern affiche la sienne,
                exacte, dans son propre sous-titre. */}
            <PhoneFrame>
              <Renderer bounce={state.spring} />
            </PhoneFrame>
          </div>
        </div>
      </div>

      <div className="studio-controls">
        <div className="panel">
          <div className="panel__head">
            <div className="eyebrow">Réglages</div>
          </div>
          <div className="panel__body">
            <PatternPicker />
            <MaterialPicker />
            <ShapePicker />
            <ColorPicker />
            <Group title="Advanced" badge="8 + Anchor" defaultOpen={false}>
              <AdvancedControls />
            </Group>
          </div>
        </div>

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
              Persistance locale sur cet appareil. L'export/import se fait dans Settings.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ Plein écran */}
      {fullscreen && (
        <div
          className="preview-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu en plein écran"
        >
          <div className="preview-fullscreen__bar">
            <span className="eyebrow">
              {pattern.name} · {MATERIAL_MAP[state.material].name}
            </span>
            <button
              type="button"
              className="btn btn--sm"
              onClick={() => setFullscreen(false)}
              autoFocus
            >
              Fermer
            </button>
          </div>
          <div className="preview-fullscreen__stage">
            <PhoneFrame>
              <Renderer bounce={state.spring} />
            </PhoneFrame>
          </div>
        </div>
      )}
    </section>
  );
}
