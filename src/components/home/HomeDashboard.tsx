import { RoomCard } from "@/components/home/RoomCard";

interface HomeDashboardProps {
  displayName?: string;
  className?: string;
}

interface RoomSeed {
  slug: string;
  thumbnailSlug: string;
  name: string;
  description: string;
  memberCount: string;
  onlineCount?: string;
  lastActivityAt?: string;
  flagship?: boolean;
  popular?: boolean;
  joined?: boolean;
}

const ROOMS: RoomSeed[] = [
  {
    slug: "ansem-community",
    thumbnailSlug: "ansem-community",
    name: "Ansem Community",
    description:
      "Announcements, discussions, and connection across the $ANSEM community.",
    memberCount: "25.3K members",
    onlineCount: "412 online",
    flagship: true,
    popular: true,
    joined: true,
  },
  {
    slug: "bull-community",
    thumbnailSlug: "bull-community",
    name: "Bull Community",
    description:
      "Connect and grow with members across the wider Bull community.",
    memberCount: "12.8K members",
    onlineCount: "236 online",
    popular: true,
    joined: true,
  },
  {
    slug: "builders",
    thumbnailSlug: "builders",
    name: "Builders",
    description:
      "Share progress, collaborate on ideas, and build projects together.",
    memberCount: "4.2K members",
    onlineCount: "89 online",
    popular: true,
  },
  {
    slug: "job-board",
    thumbnailSlug: "job-board",
    name: "Job Board",
    description:
      "Discover jobs, gigs, and opportunities shared by the community.",
    memberCount: "3.1K members",
  },
  {
    slug: "market-talk",
    thumbnailSlug: "market-talk",
    name: "Market Talk",
    description:
      "Discuss market movements, sentiment, strategies, and opportunities.",
    memberCount: "6.1K members",
    onlineCount: "143 online",
  },
  {
    slug: "meme-studio",
    thumbnailSlug: "meme-studio",
    name: "Meme Studio",
    description:
      "Create and share community culture, humor, and original content.",
    memberCount: "2.4K members",
    onlineCount: "52 online",
  },
  {
    slug: "wins-losses",

    // Temporary image until Wins & Losses assets are designed.
    thumbnailSlug: "market-talk",

    name: "Wins & Losses",
    description:
      "Share your best wins, toughest losses, and lessons from crypto.",
    memberCount: "1.8K members",
  },
  {
    slug: "off-topic",

    // Temporary image until Off Topic assets are designed.
    thumbnailSlug: "builders",

    name: "Off Topic",
    description:
      "Relax and connect through conversations beyond crypto and building.",
    memberCount: "1.2K members",
    onlineCount: "31 online",
  },
];

const POPULAR_ROOMS = ROOMS.filter((room) => room.popular);
const YOUR_ROOMS = ROOMS.filter((room) => room.joined);
const EXPLORE_ROOMS = ROOMS.filter((room) => !room.joined);

interface SectionHeadingProps {
  title: string;
  description?: string;
}

function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold leading-tight text-fg sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-sm leading-relaxed text-fg-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

export function HomeDashboard({
  displayName = "DefiCrawler",
  className = "",
}: HomeDashboardProps) {
  return (
    <div
      className={[
        "w-full min-w-0 pb-28 pt-5 text-left",
        "sm:pb-8",
        "lg:mx-auto lg:max-w-6xl lg:px-6 lg:pt-8",
        className,
      ].join(" ")}
    >
      <section className="px-4 sm:px-6 lg:px-0">
        <p className="text-xs text-fg-secondary">
          Welcome back,
        </p>

        <h1 className="mt-1 text-2xl font-semibold leading-tight text-fg">
          {displayName}
        </h1>

        <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-secondary">
          Join conversations and connect with people across BullChat.
        </p>
      </section>

      <section className="mt-9 min-w-0">
        <div className="px-4 sm:px-6 lg:px-0">
          <SectionHeading
            title="Popular Communities"
            description="Active spaces people are joining right now."
          />
        </div>

        <div
          className="
            hide-scrollbar mt-4 flex w-full
            snap-x snap-mandatory gap-3
            overflow-x-auto overscroll-x-contain
            pb-2 pl-4 pr-0
            sm:gap-4 sm:pl-6
            lg:pl-0
          "
        >
          {POPULAR_ROOMS.map((room) => (
            <RoomCard
              key={room.slug}
              variant="popular"
              slug={room.slug}
              thumbnailSlug={room.thumbnailSlug}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              lastActivityAt={room.lastActivityAt}
              flagship={room.flagship}
              defaultJoined={room.joined}
            />
          ))}

          <div
            className="w-1 shrink-0 sm:w-2"
            aria-hidden="true"
          />
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-6 lg:px-0">
        <SectionHeading title="Your Communities" />

        <div className="mt-4">
          {YOUR_ROOMS.map((room) => (
            <RoomCard
              key={room.slug}
              variant="list"
              slug={room.slug}
              thumbnailSlug={room.thumbnailSlug}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              lastActivityAt={room.lastActivityAt}
              flagship={room.flagship}
              defaultJoined={room.joined}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 sm:px-6 lg:px-0">
        <SectionHeading
          title="Explore Communities"
          description="Find more conversations worth joining."
        />

        <div className="mt-4">
          {EXPLORE_ROOMS.map((room) => (
            <RoomCard
              key={room.slug}
              variant="list"
              slug={room.slug}
              thumbnailSlug={room.thumbnailSlug}
              name={room.name}
              description={room.description}
              memberCount={room.memberCount}
              onlineCount={room.onlineCount}
              lastActivityAt={room.lastActivityAt}
              flagship={room.flagship}
              defaultJoined={room.joined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}