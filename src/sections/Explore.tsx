import { useMemo, useState } from "react";
import { PATTERNS, CATEGORIES, COMPLEXITIES } from "../data/patterns";
import type { PatternDef } from "../data/patterns";
import { useStudio } from "../state/context";
import type { Complexity, PatternId } from "../state/types";
import type { SectionId } from "../nav";

interface Props {
  onNavigate: (id: SectionId) => void;
}

/** Motif statique : une silhouette par catégorie. Le visuel animé vit dans
 *  le Studio — Explore sert à choisir, pas à contempler. */
function Motif({ category }: { category: string }) {
  const slug = category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  return (
    <div className="thumb" aria-hidden="true">
      <div className={`motif motif--${slug}`} />
      <span className="thumb__label">{category}</span>
    </div>
  );
}

export function Explore({ onNavigate }: Props) {
  const { favorites, toggleFavorite, isFavorite, set } = useStudio();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [cpx, setCpx] = useState<Complexity | "all">("all");
  const [ctx, setCtx] = useState<string>("all");
  const [sort, setSort] = useState<"alpha" | "category">("alpha");
  const [onlyFav, setOnlyFav] = useState(false);

  const contexts = useMemo(
    () => Array.from(new Set(PATTERNS.flatMap((p) => p.contexts))).sort((a, b) => a.localeCompare(b, "fr")),
    []
  );

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out: PatternDef[] = PATTERNS.filter((p) => {
      if (onlyFav && !favorites.includes(p.id)) return false;
      if (cat !== "all" && p.category !== cat) return false;
      if (cpx !== "all" && p.complexity !== cpx) return false;
      if (ctx !== "all" && !p.contexts.includes(ctx)) return false;
      if (needle) {
        const hay = `${p.name} ${p.category} ${p.description} ${p.useCases.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    return [...out].sort((a, b) =>
      sort === "alpha" ? a.name.localeCompare(b.name, "fr") : a.category.localeCompare(b.category, "fr")
    );
  }, [q, cat, cpx, ctx, sort, onlyFav, favorites]);

  const resetFilters = () => {
    setQ("");
    setCat("all");
    setCpx("all");
    setCtx("all");
    setOnlyFav(false);
  };

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Explore / Pattern Library</div>
        <h1>Pattern Library</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          {PATTERNS.length} familles d'interaction. Chaque fiche mène au Studio, où le pattern
          s'anime réellement dans la maquette — ici, on choisit.
        </p>
      </header>

      <div className="panel">
        <div className="panel__body" style={{ gap: "var(--s-3)" }}>
          <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un pattern…"
              aria-label="Rechercher un pattern"
              style={{
                flex: "1 1 220px",
                minHeight: 44,
                padding: "0 var(--s-3)",
                borderRadius: "var(--r-sm)",
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
              }}
            />
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrer par catégorie" style={selectStyle}>
              <option value="all">Toutes catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={cpx}
              onChange={(e) => setCpx(e.target.value as Complexity | "all")}
              aria-label="Filtrer par complexité"
              style={selectStyle}
            >
              <option value="all">Toute complexité</option>
              {COMPLEXITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={ctx} onChange={(e) => setCtx(e.target.value)} aria-label="Filtrer par contexte" style={selectStyle}>
              <option value="all">Tout contexte</option>
              {contexts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "alpha" | "category")}
              aria-label="Trier"
              style={selectStyle}
            >
              <option value="alpha">Tri alphabétique</option>
              <option value="category">Tri par catégorie</option>
            </select>
            <button
              type="button"
              className="btn btn--sm"
              aria-pressed={onlyFav}
              onClick={() => setOnlyFav((v) => !v)}
              style={onlyFav ? { borderColor: "var(--accent)", background: "color-mix(in srgb, var(--accent) 18%, transparent)" } : undefined}
            >
              ★ Favorites ({favorites.length})
            </button>
          </div>

          <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }} aria-live="polite">
            {list.length} pattern{list.length > 1 ? "s" : ""} affiché{list.length > 1 ? "s" : ""} sur {PATTERNS.length}
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "var(--s-7)" }}>
          <p className="muted">Aucun pattern ne correspond à ces filtres.</p>
          <button type="button" className="btn btn--sm" style={{ marginTop: "var(--s-3)" }} onClick={resetFilters}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {list.map((p) => (
            <article key={p.id} className="card" style={{ display: "grid", gap: "var(--s-3)", alignContent: "start" }}>
              <Motif category={p.category} />

              <div>
                <h3>{p.name}</h3>
                <div className="eyebrow" style={{ marginTop: 4 }}>
                  {p.category} · {p.complexity}
                </div>
              </div>

              <p className="muted" style={{ fontSize: "0.8125rem" }}>{p.description}</p>

              <details>
                <summary className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-dim)", cursor: "pointer" }}>
                  Détails, cas d'usage, accessibilité
                </summary>
                <div style={{ display: "grid", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                  <div>
                    <div className="eyebrow">Cas d'usage</div>
                    <ul style={ulStyle}>{p.useCases.map((u) => <li key={u}>{u}</li>)}</ul>
                  </div>
                  <div>
                    <div className="eyebrow">Mobile / Desktop</div>
                    <p style={smallStyle}>{p.mobile}</p>
                    <p style={smallStyle}>{p.desktop}</p>
                  </div>
                  <div>
                    <div className="eyebrow">Avantages</div>
                    <ul style={ulStyle}>{p.pros.map((u) => <li key={u}>{u}</li>)}</ul>
                  </div>
                  <div>
                    <div className="eyebrow">Limites</div>
                    <ul style={ulStyle}>{p.cons.map((u) => <li key={u}>{u}</li>)}</ul>
                  </div>
                  <div>
                    <div className="eyebrow">Accessibilité</div>
                    <ul style={ulStyle}>{p.a11y.map((u) => <li key={u}>{u}</li>)}</ul>
                  </div>
                </div>
              </details>

              <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn--sm btn--primary"
                  onClick={() => {
                    set("pattern", p.id as PatternId);
                    onNavigate("playground");
                  }}
                >
                  Try in Playground
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  aria-pressed={isFavorite(p.id)}
                  onClick={() => toggleFavorite(p.id)}
                  style={isFavorite(p.id) ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}
                >
                  {isFavorite(p.id) ? "★ Retirer" : "☆ Favori"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const selectStyle = {
  minHeight: 44,
  padding: "0 var(--s-2)",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--border)",
  background: "var(--surface-2)",
  fontSize: "0.8125rem",
} as const;

const ulStyle = {
  margin: 0,
  paddingLeft: 18,
  fontSize: "0.8125rem",
  color: "var(--text-dim)",
  display: "grid",
  gap: 3,
} as const;

const smallStyle = { fontSize: "0.8125rem", color: "var(--text-dim)" } as const;
