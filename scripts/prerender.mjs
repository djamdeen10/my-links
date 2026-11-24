// Post-build pass: every language becomes a real page at /<code>/ with its own
// title, description, hreflang cluster and schema.org data, plus sitemap.xml,
// robots.txt and llms.txt for search engines and AI answer engines.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../src/data/languages.js';
import { profile } from '../src/data/profile.js';
import { SITE_URL, absoluteUrl, renderSeoBlock } from '../src/seo.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');
const ssrDir = join(rootDir, 'dist-ssr');

const HEAD_MARKER = /<meta name="x-prerender-head"[^>]*>/;
const ROOT_MARKER = '<div id="root"></div>';
const HTML_TAG = /<html([^>]*)>/;

// The shell ships with an English title for the dev server; the built head
// brings its own, so the copy in the template has to go or it would win.
const template = (await readFile(join(distDir, 'index.html'), 'utf8')).replace(
  /\s*<title>[\s\S]*?<\/title>/,
  '',
);
const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

function buildPage(language, options) {
  const body = render({ language: language.code });

  if (!HEAD_MARKER.test(template)) {
    throw new Error('prerender: head marker missing from dist/index.html');
  }
  if (!template.includes(ROOT_MARKER)) {
    throw new Error('prerender: #root marker missing from dist/index.html');
  }

  return template
    .replace(HEAD_MARKER, () => renderSeoBlock(language, options))
    .replace(HTML_TAG, (_match, attributes) => {
      // lang drives the font stack, dir drives the reading direction.
      const kept = attributes.replace(/\s(lang|dir)="[^"]*"/g, '');
      return `<html${kept} lang="${language.code}" dir="${language.dir}">`;
    })
    .replace(ROOT_MARKER, `<div id="root">${body}</div>`);
}

// The English page also answers on "/", which canonicalises to /en/ so the two
// never compete for the same query.
await writeFile(join(distDir, 'index.html'), buildPage(DEFAULT_LANGUAGE, { root: true }));

for (const language of LANGUAGES) {
  const dir = join(distDir, language.code);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), buildPage(language));
}

const lastmod = new Date().toISOString().slice(0, 10);

const alternates = [
  ...LANGUAGES.map(
    (item) =>
      `    <xhtml:link rel="alternate" hreflang="${item.code}" href="${absoluteUrl(item.code)}" />`,
  ),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(DEFAULT_LANGUAGE.code)}" />`,
].join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGUAGES.map(
  (language) => `  <url>
    <loc>${absoluteUrl(language.code)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${language.code === DEFAULT_LANGUAGE.code ? '1.0' : '0.8'}</priority>
${alternates}
  </url>`,
).join('\n')}
</urlset>
`;

const robots = `# Every crawler is welcome, including the ones that answer questions with citations.
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const PROFILE_LABELS = { website: 'Website', email: 'Email', github: 'GitHub', x: 'X', facebook: 'Facebook' };

const profiles = profile.socials
  .map((social) => {
    const label = PROFILE_LABELS[social.id] ?? social.id;
    return social.href.startsWith('mailto:')
      ? `- ${label}: ${social.href.slice('mailto:'.length)}`
      : `- [${label}](${social.href})`;
  })
  .join('\n');

const llms = `# ${profile.name} — Links

> Official link hub for ${profile.name} (${profile.handle}), a backend developer and AI-assisted
> product builder based in Cotonou, Benin. It gathers his website, social profiles,
> contact details and AgentMob, an app that drives CLI AI agents from a phone while
> they work on the computer.

## Pages

One canonical page per language; all of them describe the same person and links:

${LANGUAGES.map((language) => `- [${language.native}](${absoluteUrl(language.code)})`).join('\n')}

## Profiles

${profiles}

## Projects

- [AgentMob](https://agentmob.djamdeen.com): control CLI AI agents from a phone while they run on the computer.
- [AgentMob on GitHub](https://github.com/djamdeen10/agentmob-local-server)
- [Why I built AgentMob](https://djamdeen.com/blog/why-i-built-agentmob)

## Notes

- Every page ships its content in the HTML, with hreflang alternates and
  schema.org ProfilePage / Person / SoftwareApplication data.
- The site is available in English, French, Spanish, Arabic, Portuguese,
  Chinese, Japanese and Russian.
`;

await writeFile(join(distDir, 'sitemap.xml'), sitemap);
await writeFile(join(distDir, 'robots.txt'), robots);
await writeFile(join(distDir, 'llms.txt'), llms);

await rm(ssrDir, { recursive: true, force: true });

console.log(`prerendered ${LANGUAGES.length} language pages + sitemap.xml, robots.txt, llms.txt`);
