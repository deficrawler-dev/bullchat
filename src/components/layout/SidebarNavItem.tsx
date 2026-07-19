import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string | number;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
}

function formatBadge(badge: string | number): string {
  if (typeof badge === "number" && badge > 99) return "99+";
  return String(badge);
}

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  active = false,
  badge,
  collapsed = false,
  onClick,
  className = "",
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={[
        "flex h-10 items-center gap-3 rounded-md px-3 text-small font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        collapsed ? "justify-center px-0" : "",
        active
          ? "bg-surface-elevated text-brand"
          : "text-fg-secondary hover:bg-surface-elevated hover:text-fg",
        className,
      ].join(" ")}
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      <span className={collapsed ? "sr-only" : "flex-1 truncate"}>{label}</span>
      {badge !== undefined && !collapsed && (
        <span className="shrink-0 rounded-full bg-surface px-1.5 text-caption text-fg-muted">
          {formatBadge(badge)}
        </span>
      )}
    </Link>
  );
}