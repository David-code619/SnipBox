'use client'
import React, { useState, useMemo } from "react";
import {
  Search,
  Grid,
  List,
  Copy,
  Folder,
  Code2,
  Edit2,
  Check,
  Star,
  Filter,
  RotateCcw,
  Heart,
  ArrowRight,
  BookOpen,
  Layers,
} from "lucide-react";
import { mockSnippets } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Favorites() {
  const [snippets, setSnippets] = useState(() =>
    mockSnippets.map((snippet) => ({ ...snippet })),
  );
  const router = useRouter();

  // Layout and filtration states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // We only care about favorite snippets on this page
  const favoriteSnippets = useMemo(() => {
    return snippets.filter((s) => !!s.isFavorite);
  }, [snippets]);

  // Extract folder metadata safely with counts specifically for favorites
  const folders = useMemo(() => {
    const list = new Map<string, number>();
    favoriteSnippets.forEach((s) => {
      const folder = s.folder || "Unsorted";
      list.set(folder, (list.get(folder) || 0) + 1);
    });
    return Array.from(list.entries()).map(([name, count]) => ({ name, count }));
  }, [favoriteSnippets]);

  // Extract language metadata safely specifically for favorites
  const languages = useMemo(() => {
    const list = new Map<string, number>();
    favoriteSnippets.forEach((s) => {
      const lang = s.language || "Plain Text";
      list.set(lang, (list.get(lang) || 0) + 1);
    });
    return Array.from(list.entries()).map(([name, count]) => ({ name, count }));
  }, [favoriteSnippets]);

  // Calculate stats specifically for favorites
  const totalCopies = useMemo(() => {
    return favoriteSnippets.reduce((sum, s) => sum + (s.copyCount || 0), 0);
  }, [favoriteSnippets]);

  const uniqueLanguagesCount = useMemo(() => {
    return new Set(favoriteSnippets.map((s) => s.language)).size;
  }, [favoriteSnippets]);

  // Copy helper
  const handleCopy = (e: React.MouseEvent, id: string, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);

    // const snip = snippets.find((s) => s.id === id);
    // if (snip) {
    //   updateSnippet(id, { copyCount: (snip.copyCount || 0) + 1 });
    // }

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Toggle favorite off
  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // updateSnippet(id, { isFavorite: false });
  };

  // Delete helper
//   const handleDelete = (e: React.MouseEvent, id: string) => {
//     e.stopPropagation();
//     if (
//       window.confirm("Are you sure you want to archive this code fragment?")
//     ) {
//     //   deleteSnippet(id);
//     }
//   };

  // Filtration logic applied specifically to favorites
  const filteredFavorites = useMemo(() => {
    let result = [...favoriteSnippets];

    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.description || "").toLowerCase().includes(q) ||
          (s.language || "").toLowerCase().includes(q) ||
          (s.folder || "").toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // 2. Folder filter
    if (selectedFolder !== "All") {
      result = result.filter((s) => s.folder === selectedFolder);
    }

    // 3. Language filter
    if (selectedLanguage !== "All") {
      result = result.filter((s) => s.language === selectedLanguage);
    }

    return result;
  }, [favoriteSnippets, search, selectedFolder, selectedLanguage]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedFolder("All");
    setSelectedLanguage("All");
  };

  return (
    <div
      id="favorites_viewport"
      className="w-full p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-24 select-none flex flex-col min-h-[70vh] text-on-surface"
    >
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 border-b border-border-subtle pb-6 select-none">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] font-mono text-[9px] font-bold uppercase tracking-wider">
            <Star size={11} className="fill-current animate-pulse" />
            <span>VIP Code Fragments Vault</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-on-surface tracking-tight leading-none mt-1 flex items-center gap-3">
            Favorite Snippets
          </h1>
          <p className="text-on-surface-variant/75 text-sm">
            Quick-access panel for your most critical, high-frequency templates
            and design tokens.
          </p>
        </div>

        {/* Rapid Navigation Button */}
        <button
          onClick={() => router.push("/snippets")}
          className="px-5 py-3 bg-surface border border-border-subtle text-on-surface hover:text-primary hover:border-primary/40 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <span>All Curated Library</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {favoriteSnippets.length === 0 ? (
        <div className="w-full py-16 flex items-center justify-center shrink-0">
          <div className="w-full max-w-112 sm:max-w-128 min-w-70 sm:min-w-120 mx-auto text-center border border-border-subtle bg-surface rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center space-y-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] shrink-0">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#6366f1]/10 border border-[#6366f1]/20 flex items-center justify-center text-[#6366f1]">
                <Star size={28} className="animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center animate-pulse">
                <Heart size={8} className="text-on-primary fill-current" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl font-black text-on-surface tracking-tight">
                Your Favorite Vault is Empty
              </h3>
              <p className="text-xs text-on-surface-variant/50 max-w-96 mx-auto leading-relaxed font-normal">
                VIP code fragments have not been flagged yet inside this
                workspace. Star any critical scripts, helper files, or hooks to
                view them here instantly.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push("/snippets")}
                className="px-5 py-3.5 bg-[#6366f1] hover:brightness-110 text-white text-xs font-bold font-sans uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_16px_rgba(99,102,241,0.15)] active:scale-95 flex items-center gap-2 mx-auto justify-center cursor-pointer"
              >
                <BookOpen size={14} />
                <span>Browse Curated Library</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Bespoke Premium Stats Cards Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 transition-all duration-300">
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-[#6366f1]/30 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="text-on-surface-variant/50 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                STARRED FILES
              </div>
              <div className="text-2xl font-display font-extrabold text-[#6366f1] flex items-baseline gap-1">
                {favoriteSnippets.length}{" "}
                <span className="text-xs font-mono font-medium text-on-surface-variant/40">
                  fragments
                </span>
              </div>
              <div className="absolute right-4 bottom-4 text-[#6366f1]/5 group-hover:scale-110 duration-300 transition-transform">
                <Star size={44} className="fill-current" />
              </div>
            </div>

            <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="text-on-surface-variant/50 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                ACCUMULATED COPIES
              </div>
              <div className="text-2xl font-display font-extrabold text-on-surface flex items-baseline gap-1">
                {totalCopies}{" "}
                <span className="text-xs font-mono text-on-surface-variant/40 font-semibold">
                  executions
                </span>
              </div>
              <div className="absolute right-4 bottom-4 text-primary/5 group-hover:scale-110 duration-300 transition-transform">
                <Layers size={44} />
              </div>
            </div>

            <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-secondary/30 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="text-on-surface-variant/50 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                DIVERSITY DENSITY
              </div>
              <div className="text-2xl font-display font-extrabold text-secondary flex items-baseline gap-1">
                {uniqueLanguagesCount}{" "}
                <span className="text-xs font-mono font-medium text-on-surface-variant/40">
                  languages
                </span>
              </div>
              <div className="absolute right-4 bottom-4 text-secondary/5 group-hover:scale-110 duration-300 transition-transform">
                <Code2 size={44} />
              </div>
            </div>

            <div className="bg-surface border border-border-subtle rounded-2xl p-5 relative overflow-hidden group hover:border-tertiary/30 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="text-on-surface-variant/50 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                FOLDER DIRECTORIES
              </div>
              <div className="text-2xl font-display font-extrabold text-tertiary flex items-baseline gap-1">
                {folders.length}{" "}
                <span className="text-xs font-mono font-medium text-on-surface-variant/40">
                  active folders
                </span>
              </div>
              <div className="absolute right-4 bottom-4 text-tertiary/5 group-hover:scale-110 duration-300 transition-transform">
                <Folder size={44} />
              </div>
            </div>
          </div>

          {/* 3. Utility Filtration Overlay */}
          {favoriteSnippets.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.01)] select-none">
              {/* Quick-Filter Search Bar */}
              <div className="w-full md:w-96 relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter favorite snippets..."
                  className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface border border-border-subtle focus:border-[#6366f1]/40 outline-none transition-all placeholder:text-on-surface-variant/55 leading-none"
                />
              </div>

              {/* Grid/List toggles & indicator count */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-[11px] font-mono text-on-surface-variant/50 hidden md:inline uppercase tracking-widest font-bold">
                  Found {filteredFavorites.length} favorite file
                  {filteredFavorites.length !== 1 ? "s" : ""}
                </span>

                <div className="bg-surface-container p-1 rounded-xl flex border border-border-subtle shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer",
                      viewMode === "grid"
                        ? "bg-surface-container-high text-[#6366f1] shadow-sm border border-border-subtle"
                        : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface",
                    )}
                    title="Grid representation"
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer",
                      viewMode === "list"
                        ? "bg-surface-container-high text-[#6366f1] shadow-sm border border-border-subtle"
                        : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface",
                    )}
                    title="List representation"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Directory filters Sidebar & Main snippets render zone */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-0 select-none">
            {/* Left category subbar dedicated for Favorite folders and languages */}
            {favoriteSnippets.length > 0 && (
              <aside className="w-full lg:w-64 bg-surface border border-border-subtle rounded-2xl p-5 space-y-6 shrink-0 z-10 lg:self-start shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <Filter size={14} className="text-[#6366f1]" />
                    <span>Favorites Schema</span>
                  </div>

                  {(selectedFolder !== "All" ||
                    selectedLanguage !== "All" ||
                    search) && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[10px] text-[#6366f1] hover:underline flex items-center gap-1 font-bold font-mono uppercase cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {/* Folder selection specifically filtered on favorites */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest font-mono">
                    <Folder size={12} />
                    <span>Favorite Folders</span>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-35 overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedFolder("All")}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                        selectedFolder === "All"
                          ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 font-bold"
                          : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                      )}
                    >
                      <span>All Directories</span>
                      <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/40">
                        {favoriteSnippets.length}
                      </span>
                    </button>
                    {folders.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setSelectedFolder(f.name)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                          selectedFolder === f.name
                            ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 font-bold"
                            : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                        )}
                      >
                        <span className="truncate pr-2">{f.name}</span>
                        <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/40">
                          {f.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language filter specifically filtered on favorites */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest font-mono">
                    <Code2 size={12} />
                    <span>By Software Language</span>
                  </div>
                  <div className="flex flex-col gap-1.5 max-h-35 overflow-y-auto pr-1">
                    <button
                      onClick={() => setSelectedLanguage("All")}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                        selectedLanguage === "All"
                          ? "bg-secondary/10 text-secondary border border-secondary/20 font-bold"
                          : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                      )}
                    >
                      <span>All Software</span>
                      <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/40">
                        {favoriteSnippets.length}
                      </span>
                    </button>
                    {languages.map((l) => (
                      <button
                        key={l.name}
                        onClick={() => setSelectedLanguage(l.name)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                          selectedLanguage === l.name
                            ? "bg-secondary/10 text-secondary border border-secondary/20 font-bold"
                            : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                        )}
                      >
                        <span className="truncate pr-2">{l.name}</span>
                        <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/40">
                          {l.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            )}

            {/* Snippets List zone */}
            <div className="flex-1 w-full overflow-y-auto pb-10 min-h-0 select-text">
              {/* Layout VIEW MODE: GRID */}
              {favoriteSnippets.length > 0 && viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredFavorites.map((snippet, idx) => (
                    <div
                      key={snippet.id}
                      onClick={() => router.push(`/snippets/${snippet.id}`)}
                      className="bg-surface rounded-2xl border border-border-subtle overflow-hidden group hover:border-[#6366f1]/40 transition-all duration-300 flex flex-col h-70 relative cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.01)]"
                    >
                      {/* Header */}
                      <div className="bg-surface-container/80 px-4.5 py-3 flex items-center justify-between border-b border-border-subtle select-none">
                        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              idx % 3 === 0
                                ? "bg-primary"
                                : idx % 3 === 1
                                  ? "bg-secondary"
                                  : "bg-tertiary",
                            )}
                          ></span>
                          <span className="font-mono text-xs font-bold text-on-surface truncate">
                            {snippet.title}
                          </span>
                          <Star
                            size={12}
                            fill="#6366f1"
                            stroke="#6366f1"
                            className="shrink-0 ml-1 flex-none animate-pulse"
                          />
                        </div>

                        {/* Quick Floating Action buttons */}
                        <div className="flex items-center gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity select-none">
                          <button
                            onClick={(e) => handleToggleFavorite(e, snippet.id)}
                            className="p-1.5 bg-surface-container-high border border-border-subtle rounded-lg text-[#6366f1] hover:text-on-surface-variant transition-all cursor-pointer"
                            title="Remove from favorites"
                          >
                            <Heart
                              size={12}
                              fill="#6366f1"
                              className="stroke-[#6366f1] text-[#6366f1]"
                            />
                          </button>
                          <button
                            onClick={(e) =>
                              handleCopy(e, snippet.id, snippet.code)
                            }
                            className="p-1.5 bg-surface-container-high border border-border-subtle rounded-lg hover:border-primary/30 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                            title="Copy code fragment"
                          >
                            {copiedId === snippet.id ? (
                              <Check size={12} className="text-secondary" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/snippets/${snippet.id}/edit`);
                            }}
                            className="p-1.5 bg-surface-container-high border border-border-subtle rounded-lg hover:border-secondary/30 text-on-surface-variant hover:text-secondary transition-all cursor-pointer"
                            title="Edit snippet"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Curated code text previews */}
                      <div className="p-4.5 font-mono bg-surface-container-lowest flex-1 overflow-hidden select-text relative">
                        <pre className="text-[10px] md:text-[11px] text-on-surface-variant/75 leading-relaxed overflow-hidden whitespace-pre">
                          {snippet.code.split("\n").slice(0, 7).join("\n") ||
                            "// Empty file content"}
                        </pre>
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/85 to-transparent pointer-events-none"></div>
                      </div>

                      {/* Footer tags */}
                      <div className="px-4.5 py-3 border-t border-border-subtle bg-surface-container/50 flex flex-col gap-2.5 select-none">
                        <div className="flex flex-wrap gap-1.5 h-5 overflow-hidden">
                          {snippet.tags.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-surface-container border border-border-subtle rounded text-[9px] font-mono text-on-surface-variant/70"
                            >
                              #{t}
                            </span>
                          ))}
                          {snippet.tags.length === 0 && (
                            <span className="text-[9px] font-mono text-on-surface-variant/30 italic">
                              no tags
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-border-subtle/40 pt-2">
                          <span className="font-mono text-[9px] text-secondary font-bold bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                            {snippet.language}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-mono text-on-surface-variant/40 font-semibold">
                            <span>Copies: {snippet.copyCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Layout VIEW MODE: COMPACT LIST */}
              {favoriteSnippets.length > 0 && viewMode === "list" && (
                <div className="space-y-3">
                  {filteredFavorites.map((snippet, idx) => (
                    <div
                      key={snippet.id}
                      onClick={() => router.push(`/snippets/${snippet.id}`)}
                      className="bg-surface rounded-xl border border-border-subtle hover:border-[#6366f1]/35 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 group cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                    >
                      {/* Info */}
                      <div className="flex items-center gap-3 min-w-0 flex-1 md:mr-4">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full shrink-0 flex-none",
                            idx % 3 === 0
                              ? "bg-primary"
                              : idx % 3 === 1
                                ? "bg-secondary"
                                : "bg-tertiary",
                          )}
                        ></span>
                        <div className="min-w-0 space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-mono text-sm font-bold text-on-surface truncate">
                              {snippet.title}
                            </h4>
                            <Star
                              size={12}
                              fill="#6366f1"
                              stroke="#6366f1"
                              className="shrink-0 animate-pulse"
                            />
                          </div>
                          <p className="text-xs text-on-surface-variant/75 truncate font-normal">
                            {snippet.description || "No description provided"}
                          </p>
                        </div>
                      </div>

                      {/* Directory / tags */}
                      <div className="flex flex-wrap items-center gap-4 shrink-0 select-none">
                        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface-variant/70 text-[10px] font-bold rounded-lg border border-border-subtle">
                          <Folder size={11} className="text-[#6366f1]" />
                          <span className="truncate max-w-30">
                            {snippet.folder}
                          </span>
                        </div>

                        <div className="hidden sm:flex flex-wrap gap-1">
                          {snippet.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 bg-surface-container text-on-surface-variant/40 border border-border-subtle rounded text-[9px] font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        <span className="font-mono text-[10px] text-secondary font-bold bg-secondary/10 px-2.5 py-1 rounded border border-secondary/15">
                          {snippet.language}
                        </span>
                      </div>

                      {/* Row Tools Control */}
                      <div className="flex items-center gap-2 border-t border-border-subtle pt-3 md:pt-0 md:border-0 justify-end select-none">
                        <span className="text-[10px] font-mono text-on-surface-variant/40 mr-2">
                          Copies: {snippet.copyCount || 0}
                        </span>

                        <button
                          onClick={(e) => handleToggleFavorite(e, snippet.id)}
                          className="p-2 bg-surface-container border border-[#6366f1]/20 rounded-xl hover:border-[#6366f1]/50 text-[#6366f1] transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Heart
                            size={13}
                            fill="#6366f1"
                            className="stroke-[#6366f1]"
                          />
                        </button>
                        <button
                          onClick={(e) =>
                            handleCopy(e, snippet.id, snippet.code)
                          }
                          className="p-2 bg-surface-container-high border border-border-subtle rounded-xl hover:border-primary/35 text-on-surface-variant hover:text-primary transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
                        >
                          {copiedId === snippet.id ? (
                            <Check size={13} className="text-secondary" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/snippets/${snippet.id}/edit`);
                          }}
                          className="p-2 bg-surface-container-high border border-border-subtle rounded-xl hover:border-secondary/35 text-on-surface-variant hover:text-secondary transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Filtering zero state */}
              {favoriteSnippets.length > 0 &&
                filteredFavorites.length === 0 && (
                  <div className="w-full py-20 text-center border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center space-y-4 max-w-128 mx-auto mt-6 select-none">
                    <RotateCcw
                      size={36}
                      className="text-on-surface-variant/30 animate-spin"
                    />
                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-on-surface">
                        No matching favorites
                      </h3>
                      <p className="text-xs text-on-surface-variant/50 font-mono">
                        No VIP files matched your current filter criteria. Try
                        resetting parameter scopes.
                      </p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 bg-[#6366f1]/10 hover:bg-[#6366f1]/20 text-[10px] font-bold font-mono uppercase tracking-wider text-[#6366f1] border border-[#6366f1]/35 rounded-xl transition-all cursor-pointer"
                    >
                      Reset active parameters
                    </button>
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
