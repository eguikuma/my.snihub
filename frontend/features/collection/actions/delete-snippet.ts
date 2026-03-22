"use server";

import { revalidatePath } from "next/cache";
import { Endpoints, Routes } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toActionOutcome } from "@/foundations/libraries/outcome";
import type { Slug } from "@/foundations/schemas";

/**
 * 指定されたスニペットを削除し、マイスニペット一覧を再検証する
 */
export const deleteSnippet = async (slug: Slug) =>
  toActionOutcome(async () => {
    await fetcher.delete(Endpoints.MySnippet(slug));
    revalidatePath(Routes.SnippetMine);
    revalidatePath(Routes.Snippets);

    return {};
  });
