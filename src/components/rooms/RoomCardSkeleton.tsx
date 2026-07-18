import { Skeleton } from "@/components/ui/Skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-3 w-16 shrink-0" />
    </div>
  );
}