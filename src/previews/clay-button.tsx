import { useState } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

/** Un bouton de pâte : il s'enfonce au toucher, remonte avec un rebond. */
export function ClayButton({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [count, setCount] = useState(0);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      className={`subject m m--${state.material} shape--${state.shape}`}
      aria-pressed={pressed}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => setCount((c) => c + 1)}
      style={{ minWidth: 190, padding: "var(--s-5) var(--s-6)" }}
    >
      <span className="subject__label">Appuyer</span>
      <span className="subject__sub">
        {pressed
          ? "Enfoncé"
          : count === 0
            ? "Le bouton s'enfonce au toucher"
            : `${count} pression${count > 1 ? "s" : ""}`}
      </span>
      <span className="visually-hidden">
        Rebond {bounce.toFixed(2)} appliqué à la remontée
      </span>
    </button>
  );
}
