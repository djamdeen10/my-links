import ar from './locales/ar.js';
import en from './locales/en.js';
import es from './locales/es.js';
import fr from './locales/fr.js';
import ja from './locales/ja.js';
import pt from './locales/pt.js';
import ru from './locales/ru.js';
import zh from './locales/zh.js';

// One bundle per entry in src/data/languages.js. Keys are shared by all of
// them; English is the fallback when a locale misses a key.
export const MESSAGES = { en, fr, es, ar, pt, zh, ja, ru };
