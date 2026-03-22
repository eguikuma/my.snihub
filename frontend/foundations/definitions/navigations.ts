import type { Slug } from "../schemas/brand";

/**
 * アプリ内のルートパス
 */
export const Routes = {
  Home: "/",
  Snippet: (slug: Slug): `/snippets/${string}` => `/snippets/${slug}`,
  SnippetNew: "/snippets/new",
  SnippetMine: "/snippets/mine",
} as const;
