/**
 * 遷移元を識別するクエリパラメータの値
 */
export const Referrers = {
  MINE: "mine",
} as const;

/**
 * アプリ内のルートパス
 */
export const Routes = {
  Home: "/",
  Snippet: (slug: string): `/snippets/${string}` => `/snippets/${slug}`,
  SnippetNew: "/snippets/new",
  SnippetMine: "/snippets/mine",
} as const;
