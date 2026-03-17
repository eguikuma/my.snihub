import { z } from "zod";

/**
 * ページネーションのメタ情報を表現するスキーマ
 */
export const PaginationMeta = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMeta>;

/**
 * 任意のスキーマにページネーション情報を付与する
 */
export const withPagination = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    data: schema,
    meta: PaginationMeta,
  });
};
