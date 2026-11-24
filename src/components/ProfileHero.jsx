import { profile } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';
import { LanguageSelector } from './ui/LanguageSelector.jsx';

function TaglineRow({ items }) {
  const { t } = useI18n();

  return (
    <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12.5px] font-medium text-neutral-300">
      {items.map((item) => (
        <span key={item.id} className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span aria-hidden="true" className="text-[14px] leading-none">
            {item.emoji}
          </span>
          {t(`taglines.${item.id}`)}
        </span>
      ))}
    </p>
  );
}

export function ProfileHero() {
  const { t } = useI18n();

  return (
    <header className="relative">
      {/* The photo keeps the original full-width treatment. Only its crop and
          the height of the fade changed so the image is less cut. */}
      <div className="relative h-[clamp(300px,72vw,360px)] w-full bg-card">
        <picture>
          {/* 480px covers phones at DPR 1, 736px is the largest the source has. */}
          <source
            type="image/webp"
            srcSet="/avatar-480.webp 480w, /avatar-736.webp 736w"
            sizes="(min-width: 640px) 600px, 100vw"
          />
          <img
            src={profile.photo}
            alt={t('hero.photoAlt')}
            width="736"
            height="740"
            fetchPriority="high"
            decoding="async"
            className="hero-photo absolute inset-0 h-full w-full object-cover object-[50%_46%]"
          />
        </picture>
        <div aria-hidden="true" className="hero-top-scrim absolute inset-0" />

        <div className="hero-controls absolute inset-x-0 top-0 z-20 flex items-start px-3.5 pb-3.5">
          <LanguageSelector />
        </div>
      </div>

      <div className="enter relative z-10 -mt-3 px-5 text-center sm:px-6">
        <h1 className="text-[clamp(1.85rem,8.2vw,2.2rem)] font-bold leading-none tracking-[-0.02em] text-foreground rtl:tracking-normal">
          {profile.name}
        </h1>
        <div className="mt-2.5 flex flex-col items-center gap-1">
          {profile.taglines.map((row, index) => (
            <TaglineRow key={index} items={row} />
          ))}
        </div>
      </div>
    </header>
  );
}
