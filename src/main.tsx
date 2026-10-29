import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/materials.css";
import "./styles/patterns.css";
import "./styles/patterns-extra.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root introuvable.");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
