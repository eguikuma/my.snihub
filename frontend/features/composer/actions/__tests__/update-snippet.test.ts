import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import { Slug } from "@/foundations/schemas/brand";
import type { SnippetRevision } from "../../schemas";
import { updateSnippet } from "../update-snippet";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

const mockFetcher = vi.hoisted(() => ({
  put: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const mockFetchSnippet = vi.hoisted(() => vi.fn());
vi.mock("@/features/viewer/actions/fetch-snippet", () => ({
  fetchSnippet: mockFetchSnippet,
}));

const slug = Slug.from("test-slug");

const validRevision: SnippetRevision = {
  title: "Updated",
  code: "console.log('updated')",
  language: "typescript",
  description: "updated desc",
  visibility: "public",
  tags: ["tag1"],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("updateSnippet", () => {
  test("成功時はslugを含むActionOutcomeを返す", async () => {
    mockFetcher.put.mockResolvedValue({
      data: { slug: "test-slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    const result = await updateSnippet(slug, validRevision);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.slug).toBe("test-slug");
    }
  });

  test("PUTエンドポイントにslugが含まれる", async () => {
    mockFetcher.put.mockResolvedValue({
      data: { slug: "test-slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    await updateSnippet(slug, validRevision);

    expect(mockFetcher.put).toHaveBeenCalledWith(
      "/api/me/snippets/test-slug",
      expect.any(Object),
    );
  });

  test("descriptionが空文字の場合はnullに変換される", async () => {
    mockFetcher.put.mockResolvedValue({
      data: { slug: "test-slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    await updateSnippet(slug, { ...validRevision, description: "" });

    const body = JSON.parse(mockFetcher.put.mock.calls[0][1].body as string);
    expect(body.description).toBeNull();
  });

  test("tagsが空配列の場合はnullに変換される", async () => {
    mockFetcher.put.mockResolvedValue({
      data: { slug: "test-slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    await updateSnippet(slug, { ...validRevision, tags: [] });

    const body = JSON.parse(mockFetcher.put.mock.calls[0][1].body as string);
    expect(body.tags).toBeNull();
  });

  test("キャッシュウォームが失敗しても成功を返す", async () => {
    mockFetcher.put.mockResolvedValue({
      data: { slug: "test-slug" },
    });
    mockFetchSnippet.mockRejectedValue(new Error("Cache warm failed"));

    const result = await updateSnippet(slug, validRevision);

    expect(result.success).toBe(true);
  });

  test("API呼び出しが422の場合はバリデーションエラーを返す", async () => {
    const fields = { title: ["タイトルは必須です"] };
    mockFetcher.put.mockRejectedValue(
      new BackendFailure("Validation Error", 422, fields),
    );

    const result = await updateSnippet(slug, validRevision);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(fields);
    }
  });
});
