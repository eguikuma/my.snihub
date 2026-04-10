import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import type { Snippet } from "@/foundations/schemas";
import { Slug } from "@/foundations/schemas/brand";
import { fetchMySnippet } from "../fetch-my-snippet";

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
  owner_hash: "hash123",
  is_owner: true,
  code: "console.log('hello')",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchMySnippet", () => {
  test("ownerHashがある場合はcache-keyクエリパラメータとrevalidate: 300が指定される", async () => {
    mockFetcher.get.mockResolvedValue({ data: validSnippet });

    const result = await fetchMySnippet(slug, "hash123");

    expect(result.isOk()).toBe(true);
    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/snippets/test-slug?cache-key=hash123",
      { revalidate: 300, tags: ["snippet:test-slug"] },
    );
  });

  test("ownerHashがない場合はクエリパラメータなしでcacheオプションもundefined", async () => {
    mockFetcher.get.mockResolvedValue({ data: validSnippet });

    await fetchMySnippet(slug);

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/snippets/test-slug",
      undefined,
    );
  });

  test("APIエラーの場合はOutcomeErrorを返す", async () => {
    mockFetcher.get.mockRejectedValue(
      new BackendFailure("Internal Server Error", 500),
    );

    const result = await fetchMySnippet(slug, "hash123");

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().kind).toBe("server");
  });
});
