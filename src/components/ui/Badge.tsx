import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger" | "outline";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface-elevated text-fg-secondary",
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  outline: "border border-border text-fg-secondary",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-5 px-2 text-caption gap-1",
  md: "h-6 px-2.5 text-small gap-1.5",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", size = "sm", icon, children, className = "", ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={`inline-flex w-fit items-center rounded-pill font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
});