"use client";

import { RoomCard } from "@/components/home/RoomCard";
import { SectionHeader } from "@/components/home/SectionHeader";

interface HomeDashboardProps {
  displayName?: string;
  className?: string;
}

interface RoomSeed {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  onlineCount?: number;
  category?: string;
  featured?: boolean;
  joined?: boolean;
}

const TRENDING_ROOMS: RoomSeed[] = [
  {
    id: "ansem-general",
    name: "$ANSEM General",
    description:
      "The main hub for community-wide discussion and announcements.",
    memberCount: 25300,
    onlineCount: 412,
    category: "General",
    featured: true,
    joined: true,
  },
  {
    id: "builders-hub",
    name: "Builders Hub",
    description:
      "Where members share progress and collaborate on projects.",
    memberCount: 4200,
    onlineCount: 89,
    category: "Building",
    joined: false,
  },
  {
    id: "crypto-experiences",
    name: "Crypto Experiences",
    description:
      "Stories and lessons learned from navigating Web3.",
    memberCount: 1850,
    category: "Discussion",
    joined: false,
  },
];

const RECENT_ROOMS: RoomSeed[] = [
  {
    id: "market-talk",
    name: "Market Talk",
    description:
      "Ongoing conversation about market movement and sentiment.",
    memberCount: 6100,
    onlineCount: 143,
    category: "Market",
    joined: true,
  },
  {
    id: "community-support",
    name: "Community Support",
    description:
      "Ask questions and get help from experienced members.",
    memberCount: 950,
    joined: true,
  },
];

const SUGGESTED_ROOMS: RoomSeed[] = [
  {
    id: "design-lab",
    name: "Design Lab",
    description:
      "Feedback and critique for BullChat community designers.",
    memberCount: 620,
    category: "Design",
    joined: false,
  },
  {
    id: "founders-circle",
    name: "Founders Circle",
    description:
      "A focused space for founders building in the ecosystem.",
    memberCount: 310,
    category: "Founders",
    joined: false,
  },
];

function noop() {}

export function HomeDashboard({
  displayName = "DefiCrawler",
  className = "",
}: HomeDashboardProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 sm:p-6 ${className}`}
    >
      <section className="flex flex-col gap-1">
        <p className="text-small text-fg-secondary">Welcome back</p>

        <h1 className="text-h3 font-semibold text-fg">{displayName}</h1>

        <p className="text-small text-fg-secondary">
          Discover active conversations across the community.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Trending Rooms"
          description="Popular rooms across the community."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRENDING_ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              category={room.category}
              featured={room.featured}
              joined={room.joined}
              onJoin={noop}
              onOpen={noop}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Recently Active"
          description="Rooms you've been part of recently."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {RECENT_ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              category={room.category}
              featured={room.featured}
              joined={room.joined}
              onJoin={noop}
              onOpen={noop}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader
          title="Suggested Rooms"
          description="Rooms you might want to join."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SUGGESTED_ROOMS.map((room) => (
            <RoomCard
              key={room.id}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              category={room.category}
              featured={room.featured}
              joined={room.joined}
              onJoin={noop}
              onOpen={noop}
            />
          ))}
        </div>
      </section>
    </div>
  );
}