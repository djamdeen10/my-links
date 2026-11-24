import { profile } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';
import { iconMap } from './ui/Icons.jsx';

export function SocialLinks() {
  const { t } = useI18n();

  return (
    <nav aria-label={t('a11y.socialLinks')} className="flex items-center justify-center gap-2">
      {profile.socials.map((social) => {
        const Icon = iconMap[social.icon];
        const external = social.href.startsWith('http');
        const label = t(`socials.${social.id}`);

        return (
          <a
            key={social.id}
            href={social.href}
            aria-label={label}
            title={label}
            {...(external ? { target: '_blank', rel: 'me noreferrer' } : {})}
            className="glass-chip glass-interactive inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </nav>
  );
}
