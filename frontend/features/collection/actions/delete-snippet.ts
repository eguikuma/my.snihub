"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  CacheProfiles,
  CacheTags,
  Endpoints,
  Routes,
} from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toActionOutcome } from "@/foundations/libraries/outcome";
import type { Slug } from "@/foundations/schemas";

/**
 * 指定されたスニペットを削除し、キャッシュを再検証する
 */
export const deleteSnippet = async (slug: Slug) =>
  toActionOutcome(async () => {
    await fetcher.delete(Endpoints.MySnippet(slug));
    revalidatePath(Routes.SnippetMine);
    revalidateTag(CacheTags.Snippets, CacheProfiles.Default);

    return {};
  });
