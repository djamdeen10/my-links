import { useEffect, useRef, useState } from 'react';
import { languagePath } from '../../i18n/routes.js';
import { useI18n } from '../../i18n/index.jsx';
import { ChevronDown, Translate } from './Icons.jsx';

export function LanguageSelector() {
  const { language, languages, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const others = languages.filter((item) => item.code !== language.code);
  const currentLabel = t('a11y.language', { language: language.native });

  const choose = (event, item) => {
    // A plain click switches in place; ctrl/middle clicks keep the real URL, so
    // "open this language in a new tab" works the way it does for any link.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    setLanguage(item);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? 'language-menu' : undefined}
        aria-label={currentLabel}
        title={currentLabel}
        className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-white/15 bg-neutral-950/75 px-2 text-[11px] font-medium text-neutral-200 backdrop-blur-md transition-colors duration-150 hover:bg-neutral-900/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
      >
        <Translate className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <span lang={language.code} className="whitespace-nowrap">
          {language.native}
        </span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 opacity-60 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open ? (
        <div
          id="language-menu"
          className="lang-menu pop-in absolute top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 shadow-xl"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label={t('a11y.closeLanguageMenu')}
            className="flex h-8 w-full items-center gap-1.5 px-2 text-start text-[11px] font-semibold text-neutral-50 focus:outline-none"
          >
            <Translate className="h-4 w-4 shrink-0" />
            <span lang={language.code} className="flex-1 whitespace-nowrap">
              {language.native}
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 rotate-180 opacity-70" />
          </button>

          <ul
            aria-label={t('a11y.chooseLanguage')}
            className="max-h-64 border-t border-neutral-800 py-1"
          >
            {others.map((item) => (
              <li key={item.code}>
                <a
                  href={languagePath(item.code)}
                  hrefLang={item.code}
                  onClick={(event) => choose(event, item)}
                  className="flex w-full items-center gap-2 px-2.5 py-1.5 text-start text-xs text-neutral-300 transition-colors hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
                >
                  <span
                    dir={item.dir}
                    lang={item.code}
                    className="flex-1 whitespace-nowrap"
                  >
                    {item.native}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-neutral-500"
                  >
                    {item.code}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
