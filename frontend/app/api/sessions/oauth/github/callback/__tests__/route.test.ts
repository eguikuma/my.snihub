import { beforeEach, describe, expect, test, vi } from "vitest";
import type { User } from "@/foundations/schemas";
import { GET } from "../route";

vi.mock("next/server", () => ({
  NextResponse: {
    redirect: (url: string | URL) =>
      new Response(null, {
        status: 307,
        headers: { Location: String(url) },
      }),
  },
}));

const mockSession = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

const mockFetcher = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
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

const createRequest = (params: Record<string, string> = {}) => {
  const url = new URL("http://localhost/api/sessions/oauth/github/callback");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return new Request(url.toString());
};

const createMockSession = (
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  save: vi.fn(),
  destroy: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe("OAuth callback route", () => {
  test("codeがない場合はoauth-failedへリダイレクトする", async () => {
    const sessionData = createMockSession({ state: "valid-state" });
    mockSession.get.mockResolvedValue(sessionData);

    const response = await GET(createRequest({ state: "valid-state" }));

    expect(response.headers.get("Location")).toContain("oauth-failed");
  });

  test("stateが不一致の場合はoauth-failedへリダイレクトする", async () => {
    const sessionData = createMockSession({ state: "correct-state" });
    mockSession.get.mockResolvedValue(sessionData);

    const response = await GET(
      createRequest({ code: "auth-code", state: "wrong-state" }),
    );

    expect(response.headers.get("Location")).toContain("oauth-failed");
  });

  test("トークン取得に成功した場合はセッションにトークンが保存される", async () => {
    const sessionData = createMockSession({ state: "valid-state" });
    mockSession.get.mockResolvedValue(sessionData);
    mockFetcher.post.mockResolvedValue({ token: "new-token" });
    mockFetcher.get.mockResolvedValue({ data: validUser });

    await GET(createRequest({ code: "auth-code", state: "valid-state" }));

    expect(sessionData.token).toBe("new-token");
    expect(sessionData.save).toHaveBeenCalled();
  });

  test("ユーザー情報取得に成功した場合はセッションにuserとownerHashが保存される", async () => {
    const sessionData = createMockSession({ state: "valid-state" });
    mockSession.get.mockResolvedValue(sessionData);
    mockFetcher.post.mockResolvedValue({ token: "new-token" });
    mockFetcher.get.mockResolvedValue({ data: validUser });

    await GET(createRequest({ code: "auth-code", state: "valid-state" }));

    expect(sessionData.user).toEqual(validUser);
    expect(sessionData.ownerHash).toBe("hash123");
  });

  test("ユーザー情報取得に失敗してもログインは続行される", async () => {
    const sessionData = createMockSession({ state: "valid-state" });
    mockSession.get.mockResolvedValue(sessionData);
    mockFetcher.post.mockResolvedValue({ token: "new-token" });
    mockFetcher.get.mockRejectedValue(new Error("Network error"));

    const response = await GET(
      createRequest({ code: "auth-code", state: "valid-state" }),
    );

    const location = response.headers.get("Location")!;
    expect(location).not.toContain("oauth-failed");
    expect(sessionData.save).toHaveBeenCalled();
  });

  test("redirectToがセッションにある場合はそこへリダイレクトする", async () => {
    const sessionData = createMockSession({
      state: "valid-state",
      redirectTo: "/snippets/mine",
    });
    mockSession.get.mockResolvedValue(sessionData);
    mockFetcher.post.mockResolvedValue({ token: "new-token" });
    mockFetcher.get.mockResolvedValue({ data: validUser });

    const response = await GET(
      createRequest({ code: "auth-code", state: "valid-state" }),
    );

    expect(response.headers.get("Location")).toContain("/snippets/mine");
  });
});
