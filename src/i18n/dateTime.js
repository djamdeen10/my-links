// The footer clock follows the visitor's language. Digits stay Latin so the
// mono line keeps the same width whatever locale is active.
const DIGITS = { numberingSystem: 'latn' };

export function formatTime(locale, timeZone, date = new Date()) {
  return new Intl.DateTimeFormat(locale, {
    ...DIGITS,
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

// The zone abbreviation is whatever the language calls it (WAT, UTC+1,
// غرينتش+1), so it never has to be translated by hand.
export function formatTimeZone(locale, timeZone, date = new Date()) {
  const parts = new Intl.DateTimeFormat(locale, {
    ...DIGITS,
    timeZone,
    timeZoneName: 'short',
  }).formatToParts(date);

  return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
}
