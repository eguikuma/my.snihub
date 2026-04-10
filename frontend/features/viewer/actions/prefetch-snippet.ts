"use server";

import type { Slug } from "@/foundations/schemas";
import { fetchSnippet } from "./fetch-snippet";

/**
 * スニペットデータを事前にData Cacheに載せる
 */
export const prefetchSnippet = async (slug: Slug): Promise<void> => {
  await fetchSnippet(slug);
};
