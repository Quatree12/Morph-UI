import { useState } from "react";
import { StudioProvider } from "./state/StudioProvider";
import { Layout } from "./components/Layout";
import { Home } from "./sections/Home";
import { Explore } from "./sections/Explore";
import { Playground } from "./sections/Playground";
import { Favorites } from "./sections/Favorites";
import { CodeExport } from "./sections/CodeExport";
import { Docs } from "./sections/Docs";
import { Settings } from "./sections/Settings";
import { NAV_ITEMS } from "./nav";
import type { SectionId } from "./nav";

export default function App() {
  const [section, setSection] = useState<SectionId>("home");

  const go = (id: SectionId) => {
    setSection(id);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const active = NAV_ITEMS.find((n) => n.id === section) ?? NAV_ITEMS[0]!;

  return (
    <StudioProvider>
      <Layout section={section} onNavigate={go}>
        {section === "home" && <Home onNavigate={go} />}
        {section === "explore" && <Explore onNavigate={go} />}
        {section === "playground" && <Playground />}
        {section === "favorites" && <Favorites onNavigate={go} />}
        {section === "export" && <CodeExport />}
        {section === "docs" && <Docs onNavigate={go} />}
        {section === "settings" && <Settings />}

        <p className="mono" style={{ color: "var(--text-faint)", marginTop: "var(--s-6)" }}>
          MORPH/UI · {active.label} · Experimental Design Atlas
        </p>
      </Layout>
    </StudioProvider>
  );
}
