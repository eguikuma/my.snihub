import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InvalidEnvironmentVariable } from "@/foundations/errors";
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

const createRequest = (referer?: string) => {
  const headers = new Headers();
  if (referer) headers.set("Referer", referer);
  return new Request("http://localhost/api/sessions/oauth/github", { headers });
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("crypto", {
    randomUUID: () => "test-uuid",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.GITHUB_CLIENT_ID;
});

describe("OAuth initiation route", () => {
  test("GITHUB_CLIENT_IDが未設定の場合はInvalidEnvironmentVariableをスローする", async () => {
    delete process.env.GITHUB_CLIENT_ID;

    await expect(GET(createRequest())).rejects.toThrow(
      InvalidEnvironmentVariable,
    );
  });

  test("正常フローでstateがセッションに保存される", async () => {
    process.env.GITHUB_CLIENT_ID = "test-client-id";
    const mockSave = vi.fn();
    const sessionData: Record<string, unknown> = { save: mockSave };
    mockSession.get.mockResolvedValue(sessionData);

    await GET(createRequest("http://localhost/snippets"));

    expect(sessionData.state).toBe("test-uuid");
    expect(sessionData.redirectTo).toBe("/snippets");
    expect(mockSave).toHaveBeenCalled();
  });

  test("リダイレクトURLにclient_id, state, scopeが含まれる", async () => {
    process.env.GITHUB_CLIENT_ID = "test-client-id";
    const sessionData: Record<string, unknown> = { save: vi.fn() };
    mockSession.get.mockResolvedValue(sessionData);

    const response = await GET(createRequest());

    const location = new URL(response.headers.get("Location")!);
    expect(location.origin).toBe("https://github.com");
    expect(location.pathname).toBe("/login/oauth/authorize");
    expect(location.searchParams.get("client_id")).toBe("test-client-id");
    expect(location.searchParams.get("state")).toBe("test-uuid");
    expect(location.searchParams.get("scope")).toBe("read:user user:email");
  });
});
