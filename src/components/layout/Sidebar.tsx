import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { NAV_ITEMS } from "@/constants/navigation";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-2 py-2">
        <Logo />
      </div>
      <nav aria-label="Primary" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} variant="sidebar" onNavigate={onNavigate} />
        ))}
      </nav>
    </div>
  );
}