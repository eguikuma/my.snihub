import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import { fetchPublicSnippets } from "../fetch-public-snippets";

const mockFetcher = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const validResponse = {
  data: [],
  meta: { current_page: 1, last_page: 1, per_page: 24, total: 0 },
};

beforeEach(() => {
  vi.resetAllMocks();
  mockFetcher.get.mockResolvedValue(validResponse);
});

describe("fetchPublicSnippets", () => {
  test("パラメータなしでper_pageのみ付与される", async () => {
    await fetchPublicSnippets();

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/snippets?per_page=24",
      expect.objectContaining({ anonymous: true, revalidate: 60 }),
    );
  });

  test("keywordを指定するとクエリに含まれる", async () => {
    await fetchPublicSnippets({ keyword: "test" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("keyword=test");
  });

  test("languageを指定するとクエリに含まれる", async () => {
    await fetchPublicSnippets({ language: "typescript" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("language=typescript");
  });

  test("tagを指定するとクエリに含まれる", async () => {
    await fetchPublicSnippets({ tag: "react" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("tag=react");
  });

  test("page=1の場合はpageパラメータが省略される", async () => {
    await fetchPublicSnippets({ page: 1 });

    const url = new URL(mockFetcher.get.mock.calls[0][0] as string, "http://x");
    expect(url.searchParams.has("page")).toBe(false);
  });

  test("page>1の場合はpageパラメータが含まれる", async () => {
    await fetchPublicSnippets({ page: 2 });

    const url = new URL(mockFetcher.get.mock.calls[0][0] as string, "http://x");
    expect(url.searchParams.get("page")).toBe("2");
  });

  test("anonymousオプションが常に指定される", async () => {
    await fetchPublicSnippets();

    expect(mockFetcher.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ anonymous: true }),
    );
  });

  test("APIエラーの場合はOutcomeErrorを返す", async () => {
    mockFetcher.get.mockRejectedValue(new BackendFailure("Error", 500));

    const result = await fetchPublicSnippets();

    expect(result.isErr()).toBe(true);
  });
});
