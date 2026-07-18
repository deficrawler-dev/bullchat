"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: "left" | "right";
  title: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, side, title, children }: DrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sidePosition = side === "left" ? "left-0" : "right-0";
  const enterAnimation = side === "left" ? "animate-drawer-left" : "animate-drawer-right";

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close overlay"
        onClick={onClose}
        className="animate-overlay absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 ${sidePosition} flex h-dvh w-72 max-w-[85vw] flex-col bg-surface shadow-lg ${enterAnimation}`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="text-small font-medium text-fg-secondary">{title}</span>
          <IconButton ref={closeButtonRef} icon={X} label="Close" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}