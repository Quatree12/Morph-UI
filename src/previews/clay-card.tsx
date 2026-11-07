import { useState } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

/** Une carte épaisse : elle se soulève au survol, s'aplatit à la pression. */
export function ClayCard({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [pressed, setPressed] = useState(false);
  const [opened, setOpened] = useState(false);

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", width: "100%", justifyItems: "center" }}>
      <button
        type="button"
        className={`clay-card m m--${state.material} shape--${state.shape}`}
        aria-expanded={opened}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        onClick={() => setOpened((v) => !v)}
      >
        <span className="clay-card__title">Clay Card</span>
        <span className="clay-card__sub">
          {pressed ? "Aplatie" : opened ? "Dépliée" : "Toucher pour déplier"}
        </span>
        <div className={`clay-card__extra${opened ? " clay-card__extra--open" : ""}`}>
          <div>
            <p
              className="mono"
              style={{ fontSize: "0.6875rem", color: "var(--text-dim)", margin: 0, lineHeight: 1.6 }}
            >
              Grande surface : c'est ici que le relief du matériau se lit le mieux —
              lumière concentrée en haut-gauche, ombre épaisse en bas-droite, pâte
              légèrement teintée par l'accent. Rebond {bounce.toFixed(2)}.
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
