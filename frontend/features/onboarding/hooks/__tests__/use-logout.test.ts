/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useLogout } from "../use-logout";

const mockRouter = vi.hoisted(() => ({
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

const mockLogout = vi.hoisted(() => vi.fn());
vi.mock("../../actions/logout", () => ({
  logout: mockLogout,
}));

const mockClear = vi.hoisted(() => vi.fn());
vi.mock("@/foundations/stores", () => ({
  useSessionStore: (selector: (state: { clear: () => void }) => unknown) =>
    selector({ clear: mockClear }),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useLogout", () => {
  test("初期状態でisLoggingOut=false", () => {
    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoggingOut).toBe(false);
  });

  test("handleLogout成功時にストアをクリアしrouter.refreshを呼ぶ", async () => {
    mockLogout.mockResolvedValue(undefined);
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockClear).toHaveBeenCalled();
    expect(mockRouter.refresh).toHaveBeenCalled();
  });

  test("handleLogout失敗時はisLoggingOut=falseに戻りリトライ可能になる", async () => {
    mockLogout.mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(result.current.isLoggingOut).toBe(false);
    expect(mockClear).not.toHaveBeenCalled();
  });

  test("二重呼び出しはロックで防止される", async () => {
    let resolveLogout: () => void;
    mockLogout.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve;
        }),
    );
    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current.handleLogout();
    });

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveLogout!();
    });
  });
});
