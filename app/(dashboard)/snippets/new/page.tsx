"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileCode,
  Check,
  Copy,
  Sparkles,
  Folder,
  Tag,
  ArrowLeft,
  Code2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { mockSnippets } from "@/lib/constants";
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

// Monaco custom theme mounts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEditorBeforeMount = (monaco: any) => {
  monaco.editor.defineTheme("ocean-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#07090d",
    },
  });
  monaco.editor.defineTheme("matrix-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "3bf093" },
      { token: "keyword", foreground: "0ede90", fontStyle: "bold" },
      { token: "string", foreground: "00ff8e" },
      { token: "comment", foreground: "006000", fontStyle: "italic" },
    ],
    colors: {
      "editor.background": "#030604",
      "editor.foreground": "#3bf093",
      "editorLineNumber.foreground": "#0ede9040",
      "editorLineNumber.activeForeground": "#0ede90",
    },
  });
  monaco.editor.defineTheme("dracula-theme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "type", foreground: "10b981" },
      { token: "class", foreground: "50fa7b" },
      { token: "function", foreground: "50fa7b" },
    ],
    colors: {
      "editor.background": "#0a080d",
      "editorLineNumber.foreground": "#6272a4",
      "editorLineNumber.activeForeground": "#ff79c6",
    },
  });
};

// Premium high-quality boilerplates for first-class starting experience
const LANGUAGE_TEMPLATES: Record<string, string> = {
  "Tailwind CSS": `module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        cyber: {
          green: '#00ef9d',
          gold: '#ffd000',
          blue: '#7ca1ff'
        }
      }
    },
    spacing: {
      '128': '32rem',
    }
  },
  plugins: [],
}`,
  TypeScript: `import { NextRequest, NextResponse } from 'next/server';

interface SyncPayload {
  vaultId: string;
  checksum: string;
  syncTimestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const payload: SyncPayload = await request.json();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'strict';

    return NextResponse.json({
      success: true,
      timestamp: Date.now(),
      mode,
      payload,
      status: 'active_sync'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Compilation Sync Error' },
      { status: 500 }
    );
  }
}`,
  CSS: `@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui;
  --font-display: "Space Grotesk", sans-serif;
  --color-workspace: #07090d;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.bento-card {
  background: rgba(11, 14, 20, 0.6);
  border: 1px solid rgba(45, 48, 59, 0.4);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -10px rgba(124, 161, 255, 0.2);
}`,
  JavaScript: `// Real-time animation loop for canvas rendering
export function initiateRenderLoop(canvasId, frameCallback) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  
  const loop = () => {
    frameCallback(ctx);
    animationFrameId = requestAnimationFrame(loop);
  };
  
  loop();
  
  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}`,
  Python: `import json
import hashlib

def generate_checksum(payload_dict: dict) -> str:
    """Computes a secure SHA-256 hash representation of static configuration dictionaries."""
    serialized = json.dumps(payload_dict, sort_keys=True).encode('utf-8')
    return hashlib.sha256(serialized).hexdigest()
`,
};

export default function NewSnippet() {
//   const {
//     addSnippet,
//     folders: contextFolders,
//     addFolder,
//   } = useSnippets();
  const snippets = mockSnippets;
  const router = useRouter();

  const [title, setTitle] = useState("Tailwind Config Extension");
  const [description, setDescription] = useState(
    "Quick configuration for expanding a project's color palette and typography hierarchy using Fluid Design Principles.",
  );
  const [code, setCode] = useState(LANGUAGE_TEMPLATES["Tailwind CSS"] || "");
  const [folder, setFolder] = useState("Frontend Frameworks");
  const [language, setLanguage] = useState("Tailwind CSS");
  const [tags, setTags] = useState<string[]>([
    "tailwind",
    "config",
    "framework",
  ]);
  const [newTag, setNewTag] = useState("");
  const [copied, setCopied] = useState(false);
  const [themeMode, setThemeMode] = useState<"default" | "matrix" | "dracula">(
    "default",
  );
  const [isCustomFolder, setIsCustomFolder] = useState(false);

  const existingFolders = useMemo(() => {
    const foldersSet = new Set<string>(["Frontend Frameworks", "Backend", "Utilities"]);
    snippets.forEach((s) => {
      if (s.folder) foldersSet.add(s.folder);
    });
    return Array.from(foldersSet);
  }, [snippets]);

  // Auto-fill template when selected language changes
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(LANGUAGE_TEMPLATES[newLanguage] || "");
  };

  const handleSave = () => {
    if (!title.trim() || !code.trim()) return;

    const targetFolder = folder.trim() || "Unsorted";
    
    // TODO: Use real addFolder and addSnippet from context when backend is ready
    // For now, just log the data
    console.log({
      title,
      description,
      code,
      folder: targetFolder,
      language,
      tags,
    });
    
    router.push("/snippets");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      const cleanTag = newTag.trim().toLowerCase().replace(/#/g, "");
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setNewTag("");
      }
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  // Format file name preview
  const getDisplayFilename = () => {
    const formattedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const ext =
      language === "Tailwind CSS" || language === "CSS"
        ? "js"
        : language === "TypeScript"
          ? "ts"
          : language === "Python"
            ? "py"
            : "js";
    return `${formattedTitle || "config"}.config.${ext}`;
  };

  const editorTheme =
    themeMode === "default"
      ? "ocean-theme"
      : themeMode === "matrix"
        ? "matrix-theme"
        : "dracula-theme";

  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      fontSize: 13,
      fontFamily:
        '"Fira Code", "JetBrains Mono", Menlo, Monaco, Consolas, monospace',
      lineNumbers: "on" as const,
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      automaticLayout: true,
      padding: { top: 12, bottom: 12 },
      cursorBlinking: "smooth" as const,
      cursorSmoothCaretAnimation: "on" as const,
    }),
    [],
  );

  return (
    <div className="flex flex-col h-full bg-[#07090d] select-none min-h-screen text-[#eceff4]">
      {/* 1. Immersive Glass Header Bar */}
      <header className="bg-workspace-bg/95 backdrop-blur-xl border-b border-[#2d303b]/40 flex justify-between items-center w-full px-6 md:px-8 h-20 shrink-0 z-30 select-none">
        {/* Title & Icon Part */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/snippets")}
            className="hover:bg-[#181c26] p-2.5 rounded-xl transition-all border border-[#2d303b]/30 flex items-center justify-center text-on-surface active:scale-95 cursor-pointer"
            title="Go back to list"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7ca1ff]/10 border border-[#7ca1ff]/20 flex items-center justify-center text-[#7ca1ff]">
              <FileCode size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold">
                Workspace compiler
              </span>
              <h1 className="font-display text-lg md:text-xl font-bold text-[#eceff4] tracking-tight">
                Create New Snippet
              </h1>
            </div>
          </div>
        </div>

        {/* Buttons / Actions Block */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/snippets")}
            className="px-4.5 py-2.5 border border-[#2d303b] hover:bg-[#181c26] rounded-xl transition-all text-[#eceff4]/80 text-xs font-semibold h-11 flex items-center justify-center active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !code.trim()}
            className="px-5 py-2.5 bg-[#7ca1ff] hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-workspace-bg font-sans font-bold text-xs rounded-xl transition-all h-11 flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(124,161,255,0.15)] active:scale-95 cursor-pointer"
          >
            <Check size={14} className="stroke-3" />
            <span>Save Workspace</span>
          </button>
        </div>
      </header>

      {/* 2. Interactive Bento Form Canvas */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 pb-20">
          {/* LEFT COLUMN: Input form parameter controls */}
          <div className="xl:col-span-9 space-y-6">
            {/* Title field input block with glowing focus accent */}
            <div className="space-y-1 bg-[#0b0e14]/30 border border-[#2d303b]/30 rounded-2xl p-4.5 focus-within:border-[#7ca1ff]/40 focus-within:bg-[#0b0e14]/50 transition-all">
              <label className="block font-mono text-[9px] text-[#7ca1ff] uppercase tracking-widest font-black select-none mb-1">
                Fragment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-none text-on-surface leading-normal text-2xl font-black font-display placeholder:text-on-surface-variant/20 px-0 focus:ring-0 outline-none"
                placeholder="Name your premium configuration..."
              />
            </div>

            {/* Split controls row: Folder Select & Language Pick */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b0e14]/30 border border-[#2d303b]/30 rounded-2xl p-4.5 focus-within:border-[#7ca1ff]/30 transition-all select-none">
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-widest font-black select-none">
                    Category Folder Scope
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const mode = !isCustomFolder;
                      setIsCustomFolder(mode);
                      if (mode) {
                        setFolder("");
                      } else {
                        setFolder("Frontend Frameworks");
                      }
                    }}
                    className="text-[10px] font-mono text-[#7ca1ff] hover:underline font-bold focus:outline-none cursor-pointer"
                  >
                    {isCustomFolder ? "Select Folder" : "+ Custom Folder"}
                  </button>
                </div>

                {isCustomFolder ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      placeholder="Type related folder name..."
                      className="w-full bg-[#13161c] border border-primary/50 hover:border-primary/70 rounded-xl px-4 py-3 font-semibold text-xs text-on-surface outline-none focus:border-[#7ca1ff]/70 transition-all"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40">
                      <Folder size={11} className="text-[#7ca1ff]" />
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={folder}
                      onChange={(e) => setFolder(e.target.value)}
                      className="w-full bg-[#13161c] border border-[#2d303b]/60 hover:border-primary/20 rounded-xl px-4 py-3 font-semibold text-xs text-on-surface outline-none cursor-pointer focus:border-[#7ca1ff]/40 [&>option]:bg-[#13161c] appearance-none"
                    >
                      {existingFolders.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40 flex items-center gap-1.5 font-mono text-[80%]">
                      <Folder size={11} className="text-[#7ca1ff]" />
                      <span>▼</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[#0b0e14]/30 border border-[#2d303b]/30 rounded-2xl p-4.5 focus-within:border-[#7ca1ff]/30 transition-all">
                <label className="block font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-widest font-black select-none mb-2">
                  Language Interpreter
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full bg-[#13161c] border border-[#2d303b]/60 hover:border-primary/20 rounded-xl px-4 py-3 font-semibold text-xs text-on-surface outline-none cursor-pointer focus:border-[#7ca1ff]/40 [&>option]:bg-[#13161c] appearance-none"
                  >
                    <option>Tailwind CSS</option>
                    <option>TypeScript</option>
                    <option>JavaScript</option>
                    <option>CSS</option>
                    <option>Python</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/40 flex items-center gap-1.5 font-mono text-[80%]">
                    <Code2 size={11} className="text-[#0ede90]" />
                    <span>▼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comprehensive Editor Box Canvas */}
            <div className="bg-surface-container-lowest border border-[#2d303b]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative">
              {/* Box Topbar Styled */}
              <div className="bg-[#12141c]/80 px-5 py-3.5 flex justify-between items-center border-b border-[#2d303b]/40 select-none">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 select-none">
                    <div className="w-3 h-3 rounded-full bg-error/70" />
                    <div className="w-3 h-3 rounded-full bg-tertiary" />
                    <div className="w-3 h-3 rounded-full bg-[#0ede90]" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#eceff4]/80">
                    <span className="text-[#7ca1ff] font-bold">&lt;&gt;</span>
                    <span>{getDisplayFilename()}</span>
                  </div>
                </div>

                {/* Theme presets picker & Action buttons */}
                <div className="flex items-center gap-4">
                  {/* Theme Presets */}
                  <div className="flex items-center gap-1.5 bg-[#171a24] p-1 rounded-lg border border-[#2d303b]/50">
                    <button
                      onClick={() => setThemeMode("default")}
                      className={cn(
                        "w-4 h-4 rounded-full border transition-all cursor-pointer",
                        themeMode === "default"
                          ? "border-[#7ca1ff] scale-110 bg-[#7ca1ff]/40"
                          : "border-transparent bg-[#7ca1ff]/10 hover:opacity-85",
                      )}
                      title="Cobalt Ocean Theme"
                    />
                    <button
                      onClick={() => setThemeMode("matrix")}
                      className={cn(
                        "w-4 h-4 rounded-full border transition-all cursor-pointer",
                        themeMode === "matrix"
                          ? "border-[#0ede90] scale-110 bg-[#0ede90]/40"
                          : "border-transparent bg-[#0ede90]/10 hover:opacity-85",
                      )}
                      title="Matrix Green"
                    />
                    <button
                      onClick={() => setThemeMode("dracula")}
                      className={cn(
                        "w-4 h-4 rounded-full border transition-all cursor-pointer",
                        themeMode === "dracula"
                          ? "border-[#ff79c6] scale-110 bg-[#ff79c6]/40"
                          : "border-transparent bg-[#ff79c6]/10 hover:opacity-85",
                      )}
                      title="Dracula Purple"
                    />
                  </div>

                  <div className="w-px h-5 bg-[#2d303b]/40" />

                  <button
                    onClick={handleCopy}
                    disabled={!code.trim()}
                    className="px-3 py-1 hover:bg-[#181c26] border border-[#2d303b]/60 rounded-lg text-[#eceff4]/90 hover:text-[#7ca1ff] duration-150 font-mono text-[11px] font-bold flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <Check size={12} className="text-[#0ede90]" />
                    ) : (
                      <Copy size={12} />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* IDE Code Input Textarea columns */}
              <div
                className={cn(
                  "flex w-full border-t border-[#2d303b]/20 overflow-hidden transition-all duration-300",
                  themeMode === "default"
                    ? "bg-[#07090d]"
                    : themeMode === "matrix"
                      ? "bg-[#030604]"
                      : "bg-[#0a080d]",
                )}
                style={{ height: "450px" }}
              >
                <div className="flex-1 w-full h-full text-left">
                  <Editor
                    height="100%"
                    language={mapLanguage(language)}
                    theme={editorTheme}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    beforeMount={handleEditorBeforeMount}
                    options={editorOptions}
                    loading={
                      <div className="flex items-center justify-center h-full gap-2 text-xs font-mono text-on-surface-variant/50">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        <span>Initializing Monaco IDE...</span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Description Card Form text area */}
            <div className="bg-[#0b0e14]/30 border border-[#2d303b]/30 rounded-2xl p-5 focus-within:border-[#7ca1ff]/30 transition-all">
              <label className="block font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-widest font-black select-none mb-2.5">
                Descriptive Overview
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border-none text-[#eceff4]/80 leading-relaxed text-sm placeholder:text-on-surface-variant/20 outline-none focus:ring-0 p-0 resize-none min-h-22.5 select-text"
                placeholder="Incorporate design summaries, integration tokens, or dependencies notes..."
              />
            </div>
          </div>

          {/* RIGHT SIDE PANEL: Metadata, flags, tags controls */}
          <div className="xl:col-span-3 space-y-6">
            {/* Tag specification well box */}
            <div className="bg-[#0b0e14]/40 border border-[#2d303b]/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-1.5 text-on-surface-variant/30 text-[10px] uppercase font-mono tracking-wider font-extrabold select-none pb-2 border-b border-[#2d303b]/30">
                <Tag size={12} className="text-[#ffd000]" />
                <span>Scope Markers & Flags</span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-[#13161c] hover:bg-error/5 border border-[#2d303b] text-on-surface-variant/80 hover:text-error hover:border-error/20 px-2.5 py-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1.5 group transition-all"
                    >
                      <span>#{t}</span>
                      <button
                        onClick={() => removeTag(t)}
                        className="text-on-surface-variant/40 group-hover:text-error transition-colors font-sans font-bold select-none cursor-pointer"
                        title="Remove tag"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="text-[10px] text-on-surface-variant/30 font-mono italic">
                      No tags configured
                    </span>
                  )}
                </div>

                {/* Tag insertion search field */}
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full bg-[#13161c] border border-[#2d303b] hover:border-primary/20 rounded-xl px-3 py-2 font-mono text-[11px] text-on-surface placeholder:text-on-surface-variant/25 transition-all outline-none"
                  placeholder="Press Enter to add tags..."
                />
              </div>
            </div>

            {/* Automated Sync telemetry status indicators */}
            <div className="bg-[#0b0e14]/20 border border-[#2d303b]/30 rounded-2xl p-5 space-y-4 select-none">
              <span className="block font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-widest font-black">
                Compiler Status
              </span>

              <div className="space-y-3 text-xs leading-relaxed text-on-surface-variant/70">
                <div className="flex items-center gap-2 font-mono">
                  <div className="w-2 h-2 rounded-full bg-[#0ede90] animate-pulse" />
                  <span>Sandbox Engine Ready</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded-lg bg-[#7ca1ff]/5 border border-[#7ca1ff]/15 text-[#7ca1ff] shrink-0 mt-0.5">
                    <Sparkles size={12} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant/50">
                    Switching your code language automatically injects clean
                    boilerplates for faster configuration templates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
