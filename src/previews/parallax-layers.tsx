import { useState } from "react";
import type { CSSProperties } from "react";
import type { PatternProps } from "./types";

/** Trois plans qui glissent à des vitesses différentes. */
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

      <div className="parallax m shape--rounded" aria-hidden="true">
        {speeds.map((speed, i) => (
          <span
            key={i}
            className="parallax__layer m"
            style={
              {
                transform: `translateX(${offset * speed * (1 + bounce * 0.3)}px)`,
                opacity: 0.4 + i * 0.3,
                zIndex: i + 1,
                "--layer-i": i,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <p className="mono" style={{ fontSize: "0.6875rem", color: "var(--text-dim)", textAlign: "center" }}>
        Le décalage seul crée la profondeur.
      </p>
    </div>
  );
}
