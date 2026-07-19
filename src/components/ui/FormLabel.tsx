import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
  disabled?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(function FormLabel(
  { requiredIndicator = false, disabled = false, className = "", children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      className={[
        "text-small font-medium text-fg",
        disabled ? "text-fg-muted" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
      {requiredIndicator && (
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      )}
    </label>
  );
});