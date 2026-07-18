import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon: Icon, label, className = "", ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-surface-elevated hover:text-fg ${className}`}
        {...props}
      >
        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>
    );
  }
);