import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Slug } from "@/foundations/schemas/brand";
import { GET } from "../route";

const mockSession = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

const mockFetchMySnippet = vi.hoisted(() => vi.fn());
vi.mock("@/features/viewer/actions/fetch-my-snippet", () => ({
  fetchMySnippet: mockFetchMySnippet,
}));

const mockFetchSnippet = vi.hoisted(() => vi.fn());
vi.mock("@/features/viewer/actions/fetch-snippet", () => ({
  fetchSnippet: mockFetchSnippet,
}));

const slug = Slug.from("test-slug");

const createRequest = (slug?: string) => {
  const url = slug
    ? `http://localhost/api/snippets/prefetch?slug=${slug}`
    : "http://localhost/api/snippets/prefetch";

  return new NextRequest(url);
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Prefetch snippet route", () => {
  test("slugが未指定の場合は400を返す", async () => {
    const response = await GET(createRequest());

    expect(response.status).toBe(400);
  });

  test("ownerHashがある場合はfetchMySnippetが呼ばれる", async () => {
    mockSession.get.mockResolvedValue({ ownerHash: "hash123" });
    mockFetchMySnippet.mockResolvedValue(undefined);

    const response = await GET(createRequest(slug));

    expect(response.status).toBe(204);
    expect(mockFetchMySnippet).toHaveBeenCalledWith(slug, "hash123");
    expect(mockFetchSnippet).not.toHaveBeenCalled();
  });

  test("ownerHashがない場合はfetchSnippetが呼ばれる", async () => {
    mockSession.get.mockResolvedValue({});
    mockFetchSnippet.mockResolvedValue(undefined);

    const response = await GET(createRequest(slug));

    expect(response.status).toBe(204);
    expect(mockFetchSnippet).toHaveBeenCalledWith(slug);
    expect(mockFetchMySnippet).not.toHaveBeenCalled();
  });
});
