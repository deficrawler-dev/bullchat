import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    hasError = false,
    className = "",
    disabled,
    readOnly,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref
) {
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={ariaInvalid ?? hasError}
      className={[
        "min-h-24 w-full resize-y rounded-md border bg-surface px-3 py-2 text-body text-fg",
        "placeholder:text-fg-muted",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        hasError
          ? "border-danger focus-visible:ring-danger"
          : "border-border focus-visible:ring-brand",
        disabled ? "cursor-not-allowed opacity-50" : "",
        readOnly ? "bg-surface-elevated" : "",
        className,
      ].join(" ")}
      {...props}
    />
  );
});