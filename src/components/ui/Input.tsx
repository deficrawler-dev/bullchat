import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    hasError = false,
    leftIcon,
    rightIcon,
    wrapperClassName = "",
    className = "",
    disabled,
    readOnly,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      {leftIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 flex items-center text-fg-muted"
        >
          {leftIcon}
        </span>
      )}

      <input
        ref={ref}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={ariaInvalid ?? hasError}
        className={[
          "h-10 w-full rounded-md border bg-surface text-body text-fg",
          "placeholder:text-fg-muted",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          hasError
            ? "border-danger focus-visible:ring-danger"
            : "border-border focus-visible:ring-brand",
          disabled ? "cursor-not-allowed opacity-50" : "",
          readOnly ? "bg-surface-elevated" : "",
          leftIcon ? "pl-9" : "pl-3",
          rightIcon ? "pr-9" : "pr-3",
          className,
        ].join(" ")}
        {...props}
      />

      {rightIcon && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 flex items-center text-fg-muted"
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
});