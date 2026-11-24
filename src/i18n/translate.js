import { DEFAULT_LANGUAGE } from '../data/languages.js';
import { MESSAGES } from './messages.js';

const FALLBACK_MESSAGES = MESSAGES[DEFAULT_LANGUAGE.code];

function readMessage(bundle, key) {
  return key
    .split('.')
    .reduce((value, part) => (value && typeof value === 'object' ? value[part] : undefined), bundle);
}

// `{name}` placeholders keep word order free to differ between languages.
function interpolate(template, values) {
  if (!values) return template;

  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in values ? String(values[name]) : match,
  );
}

// Pure copy lookup, shared by the app and the build-time prerender, so the
// static HTML and the hydrated page can never drift apart.
export function translate(language, key, values) {
  const message = readMessage(MESSAGES[language.code], key) ?? readMessage(FALLBACK_MESSAGES, key);
  return typeof message === 'string' ? interpolate(message, values) : key;
}
