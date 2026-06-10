"use client";
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Copy,
  Terminal,
  Folder,
  Database,
  Code,
  Tag,
  Layers,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { mockSnippets, DemoSnippetss as DemoSnippets } from "@/lib/constants";
import { motion, Variants } from "motion/react";

// Highly polished, robust mock snippets for empty state visualization

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 14 },
  },
};

interface TooltipPayloadEntry {
  name: string;
  value: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

// Dynamic custom styled tooltip matching adaptive theme declared outside render
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 border border-border-subtle rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-lg select-none text-on-surface">
        <p className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-wider mb-1.5">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="font-display font-bold text-sm text-on-surface">
            {payload[0].name}: {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const snippets = mockSnippets;
  const isVaultEmpty = snippets.length === 0;

  // Compute all metrics dynamically based on active or mock data
  const analyzedData = useMemo(() => {
    const list = isVaultEmpty ? DemoSnippets : snippets;

    // Total Copies Calculated
    const totalCopies = list.reduce((sum, s) => sum + (s.copyCount || 0), 0);

    // Grouping engines
    const langCounts: Record<string, number> = {};
    const folderCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    let documentedCount = 0;
    let totalLines = 0;

    list.forEach((s) => {
      // Lang groupings
      const lang = s.language || "Unknown";
      langCounts[lang] = (langCounts[lang] || 0) + 1;

      // Folder groupings
      const folder = s.folder || "Unsorted";
      folderCounts[folder] = (folderCounts[folder] || 0) + 1;

      // Tag aggregates
      if (s.tags && Array.isArray(s.tags)) {
        s.tags.forEach((t) => {
          const cleaned = t.trim().toLowerCase();
          if (cleaned) {
            tagCounts[cleaned] = (tagCounts[cleaned] || 0) + 1;
          }
        });
      }

      // Documentation status
      if (s.description && s.description.trim().length > 3) {
        documentedCount++;
      }

      // Estimate total lines of code
      if (s.code) {
        const lines = s.code.split("\n").length;
        totalLines += lines;
      }
    });

    // Language Dominance index
    const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
    const primaryLanguage = sortedLangs[0]?.[0] || "N/A";
    const primaryLangCount = sortedLangs[0]?.[1] || 0;
    const primaryLangPercent =
      list.length > 0 ? Math.round((primaryLangCount / list.length) * 100) : 0;

    // Folder occupancy index
    const sortedFolders = Object.entries(folderCounts).sort(
      (a, b) => b[1] - a[1],
    );
    const topFolder = sortedFolders[0]?.[0] || "Unsorted";
    const topFolderCount = sortedFolders[0]?.[1] || 0;

    // Distinct Theme Colors for Recharts Pie
    const colors = [
      "var(--color-accent-amber)",
      "var(--color-secondary)",
      "var(--color-primary)",
      "#ff8080",
      "var(--color-tertiary)",
      "#20c9c9",
      "#d885ff",
    ];
    const languageChartData = sortedLangs.map(([name, count], index) => ({
      name,
      value: count,
      percent: Math.round((count / list.length) * 100),
      color: colors[index % colors.length],
    }));

    // Folder breakdown sorted by count
    const folderBreakdown = sortedFolders.map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / list.length) * 100),
    }));

    // Popular tags array
    const popularTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // Calculate quality indices
    const docPercent =
      list.length > 0 ? Math.round((documentedCount / list.length) * 100) : 0;
    const averageLinesValue =
      list.length > 0 ? Math.round(totalLines / list.length) : 0;

    // Creation Timeline calculator grouped by Month string
    const monthsMap: Record<string, number> = {};

    // Seed standard list to ensure timeline renders nicely if blank
    const seedMonths = [
      "Jan 2026",
      "Feb 2026",
      "Mar 2026",
      "Apr 2026",
      "May 2026",
    ];
    seedMonths.forEach((m) => {
      monthsMap[m] = 0;
    });

    list.forEach((s) => {
      const d = s.createdAt ? new Date(s.createdAt) : new Date();
      if (!isNaN(d.getTime())) {
        const monthStr = d.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        monthsMap[monthStr] = (monthsMap[monthStr] || 0) + 1;
      }
    });

    const activityTimeline = Object.entries(monthsMap)
      .map(([name, count]) => ({ name, Snippets: count }))
      .sort((a, b) => {
        // Simple string timeline sorter (or standard seed fallback)
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });

    // Find top-performing snippet/fragment
    let topSnippet = list.length > 0 ? list[0] : null;
    list.forEach((s) => {
      if (topSnippet && (s.copyCount || 0) > (topSnippet.copyCount || 0)) {
        topSnippet = s;
      }
    });

    return {
      totalCopies,
      totalLines,
      primaryLanguage,
      primaryLangPercent,
      topFolder,
      topFolderCount,
      languageChartData,
      folderBreakdown,
      popularTags,
      docPercent,
      averageLinesValue,
      activityTimeline,
      topSnippet,
    };
  }, [snippets, isVaultEmpty]);

  // Dynamic custom styled tooltip matching adaptive theme
  return (
    <div
      id="analytics_viewport"
      className="w-full p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 md:pb-12 text-on-surface select-none"
    >
      {/* Telemetry Status Banner */}
      <motion.div
        id="telemetry_alert"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full overflow-hidden rounded-2xl border ${
          isVaultEmpty
            ? " border-accent-amber/20 text-accent-amber"
            : "bg-[#6366f1]/5 border-[#6366f1]/20 text-[#6366f1] dark:text-[#818cf8]"
        } p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isVaultEmpty ? "bg-accent-amber animate-pulse" : "bg-[#6366f1] animate-ping"} shrink-0`}
          />
          <div>
            <p className="font-display font-bold text-sm leading-tight">
              {isVaultEmpty ? "INTERACTIVE DEMO REPORT" : "LIVE CONTEXT ACTIVE"}
            </p>
            <p className="text-xs text-on-surface-variant/75 mt-0.5 leading-relaxed font-normal">
              {isVaultEmpty
                ? "Your vault is empty! Showing a full interactive analytics environment with structured mock dataset."
                : "Workspace telemetry connected. Successfully rendering insights from your active snippet vault."}
            </p>
          </div>
        </div>
        {isVaultEmpty && (
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full border border-accent-amber/10 tracking-widest uppercase">
            Demo Sandbox
          </span>
        )}
      </motion.div>

      {/* Hero Stats bento row */}
      <motion.div
        id="analytics_bento_stats"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          id="stat-total-snippets"
          title="Total Library Index"
          value={isVaultEmpty ? "0" : snippets.length.toString()}
          detail={`${analyzedData.totalLines} lines processed`}
          icon={<Database size={18} />}
          accentColor="var(--color-accent-amber)"
          variants={itemVariants}
        />
        <StatCard
          id="stat-copy-count"
          title="Times Copied"
          value={analyzedData.totalCopies.toString()}
          detail={
            snippets.length > 0
              ? `${Math.round(analyzedData.totalCopies / snippets.length)} avg / snippet`
              : "No snippets available"
          }
          icon={<Copy size={18} />}
          accentColor="var(--color-secondary)"
          variants={itemVariants}
        />
        <StatCard
          id="stat-primary-stack"
          title="Primary Stack Hub"
          value={analyzedData.primaryLanguage}
          detail={
            analyzedData.primaryLangPercent > 0
              ? `${analyzedData.primaryLangPercent}% of directory`
              : "Empty library"
          }
          icon={<Terminal size={18} />}
          accentColor="var(--color-primary)"
          variants={itemVariants}
        />
        <StatCard
          id="stat-top-folder"
          title="Top Category Volume"
          value={analyzedData.topFolder}
          detail={
            analyzedData.topFolderCount > 0
              ? `${analyzedData.topFolderCount} matching chunks`
              : "No categories typed"
          }
          icon={<Folder size={18} />}
          accentColor="var(--color-tertiary)"
          variants={itemVariants}
        />
      </motion.div>

      {/* Main Visualizations Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Creation timeline and volume evolution - 2-cols on desktop */}
        <motion.div
          id="timeline_card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2 bg-surface backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-border-subtle flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-on-surface"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-xs text-accent-amber font-mono tracking-widest uppercase">
                <TrendingUp size={12} /> Creation Velocity
              </span>
              <h3 className="font-display text-2xl font-black tracking-tight text-on-surface">
                Timeline Evolution
              </h3>
              <p className="text-xs text-on-surface-variant/75">
                Historical overview of codebase archives written per month
              </p>
            </div>
            {!isVaultEmpty && (
              <div className="bg-[#6366f1]/10 text-secondary border border-[#6366f1]/20 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs font-mono">
                <Sparkles size={13} className="animate-pulse" />
                <span>Healthy Flow</span>
              </div>
            )}
          </div>
          <div className="w-full h-70">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analyzedData.activityTimeline}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-accent-amber)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-accent-amber)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "var(--color-outline)",
                    fontFamily: "monospace",
                  }}
                  dy={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Snippets"
                  stroke="var(--color-accent-amber)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorWave)"
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "var(--color-surface)",
                    stroke: "var(--color-accent-amber)",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 0,
                    fill: "var(--color-accent-amber)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Language distribution donut representation */}
        <motion.div
          id="languages_card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="bg-surface backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-border-subtle flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-on-surface"
        >
          <div className="space-y-1 mb-6">
            <span className="flex items-center gap-2 text-xs text-secondary font-mono tracking-widest uppercase">
              <Code size={12} /> Language Matrix
            </span>
            <h3 className="font-display text-2xl font-black tracking-tight text-on-surface">
              Distribution
            </h3>
            <p className="text-xs text-on-surface-variant/75">
              Top tools powering your active index
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="relative flex items-center justify-center h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyzedData.languageChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  >
                    {analyzedData.languageChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <span className="text-3xl font-display font-black text-on-surface">
                  {analyzedData.primaryLangPercent}%
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-mono tracking-wider truncate max-w-25 uppercase mt-0.5">
                  {analyzedData.primaryLanguage}
                </span>
              </div>
            </div>

            {/* Custom interactive legend with progress bars */}
            <div className="space-y-2.5 max-h-42.5 overflow-y-auto pr-1">
              {analyzedData.languageChartData.slice(0, 4).map((entry, idx) => (
                <div key={idx} className="flex flex-col gap-1 select-none">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="font-medium text-on-surface">
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-mono text-on-surface-variant/75">
                      {entry.value} file{entry.value > 1 ? "s" : ""} (
                      {entry.percent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${entry.percent}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              {analyzedData.languageChartData.length === 0 && (
                <p className="text-xs text-on-surface-variant/40 text-center py-4 font-mono">
                  No language statistics calculated
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Folders Breakdown & Auxiliary System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic categories card list */}
        <motion.div
          id="folders_breakdown_card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="lg:col-span-2 bg-surface backdrop-blur-md rounded-3xl p-6 border border-border-subtle flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-on-surface"
        >
          <div className="mb-6">
            <span className="flex items-center gap-2 text-xs text-tertiary font-mono tracking-widest uppercase">
              <Layers size={12} /> Catalog Directory
            </span>
            <h3 className="font-display text-xl font-bold text-on-surface mt-1.5">
              Folder Density Index
            </h3>
            <p className="text-xs text-on-surface-variant/75 mt-0.5">
              Categorization allocation within folders
            </p>
          </div>

          <div className="space-y-4 max-h-75 overflow-y-auto pr-1">
            {analyzedData.folderBreakdown.map((folder, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low border border-border-subtle hover:border-accent-amber/25 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 border-accent-amber/5 text-accent-amber rounded-xl border">
                    <Folder size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface leading-none mb-1">
                      {folder.name}
                    </h4>
                    <p className="font-mono text-[10px] text-on-surface-variant/60">
                      {folder.count} snippets in directory
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-accent-amber">
                      {folder.percent}%
                    </p>
                  </div>
                  <div className="w-20 md:w-28 h-2 rounded-full bg-surface-container-high overflow-hidden shrink-0">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-accent-amber to-tertiary"
                      style={{ width: `${folder.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {analyzedData.folderBreakdown.length === 0 && (
              <p className="text-xs text-on-surface-variant/40 text-center py-10 font-mono">
                No directory entries sorted yet
              </p>
            )}
          </div>
        </motion.div>

        {/* MVP Fragment Spotlight and Tags Cloud */}
        <motion.div
          id="mvp_fraction_card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="bg-surface backdrop-blur-md rounded-3xl p-6 border border-border-subtle flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.05)] text-on-surface"
        >
          <div>
            <span className="flex items-center gap-2 text-xs text-accent-amber font-mono tracking-widest uppercase">
              <Sparkles size={12} className="text-accent-amber" /> MVP Vault
              Spotlight
            </span>
            <h3 className="font-display text-xl font-bold text-on-surface mt-1.5">
              Top Performer
            </h3>
            <p className="text-xs text-on-surface-variant/75 mt-0.5">
              Most frequently integrated/copied script
            </p>
          </div>

          <div className="space-y-4 my-5 flex-1 flex flex-col justify-center">
            {analyzedData.topSnippet ? (
              <div className="group relative p-4 rounded-2xl bg-surface-container border border-border-subtle hover:border-accent-amber/25 transition-all duration-300 flex flex-col space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider bg-accent-amber/10 text-accent-amber border border-accent-amber/15">
                      {analyzedData.topSnippet.language}
                    </span>
                    <h4 className="font-display font-medium text-sm text-on-surface line-clamp-1 group-hover:text-accent-amber transition-colors">
                      {analyzedData.topSnippet.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-black text-[#6366f1] dark:text-[#818cf8] bg-[#6366f1]/5 border border-[#6366f1]/10 px-2 py-1 rounded-xl shrink-0">
                    <Copy size={11} />
                    <span>{analyzedData.topSnippet.copyCount || 0}</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface-variant/75 line-clamp-2 leading-relaxed">
                  {analyzedData.topSnippet.description ||
                    "No description recorded in index metadata."}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant/60 font-mono">
                  <span>Folder:</span>
                  <span className="text-on-surface-variant/80 font-semibold">
                    {analyzedData.topSnippet.folder || "Unsorted"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-border-subtle bg-surface-container-low rounded-2xl space-y-1 animate-pulse">
                <p className="text-xs text-on-surface-variant/50">
                  No MVP detected
                </p>
                <p className="text-[10px] text-on-surface-variant/30">
                  Insert or copy code to trigger stats
                </p>
              </div>
            )}

            {/* Tags cloud index */}
            <div className="pt-4 border-t border-border-subtle">
              <span className="flex items-center gap-2 text-xs text-on-surface-variant mb-2.5 select-none">
                <Tag size={13} className="text-primary" />
                <span>Trending Search Labels</span>
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-27.5 overflow-y-auto pr-1">
                {analyzedData.popularTags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9px] font-bold px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-container text-on-surface-variant hover:text-accent-amber hover:bg-accent-amber/5 hover:border-accent-amber/15 lowercase transition-all duration-300 select-none cursor-pointer"
                  >
                    #{tag.name}{" "}
                    <span className="text-[8px] text-on-surface-variant/50">
                      ({tag.count})
                    </span>
                  </span>
                ))}
                {analyzedData.popularTags.length === 0 && (
                  <p className="text-[10px] text-on-surface-variant/35 text-center font-mono py-2 w-full">
                    No keywords registered
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface StatCardProps {
  id?: string;
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  accentColor: string;
  variants: Variants;
}

function StatCard({
  id,
  title,
  value,
  detail,
  icon,
  accentColor,
  variants,
}: StatCardProps) {
  return (
    <motion.div
      id={id}
      variants={variants}
      className="group relative bg-surface p-5 rounded-3xl border border-border-subtle flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.05)] select-none transition-all duration-300 hover:border-primary/20 text-on-surface"
    >
      {/* Visual background ambient accent on card hover */}
      <div
        className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 blur-2xl pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-on-surface-variant/75 text-xs font-semibold uppercase tracking-wider block mb-1">
            {title}
          </span>
          <span className="font-display text-4xl font-black text-on-surface tracking-tight truncate max-w-50 block">
            {value}
          </span>
        </div>
        <div
          className="p-3.5 rounded-2xl border transition-all duration-300 group-hover:scale-105 shrink-0"
          style={{
            backgroundColor: `${accentColor}08`,
            borderColor: `${accentColor}25`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center text-[10px] font-mono text-on-surface-variant/50">
        <span>{detail}</span>
        <ArrowUpRight
          size={12}
          className="opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ color: accentColor }}
        />
      </div>
    </motion.div>
  );
}
