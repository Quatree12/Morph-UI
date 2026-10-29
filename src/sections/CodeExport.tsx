import { useState } from "react";
import { useStudio } from "../state/context";
import { exportCss, exportFramer, exportReact, exportLimitations } from "../lib/exporters";
import { CopyButton } from "../components/ClipboardButton";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";

type Format = "css" | "react" | "framer";

const FORMATS: Array<{ id: Format; label: string; hint: string }> = [
  { id: "css", label: "CSS", hint: "Styles, matériau, ombres, transitions et états actifs." },
  { id: "react", label: "React", hint: "Structure du composant, état et attributs d'accessibilité." },
  { id: "framer", label: "Framer Motion", hint: "Structure React + animations et transitions physiques." },
];

export function CodeExport() {
  const { state } = useStudio();
  const [format, setFormat] = useState<Format>("css");

  const code =
    format === "css" ? exportCss(state) : format === "react" ? exportReact(state) : exportFramer(state);
  const limitations = exportLimitations(state);
  const active = FORMATS.find((f) => f.id === format)!;

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Code Export / Developer Handoff</div>
        <h1>Developer Handoff</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Le code ci-dessous est généré depuis la configuration courante :{" "}
          <strong>{PATTERN_MAP[state.pattern].name}</strong>, matériau{" "}
          <strong>{MATERIAL_MAP[state.material].name}</strong>, accent{" "}
          <strong>{state.color}</strong>.
        </p>
      </header>

      <div className="panel">
        <div className="panel__head" style={{ flexWrap: "wrap", gap: "var(--s-2)" }}>
          <div className="tabs" role="tablist" aria-label="Format d'export">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={f.id === format}
                className="tabs__btn"
                onClick={() => setFormat(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <CopyButton getText={() => code} label="Copier le code" />
        </div>

        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.8125rem" }}>{active.hint}</p>

          <pre
            style={{
              margin: 0,
              padding: "var(--s-3)",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border)",
              background: "#0b0a10",
              overflowX: "auto",
              maxWidth: "100%",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              lineHeight: 1.65,
              color: "var(--text-dim)",
            }}
            tabIndex={0}
            aria-label={`Code ${active.label} généré`}
          >
            <code>{code}</code>
          </pre>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Limitations assumées de cet export</div>
        </div>
        <div className="panel__body">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, color: "var(--text-dim)", fontSize: "0.8125rem" }}>
            {limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
