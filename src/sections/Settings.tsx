import { useState } from "react";
import { useStudio } from "../state/context";
import { clearAll, storageAvailable } from "../state/storage";
import { DEFAULT_STATE } from "../state/defaults";

export function Settings() {
  const { state, reset, reducedMotion, setReducedMotion, favorites, creations } = useStudio();
  const [hasStorage] = useState(() => storageAvailable());
  const [confirming, setConfirming] = useState(false);

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Settings / Preferences</div>
        <h1>Préférences</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Préférences d'application et état des données locales.
        </p>
      </header>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Confort visuel</div>
        </div>
        <div className="panel__body">
          <label style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", minHeight: 44, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              style={{ width: 22, height: 22, accentColor: "var(--accent)" }}
            />
            <span>
              <span style={{ display: "block" }}>Réduire les animations</span>
              <span className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
                Force le mode mouvement réduit sans dépendre du réglage système. Utile pour tester.
              </span>
            </span>
          </label>
          <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
            Le réglage système <code>prefers-reduced-motion</code> est respecté automatiquement,
            indépendamment de cette case.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Configuration courante</div>
        </div>
        <div className="panel__body">
          <div className="table-scroll">
            <table className="doc-table">
              <tbody>
                <tr><td className="muted">Pattern</td><td className="mono">{state.pattern}</td></tr>
                <tr><td className="muted">Material</td><td className="mono">{state.material}</td></tr>
                <tr><td className="muted">Shape</td><td className="mono">{state.shape}</td></tr>
                <tr><td className="muted">Color</td><td className="mono">{state.color} ({state.colorPreset})</td></tr>
                <tr><td className="muted">Blur</td><td className="mono">{state.blur}px</td></tr>
                <tr><td className="muted">Animation Speed</td><td className="mono">{state.speed}×</td></tr>
                <tr><td className="muted">Border Radius</td><td className="mono">{state.radius}px</td></tr>
                <tr><td className="muted">Shadow / Glow</td><td className="mono">{state.shadow} / {state.glow}</td></tr>
                <tr><td className="muted">Transparency</td><td className="mono">{state.transparency}</td></tr>
                <tr><td className="muted">Spring / Size</td><td className="mono">{state.spring} / {state.size}×</td></tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => reset()}
          >
            Restaurer les valeurs par défaut ({DEFAULT_STATE.pattern}, {DEFAULT_STATE.material}, {DEFAULT_STATE.shape})
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Données locales</div>
        </div>
        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            Stockage local de ce navigateur. <strong>{favorites.length}</strong> favori
            {favorites.length > 1 ? "s" : ""} et <strong>{creations.length}</strong> création
            {creations.length > 1 ? "s" : ""} enregistrés.
          </p>
          <p className="mono" style={{ fontSize: "0.6875rem", color: hasStorage ? "var(--lime)" : "#FF6B6B" }}>
            {hasStorage
              ? "localStorage disponible : les données survivent au rechargement."
              : "localStorage indisponible (navigation privée ?) : les données seront perdues au rechargement."}
          </p>
          <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
            Aucune synchronisation distante : ce projet n'a ni compte ni serveur. Les données
            restent sur cet appareil, et rien n'est envoyé ailleurs.
          </p>

          {confirming ? (
            <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-dim)" }}>
                Effacer favoris et créations ?
              </span>
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => {
                  clearAll();
                  window.location.reload();
                }}
              >
                Oui, effacer
              </button>
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirming(false)}>
                Annuler
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirming(true)}>
              Effacer favoris et créations
            </button>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Limites connues de ce prototype</div>
        </div>
        <div className="panel__body">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, color: "var(--text-dim)", fontSize: "0.875rem" }}>
            <li>Pas de backend ni d'authentification : la persistance est locale, il n'y a donc pas de synchronisation entre appareils.</li>
            <li>L'export React et Framer Motion fournit l'ossature du composant principal, pas les comportements multi-éléments (métaballes, menu radial, dock).</li>
            <li>Le rendu dépend du support de <code>backdrop-filter</code>, <code>color-mix()</code> et des filtres SVG par le navigateur ; des replis existent mais altèrent l'aspect.</li>
            <li>Aucun test automatisé n'est fourni : les vérifications manuelles sont documentées dans le README.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
