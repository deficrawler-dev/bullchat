import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function RoomListEmptyState() {
  return (
    <EmptyState
      icon={MessagesSquare}
      title="No rooms yet"
      description="Community rooms will appear here once they are available."
    />
  );
}