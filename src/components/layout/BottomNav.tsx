import { NavLink } from "@/components/layout/NavLink";
import { NAV_ITEMS } from "@/constants/navigation";

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="
        fixed inset-x-0 bottom-0 z-30
        flex min-h-16 items-stretch
        border-t border-border bg-surface
        pb-[env(safe-area-inset-bottom)]
        lg:hidden
      "
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          variant="bottom"
        />
      ))}
    </nav>
  );
}