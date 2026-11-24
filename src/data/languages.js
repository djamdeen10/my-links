// The languages the site is translated into. `native` is the endonym shown in
// the picker, `locale` drives Intl formatting, `ogLocale` is the Open Graph
// form, and `dir` flips the document for right-to-left scripts.
export const LANGUAGES = [
  { code: 'en', locale: 'en-US', ogLocale: 'en_US', native: 'English', dir: 'ltr' },
  { code: 'fr', locale: 'fr-FR', ogLocale: 'fr_FR', native: 'Français', dir: 'ltr' },
  { code: 'es', locale: 'es-ES', ogLocale: 'es_ES', native: 'Español', dir: 'ltr' },
  { code: 'ar', locale: 'ar', ogLocale: 'ar_AR', native: 'العربية', dir: 'rtl' },
  { code: 'pt', locale: 'pt-PT', ogLocale: 'pt_PT', native: 'Português', dir: 'ltr' },
  { code: 'zh', locale: 'zh-CN', ogLocale: 'zh_CN', native: '简体中文', dir: 'ltr' },
  { code: 'ja', locale: 'ja-JP', ogLocale: 'ja_JP', native: '日本語', dir: 'ltr' },
  { code: 'ru', locale: 'ru-RU', ogLocale: 'ru_RU', native: 'Русский', dir: 'ltr' },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

// The picker remembers the choice between visits.
export const STORAGE_KEY = 'djamdeen-links.language';

export function findLanguage(code) {
  if (!code) return null;
  const wanted = String(code).toLowerCase();
  return LANGUAGES.find((language) => language.code === wanted) ?? null;
}
