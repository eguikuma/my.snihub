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
 * 認証付きで公開エンドポイントからスニペットを取得する（同一リクエスト内でキャッシュする）
 *
 * is_ownerが正しく判定され、非公開・期限切れスニペットもオーナーなら閲覧できる
 */
export const fetchMySnippet = cache(
  (slug: Slug): ResultAsync<Snippet, OutcomeError> =>
    toOutcome(async () => {
      const response = await fetcher.get(Endpoints.Snippet(slug));

      return SnippetResponse.parse(response).data;
    }),
);
