import { Button } from "@/components/ui/Button";

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: SectionHeaderProps) {
  const showAction = Boolean(actionLabel && onAction);

  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-h4 font-medium text-fg">{title}</h2>

        {description && (
          <p className="text-small text-fg-secondary">{description}</p>
        )}
      </div>

      {showAction && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="self-start"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}