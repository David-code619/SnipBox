"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { mockSnippets, snippetFolders } from "@/lib/constants";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  FolderPlus, 
  Check, 
  X, 
  AlertCircle,
  MoreVertical,
  Database,
  Code,
  LayoutGrid,
  List,
  Copy,
  ArrowRight,
} from 'lucide-react';

interface CollectionMeta {
  description: string;
  color: string;
}

const defaultMeta: Record<string, CollectionMeta> = {
  'Frontend Frameworks': {
    description: 'Framework-specific snippets, state providers, hydration patterns, and hooks.',
    color: 'blue'
  },
  'Configurations': {
    description: 'System config, compiler directives, script wrappers, and bundler presets.',
    color: 'slate'
  },
  'UI Components': {
    description: 'Collection of highly accessible, atomic, and responsive React elements styled with Tailwind.',
    color: 'green'
  },
  'Utility Hooks': {
    description: 'Reusable global helper functions, optimization triggers, and layout modifiers.',
    color: 'purple'
  },
  'Backend': {
    description: 'Server architectures, middleware handlers, database models, and cloud run routing.',
    color: 'rose'
  },
  'Auth Modules': {
    description: 'Reusable authentication logic including JWT, OAuth providers, MFA integrations, and route guards.',
    color: 'blue'
  },
  'SQL Queries': {
    description: 'Complex analytical queries, relational schemas, indexing scripts, and migrations for PostgreSQL.',
    color: 'amber'
  },
  'Data Analysis': {
    description: 'Python scripts, Jupyter snippets, and data parsing routines utilizing Pandas and NumPy.',
    color: 'blue'
  },
  'Shell Utils': {
    description: 'Bash and ZSH aliases, system maintenance routines, Docker macros, and deployment scripts.',
    color: 'slate'
  },
  'API Designs': {
    description: 'OpenAPI specs, controller patterns, routing configurations, and RESTful route designs.',
    color: 'rose'
  }
};

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', border: 'border-blue-500/25', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  { value: 'green', label: 'Green', border: 'border-emerald-500/25', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { value: 'amber', label: 'Amber', border: 'border-amber-500/25', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  { value: 'purple', label: 'Purple', border: 'border-purple-500/25', text: 'text-purple-400', bg: 'bg-purple-500/10' },
  { value: 'rose', label: 'Rose', border: 'border-rose-500/25', text: 'text-rose-400', bg: 'bg-rose-500/10' },
  { value: 'slate', label: 'Slate', border: 'border-slate-500/25', text: 'text-slate-400', bg: 'bg-slate-500/10' }
];

export default function Collections() {
  const snippets = mockSnippets;
  const contextFolders = snippetFolders;
  
  // Static for now, no mutations
  const addFolder = (folderName: string) => {};
  const deleteFolder = (folderName: string) => {};
  const updateSnippet = (id: string, data: any) => {};
  const router = useRouter();

  // Sort and layout view options representing the mockup
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'recent' | 'count'>('alpha');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Load custom folder metadata from local storage
  const [collectionsMeta, setCollectionsMeta] = useState<Record<string, CollectionMeta>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('snippetvault_collections_meta');
      return saved ? JSON.parse(saved) : defaultMeta;
    }
    return defaultMeta;
  });

  // Keep metadata in sync
  useEffect(() => {
    localStorage.setItem('snippetvault_collections_meta', JSON.stringify(collectionsMeta));
  }, [collectionsMeta]);

  // Folder creation interaction modal/overlay
  const [isAdding, setIsAdding] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [folderError, setFolderError] = useState('');

  // Dropdown options popup trigger state per folder
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Rename state
  const [editingCollectionName, setEditingCollectionName] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameDescValue, setRenameDescValue] = useState('');
  const [renameColorValue, setRenameColorValue] = useState('blue');
  const [renameError, setRenameError] = useState('');

  // Accordion in-place grid expansion states
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [innerSearchQuery, setInnerSearchQuery] = useState('');
  const [expandedSnippetId, setExpandedSnippetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Sync back empty folders inside the meta database (ensure defaults exist)
  const syncFolders = useMemo(() => {
    const customList = Array.from(new Set([...contextFolders, ...snippets.map(s => s.folder || 'Unsorted')]));
    return customList;
  }, [contextFolders, snippets]);

  // Derived collections view modeling
  const collectionsList = useMemo(() => {
    return syncFolders.map(fName => {
      const meta = collectionsMeta[fName] || {
        description: 'Logical namespace category containing code templates and system configs.',
        color: 'slate'
      };
      
      const categorySnippets = snippets.filter(s => (s.folder || 'Unsorted') === fName);
      
      // Determine technologies/languages inside collection
      const languages = Array.from(new Set(categorySnippets.map(s => s.language).filter(Boolean)));

      return {
        name: fName,
        description: meta.description,
        color: meta.color,
        count: categorySnippets.length,
        languages: languages.slice(0, 3), // max 3 preview bubbles
        snippetIds: categorySnippets.map(s => s.id)
      };
    });
  }, [syncFolders, collectionsMeta, snippets]);

  // Sorting Handler
  const sortedCollections = useMemo(() => {
    const backup = [...collectionsList];
    if (sortBy === 'alpha') {
      return backup.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'recent') {
      return backup.sort((a, b) => b.count - a.count); // sort by loaded density
    } else if (sortBy === 'count') {
      return backup.sort((a, b) => b.count - a.count);
    }
    return backup;
  }, [collectionsList, sortBy]);

  // Filter with Search query
  const filteredCollections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return sortedCollections;
    return sortedCollections.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q)
    );
  }, [sortedCollections, searchQuery]);

  // Handle addition
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    // Static mode: disabled folder creation logic
    /*
    const name = newFolderName.trim();
    if (!name) {
      setFolderError('Collection title is required');
      return;
    }
    if (name.toLowerCase() === 'all' || name.toLowerCase() === 'unsorted') {
      setFolderError('This name is reserved by the system');
      return;
    }
    if (syncFolders.some(f => f.toLowerCase() === name.toLowerCase())) {
      setFolderError('This name is already used by another collection');
      return;
    }

    // Add folder to Context list
    addFolder(name);
    // Add custom metadata
    setCollectionsMeta(prev => ({
      ...prev,
      [name]: {
        description: newFolderDesc.trim() || 'Custom curated snippet and code assets archive.',
        color: newFolderColor
      }
    }));

    // Reset fields
    setNewFolderName('');
    setNewFolderDesc('');
    setNewFolderColor('blue');
    setFolderError('');
    */
    setIsAdding(false);
  };

  // Handle renaming & meta updating
  const handleUpdateCollection = (e: React.FormEvent, oldName: string) => {
    e.preventDefault();
    // Static mode: disabled folder renaming logic
    /*
    const freshName = renameValue.trim();
    if (!freshName) {
      setRenameError('Collection title is required');
      return;
    }
    if (freshName.toLowerCase() === 'all' || freshName.toLowerCase() === 'unsorted') {
      setRenameError('Reserved name');
      return;
    }
    if (freshName.toLowerCase() !== oldName.toLowerCase() && syncFolders.some(f => f.toLowerCase() === freshName.toLowerCase())) {
      setRenameError('Another collection features this same title');
      return;
    }

    // If name changed, we update all snippets in this folder container
    if (freshName.toLowerCase() !== oldName.toLowerCase()) {
      addFolder(freshName);
      const linkedSnippets = snippets.filter(s => (s.folder || 'Unsorted') === oldName);
      linkedSnippets.forEach(s => {
        updateSnippet(s.id, { folder: freshName });
      });
      deleteFolder(oldName);
      if (expandedFolder === oldName) {
        setExpandedFolder(freshName);
      }
    }

    // Update the description and color metadata map
    setCollectionsMeta(prev => {
      const copy = { ...prev };
      delete copy[oldName];
      copy[freshName] = {
        description: renameDescValue.trim() || 'Custom curated snippet and code assets archive.',
        color: renameColorValue
      };
      return copy;
    });

    setRenameValue('');
    setRenameDescValue('');
    setRenameError('');
    */
    setEditingCollectionName(null);
  };

  // Get Styling values for card items
  const getColorClasses = (colorName: string) => {
    const opt = COLOR_OPTIONS.find(o => o.value === colorName) || COLOR_OPTIONS[5];
    return {
      bg: opt.bg,
      text: opt.text,
      border: opt.border
    };
  };

  // Map simple technology indicators
  const getLanguageTagDot = (lang: string) => {
    const clean = lang.trim().toLowerCase();
    if (clean.includes('typescript') || clean.includes('ts')) {
      return { label: 'TS', bg: 'bg-[#007acc]/10', text: 'text-[#3178c6]' };
    }
    if (clean.includes('javascript') || clean.includes('js')) {
      return { label: 'JS', bg: 'bg-[#f7df1e]/10', text: 'text-[#f1c40f]' };
    }
    if (clean.includes('css')) {
      return { label: 'CSS', bg: 'bg-[#264de4]/10', text: 'text-[#2980b9]' };
    }
    if (clean.includes('python')) {
      return { label: 'PY', bg: 'bg-[#3776ab]/10', text: 'text-[#4584b6]' };
    }
    if (clean.includes('shell') || clean.includes('bash') || clean.includes('sh')) {
      return { label: 'SH', bg: 'bg-[#4eedac]/10', text: 'text-[#2ecc71]' };
    }
    if (clean.includes('sql') || clean.includes('database')) {
      return { label: 'DB', bg: 'bg-[#e38c00]/10', text: 'text-[#e67e22]' };
    }
    return { label: lang.slice(0, 3).toUpperCase(), bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' };
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8 animate-fade-in relative">
      
      {/* Search Header row */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-secondary" />
            <span className="font-mono text-[10px] font-bold text-primary/80 uppercase tracking-widest bg-primary/8 px-2.5 py-1 rounded-full border border-primary/10">Workspace</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Your Collections
          </h2>
          <p className="text-sm text-on-surface-variant/60 mt-1.5 leading-relaxed max-w-lg">
            Curate, organize, and browse your snippet libraries — grouped by project, language, or workflow.
          </p>
        </div>

        {/* Filters and sorting alignment */}
        <div className="flex items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center bg-surface-container border border-border-subtle rounded-xl px-2.5 py-1 text-xs select-none min-w-40">
            <span className="text-on-surface-variant/50 mr-1.5 font-mono text-[10px] font-bold uppercase">Sort:</span>
            <select 
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs text-on-surface font-semibold focus:outline-none cursor-pointer flex-1 py-1"
            >
              <option value="alpha">Alphabetical</option>
              <option value="count">Count (Density)</option>
            </select>
          </div>

          {/* Grid/List selector */}
          <div className="bg-surface-container p-1 rounded-xl flex border border-border-subtle shrink-0">
            <button 
              onClick={() => setViewLayout('grid')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer", 
                viewLayout === 'grid' 
                  ? "bg-surface-container-high text-primary shadow-sm border border-border-subtle" 
                  : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface"
              )}
              title="Grid layout view"
            >
              <LayoutGrid size={15} />
            </button>
            <button 
              onClick={() => setViewLayout('list')}
              className={cn(
                "p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer", 
                viewLayout === 'list' 
                  ? "bg-surface-container-high text-primary shadow-sm border border-border-subtle" 
                  : "hover:bg-surface-container-high/50 text-on-surface-variant/60 hover:text-on-surface"
              )}
              title="List details layout view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border-subtle to-transparent -mt-2 mb-2" />

      {/* Main Grid or List of collection cards */}
      <div className={cn(viewLayout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start" : "flex flex-col gap-3 w-full")}>
        
        {/* Mockup Dashboard Create Collection Card (Supported in both Grid & List layout) */}
        {viewLayout === 'grid' ? (
          <div 
            onClick={() => {
              setNewFolderName('');
              setNewFolderDesc('');
              setNewFolderColor('blue');
              setFolderError('');
              setIsAdding(true);
            }}
            className="border-2 border-dashed border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center h-[280px] bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/40 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-surface-container border border-border-subtle text-on-surface-variant/60 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all duration-300 shadow-sm mb-4">
              <FolderPlus size={20} className="stroke-[1.75]" />
            </div>
            <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
              Create Collection
            </h3>
            <p className="text-[11px] text-on-surface-variant/40 mt-1 max-w-45 text-center leading-relaxed">
              Organize by project or language
            </p>
          </div>
        ) : (
          <div 
            onClick={() => {
              setNewFolderName('');
              setNewFolderDesc('');
              setNewFolderColor('blue');
              setFolderError('');
              setIsAdding(true);
            }}
            className="border-2 border-dashed border-border-subtle rounded-xl p-4 flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/40 transition-all duration-300 group cursor-pointer gap-4 w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-container border border-border-subtle text-on-surface-variant/60 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all duration-300 shadow-sm">
                <FolderPlus size={18} className="stroke-[1.75]" />
              </div>
              <div className="text-left">
                <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  Create Collection
                </h3>
                <p className="text-[11px] text-on-surface-variant/40 leading-relaxed hidden sm:block mt-0.5">
                  Organize by project or language
                </p>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-primary/70 group-hover:text-primary transition-colors pr-2">
              + Add New Directory
            </div>
          </div>
        )}

        {/* Existing Collections rendering mapping loop */}
        {filteredCollections.map((c, idx) => {
          const style = getColorClasses(c.color);
          const isUnsorted = c.name === 'Unsorted';
          const isGrid = viewLayout === 'grid';

          return (
            <motion.div 
              key={c.name}
              id={`collection_tile_${c.name.replace(/\s+/g, '_')}`}
              layout="position"
              onClick={() => {
                setExpandedFolder(c.name);
                setInnerSearchQuery('');
                setExpandedSnippetId(null);
              }}
              className={cn(
                "bg-surface border border-border-subtle hover:border-primary/40 transition-all duration-300 relative select-none cursor-pointer group",
                isGrid 
                  ? "rounded-2xl p-6 flex flex-col justify-between h-70 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_32px_rgba(30,64,175,0.03)]"
                  : "rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_16px_rgba(30,64,175,0.02)] w-full"
              )}
            >
              {isGrid ? (
                <>
                  <div>
                    {/* Header of card with folder color and options button */}
                    <div className="flex justify-between items-center mb-4">
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center border",
                        style.bg,
                        style.border,
                        style.text
                      )}>
                        <Folder size={20} className="stroke-2" />
                      </div>

                      {/* Settings dropdown menu mimicking the image three dots */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === c.name ? null : c.name);
                          }}
                          className="p-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-surface-container-high/60 text-on-surface-variant/50 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Popover list */}
                        {activeMenu === c.name && (
                          <div className="absolute right-0 top-9 w-40 bg-surface-container rounded-xl border border-border-subtle shadow-xl py-1 z-20 animate-slide-up select-none">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCollectionName(c.name);
                                setRenameValue(c.name);
                                setRenameDescValue(c.description);
                                setRenameColorValue(c.color);
                                setRenameError('');
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 size={13} className="text-on-surface-variant/70" />
                              <span>Rename Specs</span>
                            </button>
                            
                            {!isUnsorted && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                  if (c.count > 0) {
                                    if (confirm(`The collection "${c.name}" houses ${c.count} codesheets. Deleting the collection moves these records to "Unsorted". Proceed?`)) {
                                    // Static mode: delete disabled
                                    /*
                                    snippets.filter(s => (s.folder || 'Unsorted') === c.name).forEach(s => {
                                      updateSnippet(s.id, { folder: 'Unsorted' });
                                    });
                                    deleteFolder(c.name);
                                    */
                                  }
                                } else {
                                  if (confirm(`Purge the empty "${c.name}" collection namespaces?`)) {
                                    // Static mode: delete disabled
                                    /*
                                    deleteFolder(c.name);
                                    */
                                  }
                                  }
                                }}
                                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/10 hover:text-error transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 size={13} />
                                <span>Purge Vault</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Collection Meta Info */}
                    <div>
                      <h3 className="font-display text-base font-bold text-on-surface mb-1 group-hover:text-primary transition-colors truncate text-left">
                        {c.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant/60 leading-relaxed font-semibold tracking-normal line-clamp-3 mb-2 h-12.5 overflow-hidden text-left">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  {/* Custom Bottom preview panel exact with technology visual and items count */}
                  <div className="pt-4 border-t border-border-subtle/50 flex items-center justify-between">
                    
                    {/* Visual language bubbles list like image */}
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {c.languages.length > 0 ? (
                        c.languages.map((lang) => {
                          const details = getLanguageTagDot(lang);
                          return (
                            <div 
                              key={lang} 
                              title={lang}
                              className={cn(
                                "w-6 h-6 rounded-full border border-surface/90 flex items-center justify-center text-[8px] font-bold select-none",
                                details.bg,
                                details.text
                              )}
                            >
                              {details.label.slice(0, 2)}
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-surface-container bg-surface-container text-on-surface-variant/40 flex items-center justify-center text-[9px] font-mono leading-none">
                          -
                        </div>
                      )}
                    </div>

                    {/* Counts label as "24 snippets" from design */}
                    <span className="font-mono text-xs font-bold text-on-surface-variant/75">
                      {c.count} snippets
                    </span>
                  </div>
                </>
              ) : (
                // List View Layout of collection cards
                <div className="flex flex-row items-center justify-between w-full gap-4 text-left">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                      style.bg,
                      style.border,
                      style.text
                    )}>
                      <Folder size={18} className="stroke-2" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2.5">
                        <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </h3>
                        <span className="font-mono text-[10px] font-bold text-on-surface-variant/50 shrink-0">
                          ({c.count} snippets)
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant/50 truncate font-medium mt-0.5 max-w-2xl">
                        {c.description}
                      </p>
                    </div>
                  </div>

                  {/* Right hand details of List row */}
                  <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Language dots */}
                    <div className="hidden sm:flex -space-x-1.5 overflow-hidden">
                      {c.languages.length > 0 ? (
                        c.languages.map((lang) => {
                          const details = getLanguageTagDot(lang);
                          return (
                            <div 
                              key={lang} 
                              title={lang}
                              className={cn(
                                "w-6 h-6 rounded-full border border-surface/90 flex items-center justify-center text-[8px] font-bold select-none",
                                details.bg,
                                details.text
                              )}
                            >
                              {details.label.slice(0, 2)}
                            </div>
                          );
                        })
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-surface-container bg-surface-container text-on-surface-variant/40 flex items-center justify-center text-[9px] font-mono leading-none">
                          -
                        </div>
                      )}
                    </div>

                    {/* Settings dropdown menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === c.name ? null : c.name);
                        }}
                        className="p-1.5 rounded-lg border border-transparent hover:border-border-subtle hover:bg-surface-container-high/60 text-on-surface-variant/50 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Popover list */}
                      {activeMenu === c.name && (
                        <div className="absolute right-0 top-9 w-40 bg-surface-container rounded-xl border border-border-subtle shadow-xl py-1 z-20 animate-slide-up select-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCollectionName(c.name);
                              setRenameValue(c.name);
                              setRenameDescValue(c.description);
                              setRenameColorValue(c.color);
                              setRenameError('');
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 size={13} className="text-on-surface-variant/70" />
                            <span>Rename Specs</span>
                          </button>
                          
                          {!isUnsorted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(null);
                                if (c.count > 0) {
                                  if (confirm(`The collection "${c.name}" houses ${c.count} codesheets. Deleting the collection moves these records to "Unsorted". Proceed?`)) {
                                    // Static mode: delete disabled
                                    /*
                                    snippets.filter(s => (s.folder || 'Unsorted') === c.name).forEach(s => {
                                      updateSnippet(s.id, { folder: 'Unsorted' });
                                    });
                                    deleteFolder(c.name);
                                    */
                                  }
                                } else {
                                  if (confirm(`Purge the empty "${c.name}" collection namespaces?`)) {
                                    // Static mode: delete disabled
                                    /*
                                    deleteFolder(c.name);
                                    */
                                  }
                                }
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/10 hover:text-error transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={13} />
                              <span>Purge Vault</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Empty placeholder */}
        {filteredCollections.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto mt-6">
            <Folder size={40} className="text-on-surface-variant/20 animate-pulse" />
            <p className="text-xs font-bold text-on-surface mt-4">No collections correspond to search queries</p>
            <p className="text-[10px] text-on-surface-variant/50 font-mono mt-1">Please try modifying filter strings</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 px-3 py-1.5 bg-surface-container border border-border-subtle rounded-lg text-xs font-semibold text-on-surface-variant hover:text-on-surface"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* Mockup footer listed in alignment bottom margin */}
        <footer className="col-span-full border-t border-border/50 pt-5 mt-10 flex flex-col sm:flex-row justify-between items-center text-[10px] text-on-surface-variant/35 font-mono gap-4 select-none">
          <span>© 2024 SnippetVault. Engineered for developers.</span>
          <div className="flex gap-5">
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="#api" className="hover:text-primary transition-colors">API</a>
            <a href="#changelog" className="hover:text-primary transition-colors">Changelog</a>
          </div>
        </footer>

      </div>

      {/* Collection Workspace Modal Overlay */}
      <Dialog open={!!expandedFolder} onOpenChange={(open) => {
        if (!open) {
          setExpandedFolder(null);
          setInnerSearchQuery('');
          setExpandedSnippetId(null);
        }
      }}>
        <DialogContent showCloseButton={false} className="w-full max-w-5xl sm:max-w-5xl md:max-w-5xl p-0 gap-0 border-none ring-0 bg-surface shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-2xl">
          {(() => {
            if (!expandedFolder) return null;
            const c = collectionsList.find(f => f.name === expandedFolder);
            if (!c) return null;
            const style = getColorClasses(c.color);
            const isUnsorted = c.name === 'Unsorted';
            const folderSnippets = snippets.filter(s => (s.folder || 'Unsorted') === c.name);
            const filteredFolderSnippets = folderSnippets.filter(s => 
              s.title.toLowerCase().includes(innerSearchQuery.toLowerCase()) ||
              (s.description || '').toLowerCase().includes(innerSearchQuery.toLowerCase()) ||
              s.language.toLowerCase().includes(innerSearchQuery.toLowerCase())
            );

            return (
              <>
                {/* Modal Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle/50 px-6 py-4 bg-surface-container-low select-none">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      style.bg,
                      style.border,
                      style.text
                    )}>
                      <Folder size={18} className="stroke-2" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/10">Active Collection</span>
                      <h3 className="font-display text-sm font-bold text-on-surface mt-0.5">{c.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto py-0.5 max-w-full">
                    {/* Quick Switch Row inside the modal header */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full scrollbar-none">
                      <span className="text-[10px] text-on-surface-variant/50 font-mono font-bold whitespace-nowrap mr-1 tracking-wider uppercase shrink-0">Switch:</span>
                      {collectionsList.map(col => {
                        const isCurrent = col.name === expandedFolder;
                        const colStyle = getColorClasses(col.color);
                        return (
                          <button
                            key={col.name}
                            onClick={() => {
                              setExpandedFolder(col.name);
                              setInnerSearchQuery('');
                              setExpandedSnippetId(null);
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                              isCurrent 
                                ? cn("border-primary/30", colStyle.bg, colStyle.text)
                                : "border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant/70 hover:text-on-surface"
                            )}
                          >
                            <div className={cn("w-1.5 h-1.5 rounded-full", isCurrent ? "bg-current" : colStyle.text.replace('text-', 'bg-'))} />
                            <span>{col.name}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-5 w-px bg-border-subtle/60 hidden md:block shrink-0" />

                    {/* Options button */}
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === c.name ? null : c.name);
                        }}
                        className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-container text-on-surface-variant/50 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMenu === c.name && (
                        <div className="absolute right-0 top-9 w-40 bg-surface-container rounded-xl border border-border-subtle shadow-xl py-1 z-20 animate-slide-up select-none">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCollectionName(c.name);
                              setRenameValue(c.name);
                              setRenameDescValue(c.description);
                              setRenameColorValue(c.color);
                              setRenameError('');
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 size={13} className="text-on-surface-variant/70" />
                            <span>Rename Specs</span>
                          </button>
                          
                          {!isUnsorted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(null);
                                if (c.count > 0) {
                                  if (confirm(`The collection "${c.name}" houses ${c.count} codesheets. Deleting the collection moves these records to "Unsorted". Proceed?`)) {
                                    snippets.filter(s => (s.folder || 'Unsorted') === c.name).forEach(s => {
                                      updateSnippet(s.id, { folder: 'Unsorted' });
                                    });
                                    deleteFolder(c.name);
                                    setExpandedFolder(null);
                                  }
                                } else {
                                  if (confirm(`Purge the empty "${c.name}" collection namespaces?`)) {
                                    deleteFolder(c.name);
                                    setExpandedFolder(null);
                                  }
                                }
                              }}
                              className="w-full text-left px-3.5 py-2 text-xs font-semibold text-error hover:bg-error/10 hover:text-error transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 size={13} />
                              <span>Purge Vault</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Close button */}
                    <button
                      onClick={() => setExpandedFolder(null)}
                      className="p-1.5 rounded-lg border border-border-subtle hover:bg-surface-container text-on-surface-variant/60 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center shrink-0"
                      title="Close Panel"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Modal Body Content */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  
                  {/* Left Column: Collection Specs & Meta */}
                  <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border-subtle/60 pb-8 lg:pb-0 lg:pr-8 min-h-75">
                    <div>
                      <p className="text-xs sm:text-sm text-on-surface-variant/75 leading-relaxed font-medium mb-6">
                        {c.description}
                      </p>

                      {/* Collection stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-container/30 p-4 rounded-xl border border-border-subtle/50 font-mono text-[11px]">
                        <div>
                          <span className="text-on-surface-variant/45 uppercase block tracking-wider font-bold">Snippet Volume</span>
                          <span className="text-sm font-bold text-on-surface mt-1 block">{c.count} sheets</span>
                        </div>
                        <div>
                          <span className="text-on-surface-variant/45 uppercase block tracking-wider font-bold">Active Formats</span>
                          <span className="text-sm font-bold text-on-surface mt-1 block truncate" title={c.languages.join(', ')}>
                            {c.languages.length > 0 ? c.languages.join(', ') : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action shortcuts */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border-subtle/40 mt-auto">
                      <button
                        onClick={() => {
                          setExpandedFolder(null);
                          router.push('/snippets/new?folder=' + encodeURIComponent(c.name));
                        }}
                        className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/10 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>New Snippet</span>
                      </button>
                      <button
                        onClick={() => {
                          setExpandedFolder(null);
                          router.push('/snippets?folder=' + encodeURIComponent(c.name) + '&viewMode=grid');
                        }}
                        className="flex-1 py-2.5 bg-surface-container border border-border-subtle hover:border-border-subtle-high text-on-surface rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Open Full View</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Code Sheets Index & Search & Preview */}
                  <div className="lg:col-span-7 flex flex-col justify-between min-w-0 pt-4 lg:pt-0">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-on-surface-variant/60 font-bold">Code Sheets Index</h4>
                        <span className="text-[10px] font-mono text-on-surface-variant/40 bg-surface-container px-2.5 py-0.5 rounded border border-border-subtle/50 font-bold">
                          {filteredFolderSnippets.length} of {c.count} showing
                        </span>
                      </div>

                      {/* Local Search */}
                      <div className="relative mb-5">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                        <input 
                          type="text"
                          placeholder="Search snippets inside this collection..."
                          value={innerSearchQuery}
                          onChange={(e) => setInnerSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-sans"
                        />
                        {innerSearchQuery && (
                          <button 
                            onClick={() => setInnerSearchQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface p-0.5 rounded-md hover:bg-surface-container-high/60"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {/* Snippet rows */}
                      {filteredFolderSnippets.length > 0 ? (
                        <div className="space-y-3 max-h-95 overflow-y-auto pr-1 scrollbar-thin">
                          {filteredFolderSnippets.map(s => {
                            const isCodeExpanded = expandedSnippetId === s.id;
                            return (
                              <div 
                                key={s.id}
                                onClick={() => setExpandedSnippetId(isCodeExpanded ? null : s.id)}
                                className={cn(
                                  "p-4 rounded-xl border border-border-subtle hover:border-primary/20 bg-surface-container-lowest hover:bg-surface-container-low/50 transition-all cursor-pointer flex flex-col",
                                  isCodeExpanded && "border-primary/30 bg-surface-container-low/60 ring-1 ring-primary/5 shadow-sm"
                                )}
                              >
                                <div className="flex justify-between items-center gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container border border-border-subtle/60 flex items-center justify-center text-on-surface-variant/60 shrink-0">
                                      <Code size={14} />
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="text-xs font-bold text-on-surface truncate">{s.title}</h5>
                                      {s.description && (
                                        <p className="text-[10px] text-on-surface-variant/50 truncate mt-0.5 max-w-sm">{s.description}</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9px] font-bold text-on-surface-variant/50 bg-surface-container/60 px-2 py-0.5 rounded border border-border-subtle/40">
                                      {s.language}
                                    </span>
                                    {/* Copy and open */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(s.code);
                                        setCopiedId(s.id);
                                        setTimeout(() => setCopiedId(null), 1500);
                                      }}
                                      className="p-1.5 rounded-lg border border-transparent hover:border-border-subtle bg-surface-container/30 hover:bg-surface text-on-surface-variant/60 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
                                      title="Copy snippet code"
                                    >
                                      {copiedId === s.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedFolder(null);
                                        router.push(`/snippets/${s.id}`);
                                      }}
                                      className="p-1.5 rounded-lg border border-transparent hover:border-border-subtle bg-surface-container/30 hover:bg-surface text-on-surface-variant/60 hover:text-on-surface transition-all cursor-pointer flex items-center justify-center"
                                      title="View snippet sheet"
                                    >
                                      <ArrowRight size={12} />
                                    </button>
                                  </div>
                                </div>

                                {/* Inline Code Preview with Framer Motion */}
                                <AnimatePresence>
                                  {isCodeExpanded && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="mt-3 pt-3 border-t border-border-subtle/50">
                                        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-4 max-h-55 overflow-auto font-mono text-[10px] text-on-surface leading-normal relative select-text shadow-inner">
                                          <div className="absolute right-3 top-3 z-10">
                                            <button
                                              onClick={() => {
                                                navigator.clipboard.writeText(s.code);
                                                setCopiedId(s.id);
                                                setTimeout(() => setCopiedId(null), 1500);
                                              }}
                                              className="px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle hover:bg-surface-container-high text-on-surface-variant/70 text-[9px] font-sans font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                                            >
                                              {copiedId === s.id ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                              <span>{copiedId === s.id ? 'Copied' : 'Copy'}</span>
                                            </button>
                                          </div>
                                          <pre className="whitespace-pre-wrap break-all mt-1">{s.code}</pre>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-14 text-center border border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center bg-surface-container-low/30">
                          <Database size={24} className="text-on-surface-variant/30 mb-2" />
                          <p className="text-xs font-bold text-on-surface">No matching snippets found</p>
                          <p className="text-[10px] text-on-surface-variant/50 font-mono mt-1">Try modifying your filter query or create a new code snippet</p>
                          <button 
                            onClick={() => {
                              setExpandedFolder(null);
                              router.push('/snippets/new?folder=' + encodeURIComponent(c.name));
                            }}
                            className="mt-4 px-3.5 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>Create Snippet</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>


      {/* Creation Modal Form overlay - portaled to body to escape isolate stacking context */}
      {isAdding && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setIsAdding(false)}>
          <form 
            onSubmit={handleCreateCollection}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface w-full max-w-md rounded-2xl border border-border-subtle overflow-hidden animate-scale-up select-none shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/15 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <FolderPlus size={19} className="stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-on-surface">New Collection</h3>
                  <p className="text-[11px] text-on-surface-variant/50 mt-0.5">Create a new snippet group</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-on-surface transition-colors cursor-pointer mt-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Separator */}
            <div className="h-px bg-border-subtle/60 mx-6" />

            {/* Input fields */}
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface/80">Collection name</label>
                <input 
                  type="text"
                  maxLength={30}
                  value={newFolderName}
                  onChange={(e) => {
                    setNewFolderName(e.target.value);
                    setFolderError('');
                  }}
                  placeholder="e.g. React Hooks, API Utils..."
                  className="w-full bg-surface-container text-sm border border-border-subtle rounded-xl px-4 py-2.5 placeholder-on-surface-variant/35 text-on-surface font-medium focus:border-primary/50 focus:outline-none transition-all"
                  autoFocus
                />
                {folderError && (
                  <div className="flex items-center gap-1.5 text-error text-[11px] font-medium mt-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{folderError}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface/80">Description <span className="text-on-surface-variant/40 font-normal">(optional)</span></label>
                <textarea 
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="What kind of snippets will this collection hold?"
                  maxLength={160}
                  rows={3}
                  className="w-full bg-surface-container text-sm border border-border-subtle rounded-xl px-4 py-2.5 placeholder-on-surface-variant/35 text-on-surface font-medium focus:border-primary/50 focus:outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Theme color */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-on-surface/80">Theme color</label>
                <div className="flex gap-3">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewFolderColor(opt.value)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative cursor-pointer hover:scale-105",
                        opt.bg,
                        newFolderColor === opt.value ? "border-primary scale-110 shadow-lg shadow-primary/15" : "border-border-subtle/50 hover:border-on-surface-variant/30"
                      )}
                      title={opt.label}
                    >
                      {newFolderColor === opt.value && (
                        <Check size={14} className={cn(opt.text)} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-1 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2.5 hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface-variant border border-border-subtle/60 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover active:scale-[0.98] text-on-primary rounded-xl text-xs font-bold transition-all shadow-sm shadow-primary/15 cursor-pointer"
              >
                Create Collection
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Editing / Renaming Modal Form overlay - portaled to body to escape isolate stacking context */}
      {editingCollectionName && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setEditingCollectionName(null)}>
          <form 
            onSubmit={(e) => handleUpdateCollection(e, editingCollectionName)}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface w-full max-w-md rounded-2xl border border-border-subtle overflow-hidden animate-scale-up select-none shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/15 border border-secondary/20 text-secondary flex items-center justify-center shrink-0">
                  <Edit3 size={19} className="stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-on-surface">Edit Collection</h3>
                  <p className="text-[11px] text-on-surface-variant/50 mt-0.5">Update name, description, or theme</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingCollectionName(null)}
                className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant/50 hover:text-on-surface transition-colors cursor-pointer mt-0.5"
              >
                <X size={16} />
              </button>
            </div>

            {/* Separator */}
            <div className="h-px bg-border-subtle/60 mx-6" />

            {/* Input fields */}
            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface/80">Collection name</label>
                <input 
                  type="text"
                  maxLength={30}
                  value={renameValue}
                  onChange={(e) => {
                    setRenameValue(e.target.value);
                    setRenameError('');
                  }}
                  placeholder="e.g. React Hooks, API Utils..."
                  className="w-full bg-surface-container text-sm border border-border-subtle rounded-xl px-4 py-2.5 placeholder-on-surface-variant/35 text-on-surface font-medium focus:border-secondary/40 focus:outline-none transition-all"
                  autoFocus
                />
                {renameError && (
                  <div className="flex items-center gap-1.5 text-error text-[11px] font-medium mt-1">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{renameError}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-on-surface/80">Description <span className="text-on-surface-variant/40 font-normal">(optional)</span></label>
                <textarea 
                  value={renameDescValue}
                  onChange={(e) => setRenameDescValue(e.target.value)}
                  placeholder="What kind of snippets does this collection hold?"
                  maxLength={160}
                  rows={3}
                  className="w-full bg-surface-container text-sm border border-border-subtle rounded-xl px-4 py-2.5 placeholder-on-surface-variant/35 text-on-surface font-medium focus:border-secondary/40 focus:outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Theme color */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-on-surface/80">Theme color</label>
                <div className="flex gap-3">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRenameColorValue(opt.value)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative cursor-pointer hover:scale-105",
                        opt.bg,
                        renameColorValue === opt.value ? "border-secondary scale-110 shadow-lg shadow-secondary/15" : "border-border-subtle/50 hover:border-on-surface-variant/30"
                      )}
                      title={opt.label}
                    >
                      {renameColorValue === opt.value && (
                        <Check size={14} className={cn(opt.text)} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 pt-1 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditingCollectionName(null)}
                className="px-4 py-2.5 hover:bg-surface-container-high rounded-xl text-xs font-semibold text-on-surface-variant border border-border-subtle/60 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-secondary hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-secondary/15 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
