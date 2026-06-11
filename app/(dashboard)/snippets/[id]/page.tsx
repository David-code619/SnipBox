"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockSnippets } from "@/lib/constants";
import {
  ArrowLeft,
  Edit2,
  Share2,
  Star,
  Trash2,
  Copy,
  Check,
  FolderOpen,
  TrendingUp,
  Code2,
  Calendar,
  ShieldCheck,
  Cpu,
  ChevronRight,
  AlignLeft,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";

// Map UI languages to Monaco Editor supported language strings
const mapLanguage = (lang: string) => {
  switch (lang) {
    case "Tailwind CSS":
      return "javascript";
    case "TypeScript":
      return "typescript";
    case "JavaScript":
      return "javascript";
    case "CSS":
      return "css";
    case "Python":
      return "python";
    default:
      return "javascript";
  }
};

const handleEditorBeforeMount = (monaco: any) => {
  monaco.editor.defineTheme("snippetvault-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#07090d",
    },
  });
  monaco.editor.defineTheme("snippetvault-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#ffffff",
    },
  });
};

export default function SnippetDetails() {
  const { id } = useParams<{ id: string }>();
  const snippets = mockSnippets;
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const snippet = snippets.find((s) => s.id === id);

  if (!snippet) {
    return (
      <div className="p-8 text-center bg-workspace-bg min-h-screen flex flex-col items-center justify-center text-on-surface">
        <div className="w-16 h-16 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center text-error mb-4">
          <Code2 size={28} />
        </div>
        <h2 className="text-xl font-bold font-display text-on-surface mb-2">
          Snippet not found
        </h2>
        <p className="text-on-surface-variant/60 text-sm max-w-xs mb-6">
          The code block you&apos;re trying to retrieve doesn&apos;t exist or
          has been archived.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-on-primary px-5 py-3 rounded-xl font-sans text-xs font-bold hover:brightness-110 transition-all shadow-[0_4px_16px_rgba(30,64,175,0.15)] cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    // Increment copy count locally for realism
    // updateSnippet(snippet.id, { copyCount: (snippet.copyCount || 0) + 1 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = () => {
    // updateSnippet(snippet.id, { isFavorite: !snippet.isFavorite });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Do you really want to permanently archive this code segment inside SnippetVault?",
      )
    ) {
      //   deleteSnippet(snippet.id);
      router.push("/snippets");
    }
  };

  const isFavorite = !!snippet.isFavorite;

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2500);
  };

  const formattedFilename = snippet.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const fileExt =
    snippet.language === "Tailwind CSS" || snippet.language === "CSS"
      ? "js"
      : snippet.language === "TypeScript"
        ? "ts"
        : snippet.language === "Python"
          ? "py"
          : "js";

  return (
    <div className="flex flex-col h-screen bg-workspace-bg select-none text-on-surface">
      {/* 1. Glassmorphic Immersive Navigation Header */}
      <header className="bg-header-bg/95 backdrop-blur-xl border-b border-border-subtle flex justify-between items-center w-full px-6 md:px-8 h-20 shrink-0 z-30">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => router.push("/snippets")}
            className="hover:bg-surface-container p-2.5 rounded-xl transition-all border border-border-subtle flex items-center justify-center text-on-surface active:scale-95 cursor-pointer"
            title="Go back to all snippets"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="min-w-0">
            {/* Breadcrumb row */}
            <div className="flex items-center gap-1.5 text-on-surface-variant/50 font-mono text-[10px] uppercase tracking-wider font-bold">
              <span>Vault</span>
              <ChevronRight size={10} />
              <FolderOpen size={10} className="text-primary" />
              <span className="truncate text-on-surface-variant/75">
                {snippet.folder}
              </span>
            </div>

            <h1 className="font-display text-xl md:text-2xl font-black text-on-surface truncate select-all mt-0.5 tracking-tight leading-none">
              {snippet.title}
            </h1>
          </div>
        </div>

        {/* Essential Action Controller Grid */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface border border-border-subtle rounded-xl p-1 shadow-sm">
            <button
              onClick={() => router.push(`/snippets/${snippet.id}/edit`)}
              className="px-3.5 py-2 hover:bg-surface-dim rounded-lg transition-all flex items-center gap-2 text-on-surface hover:text-primary font-mono text-xs font-semibold cursor-pointer"
              title="Edit code schema"
            >
              <Edit2 size={13} className="text-primary" />
              <span className="hidden md:inline">Edit</span>
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 hover:bg-surface-dim rounded-lg transition-all flex items-center gap-2 text-on-surface hover:text-primary font-mono text-xs font-semibold cursor-pointer"
                title="Copy share link"
              >
                <Share2 size={13} className="text-on-surface-variant" />
                <span className="hidden md:inline">Share</span>
              </button>
              {showShareTooltip && (
                <div className="absolute right-0 bottom-full mb-2 bg-secondary text-on-secondary font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-lg border border-secondary/20 z-50 whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </div>

            <button
              onClick={handleToggleFavorite}
              className={cn(
                "px-3.5 py-2 hover:bg-surface-dim rounded-lg transition-all flex items-center gap-2 font-mono text-xs font-semibold cursor-pointer",
                isFavorite ? "text-accent-amber" : "text-on-surface",
              )}
              title={isFavorite ? "Remove favorite" : "Mark as favorite"}
            >
              <Star
                size={13}
                fill={isFavorite ? "var(--color-accent-amber)" : "none"}
                className={
                  isFavorite
                    ? "stroke-accent-amber animate-pulse"
                    : "text-on-surface-variant"
                }
              />
              <span className="hidden md:inline">Favorite</span>
            </button>

            <div className="w-px h-6 bg-border-subtle mx-1.5 hidden md:block"></div>

            <button
              onClick={handleDelete}
              className="p-2 hover:bg-error/10 text-error hover:text-error rounded-lg transition-all cursor-pointer"
              title="Archive this snippet"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main High-Fidelity 2-Column Dashboard Workspace */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 pb-20">
          {/* LEFT LARGE COMPILER WINDOW AND IDE (9 Cols) */}
          <div className="xl:col-span-9 space-y-6">
            {/* Elegant IDE Terminal Layout Window */}
            <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col relative group">
              {/* Window Head Bar */}
              <div className="bg-surface-container px-5 py-3.5 flex justify-between items-center border-b border-border-subtle">
                <div className="flex items-center gap-4">
                  {/* Window Dot Indicators */}
                  <div className="flex gap-1.5 select-none font-sans">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>

                  {/* Filename and workspace path */}
                  <div className="flex items-center gap-1.5 font-mono text-xs text-on-surface">
                    <Code2 size={13} className="text-primary" />
                    <span className="font-bold">
                      {formattedFilename}.config.{fileExt}
                    </span>
                  </div>
                </div>

                {/* Auxiliary Window Control Tags */}
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded font-mono text-[9px] uppercase font-bold tracking-wider">
                    {snippet.language}
                  </span>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high border border-border-subtle rounded-lg text-xs font-mono text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all font-bold cursor-pointer active:scale-95"
                    title="Copy standard text output"
                  >
                    {copied ? (
                      <Check size={12} className="text-secondary" />
                    ) : (
                      <Copy size={12} />
                    )}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Rendering Code Canvas with Monaco Editor */}
              <div className="w-full h-137.5 border-t border-border-subtle/50">
                <Editor
                  height="100%"
                  language={mapLanguage(snippet.language)}
                  theme="snippetvault-dark"
                  value={snippet.code}
                  beforeMount={handleEditorBeforeMount}
                  options={{
                    minimap: { enabled: false },
                    readOnly: true,
                    domReadOnly: true,
                    fontSize: 13,
                    fontFamily:
                      '"Fira Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    contextmenu: false,
                    quickSuggestions: false,
                    parameterHints: { enabled: false },
                    suggestOnTriggerCharacters: false,
                    snippetSuggestions: "none",
                    wordBasedSuggestions: "none",
                    links: false,
                    colorDecorators: false,
                    folding: true,
                    glyphMargin: false,
                    lineDecoratorsWidth: 0,
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "visible",
                    },
                  }}
                  loading={
                    <div className="flex items-center justify-center h-full gap-2 text-xs font-mono text-on-surface-variant/50">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      <span>Initializing Monaco IDE...</span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Description Card Layout underneath */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 select-text shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="flex items-center gap-2 mb-4 text-on-surface">
                <AlignLeft size={15} className="text-primary" />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                  Functional Description
                </h3>
              </div>
              <p className="text-on-surface-variant/80 leading-relaxed text-sm select-all whitespace-pre-wrap font-normal">
                {snippet.description ||
                  "No explicit architectural documentation has been configured for this code file fragment. Add clarification by selecting the Edit segment in the navigation utility bar above."}
              </p>
            </div>
          </div>

          {/* RIGHT SIDEBAR INFORMATION DASHBOARD (3 Cols) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Metadata container panel */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-5 divide-y divide-border-subtle/50 space-y-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              {/* Vault telemetry indicators */}
              <div className="pb-1">
                <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest font-black mb-4">
                  <Cpu size={12} className="text-primary" />
                  <span>Telemetry Analytics</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/75">
                      Registry Date
                    </span>
                    <span className="text-on-surface font-mono font-bold flex items-center gap-1">
                      <Calendar
                        size={11}
                        className="text-on-surface-variant/30"
                      />
                      {new Date(snippet.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/75">
                      Local Status
                    </span>
                    <span className="text-secondary font-mono font-bold bg-secondary/10 px-2 py-0.5 rounded border border-secondary/25 uppercase text-[9px] tracking-wider flex items-center gap-1">
                      <ShieldCheck size={10} />
                      Synced
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant/75">
                      Utilization Index
                    </span>
                    <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                      <span className="text-primary font-bold font-mono">
                        {snippet.copyCount || 0}
                      </span>
                      <TrendingUp size={11} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorization elements */}
              <div className="py-4">
                <label className="block text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest font-black mb-3">
                  Vault Folder Scope
                </label>
                <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/25 p-2.5 rounded-xl hover:underline cursor-pointer transition-all">
                  <FolderOpen size={13} className="text-primary" />
                  <span className="truncate">{snippet.folder}</span>
                </div>
              </div>

              {/* Dynamic tag badges */}
              <div className="pt-4">
                <label className="block text-[10px] font-mono text-on-surface-variant/50 uppercase tracking-widest font-black mb-3">
                  Scope Flags / Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {snippet.tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => router.push("/snippets")}
                      className="px-2.5 py-1 bg-surface-container border border-border-subtle hover:border-primary/30 text-on-surface-variant/80 rounded-lg text-[10px] font-mono lowercase transition-colors cursor-pointer"
                    >
                      #{t}
                    </span>
                  ))}
                  {snippet.tags.length === 0 && (
                    <span className="text-[10px] text-on-surface-variant/40 font-mono italic">
                      No flags assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
