/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useSearchInput } from "../use-search-input";

describe("useSearchInput", () => {
  test("初期値がexternalValueと同期される", () => {
    const { result } = renderHook(() => useSearchInput("initial", vi.fn()));

    expect(result.current.inputValue).toBe("initial");
  });

  test("handleChangeで入力値が即座に更新される", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useSearchInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "typed" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue).toBe("typed");
    expect(onCommit).not.toHaveBeenCalled();
  });

  test("handleSubmitでonCommitが呼ばれる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useSearchInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "search term" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(onCommit).toHaveBeenCalledWith("search term");
  });

  test("handleClearで入力値がリセットされonCommitが即座に呼ばれる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useSearchInput("initial", onCommit));

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.inputValue).toBe("");
    expect(onCommit).toHaveBeenCalledWith("");
  });

  test("IME合成中はhandleSubmitでコミットしない", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useSearchInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "日本語" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCompositionStart();
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(onCommit).not.toHaveBeenCalled();
  });

  test("IME合成終了後はhandleSubmitでコミットできる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useSearchInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "日本語" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCompositionStart();
    });

    act(() => {
      result.current.handleCompositionEnd();
    });

    act(() => {
      result.current.handleSubmit();
    });

    expect(onCommit).toHaveBeenCalledWith("日本語");
  });

  test("externalValueが変わるとinputValueが同期される", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useSearchInput(value, vi.fn()),
      { initialProps: { value: "old" } },
    );

    rerender({ value: "new" });

    expect(result.current.inputValue).toBe("new");
  });
});
