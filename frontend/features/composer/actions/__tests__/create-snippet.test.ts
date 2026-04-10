import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import type { SnippetDraft } from "../../schemas";
import { createSnippet } from "../create-snippet";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

const mockFetcher = vi.hoisted(() => ({
  post: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const mockFetchSnippet = vi.hoisted(() => vi.fn());
vi.mock("@/features/viewer/actions/fetch-snippet", () => ({
  fetchSnippet: mockFetchSnippet,
}));

const validDraft: SnippetDraft = {
  title: "Test",
  code: "console.log('hello')",
  language: "typescript",
  description: "desc",
  visibility: "public",
  expiration: null,
  tags: ["tag1", "tag2"],
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("createSnippet", () => {
  test("成功時はslugを含むActionOutcomeを返す", async () => {
    mockFetcher.post.mockResolvedValue({
      data: { slug: "created-slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    const result = await createSnippet(validDraft);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.slug).toBe("created-slug");
    }
  });

  test("descriptionが空文字の場合はnullに変換される", async () => {
    mockFetcher.post.mockResolvedValue({
      data: { slug: "slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    await createSnippet({ ...validDraft, description: "" });

    const body = JSON.parse(mockFetcher.post.mock.calls[0][1].body as string);
    expect(body.description).toBeNull();
  });

  test("tagsが空配列の場合はnullに変換される", async () => {
    mockFetcher.post.mockResolvedValue({
      data: { slug: "slug" },
    });
    mockFetchSnippet.mockResolvedValue(undefined);

    await createSnippet({ ...validDraft, tags: [] });

    const body = JSON.parse(mockFetcher.post.mock.calls[0][1].body as string);
    expect(body.tags).toBeNull();
  });

  test("キャッシュウォームが失敗しても成功を返す", async () => {
    mockFetcher.post.mockResolvedValue({
      data: { slug: "slug" },
    });
    mockFetchSnippet.mockRejectedValue(new Error("Cache warm failed"));

    const result = await createSnippet(validDraft);

    expect(result.success).toBe(true);
  });

  test("API呼び出しが422の場合はバリデーションエラーを返す", async () => {
    const fields = { title: ["タイトルは必須です"] };
    mockFetcher.post.mockRejectedValue(
      new BackendFailure("Validation Error", 422, fields),
    );

    const result = await createSnippet(validDraft);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual(fields);
    }
  });

  test("API呼び出しが500の場合はnullエラーを返す", async () => {
    mockFetcher.post.mockRejectedValue(new BackendFailure("Error", 500));

    const result = await createSnippet(validDraft);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeNull();
    }
  });
});
