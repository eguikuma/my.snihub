import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import { Slug } from "@/foundations/schemas/brand";
import { deleteSnippet } from "../delete-snippet";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

const mockFetcher = vi.hoisted(() => ({
  delete: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const slug = Slug.from("test-slug");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("deleteSnippet", () => {
  test("正しいエンドポイントにDELETEリクエストを送る", async () => {
    mockFetcher.delete.mockResolvedValue(undefined);

    await deleteSnippet(slug);

    expect(mockFetcher.delete).toHaveBeenCalledWith(
      "/api/me/snippets/test-slug",
    );
  });

  test("成功時はsuccess=trueを返す", async () => {
    mockFetcher.delete.mockResolvedValue(undefined);

    const result = await deleteSnippet(slug);

    expect(result.success).toBe(true);
  });

  test("APIエラーの場合はsuccess=falseを返す", async () => {
    mockFetcher.delete.mockRejectedValue(new BackendFailure("Error", 500));

    const result = await deleteSnippet(slug);

    expect(result.success).toBe(false);
  });
});
