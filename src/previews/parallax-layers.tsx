import { useState } from "react";
import type { PatternProps } from "./types";

/** Trois plans qui glissent à des vitesses différentes.
 *  Seul l'élément .parallax porte le matériau : les couches intérieures
 *  dessinent le décalage sans recouvrir la texture du conteneur. */
export function ParallaxLayers({ bounce }: PatternProps) {
  const [offset, setOffset] = useState(0);

  const speeds = [0.18, 0.38, 0.72];

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", width: "100%" }}>
      <label
        style={{
          fontSize: "0.6875rem",
          color: "var(--text-dim)",
          display: "grid",
          gap: 4,
          fontFamily: "var(--font-mono)",
        }}
      >
        Défilement
        <input
          type="range"
          min={-100}
          max={100}
          step={1}
          value={offset}
          onChange={(e) => setOffset(Number.parseInt(e.target.value, 10))}
          aria-label="Position de défilement qui pilote le parallaxe"
          style={{ accentColor: "var(--accent)" }}
        />
      </label>

      {/* Une seule surface matérielle : le conteneur. */}
      <div className="parallax m shape--rounded" aria-hidden="true">
        {speeds.map((speed, i) => (
          <span
            key={i}
            className="parallax__layer"
            style={{
              transform: `translateX(${offset * speed * (1 + bounce * 0.3)}px)`,
              background:
                i === 0
                  ? "linear-gradient(160deg, rgba(255,255,255,0.06), transparent)"
                  : i === 1
                    ? "linear-gradient(160deg, rgba(255,255,255,0.10), transparent)"
                    : "linear-gradient(160deg, rgba(255,255,255,0.16), transparent)",
            }}
          />
        ))}
      </div>

      <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-dim)", textAlign: "center" }}>
        Le décalage seul crée la profondeur.
      </p>
    </div>
  );
}
