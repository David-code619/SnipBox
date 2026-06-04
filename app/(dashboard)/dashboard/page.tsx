"use client"
import {
  PlusCircle,
  FolderPlus,
  TrendingUp,
  ChevronRight,
  Copy,
  Terminal,
  Layers,
  Flame,
  BookOpen,
  ExternalLink,
  Cpu,
} from "lucide-react";
import { mockSnippets } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const snippets = mockSnippets;
  const router = useRouter()
  const recentSnippets = snippets.slice(0, 3);

  return (
    <div
      id="dashboard_viewport"
      className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 select-none min-h-screen flex flex-col justify-between text-on-surface mt-0"
    >
      <div className="space-y-8">
        {/* Welcome Header with neat greeting widget */}
        <section
          id="welcome_section"
          className="relative overflow-hidden bg-linear-to-r from-surface-container/60 to-surface-container-low/30 border border-border-subtle rounded-2xl p-6 md:p-8"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 flex-1 w-full md:w-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[10px] font-bold uppercase tracking-widest animate-pulse">
                <Cpu size={12} />
                <span>WORKSPACE ACTIVE</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                Welcome back &quot;Developer&quot;
              </h2>
              <p className="text-on-surface-variant/75 text-sm max-w-160 leading-relaxed">
                You&apos;ve archived{" "}
                <span className="text-primary font-bold">
                  {snippets.length} active snippets
                </span>{" "}
                inside your SnippetVault cloud instance. Your synchronization
                metrics are in perfect shape.
              </p>
            </div>

            <button
              id="btn_create_snippet"
              onClick={() => router.push("/snippets/new")}
              className="px-5 py-3 bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_4px_16px_rgba(30,64,175,0.15)] active:scale-95 cursor-pointer"
            >
              <PlusCircle size={16} />
              <span>Create Snippet</span>
            </button>
          </div>

          {/* Absolute decorative background lights */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
        </section>

        {/* Dynamic Interactive Bento Grid */}
        <div
          id="quick_actions_grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Quick Action Bento 1 */}
          <div
            id="bento_new_snippet"
            onClick={() => router.push("/snippets/new")}
            className="bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-dim transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                <PlusCircle size={22} className="stroke-2" />
              </div>
              <ChevronRight
                className="text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                size={18}
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-1.5 group-hover:text-primary transition-colors">
                New Snippet
              </h3>
              <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                Add code fragments with tags. Use{" "}
                <kbd className="bg-surface-container-high px-1.5 py-0.5 rounded font-mono text-[10px] border border-border-subtle ml-1">
                  ⌘N
                </kbd>{" "}
                keyboard binding.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 duration-300"></div>
          </div>

          {/* Quick Action Bento 2 */}
          <div
            id="bento_manage_library"
            onClick={() => router.push("/snippets")}
            className="bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col justify-between hover:border-secondary/40 hover:bg-surface-dim transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-11 h-11 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                <FolderPlus size={22} className="stroke-2" />
              </div>
              <ChevronRight
                className="text-on-surface-variant/40 group-hover:text-secondary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                size={18}
              />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-on-surface mb-1.5 group-hover:text-secondary transition-colors">
                Manage Library
              </h3>
              <p className="text-xs text-on-surface-variant/70 leading-relaxed">
                Browse through folders, filter code snippets, and search global
                components instantly.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 duration-300"></div>
          </div>
        </div>

        {/* Recent Snippets with Premium Card design */}
        <section id="recent_snippets_section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <h3 className="font-display text-lg font-bold text-on-surface">
                Recent Snippets
              </h3>
            </div>
            <button
              onClick={() => router.push("/snippets")}
              className="text-primary text-xs font-bold hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ExternalLink size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSnippets.map((snippet, idx) => (
              <div
                key={snippet.id}
                onClick={() => router.push(`/snippets/${snippet.id}`)}
                className="bg-surface rounded-2xl border border-border-subtle overflow-hidden group hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col h-65 relative"
              >
                {/* Header detail of recent card */}
                <div className="bg-surface-container/80 px-4.5 py-3.5 flex items-center justify-between border-b border-border-subtle select-none">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full ring-2",
                        idx === 0
                          ? "bg-primary ring-primary/20"
                          : idx === 1
                            ? "bg-secondary ring-secondary/20"
                            : "bg-tertiary ring-tertiary/20",
                      )}
                    ></span>
                    <span className="font-mono text-xs font-bold text-on-surface truncate">
                      {snippet.title}
                    </span>
                  </div>
                  <Copy
                    size={13}
                    className="text-on-surface-variant/40 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  />
                </div>

                {/* Plain text representation preview snippet */}
                <div className="p-4.5 font-mono text-xs text-on-surface-variant/75 bg-surface-container-lowest flex-1 overflow-hidden select-text leading-relaxed">
                  <pre className="whitespace-pre overflow-hidden text-[10px] md:text-[11px] select-text">
                    {snippet.code.split("\n").slice(0, 6).join("\n") ||
                      "// Empty code block"}
                  </pre>
                </div>

                {/* Footer specs */}
                <div className="px-4.5 py-3 border-t border-border-subtle flex items-center justify-between bg-surface-container/50">
                  <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-bold">
                    {snippet.language}
                  </span>
                  <span className="font-mono text-[9px] text-secondary font-semibold bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20">
                    Synced
                  </span>
                </div>
              </div>
            ))}

            {recentSnippets.length === 0 && (
              <div className="col-span-3 py-12 text-center border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center space-y-3">
                <BookOpen size={32} className="text-on-surface-variant/20" />
                <p className="text-xs text-on-surface-variant/40 font-mono">
                  No recent snippets. Create your very first code piece!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Real Stats Section */}
        <section id="stats_section" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-tertiary" />
            <h3 className="font-display text-lg font-bold text-on-surface">
              Statistics & Trends
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Box 1 */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 relative overflow-hidden group">
              <div className="text-on-surface-variant/40 font-mono text-[10px] font-bold tracking-wider uppercase mb-1.5">
                CLOUDSYNCED FRAGMENTS
              </div>
              <div className="text-3xl font-display font-extrabold text-on-surface">
                {snippets.length}
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-secondary text-[11px] font-semibold font-mono">
                <TrendingUp size={13} /> <span>100% cloud delivery</span>
              </div>
              <div className="absolute right-4 bottom-4 text-on-surface-variant/5">
                <Layers size={64} />
              </div>
            </div>

            {/* Stat Box 2 */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 relative overflow-hidden group">
              <div className="text-on-surface-variant/40 font-mono text-[10px] font-bold tracking-wider uppercase mb-1.5">
                ORGANIZATION FILES
              </div>
              <div className="text-3xl font-display font-extrabold text-on-surface">
                {Array.from(new Set(snippets.map((s) => s.folder))).length}{" "}
                Folders
              </div>
              <div className="mt-3 flex items-center gap-1 text-on-surface-variant/40 text-[11px] font-mono">
                <span>Active directory schema ready</span>
              </div>
              <div className="absolute right-4 bottom-4 text-on-surface-variant/5">
                <FolderPlus size={64} />
              </div>
            </div>

            {/* Stat Box 3 */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 relative overflow-hidden group">
              <div className="text-on-surface-variant/40 font-mono text-[10px] font-bold tracking-wider uppercase mb-1.5">
                VAULT HEALTH INDEX
              </div>
              <div className="text-3xl font-display font-extrabold text-on-surface">
                A+ Prime
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-primary text-[11px] font-semibold font-mono">
                <span>Zero compilation warning state</span>
              </div>
              <div className="absolute right-4 bottom-4 text-on-surface-variant/5">
                <Terminal size={64} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Styled mockup-aligned Footer */}
      <footer
        id="dashboard_footer"
        className="h-14 border-t border-border-subtle bg-workspace-bg flex items-center justify-between shrink-0 select-none mt-16 pt-6"
      >
        <div className="flex items-center gap-2 text-xs text-on-surface-variant/40">
          <span className="font-bold text-on-surface-variant/60">
            SnippetVault
          </span>
          <span>|</span>
          <span>&copy; 2026 SnippetVault. Engineered for developers.</span>
        </div>
        <div className="flex gap-4 text-xs font-mono text-on-surface-variant/40 font-semibold">
          <span className="hover:text-primary cursor-pointer transition-colors">
            Privacy
          </span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            Terms
          </span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            API
          </span>
          <span className="hover:text-primary cursor-pointer transition-colors">
            Changelog
          </span>
        </div>
      </footer>
    </div>
  );
}
