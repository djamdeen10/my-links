# Djam Deen — Links

Page de liens personnelle, en huit langues, prérendue à la construction : le
contenu est dans le HTML, le JavaScript ne fait qu'hydrater.

## Stack

React 19, Vite 8 et Tailwind CSS 4. Pas de librairie de routage ni d'i18n : les
URL par langue et les traductions sont gérées par le projet (`src/i18n`).

## Langues

`/en/`, `/fr/`, `/es/`, `/ar/`, `/pt/`, `/zh/`, `/ja/`, `/ru/` : une page
prérendue par langue, avec son `title`, sa description, son `canonical`, son
cluster `hreflang` et ses données JSON-LD. `/` sert l'anglais, puis renvoie une
seule fois le visiteur vers la langue qu'il a déjà choisie.

## Commandes

```bash
npm install
npm run dev      # serveur de développement, port 5174
npm run build    # client + rendu serveur, puis prérendu de dist/
npm run preview  # sert dist/
```

Le build écrit aussi `sitemap.xml`, `robots.txt` et `llms.txt` à la racine de
`dist/`.

## Structure

- `src/i18n/locales/*.js` : les traductions, une clé par texte ;
- `src/data/profile.js` : identité, liens et groupes ;
- `src/seo.js` : balises SEO et JSON-LD, par langue ;
- `scripts/prerender.mjs` : pages par langue, sitemap, robots.txt, llms.txt.

## Déploiement

Héberger `dist/` sur un serveur statique en conservant un dossier par langue
(`/fr/index.html`) et la redirection `/fr` vers `/fr/`.
