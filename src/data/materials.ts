import type { MaterialId } from "../state/types";

export interface MaterialDef {
  id: MaterialId;
  name: string;
  /** Phrase courte affichée sous le sélecteur. */
  tagline: string;
  /** Description détaillée (Documentation). */
  details: string;
  /** Ce matériau réagit-il au réglage Blur ? */
  blurReactive: boolean;
  /** Ce matériau réagit-il au réglage Transparency ? */
  alphaReactive: boolean;
  /** Ce matériau produit-il un halo avec Glow ? */
  glowReactive: boolean;
}

export const MATERIALS: MaterialDef[] = [
  {
    id: "frosted-glass",
    name: "Frosted Glass",
    tagline: "Transparence partielle, flou d'arrière-plan, reflets doux.",
    details:
      "Verre dépoli : bordure claire, diffusion lumineuse, arrière-plan lisible mais adouci. Le matériau le plus polyvalent pour des surfaces superposées.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "clear-glass",
    name: "Clear Glass",
    tagline: "Transparence élevée, reflets spéculaires, contours discrets.",
    details:
      "Verre clair : l'arrière-plan reste visible. La réfraction est simulée par gradients et reflets ; les contours sont volontairement fins.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    tagline: "Gradients métalliques contrastés, aspect poli.",
    details:
      "Chrome liquide : bandes claires et sombres très contrastées, reflets argentés. L'accent choisi teinte les zones compatibles sans casser le métal.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "soft-matte",
    name: "Soft Matte",
    tagline: "Surface diffuse, ombres douces, aspect céramique.",
    details:
      "Mat doux : reflets limités, dégradé interne subtil. Très lisible, idéal pour du contenu dense.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    tagline: "Lueur extérieure, contraste élevé, halo ajustable.",
    details:
      "Néon : halo extérieur piloté par Glow Intensity, cœur lumineux, contraste maximal. À réserver aux états actifs.",
    blurReactive: false,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "iridescent-crystal",
    name: "Iridescent Crystal",
    tagline: "Dégradés multicolores, reflets prismatiques.",
    details:
      "Cristal irisé : plusieurs arrêts de couleur saturés, bordures lumineuses, effet prismatique.",
    blurReactive: true,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "brushed-metal",
    name: "Brushed Metal",
    tagline: "Stries directionnelles, texture simulée en CSS.",
    details:
      "Métal brossé : stries obtenues par repeating-linear-gradient, reflets directionnels, contraste de surface net.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "translucent-gel",
    name: "Translucent Gel",
    tagline: "Volume translucide, reflets internes, profondeur douce.",
    details:
      "Gel translucide : highlight interne en haut, dégradé organique, profondeur marquée par une ombre colorée.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "solid-surface",
    name: "Solid Surface",
    tagline: "Couleur pleine, netteté et lisibilité maximales.",
    details:
      "Surface pleine : pas de flou, ombres et profondeur réglables. C'est le repli sûr quand le contraste doit être garanti.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "holographic-foil",
    name: "Holographic Foil",
    tagline: "Reflets arc-en-ciel qui glissent avec l'accent.",
    details:
      "Film holographique : le dégradé spectral se déplace selon l'intensité de Glow. Contraste élevé, aspect iridescent franc, à réserver aux éléments d'accent.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "frosted-acrylic",
    name: "Frosted Acrylic",
    tagline: "Plexiglas dépoli épais, bordure qui capte la lumière.",
    details:
      "Acrylique : plus épais et plus opaque que le verre dépoli, avec une bordure interne très marquée. Le flou reste réglable, mais la teinte est plus dense.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    tagline: "Trame tissée en diagonale, reflets froids.",
    details:
      "Fibre de carbone : trame croisée obtenue par deux repeating-linear-gradient à 45°, reflet linéaire, teinte froide. Très différent du métal brossé, dont les stries sont verticales.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "ceramic-glaze",
    name: "Ceramic Glaze",
    tagline: "Émail brillant, reflet mouillé, profondeur douce.",
    details:
      "Céramique émaillée : reflet large et mou en partie haute, ombre interne en bas, aucun grain. Aspect lisse et chaud.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "sandblasted-stone",
    name: "Sandblasted Stone",
    tagline: "Grain mat, aucun reflet spéculaire.",
    details:
      "Pierre sablée : grain fin simulé par un bruit SVG en data-URI, aucune brillance, contraste faible. Le matériau le plus mat du catalogue.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "liquid-mercury",
    name: "Liquid Mercury",
    tagline: "Métal liquide, reflets mous et déformés.",
    details:
      "Mercure : reflets larges et étirés, sans arêtes franches comme le chrome. Effet de tension de surface obtenu par ellipse de dégradé.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
];

export const MATERIAL_MAP: Record<MaterialId, MaterialDef> = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m])
) as Record<MaterialId, MaterialDef>;
