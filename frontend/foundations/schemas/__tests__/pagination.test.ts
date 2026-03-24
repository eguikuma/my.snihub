import { describe, expect, test } from "vitest";
import { z } from "zod";
import { PaginationMeta, withPagination } from "../pagination";

describe("PaginationMeta", () => {
  test("有効なメタ情報をパースできる", () => {
    const data = {
      current_page: 1,
      last_page: 5,
      per_page: 15,
      total: 72,
    };
    const result = PaginationMeta.safeParse(data);

    expect(result.success).toBe(true);
  });

  test("フィールドが欠けている場合はパースに失敗する", () => {
    const data = { current_page: 1 };
    const result = PaginationMeta.safeParse(data);

    expect(result.success).toBe(false);
  });
});

describe("withPagination", () => {
  test("任意のスキーマにページネーション情報を付与する", () => {
    const ItemSchema = z.array(z.object({ id: z.number() }));
    const PaginatedSchema = withPagination(ItemSchema);

    const data = {
      data: [{ id: 1 }, { id: 2 }],
      meta: { current_page: 1, last_page: 1, per_page: 15, total: 2 },
    };
    const result = PaginatedSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  test("metaが欠けている場合はパースに失敗する", () => {
    const ItemSchema = z.array(z.object({ id: z.number() }));
    const PaginatedSchema = withPagination(ItemSchema);

    const data = { data: [{ id: 1 }] };
    const result = PaginatedSchema.safeParse(data);

    expect(result.success).toBe(false);
  });
});
