"use client";

import { useMemo, useState } from "react";
import {
  Copy,
  Flag,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Pin,
  X,
} from "lucide-react";

interface Reaction {
  emoji: string;
  count: number;
}

interface ReplyReference {
  username: string;
  content: string;
}

interface RoomChatMessageProps {
  username: string;
  handle: string;
  time: string;
  avatar: string;
  content: string;
  image?: string;
  replyTo?: ReplyReference;
  reactions?: Reaction[];
}

type ReactionKey = "fire" | "support" | "laugh";

interface FixedReaction {
  key: ReactionKey;
  emoji: "🔥" | "💚" | "😂";
  label: string;
}

const FIXED_REACTIONS: FixedReaction[] = [
  {
    key: "fire",
    emoji: "🔥",
    label: "Great",
  },
  {
    key: "support",
    emoji: "💚",
    label: "Support",
  },
  {
    key: "laugh",
    emoji: "😂",
    label: "Funny",
  },
];

function createInitialReactionCounts(
  reactions: Reaction[],
): Record<ReactionKey, number> {
  const counts: Record<ReactionKey, number> = {
    fire: 0,
    support: 0,
    laugh: 0,
  };

  for (const reaction of reactions) {
    if (reaction.emoji === "🔥") {
      counts.fire = reaction.count;
    }

    if (
      reaction.emoji === "💚" ||
      reaction.emoji === "❤️"
    ) {
      counts.support = reaction.count;
    }

    if (
      reaction.emoji === "😂" ||
      reaction.emoji === "🤣"
    ) {
      counts.laugh = reaction.count;
    }
  }

  return counts;
}

export function RoomChatMessage({
  username,
  handle,
  time,
  avatar,
  content,
  image,
  replyTo,
  reactions = [],
}: RoomChatMessageProps) {
  const initialReactionCounts = useMemo(
    () => createInitialReactionCounts(reactions),
    [reactions],
  );

  const [reactionCounts, setReactionCounts] =
    useState<Record<ReactionKey, number>>(
      initialReactionCounts,
    );

  const [selectedReaction, setSelectedReaction] =
    useState<ReactionKey | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const messageId = useMemo(() => {
    return `message-${encodeURIComponent(
      `${username}-${time}`,
    )}`;
  }, [time, username]);

  function handleReaction(nextReaction: ReactionKey) {
    setReactionCounts((currentCounts) => {
      const nextCounts = { ...currentCounts };

      if (selectedReaction === nextReaction) {
        nextCounts[nextReaction] = Math.max(
          0,
          nextCounts[nextReaction] - 1,
        );

        return nextCounts;
      }

      if (selectedReaction) {
        nextCounts[selectedReaction] = Math.max(
          0,
          nextCounts[selectedReaction] - 1,
        );
      }

      nextCounts[nextReaction] += 1;

      return nextCounts;
    });

    setSelectedReaction((currentReaction) =>
      currentReaction === nextReaction
        ? null
        : nextReaction,
    );
  }

  function handleReply() {
    console.info(`Replying to ${username}: ${content}`);
    setShowMenu(false);
  }

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(content);

      setCopied(true);
      setShowMenu(false);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      console.error("Unable to copy message.");
    }
  }

  async function handleCopyLink() {
    try {
      const messageLink = `${window.location.origin}${window.location.pathname}#${messageId}`;

      await navigator.clipboard.writeText(messageLink);

      setShowMenu(false);
    } catch {
      console.error("Unable to copy message link.");
    }
  }

  function handlePin() {
    console.info(`Pin message from ${username}`);
    setShowMenu(false);
  }

  function handleReport() {
    console.info(`Report message from ${username}`);
    setShowMenu(false);
  }

  return (
    <article
      id={messageId}
      className="
        group relative flex gap-3
        rounded-xl px-1 py-3
        transition-colors
        hover:bg-surface/50
        sm:px-3
      "
    >
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-elevated">
        <img
          src={avatar}
          alt={`${username} profile`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">
            {username}
          </p>

          <p className="text-xs text-muted-foreground">
            {handle}
          </p>

          <p className="text-xs text-muted-foreground">
            {time}
          </p>
        </div>

        {replyTo && (
          <div className="mt-2 border-l-2 border-[rgba(118,229,29,0.45)] pl-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Replying to {replyTo.username}
            </p>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {replyTo.content}
            </p>
          </div>
        )}

        <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
          {content}
        </p>

        {image && (
          <div className="mt-3 max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated">
            <img
              src={image}
              alt="Shared attachment"
              className="max-h-96 w-full object-cover"
            />
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {FIXED_REACTIONS.map((reaction) => {
            const count = reactionCounts[reaction.key];
            const isSelected =
              selectedReaction === reaction.key;

            return (
              <button
                key={reaction.key}
                type="button"
                aria-label={`${reaction.label} reaction`}
                aria-pressed={isSelected}
                onClick={() =>
                  handleReaction(reaction.key)
                }
                className={[
                  "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#76E51D]",
                  isSelected
                    ? "border-[rgba(118,229,29,0.42)] bg-[rgba(118,229,29,0.10)] text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:border-[rgba(118,229,29,0.30)] hover:bg-[rgba(118,229,29,0.045)] hover:text-foreground",
                ].join(" ")}
              >
                <span aria-hidden="true">
                  {reaction.emoji}
                </span>

                <span>{count}</span>
              </button>
            );
          })}

          <button
  type="button"
  aria-label="Reply"
  onClick={handleReply}
  className="
    flex h-7 w-7 items-center
    justify-center rounded-lg
    text-muted-foreground
    transition-colors
    hover:bg-surface-elevated
    hover:text-[#76E51D]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[#76E51D]
  "
>
  <MessageCircle
    size={15}
    aria-hidden="true"
  />
</button>

          <div className="relative">
            <button
              type="button"
              aria-label="Message options"
              aria-expanded={showMenu}
              onClick={() => {
                setShowMenu((current) => !current);
              }}
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg text-muted-foreground
                transition-colors
                hover:bg-surface-elevated
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#76E51D]
              "
            >
              <MoreHorizontal
                size={15}
                aria-hidden="true"
              />
            </button>

            {showMenu && (
              <>
                <button
                  type="button"
                  aria-label="Close message menu"
                  onClick={() => setShowMenu(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />

                <div
                  className="
                    absolute bottom-full right-0 z-50
                    mb-2 w-52 overflow-hidden
                    rounded-xl border border-border
                    bg-surface p-1.5 shadow-2xl
                  "
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <p className="text-xs font-semibold text-foreground">
                      Message actions
                    </p>

                    <button
                      type="button"
                      aria-label="Close message menu"
                      onClick={() => setShowMenu(false)}
                      className="
                        flex h-7 w-7 items-center
                        justify-center rounded-lg
                        text-muted-foreground
                        transition-colors
                        hover:bg-surface-elevated
                        hover:text-foreground
                      "
                    >
                      <X
                        size={14}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleReply}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-2.5 py-2
                      text-left text-sm text-foreground
                      transition-colors
                      hover:bg-surface-elevated
                    "
                  >
                    <MessageCircle
                      size={15}
                      aria-hidden="true"
                    />

                    Reply
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-2.5 py-2
                      text-left text-sm text-foreground
                      transition-colors
                      hover:bg-surface-elevated
                    "
                  >
                    <Copy
                      size={15}
                      aria-hidden="true"
                    />

                    {copied
                      ? "Copied"
                      : "Copy message"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-2.5 py-2
                      text-left text-sm text-foreground
                      transition-colors
                      hover:bg-surface-elevated
                    "
                  >
                    <Link2
                      size={15}
                      aria-hidden="true"
                    />

                    Copy message link
                  </button>

                  <button
                    type="button"
                    onClick={handlePin}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-2.5 py-2
                      text-left text-sm text-foreground
                      transition-colors
                      hover:bg-surface-elevated
                    "
                  >
                    <Pin
                      size={15}
                      aria-hidden="true"
                    />

                    Pin message
                  </button>

                  <div className="my-1 h-px bg-border" />

                  <button
                    type="button"
                    onClick={handleReport}
                    className="
                      flex w-full items-center gap-2
                      rounded-lg px-2.5 py-2
                      text-left text-sm text-danger
                      transition-colors
                      hover:bg-danger/10
                    "
                  >
                    <Flag
                      size={15}
                      aria-hidden="true"
                    />

                    Report message
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}