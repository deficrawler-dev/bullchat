import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

type CardVariant = "default" | "elevated" | "interactive";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-surface border border-border",
  elevated: "bg-surface-elevated border border-border",
  interactive:
    "bg-surface border border-border transition-colors group-hover:bg-surface-elevated group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "default", className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`rounded-lg ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`flex flex-col gap-1 p-4 ${className}`}
        {...props}
      />
    );
  }
);

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className = "", ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={`text-body font-medium text-fg ${className}`}
        {...props}
      />
    );
  }
);

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className = "", ...props }, ref) {
    return (
      <p
        ref={ref}
        className={`text-small text-fg-secondary ${className}`}
        {...props}
      />
    );
  }
);

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className = "", ...props }, ref) {
    return <div ref={ref} className={`px-4 pb-4 ${className}`} {...props} />;
  }
);

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className = "", ...props }, ref) {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-2 border-t border-border p-4 ${className}`}
        {...props}
      />
    );
  }
);