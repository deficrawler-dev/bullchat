"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { BottomNav } from "@/components/layout/BottomNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { Drawer } from "@/components/ui/Drawer";

interface AppShellProps {
  children: ReactNode;
  notificationCount?: number;
}

export function AppShell({
  children,
  notificationCount = 0,
}: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const isRoomPage = pathname.startsWith("/rooms/");

  return (
    <div className="min-h-dvh w-full bg-bg text-fg">
      {/* Desktop sidebar */}
      <aside
        className="
          fixed inset-y-0 left-0 z-20
          hidden w-60 border-r border-border
          bg-surface lg:block
        "
      >
        <Sidebar />
      </aside>

      {/* Global right panel */}
      {!isRoomPage && (
        <aside
          className="
            fixed inset-y-0 right-0 z-20
            hidden w-80 border-l border-border
            bg-surface xl:block
          "
        >
          <RightPanel />
        </aside>
      )}

      {/* Global mobile header */}
      {!isRoomPage && (
        <MobileTopBar
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={notificationCount}
        />
      )}

      <main
        className={
          isRoomPage
            ? `
              flex h-dvh min-h-0 w-full min-w-0 overflow-hidden
              lg:pl-60
            `
            : `
              min-h-dvh w-full min-w-0
              pb-16 pt-16
              lg:pb-0 lg:pl-60 lg:pt-0
              xl:pr-80
            `
        }
      >
        {children}
      </main>

      {/* Global mobile navigation */}
      {!isRoomPage && <BottomNav />}

      {!isRoomPage && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          side="left"
          title="Menu"
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </Drawer>
      )}
    </div>
  );
}