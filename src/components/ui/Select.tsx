import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    hasError = false,
    wrapperClassName = "",
    className = "",
    disabled,
    "aria-invalid": ariaInvalid,
    children,
    ...props
  },
  ref
) {
  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={ariaInvalid ?? hasError}
        className={[
          "h-10 w-full appearance-none rounded-md border bg-surface pl-3 pr-9 text-body text-fg",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          hasError
            ? "border-danger focus-visible:ring-danger"
            : "border-border focus-visible:ring-brand",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>

      <ChevronDown
        aria-hidden="true"
        size={16}
        className="pointer-events-none absolute right-3 text-fg-muted"
      />
    </div>
  );
});