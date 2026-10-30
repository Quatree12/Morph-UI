import { useState } from "react";
import { useStudio } from "../state/context";
import {
  exportCss,
  exportFramer,
  exportReact,
  exportTailwind,
  exportLimitations,
} from "../lib/exporters";
import { downloadCode } from "../lib/download";
import type { ExportFormat } from "../lib/download";
import { CopyButton } from "../components/ClipboardButton";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";

const FORMATS: Array<{ id: ExportFormat; label: string; hint: string; file: string }> = [
  {
    id: "css",
    label: "CSS",
    hint: "Styles, matériau, ombres, transitions et états actifs.",
    file: "un fichier .css",
  },
  {
    id: "tailwind",
    label: "Tailwind",
    hint: "Classes utilitaires en valeurs arbitraires, avec la correspondance des réglages.",
    file: "un fichier .jsx",
  },
  {
    id: "react",
    label: "React",
    hint: "Structure du composant, état et attributs d'accessibilité.",
    file: "un fichier .tsx",
  },
  {
    id: "framer",
    label: "Framer Motion",
    hint: "Structure React + animations et transitions physiques.",
    file: "un fichier .tsx",
  },
];

export function CodeExport() {
  const { state } = useStudio();
  const [format, setFormat] = useState<ExportFormat>("css");
  const [saved, setSaved] = useState<string | null>(null);

  const code =
    format === "css"
      ? exportCss(state)
      : format === "tailwind"
        ? exportTailwind(state)
        : format === "react"
          ? exportReact(state)
          : exportFramer(state);

  const limitations = exportLimitations(state, format);
  const active = FORMATS.find((f) => f.id === format)!;
  const pattern = PATTERN_MAP[state.pattern];

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Code Export / Developer Handoff</div>
        <h1>Developer Handoff</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Le code ci-dessous est généré depuis la configuration courante :{" "}
          <strong>{pattern.name}</strong>, matériau{" "}
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
                onClick={() => {
                  setFormat(f.id);
                  setSaved(null);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.8125rem" }}>{active.hint}</p>

          <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap", alignItems: "center" }}>
            <CopyButton getText={() => code} label="Copier le code" />
            <button
              type="button"
              className="btn btn--sm btn--outline"
              onClick={() => {
                downloadCode(format, state.pattern, code);
                setSaved(active.file);
              }}
            >
              Télécharger {active.file}
            </button>
            {saved && (
              <span
                role="status"
                aria-live="polite"
                className="mono"
                style={{ fontSize: "0.6875rem", color: "var(--brand-light)" }}
              >
                Fichier généré.
              </span>
            )}
          </div>

          <pre
            style={{
              margin: 0,
              padding: "var(--s-3)",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border)",
              background: "#0b0b0c",
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

      <Group title="Limitations assumées de cet export" badge={String(limitations.length)}>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            display: "grid",
            gap: 8,
            color: "var(--text-dim)",
            fontSize: "0.8125rem",
          }}
        >
          {limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </Group>
    </section>
  );
}
