import { syncDocumentHead } from '../seo.js';

// Keep <html lang/dir> and the head in step with the language in the URL, so a
// client-side switch leaves the document exactly like a freshly loaded page.
export function applyDocumentLanguage(language) {
  const root = document.documentElement;
  root.lang = language.code;
  root.dir = language.dir;

  syncDocumentHead(language);
}
