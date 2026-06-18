import React from "react";
import Link from "next/link";
import {
  Terminal,
  LayoutDashboard,
  Code2,
  Star,
  LineChart,
  Settings,
  Plus,
  Menu,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen overflow-hidden bg-workspace-bg text-on-background font-sans">
      {/* Sidebar - Strictly aligned with mockup visual styles */}
      <aside className="bg-sidebar-bg border-r border-border-subtle hidden md:flex flex-col p-5 w-64 shrink-0 z-40 select-none">
        {/* Workspace Brand Block */}
        <div className="flex items-center gap-3 px-2 py-1 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(173,198,255,0.05)]">
            <Terminal size={20} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-lg font-extrabold text-on-surface tracking-tight leading-tight">
              SnippetVault
            </h1>
            <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mt-0.5">
              Pro Workspace
            </span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 flex flex-col gap-1.5">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <NavItem
            to="/snippets"
            icon={<Code2 size={18} />}
            label="All Snippets"
          />
          <NavItem
            to="/favorites"
            icon={<Star size={18} />}
            label="Favorites"
          />
          <NavItem
            to="/analytics"
            icon={<LineChart size={18} />}
            label="Analytics"
          />
          <NavItem
            to="/settings"
            icon={<Settings size={18} />}
            label="Settings"
          />
        </nav>

        {/* Fast Snippet Addition Trigger with gorgeous mockup-style styling */}
        <Link
          href="/snippets/new"
          className="w-full mt-6 py-3 px-4 bg-[#7ca1ff] text-[#090b10] rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(124,161,255,0.12)]"
        >
          <Plus size={18} className="stroke-[3px]" />
          <span className="text-xs font-bold leading-none">New Snippet</span>
        </Link>
        
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-workspace-bg">
        {/* Premium Top Navigation header */}
        <header className="bg-header-bg/90 backdrop-blur-xl border-b border-border-subtle h-16 shrink-0 flex items-center justify-between px-6 sm:px-8 z-30 relative select-none">
            {/* Left page indicator */}
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-xl">
                <Menu size={18} />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-on-surface-variant/80">
                <span>Workspace</span>
                <ChevronRight size={12} className="opacity-40" />
                <span className="text-primary font-semibold">SnippetVault</span>
              </div>
            </div>

            {/* Click-to-Search Box - Premium mockup integration */}
            <div className="flex-1 max-w-112 min-w-65 mx-6 hidden lg:block">
              <div className="relative group pointer-events-none">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60"
                />
                <div className="w-full bg-surface-container rounded-xl pl-10 pr-16 py-2 text-xs border border-border-subtle group-hover:border-primary/40 transition-all text-on-surface-variant/40 flex items-center select-none whitespace-nowrap truncate leading-none">
                  Search snippets, folders, or settings...
                </div>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="font-mono text-[9px] bg-surface-container-high px-2 py-1 rounded border border-border-subtle text-on-surface-variant flex items-center gap-0.5 leading-none">
                    <span className="text-[10px]">⌘</span>K
                  </kbd>
                </div>
              </div>
            </div>

            {/* Profile context elements */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-xl transition-colors md:hidden h-10 w-10 flex items-center justify-center">
                <Search size={18} />
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-xl transition-colors relative h-10 w-10 flex items-center justify-center">
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-error rounded-full"></span>
              </button>
              {/* <button
                onClick={toggleTheme}
                className="p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-xl transition-colors h-10 w-10 flex items-center justify-center cursor-pointer"
                title={`Toggle to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              </button> */}
              <button className="p-2 text-on-surface-variant hover:bg-surface-variant/40 rounded-xl transition-colors h-10 w-10 flex items-center justify-center">
                <Settings size={18} />
              </button>
              <div className="w-8 h-8 rounded-full ml-1.5 bg-surface-container-highest border border-border-subtle overflow-hidden text-xs flex items-center justify-center font-bold text-primary select-none">
                UI
              </div>
            </div>
          </header>
        

        {/* Dynamic Content Frame */}
        <div className="flex-1 overflow-y-auto isolate custom-scrollbar relative">
          {children}
        </div>
      </main>

      {/* Mobile Footer Area */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-sidebar-bg/95 backdrop-blur-xl border-t border-border-subtle flex justify-around items-center h-16 z-50">
        <MobileNavItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <MobileNavItem to="/snippets" icon={<Code2 size={18} />} label="Snippets" />
        <MobileNavItem to="/favorites" icon={<Star size={18} />} label="Favorites" />
        <MobileNavItem to="/analytics" icon={<LineChart size={18} />} label="Analytics" />
      </nav>

      {/* Global Command Search Overlay
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      /> */}
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
  variant = "default",
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "ghost";
}) {
  return (
    <Link href={to} className={cn(
      "flex items-center gap-3.5 px-4.5 py-3 rounded-xl transition-all text-xs font-semibold leading-none select-none",
      "text-on-surface-variant/80 hover:bg-surface-container hover:text-on-surface",
      variant === "ghost" ? "opacity-80 hover:opacity-100" : ""
    )}>
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function MobileNavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={to} className={cn(
      "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors select-none",
      "text-on-surface-variant/60"
    )}>
      {icon}
      <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{label}</span>
    </Link>
  );
}
