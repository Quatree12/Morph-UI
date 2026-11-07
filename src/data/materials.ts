import type { MaterialId } from "../state/types";

export interface MaterialDef {
  id: MaterialId;
  name: string;
  tagline: string;
  details: string;
  /** Ce matériau réagit-il au réglage Blur ? */
  blurReactive: boolean;
  /** Ce matériau réagit-il au réglage Transparency ? */
  alphaReactive: boolean;
  /** Ce matériau produit-il un halo avec Glow ? */
  glowReactive: boolean;
  /** La forme Sharp casse-t-elle ce matériau ? (Clay, matière molle) */
  rejectsSharp?: boolean;
}

export const MATERIALS: MaterialDef[] = [
  {
    id: "frosted-glass",
    name: "Frosted Glass",
    tagline: "Transparence partielle, flou d'arrière-plan, reflets doux.",
    details:
      "Verre dépoli : bordure claire, diffusion lumineuse, arrière-plan lisible mais adouci.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "clear-glass",
    name: "Clear Glass",
    tagline: "Transparence élevée, reflets spéculaires, contours discrets.",
    details:
      "Verre clair : l'arrière-plan reste visible. La réfraction est simulée par gradients et reflets.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "liquid-chrome",
    name: "Liquid Chrome",
    tagline: "Gradients métalliques contrastés, aspect poli.",
    details:
      "Chrome liquide : bandes claires et sombres très contrastées, reflets argentés.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "soft-matte",
    name: "Soft Matte",
    tagline: "Surface diffuse, ombres douces, aspect céramique.",
    details: "Mat doux : reflets limités, dégradé interne subtil. Très lisible.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    tagline: "Lueur extérieure, contraste élevé, halo ajustable.",
    details:
      "Néon : halo extérieur piloté par Glow Intensity, cœur lumineux, contraste maximal.",
    blurReactive: false,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "iridescent-crystal",
    name: "Iridescent Crystal",
    tagline: "Dégradés multicolores, reflets prismatiques.",
    details:
      "Cristal irisé : arrêts de couleur saturés, bordures lumineuses, effet prismatique.",
    blurReactive: true,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "brushed-metal",
    name: "Brushed Metal",
    tagline: "Stries directionnelles, texture simulée en CSS.",
    details:
      "Métal brossé : stries obtenues par repeating-linear-gradient, reflets directionnels.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "translucent-gel",
    name: "Translucent Gel",
    tagline: "Volume translucide, reflets internes, profondeur douce.",
    details:
      "Gel translucide : highlight interne en haut, dégradé organique, ombre colorée.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "solid-surface",
    name: "Solid Surface",
    tagline: "Couleur pleine, netteté et lisibilité maximales.",
    details:
      "Surface pleine : pas de flou, ombres et profondeur réglables. Le repli sûr.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "holographic-foil",
    name: "Holographic Foil",
    tagline: "Reflets arc-en-ciel qui glissent avec l'accent.",
    details:
      "Film holographique : le dégradé spectral se déplace selon l'intensité de Glow.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "frosted-acrylic",
    name: "Frosted Acrylic",
    tagline: "Plexiglas dépoli épais, bordure qui capte la lumière.",
    details:
      "Acrylique : plus épais et plus opaque que le verre dépoli, bordure interne marquée.",
    blurReactive: true,
    alphaReactive: true,
    glowReactive: true,
  },
  {
    id: "carbon-fiber",
    name: "Carbon Fiber",
    tagline: "Trame tissée en diagonale, reflets froids.",
    details:
      "Fibre de carbone : trame croisée à 45°, reflet linéaire, teinte froide.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "ceramic-glaze",
    name: "Ceramic Glaze",
    tagline: "Émail brillant, reflet mouillé, profondeur douce.",
    details:
      "Céramique émaillée : reflet large et mou en haut, ombre interne en bas.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },
  {
    id: "sandblasted-stone",
    name: "Sandblasted Stone",
    tagline: "Grain mat, aucun reflet spéculaire.",
    details:
      "Pierre sablée : grain fin simulé par un bruit SVG, aucune brillance.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
  },
  {
    id: "liquid-mercury",
    name: "Liquid Mercury",
    tagline: "Métal liquide, reflets mous et déformés.",
    details:
      "Mercure : reflets larges et étirés, sans arêtes franches comme le chrome.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: true,
  },

  /* ---------------------------------------------------------------- 16. Clay */
  {
    id: "clay-porcelain",
    name: "Clay Porcelain",
    tagline: "Pâte à modeler : volume gonflé, relief mou, enfoncement au toucher.",
    details:
      "Porcelaine claymorphique : la surface semble pétrie, avec un reflet diffus en haut-gauche et une ombre portée épaisse en bas-droite. Au toucher, le bouton s'enfonce comme une pastille de pâte. La forme Sharp casse l'illusion — elle est désactivée pour ce matériau.",
    blurReactive: false,
    alphaReactive: false,
    glowReactive: false,
    rejectsSharp: true,
  },
];

export const MATERIAL_MAP: Record<MaterialId, MaterialDef> = Object.fromEntries(
  MATERIALS.map((m) => [m.id, m])
) as Record<MaterialId, MaterialDef>;
