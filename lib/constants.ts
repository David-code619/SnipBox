import type { Snippet } from "@/types";

export const mockSnippets: Snippet[] = [
  {
    id: "1",
    title: "AuthContext.tsx",
    code: `const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw Error('Missing AuthContext');
  return context;
}`,
    language: "TypeScript",
    folder: "Frontend Frameworks",
    tags: ["react", "auth"],
    description: "A context hook for authentication.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    copyCount: 142,
    isFavorite: true,
  },
  {
    id: "2",
    title: "fade-in.css",
    code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    language: "CSS",
    folder: "UI Components",
    tags: ["animation", "css"],
    description: "Simple fade-in animation keyframes.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    copyCount: 56,
  },
  {
    id: "3",
    title: "debounce-utility.js",
    code: `function debounce(fn, ms) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
}`,
    language: "JavaScript",
    folder: "Utility Hooks",
    tags: ["utility", "performance"],
    description: "Prevents a function from firing too often.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    copyCount: 312,
    isFavorite: true,
  },
];