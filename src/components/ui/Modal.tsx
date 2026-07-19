"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
  contentClassName = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    previousActiveElement.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    (closeButtonRef.current ?? dialogRef.current)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && closeOnEscape) {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable =
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement.current?.focus();
    };
  }, [open, onClose, closeOnEscape]);

  if (!open) return null;

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      onMouseDown={handleBackdropClick}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/60"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`relative flex max-h-[85vh] w-full flex-col rounded-lg border border-border bg-surface shadow-lg ${sizeClasses[size]} ${contentClassName}`}
      >
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-4">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 id={titleId} className="text-h4 font-medium text-fg">
                  {title}
                </h2>
              )}

              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-small text-fg-secondary"
                >
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <IconButton
                ref={closeButtonRef}
                icon={X}
                label="Close dialog"
                onClick={onClose}
              />
            )}
          </div>
        )}

        {children != null && (
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        )}

        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}