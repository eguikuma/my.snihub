"use server";

import { session } from "@/foundations/libraries/sessions";
import type { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "./fetch-my-snippet";
import { fetchSnippet } from "./fetch-snippet";

/**
 * ViewerContainerが使うキャッシュと同じエントリを事前に温める
 *
 * 認証ユーザーはユーザー別キャッシュ、未認証は共有キャッシュを温める
 */
export const prefetchSnippet = async (slug: Slug): Promise<void> => {
  const currentSession = await session.get();

  if (currentSession.ownerHash) {
    await fetchMySnippet(slug, currentSession.ownerHash);
  } else {
    await fetchSnippet(slug);
  }
};
