import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
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
 */
export const fetchMySnippetStatistics = (): ResultAsync<
  Statistics,
  OutcomeError
> =>
  toOutcome(async () => {
    const response = await fetcher.get(Endpoints.MySnippetStatistics);

    return StatisticsResponse.parse(response);
  });
