import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
  wrapperClassName?: string;
  children?: ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    hasError = false,
    wrapperClassName = "",
    className = "",
    disabled,
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
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className={[
            "peer h-5 w-5 shrink-0 appearance-none rounded-full border bg-surface",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            hasError
              ? "border-danger focus-visible:ring-danger"
              : "border-border focus-visible:ring-brand",
            "checked:border-brand",
            "disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          {...props}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-2 w-2 scale-0 rounded-full bg-brand transition-transform duration-150 peer-checked:scale-100"
        />
      </span>

      {children ? <span className="text-body text-fg">{children}</span> : null}
    </label>
  );
});