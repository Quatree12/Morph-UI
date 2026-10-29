import { useEffect, useRef, useState } from "react";

type Status = "idle" | "ok" | "error";

interface Props {
  /** Texte à copier, recalculé à chaque rendu. */
  getText: () => string;
  label?: string;
}

/** Bouton Copy réellement fonctionnel, avec repli si l'API Clipboard est
 *  indisponible (contexte non sécurisé, iframe, permission refusée). */
export function CopyButton({ getText, label = "Copier" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const flash = (s: Status) => {
    setStatus(s);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2400);
  };

  const copy = async () => {
    const text = getText();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        flash("ok");
        return;
      }
      throw new Error("Clipboard API indisponible");
    } catch {
      // Repli : sélection + execCommand. Peut échouer aussi, on le dit.
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        document.body.appendChild(ta);
        ta.select();
        const done = document.execCommand("copy");
        document.body.removeChild(ta);
        flash(done ? "ok" : "error");
      } catch {
        flash("error");
      }
    }
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button type="button" className="btn btn--sm btn--primary" onClick={copy}>
        {label}
      </button>
      <span
        role="status"
        aria-live="polite"
        className="mono"
        style={{
          fontSize: "0.6875rem",
          color: status === "ok" ? "var(--lime)" : status === "error" ? "#FF6B6B" : "var(--text-faint)",
        }}
      >
        {status === "ok" ? "Copié" : status === "error" ? "Copie refusée par le navigateur" : ""}
      </span>
    </span>
  );
}
