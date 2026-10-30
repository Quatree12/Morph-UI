/* ==========================================================================
   MORPH/UI — Téléchargement d'un export.
   Écrit le code généré dans un vrai fichier, avec l'extension qui correspond
   au format choisi. Aucune dépendance : Blob + lien temporaire.
   ========================================================================== */

export type ExportFormat = "css" | "tailwind" | "react" | "framer";

const FILES: Record<ExportFormat, { ext: string; mime: string }> = {
  css: { ext: "css", mime: "text/css" },
  tailwind: { ext: "jsx", mime: "text/javascript" },
  react: { ext: "tsx", mime: "text/typescript" },
  framer: { ext: "tsx", mime: "text/typescript" },
};

/** Nom de fichier lisible : morphui-<format>-<pattern>.<ext> */
export function exportFileName(format: ExportFormat, patternId: string): string {
  const f = FILES[format];
  const slug = patternId.replace(/[^a-z0-9-]/gi, "");
  return `morphui-${format}-${slug}.${f.ext}`;
}

/** Déclenche le téléchargement du code. */
export function downloadCode(format: ExportFormat, patternId: string, code: string): void {
  const f = FILES[format];
  const blob = new Blob([code], { type: `${f.mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = exportFileName(format, patternId);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Safari a besoin d'un délai avant de libérer l'URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
