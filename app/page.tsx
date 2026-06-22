'use client'
import React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Search,
  Lock,
  Sparkles,
  FolderOpen,
  Layers,
  ArrowRight,
  Code2,
} from "lucide-react";

const snipA = `function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}`;

const snipB = `export const authenticate = async (req: Request) => {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) throw new AuthError('Missing token');
  return jwt.verify(token, process.env.JWT_SECRET!);
};`;

const snipC = `const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div 
  variants={variants} 
  initial="hidden" 
  animate="visible"
>
  {children}
</motion.div>`;

export default function Landing() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="min-h-screen w-full bg-[#030308] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 backdrop-blur-md border-b border-indigo-500/10 bg-[#030308]/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-600/20 to-black border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <Code2 size={16} className="text-indigo-300" />
          </div>
          <span className="font-semibold tracking-wide text-sm text-indigo-50">
            SnipBox
          </span>
        </div>
        <button
          onClick={() => router.push("/auth")}
          className="text-sm font-medium hover:text-indigo-100 transition-colors px-4 py-2 text-indigo-200/60"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full pt-32 px-4 text-center">
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 w-full max-w-225 mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/5 border border-indigo-500/20 mb-8 backdrop-blur-md"
          >
            <Zap size={12} className="text-cyan-400" />
            <span className="text-xs font-semibold text-indigo-200/80 tracking-widest uppercase">
              The personal knowledge system
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", display: "block" }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-medium tracking-tighter leading-[1.05] text-transparent bg-clip-text bg-linear-to-b from-white via-indigo-100 to-indigo-400/50"
          >
            Every solution you&apos;ve ever written.{" "}
            <br className="hidden md:block" />
            Instantly available.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%",
              maxWidth: "800px",
              whiteSpace: "normal",
              display: "block",
              margin: "32px auto 0 auto",
            }}
            className="text-lg md:text-xl text-indigo-200/60 font-light tracking-wide text-center"
          >
            Stop rewriting what you&apos;ve already solved. A beautiful,
            lightning-fast workspace for elite developers to organize their code
            architecture.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => router.push("/auth")}
            className="mt-12 group relative inline-flex items-center gap-4 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold text-base md:text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.3)]"
          >
            <span>Enter the Vault</span>
            <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
              <ArrowRight size={16} />
            </div>
          </motion.button>
        </motion.div>

        {/* Hero Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden mask-[linear-gradient(to_bottom,black_40%,transparent)]">
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 md:w-200 md:h-200 bg-violet-600/5 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Floating Snippets Showcase */}
      <section className="relative h-[80vh] w-full flex items-center justify-center -mt-32 px-4 mb-20 overflow-hidden">
        <div className="relative w-full max-w-5xl aspect-21/9 perspective-[2000px]">
          {/* Center Piece */}
          <motion.div
            initial={{ opacity: 0, rotateX: 30, y: 150 }}
            whileInView={{ opacity: 1, rotateX: 10, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 mx-auto w-full max-w-4xl bg-[#0a0a10] rounded-2xl border border-indigo-500/20 shadow-2xl shadow-indigo-500/5 overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/30 to-transparent" />
            <div className="w-full h-full border border-indigo-500/10 bg-[#05050a] rounded-xl relative overflow-hidden shadow-inner">
              {/* Mock Search Bar */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80%] max-w-md h-12 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center px-4 gap-3 shadow-2xl backdrop-blur-md z-10">
                <Search size={16} className="text-indigo-300/50" />
                <span className="text-indigo-300/40 font-mono text-sm">
                  Find &apos;useDebounce&apos;...
                </span>
              </div>
              {/* Mock Code Block */}
              <div className="absolute top-20 left-4 right-4 md:left-8 md:right-8 bottom-4 md:bottom-8 rounded-lg bg-[#08080f] border border-indigo-500/10 p-6 font-mono text-xs md:text-sm text-indigo-100/70 leading-relaxed overflow-hidden">
                <div className="flex gap-3 text-[10px] md:text-xs text-indigo-300/40 mb-6 border-b border-indigo-500/10 pb-4">
                  <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                    typescript
                  </span>
                  <span className="bg-indigo-500/10 text-indigo-200 px-2 py-0.5 rounded">
                    react
                  </span>
                  <span className="bg-indigo-500/10 text-indigo-200 px-2 py-0.5 rounded">
                    hooks
                  </span>
                </div>
                {snipA.split("\n").map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-indigo-500/30 select-none w-4 text-right shrink-0">
                      {i + 1}
                    </span>
                    <span className="whitespace-pre overflow-x-hidden">
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating elements attached to perspective */}
          <motion.div
            initial={{ opacity: 0, x: -120, y: 50, rotateZ: -10 }}
            whileInView={{ opacity: 1, x: -60, y: -20, rotateZ: -6 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-1/4 -left-12 w-64 md:w-80 bg-[#0b0b14] border border-indigo-500/20 rounded-2xl p-5 shadow-2xl shadow-indigo-500/5 backdrop-blur-3xl z-20 hidden md:block"
          >
            <div className="font-mono text-[10px] md:text-xs text-indigo-300/50 mb-4 flex items-center gap-2">
              <Lock size={12} /> security.ts
            </div>
            <div className="h-px w-full bg-indigo-500/10 mb-4" />
            <pre className="font-mono text-[10px] md:text-xs text-indigo-200/60 overflow-hidden text-ellipsis leading-relaxed">
              {snipB}
            </pre>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 120, y: -50, rotateZ: 10 }}
            whileInView={{ opacity: 1, x: 60, y: 10, rotateZ: 4 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-1/4 -right-12 w-64 md:w-80 bg-[#0b0b14] border border-indigo-500/20 rounded-2xl p-5 shadow-2xl shadow-indigo-500/5 backdrop-blur-3xl z-20 hidden md:block"
          >
            <div className="font-mono text-[10px] md:text-xs text-indigo-300/50 mb-4 flex items-center gap-2">
              <Sparkles size={12} /> animation.tsx
            </div>
            <div className="h-px w-full bg-indigo-500/10 mb-4" />
            <pre className="font-mono text-[10px] md:text-xs text-indigo-200/60 overflow-hidden text-ellipsis leading-relaxed">
              {snipC}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* Story Sections */}
      <div className="max-w-7xl w-full mx-auto pb-32">
        <StorySection
          title="We write elegant solutions."
          subtitle="And then we lose them."
          description="Every brilliant hook, clever architecture pattern, and perfectly configured setup file eventually gets buried in the graveyard of past repositories. You know it exists, but you can't find it."
          icon={<Layers size={24} className="text-cyan-400" />}
        />

        <StorySection
          title="The chaos becomes organized."
          subtitle="A beautiful sanctuary for code."
          description="SnipBox retrieves your scattered brilliance and transforms it into a highly organized, deeply searchable personal knowledge graph. Everything in its right place."
          align="right"
          icon={<FolderOpen size={24} className="text-cyan-400" />}
        />

        <StorySection
          title="The power of instant retrieval."
          subtitle="Flow state, uninterrupted."
          description="Search across thousands of your personal snippets in milliseconds. Copy, paste, and stay in the zone. Stop scouring StackOverflow for problems you've already solved natively."
          icon={<Search size={24} className="text-cyan-400" />}
        />
      </div>

      {/* Large Premium Screenshot Section */}
      <section className="py-40 relative w-full block px-4 border-t border-indigo-500/5">
        <div className="absolute inset-0 bg-[#05050a] -z-10" />

        <div className="max-w-7xl w-full mx-auto flex flex-col items-center text-center mb-24 relative z-10">
          <h2
            style={{ width: "100%", display: "block" }}
            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-white mb-6"
          >
            Your second brain for code.
          </h2>
          <p
            style={{
              width: "100%",
              maxWidth: "800px",
              display: "block",
              margin: "0 auto",
            }}
            className="text-lg md:text-xl text-indigo-200/60 font-light leading-relaxed"
          >
            Experience the most perfectly crafted workspace for developer
            knowledge. Designed specifically for those who care about the final
            1% of polish.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-300 mx-auto bg-[#0b0b14] rounded-4xl md:rounded-[3rem] border border-indigo-500/20 p-2 md:p-4 shadow-2xl shadow-indigo-500/10 relative z-10"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-transparent rounded-4xl md:rounded-[3rem] pointer-events-none" />

          {/* The actual App UI Mockup */}
          <div className="w-full aspect-4/3 md:aspect-video bg-[#05050a] rounded-3xl md:rounded-[2.5rem] border border-indigo-500/10 overflow-hidden flex shadow-inner relative">
            {/* UI Header Mock */}
            <div className="absolute top-0 inset-x-0 h-14 bg-[#0b0b14]/80 backdrop-blur-md border-b border-indigo-500/5 flex items-center px-6 z-20 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500/20" />
                <div className="w-3 h-3 rounded-full bg-indigo-500/20" />
                <div className="w-3 h-3 rounded-full bg-indigo-500/20" />
              </div>
              <div className="w-64 h-7 bg-indigo-500/5 rounded-md border border-indigo-500/10 flex items-center justify-center">
                <span className="text-[10px] text-indigo-300/30 font-mono">
                  snipbox.dev
                </span>
              </div>
              <div className="w-16" />
            </div>

            {/* Mock Sidebar */}
            <div className="w-72 bg-[#08080f] border-r border-indigo-500/5 pt-20 p-6 flex flex-col gap-10 md:flex">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-indigo-300/40 uppercase tracking-widest pl-3 mb-2 font-semibold">
                  Library
                </span>
                <div className="h-9 rounded-lg flex items-center px-3 bg-indigo-500/10 text-sm text-indigo-100 border border-indigo-500/10">
                  <Layers size={14} className="mr-3 text-cyan-400" /> All
                  Snippets
                </div>
                <div className="h-9 rounded-lg flex items-center px-3 text-sm text-indigo-200/50 hover:bg-indigo-500/5 cursor-pointer transition-colors">
                  <Sparkles size={14} className="mr-3 text-indigo-400/50" />{" "}
                  Favorites
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono text-indigo-300/40 uppercase tracking-widest pl-3 mb-2 font-semibold">
                  Folders
                </span>
                <div className="h-9 rounded-lg flex items-center px-3 text-sm text-indigo-200/50 hover:bg-indigo-500/5 cursor-pointer transition-colors">
                  <FolderOpen size={14} className="mr-3 text-indigo-400/50" />{" "}
                  Backend Config
                </div>
                <div className="h-9 rounded-lg flex items-center px-3 text-sm text-indigo-200/50 hover:bg-indigo-500/5 cursor-pointer transition-colors">
                  <FolderOpen size={14} className="mr-3 text-indigo-400/50" />{" "}
                  UI Components
                </div>
                <div className="h-9 rounded-lg flex items-center px-3 text-sm text-indigo-200/50 hover:bg-indigo-500/5 cursor-pointer transition-colors">
                  <FolderOpen size={14} className="mr-3 text-indigo-400/50" />{" "}
                  Custom Hooks
                </div>
              </div>
            </div>

            {/* Mock Content area */}
            <div className="flex-1 pt-20 p-8 flex flex-col gap-8 bg-[#05050a] overflow-hidden relative">
              <div className="absolute top-[-50%] right-[-10%] w-125 h-125 bg-violet-600/3 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-medium tracking-tight text-white">
                  All Snippets
                </h3>
                <button className="h-9 px-4 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-900">
                  New Snippet
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-56 rounded-2xl border border-indigo-500/5 bg-indigo-500/2 p-6 flex flex-col gap-4 group hover:bg-indigo-500/4 transition-colors relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start z-10">
                      <div className="flex flex-col gap-2">
                        <div className="h-5 w-48 bg-indigo-500/15 rounded" />
                        <div className="h-3 w-24 bg-indigo-500/10 rounded" />
                      </div>
                      <div className="h-7 w-16 bg-indigo-500/10 border border-indigo-500/10 rounded-md" />
                    </div>
                    <div className="flex-1 rounded-lg border border-indigo-500/10 bg-[#020206] mt-2 p-4 relative overflow-hidden flex flex-col gap-2 z-10">
                      <div className="h-2 w-3/4 bg-indigo-500/10 rounded" />
                      <div className="h-2 w-1/2 bg-indigo-500/10 rounded" />
                      <div className="h-2 w-2/3 bg-indigo-500/10 rounded" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#05050a] z-20 opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Heavy CTA */}
      <section className="py-40 md:py-64 w-full relative px-4 flex flex-col items-center justify-center text-center overflow-hidden border-t border-indigo-500/5 bg-[#020206]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className="relative z-10"
        >
          <h2
            style={{ width: "100%", display: "block" }}
            className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-8 leading-[1.05]"
          >
            Build your personal <br /> knowledge base today.
          </h2>
          <button
            onClick={() => router.push("/auth")}
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_60px_rgba(79,70,229,0.25)] mt-8"
          >
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-indigo-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] z-0" />
            <ArrowRight size={18} className="relative z-10" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-500/10 py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#020206]">
        <div className="flex items-center gap-3 text-indigo-200/50">
          <div className="w-6 h-6 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Code2 size={12} />
          </div>
          <span className="font-medium text-sm tracking-wide">
            SnipBox © 2026
          </span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-indigo-200/40">
          <span className="hover:text-indigo-100 cursor-pointer transition-colors">
            Twitter
          </span>
          <span className="hover:text-indigo-100 cursor-pointer transition-colors">
            GitHub
          </span>
          <span className="hover:text-indigo-100 cursor-pointer transition-colors">
            Terms of Service
          </span>
          <span className="hover:text-indigo-100 cursor-pointer transition-colors">
            Privacy
          </span>
        </div>
      </footer>
    </div>
  );
}

function StorySection({
  title,
  subtitle,
  description,
  align = "left",
  icon,
}: {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  align?: "left" | "right";
  icon?: React.ReactNode;
}) {
  const isRight = align === "right";

  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden w-full relative">
      {/* Background structural lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 bottom-0 left-[20%] w-px bg-linear-to-b from-transparent via-indigo-500/10 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[20%] w-px bg-linear-to-b from-transparent via-indigo-500/10 to-transparent" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10"
      >
        <div
          className={`flex flex-col gap-8 w-full ${isRight ? "md:col-start-2 md:row-start-1" : "md:col-start-1 md:row-start-1"}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            {icon}
          </div>

          <h3 className="text-4xl md:text-5xl font-medium tracking-tighter text-white leading-[1.1]">
            <span className="text-indigo-200/40 block mb-3 font-normal">
              {title}
            </span>
            {subtitle}
          </h3>

          <p
            style={{ width: "100%", display: "block" }}
            className="text-lg md:text-xl text-indigo-200/60 leading-relaxed font-light mt-2"
          >
            {description}
          </p>
        </div>

        <div
          className={`relative aspect-square md:aspect-4/3 w-full rounded-4xl bg-[#08080f] border border-indigo-500/10 flex items-center justify-center shadow-2xl shadow-indigo-500/5 overflow-hidden ${isRight ? "md:col-start-1 md:row-start-1" : "md:col-start-2 md:row-start-1"}`}
        >
          <div className="absolute inset-0 bg-linear-to-bl from-violet-500/5 to-transparent pointer-events-none" />

          {/* Abstract visual representations based on section */}
          <div className="w-full h-full relative p-8 flex items-center justify-center">
            {align === "left" ? (
              <div className="grid grid-cols-3 gap-2 opacity-20 rotate-12 scale-150 blur-sm w-full h-full">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-indigo-500/20 rounded-md"
                    style={{
                      transform: `translateY(${i % 2 === 0 ? "20px" : "-20px"})`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-sm">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.8 }}
                    viewport={{ once: true }}
                    key={i}
                    className="h-16 w-full bg-indigo-500/10 border border-indigo-500/10 rounded-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-cyan-500/20" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
