import { EmptyState } from "@/components/ui/EmptyState";

export function RightPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <span className="text-small font-medium text-fg-secondary">Details</span>
      </div>
      <div className="flex-1">
        <EmptyState
          title="Nothing to show"
          description="Additional information will appear here."
        />
      </div>
    </div>
  );
}