import { PATTERNS, PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";
import { useStudio } from "../state/context";
import type { SectionId } from "../nav";

interface Props {
  onNavigate: (id: SectionId) => void;
}

export function Favorites({ onNavigate }: Props) {
  const { favorites, toggleFavorite, creations, deleteCreation, duplicateCreation, loadCreation, set } = useStudio();
  const favPatterns = PATTERNS.filter((p) => favorites.includes(p.id));

  return (
    <section style={{ display: "grid", gap: "var(--s-6)" }}>
      <header className="section-head">
        <div className="eyebrow">Favorites / Saved Patterns</div>
        <h1>Favoris &amp; créations</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Favoris et créations sont conservés dans le stockage local de ce navigateur. L'export et
          l'import se font dans Settings.
        </p>
      </header>

      <div className="section-head">
        <h2>Patterns favoris</h2>
        <p className="muted" aria-live="polite">
          {favPatterns.length} pattern{favPatterns.length > 1 ? "s" : ""} enregistré
          {favPatterns.length > 1 ? "s" : ""}.
        </p>
      </div>

      {favPatterns.length === 0 ? (
        <div className="card" style={{ padding: "var(--s-6)", textAlign: "center" }}>
          <p className="muted">Aucun favori pour le moment.</p>
          <button
            type="button"
            className="btn btn--sm btn--primary"
            style={{ marginTop: "var(--s-3)" }}
            onClick={() => onNavigate("explore")}
          >
            Explorer la bibliothèque
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {favPatterns.map((p) => (
            <article key={p.id} className="card" style={{ display: "grid", gap: "var(--s-3)" }}>
              <div>
                <div className="eyebrow">{p.category}</div>
                <h3 style={{ marginTop: 4 }}>{p.name}</h3>
              </div>
              <p className="muted" style={{ fontSize: "0.8125rem" }}>{p.description}</p>
              <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn--sm btn--primary"
                  onClick={() => {
                    /* Correction : on sélectionne réellement le pattern AVANT
                       de naviguer, sinon le Studio reste sur le précédent. */
                    set("pattern", p.id);
                    onNavigate("playground");
                  }}
                >
                  Ouvrir dans le Studio
                </button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => toggleFavorite(p.id)}>
                  ★ Retirer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="section-head">
        <h2>Créations enregistrées</h2>
        <p className="muted">
          {creations.length} configuration{creations.length > 1 ? "s" : ""} sauvegardée
          {creations.length > 1 ? "s" : ""}.
        </p>
      </div>

      {creations.length === 0 ? (
        <div className="card" style={{ padding: "var(--s-6)", textAlign: "center" }}>
          <p className="muted">
            Aucune création. Dans le Studio, nommez la configuration courante puis enregistrez-la.
          </p>
          <button
            type="button"
            className="btn btn--sm btn--primary"
            style={{ marginTop: "var(--s-3)" }}
            onClick={() => onNavigate("playground")}
          >
            Ouvrir le Studio
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {creations.map((c) => (
            <article key={c.id} className="card" style={{ display: "grid", gap: "var(--s-2)" }}>
              <div className="eyebrow">{new Date(c.createdAt).toLocaleDateString("fr-CH")}</div>
              <h3>{c.name}</h3>
              <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
                {PATTERN_MAP[c.state.pattern].name} · {MATERIAL_MAP[c.state.material].name} · {c.state.shape}
              </span>

              <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap", marginTop: "var(--s-2)" }}>
                <button
                  type="button"
                  className="btn btn--sm btn--primary"
                  onClick={() => {
                    loadCreation(c.id);
                    onNavigate("playground");
                  }}
                >
                  Charger
                </button>
                <button type="button" className="btn btn--sm" onClick={() => duplicateCreation(c.id)}>
                  Dupliquer
                </button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => deleteCreation(c.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
