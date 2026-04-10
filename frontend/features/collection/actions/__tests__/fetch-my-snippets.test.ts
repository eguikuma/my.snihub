import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import { fetchMySnippets } from "../fetch-my-snippets";

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

describe("fetchMySnippets", () => {
  test("パラメータなしでper_pageのみ付与される", async () => {
    await fetchMySnippets();

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/me/snippets?per_page=24",
      undefined,
    );
  });

  test("keywordを指定するとクエリに含まれる", async () => {
    await fetchMySnippets({ keyword: "test" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("keyword=test");
  });

  test("languageを指定するとクエリに含まれる", async () => {
    await fetchMySnippets({ language: "typescript" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("language=typescript");
  });

  test("tagを指定するとクエリに含まれる", async () => {
    await fetchMySnippets({ tag: "react" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("tag=react");
  });

  test("visibilityを指定するとクエリに含まれる", async () => {
    await fetchMySnippets({ visibility: "public" });

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("visibility=public");
  });

  test("page=1の場合はpageパラメータが省略される", async () => {
    await fetchMySnippets({ page: 1 });

    const url = new URL(mockFetcher.get.mock.calls[0][0] as string, "http://x");
    expect(url.searchParams.has("page")).toBe(false);
  });

  test("page>1の場合はpageパラメータが含まれる", async () => {
    await fetchMySnippets({ page: 3 });

    const url = new URL(mockFetcher.get.mock.calls[0][0] as string, "http://x");
    expect(url.searchParams.get("page")).toBe("3");
  });

  test("ownerHashがある場合はcache-keyとrevalidateが指定される", async () => {
    await fetchMySnippets({}, "hash123");

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).toContain("cache-key=hash123");
    expect(mockFetcher.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ revalidate: 60 }),
    );
  });

  test("ownerHashがない場合はcache-keyもcacheオプションもない", async () => {
    await fetchMySnippets({});

    const url = mockFetcher.get.mock.calls[0][0] as string;
    expect(url).not.toContain("cache-key");
    expect(mockFetcher.get).toHaveBeenCalledWith(expect.any(String), undefined);
  });

  test("APIエラーの場合はOutcomeErrorを返す", async () => {
    mockFetcher.get.mockRejectedValue(new BackendFailure("Error", 500));

    const result = await fetchMySnippets();

    expect(result.isErr()).toBe(true);
  });
});
