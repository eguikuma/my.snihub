import { beforeEach, describe, expect, test, vi } from "vitest";
import { logout } from "../logout";

const mockFetcher = vi.hoisted(() => ({
  delete: vi.fn(),
}));
vi.mock("@/foundations/libraries/fetcher", () => ({
  fetcher: mockFetcher,
}));

const mockSession = vi.hoisted(() => ({
  destroy: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("logout", () => {
  test("バックエンドのセッション削除エンドポイントを呼ぶ", async () => {
    mockFetcher.delete.mockResolvedValue(undefined);
    mockSession.destroy.mockResolvedValue(undefined);

    await logout();

    expect(mockFetcher.delete).toHaveBeenCalledWith("/api/sessions/current");
  });

  test("バックエンド呼び出し成功後にローカルセッションを破棄する", async () => {
    mockFetcher.delete.mockResolvedValue(undefined);
    mockSession.destroy.mockResolvedValue(undefined);

    await logout();

    expect(mockSession.destroy).toHaveBeenCalled();
  });

  test("バックエンド呼び出しが失敗してもローカルセッションは破棄する", async () => {
    mockFetcher.delete.mockRejectedValue(new Error("Network error"));
    mockSession.destroy.mockResolvedValue(undefined);

    await logout().catch(() => {});

    expect(mockSession.destroy).toHaveBeenCalled();
  });
});
