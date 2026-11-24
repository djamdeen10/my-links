import { findLanguage } from '../data/languages.js';

// Every language lives at its own path, so a link, a search result or a share
// carries the language with it instead of relying on a stored preference.
export function languagePath(code) {
  return `/${code}/`;
}

// `/fr`, `/fr/` and any deeper path all resolve to French; `/` has no
// language of its own and lets the caller decide.
export function languageFromPath(pathname) {
  if (typeof pathname !== 'string') return null;

  const [first] = pathname.split('/').filter(Boolean);
  return first ? findLanguage(first) : null;
}
