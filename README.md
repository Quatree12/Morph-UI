# MORPH/UI — Experimental Design Atlas

> Explore interactions. Bend materials. Shape interfaces.

Laboratoire visuel et fonctionnel pour les patterns d'interaction UI/UX contemporains.
On y explore, modifie, combine, compare et exporte des composants — avec de vrais
composants HTML/CSS/JS, jamais des captures d'écran.

## Démarrage

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # sert le build
npm run typecheck  # contrôle TypeScript, sans émission
```

Aucun `lint` n'est configuré (pas d'ESLint dans ce projet) : le contrôle qualité
automatique disponible est `npm run typecheck`.

## Déploiement sur GitHub Pages

1. Créez un dépôt et poussez le contenu de ce dossier à la racine :

```bash
git init
git add .
git commit -m "MORPH/UI — Experimental Design Atlas"
git branch -M main
git remote add origin https://github.com/<votre-compte>/morph-ui.git
git push -u origin main
```

2. Le workflow `.github/workflows/deploy.yml` publie automatiquement le build à
   chaque push sur `main`.

3. Dans le dépôt : **Settings → Pages → Source = GitHub Actions**.

4. Le site sera servi sur `https://<votre-compte>.github.io/morph-ui/`.

`vite.config.ts` utilise `base: "./"`, donc le build fonctionne aussi bien sous
un sous-chemin (`/morph-ui/`) qu'à la racine du domaine. Si vous déployez sur un
domaine personnalisé à la racine, vous pouvez passer `base: "/"`.

## Architecture

```
src/
├── App.tsx                  routage par état de section
├── nav.tsx                  les 8 destinations + leurs icônes SVG inline
├── state/
│   ├── types.ts             StudioState, Creation, PatternId, MaterialId…
│   ├── defaults.ts          état initial (cible du bouton Reset) + 
│   │                        définition des 8 contrôles avancés
│   ├── StudioProvider.tsx   état partagé + application des variables CSS
│   ├── context.ts           useStudio()
│   └── storage.ts           persistance localStorage
├── data/
│   ├── patterns.ts          les 12 patterns (description, a11y, pros/cons…)
│   ├── materials.ts         les 9 matériaux
│   ├── shapes.ts            les 5 formes
│   └── colors.ts            les 12 accents
├── previews/
│   ├── index.tsx            les 12 comportements de pattern
│   └── PhoneFrame.tsx       maquette de smartphone
├── components/              Layout, Controls, LibraryControls, ClipboardButton
├── lib/exporters.ts         générateurs CSS / React / Framer Motion
├── sections/                les 8 sections
└── styles/                  tokens, base, layout, materials, patterns
```

## Le contrat central : réglage → rendu

`StudioProvider` pose chaque champ de `StudioState` comme variable CSS sur
`<html>`. Les feuilles de style consomment ces variables. Il n'existe donc pas
de réglage « décoratif » : un contrôle = une variable = un effet observable.

| Réglage | Variable CSS | Consommateur |
|---|---|---|
| Pattern | — | composant rendu dans la maquette |
| Material | classe `.m--<id>` | surfaces de l'objet principal |
| Shape | classe `.shape--<id>` | géométrie de l'objet |
| Color | `--accent` | bordures, halos, indicateurs, états actifs |
| Blur | `--blur` | matériaux translucides |
| Animation Speed | `--speed-mul` | durée de toutes les transitions |
| Border Radius | `--radius` | géométrie (sauf Pill et Sharp, expliqué dans l'UI) |
| Shadow Intensity | `--shadow` | ombres portées |
| Glow Intensity | `--glow` | halos et lueurs |
| Transparency | `--alpha` | opacité des surfaces |
| Spring / Bounce | `--bounce` | ressort radial, rebond, amplitude cinétique |
| Size | `--size` | échelle de l'objet |

## Les 12 patterns

Liquid Glass · Gooey / Metaball · Expandable Buttons · Floating Dock ·
Experimental Navigation · Morphing Shapes · Radial Menus · Kinetic Interactions ·
Lens / Magnification · Collapsible Interfaces · Expressive Motion ·
Contextual Toolbars

Chacun possède sa propre composition, sa géométrie et son animation — il n'y a
pas d'animation décorative partagée.

## Persistance et ses limites

Favoris et créations sont stockés dans le `localStorage` du navigateur. Ce projet
n'a volontairement **ni backend ni authentification** : il n'y a donc **aucune
synchronisation entre appareils**, et rien n'est présenté comme tel dans
l'interface. En navigation privée, où `localStorage` peut être indisponible,
l'app continue de fonctionner mais les données ne survivent pas au rechargement
(Settings l'indique).

## Vérifications effectuées

Ces vérifications ont été faites manuellement par lecture du code ; elles ne
remplacent pas une campagne de tests automatisés, qui n'est pas fournie.

- **Pattern** — les 12 identifiants ont un rendu dédié dans
  `PATTERN_RENDERERS` ; `PATTERN_MAP[state.pattern]` alimente description,
  recommandations et export, donc le texte suit le pattern choisi.
- **Material** — 9 classes distinctes dans `materials.css`, toutes appliquées à
  la surface principale `.subject`/`.morph` et aux pastilles du sélecteur.
- **Shape** — 5 classes de géométrie ; Squircle utilise un masque en plus du
  rayon. Pill et Sharp désactivent le réglage Border Radius avec explication.
- **Color** — 12 pastilles + pipette native ; l'accent écrit `--accent`, lu par
  les bordures, halos et états actifs.
- **Advanced** — 8 curseurs, valeurs affichées en direct via `<output>` lié par
  `htmlFor`.
- **Reset** — `reset()` réinstalle `DEFAULT_STATE` en une copie, ce qui couvre
  pattern, matériau, forme, couleur, vitesse et paramètres avancés.
- **Favoris** — `toggleFavorite`, filtre `Favorites` dans Explore, section Saved.
- **Compare** — deux sélecteurs indépendants + réglages partagés + tableau.
- **Export** — trois générateurs distincts, bouton Copy avec repli `execCommand`
  et retour visuel ; limitations affichées sous le code.
- **Mobile** — dock flottant, `overflow-x: hidden`, cibles ≥ 44 px, tampon
  `env(safe-area-inset-bottom)`, maquette en premier dans l'ordre de lecture.

## Ce qui n'est pas fait

- Aucun test automatisé (pas de Vitest / Playwright).
- L'export React et Framer Motion fournit l'ossature du composant principal, pas
  les comportements multi-éléments (métaballes, menu radial, dock) — signalé
  dans l'interface au moment de l'export.
- Pas de rendu de documents, pas de backend, pas de comptes.

## Accessibilité

Cibles tactiles ≥ 44 px, focus visible de 2 px, `prefers-reduced-motion` respecté
(et forçable depuis Settings), nav au clavier, `aria-expanded` / `aria-selected` /
`aria-current` / `aria-live` sur les composants concernés, aucune information
portée par le seul survol ou le seul mouvement.
