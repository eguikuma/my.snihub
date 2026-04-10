import { beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure } from "@/foundations/errors";
import { fetchMySnippetStatistics } from "../fetch-my-snippet-statistics";

const mockFetcher = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const validStatistics = {
  total: 10,
  public: 5,
  unlisted: 3,
  private: 2,
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchMySnippetStatistics", () => {
  test("ownerHashがある場合はcache-keyとrevalidateが指定される", async () => {
    mockFetcher.get.mockResolvedValue(validStatistics);

    const result = await fetchMySnippetStatistics("hash123");

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/me/snippets/statistics?cache-key=hash123",
      expect.objectContaining({ revalidate: 60 }),
    );
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(validStatistics);
  });

  test("ownerHashがない場合はcache-keyもcacheオプションもない", async () => {
    mockFetcher.get.mockResolvedValue(validStatistics);

    await fetchMySnippetStatistics();

    expect(mockFetcher.get).toHaveBeenCalledWith(
      "/api/me/snippets/statistics",
      undefined,
    );
  });

  test("APIエラーの場合はOutcomeErrorを返す", async () => {
    mockFetcher.get.mockRejectedValue(new BackendFailure("Error", 500));

    const result = await fetchMySnippetStatistics();

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().kind).toBe("server");
  });
});
