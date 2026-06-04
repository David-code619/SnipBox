"use client";
import React, { useState, useMemo } from "react";
import { mockSnippets } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Code2,
  Grid,
  List,
  Search,
  Filter,
  RotateCcw,
  Folder,
  Tag,
  Star,
  Copy,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Plus,
} from "lucide-react";

export default function AllSnippets() {
  const snippets = mockSnippets;
  const router = useRouter();

  // Internal visual filtering states
  const [search, setSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "copied" | "title-asc"
  >("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Floating copy tick highlights
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derive initial folders list
  const folders = useMemo(() => {
    const fMap: Record<string, number> = {};
    snippets.forEach((s) => {
      const folderName = s.folder || "Unsorted";
      fMap[folderName] = (fMap[folderName] || 0) + 1;
    });
    return Object.entries(fMap).map(([name, count]) => ({ name, count }));
  }, [snippets]);

  // Derive initial languages list
  const languages = useMemo(() => {
    const lMap: Record<string, number> = {};
    snippets.forEach((s) => {
      const langName = s.language || "Unknown";
      lMap[langName] = (lMap[langName] || 0) + 1;
    });
    return Object.entries(lMap).map(([name, count]) => ({ name, count }));
  }, [snippets]);

  // Derive initial tags list sorted by quantity
  const tags = useMemo(() => {
    const tMap: Record<string, number> = {};
    snippets.forEach((s) => {
      if (s.tags && Array.isArray(s.tags)) {
        s.tags.forEach((t) => {
          const cleaned = t.trim().toLowerCase();
          if (cleaned) {
            tMap[cleaned] = (tMap[cleaned] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(tMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [snippets]);

  // Filtering calculations with memoization
  const filteredSnippets = useMemo(() => {
    return snippets
      .filter((s) => {
        // Search text check
        const q = search.trim().toLowerCase();
        const matchesQuery = !q
          ? true
          : s.title.toLowerCase().includes(q) ||
            s.code.toLowerCase().includes(q) ||
            (s.description || "").toLowerCase().includes(q) ||
            (s.language || "").toLowerCase().includes(q) ||
            (s.folder || "").toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q));

        // Sidebar criteria check
        const matchesFolder =
          selectedFolder === "All"
            ? true
            : (s.folder || "Unsorted") === selectedFolder;
        const matchesLanguage =
          selectedLanguage === "All"
            ? true
            : (s.language || "Unknown") === selectedLanguage;
        const matchesTag =
          selectedTag === "All"
            ? true
            : s.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

        return matchesQuery && matchesFolder && matchesLanguage && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "latest") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
        if (sortBy === "oldest") {
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        }
        if (sortBy === "copied") {
          return (b.copyCount || 0) - (a.copyCount || 0);
        }
        if (sortBy === "title-asc") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [snippets, search, selectedFolder, selectedLanguage, selectedTag, sortBy]);

  // Reset helper
  const handleResetFilters = () => {
    setSearch("");
    setSelectedFolder("All");
    setSelectedLanguage("All");
    setSelectedTag("All");
    setSortBy("latest");
  };

  // Copy clip trigger
  const handleCopy = (e: React.MouseEvent, id: string, code: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);

    // Increment local counter inside context (mimicking database increment)
    const match = snippets.find((s) => s.id === id);
    if (match) {
      match.copyCount = (match.copyCount || 0) + 1;
    }
  };

  // Star Toggle
  const handleToggleFavorite = (
    e: React.MouseEvent,
    id: string,
    current: boolean | undefined,
  ) => {
    e.stopPropagation();
    // toggleFavorite(id);
  };

  // Delete Action with safeguard
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (
      confirm(
        "Are you absolutely sure you want to archive and delete this code snippet?",
      )
    ) {
      //   deleteSnippet(id);
    }
  };

  return (
    <div
      id="all_snippets_viewport"
      className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto h-screen flex flex-col overflow-hidden text-on-surface"
    >
      {/* 1. Header Information Column */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0 border-b border-border-subtle pb-6 select-none">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] font-bold uppercase tracking-wider">
            <Sparkles size={11} className="animate-pulse" />
            <span>CLOUDFILE SYNC ACTIVE</span>
          </div>
          <h1 className="font-display text-4xl font-extrabold text-on-surface tracking-tight leading-none mt-1">
            Archived Snippets
          </h1>
          <p className="text-on-surface-variant/75 text-sm">
            Maintain, edit, and access your high-fidelity curated repository of
            clean code fragments.
          </p>
        </div>

        {/* Rapid addition of a snippet */}
        <button
          onClick={() => router.push("/snippets/new")}
          className="px-5 py-3.5 bg-primary text-on-primary hover:bg-primary/95 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-[0_4px_16px_rgba(30,64,175,0.15)] active:scale-95 cursor-pointer"
        >
          <Plus size={16} className="stroke-3" />
          <span>New Code-Fragment</span>
        </button>
      </div>

      {/* 2. Unified Search / View Mode / Sorting Controller */}
      <div className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.02)] select-none">
        {/* Search box with cool interactive accent */}
        <div className="w-full md:w-96 relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, tags, folder, code..."
            className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface border border-border-subtle focus:border-primary/50 outline-none transition-all placeholder:text-on-surface-variant/55 leading-none"
          />
        </div>

        {/* Filters/Sort control bundle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Sorting Box */}
          <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-xl border border-border-subtle text-xs text-on-surface-variant/80">
            <span className="font-mono text-[10px] text-on-surface-variant/50 font-bold uppercase">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-on-surface font-semibold outline-none cursor-pointer focus:text-primary pr-1 border-none"
            >
              <option value="latest" className="bg-surface text-on-surface">
                Latest Update
              </option>
              <option value="oldest" className="bg-surface text-on-surface">
                Oldest First
              </option>
              <option value="copied" className="bg-surface text-on-surface">
                Most Copied
              </option>
              <option value="title-asc" className="bg-surface text-on-surface">
                Title (A-Z)
              </option>
            </select>
          </div>

          {/* View Selection (Grid / List toggle) */}
          <div className="bg-surface-container p-1 rounded-xl flex border border-border-subtle shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer",
                viewMode === "grid"
                  ? "bg-surface-container-high text-primary shadow-sm border border-border-subtle"
                  : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface",
              )}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer",
                viewMode === "list"
                  ? "bg-surface-container-high text-primary shadow-sm border border-border-subtle"
                  : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface",
              )}
              title="List View"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Outer Flex Layout: Categories Sidebar VS Dynamic Content Frame */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-0 select-none">
        {/* Left Side Custom Filter Segment */}
        <aside className="w-full lg:w-64 bg-surface border border-border-subtle rounded-2xl p-5 space-y-6 shrink-0 lg:self-start shadow-[0_4px_24px_rgba(0,0,0,0.02)] scrollbar-thin">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <Filter size={14} className="text-primary" />
              <span>Vault Navigation</span>
            </div>

            {(selectedFolder !== "All" ||
              selectedLanguage !== "All" ||
              selectedTag !== "All" ||
              search) && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold font-mono uppercase cursor-pointer"
              >
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Folder Category Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest font-mono">
              <Folder size={12} />
              <span>Archive Folders</span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedFolder("All")}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                  selectedFolder === "All"
                    ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                    : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                )}
              >
                <span>All Folders</span>
                <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/50">
                  {snippets.length}
                </span>
              </button>
              {folders.map((f) => (
                <button
                  key={f.name}
                  onClick={() => setSelectedFolder(f.name)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer",
                    selectedFolder === f.name
                      ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                      : "text-on-surface-variant/80 hover:bg-surface-dim hover:text-on-surface",
                  )}
                >
                  <span className="truncate pr-2">{f.name}</span>
                  <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/50">
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Languages select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest font-mono">
              <Code2 size={12} />
              <span>Language Filters</span>
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
                <span>All Languages</span>
                <span className="font-mono text-[9px] bg-surface-container-high px-1.5 py-0.5 rounded border border-border-subtle text-on-surface-variant/40">
                  {snippets.length}
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

          {/* Tags list */}
          {tags.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-border-subtle">
              <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest font-mono">
                <Tag size={11} />
                <span>Popular Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.2 max-h-27.5 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedTag("All")}
                  className={cn(
                    "px-2 py-0.8 rounded-lg text-[9px] font-mono transition-all border cursor-pointer",
                    selectedTag === "All"
                      ? "bg-tertiary/10 text-tertiary border border-tertiary/20 font-bold"
                      : "bg-surface-container text-on-surface-variant/70 border border-border-subtle hover:border-on-surface-variant hover:text-on-surface",
                  )}
                >
                  all tags
                </button>
                {tags.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setSelectedTag(t.name)}
                    className={cn(
                      "px-2 py-0.8 rounded-lg text-[9px] font-mono transition-all border cursor-pointer",
                      selectedTag === t.name
                        ? "bg-tertiary/10 text-tertiary border border-tertiary/20 font-bold"
                        : "bg-surface-container text-on-surface-variant/70 border border-border-subtle hover:border-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    #{t.name} ({t.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Dynamic List / Grid view of our code card metrics */}
        <div className="flex-1 w-full overflow-y-auto pb-24 min-h-0 pr-1 select-text">
          {/* Top layout metadata showing filtered count */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant/50 font-mono mb-4 px-1 select-none">
            <span>
              SHOWING {filteredSnippets.length} OF {snippets.length} SNIPPETS
            </span>
            {(selectedFolder !== "All" ||
              selectedLanguage !== "All" ||
              selectedTag !== "All" ||
              search) && (
              <span className="text-primary font-bold uppercase tracking-wider text-[10px]">
                Filtration parameters active
              </span>
            )}
          </div>

          {/* Render layout view mode: GRID */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSnippets.map((snippet, idx) => (
                <div
                  key={snippet.id}
                  onClick={() => router.push(`/snippets/${snippet.id}`)}
                  className="bg-surface rounded-2xl border border-border-subtle overflow-hidden group hover:border-primary/40 transition-all duration-300 flex flex-col h-70 relative cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.01)]"
                >
                  {/* Top Bar of the Snippet Grid Card */}
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
                      {snippet.isFavorite && (
                        <Star
                          size={12}
                          fill="var(--color-accent-amber)"
                          className="stroke-accent-amber shrink-0 ml-1 animate-pulse"
                          title="Favorited snippet"
                        />
                      )}
                    </div>

                    {/* Floating trigger tools */}
                    <div className="flex items-center gap-1.5 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) =>
                          handleToggleFavorite(
                            e,
                            snippet.id,
                            snippet.isFavorite,
                          )
                        }
                        className={cn(
                          "p-1.5 bg-surface-container-high border rounded-lg transition-all cursor-pointer",
                          snippet.isFavorite
                            ? "border-accent-amber/40 text-accent-amber hover:border-accent-amber"
                            : "border-border-subtle text-on-surface-variant hover:text-accent-amber",
                        )}
                        title={
                          snippet.isFavorite
                            ? "Remove from favorites"
                            : "Mark as favorite"
                        }
                      >
                        <Star
                          size={12}
                          fill={
                            snippet.isFavorite
                              ? "var(--color-accent-amber)"
                              : "none"
                          }
                          className={
                            snippet.isFavorite ? "stroke-accent-amber" : ""
                          }
                        />
                      </button>
                      <button
                        onClick={(e) => handleCopy(e, snippet.id, snippet.code)}
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
                      <button
                        onClick={(e) => handleDelete(e, snippet.id)}
                        className="p-1.5 bg-surface-container-high border border-border-subtle rounded-lg hover:border-error/30 text-on-surface-variant hover:text-error transition-all cursor-pointer"
                        title="Archive code piece"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Core Preview Block code rendering area */}
                  <div className="p-4.5 font-mono bg-surface-container-lowest flex-1 overflow-hidden select-text relative">
                    <pre className="text-[10px] md:text-[11px] text-on-surface-variant/75 leading-relaxed overflow-hidden whitespace-pre font-mono">
                      {snippet.code.split("\n").slice(0, 7).join("\n") ||
                        "// Empty file content"}
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Footer Stats summary segment */}
                  <div className="px-4.5 py-3 border-t border-border-subtle bg-surface-container/50 flex flex-col gap-2 select-none">
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1 hover:overflow-x-auto h-5 overflow-hidden">
                      {snippet.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-surface-container-high hover:bg-surface-container border border-border-subtle transition-colors rounded text-[9px] font-mono text-on-surface-variant/70"
                        >
                          #{t}
                        </span>
                      ))}
                      {snippet.tags.length === 0 && (
                        <span className="text-[9px] font-mono text-on-surface-variant/30 italic">
                          no tags assigned
                        </span>
                      )}
                    </div>

                    {/* Meta specification area */}
                    <div className="flex items-center justify-between border-t border-border-subtle/50 pt-2 select-none">
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

          {/* Render layout view mode: LIST COMPACT */}
          {viewMode === "list" && (
            <div className="space-y-3">
              {filteredSnippets.map((snippet, idx) => (
                <div
                  key={snippet.id}
                  onClick={() => router.push(`/snippets/${snippet.id}`)}
                  className="bg-surface rounded-xl border border-border-subtle hover:border-primary/35 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 group cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                >
                  {/* Left Side elements: Name / Language / Folder */}
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
                        {snippet.isFavorite && (
                          <Star
                            size={12}
                            fill="var(--color-accent-amber)"
                            className="stroke-accent-amber shrink-0"
                            title="Favorited snippet"
                          />
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant/75 truncate font-normal">
                        {snippet.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  {/* Mid elements: Directory / Tags */}
                  <div className="flex flex-wrap items-center gap-4 shrink-0 select-none">
                    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container text-on-surface-variant/70 text-[10px] font-bold rounded-lg border border-border-subtle">
                      <Folder size={11} className="text-primary" />
                      <span className="truncate max-w-30">
                        {snippet.folder}
                      </span>
                    </div>

                    <div className="hidden sm:flex flex-wrap gap-1">
                      {snippet.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-surface-container border border-border-subtle text-on-surface-variant/60 rounded text-[9px] font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span className="font-mono text-[10px] text-secondary font-bold bg-secondary/10 px-2.5 py-1 rounded border border-secondary/15">
                      {snippet.language}
                    </span>
                  </div>

                  {/* Right compact actions drawer click panel */}
                  <div className="flex items-center gap-2 border-t border-border-subtle pt-3 md:pt-0 md:border-0 justify-end select-none">
                    <span className="text-[10px] font-mono text-on-surface-variant/40 mr-2">
                      Copies: {snippet.copyCount || 0}
                    </span>

                    <button
                      onClick={(e) =>
                        handleToggleFavorite(e, snippet.id, snippet.isFavorite)
                      }
                      className={cn(
                        "p-2 border rounded-xl transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer",
                        snippet.isFavorite
                          ? "border-accent-amber/40 text-accent-amber hover:border-accent-amber"
                          : "border-border-subtle text-on-surface-variant hover:text-accent-amber",
                      )}
                      title={
                        snippet.isFavorite
                          ? "Remove from favorites"
                          : "Mark as favorite"
                      }
                    >
                      <Star
                        size={13}
                        fill={
                          snippet.isFavorite
                            ? "var(--color-accent-amber)"
                            : "none"
                        }
                        className={
                          snippet.isFavorite ? "stroke-accent-amber" : ""
                        }
                      />
                    </button>

                    <button
                      onClick={(e) => handleCopy(e, snippet.id, snippet.code)}
                      className="p-2 bg-surface-container-high border border-border-subtle rounded-xl hover:border-primary/30 text-on-surface-variant hover:text-primary transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
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
                      className="p-2 bg-surface-container-high border border-border-subtle rounded-xl hover:border-secondary/30 text-on-surface-variant hover:text-secondary transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, snippet.id)}
                      className="p-2 bg-surface-container-high border border-border-subtle rounded-xl hover:border-error/30 text-on-surface-variant hover:text-error transition-all flex items-center justify-center h-8.5 w-8.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rendering empty/zero states if snippets don't match criteria */}
          {filteredSnippets.length === 0 && (
            <div className="w-full py-20 text-center border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center space-y-4 max-w-128 mx-auto mt-6 select-none">
              <SlidersHorizontal
                size={40}
                className="text-on-surface-variant/30 animate-pulse"
              />
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-on-surface">
                  Curated archive empty
                </h3>
                <p className="text-xs text-on-surface-variant/50 font-mono">
                  No snippets found matching your precise filtration criteria
                  inside this workspace.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 hover:bg-surface-container text-[10px] font-bold font-mono uppercase tracking-wider text-primary border border-primary/30 hover:border-primary rounded-xl transition-all cursor-pointer"
                >
                  Clear all parameters
                </button>
                <button
                  onClick={() => router.push("/snippets/new")}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-[10px] font-bold font-mono uppercase tracking-wider text-on-primary rounded-xl transition-all shadow-[0_4px_12px_rgba(30,64,175,0.1)] cursor-pointer"
                >
                  Create New Segment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
