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
 * 認証付きで公開エンドポイントからスニペットを取得する（同一リクエスト内でキャッシュする）
 *
 * ownerHashをクエリパラメータに含めることでユーザーごとにData Cacheを分離する
 * is_ownerが正しく判定され、非公開・期限切れスニペットもオーナーなら閲覧できる
 */
export const fetchMySnippet = cache(
  (slug: Slug, ownerHash?: string): ResultAsync<Snippet, OutcomeError> =>
    toOutcome(async () => {
      const cacheKeyQuery = ownerHash ? `?cache-key=${ownerHash}` : "";
      const response = await fetcher.get(
        `${Endpoints.Snippet(slug)}${cacheKeyQuery}`,
        ownerHash
          ? { revalidate: 300, tags: [CacheTags.Snippet(slug)] }
          : undefined,
      );

      return SnippetResponse.parse(response).data;
    }),
);
