import { PATTERNS, PATTERN_MAP } from "../data/patterns";
import { MATERIALS, MATERIAL_MAP } from "../data/materials";
import { SHAPES } from "../data/shapes";
import { COLORS } from "../data/colors";
import { useStudio } from "../state/context";
import type { SectionId } from "../nav";

interface Props {
  onNavigate: (id: SectionId) => void;
}

export function Home({ onNavigate }: Props) {
  const { state, favorites, creations, set } = useStudio();
  const recent = creations.slice(0, 3);

  return (
    <section style={{ display: "grid", gap: "var(--s-6)" }}>
      {/* ------------------------------------------------------ Héro */}
      <header style={{ display: "grid", gap: "var(--s-4)", paddingTop: "var(--s-4)" }}>
        <div className="eyebrow">Experimental Design Atlas</div>
        <h1 style={{ maxWidth: "18ch" }}>
          MORPH<span style={{ color: "var(--accent)" }}>/</span>UI
        </h1>
        <p style={{ maxWidth: "58ch", fontSize: "1.0625rem", color: "var(--text-dim)" }}>
          Un laboratoire visuel et fonctionnel pour les patterns d'interaction contemporains.
          Explorez, modifiez, combinez — puis exportez du code réellement conforme à ce que
          vous voyez.
        </p>
        <p className="mono" style={{ color: "var(--accent)", fontSize: "0.8125rem" }}>
          Explore interactions. Bend materials. Shape interfaces.
        </p>
        <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
          <button type="button" className="btn btn--primary" onClick={() => onNavigate("explore")}>
            Explore Patterns
          </button>
          <button type="button" className="btn btn--lime" onClick={() => onNavigate("playground")}>
            Open Playground
          </button>
        </div>
      </header>

      {/* Statistiques calculées depuis le contenu réel, jamais en dur. */}
      <div className="grid-stats">
        <Stat label="Patterns" value={String(PATTERNS.length)} note="familles d'interaction" />
        <Stat label="Materials" value={String(MATERIALS.length)} note="matières numériques" />
        <Stat label="Shapes" value={String(SHAPES.length)} note="géométries d'objet" />
        <Stat label="Accents" value={String(COLORS.length)} note="couleurs d'accent" />
        <Stat label="Favorites" value={String(favorites.length)} note="patterns enregistrés" />
        <Stat label="Saved" value={String(creations.length)} note="créations personnelles" />
      </div>

      {/* --------------------------------------------- Dernières expérimentations */}
      <div className="section-head">
        <h2>Votre travail</h2>
        <p className="muted">La configuration courante et vos créations enregistrées.</p>
      </div>

      <div className="grid-cards">
        <article className="card" style={{ display: "grid", gap: "var(--s-3)" }}>
          <div className="eyebrow">Session en cours</div>
          <div style={{ display: "grid", gap: 4 }}>
            <span style={{ fontWeight: 600 }}>{PATTERN_MAP[state.pattern].name}</span>
            <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
              {MATERIAL_MAP[state.material].name} · {state.shape} · {state.color}
            </span>
          </div>
          <button type="button" className="btn btn--sm" onClick={() => onNavigate("playground")}>
            Reprendre dans le Studio
          </button>
        </article>

        {recent.length === 0 ? (
          <article className="card" style={{ display: "grid", gap: "var(--s-2)", alignContent: "start" }}>
            <div className="eyebrow">Saved</div>
            <p className="muted" style={{ fontSize: "0.8125rem" }}>
              Aucune création enregistrée pour l'instant. Nommez une configuration dans le Studio
              pour la retrouver ici.
            </p>
            <button type="button" className="btn btn--sm" onClick={() => onNavigate("playground")}>
              Créer une configuration
            </button>
          </article>
        ) : (
          recent.map((c) => (
            <article key={c.id} className="card" style={{ display: "grid", gap: "var(--s-2)" }}>
              <div className="eyebrow">Saved</div>
              <span style={{ fontWeight: 600 }}>{c.name}</span>
              <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
                {PATTERN_MAP[c.state.pattern].name} · {MATERIAL_MAP[c.state.material].name}
              </span>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => {
                  set("pattern", c.state.pattern);
                  onNavigate("playground");
                }}
              >
                Charger
              </button>
            </article>
          ))
        )}
      </div>

      {/* ---------------------------------------- Accès rapide */}
      <div className="section-head">
        <h2>Accès rapide</h2>
      </div>
      <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
        <button type="button" className="btn" onClick={() => onNavigate("favorites")}>
          ★ Favorites ({favorites.length})
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("export")}>
          Code Export
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("docs")}>
          Documentation
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("settings")}>
          Préférences
        </button>
      </div>
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="card" style={{ display: "grid", gap: 2 }}>
      <div className="eyebrow">{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.03em" }}>{value}</div>
      <div className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>{note}</div>
    </div>
  );
}
