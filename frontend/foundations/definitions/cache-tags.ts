import type { Slug } from "../schemas/brand";

/**
 * fetch キャッシュのタグ名を定義する
 */
export const CacheTags = {
  Snippets: "snippets",
  Snippet: (slug: Slug): `snippet:${string}` => `snippet:${slug}`,
} as const;

/**
 * revalidateTag に渡すキャッシュプロファイルを定義する
 */
export const CacheProfiles = {
  Default: "default",
} as const;
