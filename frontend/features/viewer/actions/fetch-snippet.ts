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
 * 指定されたslugのスニペットをバックエンドから取得する
 */
export const fetchSnippet = (slug: Slug): ResultAsync<Snippet, OutcomeError> =>
  toOutcome(async () => {
    const response = await fetcher.get(Endpoints.Snippet(slug), {
      tags: [CacheTags.Snippet(slug)],
    });

    return SnippetResponse.parse(response).data;
  });
