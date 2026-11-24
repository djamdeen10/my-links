// Only things that do not change between visits live here. Copy belongs to the
// translation bundles in src/i18n/locales: entries carry the id their label is
// looked up with, so a new card stays a one-object change.
export const profile = {
  name: 'Djam Deen',
  handle: 'djamdeen10',
  email: 'djamdeen10@gmail.com',
  website: 'https://djamdeen.com',
  photo: '/avatar.jpg',
  taglines: [
    [
      { id: 'role', emoji: '👨‍💻' },
      { id: 'ai', emoji: '🤖' },
    ],
    [
      { id: 'fcb', emoji: '⚽' },
      { id: 'cats', emoji: '🐱' },
    ],
  ],
  socials: [
    { id: 'website', icon: 'globe', href: 'https://djamdeen.com' },
    { id: 'email', icon: 'mail', href: 'mailto:djamdeen10@gmail.com' },
    { id: 'github', icon: 'github', href: 'https://github.com/djamdeen10' },
    { id: 'x', icon: 'twitter', href: 'https://x.com/djamdeen10' },
    {
      id: 'facebook',
      icon: 'facebook',
      href: 'https://www.facebook.com/profile.php?id=61596138017027',
    },
  ],
};

// The curated first tab: the links to put forward. AgentMob is the
// featured card below them, not a separate row.
export const pinnedLinks = [
  // `uppercase` is the one row the design sets in caps: the personal site.
  { id: 'website', href: 'https://djamdeen.com', uppercase: true },
  { id: 'github', href: 'https://github.com/djamdeen10' },
];

// Links are grouped; the filter above the list renders "Pinned" plus these
// groups, in this order.
export const linkGroups = [
  {
    id: 'contact',
    links: [
      { id: 'email', href: 'mailto:djamdeen10@gmail.com' },
      { id: 'x', href: 'https://x.com/djamdeen10' },
      {
        id: 'facebook',
        href: 'https://www.facebook.com/profile.php?id=61596138017027',
      },
      { id: 'github', href: 'https://github.com/djamdeen10' },
    ],
  },
  {
    id: 'agentmob',
    links: [
      {
        id: 'agentmobGithub',
        href: 'https://github.com/djamdeen10/agentmob-local-server',
      },
      {
        id: 'agentmobBlog',
        href: 'https://djamdeen.com/blog/why-i-built-agentmob',
      },
    ],
  },
];

export const featuredProject = {
  href: 'https://agentmob.djamdeen.com',
  cover: '/covers/agentmob-cover-presentation.svg',
};
