import { useI18n } from '../i18n/index.jsx';

export function LinkRow({ link }) {
  const { t } = useI18n();
  const external = link.href.startsWith('http');

  return (
    <a
      href={link.href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group flex h-14 items-center justify-center rounded-[14px] border border-white/10 bg-neutral-900/40 px-4 text-center text-[13.5px] font-semibold tracking-[-0.005em] text-neutral-100 outline-none transition-colors duration-200 hover:border-white/15 hover:bg-neutral-900/60 focus-visible:ring-2 focus-visible:ring-neutral-400/50 sm:px-5"
    >
      <span className="min-w-0 truncate">{t(`links.${link.id}`)}</span>
    </a>
  );
}
