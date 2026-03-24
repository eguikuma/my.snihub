import { cache } from "react";
import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toOutcome, type OutcomeError } from "@/foundations/libraries/outcome";
import { Snippet, type Slug } from "@/foundations/schemas";

const SnippetResponse = z.object({
  data: Snippet,
});

/**
 * 認証済みユーザーのスニペットをslug指定で取得する（同一リクエスト内でキャッシュする）
 */
export const fetchMySnippet = cache(
  (slug: Slug): ResultAsync<Snippet, OutcomeError> =>
    toOutcome(async () => {
      const response = await fetcher.get(Endpoints.MySnippet(slug));

      return SnippetResponse.parse(response).data;
    }),
);
