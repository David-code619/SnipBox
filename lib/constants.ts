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

// Highly polished, robust mock snippets for empty state visualization
export const DemoSnippetss = [
  {
    id: 'demo-1',
    title: 'React Custom Fetch Hook',
    language: 'TypeScript',
    folder: 'Hooks',
    tags: ['react', 'fetch', 'async'],
    description: 'Fully typed custom react hook for loading data using Fetch API with error handling, abort controls, and caching state.',
    createdAt: '2026-01-15T12:00:00.000Z',
    updatedAt: '2026-01-15T12:00:00.000Z',
    copyCount: 142,
  },
  {
    id: 'demo-2',
    title: 'Tailwind Bento Grid Layout',
    language: 'HTML',
    folder: 'Frontend',
    tags: ['tailwind', 'css', 'grid'],
    description: 'A responsive and beautiful modern bento-box style grids for showcase sections and dash configurations.',
    createdAt: '2026-02-12T12:00:00.000Z',
    updatedAt: '2026-02-12T12:00:00.000Z',
    copyCount: 94,
  },
  {
    id: 'demo-3',
    title: 'Express Rate Limiter Middleware',
    language: 'JavaScript',
    folder: 'Backend',
    tags: ['express', 'node', 'security'],
    description: 'A lightweight sliding-window rate limiting middleware for express APIs to prevent basic brute force and DDoS floods.',
    createdAt: '2026-03-24T12:00:00.000Z',
    updatedAt: '2026-03-24T12:00:00.000Z',
    copyCount: 68,
  },
  {
    id: 'demo-4',
    title: 'Binary Search Implementation',
    language: 'Python',
    folder: 'Algorithms',
    tags: ['search', 'sorting', 'math'],
    description: 'Standard binary search implementation with detailed complexity notes.',
    createdAt: '2026-04-18T12:00:00.000Z',
    updatedAt: '2026-04-18T12:00:00.000Z',
    copyCount: 51,
  },
  {
    id: 'demo-5',
    title: 'JWT Token Authenticator',
    language: 'TypeScript',
    folder: 'Backend',
    tags: ['auth', 'jwt', 'security'],
    description: 'Robust server-side JSON Web Token decryption and payload signature verifier.',
    createdAt: '2026-05-10T12:00:00.000Z',
    updatedAt: '2026-05-10T12:00:00.000Z',
    copyCount: 112,
  },
  {
    id: 'demo-6',
    title: 'Rust Safe Memory Arena',
    language: 'Rust',
    folder: 'Systems',
    tags: ['rust', 'memory', 'manual'],
    description: 'Fast, contiguous index-based allocation mechanism inside an pre-allocated arena buffer.',
    createdAt: '2026-05-28T12:00:00.000Z',
    updatedAt: '2026-05-28T12:00:00.000Z',
    copyCount: 38,
  },
];