import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

const MIN = 0;
const MAX = 100;

/** Un curseur de pâte : la bille s'écrase quand on la pousse. */
export function ClaySlider({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [value, setValue] = useState(42);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateFromX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setValue(Math.round(MIN + ratio * (MAX - MIN)));
  }, []);

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromX(e.clientX);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromX(e.clientX);
  };

  const onUp = () => setDragging(false);

  const ratio = (value - MIN) / (MAX - MIN);

  return (
    <div style={{ display: "grid", gap: "var(--s-4)", width: "100%", maxWidth: 220, justifyItems: "center" }}>
      <div
        ref={trackRef}
        className={`clay-slider__track m m--${state.material}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        role="slider"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-label="Curseur de pâte"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setValue((v) => Math.min(MAX, v + 5));
          if (e.key === "ArrowLeft") setValue((v) => Math.max(MIN, v - 5));
        }}
      >
        <span
          className="clay-slider__fill"
          style={{ width: `${ratio * 100}%` }}
          aria-hidden="true"
        />
        <span
          className={`clay-slider__ball m m--${state.material}`}
          aria-hidden="true"
          style={{
            left: `${ratio * 100}%`,
            transform: `translate(-50%, -50%) scaleX(${dragging ? 1.18 : 1}) scaleY(${dragging ? 0.86 : 1})`,
          }}
        />
      </div>

      <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }} aria-live="polite">
        Valeur : {value} — écrasement ×{(1 + bounce * 0.2).toFixed(2)}
      </p>
    </div>
  );
}
