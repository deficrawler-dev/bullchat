"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/navigation";

interface NavLinkProps {
  item: NavItem;
  variant: "sidebar" | "bottom";
  onNavigate?: () => void;
}

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ item, variant, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isRouteActive(pathname, item.href);
  const Icon = item.icon;

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={[
          "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2",
          "transition-colors hover:bg-surface-elevated",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand",
        ].join(" ")}
      >
        <Icon
          size={22}
          strokeWidth={1.75}
          aria-hidden="true"
          className={isActive ? "text-brand" : "text-fg-secondary"}
        />

        <span
          className={`max-w-full truncate text-caption ${
            isActive ? "text-brand" : "text-fg-secondary"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex h-10 items-center gap-3 rounded-md px-3 text-body transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        isActive
          ? "bg-brand/10 text-brand"
          : "text-fg-secondary hover:bg-surface-elevated hover:text-fg",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}