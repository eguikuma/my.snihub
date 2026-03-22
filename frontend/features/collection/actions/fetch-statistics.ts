import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";

const StatisticsResponse = z.object({
  total: z.number(),
  public: z.number(),
  unlisted: z.number(),
  private: z.number(),
});

export type Statistics = z.infer<typeof StatisticsResponse>;

/**
 * 認証ユーザーのスニペット統計をバックエンドから取得し、失敗時はすべて0を返す
 */
export const fetchStatistics = async (): Promise<Statistics> => {
  try {
    const response = await fetcher.get(Endpoints.MySnippetStatistics);

    return StatisticsResponse.parse(response);
  } catch {
    return {
      total: 0,
      public: 0,
      unlisted: 0,
      private: 0,
    };
  }
};
