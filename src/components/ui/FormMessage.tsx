import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

type FormMessageVariant = "error" | "helper" | "success";

interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: FormMessageVariant;
}

const variantClasses: Record<FormMessageVariant, string> = {
  helper: "text-fg-muted",
  error: "text-danger",
  success: "text-success",
};

export const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage({ variant = "helper", className = "", ...props }, ref) {
    return (
      <p
        ref={ref}
        className={`text-caption ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);