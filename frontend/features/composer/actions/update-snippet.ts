"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { CacheProfiles, CacheTags, Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toActionOutcome } from "@/foundations/libraries/outcome";
import { Slug } from "@/foundations/schemas";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import type { SnippetRevision } from "../schemas";

/**
 * レスポンスからslugを取得するためのスキーマ
 */
const UpdateSnippetResponse = z.object({
  data: z.object({
    slug: Slug.schema,
  }),
});

/**
 * スニペットを更新し、成功時はslugを返す
 */
export const updateSnippet = async (slug: Slug, fields: SnippetRevision) =>
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
    revalidateTag(CacheTags.Snippet(slug), CacheProfiles.Default);
    revalidateTag(CacheTags.Snippets, CacheProfiles.Default);

    try {
      await fetchSnippet(data.slug);
    } catch {
      /* キャッシュウォームはベストエフォート */
    }

    return { slug: data.slug };
  });
