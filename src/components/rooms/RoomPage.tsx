"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ImageIcon,
  MoreHorizontal,
  Paperclip,
  Pin,
  Search,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react";

import { RoomChatMessage } from "@/components/rooms/RoomChatMessage";
import { RoomInfoPanel } from "@/components/rooms/RoomInfoPanel";

interface RoomPageProps {
  slug: string;
}

interface RoomDetails {
  name: string;
  description: string;
  members: string;
  online: string;
  official?: boolean;
  assetSlug?: string;
}

const ROOM_DETAILS: Record<string, RoomDetails> = {
  "ansem-community": {
    name: "Ansem Community",
    description:
      "The flagship home for the Ansem community — announcements, discussions and connection.",
    members: "25.3K",
    online: "412",
    official: true,
  },

  "bull-community": {
    name: "Bull Community",
    description:
      "Where the wider Bull community gathers to connect and share value.",
    members: "18.6K",
    online: "284",
  },

  builders: {
    name: "Builders",
    description:
      "A focused space for developers, designers and founders building the future of Web3.",
    members: "4.2K",
    online: "89",
  },

  "job-board": {
    name: "Job Board",
    description:
      "Discover opportunities, find collaborators and connect with people who are hiring.",
    members: "8.9K",
    online: "126",
  },

  "market-talk": {
    name: "Market Talk",
    description:
      "Healthy market discussion, analysis and thoughtful conversations.",
    members: "12.7K",
    online: "203",
  },

  "meme-studio": {
    name: "Meme Studio",
    description:
      "Create, share and enjoy the memes shaping crypto culture.",
    members: "6.8K",
    online: "94",
  },

  "launchpad-hub": {
    name: "Launchpad Hub",
    description:
      "Discuss launches across Bags, Pump.fun, LetsBonk and Four.meme.",
    members: "9.4K",
    online: "157",
  },

  "community-support": {
    name: "Community Support",
    description:
      "Ask questions, solve problems and help other community members.",
    members: "5.1K",
    online: "61",
  },

  "wins-losses": {
    name: "Wins & Losses",
    description:
      "Share the moments that shaped your crypto journey and the lessons you learned.",
    members: "7.3K",
    online: "108",

    // Temporary: use Market Talk visuals.
    assetSlug: "market-talk",
  },

  "off-topic": {
    name: "Off Topic",
    description:
      "Relax, connect and talk about life outside the charts.",
    members: "3.9K",
    online: "73",

    // Temporary: use Builders visuals.
    assetSlug: "builders",
  },
};

const QUICK_EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "😅",
  "😭",
  "😤",
  "🫡",
  "🤝",
  "🙌",
  "👏",
  "🙏",
  "💪",
  "👀",
  "🔥",
  "❤️",
  "💚",
  "🚀",
  "✅",
  "💯",
  "🎉",
  "🐂",
  "💻",
  "🛠️",
  "✨",
];

const MOCK_MESSAGES = [
  {
    id: "1",
    username: "DefiCrawler",
    handle: "@deficrawler",
    time: "10:24 AM",
    avatar: "/rooms/builders/avatar.webp",
    content:
      "Morning builders. What is everyone shipping this week?",
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

  {
    id: "2",
    username: "Maya",
    handle: "@mayabuilds",
    time: "10:27 AM",
    avatar: "/rooms/bull-community/avatar.webp",
    content:
      "Finishing the onboarding flow for a wallet analytics dashboard. Mobile has been the hardest part.",
    replyTo: {
      username: "DefiCrawler",
      content: "What is everyone shipping this week?",
    },
    reactions: [
      {
        emoji: "👏",
        count: 5,
      },
    ],
  },

  {
    id: "3",
    username: "Alex",
    handle: "@alexdev",
    time: "10:31 AM",
    avatar: "/rooms/ansem-community/avatar.webp",
    content:
      "Working on realtime notifications today. Supabase Realtime is doing most of the heavy lifting.",
  },

  {
    id: "4",
    username: "Kemi",
    handle: "@kemidesigns",
    time: "10:35 AM",
    avatar: "/rooms/meme-studio/avatar.webp",
    content:
      "Just completed the first version of our community profile screen. Feedback is welcome.",
    image: "/rooms/builders/thumbnail.webp",
    reactions: [
      {
        emoji: "🔥",
        count: 18,
      },
      {
        emoji: "😍",
        count: 9,
      },
    ],
  },

  {
    id: "5",
    username: "Daniel",
    handle: "@danielcodes",
    time: "10:42 AM",
    avatar: "/rooms/job-board/avatar.webp",
    content:
      "I am cleaning up a Next.js dashboard today. The desktop version is ready, but I am still refining mobile.",
    reactions: [
      {
        emoji: "💪",
        count: 4,
      },
    ],
  },

  {
    id: "6",
    username: "Sarah",
    handle: "@sarahdesigns",
    time: "10:51 AM",
    avatar: "/rooms/community-support/avatar.webp",
    content:
      "The room page is already looking solid. Keeping the composer visible while messages scroll will make it feel much more like a real chat product.",
  },
];

export function RoomPage({ slug }: RoomPageProps) {
  const router = useRouter();

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);

  const [message, setMessage] = useState("");
  const [joined, setJoined] = useState(true);
  const [showRoomPanel, setShowRoomPanel] =
    useState(false);
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const room = useMemo(() => {
    return ROOM_DETAILS[slug] ?? ROOM_DETAILS.builders;
  }, [slug]);

  const assetSlug = room.assetSlug ?? slug;

  function handleSendMessage() {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    console.info("Sending message:", cleanMessage);

    setMessage("");
    setShowEmojiPicker(false);
  }

  function insertEmoji(emoji: string) {
    const textarea = textareaRef.current;

    if (!textarea) {
      setMessage((current) => `${current}${emoji}`);
      setShowEmojiPicker(false);
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const nextMessage =
      message.slice(0, selectionStart) +
      emoji +
      message.slice(selectionEnd);

    setMessage(nextMessage);
    setShowEmojiPicker(false);

    requestAnimationFrame(() => {
      const nextCursorPosition =
        selectionStart + emoji.length;

      textarea.focus();

      textarea.setSelectionRange(
        nextCursorPosition,
        nextCursorPosition,
      );
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-3 lg:hidden">
          <button
            type="button"
            aria-label="Return to rooms"
            onClick={() => router.push("/")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => setShowRoomPanel(true)}
            className="min-w-0 flex-1 px-3 text-center"
          >
            <p className="truncate text-sm font-semibold text-foreground">
              {room.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {room.online} online
            </p>
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search room"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              aria-label="Room options"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable room content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Hero and room information */}
          <section className="border-b border-border">
            <div className="relative h-40 overflow-hidden bg-surface-elevated sm:h-52 lg:h-60">
              <picture>
                <source
                  media="(max-width: 767px)"
                  srcSet={`/rooms/${assetSlug}/hero-cover-mobile.webp`}
                />

                <img
                  src={`/rooms/${assetSlug}/hero-cover-desktop.webp`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </picture>

              <div className="absolute inset-0 bg-black/10" />

              <div className="absolute right-4 top-4 hidden items-center gap-2 lg:flex">
                <button
                  type="button"
                  aria-label="Search room"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <Search size={18} />
                </button>

                <button
                  type="button"
                  aria-label="Room options"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="px-4 pb-5 sm:px-6 lg:px-8">
              <div className="-mt-10 flex items-end justify-between gap-4 sm:-mt-12">
                <div className="relative z-10 h-20 w-20 overflow-hidden rounded-2xl border-4 border-background bg-surface-elevated sm:h-24 sm:w-24">
                  <img
                    src={`/rooms/${assetSlug}/avatar.webp`}
                    alt={`${room.name} avatar`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setJoined((current) => !current);
                  }}
                  aria-label={
                    joined
                      ? `Leave ${room.name}`
                      : `Join ${room.name}`
                  }
                  className={
                    joined
                      ? "mb-1 inline-flex h-9 items-center gap-2 rounded-full border border-[rgba(118,229,29,0.22)] bg-[rgba(118,229,29,0.045)] px-3.5 text-sm font-medium text-foreground transition hover:border-[rgba(118,229,29,0.36)] hover:bg-[rgba(118,229,29,0.075)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(118,229,29,0.28)]"
                      : "mb-1 inline-flex h-9 items-center rounded-full bg-[#76E51D] px-4 text-sm font-semibold text-[#0B0F14] transition hover:bg-[#67D116] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(118,229,29,0.30)]"
                  }
                >
                  {joined && (
                    <span className="h-2 w-2 rounded-full bg-[#76E51D] shadow-[0_0_7px_rgba(118,229,29,0.38)]" />
                  )}

                  <span>{joined ? "Joined" : "Join"}</span>

                  {joined && (
                    <ChevronDown
                      size={14}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {room.name}
                  </h1>

                  {room.official && (
                    <span className="rounded-full border border-[rgba(118,229,29,0.30)] bg-[rgba(118,229,29,0.08)] px-2 py-0.5 text-[11px] font-semibold text-[#76E51D]">
                      Official
                    </span>
                  )}
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {room.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(118,229,29,0.22)] bg-[rgba(118,229,29,0.055)] px-2.5 py-1">
                    <Users
                      size={15}
                      className="text-[#76E51D]"
                    />

                    {room.members} members
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(118,229,29,0.22)] bg-[rgba(118,229,29,0.055)] px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-[#76E51D] shadow-[0_0_8px_rgba(118,229,29,0.40)]" />

                    {room.online} online
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Pinned announcement */}
          <section className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 rounded-2xl border border-[rgba(118,229,29,0.24)] bg-[rgba(118,229,29,0.045)] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(118,229,29,0.10)] text-[#76E51D]">
                <Pin size={17} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    Welcome to {room.name}
                  </p>

                  <span className="text-xs text-[rgba(118,229,29,0.80)]">
                    Pinned
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Keep conversations helpful, stay on topic and
                  respect other members. Read the room guidelines
                  before posting.
                </p>
              </div>
            </div>
          </section>

          {/* Conversation area with room background pattern */}
          <section className="relative isolate min-h-[520px] overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat opacity-[0.035] mix-blend-soft-light"
              style={{
                backgroundImage: `url("/rooms/${assetSlug}/background-pattern.webp")`,
              }}
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/82 to-background/95"
            />

            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />

                <span className="text-xs font-medium text-muted-foreground">
                  Today
                </span>

                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-1">
                {MOCK_MESSAGES.map((chatMessage) => (
                  <RoomChatMessage
                    key={chatMessage.id}
                    {...chatMessage}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Composer */}
        <footer className="relative z-20 shrink-0 border-t border-border bg-background px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
          <div className="relative">
            {showEmojiPicker && (
              <button
                type="button"
                aria-label="Close emoji picker"
                onClick={() => setShowEmojiPicker(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
            )}

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 z-40 mb-3 w-[300px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[rgba(118,229,29,0.18)] bg-surface p-3 shadow-2xl sm:w-[340px]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Emojis
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Select one to add it to your message.
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Close emoji picker"
                    onClick={() => {
                      setShowEmojiPicker(false);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-8 gap-1">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`Insert ${emoji}`}
                      onClick={() => insertEmoji(emoji)}
                      className="flex aspect-square items-center justify-center rounded-lg text-xl transition hover:bg-[rgba(118,229,29,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E51D]"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex min-h-12 items-end gap-1 rounded-2xl border border-border bg-surface px-2 py-1.5 shadow-sm transition focus-within:border-[rgba(118,229,29,0.45)] focus-within:bg-[rgba(118,229,29,0.025)] focus-within:ring-2 focus-within:ring-[rgba(118,229,29,0.08)] sm:gap-2 sm:px-3 sm:py-2">
              <button
                type="button"
                aria-label="Choose emoji"
                aria-expanded={showEmojiPicker}
                onClick={() => {
                  setShowEmojiPicker(
                    (current) => !current,
                  );
                }}
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                  showEmojiPicker
                    ? "bg-[rgba(118,229,29,0.10)] text-[#76E51D]"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                ].join(" ")}
              >
                <Smile size={20} />
              </button>

              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Type a message..."
                className="min-h-9 max-h-32 min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-5 text-foreground outline-none placeholder:text-muted-foreground"
              />

              <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
                <button
                  type="button"
                  aria-label="Upload image"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
                >
                  <ImageIcon size={19} />
                </button>

                <button
                  type="button"
                  aria-label="More actions"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
                >
                  <Paperclip size={19} />
                </button>

                <button
                  type="button"
                  aria-label="Send message"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition disabled:cursor-not-allowed disabled:opacity-40 enabled:bg-[#76E51D] enabled:text-[#0B0F14] enabled:hover:bg-[#67D116]"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <RoomInfoPanel
        room={room}
        slug={slug}
      />

      {/* Mobile room information */}
      {showRoomPanel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close room information"
            onClick={() => setShowRoomPanel(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Room information
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowRoomPanel(false);
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-surface-elevated hover:text-foreground"
              >
                Done
              </button>
            </div>

            <div className="mt-5 space-y-6">
              <MobileRoomInformation room={room} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileRoomInformation({
  room,
}: {
  room: RoomDetails;
}) {
  const activeMembers = [
    {
      name: "DefiCrawler",
      username: "@deficrawler",
      avatar: "/rooms/ansem-community/avatar.webp",
    },
    {
      name: "Maya",
      username: "@mayabuilds",
      avatar: "/rooms/bull-community/avatar.webp",
    },
    {
      name: "Alex",
      username: "@alexdev",
      avatar: "/rooms/builders/avatar.webp",
    },
  ];

  return (
    <>
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          About
        </p>

        <p className="mt-2 text-sm leading-6 text-foreground">
          {room.description}
        </p>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Room rules
        </p>

        <ol className="mt-3 space-y-3 text-sm text-muted-foreground">
          <li>1. Respect every community member.</li>
          <li>2. Keep discussions relevant to the room.</li>
          <li>
            3. No spam or unauthorized token promotion.
          </li>
        </ol>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Active now
        </p>

        <div className="mt-3 space-y-2">
          {activeMembers.map((member) => (
            <div
              key={member.username}
              className="flex items-center gap-3 rounded-xl border border-[rgba(118,229,29,0.12)] bg-[rgba(118,229,29,0.025)] p-3"
            >
              <div className="relative h-10 w-10 shrink-0">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-elevated">
                  <img
                    src={member.avatar}
                    alt={`${member.name} profile`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-[#76E51D]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {member.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {member.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Moderators
        </p>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-[rgba(118,229,29,0.16)] bg-[rgba(118,229,29,0.035)] p-3">
          <div className="relative h-10 w-10 shrink-0">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-surface-elevated">
              <img
                src="/rooms/ansem-community/avatar.webp"
                alt="DefiCrawler profile"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-[#76E51D]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">
              DefiCrawler
            </p>

            <p className="text-xs text-muted-foreground">
              Room moderator
            </p>
          </div>
        </div>
      </section>
    </>
  );
}