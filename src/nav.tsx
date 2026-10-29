import type { ReactNode } from "react";

export type SectionId =
  | "home"
  | "explore"
  | "playground"
  | "compare"
  | "favorites"
  | "export"
  | "docs"
  | "settings";

export interface NavItem {
  id: SectionId;
  label: string;
  short: string;
  /** Icône SVG inline : aucune librairie d'icônes ajoutée. */
  icon: ReactNode;
}

const I = (d: string) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home / Overview",
    short: "Home",
    icon: I("M4 11l8-7 8 7v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"),
  },
  {
    id: "explore",
    label: "Explore / Pattern Library",
    short: "Explore",
    icon: I("M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z"),
  },
  {
    id: "playground",
    label: "Playground / Component Studio",
    short: "Studio",
    icon: I("M5 7h14M5 12h9M5 17h5M17.5 15l2.5 2.5M20 15l-2.5 2.5"),
  },
  {
    id: "compare",
    label: "Compare / Pattern Comparison",
    short: "Compare",
    icon: I("M12 3v18M5 8l-3 6h6zM19 8l-3 6h6z"),
  },
  {
    id: "favorites",
    label: "Favorites / Saved Patterns",
    short: "Saved",
    icon: I("M12 4.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 10.2l5.4-.8z"),
  },
  {
    id: "export",
    label: "Code Export / Developer Handoff",
    short: "Code",
    icon: I("M9 18l-6-6 6-6M15 6l6 6-6 6"),
  },
  {
    id: "docs",
    label: "Documentation / Guidelines",
    short: "Docs",
    icon: I("M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h4"),
  },
  {
    id: "settings",
    label: "Settings / Preferences",
    short: "Settings",
    icon: I("M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 14H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"),
  },
];
