import { Home, User, LineChart, Bell, Settings } from "lucide-react";
import type { NavItem } from "@/types/navigation";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Market", href: "/market", icon: LineChart },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];