import type { ReactNode } from "react";
import { NAV_ITEMS } from "../nav";
import type { SectionId } from "../nav";

interface Props {
  section: SectionId;
  onNavigate: (id: SectionId) => void;
  children: ReactNode;
}

export function Layout({ section, onNavigate, children }: Props) {
  return (
    <div className="app">
      <Sidebar section={section} onNavigate={onNavigate} />
      <main className="main">{children}</main>
      <Dock section={section} onNavigate={onNavigate} />
    </div>
  );
}

function Sidebar({ section, onNavigate }: Omit<Props, "children">) {
  return (
    <nav className="sidebar" aria-label="Navigation principale">
      <a
        href="#main"
        className="visually-hidden"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector("main")?.focus();
        }}
      >
        Aller au contenu
      </a>

      <div style={{ padding: "0 var(--s-3) var(--s-5)" }}>
        <div
          className="mono"
          style={{ fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          {/* Le slash porte la marque : il ne suit pas le Studio. */}
          MORPH<span style={{ color: "var(--brand-light)" }}>/</span>UI
        </div>
        <div className="eyebrow" style={{ marginTop: 4 }}>
          Experimental Design Atlas
        </div>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const active = item.id === section;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--s-3)",
                  minHeight: 44,
                  padding: "0 var(--s-3)",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid transparent",
                  background: active
                    ? "color-mix(in srgb, var(--brand) 22%, transparent)"
                    : "transparent",
                  borderColor: active
                    ? "color-mix(in srgb, var(--brand) 48%, transparent)"
                    : "transparent",
                  color: active ? "var(--text)" : "var(--text-dim)",
                  fontSize: "0.875rem",
                  textAlign: "left",
                  transition: "background var(--dur-fast) var(--ease-out)",
                }}
              >
                <span style={{ width: 18, height: 18, display: "block", flex: "0 0 auto" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="eyebrow" style={{ marginTop: "auto", padding: "0 var(--s-3)" }}>
        Explore interactions.
        <br />
        Bend materials.
        <br />
        Shape interfaces.
      </p>
    </nav>
  );
}

function Dock({ section, onNavigate }: Omit<Props, "children">) {
  return (
    <nav className="dock" aria-label="Navigation mobile">
      {NAV_ITEMS.map((item) => {
        const active = item.id === section;
        return (
          <button
            key={item.id}
            type="button"
            className="dock__item"
            onClick={() => onNavigate(item.id)}
            aria-current={active ? "page" : undefined}
            title={item.label}
          >
            {item.icon}
            <span className="dock__label">{item.short}</span>
          </button>
        );
      })}
    </nav>
  );
}
