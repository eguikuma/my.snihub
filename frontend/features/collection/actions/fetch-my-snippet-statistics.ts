import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { CacheTags, Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toOutcome, type OutcomeError } from "@/foundations/libraries/outcome";

const StatisticsResponse = z.object({
  total: z.number(),
  public: z.number(),
  unlisted: z.number(),
  private: z.number(),
});

export type Statistics = z.infer<typeof StatisticsResponse>;

/**
 * 認証ユーザーのスニペット統計をバックエンドから取得する
 *
 * ownerHashをクエリパラメータに含めることでユーザーごとにData Cacheを分離する
 */
export const fetchMySnippetStatistics = (
  ownerHash?: string,
): ResultAsync<Statistics, OutcomeError> =>
  toOutcome(async () => {
    const cacheKeyQuery = ownerHash ? `?cache-key=${ownerHash}` : "";
    const response = await fetcher.get(
      `${Endpoints.MySnippetStatistics}${cacheKeyQuery}`,
      ownerHash ? { revalidate: 60, tags: [CacheTags.Snippets] } : undefined,
    );

    return StatisticsResponse.parse(response);
  });
