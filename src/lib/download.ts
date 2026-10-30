/* ==========================================================================
   MORPH/UI — Export d'un fichier de code.
   Prépare le nom, le type MIME et le contenu, puis déclenche le
   téléchargement. Aucune dépendance : Blob + lien temporaire.

   Deux usages :
   - prepareExport() : renvoie les métadonnées SANS télécharger (pour
     afficher le nom du fichier dans l'interface).
   - downloadCode()  : télécharge et renvoie le nom produit.
   ========================================================================== */

export type ExportFormat = "css" | "tailwind" | "react" | "framer";

interface FileSpec {
  ext: string;
  mime: string;
}

const FILES: Record<ExportFormat, FileSpec> = {
  css: { ext: "css", mime: "text/css" },
  tailwind: { ext: "jsx", mime: "text/javascript" },
  react: { ext: "tsx", mime: "text/typescript" },
  framer: { ext: "tsx", mime: "text/typescript" },
};

export interface ExportFile {
  /** Nom complet, extension incluse : morphui-css-liquid-glass.css */
  name: string;
  /** Type MIME utilisé pour le Blob. */
  mime: string;
  /** Ce que le fichier contient, pour l'interface. */
  ext: string;
}

/** Nom de fichier lisible : morphui-<format>-<pattern>.<ext> */
function fileNameFor(format: ExportFormat, patternId: string): string {
  const f = FILES[format];
  const slug = patternId.replace(/[^a-z0-9-]/gi, "");
  return `morphui-${format}-${slug}.${f.ext}`;
}

/**
 * Prépare les métadonnées de l'export, SANS rien télécharger.
 * Sert à afficher le nom du fichier avant même le clic.
 */
export function prepareExport(format: ExportFormat, patternId: string): ExportFile {
  const f = FILES[format];
  return { name: fileNameFor(format, patternId), mime: f.mime, ext: f.ext };
}

/**
 * Télécharge le code généré et renvoie le nom du fichier produit.
 */
export function downloadCode(
  format: ExportFormat,
  patternId: string,
  code: string
): ExportFile {
  const file = prepareExport(format, patternId);
  const blob = new Blob([code], { type: `${file.mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Safari a besoin d'un délai avant que l'URL puisse être libérée.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return file;
}
