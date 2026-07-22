"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Settings,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { NAV_ITEMS } from "@/constants/navigation";

interface SidebarProps {
  onNavigate?: () => void;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}

interface RoomLink {
  slug: string;
  name: string;
  avatar: string;
}

const DEFAULT_PROFILE_AVATAR =
  "/rooms/ansem-community/avatar.webp";

const FALLBACK_ROOM_AVATAR =
  "/rooms/bull-community/avatar.webp";

const ROOM_LINKS: RoomLink[] = [
  {
    slug: "ansem-community",
    name: "Ansem Community",
    avatar: "/rooms/ansem-community/avatar.webp",
  },
  {
    slug: "bull-community",
    name: "Bull Community",
    avatar: "/rooms/bull-community/avatar.webp",
  },
  {
    slug: "builders",
    name: "Builders",
    avatar: "/rooms/builders/avatar.webp",
  },
  {
    slug: "job-board",
    name: "Job Board",
    avatar: "/rooms/job-board/avatar.webp",
  },
  {
    slug: "market-talk",
    name: "Market Talk",
    avatar: "/rooms/market-talk/avatar.webp",
  },
  {
    slug: "meme-studio",
    name: "Meme Studio",
    avatar: "/rooms/meme-studio/avatar.webp",
  },
  {
    slug: "launchpad-hub",
    name: "Launchpad Hub",
    avatar: "/rooms/launchpad-hub/avatar.webp",
  },
  {
    slug: "community-support",
    name: "Community Support",
    avatar: "/rooms/community-support/avatar.webp",
  },
  {
    slug: "wins-losses",
    name: "Wins & Losses",
    avatar: "/rooms/market-talk/avatar.webp",
  },
  {
    slug: "off-topic",
    name: "Off Topic",
    avatar: "/rooms/bull-community/avatar.webp",
  },
];

export function Sidebar({
  onNavigate,
  displayName = "DefiCrawler",
  username = "@deficrawler",
  avatarUrl = DEFAULT_PROFILE_AVATAR,
  onSignOut,
}: SidebarProps) {
  const pathname = usePathname();

  const isInsideRoom = pathname.startsWith("/rooms/");

  const currentRoomSlug = isInsideRoom
    ? pathname.split("/")[2] ?? ""
    : "";

  const [isRoomsExpanded, setRoomsExpanded] =
    useState(true);

  function handleSignOut() {
    if (onSignOut) {
      onSignOut();
      return;
    }

    console.info(
      "Sign out will be connected when authentication is active.",
    );
  }

  function handleRoomNavigation() {
    onNavigate?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <div className="shrink-0 px-2 py-2">
        <Logo />
      </div>

      <nav
        aria-label="Primary"
        className="mt-4 flex min-h-0 flex-1 flex-col gap-1"
      >
        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isRoomsItem = item.href === "/rooms";

              if (!isRoomsItem) {
                return (
                  <NavLink
                    key={item.href}
                    item={item}
                    variant="sidebar"
                    onNavigate={onNavigate}
                  />
                );
              }

              return (
                <div key={item.href}>
                  {isInsideRoom ? (
                    <button
                      type="button"
                      aria-expanded={isRoomsExpanded}
                      aria-controls="sidebar-room-list"
                      onClick={() => {
                        setRoomsExpanded(
                          (current) => !current,
                        );
                      }}
                      className="flex h-10 w-full items-center gap-3 rounded-xl bg-brand/10 px-3 text-left text-sm font-medium text-brand transition-colors hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <UsersRound
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                      />

                      <span className="min-w-0 flex-1 truncate">
                        Rooms
                      </span>

                      <ChevronDown
                        className={[
                          "h-4 w-4 shrink-0 transition-transform",
                          isRoomsExpanded
                            ? "rotate-180"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <NavLink
                      item={item}
                      variant="sidebar"
                      onNavigate={onNavigate}
                    />
                  )}

                  {isInsideRoom && isRoomsExpanded && (
                    <div
                      id="sidebar-room-list"
                      className="mt-1 border-l border-border pl-3 pr-1"
                    >
                      <div className="flex flex-col gap-1 py-1">
                        {ROOM_LINKS.map((room) => {
                          const isCurrentRoom =
                            room.slug === currentRoomSlug;

                          const roomLinkClassName = [
                            "flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                            isCurrentRoom
                              ? "bg-surface-elevated text-fg"
                              : "text-fg-secondary hover:bg-surface hover:text-fg",
                          ].join(" ");

                          return (
                            <Link
                              key={room.slug}
                              href={`/rooms/${room.slug}`}
                              onClick={handleRoomNavigation}
                              aria-current={
                                isCurrentRoom
                                  ? "page"
                                  : undefined
                              }
                              className={roomLinkClassName}
                            >
                              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-border bg-bg">
                                <img
                                  src={room.avatar}
                                  alt={`${room.name} avatar`}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    const image =
                                      event.currentTarget;

                                    if (
                                      image.src.endsWith(
                                        FALLBACK_ROOM_AVATAR,
                                      )
                                    ) {
                                      return;
                                    }

                                    image.src =
                                      FALLBACK_ROOM_AVATAR;
                                  }}
                                />

                                {isCurrentRoom && (
                                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-bg bg-brand" />
                                )}
                              </span>

                              <span className="min-w-0 flex-1 truncate">
                                {room.name}
                              </span>

                              {isCurrentRoom && (
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-4 shrink-0 border-t border-border pt-4">
        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-bg">
              <Image
                src={avatarUrl}
                alt={`${displayName} profile`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-xs text-fg-secondary">
                {username}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-fg-secondary transition-colors hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <UserRound
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <span>View profile</span>
            </Link>

            <Link
              href="/profile/settings"
              onClick={onNavigate}
              className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-xs font-medium text-fg-secondary transition-colors hover:bg-surface hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Settings
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <span>Profile settings</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              <LogOut
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}