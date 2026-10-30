/* ==========================================================================
   MORPH/UI — Les 16 comportements de pattern.
   Chaque composant a une composition, une géométrie et une animation propres.

   RÈGLE MATÉRIAU : tout élément qui doit être peint par le sélecteur Material
   reçoit la classe de matériau INTERPOLÉE depuis l'état partagé :
     `m m--${state.material} shape--${state.shape}`
   Écrire `className="... m ..."` en dur ne suffit pas : la classe .m seule
   n'applique aucun matériau, et l'élément reste gris.

   RÈGLE DE FORME : `shape--${state.shape}` ne s'applique qu'à l'OBJET
   PRINCIPAL du pattern, jamais à un conteneur englobant — sinon un disque
   apparaît autour du composant quand Shape = Circle.

   Les 4 patterns récents (sheet-drag, parallax-layers, swipe-stack,
   ripple-surface) vivent dans leurs propres modules, importés ci-dessous.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PatternId } from "../state/types";
import type { PatternProps } from "./types";
import { useStudio } from "../state/context";

import { SheetDrag } from "./sheet-drag";
import { ParallaxLayers } from "./parallax-layers";
import { SwipeStack } from "./swipe-stack";
import { RippleSurface } from "./ripple-surface";

export type { PatternProps };

/* ------------------------------------------------------------- Filtre goo */
/** Filtre SVG partagé, rendu une seule fois. Décoratif → aria-hidden. */
export function GooFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="morph-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------- 1. Liquid Glass */
function LiquidGlass({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [pressed, setPressed] = useState(false);
  const [tilt, setTilt] = useState(0);

  /* Sur iOS, pointermove ne se déclenche pas au premier contact : on amorce
     le suivi de position dès onPointerDown, sinon le composant paraît inerte. */
  const track = useCallback(
    (clientX: number, el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const rel = (clientX - r.left) / r.width - 0.5;
      setTilt(-rel * 10 * (1 + bounce));
    },
    [bounce]
  );

  return (
    <button
      type="button"
      className={`subject m m--${state.material} shape--${state.shape}`}
      style={
        {
          "--spec": 0.85,
          transform: `scale(var(--size)) rotateX(${tilt}deg)`,
        } as CSSProperties
      }
      onPointerDown={(e) => {
        setPressed(true);
        track(e.clientX, e.currentTarget);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => {
        setPressed(false);
        setTilt(0);
      }}
      onPointerMove={(e) => track(e.clientX, e.currentTarget)}
      aria-pressed={pressed}
    >
      <span className="stack" aria-hidden="true">
        <span className={`stack__layer m m--${state.material}`} style={{ "--i": 2 } as CSSProperties} />
        <span className={`stack__layer m m--${state.material}`} style={{ "--i": 1 } as CSSProperties} />
        <span className={`stack__layer m m--${state.material}`} style={{ "--i": 0 } as CSSProperties} />
      </span>
      <span className="subject__label">Liquid Glass</span>
      <span className="subject__sub">
        {pressed ? "Pression détectée" : "Toucher ou glisser le doigt"}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- 2. Gooey */
function Gooey({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [merged, setMerged] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setMerged((v) => !v), 1600 + (1 - bounce) * 900);
    return () => window.clearInterval(id);
  }, [bounce]);

  return (
    <button
      type="button"
      className={`goo${merged ? " goo--on" : ""}`}
      onClick={() => setMerged((v) => !v)}
      aria-pressed={merged}
      aria-label={`Métaballes ${merged ? "fusionnées" : "séparées"}. Activer pour inverser.`}
    >
      <span className={`goo__blob m m--${state.material}`} />
      <span className={`goo__blob m m--${state.material}`} />
      <span className={`goo__blob m m--${state.material}`} />
      <span className={`goo__blob m m--${state.material}`} />
    </button>
  );
}

/* -------------------------------------------------- 3. Expandable Button */
function ExpandableButton() {
  const { state } = useStudio();
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const actions = ["Partager", "Épingler", "Exporter"];

  return (
    <div style={{ display: "grid", gap: "var(--s-2)", justifyItems: "center", width: "100%" }}>
      <button
        type="button"
        className={`subject m m--${state.material} shape--${state.shape}`}
        aria-expanded={open}
        aria-controls="expand-extra"
        onClick={() => setOpen((v) => !v)}
        style={{ minWidth: 0, padding: "var(--s-3) var(--s-5)" }}
      >
        <span className="subject__label">{chosen ?? (open ? "Fermer" : "Actions rapides")}</span>
        <span className="subject__sub" aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>

      <div id="expand-extra" className={`expand__extra${open ? " expand__extra--open" : ""}`}>
        <div>
          {actions.map((a) => (
            <button
              key={a}
              type="button"
              className={`btn btn--sm m m--${state.material}`}
              style={{ minHeight: 40, justifyContent: "center" }}
              onClick={() => {
                setChosen(a);
                setOpen(false);
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ 4. Floating Dock */
function FloatingDock() {
  const { state } = useStudio();
  const [active, setActive] = useState(0);
  const items = ["Accueil", "Studio", "Docs", "Réglages"];
  const glyphs = ["◇", "◈", "▤", "⚙"];

  return (
    <div style={{ display: "grid", gap: "var(--s-4)", justifyItems: "center" }}>
      <div className="demo-dock" role="tablist" aria-label="Destinations de démonstration">
        {items.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`demo-dock__item m m--${state.material} shape--${state.shape}`}
            onClick={() => setActive(i)}
            title={label}
          >
            <span aria-hidden="true" style={{ fontSize: "1.125rem" }}>{glyphs[i]}</span>
            <span className="visually-hidden">{label}</span>
          </button>
        ))}
      </div>
      <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }} aria-live="polite">
        Destination : {items[active]}
      </p>
    </div>
  );
}

/* ------------------------------------------------- 5. Experimental Nav */
function ExperimentalNav() {
  const { state } = useStudio();
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState({ x: 0, w: 0 });
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabs = ["Données", "Styles", "Motion"];

  const measure = useCallback(() => {
    const el = refs.current[active];
    if (!el) return;
    setRect({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", justifyItems: "center" }}>
      <div
        className={`demo-nav m m--${state.material} shape--${state.shape}`}
        role="tablist"
        aria-label="Onglets de démonstration"
      >
        <span
          className="demo-nav__ind"
          style={{ transform: `translateX(${rect.x}px)`, width: rect.w }}
          aria-hidden="true"
        />
        {tabs.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            className="demo-nav__btn"
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") setActive((v) => (v + 1) % tabs.length);
              if (e.key === "ArrowLeft") setActive((v) => (v - 1 + tabs.length) % tabs.length);
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }} aria-live="polite">
        Panneau actif : {tabs[active]}
      </p>
    </div>
  );
}

/* ----------------------------------------------------- 6. Morphing Shapes */
function MorphingShapes() {
  const { state } = useStudio();
  const stages = ["50%", "18px", "0px", "34%", "999px"];
  const [i, setI] = useState(0);

  return (
    <button
      type="button"
      className="subject"
      style={{
        display: "grid",
        gap: "var(--s-2)",
        justifyItems: "center",
        background: "none",
        border: 0,
        padding: 0,
        minWidth: 0,
      }}
      onClick={() => setI((v) => (v + 1) % stages.length)}
      aria-label="Morphing Shapes : toucher pour changer de forme"
    >
      <span
        className={`morph m m--${state.material}`}
        aria-hidden="true"
        style={{ borderRadius: stages[i] } as CSSProperties}
      />
      <span className="subject__sub">Forme {i + 1}/{stages.length} — toucher</span>
    </button>
  );
}

/* --------------------------------------------------------- 7. Radial Menu */
function RadialMenu({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [open, setOpen] = useState(false);
  const actions = ["Copier", "Partager", "Nouveau", "Supprimer", "Favori"];

  return (
    <div className={`radial${open ? " radial--open" : ""}`}>
      <button
        type="button"
        className={`radial__center m m--${state.material} shape--circle`}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu radial" : "Ouvrir le menu radial"}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {open ? "×" : "+"}
      </button>
      {actions.map((a, i) => {
        const angle = (-90 + (360 / actions.length) * i) * (Math.PI / 180);
        const r = 82 * (1 + bounce * 0.1);
        const style: CSSProperties = {
          "--x": `${Math.cos(angle) * r}px`,
          "--y": `${Math.sin(angle) * r}px`,
          transitionDelay: `${i * 26}ms`,
        } as CSSProperties;
        return (
          <button
            key={a}
            type="button"
            className={`radial__item m m--${state.material} shape--circle`}
            style={style}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            title={a}
          >
            <span aria-hidden="true">{a.slice(0, 2)}</span>
            <span className="visually-hidden">{a}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------- 8. Kinetic Interactions */
function Kinetic() {
  const { state } = useStudio();
  const [amp, setAmp] = useState(0.2);
  const base = [0.3, 0.55, 0.85, 0.6, 0.35, 0.5];

  return (
    <div style={{ display: "grid", gap: "var(--s-3)", width: "100%", justifyItems: "center" }}>
      <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>Force</p>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={amp}
        aria-label="Force de la déformation cinétique"
        onChange={(e) => setAmp(Number.parseFloat(e.target.value))}
        style={{ width: "70%", accentColor: "var(--accent)" }}
      />
      <div className="kinetic" aria-hidden="true">
        {base.map((h, i) => (
          <span
            key={i}
            className={`kinetic__bar m m--${state.material}`}
            style={
              {
                height: `${30 + h * 80 * (0.4 + amp)}px`,
                animation: `kinetic-${i % 3} ease-in-out infinite`,
                "--kinetic-dur": `${(2.4 - amp * 1.4).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- 9. Lens / Loupe */
function Lens() {
  const { state } = useStudio();
  const [pos, setPos] = useState({ x: 50, y: 50 });

  /* Le suivi démarre au toucher : pointermove seul ne suffit pas sur iOS. */
  const move = useCallback((clientX: number, clientY: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setPos({
      x: ((clientX - r.left) / r.width) * 100,
      y: ((clientY - r.top) / r.height) * 100,
    });
  }, []);

  return (
    <div
      className={`lens m m--${state.material} shape--${state.shape}`}
      onPointerDown={(e) => move(e.clientX, e.clientY, e.currentTarget)}
      onPointerMove={(e) => move(e.clientX, e.clientY, e.currentTarget)}
      onPointerLeave={() => setPos({ x: 50, y: 50 })}
    >
      <span aria-hidden="true">MORPH/UI · DÉTAIL · 0123 · ALPHA</span>
      <span className="lens__glass" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} aria-hidden="true" />
    </div>
  );
}

/* ------------------------------------------------------ 10. Collapsible */
function Collapsible() {
  const { state } = useStudio();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: "grid", gap: "var(--s-2)", width: "100%", maxWidth: 260 }}>
      <button
        type="button"
        className={`subject m m--${state.material} shape--${state.shape}`}
        aria-expanded={open}
        aria-controls="collapse-panel"
        onClick={() => setOpen((v) => !v)}
        style={{ minWidth: 0, width: "100%" }}
      >
        <span className="subject__label">Réglages avancés</span>
        <span className="subject__sub" aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>
      <div id="collapse-panel" className={`collapse__panel${open ? " collapse__panel--open" : ""}`}>
        <div>
          <p className="mono" style={{ color: "var(--text-dim)", fontSize: "0.6875rem", lineHeight: 1.6 }}>
            Contenu réellement révélé : la hauteur est animée par grid-template-rows 0fr → 1fr,
            sans hauteur fixe codée en dur.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------- 11. Expressive Motion */
function ExpressiveMotion({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [fired, setFired] = useState(false);

  return (
    <button
      type="button"
      className="subject"
      style={{
        display: "grid",
        gap: "var(--s-2)",
        justifyItems: "center",
        background: "none",
        border: 0,
        padding: 0,
        minWidth: 0,
      }}
      onClick={() => {
        setFired(false);
        window.requestAnimationFrame(() => setFired(true));
      }}
      aria-label="Déclencher l'animation élastique"
    >
      <span
        className={`spring-ball m m--${state.material}`}
        aria-hidden="true"
        style={{
          borderRadius: "50%",
          transform: fired
            ? `translateY(${(-18 * (1 + bounce)).toFixed(1)}px) scale(1.12)`
            : "translateY(0) scale(1)",
        }}
      />
      <span className="subject__sub">Rebond ×{(1 + bounce).toFixed(2)} — toucher</span>
    </button>
  );
}

/* --------------------------------------------- 12. Contextual Toolbar */
function ContextualToolbar() {
  const { state } = useStudio();
  const [selecting, setSelecting] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ display: "grid", gap: "var(--s-2)", width: "100%", maxWidth: 250 }}>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            className={`subject m m--${state.material} shape--${state.shape}`}
            onClick={() => {
              setSelecting(true);
              setCount((c) => c + 1);
            }}
            style={{ minWidth: 0, width: "100%", padding: "var(--s-3)" }}
          >
            <span className="subject__label" style={{ fontSize: "0.8125rem" }}>
              Élément {i + 1}
            </span>
          </button>
        ))}
      </div>

      {selecting && (
        <div className="ctx-bar" role="toolbar" aria-label="Actions contextuelles de sélection">
          <button type="button" className="ctx-bar__btn" onClick={() => setCount((c) => c + 1)}>
            Dupliquer
          </button>
          <button type="button" className="ctx-bar__btn" onClick={() => setCount((c) => c + 1)}>
            Déplacer
          </button>
          <button
            type="button"
            className="ctx-bar__btn"
            onClick={() => {
              setSelecting(false);
              setCount(0);
            }}
          >
            Annuler
          </button>
          <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }} aria-live="polite">
            {count}
          </span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ Registre */
export const PATTERN_RENDERERS: Record<PatternId, (p: PatternProps) => JSX.Element> = {
  "liquid-glass": LiquidGlass,
  gooey: Gooey,
  "expandable-button": ExpandableButton,
  "floating-dock": FloatingDock,
  "experimental-nav": ExperimentalNav,
  "morphing-shapes": MorphingShapes,
  "radial-menu": RadialMenu,
  kinetic: Kinetic,
  lens: Lens,
  collapsible: Collapsible,
  "expressive-motion": ExpressiveMotion,
  "contextual-toolbar": ContextualToolbar,
  "sheet-drag": SheetDrag,
  "parallax-layers": ParallaxLayers,
  "swipe-stack": SwipeStack,
  "ripple-surface": RippleSurface,
};
