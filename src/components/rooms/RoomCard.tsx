import Link from "next/link";
import { Users } from "lucide-react";
import type { Room } from "@/types/room";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Link
      href={`/rooms/${room.id}`}
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-brand">
        <Users size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-body font-medium text-fg"
          title={room.name}
        >
          {room.name}
        </p>

        <p
          className="truncate text-small text-fg-secondary"
          title={room.description}
        >
          {room.description}
        </p>
      </div>

      <span className="shrink-0 text-caption text-fg-muted">
        {room.memberCount} {room.memberCount === 1 ? "member" : "members"}
      </span>
    </Link>
  );
}