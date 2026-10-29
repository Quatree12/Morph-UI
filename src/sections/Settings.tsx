import { useRef, useState } from "react";
import { useStudio } from "../state/context";
import { clearAll, storageAvailable } from "../state/storage";
import { buildDataset, downloadDataset, parseDataset } from "../lib/dataset";

export function Settings() {
  const { state, reset, reducedMotion, setReducedMotion, favorites, creations, replaceAll } = useStudio();
  const [hasStorage] = useState(() => storageAvailable());
  const [confirming, setConfirming] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onExport = () => {
    downloadDataset(buildDataset(favorites, creations, state));
    setFeedback({ kind: "ok", msg: "Fichier téléchargé." });
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    const result = parseDataset(text);
    if (!result.ok) {
      setFeedback({ kind: "err", msg: result.error });
      return;
    }
    replaceAll({
      favorites: result.data.favorites,
      creations: result.data.creations,
      currentState: result.data.currentState,
    });
    setFeedback({
      kind: "ok",
      msg: `Importé : ${result.data.favorites.length} favori(s), ${result.data.creations.length} création(s).`,
    });
  };

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Settings / Preferences</div>
        <h1>Préférences</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Sauvegarde de votre travail et confort visuel.
        </p>
      </header>

      {/* ---------------------------------------------------- Import / export */}
      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Sauvegarde · import / export</div>
        </div>
        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            Exportez vos favoris, vos créations et votre configuration courante dans un fichier
            JSON. Réimportez-le sur un autre appareil pour tout retrouver à l'identique.
          </p>

          <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
            <button type="button" className="btn btn--primary" onClick={onExport}>
              Exporter en .json
            </button>

            <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
              Importer un .json
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onImportFile(f);
                e.target.value = "";
              }}
            />
          </div>

          {feedback && (
            <p
              role="status"
              aria-live="polite"
              className="mono"
              style={{
                fontSize: "0.75rem",
                color: feedback.kind === "ok" ? "var(--lime)" : "#FF6B6B",
              }}
            >
              {feedback.msg}
            </p>
          )}

          <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
            Format versionné (v1). Un fichier étranger ou corrompu est refusé avec un message
            explicite, et vos données existantes ne sont pas écrasées.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------- Confort visuel */}
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
                Force le mode mouvement réduit. Utile pour vérifier qu'un pattern reste
                compréhensible sans animation.
              </span>
            </span>
          </label>
          <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-faint)" }}>
            Le réglage système <code>prefers-reduced-motion</code> est respecté automatiquement,
            indépendamment de cette case.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ Données locales */}
      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Données locales</div>
        </div>
        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            <strong>{favorites.length}</strong> favori{favorites.length > 1 ? "s" : ""} et{" "}
            <strong>{creations.length}</strong> création{creations.length > 1 ? "s" : ""} enregistrés
            sur cet appareil.
          </p>
          <p className="mono" style={{ fontSize: "0.6875rem", color: hasStorage ? "var(--lime)" : "#FF6B6B" }}>
            {hasStorage
              ? "localStorage disponible : les données survivent au rechargement."
              : "localStorage indisponible (navigation privée ?) : les données seront perdues. Exportez votre fichier avant de fermer."}
          </p>

          <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="btn btn--sm btn--ghost" onClick={reset}>
              Restaurer les réglages par défaut
            </button>

            {confirming ? (
              <>
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
              </>
            ) : (
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirming(true)}>
                Effacer favoris et créations
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
