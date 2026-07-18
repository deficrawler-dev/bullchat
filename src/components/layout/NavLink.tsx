"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/navigation";

interface NavLinkProps {
  item: NavItem;
  variant: "sidebar" | "bottom";
  onNavigate?: () => void;
}

export function NavLink({ item, variant, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
  const Icon = item.icon;

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2"
      >
        <Icon
          size={22}
          strokeWidth={1.75}
          className={isActive ? "text-brand" : "text-fg-secondary"}
          aria-hidden="true"
        />
        <span className={`text-caption ${isActive ? "text-brand" : "text-fg-secondary"}`}>
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
      className={`flex items-center gap-3 rounded-md px-3 py-3 text-body transition-colors ${
        isActive
          ? "bg-brand/10 text-brand"
          : "text-fg-secondary hover:bg-surface-elevated hover:text-fg"
      }`}
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}