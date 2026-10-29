import type { Complexity, ControlKey, PatternId } from "../state/types";

export interface PatternDef {
  id: PatternId;
  name: string;
  category: string;
  description: string;
  useCases: string[];
  complexity: Complexity;
  /** Contextes d'utilisation servant aux filtres du catalogue. */
  contexts: string[];
  mobile: string;
  desktop: string;
  pros: string[];
  cons: string[];
  a11y: string[];
  /** Contrôles désactivés pour ce pattern, avec la raison affichée. */
  disabledControls?: Partial<Record<ControlKey, string>>;
}

export const PATTERNS: PatternDef[] = [
  {
    id: "liquid-glass",
    name: "Liquid Glass",
    category: "Surfaces",
    description:
      "Empilement de surfaces translucides à reflets spéculaires. Le contenu transparaît à travers l'objet, la lumière rasante dessine une bordure claire et un highlight interne se déplace au toucher.",
    useCases: [
      "Barres de contrôle flottantes",
      "Cartes superposées sur média",
      "Feuilles modales en surimpression",
    ],
    complexity: "intermédiaire",
    contexts: ["Surfaces", "Superposition", "Média"],
    mobile: "Excellent : le flou d'arrière-plan est natif et performant.",
    desktop: "Excellent, avec en plus un highlight qui suit le pointeur.",
    pros: ["Profondeur immédiate", "Hiérarchie claire sans bordure lourde", "Très tactile"],
    cons: ["Contraste dépendant de l'arrière-plan", "Coût GPU du backdrop-filter"],
    a11y: [
      "Prévoir un repli opaque si backdrop-filter est absent",
      "Vérifier un contraste ≥ 4.5:1 sur la surface floutée",
      "Ne pas coder une information par la seule translucidité",
    ],
  },
  {
    id: "gooey",
    name: "Gooey / Metaball UI",
    category: "Organique",
    description:
      "Plusieurs éléments circulaires fusionnent visuellement grâce à un filtre SVG de flou + seuil alpha. Les billes se séparent et se rejoignent de façon organique, déclenchées par l'interaction.",
    useCases: ["Indicateurs de progression", "FAB à billes qui s'écartent", "Chargements vivants"],
    complexity: "avancé",
    contexts: ["Organique", "Décoratif", "Feedback"],
    mobile: "Bon : filtre SVG léger si la surface reste petite.",
    desktop: "Excellent, la surface d'effet peut être plus large.",
    pros: ["Signature visuelle forte", "Sensation de matière vivante", "Peu de DOM"],
    cons: ["Le filtre SVG coûte cher sur grande surface", "Contraste des billes à surveiller"],
    a11y: [
      "Le filtre SVG est purement décoratif : aria-hidden",
      "Toujours doubler l'état par un texte ou un libellé",
      "Limiter la surface du filtre sur mobile",
    ],
    disabledControls: {
      blur: "Le flou est ici produit par le filtre SVG (goo), pas par le champ Blur.",
    },
  },
  {
    id: "expandable-button",
    name: "Expandable Buttons",
    category: "Action",
    description:
      "Un bouton compact se déploie au toucher, révélant ses actions secondaires et changeant de géométrie. Le composant se referme d'un second toucher ou en sélectionnant une action.",
    useCases: ["Actions secondaires contextuelles", "Envoi rapide", "Barre d'outils compacte"],
    complexity: "simple",
    contexts: ["Action", "Toolbar", "Mobile"],
    mobile: "Excellent : cible tactile large, expansion verticale maîtrisée.",
    desktop: "Excellent au clic, focus clavier à gérer.",
    pros: ["Économise l'espace", "Découvrable", "Transition lisible"],
    cons: ["Peut déplacer le contenu autour", "État à annoncer aux lecteurs d'écran"],
    a11y: [
      "aria-expanded sur le déclencheur",
      "aria-controls pointant le conteneur révélé",
      "Repli possible avec Échap",
    ],
  },
  {
    id: "floating-dock",
    name: "Floating Dock",
    category: "Navigation",
    description:
      "Barre d'icônes flottante : l'icône active s'agrandit et se soulève, les voisines s'inclinent légèrement, et la sélection change réellement de destination.",
    useCases: ["Navigation principale mobile", "Barre d'outils d'édition", "Sélecteur de mode"],
    complexity: "simple",
    contexts: ["Navigation", "Toolbar", "Mobile"],
    mobile: "Excellent : cibles de 56 px, zone sûre respectée.",
    desktop: "Excellent, magnification au survol en bonus.",
    pros: ["Familier", "Très tactile", "État actif immédiatement lisible"],
    cons: ["Occupe de la hauteur", "Icônes seules = sens à expliciter"],
    a11y: [
      "Chaque item : aria-label explicite",
      "aria-current=\"page\" sur la destination active",
      "Ordre de tabulation = ordre visuel",
    ],
  },
  {
    id: "experimental-nav",
    name: "Experimental Navigation",
    category: "Navigation",
    description:
      "Navigation par capsules avec indicateur animé qui glisse d'un onglet à l'autre. Le changement d'onglet est réel et l'indicateur se redimensionne selon le libellé.",
    useCases: ["Sections d'application", "Filtres segmentés", "Bascule de vue"],
    complexity: "intermédiaire",
    contexts: ["Navigation", "Filtrage", "Mobile"],
    mobile: "Bon : défilement horizontal si les onglets débordent.",
    desktop: "Excellent, indicateur fluide.",
    pros: ["Hiérarchie nette", "Transition continue", "Peu de code"],
    cons: ["Beaucoup d'onglets = défilement", "Mesure de largeur nécessaire"],
    a11y: [
      "Rôle tablist / tab / tabpanel",
      "Flèches gauche-droite pour changer d'onglet",
      "tabindex=-1 sur les onglets inactifs",
    ],
  },
  {
    id: "morphing-shapes",
    name: "Morphing Shapes",
    category: "Géométrie",
    description:
      "La géométrie de l'objet se transforme progressivement entre plusieurs silhouettes. Le changement de forme est déclenché par une interaction et interpolé par le navigateur.",
    useCases: ["Avatar de profil", "Transitions d'état", "Illustrations d'état vide"],
    complexity: "intermédiaire",
    contexts: ["Géométrie", "Transition", "Marque"],
    mobile: "Excellent : transition de border-radius très peu coûteuse.",
    desktop: "Excellent.",
    pros: ["Continuité visuelle forte", "Aucune librairie requise", "Peu de DOM"],
    cons: ["Interpolation limitée au border-radius", "Peu d'information portée"],
    a11y: [
      "La forme ne doit jamais être le seul signal d'état",
      "animate() à éviter si reduced-motion est actif",
      "Annoncer le changement d'état par un texte",
    ],
  },
  {
    id: "radial-menu",
    name: "Radial Menus",
    category: "Action",
    description:
      "Menu circulaire dont les actions se répartissent autour d'un centre fixe. Ouverture, sélection et fermeture sont fonctionnelles ; les items apparaissent en cascade depuis le centre.",
    useCases: ["Actions rapides au pouce", "Menu contextuel dense", "Sélecteur de couleur circulaire"],
    complexity: "avancé",
    contexts: ["Action", "Menu", "Mobile"],
    mobile: "Bon : pensé pour le pouce, rayon à limiter sur petit écran.",
    desktop: "Excellent au clic.",
    pros: ["Actions proches du pouce", "Compact à l'état fermé", "Mémorisable"],
    cons: ["Découvrabilité faible", "Distribution en angle à calculer"],
    a11y: [
      "Rôle menu, items en role=menuitem",
      "Échap ferme et rend le focus au déclencheur",
      "Piège de focus tant que le menu est ouvert",
    ],
  },
  {
    id: "kinetic",
    name: "Kinetic Interactions",
    category: "Mouvement",
    description:
      "Le contenu se déplace et se déforme en réponse au pointeur, au toucher ou à la frappe. Un curseur de force pilote l'amplitude de déformation.",
    useCases: ["Hero interactif", "Cartes produits", "Effets de marque"],
    complexity: "intermédiaire",
    contexts: ["Mouvement", "Marque", "Décoratif"],
    mobile: "Moyen : pas de survol, on retombe sur le toucher.",
    desktop: "Excellent : suivi du pointeur continu.",
    pros: ["Très expressif", "Réagit instantanément", "Peu de DOM"],
    cons: ["Coûteux en repaint", "À limiter si reduced-motion"],
    a11y: [
      "Jamais d'information portée par le seul mouvement",
      "Désactiver le suivi de pointeur si reduced-motion",
      "Limiter le re-render : transform + requestAnimationFrame",
    ],
  },
  {
    id: "lens",
    name: "Lens / Magnification",
    category: "Surfaces",
    description:
      "Une zone de loupe agrandit localement le contenu sous le pointeur. Le diamètre et l'intensité de l'effet sont ajustables et la zone d'effet reste clairement délimitée.",
    useCases: ["Sélecteur de couleur détaillé", "Lecture de petites données", "Aperçu de galerie"],
    complexity: "avancé",
    contexts: ["Surfaces", "Lecture", "Média"],
    mobile: "Moyen : à piloter au toucher, geste moins précis.",
    desktop: "Excellent : suit le pointeur précisément.",
    pros: ["Précision accrue", "Effet spectaculaire", "Réutilise le DOM réel"],
    cons: ["Duplique le rendu", "Calcul de position à chaque frame"],
    a11y: [
      "Le contenu agrandi doit rester disponible sans la loupe",
      "Loupe aria-hidden, le texte source fait foi",
      "Zone d'effet visible pour ne pas désorienter",
    ],
  },
  {
    id: "collapsible",
    name: "Collapsible Interfaces",
    category: "Structure",
    description:
      "Panneau qui se déploie et se réduit avec une transition fluide. Le contenu est réellement monté/démonté : sa hauteur mesurée pilote l'animation.",
    useCases: ["Réglages avancés", "Fiches détaillées", "Accordéons de contenu"],
    complexity: "simple",
    contexts: ["Structure", "Contenu", "Mobile"],
    mobile: "Excellent : réduit drastiquement la hauteur de page.",
    desktop: "Excellent.",
    pros: ["Scannable", "Économise l'écran", "Accessible par nature"],
    cons: ["Contenu masqué = découvrabilité", "Mesure de hauteur nécessaire"],
    a11y: [
      "Ne pas animer height sur un conteneur aria-hidden",
      "aria-expanded + aria-controls obligatoires",
      "Le contenu replié reste atteignable par recherche",
    ],
  },
  {
    id: "expressive-motion",
    name: "Expressive Motion",
    category: "Mouvement",
    description:
      "Rebonds, ressorts et déformations élastiques. Le curseur Spring / Bounce pilote directement la physique de l'animation, et l'amplitude reste bornée pour le confort visuel.",
    useCases: ["Feedback de réussite", "Apparition de contenu", "Boutons d'action primaire"],
    complexity: "intermédiaire",
    contexts: ["Mouvement", "Feedback", "Marque"],
    mobile: "Bon : ressorts peu coûteux, amplitude bornée.",
    desktop: "Excellent.",
    pros: ["Sensation de qualité", "Feedback gratifiant", "Paramétrable"],
    cons: ["Rebond excessif = distraction", "Deux animations simultanées à éviter"],
    a11y: [
      "Respecter strictement prefers-reduced-motion",
      "Plafonner l'amplitude de rebond",
      "Jamais d'animation en boucle sur l'élément focalisé",
    ],
    disabledControls: {
      blur: "Ce pattern joue sur la physique du mouvement : le flou n'y a pas d'effet.",
    },
  },
  {
    id: "contextual-toolbar",
    name: "Contextual Toolbars",
    category: "Action",
    description:
      "Barre d'outils qui apparaît selon l'état de l'interface : sélection multiple, édition, mode actif. Ses actions sont réelles et la fermeture restaure l'état précédent.",
    useCases: ["Édition en lot", "Mode dessin", "Sélection de message"],
    complexity: "intermédiaire",
    contexts: ["Action", "Toolbar", "Structure"],
    mobile: "Excellent : remplace une barre fixe permanente.",
    desktop: "Excellent.",
    pros: ["Contexte explicite", "Gagne de la place", "Actions réelles visibles"],
    cons: ["Apparition à ne pas faire clignoter", "État partagé à synchroniser"],
    a11y: [
      "role=\"toolbar\" + aria-label",
      "Annoncer l'apparition via aria-live",
      "Échap quitte le mode et restaure le focus",
    ],
  },
  {
    id: "sheet-drag",
    name: "Sheet Drag",
    category: "Structure",
    description:
      "Un panneau se déplie depuis le bas et suit le doigt. Il s'accroche à trois hauteurs — replié, mi-hauteur, plein écran — selon la distance parcourue et la vélocité du geste.",
    useCases: [
      "Panneau de détail au-dessus d'une carte",
      "Feuille de filtres ou de réglages",
      "Lecteur audio en pleine hauteur",
    ],
    complexity: "avancé",
    contexts: ["Structure", "Superposition", "Mobile"],
    mobile: "Idéal : c'est un pattern pensé pour le pouce, avec une poignée de 48 px.",
    desktop: "Utile au clic, mais le glissement est moins naturel qu'un panneau fixe.",
    pros: ["Grande surface de contenu", "Geste familier", "Trois états mémorisables"],
    cons: ["Gestion de vélocité à calibrer", "Contenu masqué à l'état replié"],
    a11y: [
      "Une poignée cliquable double toujours le geste de glissement",
      "aria-expanded sur le déclencheur, rôle dialog si le panneau modal",
      "Échap replie le panneau et rend le focus au déclencheur",
    ],
  },
  {
    id: "parallax-layers",
    name: "Parallax Layers",
    category: "Mouvement",
    description:
      "Trois plans superposés glissent à des vitesses différentes quand on fait défiler. La profondeur naît uniquement du décalage entre les plans, sans perspective ni 3D.",
    useCases: ["En-tête de produit", "Illustration d'onboarding", "Fond de section éditoriale"],
    complexity: "intermédiaire",
    contexts: ["Mouvement", "Marque", "Média"],
    mobile: "Bon : seules des transformations, mais surveiller le coût sur grand écran.",
    desktop: "Excellent : l'effet est plus lisible sur une grande fenêtre.",
    pros: ["Profondeur immédiate", "Aucune librairie", "Grande surface pour les matériaux"],
    cons: ["Peut gêner la lecture si trop marqué", "Coûteux sur de très grandes images"],
    a11y: [
      "Ne jamais animer pendant prefers-reduced-motion",
      "Le contenu doit rester lisible sans l'effet de décalage",
      "Limiter l'amplitude pour éviter le mal des transports",
    ],
  },
  {
    id: "swipe-stack",
    name: "Swipe Stack",
    category: "Géométrie",
    description:
      "Un empilement de cartes qu'on fait glisser latéralement. La rotation suit le doigt, un seuil déclenche le rejet ou la validation, et la carte suivante remonte au premier plan.",
    useCases: ["Tri de contenu", "Sélection de profil", "File d'attente de décisions"],
    complexity: "avancé",
    contexts: ["Géométrie", "Décision", "Mobile"],
    mobile: "Excellent : geste naturel au pouce, seuil à calibrer généreusement.",
    desktop: "Utilisable à la souris, mais l'alternative boutons est indispensable.",
    pros: ["Décision rapide", "Très tactile", "Grande surface par carte"],
    cons: ["Accessibilité délicate", "Aucun retour arrière naturel"],
    a11y: [
      "Toujours doubler le geste par deux boutons explicites",
      "Annoncer le résultat du geste via aria-live",
      "Proposer une annulation après rejet",
    ],
  },
  {
    id: "ripple-surface",
    name: "Ripple Surface",
    category: "Surfaces",
    description:
      "Une onde concentrique part du point touché et se propage sur toute la surface. L'amplitude et le nombre d'ondes sont pilotés par le point de contact.",
    useCases: ["Retour tactile sur une surface", "Effet de marque", "Déclenchement d'une action"],
    complexity: "intermédiaire",
    contexts: ["Surfaces", "Feedback", "Marque"],
    mobile: "Excellent : le point de contact est le doigt, l'effet est immédiat.",
    desktop: "Excellent au clic, la position du pointeur sert de centre.",
    pros: ["Retour d'état très lisible", "Grande surface", "Peu de DOM"],
    cons: ["Purement décoratif : à ne pas utiliser seul", "Plusieurs ondes simultanées = coût"],
    a11y: [
      "Purement décoratif : aria-hidden sur les ondes",
      "Le retour d'état doit exister aussi sans animation",
      "Limiter à trois ondes simultanées",
    ],
  },
];

export const PATTERN_MAP: Record<PatternId, PatternDef> = Object.fromEntries(
  PATTERNS.map((p) => [p.id, p])
) as Record<PatternId, PatternDef>;

export const COMPLEXITIES: Complexity[] = ["simple", "intermédiaire", "avancé"];

/** Catégories dérivées des patterns : pas de liste en dur à maintenir. */
export const CATEGORIES: string[] = Array.from(
  new Set(PATTERNS.map((p) => p.category))
).sort((a, b) => a.localeCompare(b, "fr"));
