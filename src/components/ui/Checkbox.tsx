"use client";

import { forwardRef, useEffect, useRef } from "react";
import type {
  InputHTMLAttributes,
  MutableRefObject,
  ReactNode,
} from "react";
import { Check, Minus } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
  indeterminate?: boolean;
  wrapperClassName?: string;
  children?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    hasError = false,
    indeterminate = false,
    wrapperClassName = "",
    className = "",
    disabled,
    "aria-invalid": ariaInvalid,
    children,
    ...props
  },
  ref
) {
  const internalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`inline-flex items-center gap-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${wrapperClassName}`}
    >
      <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          type="checkbox"
          disabled={disabled}
          aria-invalid={ariaInvalid ?? hasError}
          className={[
            "peer h-5 w-5 shrink-0 appearance-none rounded-md border bg-surface",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            hasError
              ? "border-danger focus-visible:ring-danger"
              : "border-border focus-visible:ring-brand",
            "checked:border-brand checked:bg-brand indeterminate:border-brand indeterminate:bg-brand",
            "disabled:cursor-not-allowed",
            className,
          ].join(" ")}
          {...props}
        />
        <Check
          aria-hidden="true"
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute text-bg opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0"
        />
        <Minus
          aria-hidden="true"
          size={14}
          strokeWidth={3}
          className="pointer-events-none absolute text-bg opacity-0 peer-indeterminate:opacity-100"
        />
      </span>

      {children ? <span className="text-body text-fg">{children}</span> : null}
    </label>
  );
});