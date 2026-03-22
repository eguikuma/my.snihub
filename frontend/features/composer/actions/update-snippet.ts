"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Endpoints, Routes } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toActionOutcome } from "@/foundations/libraries/outcome";
import type { SnippetRevision } from "@/features/composer/schemas";

/**
 * レスポンスからslugを取得するためのスキーマ
 */
const UpdateSnippetResponse = z.object({
  data: z.object({
    slug: z.string(),
  }),
});

/**
 * スニペットを更新し、成功時はslugを返す
 */
export const updateSnippet = async (slug: string, fields: SnippetRevision) =>
  toActionOutcome(async () => {
    const response = await fetcher.put(Endpoints.MySnippet(slug), {
      body: JSON.stringify({
        title: fields.title,
        code: fields.code,
        language: fields.language,
        description: fields.description || null,
        visibility: fields.visibility,
        tags: fields.tags.length > 0 ? fields.tags : null,
      }),
    });

    const { data } = UpdateSnippetResponse.parse(response);
    revalidatePath(Routes.Snippet(slug));

    return { slug: data.slug };
  });
