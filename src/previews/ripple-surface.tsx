import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/** Une onde concentrique part du point touché et se propage. */
export function RippleSurface({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [count, setCount] = useState(0);

  const addRipple = useCallback((clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((prev) => [
      ...prev.slice(-2),
      {
        id,
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      },
    ]);
    setCount((c) => c + 1);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  }, []);

  return (
    <button
      type="button"
      className={`subject m m--${state.material} shape--${state.shape} ripple`}
      style={{ padding: "var(--s-5)", minWidth: 200, minHeight: 130 } as CSSProperties}
      onClick={(e) => addRipple(e.clientX, e.clientY, e.currentTarget)}
      aria-label="Ripple Surface : toucher pour déclencher une onde"
    >
      <span className="subject__label" style={{ position: "relative", zIndex: 3 }}>
        Ripple Surface
      </span>
      <span className="subject__sub" style={{ position: "relative", zIndex: 3 }}>
        {count > 0
          ? `${count} onde${count > 1 ? "s" : ""} déclenchée${count > 1 ? "s" : ""}`
          : "Toucher la surface"}
      </span>

      {ripples.map((r) => (
        <span
          key={r.id}
          className="ripple__wave"
          aria-hidden="true"
          style={
            {
              left: `${r.x}%`,
              top: `${r.y}%`,
              "--ripple-scale": (1 + bounce * 0.6).toFixed(2),
            } as CSSProperties
          }
        />
      ))}
    </button>
  );
}
