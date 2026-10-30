import { useRef, useState } from "react";
import { useStudio } from "../state/context";
import { clearAll, storageAvailable } from "../state/storage";
import { buildDataset, downloadDataset, parseDataset } from "../lib/dataset";
import { MATERIALS } from "../data/materials";

export function Settings() {
  const { state, reset, reducedMotion, setReducedMotion, favorites, creations, replaceAll, set } = useStudio();
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
          Sauvegarde de votre travail, confort visuel et diagnostic des matériaux.
        </p>
      </header>

      {/* ===================== DIAGNOSTIC TECHNIQUE =====================
          Lit le CSS RÉELLEMENT calculé par le navigateur sur l'élément du
          pattern, plutôt que ce que la feuille de style est censée contenir. */}
      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Diagnostic technique</div>
          <span className="chip">CSS calculé</span>
        </div>
        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.8125rem" }}>
            Ce bloc affiche les valeurs que le navigateur applique réellement à un conteneur de
            pattern. C'est la source de vérité : si <code>background-image</code> vaut
            <code> none</code> alors qu'un dégradé est attendu, une règle l'annule.
          </p>
          <pre
            style={{
              margin: 0,
              padding: "var(--s-3)",
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--border)",
              background: "#0b0a10",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              overflowX: "auto",
            }}
          >
            {(() => {
              if (typeof document === "undefined") return "(pas de DOM)";
              const el = document.querySelector(".parallax.m") as HTMLElement | null;
              if (!el) return "Aucun élément .parallax.m trouvé dans le DOM.";
              const cs = window.getComputedStyle(el);
              return [
                `classe      : ${el.className}`,
                `tag         : ${el.tagName.toLowerCase()}`,
                ``,
                `bg-color    : ${cs.backgroundColor}`,
                `bg-image    : ${cs.backgroundImage.slice(0, 100)}`,
                `border-top  : ${cs.borderTopColor}`,
                `opacity     : ${cs.opacity}`,
                `filter      : ${cs.filter}`,
                `isolation   : ${cs.isolation}`,
                `style inline: ${el.getAttribute("style") || "(aucun)"}`,
              ].join("\n");
            })()}
          </pre>
        </div>
      </div>

      {/* ====================== DIAGNOSTIC MATÉRIAUX ====================== */}
      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Diagnostic · les 9 matériaux</div>
          <span className="chip">actif : {state.material}</span>
        </div>
        <div className="panel__body">
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            Neuf blocs de grande surface, chacun avec sa classe de matériau. Touchez un bloc
            pour l'appliquer au Studio.
          </p>

          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            {MATERIALS.map((m) => {
              const active = m.id === state.material;
              return (
                <div key={m.id} style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.8125rem", fontWeight: active ? 600 : 400 }}>
                      {m.name}
                    </span>
                    <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                      .m--{m.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`m m--${m.id} shape--rounded`}
                    onClick={() => set("material", m.id)}
                    aria-pressed={active}
                    style={{
                      height: 86,
                      width: "100%",
                      display: "block",
                      border: active ? "2px solid var(--lime)" : undefined,
                      cursor: "pointer",
                    }}
                    title={`Appliquer ${m.name}`}
                  >
                    <span className="visually-hidden">Appliquer le matériau {m.name}</span>
                  </button>
                  <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                    {m.tagline}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ================= REPRODUCTION : conteneurs de pattern ================= */}
          <div style={{ display: "grid", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
            <div className="eyebrow">Reproduction · conteneurs de pattern</div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.8125rem" }}>Parallax — conteneur</span>
                <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                  .parallax m shape--rounded
                </span>
              </div>
              <div className="parallax m shape--rounded" style={{ height: 86 }}>
                <span className="parallax__layer" />
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.8125rem" }}>Sheet — conteneur</span>
                <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                  .sheet m shape--rounded
                </span>
              </div>
              <div className="sheet m shape--rounded" style={{ height: 86 }}>
                <div className="sheet__handle">
                  <span className="sheet__grip" />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.8125rem" }}>
                  Témoin <code>subject</code>
                </span>
                <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                  .subject m
                </span>
              </div>
              <div className="subject m shape--rounded" style={{ minHeight: 86, alignSelf: "stretch" }}>
                <span className="subject__label">Témoin</span>
              </div>
            </div>
          </div>

          <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
            Variables — accent {state.color} · blur {state.blur}px · alpha {state.transparency} · glow{" "}
            {state.glow} · matériau {state.material}
          </p>
        </div>
      </div>

      {/* ============================ SAUVEGARDE ============================ */}
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

      {/* ============================ CONFORT VISUEL ============================ */}
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

      {/* ============================ DONNÉES LOCALES ============================ */}
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
