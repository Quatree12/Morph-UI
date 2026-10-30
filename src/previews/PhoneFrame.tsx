import type { ReactNode } from "react";
import { useStudio } from "../state/context";
import { PATTERN_MAP } from "../data/patterns";
import { MATERIAL_MAP } from "../data/materials";

interface Props {
  children: ReactNode;
  expanded?: boolean;
  showBadges?: boolean;
  /** Consigne affichée sous la maquette (remplace l'ancienne phrase creuse). */
  hint?: string;
}

/** Le cadre de la maquette. Il ne porte NI matériau NI forme : ce sont les
 *  patterns qui les appliquent à leur objet principal, chacun à sa manière. */
export function PhoneFrame({ children, expanded = false, showBadges = true, hint }: Props) {
  const { state } = useStudio();
  const pattern = PATTERN_MAP[state.pattern];
  const material = MATERIAL_MAP[state.material];

  return (
    <div className={`phone${expanded ? " phone--expanded" : ""}`}>
      <div className="phone__notch" aria-hidden="true" />
      <div className="phone__screen">
        <div className="phone__bg" aria-hidden="true" />
        <div className="phone__status" aria-hidden="true">
          <span>9:41</span>
          <span>MORPH/UI</span>
        </div>
        <div className="phone__stage">{children}</div>
        {showBadges && (
          <div className="phone__badges">
            <span className="chip" style={{ borderColor: "color-mix(in srgb, var(--accent) 44%, transparent)" }}>
              {pattern.name}
            </span>
            <span className="chip">{material.name}</span>
            <span className="chip">{state.shape}</span>
          </div>
        )}
        {hint && (
          <p
            className="mono"
            style={{
              position: "relative",
              zIndex: 6,
              margin: 0,
              padding: "0 var(--s-3) var(--s-3)",
              fontSize: "0.625rem",
              color: "var(--text-faint)",
              textAlign: "center",
            }}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
