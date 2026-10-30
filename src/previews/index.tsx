function LiquidGlass({ bounce }: PatternProps) {
  const { state } = useStudio();
  const [pressed, setPressed] = useState(false);
  const [tilt, setTilt] = useState(0);

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
      /* LE BOUTON N'EST QU'UN CONTENEUR : ni matériau, ni forme, ni fond.
         L'objet principal, c'est la pile de calques ci-dessous. */
      className="glass-host"
      style={{ transform: `scale(var(--size)) rotateX(${tilt}deg)` } as CSSProperties}
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
        <span
          className={`stack__layer m m--${state.material} shape--${state.shape}`}
          style={{ "--i": 2 } as CSSProperties}
        />
        <span
          className={`stack__layer m m--${state.material} shape--${state.shape}`}
          style={{ "--i": 1 } as CSSProperties}
        />
        <span
          className={`stack__layer m m--${state.material} shape--${state.shape}`}
          style={{ "--i": 0 } as CSSProperties}
        />
      </span>
      <span className="subject__label">Liquid Glass</span>
      <span className="subject__sub">
        {pressed ? "Reflet incliné" : "Glissez le doigt : le reflet s'incline"}
      </span>
    </button>
  );
}
