import { useEffect, useState } from 'react';
import { profile } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';
import { formatTime, formatTimeZone } from '../i18n/dateTime.js';

// The clock follows the page language: the same instant, read the local way.
function LocalClock({ locale, timeZone, timeTitle }) {
  // Started after mount: a clock baked into the static HTML would be frozen at
  // build time. Rendering nothing until then also keeps hydration honest.
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return null;

  return (
    <>
      <time dateTime={now.toISOString()} title={timeTitle} className="font-mono tabular-nums">
        {formatTime(locale, timeZone, now)}
      </time>
      <span>{formatTimeZone(locale, timeZone, now)}</span>
    </>
  );
}

export function ProfileFooter() {
  const { language, t } = useI18n();
  const location = t('footer.location');

  return (
    <footer className="page-footer mt-8 border-t border-neutral-800/80 pt-5 text-center">
      <a
        href={profile.website}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-semibold tracking-tight text-neutral-100 outline-none transition-colors hover:text-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400/50"
      >
        {profile.handle}.
      </a>
      <p className="mt-1.5 flex flex-wrap items-center justify-center gap-x-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 rtl:tracking-normal">
        <span>{location}</span>
        <span aria-hidden="true" className="text-neutral-600">
          ·
        </span>
        <LocalClock
          locale={language.locale}
          timeZone={profile.timeZone}
          timeTitle={t('footer.timeTitle', { location })}
        />
      </p>
    </footer>
  );
}
