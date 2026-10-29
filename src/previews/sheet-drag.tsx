import { useCallback, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

/** Trois paliers, en pixels réels de la maquette. */
const SNAPS = [110, 240, 380];

export function SheetDrag({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [snap, setSnap] = useState(0);
  const [dragY, setDragY] = useState<number | null>(null);
  const startY = useRef(0);

  const fromTop = state.anchor === "top";
  // Sens du geste : vers le haut quand la feuille est ancrée en bas.
  const openDir = fromTop ? 1 : -1;

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
    // Le seuil suit le réglage Spring/Bounce : plus de rebond, geste plus vif.
    const threshold = 40 - bounce * 12;
    const moved = dragY * openDir;
    if (moved > threshold) setSnap((s) => Math.min(SNAPS.length - 1, s + 1));
    else if (moved < -threshold) setSnap((s) => Math.max(0, s - 1));
    setDragY(null);
  }, [dragY, openDir, bounce]);

  // Hauteur vivante : pendant le geste, on suit le doigt.
  const basePx = SNAPS[snap]!;
  const livePx = dragY === null ? basePx : Math.max(60, basePx - dragY * openDir * 0.8);

  return (
    <div className={`sheet-demo${fromTop ? " sheet-demo--top" : ""}`}>
      <button
        type="button"
        className="subject m shape--rounded"
        aria-expanded={snap > 0}
        aria-controls="sheet-panel"
        onClick={() => setSnap((s) => (s + 1) % SNAPS.length)}
        style={{ minWidth: 0, width: "100%" }}
      >
        <span className="subject__label">Ouvrir le panneau</span>
        <span className="subject__sub" aria-hidden="true">
          palier {snap + 1}/{SNAPS.length} · {state.anchor}
        </span>
      </button>

      <div
        id="sheet-panel"
        className="sheet m shape--rounded"
        style={
          {
            height: `${livePx}px`,
            "--sheet-open-dir": openDir,
          } as CSSProperties
        }
      >
        <div
          className="sheet__handle"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          role="separator"
          aria-label="Poignée du panneau : glisser pour changer de palier"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") setSnap((s) => Math.min(SNAPS.length - 1, s + 1));
            if (e.key === "ArrowDown") setSnap((s) => Math.max(0, s - 1));
          }}
        >
          <span className="sheet__grip" aria-hidden="true" />
        </div>
        <p
          className="mono"
          style={{
            padding: "0 var(--s-3) var(--s-3)",
            fontSize: "0.6875rem",
            color: "var(--text-dim)",
            margin: 0,
          }}
        >
          {fromTop
            ? "Glissez vers le bas, ou flèches bas / haut."
            : "Glissez vers le haut, ou flèches haut / bas."}
        </p>
      </div>
    </div>
  );
}
