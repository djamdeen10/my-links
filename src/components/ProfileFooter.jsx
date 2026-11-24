import { profile } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';

// Frozen at build time. `suppressHydrationWarning` only matters on the night
// the year changes between a deploy and a visit.
const YEAR = new Date().getFullYear();

export function ProfileFooter() {
  const { t } = useI18n();

  return (
    <footer className="page-footer mt-8 border-t border-neutral-800/80 pt-5 text-center">
      <p
        suppressHydrationWarning
        className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-neutral-500 rtl:tracking-normal"
      >
        {/* The Latin half is isolated so a right-to-left page keeps
            "© 2026 Djam Deen" in that order instead of flipping it. */}
        <span dir="ltr">
          © {YEAR} {profile.name}
        </span>
        <span aria-hidden="true"> — </span>
        {t('footer.rights')}
      </p>
    </footer>
  );
}
