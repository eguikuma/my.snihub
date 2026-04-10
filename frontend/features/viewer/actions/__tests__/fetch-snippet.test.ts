import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import type { Snippet } from "@/foundations/schemas";
import { Slug } from "@/foundations/schemas/brand";
import { fetchSnippet } from "../fetch-snippet";

vi.mock("react", () => ({
  cache: <T>(fn: T) => fn,
}));

const mockFetcher = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const slug = Slug.from("test-slug");

const validSnippet: Snippet = {
  slug: Slug.from("test-slug"),
  title: "Test Snippet",
  language: "typescript",
  description: null,
  visibility: "public",
  expires_at: null,
  expires_in: null,
  tags: [],
  user: { name: "testuser", avatar_url: null },
  owner_hash: undefined,
  is_owner: false,
  code: "console.log('hello')",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchSnippet", () => {
  test("正常にスニペットを取得してOkを返す", async () => {
    mockFetcher.get.mockResolvedValue({ data: validSnippet });

    const result = await fetchSnippet(slug);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(validSnippet);
  });

  test("anonymousオプションと3600秒のrevalidateがfetcherに渡される", async () => {
    mockFetcher.get.mockResolvedValue({ data: validSnippet });

    await fetchSnippet(slug);

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/snippets/test-slug",
      expect.objectContaining({
        revalidate: 3600,
        tags: ["snippet:test-slug"],
        anonymous: true,
      }),
    );
  });

  test("APIエラーの場合はOutcomeErrorを返す", async () => {
    mockFetcher.get.mockRejectedValue(new BackendFailure("Not Found", 404));

    const result = await fetchSnippet(slug);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toEqual({ kind: "not_found" });
  });
});
