import { useMemo, useState } from 'react';
import { linkGroups, pinnedLinks } from '../data/profile.js';
import { useI18n } from '../i18n/index.jsx';
import { FeaturedCard } from './FeaturedCard.jsx';
import { GroupNav } from './GroupNav.jsx';
import { LinkList } from './LinkList.jsx';
import { ProfileFooter } from './ProfileFooter.jsx';
import { ProfileHero } from './ProfileHero.jsx';
import { SocialLinks } from './SocialLinks.jsx';

export function BioPage() {
  const { t } = useI18n();
  const [activeGroup, setActiveGroup] = useState('pinned');
  const selectedGroup = linkGroups.find((group) => group.id === activeGroup);

  // Labels are translated here so the tab pill is measured on the final text.
  const groups = useMemo(
    () => [
      { id: 'pinned', label: t('groups.pinned') },
      ...linkGroups.map(({ id }) => ({ id, label: t(`groups.${id}`) })),
    ],
    [t],
  );

  return (
    <div className="flex min-h-dvh w-full justify-center sm:px-6 sm:py-8">
      <main className="relative w-full overflow-hidden bg-card sm:max-w-[600px] sm:min-h-[calc(100dvh-4rem)] sm:rounded-[2rem] sm:border sm:border-neutral-800 sm:shadow-[0_40px_100px_-45px_rgba(0,0,0,0.95)]">
        <ProfileHero />

        <div className="enter px-5 pb-2 sm:px-6" style={{ animationDelay: '90ms' }}>
          <div className="mt-4">
            <SocialLinks />
          </div>

          <div className="mt-6 flex justify-center">
            <GroupNav groups={groups} active={activeGroup} onChange={setActiveGroup} />
          </div>

          <div key={activeGroup} id="links-panel" className="filter-enter mt-5">
            {activeGroup === 'pinned' ? (
              <>
                <LinkList links={pinnedLinks} />
                <div className="mt-2.5">
                  <FeaturedCard />
                </div>
              </>
            ) : selectedGroup ? (
              <div>
                {selectedGroup.id === 'agentmob' ? <FeaturedCard /> : null}
                <LinkList
                  links={selectedGroup.links}
                  className={selectedGroup.id === 'agentmob' ? 'mt-2.5' : ''}
                />
              </div>
            ) : null}
          </div>

          <ProfileFooter />
        </div>
      </main>
    </div>
  );
}
