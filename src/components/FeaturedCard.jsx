import { featuredProject } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';

export function FeaturedCard() {
  const { t } = useI18n();

  return (
    <a
      href={featuredProject.href}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-xl border border-white/10 bg-neutral-900/40 outline-none transition-colors duration-300 hover:border-white/15 hover:bg-neutral-900/60 focus-visible:ring-2 focus-visible:ring-neutral-400/50"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#09090B]">
        <img
          src={featuredProject.cover}
          alt={t('featured.coverAlt')}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10"
        />
      </div>

      <div className="border-t border-white/10 px-5 py-3.5 text-center">
        <p className="text-balance text-[13px] font-medium leading-relaxed text-neutral-100">
          {t('featured.title')}
        </p>
      </div>
    </a>
  );
}
