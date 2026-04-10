import { beforeEach, describe, expect, test, vi } from "vitest";
import type { User } from "@/foundations/schemas";
import type { Token } from "@/foundations/schemas/brand";
import { fetchMe } from "../fetch-me";

vi.mock("react", () => ({
  cache: <T>(fn: T) => fn,
}));

const mockSession = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

const mockFetcher = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const validUser: User = {
  name: "testuser",
  email: "test@example.com",
  avatar_url: "https://example.com/avatar.png",
  owner_hash: "hash123",
  providers: ["github"],
  created_at: "2025-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("fetchMe", () => {
  test("トークンがない場合はnullを返す", async () => {
    mockSession.get.mockResolvedValue({ token: undefined });

    const result = await fetchMe();

    expect(result).toBeNull();
    expect(mockFetcher.get).not.toHaveBeenCalled();
  });

  test("セッションにユーザーがある場合はAPIコールなしで返す", async () => {
    mockSession.get.mockResolvedValue({
      token: "tok" as Token,
      user: validUser,
    });

    const result = await fetchMe();

    expect(result).toEqual(validUser);
    expect(mockFetcher.get).not.toHaveBeenCalled();
  });

  test("セッションにトークンのみがある場合はAPIから取得して返す", async () => {
    mockSession.get.mockResolvedValue({
      token: "tok" as Token,
      user: undefined,
    });
    mockFetcher.get.mockResolvedValue({ data: validUser });

    const result = await fetchMe();

    expect(result).toEqual(validUser);
    expect(mockFetcher.get).toHaveBeenCalledWith("/api/me");
  });

  test("API呼び出しが失敗した場合はnullを返す", async () => {
    mockSession.get.mockResolvedValue({
      token: "tok" as Token,
      user: undefined,
    });
    mockFetcher.get.mockRejectedValue(new Error("Network error"));

    const result = await fetchMe();

    expect(result).toBeNull();
  });

  test("Zodバリデーションが失敗した場合はnullを返す", async () => {
    mockSession.get.mockResolvedValue({
      token: "tok" as Token,
      user: undefined,
    });
    mockFetcher.get.mockResolvedValue({ data: { invalid: true } });

    const result = await fetchMe();

    expect(result).toBeNull();
  });
});
