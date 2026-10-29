import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";
import { useStudio } from "../state/context";
import { PhoneFrame } from "../previews/PhoneFrame";
import { PATTERN_RENDERERS } from "../previews";
import type { SectionId } from "../nav";

interface Props {
  onNavigate: (id: SectionId) => void;
}

export function Home({ onNavigate }: Props) {
  const { state, favorites, creations, set } = useStudio();
  const recent = creations.slice(0, 3);
  const featured = ["liquid-glass", "gooey", "radial-menu"] as const;

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
          Explorez, modifiez, combinez, comparez — puis exportez du code réellement conforme à
          ce que vous voyez.
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

      {/* ------------------------------------------------ Statistiques réelles */}
      <div className="grid-stats">
        <Stat label="Patterns" value={String(12)} note="familles d'interaction" />
        <Stat label="Materials" value={String(9)} note="matières numériques" />
        <Stat label="Favorites" value={String(favorites.length)} note="patterns enregistrés" />
        <Stat label="Saved" value={String(creations.length)} note="créations personnelles" />
      </div>

      {/* -------------------------------------------- Familles d'interaction */}
      <div className="section-head">
        <h2>Sélection à découvrir</h2>
        <p className="muted">Aperçus animés en direct. Touchez pour lancer l'animation.</p>
      </div>

      <div className="grid-cards">
        {featured.map((id) => {
          const p = PATTERN_MAP[id];
          const Renderer = PATTERN_RENDERERS[id];
          return (
            <article key={id} className="card" style={{ display: "grid", gap: "var(--s-3)" }}>
              <div className="thumb">
                <div className="thumb__inner">
                  <Renderer bounce={0.5} />
                </div>
                <span className="thumb__label">{p.category}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="muted" style={{ fontSize: "0.8125rem" }}>{p.description}</p>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => {
                  set("pattern", id);
                  onNavigate("playground");
                }}
              >
                Try in Playground
              </button>
            </article>
          );
        })}
      </div>

      {/* --------------------------------------------- Dernières expérimentations */}
      <div className="section-head">
        <h2>Dernières expérimentations</h2>
        <p className="muted">Votre configuration courante et vos créations enregistrées.</p>
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
          <div className="knob-row" aria-hidden="true">
            <span className={`knob m m--${state.material}`} />
            <span className={`knob m m--${state.material}`} />
            <span className={`knob m m--${state.material}`} />
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
            </article>
          ))
        )}
      </div>

      {/* ---------------------------------------- Accès rapide aux favoris */}
      <div className="section-head">
        <h2>Accès rapide</h2>
      </div>
      <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
        <button type="button" className="btn" onClick={() => onNavigate("favorites")}>
          ★ Favorites ({favorites.length})
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("compare")}>
          Compare
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("export")}>
          Code Export
        </button>
        <button type="button" className="btn" onClick={() => onNavigate("docs")}>
          Documentation
        </button>
      </div>

      {/* --------------------------------------------- Familles d'interactions */}
      <div className="section-head">
        <h2>Familles d'interaction</h2>
        <p className="muted">Toutes implémentées avec de vrais composants HTML/CSS/JS.</p>
      </div>
      <div className="table-scroll card">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Famille</th>
              <th>Catégorie</th>
              <th>Complexité</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(PATTERN_MAP).map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="muted">{p.category}</td>
                <td className="muted">{p.complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Aperçu de la maquette</div>
        </div>
        <div className="panel__body">
          <PhoneFrame showBadges={false}>
            {(() => {
              const R = PATTERN_RENDERERS[state.pattern];
              return <R bounce={state.spring} />;
            })()}
          </PhoneFrame>
        </div>
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
