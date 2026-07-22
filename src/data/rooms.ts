// src/constants/rooms.ts

export interface RoomMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role?: "Moderator" | "Admin" | "Member";
  online?: boolean;
}

export interface RoomMessage {
  id: string;
  author: RoomMember;
  content: string;
  timestamp: string;
  reactions?: {
    emoji: string;
    count: number;
  }[];
}

export interface Room {
  slug: string;
  name: string;
  shortName?: string;
  description: string;

  avatar: string;
  thumbnail: string;
  backgroundPattern: string;
  heroCoverDesktop: string;
  heroCoverMobile: string;

  memberCount: number;
  memberCountLabel: string;
  onlineCount: number;
  onlineCountLabel: string;

  joined: boolean;
  flagship?: boolean;
  pinned?: boolean;

  welcomeTitle: string;
  welcomeMessage: string;

  members: RoomMember[];
  messages: RoomMessage[];
}

const defaultMembers: RoomMember[] = [
  {
    id: "deficrawler",
    name: "DefiCrawler",
    username: "@deficrawler",
    avatar: "/rooms/ansem-community/avatar.webp",
    role: "Moderator",
    online: true,
  },
  {
    id: "maya",
    name: "Maya",
    username: "@mayabuilds",
    avatar: "/rooms/bull-community/avatar.webp",
    role: "Member",
    online: true,
  },
  {
    id: "alex",
    name: "Alex",
    username: "@alexdev",
    avatar: "/rooms/builders/avatar.webp",
    role: "Member",
    online: true,
  },
  {
    id: "kemi",
    name: "Kemi",
    username: "@kemidesigns",
    avatar: "/rooms/meme-studio/avatar.webp",
    role: "Member",
    online: true,
  },
];

const defaultMessages: RoomMessage[] = [
  {
    id: "message-1",
    author: defaultMembers[0],
    content: "Morning builders. What is everyone shipping this week?",
    timestamp: "10:24 AM",
    reactions: [
      {
        emoji: "🔥",
        count: 12,
      },
      {
        emoji: "💚",
        count: 7,
      },
    ],
  },
];

export const ROOMS: Room[] = [
  {
    slug: "ansem-community",
    name: "Ansem Community",
    description:
      "The flagship home for the Ansem community — announcements, discussions and connection.",

    avatar: "/rooms/ansem-community/avatar.webp",
    thumbnail: "/rooms/ansem-community/thumbnail.webp",
    backgroundPattern: "/rooms/ansem-community/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/ansem-community/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/ansem-community/hero-cover-mobile.webp",

    memberCount: 25300,
    memberCountLabel: "25.3K",
    onlineCount: 412,
    onlineCountLabel: "412",

    joined: true,
    flagship: true,
    pinned: true,

    welcomeTitle: "Welcome to Ansem Community",
    welcomeMessage:
      "Connect with the community, join meaningful conversations and stay updated with important announcements.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "bull-community",
    name: "Bull Community",
    description:
      "Where the wider Bull community gathers to connect, share ideas and build relationships.",

    avatar: "/rooms/bull-community/avatar.webp",
    thumbnail: "/rooms/bull-community/thumbnail.webp",
    backgroundPattern: "/rooms/bull-community/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/bull-community/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/bull-community/hero-cover-mobile.webp",

    memberCount: 14200,
    memberCountLabel: "14.2K",
    onlineCount: 268,
    onlineCountLabel: "268",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Bull Community",
    welcomeMessage:
      "Connect with other community members, exchange ideas and contribute value to the conversation.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "builders",
    name: "Builders",
    description:
      "A focused space for developers, designers and founders building products across Web3.",

    avatar: "/rooms/builders/avatar.webp",
    thumbnail: "/rooms/builders/thumbnail.webp",
    backgroundPattern: "/rooms/builders/background-pattern.webp",
    heroCoverDesktop: "/rooms/builders/hero-cover-desktop.webp",
    heroCoverMobile: "/rooms/builders/hero-cover-mobile.webp",

    memberCount: 9100,
    memberCountLabel: "9.1K",
    onlineCount: 176,
    onlineCountLabel: "176",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Builders",
    welcomeMessage:
      "Share what you are building, exchange useful feedback and connect with other builders.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "job-board",
    name: "Job Board",
    description:
      "Discover Web3 jobs, freelance opportunities, collaborations and talented contributors.",

    avatar: "/rooms/job-board/avatar.webp",
    thumbnail: "/rooms/job-board/thumbnail.webp",
    backgroundPattern: "/rooms/job-board/background-pattern.webp",
    heroCoverDesktop: "/rooms/job-board/hero-cover-desktop.webp",
    heroCoverMobile: "/rooms/job-board/hero-cover-mobile.webp",

    memberCount: 8400,
    memberCountLabel: "8.4K",
    onlineCount: 121,
    onlineCountLabel: "121",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Job Board",
    welcomeMessage:
      "Share legitimate opportunities, provide clear requirements and avoid misleading job listings.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "market-talk",
    name: "Market Talk",
    description:
      "Discuss market movements, trading ideas, analysis and the wider crypto landscape.",

    avatar: "/rooms/market-talk/avatar.webp",
    thumbnail: "/rooms/market-talk/thumbnail.webp",
    backgroundPattern: "/rooms/market-talk/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/market-talk/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/market-talk/hero-cover-mobile.webp",

    memberCount: 11800,
    memberCountLabel: "11.8K",
    onlineCount: 205,
    onlineCountLabel: "205",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Market Talk",
    welcomeMessage:
      "Healthy market analysis is welcome. Micro-token shilling and unauthorized contract addresses are prohibited.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "meme-studio",
    name: "Meme Studio",
    description:
      "Create, share and enjoy the memes shaping crypto culture.",

    avatar: "/rooms/meme-studio/avatar.webp",
    thumbnail: "/rooms/meme-studio/thumbnail.webp",
    backgroundPattern: "/rooms/meme-studio/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/meme-studio/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/meme-studio/hero-cover-mobile.webp",

    memberCount: 6800,
    memberCountLabel: "6.8K",
    onlineCount: 94,
    onlineCountLabel: "94",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Meme Studio",
    welcomeMessage:
      "Keep conversations helpful, stay on topic and respect other members. Read the room guidelines before posting.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "launchpad-hub",
    name: "Launchpad Hub",
    description:
      "Discuss launch platforms, emerging projects and ecosystem activity across crypto.",

    avatar: "/rooms/launchpad-hub/avatar.webp",
    thumbnail: "/rooms/launchpad-hub/thumbnail.webp",
    backgroundPattern: "/rooms/launchpad-hub/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/launchpad-hub/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/launchpad-hub/hero-cover-mobile.webp",

    memberCount: 5700,
    memberCountLabel: "5.7K",
    onlineCount: 88,
    onlineCountLabel: "88",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Launchpad Hub",
    welcomeMessage:
      "Discuss Bags, Pump.fun, BONK.fun and Four.meme without spamming contract addresses or misleading other members.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "community-support",
    name: "Community Support",
    description:
      "Ask questions, receive guidance and help other members navigate BullChat.",

    avatar: "/rooms/community-support/avatar.webp",
    thumbnail: "/rooms/community-support/thumbnail.webp",
    backgroundPattern:
      "/rooms/community-support/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/community-support/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/community-support/hero-cover-mobile.webp",

    memberCount: 4600,
    memberCountLabel: "4.6K",
    onlineCount: 63,
    onlineCountLabel: "63",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Community Support",
    welcomeMessage:
      "Ask clear questions, provide helpful answers and treat every community member with respect.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "wins-losses",
    name: "Wins & Losses",
    description:
      "Share the moments that shaped your crypto journey and the lessons you learned.",

    /*
     * Temporary asset mapping:
     * Wins & Losses uses Market Talk images until its dedicated
     * visual asset pack is available.
     */
    avatar: "/rooms/market-talk/avatar.webp",
    thumbnail: "/rooms/market-talk/thumbnail.webp",
    backgroundPattern: "/rooms/market-talk/background-pattern.webp",
    heroCoverDesktop:
      "/rooms/market-talk/hero-cover-desktop.webp",
    heroCoverMobile:
      "/rooms/market-talk/hero-cover-mobile.webp",

    memberCount: 7300,
    memberCountLabel: "7.3K",
    onlineCount: 108,
    onlineCountLabel: "108",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Wins & Losses",
    welcomeMessage:
      "Share honest experiences, explain what you learned and avoid using personal stories to promote unrelated tokens.",

    members: defaultMembers,
    messages: defaultMessages,
  },

  {
    slug: "off-topic",
    name: "Off Topic",
    description:
      "Relax, connect and talk about life outside the charts.",

    /*
     * Temporary asset mapping:
     * Off Topic uses Builders images until its dedicated
     * visual asset pack is available.
     */
    avatar: "/rooms/builders/avatar.webp",
    thumbnail: "/rooms/builders/thumbnail.webp",
    backgroundPattern: "/rooms/builders/background-pattern.webp",
    heroCoverDesktop: "/rooms/builders/hero-cover-desktop.webp",
    heroCoverMobile: "/rooms/builders/hero-cover-mobile.webp",

    memberCount: 3900,
    memberCountLabel: "3.9K",
    onlineCount: 73,
    onlineCountLabel: "73",

    joined: true,
    pinned: false,

    welcomeTitle: "Welcome to Off Topic",
    welcomeMessage:
      "Relax and connect outside the usual crypto conversations while remaining respectful to other members.",

    members: defaultMembers,
    messages: defaultMessages,
  },
];

export const ROOM_SLUGS = ROOMS.map((room) => room.slug);

export function getRoomBySlug(slug: string): Room | undefined {
  return ROOMS.find((room) => room.slug === slug);
}

export function isValidRoomSlug(slug: string): boolean {
  return ROOM_SLUGS.includes(slug);
}