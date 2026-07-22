import Link from "next/link";
import { Bell, Menu } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { IconButton } from "@/components/ui/IconButton";

interface MobileTopBarProps {
  onMenuClick: () => void;
  notificationCount?: number;
}

export function MobileTopBar({
  onMenuClick,
  notificationCount = 0,
}: MobileTopBarProps) {
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-30
        flex h-16 items-center justify-between
        border-b border-border bg-surface px-4
        lg:hidden
      "
    >
      <IconButton
        icon={Menu}
        label="Open menu"
        onClick={onMenuClick}
      />

      <Logo size="sm" />

      <Link
        href="/notifications"
        aria-label={`${notificationCount} unread notifications`}
        className="
          flex min-h-10 min-w-10 items-center justify-center
          gap-1.5 rounded-xl px-2 text-brand
          transition-colors hover:bg-surface-elevated
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-brand
        "
      >
        <Bell
          className="h-5 w-5"
          strokeWidth={2}
          aria-hidden="true"
        />

        <span className="min-w-3 text-xs font-semibold tabular-nums">
          {notificationCount}
        </span>
      </Link>
    </header>
  );
}