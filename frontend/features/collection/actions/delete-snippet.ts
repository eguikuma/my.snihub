"use server";

import { revalidatePath } from "next/cache";
import { Endpoints, Routes } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";

/**
 * 指定されたスニペットを削除し、マイスニペット一覧を再検証する
 */
export const deleteSnippet = async (
  slug: string,
): Promise<{ success: boolean }> => {
  try {
    await fetcher.delete(Endpoints.MySnippet(slug));
    revalidatePath(Routes.SnippetMine);

    return { success: true };
  } catch {
    return { success: false };
  }
};
