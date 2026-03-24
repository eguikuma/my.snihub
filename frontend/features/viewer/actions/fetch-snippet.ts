import { cache } from "react";
import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { CacheTags, Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toOutcome, type OutcomeError } from "@/foundations/libraries/outcome";
import { Snippet, type Slug } from "@/foundations/schemas";

const SnippetResponse = z.object({
  data: Snippet,
});

/**
 * 指定されたslugのスニペットをバックエンドから取得する（同一リクエスト内でキャッシュする）
 */
export const fetchSnippet = cache(
  (slug: Slug): ResultAsync<Snippet, OutcomeError> =>
    toOutcome(async () => {
      const response = await fetcher.get(Endpoints.Snippet(slug), {
        revalidate: 60,
        tags: [CacheTags.Snippet(slug)],
        anonymous: true,
      });

      return SnippetResponse.parse(response).data;
    }),
);
