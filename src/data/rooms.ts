export type BullChatRoom = {
  slug: string;
  name: string;
  description: string;
  avatar: string;
  thumbnail: string;
  desktopHero: string;
  mobileHero: string;
  backgroundPattern: string;
};

export const rooms: BullChatRoom[] = [
  {
    slug: "ansem-community",
    name: "$ANSEM Community",
    description:
      "The main community room for $ANSEM holders, supporters, and contributors.",
    avatar: "/rooms/ansem-community/avatar.webp",
    thumbnail: "/rooms/ansem-community/thumbnail.webp",
    desktopHero: "/rooms/ansem-community/hero-cover-desktop.webp",
    mobileHero: "/rooms/ansem-community/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/ansem-community/background-pattern.webp",
  },
  {
    slug: "bull-community",
    name: "Bull Community",
    description:
      "The general BullChat community room for conversations, networking, and updates.",
    avatar: "/rooms/bull-community/avatar.webp",
    thumbnail: "/rooms/bull-community/thumbnail.webp",
    desktopHero: "/rooms/bull-community/hero-cover-desktop.webp",
    mobileHero: "/rooms/bull-community/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/bull-community/background-pattern.webp",
  },
  {
    slug: "builders",
    name: "Builders",
    description:
      "A room for developers, designers, founders, and creators building in Web3.",
    avatar: "/rooms/builders/avatar.webp",
    thumbnail: "/rooms/builders/thumbnail.webp",
    desktopHero: "/rooms/builders/hero-cover-desktop.webp",
    mobileHero: "/rooms/builders/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/builders/background-pattern.webp",
  },
  {
    slug: "market-talk",
    name: "Market Talk",
    description:
      "Discuss market movements, charts, research, trading ideas, and crypto narratives.",
    avatar: "/rooms/market-talk/avatar.webp",
    thumbnail: "/rooms/market-talk/thumbnail.webp",
    desktopHero: "/rooms/market-talk/hero-cover-desktop.webp",
    mobileHero: "/rooms/market-talk/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/market-talk/background-pattern.webp",
  },
  {
    slug: "job-board",
    name: "Job Board",
    description:
      "Discover Web3 opportunities, share portfolios, and connect with talented contributors.",
    avatar: "/rooms/job-board/avatar.webp",
    thumbnail: "/rooms/job-board/thumbnail.webp",
    desktopHero: "/rooms/job-board/hero-cover-desktop.webp",
    mobileHero: "/rooms/job-board/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/job-board/background-pattern.webp",
  },
  {
    slug: "meme-studio",
    name: "Meme Studio",
    description:
      "Create, share, and collaborate on original crypto memes and community content.",
    avatar: "/rooms/meme-studio/avatar.webp",
    thumbnail: "/rooms/meme-studio/thumbnail.webp",
    desktopHero: "/rooms/meme-studio/hero-cover-desktop.webp",
    mobileHero: "/rooms/meme-studio/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/meme-studio/background-pattern.webp",
  },
  {
    slug: "launchpad-hub",
    name: "Launchpad Hub",
    description:
      "Explore and discuss launches from Bags, Pump.fun, LetsBonk, and Four.meme.",
    avatar: "/rooms/launchpad-hub/avatar.webp",
    thumbnail: "/rooms/launchpad-hub/thumbnail.webp",
    desktopHero: "/rooms/launchpad-hub/hero-cover-desktop.webp",
    mobileHero: "/rooms/launchpad-hub/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/launchpad-hub/background-pattern.webp",
  },
  {
    slug: "community-support",
    name: "Community Support",
    description:
      "Get help with onboarding, accounts, technical issues, moderation, and BullChat features.",
    avatar: "/rooms/community-support/avatar.webp",
    thumbnail: "/rooms/community-support/thumbnail.webp",
    desktopHero: "/rooms/community-support/hero-cover-desktop.webp",
    mobileHero: "/rooms/community-support/hero-cover-mobile.webp",
    backgroundPattern: "/rooms/community-support/background-pattern.webp",
  },
];

export function getRoomBySlug(slug: string): BullChatRoom | undefined {
  return rooms.find((room) => room.slug === slug);
}