import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
  wrapperClassName?: string;
  children?: ReactNode;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
    <label
      className={`inline-flex items-center gap-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${wrapperClassName}`}
    >
      <span className="relative inline-flex h-6 w-10 shrink-0 items-center">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          disabled={disabled}
          aria-invalid={ariaInvalid ?? hasError}
          className={[
            "peer h-6 w-10 shrink-0 appearance-none rounded-full border bg-surface-elevated",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            hasError
              ? "border-danger focus-visible:ring-danger"
              : "border-border focus-visible:ring-brand",
            "checked:border-brand checked:bg-brand",
            "disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-fg transition-transform duration-150 peer-checked:translate-x-4 peer-checked:bg-bg"
        />
      </span>

      {children ? <span className="text-body text-fg">{children}</span> : null}
    </label>
  );
});