export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  folder: string;
  tags: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
  copyCount: number;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}


export interface SnippetContextType {
  snippets: Snippet[];
  addSnippet: (
    snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt" | "copyCount">,
  ) => void;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
}