"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import {
  CacheProfiles,
  CacheTags,
  Endpoints,
  Routes,
} from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toActionOutcome } from "@/foundations/libraries/outcome";
import { Slug } from "@/foundations/schemas";
import type { SnippetDraft } from "../schemas";

/**
 * レスポンスからslugを取得するためのスキーマ
 */
const CreateSnippetResponse = z.object({
  data: z.object({
    slug: Slug.schema,
  }),
});

/**
 * スニペットを新規作成し、成功時はslugを返す
 */
export const createSnippet = async (fields: SnippetDraft) =>
  toActionOutcome(async () => {
    const response = await fetcher.post(Endpoints.MySnippets, {
      body: JSON.stringify({
        title: fields.title,
        code: fields.code,
        language: fields.language,
        description: fields.description || null,
        visibility: fields.visibility,
        expires_in: fields.expiration,
        tags: fields.tags.length > 0 ? fields.tags : null,
      }),
    });

    const { data } = CreateSnippetResponse.parse(response);
    revalidatePath(Routes.SnippetMine);
    revalidateTag(CacheTags.Snippets, CacheProfiles.Default);

    return { slug: data.slug };
  });
