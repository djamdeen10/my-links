import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, STORAGE_KEY, findLanguage } from '../data/languages.js';
import { applyDocumentLanguage } from './document.js';
import { languageFromPath, languagePath } from './routes.js';
import { translate } from './translate.js';

const I18nContext = createContext(null);

function readStoredLanguage() {
  if (typeof window === 'undefined') return null;

  try {
    return findLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Storage can be blocked (private mode); fall back to the browser language.
    return null;
  }
}

// The first browser language the site speaks, English when none match.
function detectBrowserLanguage() {
  const tags =
    typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language];

  for (const tag of tags) {
    const match = findLanguage(String(tag).split('-')[0]);
    if (match) return match;
  }

  return DEFAULT_LANGUAGE;
}

// The URL is the source of truth: the prerendered page and the first client
// render must agree, so the language is read from the path, not from storage.
function languageFromLocation() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  return languageFromPath(window.location.pathname) ?? DEFAULT_LANGUAGE;
}

export function I18nProvider({ children, initialLanguage }) {
  // `initialLanguage` is only used by the prerender, which renders one page per
  // language outside a browser.
  const [language, setLanguageState] = useState(
    () => initialLanguage ?? languageFromLocation(),
  );

  const setLanguage = useCallback((value) => {
    const next = typeof value === 'string' ? findLanguage(value) : value;
    if (!next) return;

    setLanguageState(next);

    if (languageFromPath(window.location.pathname)?.code !== next.code) {
      // A push, not a replace: the back button returns to the previous language.
      window.history.pushState(null, '', languagePath(next.code));
    }
  }, []);

  const t = useCallback((key, values) => translate(language, key, values), [language]);

  // Applied before paint so a right-to-left language never flashes in LTR.
  useLayoutEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  // `/` is the English page. A language the visitor already picked, or the one
  // their browser asks for, sends them to that language's own URL once.
  useEffect(() => {
    if (initialLanguage) return;
    if (languageFromPath(window.location.pathname)) return;

    const preferred = readStoredLanguage() ?? detectBrowserLanguage();
    if (preferred.code === DEFAULT_LANGUAGE.code) return;

    window.history.replaceState(null, '', languagePath(preferred.code));
    setLanguageState(preferred);
  }, [initialLanguage]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, language.code);
    } catch {
      // Nothing to remember, the choice still applies to this visit.
    }
  }, [language.code]);

  // Back and forward move between language URLs without a reload.
  useEffect(() => {
    const onPopState = () => setLanguageState(languageFromLocation());

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keep tabs in sync when the language is changed in another one.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY) return;

      const next = findLanguage(event.newValue);
      if (!next) return;

      setLanguageState(next);

      if (languageFromPath(window.location.pathname)?.code !== next.code) {
        window.history.replaceState(null, '', languagePath(next.code));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(
    () => ({ language, languages: LANGUAGES, setLanguage, t }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>.');
  return context;
}
