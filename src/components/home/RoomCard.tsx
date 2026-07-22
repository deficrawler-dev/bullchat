"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type RoomCardVariant = "popular" | "list";

interface RoomCardProps {
  slug: string;
  thumbnailSlug: string;
  name: string;
  description: string;
  memberCount: string;
  onlineCount?: string;
  lastActivityAt?: string;
  flagship?: boolean;
  defaultJoined?: boolean;
  variant?: RoomCardVariant;
  className?: string;
}

function formatRelativeActivity(timestamp?: string): string {
  if (!timestamp) {
    return "";
  }

  const activityTime = new Date(timestamp).getTime();

  if (Number.isNaN(activityTime)) {
    return "";
  }

  const differenceInSeconds = Math.max(
    0,
    Math.floor((Date.now() - activityTime) / 1000),
  );

  if (differenceInSeconds < 30) {
    return "now";
  }

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s ago`;
  }

  const differenceInMinutes = Math.floor(
    differenceInSeconds / 60,
  );

  if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m ago`;
  }

  const differenceInHours = Math.floor(
    differenceInMinutes / 60,
  );

  if (differenceInHours < 24) {
    return `${differenceInHours}h ago`;
  }

  const differenceInDays = Math.floor(
    differenceInHours / 24,
  );

  if (differenceInDays < 7) {
    return `${differenceInDays}d ago`;
  }

  const differenceInWeeks = Math.floor(
    differenceInDays / 7,
  );

  if (differenceInWeeks < 5) {
    return `${differenceInWeeks}w ago`;
  }

  const differenceInMonths = Math.floor(
    differenceInDays / 30,
  );

  if (differenceInMonths < 12) {
    return `${differenceInMonths}mo ago`;
  }

  const differenceInYears = Math.floor(
    differenceInDays / 365,
  );

  return `${differenceInYears}y ago`;
}

function RoomActivity({
  lastActivityAt,
  description,
}: {
  lastActivityAt?: string;
  description: string;
}) {
  const [relativeActivity, setRelativeActivity] = useState(
    () => formatRelativeActivity(lastActivityAt),
  );

  useEffect(() => {
    if (!lastActivityAt) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRelativeActivity(
        formatRelativeActivity(lastActivityAt),
      );
    }, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [lastActivityAt]);

  if (lastActivityAt && relativeActivity) {
    return (
      <p className="mt-1 truncate text-xs leading-relaxed text-fg-secondary">
        Last activity {relativeActivity}
      </p>
    );
  }

  return (
    <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-fg-secondary">
      {description}
    </p>
  );
}

export function RoomCard({
  slug,
  thumbnailSlug,
  name,
  description,
  memberCount,
  onlineCount,
  lastActivityAt,
  flagship = false,
  defaultJoined = false,
  variant = "list",
  className = "",
}: RoomCardProps) {
  const [isJoined, setIsJoined] =
    useState(defaultJoined);

  const roomHref = `/rooms/${slug}`;
  const thumbnailSrc =
    `/rooms/${thumbnailSlug}/thumbnail.webp`;

  function handleJoinRoom() {
    if (!isJoined) {
      setIsJoined(true);
    }
  }

  if (variant === "popular") {
    return (
      <article
        className={[
          "relative h-[280px]",
          "w-[calc(100vw-48px)] max-w-[360px]",
          "shrink-0 snap-start overflow-hidden",
          "rounded-2xl bg-surface-elevated",
          "sm:w-[320px]",
          className,
        ].join(" ")}
      >
        <Link
          href={roomHref}
          aria-label={`Open ${name}`}
          className="
            absolute inset-0 z-10
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-brand
          "
        >
          <Image
            src={thumbnailSrc}
            alt={`${name} community`}
            fill
            sizes="(max-width: 640px) calc(100vw - 48px), 320px"
            className="object-cover"
            priority={flagship}
          />
        </Link>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-black/35"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-black/40"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-black/45"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-white">
                {name}
              </h3>

              <p className="mt-1 text-sm font-medium text-white/90">
                {memberCount}
              </p>

              {onlineCount && (
                <p className="mt-0.5 text-xs text-white/75">
                  {onlineCount}
                </p>
              )}
            </div>

            {flagship && (
              <Badge
                variant="brand"
                size="sm"
                className="shrink-0"
              >
                Flagship
              </Badge>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-40 p-4">
          <Button
            type="button"
            variant={isJoined ? "secondary" : "primary"}
            size="sm"
            onClick={handleJoinRoom}
            disabled={isJoined}
            className="h-11 w-full"
          >
            {isJoined ? "Joined" : "Join"}
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={[
        "flex min-w-0 items-center gap-3",
        "border-b border-border py-4",
        "last:border-b-0",
        className,
      ].join(" ")}
    >
      <Link
        href={roomHref}
        aria-label={`Open ${name}`}
        className="
          relative h-[72px] w-[72px] shrink-0
          overflow-hidden rounded-xl
          bg-surface-elevated
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-brand
        "
      >
        <Image
          src={thumbnailSrc}
          alt={`${name} thumbnail`}
          fill
          sizes="72px"
          className="object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={roomHref}
            className="
              min-w-0 truncate text-base
              font-semibold leading-tight text-fg
              transition-colors hover:text-brand
              focus-visible:outline-none
              focus-visible:text-brand
            "
          >
            {name}
          </Link>

          {flagship && (
            <Badge
              variant="brand"
              size="sm"
              className="hidden shrink-0 min-[390px]:inline-flex"
            >
              Flagship
            </Badge>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-fg-secondary">
          {memberCount}
          {onlineCount ? ` · ${onlineCount}` : ""}
        </p>

        <RoomActivity
          key={lastActivityAt ?? description}
          lastActivityAt={lastActivityAt}
          description={description}
        />
      </div>

      <Button
        type="button"
        variant={isJoined ? "secondary" : "primary"}
        size="sm"
        onClick={handleJoinRoom}
        disabled={isJoined}
        className="min-w-[88px] shrink-0 px-3"
      >
        {isJoined ? "Joined" : "Join"}
      </Button>
    </article>
  );
}