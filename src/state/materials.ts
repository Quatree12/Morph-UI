import type { MaterialId } from "../state/types";

export interface MaterialDef {
  id: MaterialId;
  name: string;
  /** Phrase courte affichée sous le sélecteur. */
  tagline: string;
  /** Description détaillée (Documentation). */
  details: string;
  /** Contrôles pertinents pour ce matériau. Les autres sont désactivés
   *  avec une explication, conformément au cahier des charges §11. */
}

export const MATERIALS: MaterialDef[] = [
  {
    id: "frosted-glass",
    name: "Frosted Glass",
    tagline: "Transparence partielle, flou d'arrière-plan, reflets doux.",
    details:
      "Verre dépoli : bordure claire, diffusion lumineuse, arrière-plan lisible mais adouci. Le matériau le plus polyvalent pour des surfaces superposées.",
  },
  {
    id: "clear-glass",
    name: "Clear Glass",
    tagline: "Transparence élevée, reflets spéculaires, contours discrets.",
    details:
      "Verre clair : l'arrière-plan reste visible. La réfraction est simulée par gradients et reflets ; les contours sont volontairement fins.",
  },
  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    tagline: "Gradients métalliques contrastés, aspect poli.",
    details:
      "Chrome liquide : bandes claires/sombres très contrastées, reflets argentés. L'accent choisi teinte les zones compatibles sans casser le métal.",
  },
  {
    id: "soft-matte",
    name: "Soft Matte",
    tagline: "Surface diffuse, ombres douces, aspect céramique.",
    details:
      "Mat doux : reflets limités, dégradé interne subtil. Très lisible, idéal pour du contenu dense.",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    tagline: "Lueur extérieure, contraste élevé, halo ajustable.",
    details:
      "Néon : halo extérieur piloté par Glow Intensity, cœur lumineux, contraste maximal. À réserver aux états actifs.",
  },
  {
    id: "iridescent-crystal",
    name: "Iridescent Crystal",
    tagline: "Dégradés multicolores, reflets prismatiques.",
    details:
      "Cristal irisé : plusieurs arrêts de couleur, bordures lumineuses, effet prismatique. L'accent s'ajoute aux teintes existantes.",
  },
  {
    id: "brushed-metal",
    name: "Brushed Metal",
    tagline: "Stries directionnelles, texture simulée en CSS.",
    details:
      "Métal brossé : stries obtenues par repeating-linear-gradient, reflets directionnels, contraste de surface net.",
  },
  {
    id: "translucent-gel",
    name: "Translucent Gel",
    tagline: "Volume translucide, reflets internes, profondeur douce.",
    details:
      "Gel translucide : highlight interne en haut, dégradé organique, profondeur marquée par une ombre colorée.",
  },
  {
    id: "solid-surface",
    name: "Solid Surface",
    tagline: "Couleur pleine, netteté et lisibilité maximales.",
    details:
      "Surface pleine : pas de flou obligatoire, ombres et profondeur réglables. C'est le repli sûr quand le contraste doit être garanti.",
  },
];

export const MATERIAL_MAP: Record<MaterialId, MaterialDef> = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m])
) as Record<MaterialId, MaterialDef>;
