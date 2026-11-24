import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { DEFAULT_LANGUAGE, findLanguage } from './data/languages.js';
import { I18nProvider } from './i18n/index.jsx';

// Used at build time only: one static page is produced per language, so the
// content, the title and the structured data are in the HTML before React runs.
export function render({ language = DEFAULT_LANGUAGE.code } = {}) {
  return renderToString(
    <I18nProvider initialLanguage={findLanguage(language) ?? DEFAULT_LANGUAGE}>
      <App />
    </I18nProvider>,
  );
}
