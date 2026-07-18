import type { Room } from "@/types/room";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";
import { RoomListEmptyState } from "@/components/rooms/RoomListEmptyState";

interface RoomListProps {
  rooms?: Room[];
  isLoading?: boolean;
}

const SKELETON_COUNT = 4;

export function RoomList({ rooms = [], isLoading = false }: RoomListProps) {
  if (isLoading) {
    return (
      <ul className="flex flex-col gap-3" aria-busy="true" aria-label="Loading rooms">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <li key={index}>
            <RoomCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (rooms.length === 0) {
    return <RoomListEmptyState />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {rooms.map((room) => (
        <li key={room.id}>
          <RoomCard room={room} />
        </li>
      ))}
    </ul>
  );
}