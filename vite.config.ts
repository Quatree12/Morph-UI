import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" => le build fonctionne aussi bien sous un sous-chemin GitHub Pages
// (https://compte.github.io/morph-ui/) que servi à la racine du domaine.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
