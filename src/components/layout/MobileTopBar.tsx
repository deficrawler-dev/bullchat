import { Menu, Info } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { IconButton } from "@/components/ui/IconButton";

interface MobileTopBarProps {
  onMenuClick: () => void;
  onInfoClick: () => void;
}

export function MobileTopBar({ onMenuClick, onInfoClick }: MobileTopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
      <IconButton icon={Menu} label="Open menu" onClick={onMenuClick} />
      <Logo size="sm" />
      <IconButton icon={Info} label="Open details panel" onClick={onInfoClick} />
    </header>
  );
}