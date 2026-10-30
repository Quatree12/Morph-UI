import { useState } from "react";
import { PATTERNS, PATTERN_MAP } from "../data/patterns";
import { MATERIALS } from "../data/materials";
import { COLORS } from "../data/colors";
import { SHAPES } from "../data/shapes";
import { useStudio } from "../state/context";
import { Group } from "../components/Controls";
import type { PatternId } from "../state/types";
import type { SectionId } from "../nav";

const GLOBAL_GUIDELINES: Array<{ title: string; body: string }> = [
  {
    title: "Zones tactiles",
    body: "44 × 44 px minimum sur toutes les cibles, 48 px sur la navigation principale. Sur le dock, chaque item réserve 56 px et le libellé textuel évite l'ambiguïté des icônes seules.",
  },
  {
    title: "Contraste",
    body: "Texte principal ≥ 4.5:1. Sur une surface translucide, le contraste dépend de l'arrière-plan : testez sur les fonds les plus clairs ET les plus sombres de votre app, pas seulement sur le fond de la maquette.",
  },
  {
    title: "Focus clavier",
    body: "Le focus visible est un contour de 2 px. Ne supprimez jamais outline sans le remplacer : chaque composant interactif de MORPH/UI est atteignable au clavier et affiche son état de focus.",
  },
  {
    title: "Attributs ARIA",
    body: "aria-expanded pour les composants qui se déploient, aria-selected pour les onglets, aria-current=\"page\" pour la navigation, aria-live=\"polite\" pour les changements d'état annoncés.",
  },
  {
    title: "Retours d'état",
    body: "Un état pressé doit être visible immédiatement (scale 0.97, changement de teinte). Le retour visuel doit exister au toucher, pas seulement au survol.",
  },
  {
    title: "Animations excessives",
    body: "Une animation ne doit jamais retarder une action. Au-delà de 400 ms perçu, l'interface paraît lente. Le curseur Animation Speed du Studio sert précisément à tester ce seuil.",
  },
  {
    title: "prefers-reduced-motion",
    body: "La requête média est respectée dans la feuille de style, et Settings permet en plus de forcer le mode réduit pour tester. Les animations sont neutralisées en durée, jamais l'information.",
  },
  {
    title: "Lisibilité sur surfaces transparentes",
    body: "Sous un texte long, préférez Solid Surface ou Soft Matte. Le verre dépoli convient aux libellés courts (boutons, badges) mais fatigue la lecture sur un paragraphe.",
  },
];

export function Docs({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const { set } = useStudio();
  const [active, setActive] = useState<PatternId>("liquid-glass");
  const p = PATTERN_MAP[active];

  return (
    <section style={{ display: "grid", gap: "var(--s-5)" }}>
      <header className="section-head">
        <div className="eyebrow">Documentation / Guidelines</div>
        <h1>Interaction Guidelines</h1>
        <p className="muted" style={{ maxWidth: "62ch" }}>
          Une fiche par pattern, plus les règles transverses et le référentiel du Studio.
        </p>
      </header>

      <div className="panel">
        <div className="panel__head">
          <div className="eyebrow">Choisir un pattern</div>
        </div>
        <div className="panel__body">
          <label htmlFor="doc-pattern" className="visually-hidden">
            Pattern documenté
          </label>
          <select
            id="doc-pattern"
            value={active}
            onChange={(e) => setActive(e.target.value as PatternId)}
            style={selectStyle}
          >
            {PATTERNS.map((x) => (
              <option key={x.id} value={x.id}>{x.name}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--sm btn--primary"
            onClick={() => {
              set("pattern", active);
              onNavigate("playground");
            }}
          >
            Charger ce pattern dans le Studio
          </button>
        </div>
      </div>

      {/* Fiche du pattern, en accordéon */}
      <Group title={p.name} badge={p.category} defaultOpen>
        <p className="muted">{p.description}</p>

        <Section title="Quand l'utiliser">
          <ul style={ulStyle}>{p.useCases.map((u) => <li key={u}>{u}</li>)}</ul>
        </Section>

        <Section title="Quand l'éviter">
          <ul style={ulStyle}>{p.cons.map((c) => <li key={c}>{c}</li>)}</ul>
        </Section>

        <Section title="Comportement tactile">
          <p style={pStyle}>{p.mobile}</p>
        </Section>

        <Section title="Compatibilité desktop">
          <p style={pStyle}>{p.desktop}</p>
        </Section>

        <Section title="Accessibilité">
          <ul style={ulStyle}>{p.a11y.map((a) => <li key={a}>{a}</li>)}</ul>
        </Section>

        <Section title="Performance">
          <p style={pStyle}>{PERFORMANCE[active]}</p>
        </Section>

        <Section title="Réduction de mouvement">
          <p style={pStyle}>
            Quand <code>prefers-reduced-motion</code> est actif, les transitions de ce pattern
            sont neutralisées en durée et les animations bouclées s'arrêtent après un cycle.
            L'information portée par le mouvement est dans tous les cas doublée par un libellé
            textuel ou un état ARIA.
          </p>
        </Section>

        <Section title="Bonnes pratiques">
          <ul style={ulStyle}>{p.pros.map((x) => <li key={x}>{x}</li>)}</ul>
        </Section>

        <Section title="Exemple d'utilisation">
          <p style={pStyle}>{EXAMPLES[active]}</p>
        </Section>
      </Group>

      {/* Accordéons transverses */}
      <div style={{ display: "grid", gap: "var(--s-3)" }}>
        <Group title="Matériaux, formes et accents" badge={`${MATERIALS.length} · ${SHAPES.length} · ${COLORS.length}`} defaultOpen={false}>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                {MATERIALS.length} matériaux
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "var(--s-3)",
                }}
              >
                {MATERIALS.map((m) => (
                  <div key={m.id} style={{ display: "grid", gap: 6 }}>
                    <span
                      className={`m m--${m.id}`}
                      style={{ height: 56, borderRadius: 12, display: "block" }}
                      aria-hidden="true"
                    />
                    <span style={{ fontSize: "0.8125rem" }}>{m.name}</span>
                    <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                      {m.tagline}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{m.details}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{SHAPES.length} formes</div>
              <ul style={ulStyle}>
                {SHAPES.map((s) => (
                  <li key={s.id}>
                    <strong style={{ color: "var(--text)" }}>{s.name}</strong> — {s.note}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{COLORS.length} accents</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {COLORS.map((c) => (
                  <span key={c.id} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: c.hex,
                        border: "1px solid var(--border)",
                      }}
                      aria-hidden="true"
                    />
                    <span className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
                      {c.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Group>

        <Group title="Règles transverses" badge={String(GLOBAL_GUIDELINES.length)} defaultOpen={false}>
          <div style={{ display: "grid", gap: "var(--s-4)" }}>
            {GLOBAL_GUIDELINES.map((g) => (
              <div key={g.title} style={{ display: "grid", gap: 6 }}>
                <h3 style={{ fontSize: "0.9375rem" }}>{g.title}</h3>
                <p style={pStyle}>{g.body}</p>
              </div>
            ))}
          </div>
        </Group>

        <Group title="Référentiel du Studio" badge="11" defaultOpen={false}>
          <div className="table-scroll">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Réglage</th>
                  <th>Variable CSS produite</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Material</td><td className="mono">classe .m--&lt;matériau&gt;</td></tr>
                <tr><td>Shape</td><td className="mono">classe .shape--&lt;forme&gt;</td></tr>
                <tr><td>Color</td><td className="mono">--accent</td></tr>
                <tr><td>Blur</td><td className="mono">--blur</td></tr>
                <tr><td>Animation Speed</td><td className="mono">--speed-mul (1 / vitesse)</td></tr>
                <tr><td>Border Radius</td><td className="mono">--radius</td></tr>
                <tr><td>Shadow Intensity</td><td className="mono">--shadow</td></tr>
                <tr><td>Glow Intensity</td><td className="mono">--glow</td></tr>
                <tr><td>Transparency</td><td className="mono">--alpha</td></tr>
                <tr><td>Spring / Bounce</td><td className="mono">--bounce</td></tr>
                <tr><td>Size</td><td className="mono">--size</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mono" style={{ fontSize: "0.625rem", color: "var(--text-faint)" }}>
            Chaque ligne correspond à une variable réellement posée sur &lt;html&gt; par le
            StudioProvider, donc consommée par la maquette.
          </p>
        </Group>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "grid", gap: 6 }}>
      <h3 style={{ fontSize: "0.9375rem" }}>{title}</h3>
      {children}
    </section>
  );
}

const selectStyle = {
  minHeight: 44,
  padding: "0 var(--s-2)",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--border)",
  background: "var(--surface-2)",
} as const;

const ulStyle = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 5,
  color: "var(--text-dim)",
  fontSize: "0.875rem",
} as const;

const pStyle = {
  color: "var(--text-dim)",
  fontSize: "0.875rem",
} as const;

/* 16 clés — le Record exige exactement une entrée par membre de PatternId. */
const PERFORMANCE: Record<PatternId, string> = {
  "liquid-glass": "backdrop-filter est accéléré par le GPU mais impose une passe de composition. Limitez la surface floutée et évitez les surfaces qui défilent en continu.",
  gooey: "Le filtre SVG (flou + seuil alpha) est le point coûteux. Gardez une surface d'effet réduite et ne l'animez pas pendant un scroll.",
  "expandable-button": "Très léger : le déploiement est une transition de grille, sans recalcul de mise en page coûteux.",
  "floating-dock": "Léger : seules des transformations. Le transform ne déclenche ni repaint ni relayout.",
  "experimental-nav": "La mesure de largeur se fait au montage et au redimensionnement, pas à chaque frame.",
  "morphing-shapes": "Très léger : une transition de border-radius est composée par le GPU.",
  "radial-menu": "Léger : les items se déplacent par transform. Attention au delay en cascade si vous montez à plus de 8 items.",
  kinetic: "À surveiller : l'animation de scaleY provoque un repaint. Limitez le nombre de barres et préférez transform.",
  lens: "Le plus coûteux du catalogue : il duplique un rendu, avec backdrop-filter sur la zone. À éviter en dehors des écrans dédiés.",
  collapsible: "L'animation de grid-template-rows est correcte ; animer height directement provoquerait un relayout à chaque frame.",
  "expressive-motion": "Ressorts peu coûteux, mais n'en faites pas jouer deux en parallèle sur la même zone.",
  "contextual-toolbar": "Léger : le coût vient de backdrop-filter si vous gardez le flou sur la barre.",
  "sheet-drag": "L'écriture d'une hauteur en pixels à chaque frame est ce qui coûte. Passez par transform quand la structure le permet.",
  "parallax-layers": "Trois couches en transform : acceptable. Le coût vient des images, pas du décalage.",
  "swipe-stack": "setPointerCapture évite les événements perdus, mais la rotation calculée à chaque frame doit rester une transform.",
  "ripple-surface": "Une animation de scale sur un élément positionné en absolu est peu coûteuse. On garde trois ondes au maximum.",
  "holographic-foil": "Le dégradé spectral est une background-size de 240 % déplacée par Glow. Le déplacement est composé par le GPU, coût négligeable.",
  "frosted-acrylic": "Comme le verre dépoli mais avec une bordure de 2 px en plus : le coût vient du backdrop-filter et de la bordure, pas de la texture.",
  "carbon-fiber": "Deux repeating-linear-gradient croisés : aucune image chargée, coût nul. Le repaint est stable car le fond ne se déplace pas.",
  "ceramic-glaze": "Dégradés radiaux et ombres internes uniquement : très léger, aucun backdrop-filter, aucune image.",
  "sandblasted-stone": "Le grain est un bruit SVG en data-URI répété sur la surface. C'est le point coûteux : évitez de l'appliquer sur une surface défilante.",
  "liquid-mercury": "Trois dégradés superposés dont un radial qui suit Glow. Évitez de l'animer en boucle.",
};

/* 16 clés — même exigence. */
const EXAMPLES: Record<PatternId, string> = {
  "liquid-glass": "Une barre de lecture flottant au-dessus d'une pochette d'album : la jaquette reste devinée à travers la surface, le titre reste lisible.",
  gooey: "Un indicateur de chargement à trois billes qui se rejoignent puis se séparent pendant une synchronisation.",
  "expandable-button": "Un bouton « Envoyer » qui se déploie et propose « Programmer », « Brouillon » et « Annuler ».",
  "floating-dock": "La navigation principale d'une app de création, avec l'outil actif agrandi et soulevé.",
  "experimental-nav": "Trois vues d'un tableau de bord — Données, Styles, Motion — reliées par un indicateur qui glisse.",
  "morphing-shapes": "Un avatar qui passe du cercle au squircle quand l'utilisateur est vérifié.",
  "radial-menu": "Un bouton central dans une app de retouche qui déploie cinq outils autour du pouce.",
  kinetic: "Un en-tête de campagne dont les barres réagissent à la position du pointeur.",
  lens: "Un sélecteur de couleur qui agrandit la zone survolée pour viser le pixel exact.",
  collapsible: "Une fiche produit où seule la description courte s'affiche, le détail technique restant replié.",
  "expressive-motion": "Un toast de confirmation pour un paiement, avec un ressort marqué et borné.",
  "contextual-toolbar": "Une barre qui n'apparaît qu'à partir du moment où deux messages sont sélectionnés.",
  "sheet-drag": "Une app de cartographie : on déplie la fiche d'un lieu sur trois hauteurs selon ce qu'on veut lire.",
  "parallax-layers": "Une page produit où le packshot, le titre et le fond doré glissent à trois vitesses différentes.",
  "swipe-stack": "Une file de modération : on rejette à gauche, on valide à droite, la carte suivante remonte.",
  "ripple-surface": "Un pavé de commande domotique qui confirme le toucher par une onde partant du point exact pressé.",
  "holographic-foil": "Une carte de fidélité d'une app de mode : la surface arc-en-ciel attire l'œil sans image ni logo.",
  "frosted-acrylic": "Un panneau de réglages flottant au-dessus d'une photo, qui laisse deviner l'arrière-plan tout en gardant ses contours.",
  "carbon-fiber": "Le tableau de bord d'une app de sport automobile, où la texture évoque la matière sans la photographier.",
  "ceramic-glaze": "Un badge de statut « vérifié » posé sur une fiche produit, avec un relief doux qui invite au toucher.",
  "sandblasted-stone": "Un choix de matière dans un configurateur : la surface mate et sans reflet évoque la pierre brute.",
  "liquid-mercury": "Un bouton d'action principal dans une app de paiement : le métal liquide donne une impression de valeur sans être criard.",
};
