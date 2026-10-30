import { useCallback, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { PatternProps } from "./types";

const CARDS = ["Première carte", "Deuxième carte", "Troisième carte"];

export function SwipeStack({ bounce }: PatternProps) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const startX = useRef(0);

  const onDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    setDx(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    setDx(e.clientX - startX.current);
  }, []);

  const commit = useCallback((dir: -1 | 1) => {
    setIndex((i) => (i + 1) % CARDS.length);
    setDx(0);
    void dir;
  }, []);

  const onUp = useCallback(() => {
    // Seuil prudent : 40 px de déplacement.
    if (Math.abs(dx) > 40) commit(dx > 0 ? 1 : -1);
    else setDx(0);
  }, [dx, commit]);

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", width: "100%", justifyItems: "center" }}>
      <div className="stack-demo">
        {CARDS.map((label) => {
          const depth = (CARDS.indexOf(label) - index + CARDS.length) % CARDS.length;
          const top = depth === 0;
          return (
            <div
              key={label}
              /* Seule la carte du dessus porte le matériau : les cartes
                 empilées dessous ne doivent pas recouvrir sa texture. */
              className={`stack-demo__card shape--rounded${top ? " m" : ""}`}
              style={
                {
                  transform: top
                    ? `translateX(${dx}px) rotate(${dx * 0.06 * (1 + bounce)}deg)`
                    : `translateY(${depth * -8}px) scale(${1 - depth * 0.06})`,
                  zIndex: CARDS.length - depth,
                  opacity: depth > 2 ? 0 : 1,
                  /* Les cartes non actives : contour seul, sans fond opaque. */
                  background: top ? undefined : "transparent",
                  border: top ? undefined : "1px solid var(--border)",
                } as CSSProperties
              }
              onPointerDown={top ? onDown : undefined}
              onPointerMove={top ? onMove : undefined}
              onPointerUp={top ? onUp : undefined}
              onPointerCancel={top ? onUp : undefined}
            >
              <span className="subject__label" style={{ fontSize: "0.8125rem" }}>{label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "var(--s-2)" }}>
        <button type="button" className="btn btn--sm" onClick={() => commit(-1)}>
          ← Rejeter
        </button>
        <button type="button" className="btn btn--sm btn--primary" onClick={() => commit(1)}>
          Valider →
        </button>
      </div>

      <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-dim)" }} aria-live="polite">
        Carte {index + 1} sur {CARDS.length} — glisser ou utiliser les boutons
      </p>
    </div>
  );
}
