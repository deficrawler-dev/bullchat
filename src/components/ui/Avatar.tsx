"use client";

import { forwardRef, useState } from "react";
import type { HTMLAttributes } from "react";
import Image from "next/image";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  isOnline?: boolean;
}

const sizeConfig: Record<
  AvatarSize,
  {
    box: string;
    text: string;
    px: number;
    indicator: string;
  }
> = {
  xs: { box: "h-6 w-6", text: "text-caption", px: 24, indicator: "h-1.5 w-1.5" },
  sm: { box: "h-8 w-8", text: "text-caption", px: 32, indicator: "h-2 w-2" },
  md: { box: "h-10 w-10", text: "text-small", px: 40, indicator: "h-2.5 w-2.5" },
  lg: { box: "h-12 w-12", text: "text-body", px: 48, indicator: "h-3 w-3" },
  xl: { box: "h-16 w-16", text: "text-h4", px: 64, indicator: "h-3.5 w-3.5" },
};

function getInitials(name?: string): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt, name, size = "md", isOnline = false, className = "", ...props },
  ref
) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const config = sizeConfig[size];

  const showImage = Boolean(src) && failedSrc !== src;
  const resolvedAlt = alt ?? (name ? `${name}'s avatar` : "");
  const initials = getInitials(name);

  return (
    <div
      ref={ref}
      className={`relative inline-flex shrink-0 ${config.box} ${className}`}
      {...props}
    >
      <div className="h-full w-full overflow-hidden rounded-full bg-surface-elevated">
        {showImage ? (
          <Image
            src={src as string}
            alt={resolvedAlt}
            width={config.px}
            height={config.px}
            className="h-full w-full object-cover"
            onError={() => setFailedSrc(src ?? null)}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center font-medium text-fg-secondary ${config.text}`}
          >
            <span aria-hidden={Boolean(name)}>{initials}</span>
            {name ? <span className="sr-only">{name}</span> : null}
          </div>
        )}
      </div>

      {isOnline && (
        <>
          <span
            aria-hidden="true"
            className={`absolute bottom-0 right-0 rounded-full border-2 border-surface bg-success ${config.indicator}`}
          />
          <span className="sr-only">Online</span>
        </>
      )}
    </div>
  );
});