import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({ title, description, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon ? (
        <Icon size={32} strokeWidth={1.5} className="text-fg-muted" aria-hidden="true" />
      ) : null}
      <p className="text-h4 font-medium text-fg">{title}</p>
      {description ? (
        <p className="max-w-sm text-small text-fg-secondary">{description}</p>
      ) : null}
    </div>
  );
}