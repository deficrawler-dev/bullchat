import {
  ExternalLink,
  Shield,
  Users,
} from "lucide-react";

interface RoomInfoPanelProps {
  slug: string;

  room: {
    name: string;
    description: string;
    members: string;
    online: string;
  };
}

interface ActiveMember {
  id: string;
  name: string;
  username: string;
  role?: string;
  avatar: string;
}

const ACTIVE_MEMBERS: ActiveMember[] = [
  {
    id: "deficrawler",
    name: "DefiCrawler",
    username: "@deficrawler",
    role: "Moderator",
    avatar: "/rooms/ansem-community/avatar.webp",
  },
  {
    id: "maya",
    name: "Maya",
    username: "@mayabuilds",
    avatar: "/rooms/bull-community/avatar.webp",
  },
  {
    id: "alex",
    name: "Alex",
    username: "@alexdev",
    avatar: "/rooms/builders/avatar.webp",
  },
  {
    id: "kemi",
    name: "Kemi",
    username: "@kemidesigns",
    avatar: "/rooms/meme-studio/avatar.webp",
  },
];

const SHARED_MEDIA = [
  "/rooms/builders/thumbnail.webp",
  "/rooms/ansem-community/thumbnail.webp",
  "/rooms/bull-community/thumbnail.webp",
  "/rooms/meme-studio/thumbnail.webp",
  "/rooms/job-board/thumbnail.webp",
  "/rooms/market-talk/thumbnail.webp",
];

export function RoomInfoPanel({
  room,
}: RoomInfoPanelProps) {
  return (
    <aside
      className="
        hidden h-full w-[320px] shrink-0
        overflow-y-auto overscroll-contain
        border-l border-border
        bg-background xl:block
      "
    >
      <div className="p-6">
        {/* Overview */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Room overview
          </p>

          <h2 className="mt-3 text-lg font-semibold text-[#76E51D]">
  {room.name}
</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {room.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div
              className="
                rounded-xl border
                border-[rgba(118,229,29,0.22)]
                bg-[rgba(118,229,29,0.055)]
                p-3
              "
            >
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg
                  bg-[rgba(118,229,29,0.10)]
                  text-[#76E51D]
                "
              >
                <Users size={16} />
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground">
                {room.members}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Members
              </p>
            </div>

            <div
              className="
                rounded-xl border
                border-[rgba(118,229,29,0.22)]
                bg-[rgba(118,229,29,0.055)]
                p-3
              "
            >
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg
                  bg-[rgba(118,229,29,0.10)]
                "
              >
                <span
                  className="
                    h-2.5 w-2.5 rounded-full
                    bg-[#76E51D]
                    shadow-[0_0_10px_rgba(118,229,29,0.40)]
                  "
                />
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground">
                {room.online}
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Online now
              </p>
            </div>
          </div>
        </section>

        {/* Active members */}
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active now
            </p>

            <button
              type="button"
              className="
                text-xs font-medium text-[#76E51D]
                transition hover:text-[#8AF336]
              "
            >
              View all
            </button>
          </div>

          <div className="mt-3 space-y-1">
            {ACTIVE_MEMBERS.map((member) => (
              <button
                key={member.id}
                type="button"
                className="
                  flex w-full items-center gap-3
                  rounded-xl px-2 py-2
                  text-left transition
                  hover:bg-surface
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#76E51D]
                "
              >
                <div className="relative h-10 w-10 shrink-0">
                  <div
                    className="
                      h-10 w-10 overflow-hidden
                      rounded-full border border-border
                      bg-surface-elevated
                    "
                  >
                    <img
                      src={member.avatar}
                      alt={`${member.name} profile`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span
                    className="
                      absolute bottom-0 right-0
                      h-3 w-3 rounded-full
                      border-2 border-background
                      bg-[#76E51D]
                    "
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {member.name}
                    </p>

                    {member.role && (
                      <span
                        className="
                          shrink-0 rounded-full
                          border border-[rgba(118,229,29,0.20)]
                          bg-[rgba(118,229,29,0.06)]
                          px-1.5 py-0.5
                          text-[10px] font-medium
                          text-[#76E51D]
                        "
                      >
                        {member.role}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {member.username}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div
            className="
              mt-3 flex items-center gap-2
              rounded-xl border
              border-[rgba(118,229,29,0.12)]
              bg-[rgba(118,229,29,0.025)]
              px-3 py-2.5
            "
          >
            <div className="flex -space-x-2">
              {ACTIVE_MEMBERS.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="
                    h-7 w-7 overflow-hidden
                    rounded-full border-2
                    border-background
                    bg-surface-elevated
                  "
                >
                  <img
                    src={member.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <p className="min-w-0 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {room.online}
              </span>{" "}
              members active
            </p>
          </div>
        </section>

        {/* Rules */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <Shield
              size={16}
              className="text-muted-foreground"
            />

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Room rules
            </p>
          </div>

          <ol className="mt-4 space-y-3 text-sm leading-5 text-muted-foreground">
            <li>1. Respect every community member.</li>

            <li>
              2. Keep conversations relevant to the room.
            </li>

            <li>
              3. No spam or unauthorized token promotion.
            </li>
          </ol>
        </section>

        {/* Moderator */}
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Moderators
          </p>

          <div
            className="
              mt-4 flex items-center gap-3
              rounded-xl border
              border-[rgba(118,229,29,0.16)]
              bg-[rgba(118,229,29,0.035)]
              p-3
            "
          >
            <div className="relative h-10 w-10 shrink-0">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-elevated">
                <img
                  src="/rooms/ansem-community/avatar.webp"
                  alt="DefiCrawler profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <span
                className="
                  absolute bottom-0 right-0
                  h-3 w-3 rounded-full
                  border-2 border-background
                  bg-[#76E51D]
                "
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                DefiCrawler
              </p>

              <p className="text-xs text-muted-foreground">
                Room moderator
              </p>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Community links
          </p>

          <button
            type="button"
            className="
              mt-4 flex w-full items-center justify-between
              rounded-xl border border-border
              bg-surface px-4 py-3
              text-left text-sm font-medium
              text-foreground transition
              hover:border-[rgba(118,229,29,0.22)]
              hover:bg-[rgba(118,229,29,0.035)]
            "
          >
            Community guidelines

            <ExternalLink
              size={15}
              className="text-muted-foreground"
            />
          </button>
        </section>

        {/* Shared media */}
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Shared media
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {SHARED_MEDIA.map((image) => (
              <div
                key={image}
                className="
                  aspect-square overflow-hidden
                  rounded-lg bg-surface-elevated
                "
              >
                <img
                  src={image}
                  alt=""
                  className="
                    h-full w-full object-cover
                    transition duration-200
                    hover:scale-[1.03]
                  "
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}