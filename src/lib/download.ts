/* ==========================================================================
   MORPH/UI — Téléchargement d'un export.
   Écrit le code généré dans un vrai fichier, avec l'extension qui correspond
   au format choisi. Aucune dépendance : Blob + lien temporaire.
   ========================================================================== */

export type ExportFormat = "css" | "tailwind" | "react" | "framer";

interface FileSpec {
  ext: string;
  mime: string;
  /** Décrit le fichier dans l'interface : « un fichier .css », etc. */
  label: string;
}

const FILES: Record<ExportFormat, FileSpec> = {
  css: { ext: "css", mime: "text/css", label: "un fichier .css" },
  tailwind: { ext: "jsx", mime: "text/javascript", label: "un fichier .jsx" },
  react: { ext: "tsx", mime: "text/typescript", label: "un fichier .tsx" },
  framer: { ext: "tsx", mime: "text/typescript", label: "un fichier .tsx" },
};

/** Ce que produit chaque format, pour l'affichage. */
export function fileLabel(format: ExportFormat): string {
  return FILES[format].label;
}

/** Nom de fichier lisible : morphui-<format>-<pattern>.<ext> */
export function exportFileName(format: ExportFormat, patternId: string): string {
  const f = FILES[format];
  const slug = patternId.replace(/[^a-z0-9-]/gi, "");
  return `morphui-${format}-${slug}.${f.ext}`;
}

/** Déclenche le téléchargement du code généré. */
export function downloadCode(
  format: ExportFormat,
  patternId: string,
  code: string
): string {
  const f = FILES[format];
  const name = exportFileName(format, patternId);
  const blob = new Blob([code], { type: `${f.mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Safari a besoin d'un délai avant que l'URL puisse être libérée.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return name;
}
