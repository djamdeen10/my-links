import { DEFAULT_LANGUAGE, LANGUAGES } from './data/languages.js';
import { profile } from './data/profile.js';
import { languagePath } from './i18n/routes.js';
import { translate } from './i18n/translate.js';

export const SITE_URL = 'https://links.djamdeen.com';
const SHARE_IMAGE = 'https://djamdeen.com/og/djam-deen.png';
const SHARE_IMAGE_WIDTH = '1200';
const SHARE_IMAGE_HEIGHT = '630';

export function absoluteUrl(code) {
  return `${SITE_URL}${languagePath(code)}`;
}

const SAME_AS = profile.socials
  .filter((social) => social.href.startsWith('http'))
  .map((social) => social.href);

// One description of everything a language page needs in its head. The
// prerender serialises it, the app applies it to the live document, so the
// static HTML and a client-side switch can never disagree.
export function headEntries(language, { root = false } = {}) {
  const t = (key) => translate(language, key);
  const canonical = root ? absoluteUrl(DEFAULT_LANGUAGE.code) : absoluteUrl(language.code);
  const title = t('meta.title');
  const description = t('meta.description');
  const shareTitle = t('meta.ogTitle');
  const shareDescription = t('meta.ogDescription');
  const shareAlt = t('meta.ogImageAlt');

  const alternates = [
    ...LANGUAGES.map((item) => ({
      rel: 'alternate',
      hreflang: item.code,
      href: absoluteUrl(item.code),
    })),
    { rel: 'alternate', hreflang: 'x-default', href: absoluteUrl(DEFAULT_LANGUAGE.code) },
  ];

  const metas = [
    { attribute: 'name', key: 'description', content: description },
    { attribute: 'name', key: 'author', content: profile.name },
    {
      attribute: 'name',
      key: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1',
    },
    { attribute: 'property', key: 'og:type', content: 'profile' },
    { attribute: 'property', key: 'og:site_name', content: profile.name },
    { attribute: 'property', key: 'og:title', content: shareTitle },
    { attribute: 'property', key: 'og:description', content: shareDescription },
    { attribute: 'property', key: 'og:url', content: canonical },
    { attribute: 'property', key: 'og:image', content: SHARE_IMAGE },
    { attribute: 'property', key: 'og:image:width', content: SHARE_IMAGE_WIDTH },
    { attribute: 'property', key: 'og:image:height', content: SHARE_IMAGE_HEIGHT },
    { attribute: 'property', key: 'og:image:alt', content: shareAlt },
    { attribute: 'property', key: 'og:locale', content: language.ogLocale },
    ...LANGUAGES.filter((item) => item.code !== language.code).map((item) => ({
      attribute: 'property',
      key: 'og:locale:alternate',
      content: item.ogLocale,
    })),
    { attribute: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attribute: 'name', key: 'twitter:site', content: '@djamdeen10' },
    { attribute: 'name', key: 'twitter:creator', content: '@djamdeen10' },
    { attribute: 'name', key: 'twitter:title', content: shareTitle },
    { attribute: 'name', key: 'twitter:description', content: shareDescription },
    { attribute: 'name', key: 'twitter:image', content: SHARE_IMAGE },
    { attribute: 'name', key: 'twitter:image:alt', content: shareAlt },
  ];

  const links = [{ rel: 'canonical', href: canonical }, ...alternates];

  // ProfilePage + Person + the featured app: enough for a search engine to
  // answer "who is this and what did they build" without guessing.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: profile.name,
        alternateName: profile.handle,
        description: translate(DEFAULT_LANGUAGE, 'meta.description'),
        inLanguage: LANGUAGES.map((item) => item.code),
      },
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#page`,
        url: canonical,
        name: title,
        description,
        inLanguage: language.code,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: profile.name,
        alternateName: profile.handle,
        url: canonical,
        image: `${SITE_URL}/avatar.jpg`,
        jobTitle: t('taglines.role'),
        description: shareDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cotonou',
          addressCountry: 'BJ',
        },
        knowsLanguage: LANGUAGES.map((item) => item.code),
        sameAs: SAME_AS,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://agentmob.djamdeen.com/#app',
        name: 'AgentMob',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Android, iOS',
        url: 'https://agentmob.djamdeen.com',
        description: t('featured.title'),
        author: { '@id': `${SITE_URL}/#person` },
      },
    ],
  };

  return { title, metas, links, jsonLd };
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Serialised once per language while building: no JavaScript needed to read
// the title, the description or the structured data.
export function renderSeoBlock(language, options) {
  const { title, metas, links, jsonLd } = headEntries(language, options);

  return [
    `<title>${escapeHtml(title)}</title>`,
    ...metas.map(
      ({ attribute, key, content }) =>
        `<meta data-seo ${attribute}="${key}" content="${escapeHtml(content)}" />`,
    ),
    ...links.map(
      ({ rel, href, hreflang }) =>
        `<link data-seo rel="${rel}"${hreflang ? ` hreflang="${hreflang}"` : ''} href="${escapeHtml(href)}" />`,
    ),
    `<script data-seo type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

// The same entries, applied to the live document after a client-side switch.
export function syncDocumentHead(language, options = {}) {
  if (typeof document === 'undefined') return;

  const { title, metas, links, jsonLd } = headEntries(language, options);

  document.title = title;

  // The prerendered tags carry the same marker, so a switch replaces instead of
  // stacking a second set of social meta on top of the first.
  for (const node of document.head.querySelectorAll('[data-seo]')) node.remove();

  const fragment = document.createDocumentFragment();

  for (const { attribute, key, content } of metas) {
    const node = document.createElement('meta');
    node.setAttribute(attribute, key);
    node.setAttribute('content', content);
    node.dataset.seo = '';
    fragment.append(node);
  }

  for (const { rel, href, hreflang } of links) {
    const node = document.createElement('link');
    node.rel = rel;
    node.href = href;
    if (hreflang) node.hreflang = hreflang;
    node.dataset.seo = '';
    fragment.append(node);
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.seo = '';
  script.textContent = JSON.stringify(jsonLd);
  fragment.append(script);

  document.head.append(fragment);
}
