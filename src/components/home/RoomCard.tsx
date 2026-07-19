import { Circle, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

interface RoomCardProps {
  name: string;
  description: string;
  memberCount: number;
  onlineCount?: number;
  category?: string;
  featured?: boolean;
  joined?: boolean;
  onJoin?: () => void;
  onOpen?: () => void;
  className?: string;
}

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function RoomCard({
  name,
  description,
  memberCount,
  onlineCount,
  category,
  featured = false,
  joined = false,
  onJoin,
  onOpen,
  className = "",
}: RoomCardProps) {
  const actionLabel = joined ? "Open" : "Join";
  const actionHandler = joined ? onOpen : onJoin;

  return (
    <Card variant="default" className={className}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="min-w-0 truncate">{name}</CardTitle>

          {featured && (
            <Badge variant="brand" size="sm">
              Featured
            </Badge>
          )}
        </div>

        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-3 text-caption text-fg-muted">
          <span className="inline-flex items-center gap-1">
            <Users
              size={14}
              strokeWidth={1.75}
              aria-hidden="true"
              className="shrink-0"
            />
            {compactFormatter.format(memberCount)} members
          </span>

          {onlineCount !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Circle
                size={8}
                strokeWidth={0}
                fill="currentColor"
                className="shrink-0 text-brand"
                aria-hidden="true"
              />
              {compactFormatter.format(onlineCount)} online
            </span>
          )}

          {category && (
            <Badge variant="neutral" size="sm">
              {category}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant={joined ? "secondary" : "primary"}
          size="sm"
          onClick={actionHandler}
          disabled={!actionHandler}
          className="w-full sm:w-auto"
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}