import Image from "next/image";
import Link from "next/link";
import {
  AtSign,
  Bell,
  ChevronRight,
  MessageCircle,
  Pencil,
  Reply,
  Search,
  Users,
} from "lucide-react";

interface ActivitySummary {
  unreadNotifications: number;
  unreadMessages: number;
  replies: number;
  mentions: number;
}

interface TrendingRoom {
  slug: string;
  name: string;
  thumbnailSlug: string;
  memberCount: string;
  onlineCount?: string;
  lastActivityLabel?: string;
}

interface SuggestedPerson {
  id: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  sharedContext?: string;
}

interface ProfileProgress {
  hasUsername: boolean;
  hasAvatar: boolean;
  hasBio: boolean;
  hasWallet: boolean;
  hasSocialLinks: boolean;
}

interface RightPanelProps {
  activity?: ActivitySummary;
  trendingRoom?: TrendingRoom;
  suggestedPeople?: SuggestedPerson[];
  profileProgress?: ProfileProgress;
}

const DEFAULT_ACTIVITY: ActivitySummary = {
  unreadNotifications: 0,
  unreadMessages: 0,
  replies: 0,
  mentions: 0,
};

const DEFAULT_TRENDING_ROOM: TrendingRoom = {
  slug: "builders",
  name: "Builders",
  thumbnailSlug: "builders",
  memberCount: "4.2K members",
  onlineCount: "89 online",
};

const DEFAULT_PROFILE_PROGRESS: ProfileProgress = {
  hasUsername: true,
  hasAvatar: false,
  hasBio: false,
  hasWallet: false,
  hasSocialLinks: false,
};

function formatCount(count: number): string {
  if (count > 99) {
    return "99+";
  }

  return String(count);
}

function ActivityItem({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: typeof Bell;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="
        flex min-h-10 items-center gap-3 rounded-xl px-3 py-2
        transition-colors hover:bg-surface-elevated
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-brand
      "
    >
      <span
        className="
          flex h-8 w-8 shrink-0 items-center justify-center
          rounded-lg bg-surface-elevated text-fg-secondary
        "
      >
        <Icon
          className="h-4 w-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <span className="min-w-0 flex-1 text-sm text-fg-secondary">
        {label}
      </span>

      <span
        className={[
          "min-w-6 shrink-0 text-right text-sm font-semibold tabular-nums",
          count > 0 ? "text-brand" : "text-fg-muted",
        ].join(" ")}
      >
        {formatCount(count)}
      </span>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Search;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        flex min-h-10 items-center gap-3 rounded-xl px-3 py-2
        text-sm font-medium text-fg-secondary
        transition-colors
        hover:bg-surface-elevated hover:text-fg
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-brand
      "
    >
      <Icon
        className="h-4 w-4 shrink-0"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <span className="min-w-0 flex-1">{label}</span>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-fg-muted"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </Link>
  );
}

function SuggestedPersonRow({
  person,
}: {
  person: SuggestedPerson;
}) {
  const initial =
    person.displayName.trim().charAt(0).toUpperCase() || "B";

  return (
    <div className="flex min-w-0 items-center gap-3 py-2.5">
      {person.avatarUrl ? (
        <Image
          src={person.avatarUrl}
          alt={`${person.displayName} profile`}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full border border-border bg-bg
            text-sm font-semibold text-brand
          "
          aria-hidden="true"
        >
          {initial}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fg">
          {person.displayName}
        </p>

        <p className="truncate text-xs text-fg-secondary">
          {person.username}
        </p>

        {person.sharedContext && (
          <p className="mt-0.5 truncate text-xs text-fg-muted">
            {person.sharedContext}
          </p>
        )}
      </div>

      <Link
        href={`/profile/${person.username.replace(/^@/, "")}`}
        className="
          shrink-0 rounded-lg border border-border
          px-2.5 py-1.5 text-xs font-medium text-fg
          transition-colors
          hover:border-brand hover:text-brand
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-brand
        "
      >
        View
      </Link>
    </div>
  );
}

function ProfileCompletion({
  progress,
}: {
  progress: ProfileProgress;
}) {
  const items = [
    {
      label: "Username",
      complete: progress.hasUsername,
    },
    {
      label: "Profile photo",
      complete: progress.hasAvatar,
    },
    {
      label: "Bio",
      complete: progress.hasBio,
    },
    {
      label: "Connected wallet",
      complete: progress.hasWallet,
    },
    {
      label: "Social links",
      complete: progress.hasSocialLinks,
    },
  ];

  const completedItems = items.filter(
    (item) => item.complete,
  ).length;

  const percentage = Math.round(
    (completedItems / items.length) * 100,
  );

  if (percentage === 100) {
    return null;
  }

  return (
    <section className="border-b border-border px-4 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-fg">
            Complete your profile
          </h2>

          <p className="mt-1 text-xs text-fg-secondary">
            Help people understand who you are.
          </p>
        </div>

        <span className="text-sm font-semibold text-brand">
          {percentage}%
        </span>
      </div>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-elevated"
        aria-label={`Profile ${percentage}% complete`}
      >
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span
              className={
                item.complete
                  ? "text-fg-secondary"
                  : "text-fg-muted"
              }
            >
              {item.label}
            </span>

            <span
              className={
                item.complete
                  ? "font-medium text-brand"
                  : "text-fg-muted"
              }
            >
              {item.complete ? "Added" : "Missing"}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/profile/settings"
        className="
          mt-4 inline-flex min-h-9 w-full items-center
          justify-center rounded-xl border border-border
          px-3 text-xs font-medium text-fg
          transition-colors
          hover:border-brand hover:text-brand
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-brand
        "
      >
        Complete profile
      </Link>
    </section>
  );
}

export function RightPanel({
  activity = DEFAULT_ACTIVITY,
  trendingRoom = DEFAULT_TRENDING_ROOM,
  suggestedPeople = [],
  profileProgress = DEFAULT_PROFILE_PROGRESS,
}: RightPanelProps) {
  const trendingThumbnail = `/rooms/${trendingRoom.thumbnailSlug}/thumbnail.webp`;

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <header
        className="
          flex h-16 shrink-0 items-center
          border-b border-border px-4
        "
      >
        <div>
          <h1 className="text-sm font-semibold text-fg">
            Overview
          </h1>

          <p className="mt-0.5 text-xs text-fg-muted">
            Your BullChat activity
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="border-b border-border px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">
              Your activity
            </h2>

            <Link
              href="/notifications"
              className="
                text-xs font-medium text-brand
                hover:underline
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-brand
              "
            >
              View all
            </Link>
          </div>

          <div className="space-y-1">
            <ActivityItem
              href="/notifications"
              icon={Bell}
              label="Unread notifications"
              count={activity.unreadNotifications}
            />

            <ActivityItem
              href="/messages"
              icon={MessageCircle}
              label="Unread messages"
              count={activity.unreadMessages}
            />

            <ActivityItem
              href="/notifications?type=replies"
              icon={Reply}
              label="Replies"
              count={activity.replies}
            />

            <ActivityItem
              href="/notifications?type=mentions"
              icon={AtSign}
              label="Mentions"
              count={activity.mentions}
            />
          </div>
        </section>

        <section className="border-b border-border px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">
              Trending now
            </h2>

            <span className="text-xs font-medium text-brand">
              Active
            </span>
          </div>

          <Link
            href={`/rooms/${trendingRoom.slug}`}
            className="
              block overflow-hidden rounded-2xl
              border border-border bg-bg
              transition-colors hover:border-brand/60
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-brand
            "
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={trendingThumbnail}
                alt={`${trendingRoom.name} community`}
                fill
                sizes="288px"
                className="object-cover"
              />

              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
              />

              <div className="absolute inset-x-0 bottom-0 p-3">
                <h3 className="text-base font-semibold text-white">
                  {trendingRoom.name}
                </h3>
              </div>
            </div>

            <div className="p-3">
              <p className="text-xs text-fg-secondary">
                {trendingRoom.memberCount}
                {trendingRoom.onlineCount
                  ? ` · ${trendingRoom.onlineCount}`
                  : ""}
              </p>

              {trendingRoom.lastActivityLabel && (
                <p className="mt-1 text-xs text-fg-muted">
                  Last activity{" "}
                  {trendingRoom.lastActivityLabel}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between text-xs font-medium">
                <span className="text-brand">
                  Open community
                </span>

                <ChevronRight
                  className="h-4 w-4 text-brand"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>
            </div>
          </Link>
        </section>

        <section className="border-b border-border px-4 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">
              Suggested people
            </h2>

            {suggestedPeople.length > 0 && (
              <Link
                href="/people"
                className="
                  text-xs font-medium text-brand hover:underline
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-brand
                "
              >
                See all
              </Link>
            )}
          </div>

          {suggestedPeople.length > 0 ? (
            <div className="divide-y divide-border">
              {suggestedPeople
                .slice(0, 3)
                .map((person) => (
                  <SuggestedPersonRow
                    key={person.id}
                    person={person}
                  />
                ))}
            </div>
          ) : (
            <div
              className="
                rounded-xl border border-border bg-bg
                px-4 py-5 text-center
              "
            >
              <Users
                className="mx-auto h-5 w-5 text-fg-muted"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <p className="mt-2 text-xs font-medium text-fg">
                Suggestions will appear here
              </p>

              <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                BullChat will recommend people based on your
                rooms and shared interests.
              </p>
            </div>
          )}
        </section>

        <ProfileCompletion progress={profileProgress} />

        <section className="px-4 py-5">
          <h2 className="mb-3 text-sm font-semibold text-fg">
            Quick actions
          </h2>

          <div className="space-y-1">
            <QuickAction
              href="/rooms"
              icon={Search}
              label="Browse rooms"
            />

            <QuickAction
              href="/messages"
              icon={MessageCircle}
              label="Open messages"
            />

            <QuickAction
              href="/profile/settings"
              icon={Pencil}
              label="Edit profile"
            />
          </div>
        </section>
      </div>
    </div>
  );
}