import { useState } from "react";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

/** Une bascule : la bille de pâte roule d'un côté à l'autre, la piste se creuse. */
export function ClaySwitch({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [on, setOn] = useState(false);

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", justifyItems: "center" }}>
      <button
        type="button"
        className={`clay-switch m m--${state.material}`}
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            setOn((v) => !v);
          }
        }}
      >
        <span className="clay-switch__track" aria-hidden="true" />
        <span
          className="clay-switch__ball m"
          aria-hidden="true"
          style={{ transform: `translateX(${on ? 46 : 0}px) scaleX(${on ? 1.06 : 1})` }}
        />
        <span className="visually-hidden">
          {on ? "Activé" : "Désactivé"} — rebond {bounce.toFixed(2)}
        </span>
      </button>

      <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }} aria-live="polite">
        {on ? "Activé" : "Désactivé"}
      </p>
    </div>
  );
}
