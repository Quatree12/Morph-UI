import { useCallback, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { PatternProps } from "./types";

/** Trois paliers de hauteur, en pourcentage de la maquette. */
const SNAPS = [18, 52, 88];

export function SheetDrag({ bounce }: PatternProps) {
  const [snap, setSnap] = useState(0);
  const [dragY, setDragY] = useState<number | null>(null);
  const startY = useRef(0);

  const onDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    setDragY(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (dragY === null) return;
      setDragY(e.clientY - startY.current);
    },
    [dragY]
  );

  const onUp = useCallback(() => {
    if (dragY === null) return;
    // Seuil prudent : 40 px de déplacement pour changer de palier.
    const moved = dragY;
    if (moved < -40) setSnap((s) => Math.min(SNAPS.length - 1, s + 1));
    else if (moved > 40) setSnap((s) => Math.max(0, s - 1));
    setDragY(null);
  }, [dragY]);

  const height = SNAPS[snap]!;
  const liveHeight = dragY === null ? height : height - (dragY / 4);

  return (
    <div className="sheet-demo">      <button
        type="button"
        className="subject m shape--rounded"
        aria-expanded={snap > 0}
        aria-controls="sheet-panel"
        onClick={() => setSnap((s) => (s + 1) % SNAPS.length)}
        style={{ minWidth: 0, width: "100%", marginBottom: "var(--s-3)" }}
      >
        <span className="subject__label">Ouvrir le panneau</span>
        <span className="subject__sub" aria-hidden="true">
          palier {snap + 1}/{SNAPS.length}
        </span>
      </button>

      <div
        id="sheet-panel"
        className="sheet m shape--rounded"
        style={{ height: `${Math.max(14, liveHeight)}%` } as CSSProperties}
      >
        <div
          className="sheet__handle"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="separator"
          aria-label="Poignée du panneau : glisser vers le haut ou le bas"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") setSnap((s) => Math.min(SNAPS.length - 1, s + 1));
            if (e.key === "ArrowDown") setSnap((s) => Math.max(0, s - 1));
          }}
        >
          <span className="sheet__grip" aria-hidden="true" />
        </div>
        <p className="mono" style={{ padding: "var(--s-3)", fontSize: "0.6875rem", color: "var(--text-dim)" }}>
          Glissez la poignée, ou utilisez les flèches haut / bas au clavier.
        </p>
      </div>
    </div>
  );
}
