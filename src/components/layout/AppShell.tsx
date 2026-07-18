"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { RightPanel } from "@/components/layout/RightPanel";
import { Drawer } from "@/components/ui/Drawer";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      {/* Desktop left sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r border-border bg-surface lg:block">
        <Sidebar />
      </aside>

      {/* Desktop right information panel */}
      <aside className="fixed inset-y-0 right-0 z-20 hidden w-80 border-l border-border bg-surface xl:block">
        <RightPanel />
      </aside>

      {/* Mobile top bar */}
      <MobileTopBar
        onMenuClick={() => setSidebarOpen(true)}
        onInfoClick={() => setRightPanelOpen(true)}
      />

      {/* Main content */}
      <main className="min-h-dvh pb-16 pt-16 lg:pb-0 lg:pl-60 lg:pt-0 xl:pr-80">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Mobile slide-out sidebar */}
      <Drawer open={isSidebarOpen} onClose={() => setSidebarOpen(false)} side="left" title="Menu">
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </Drawer>

      {/* Mobile collapsible right panel */}
      <Drawer
        open={isRightPanelOpen}
        onClose={() => setRightPanelOpen(false)}
        side="right"
        title="Details"
      >
        <RightPanel />
      </Drawer>
    </div>
  );
}