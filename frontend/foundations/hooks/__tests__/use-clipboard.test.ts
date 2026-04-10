/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useClipboard } from "../use-clipboard";

const mockNotify = vi.hoisted(() => vi.fn());
vi.mock("@/foundations/stores", () => ({
  useToastStore: (selector: (state: { notify: () => void }) => unknown) =>
    selector({ notify: mockNotify }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useClipboard", () => {
  test("copy()でクリップボードに書き込みisCopied=trueになる", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(result.current.isCopied).toBe(true);
  });

  test("copy()でトースト通知が表示される", async () => {
    const { result } = renderHook(() =>
      useClipboard({ copiedLabel: "カスタム通知" }),
    );

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(mockNotify).toHaveBeenCalledWith("カスタム通知");
  });

  test("関数を渡した場合は評価結果がコピーされる", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy(() => "dynamic");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("dynamic");
  });

  test("2秒後にisCopiedがfalseに戻る", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isCopied).toBe(false);
  });

  test("クリップボードAPI失敗時にエラーをスローしない", async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
      new Error("Not allowed"),
    );
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("hello");
    });

    expect(result.current.isCopied).toBe(false);
  });
});
