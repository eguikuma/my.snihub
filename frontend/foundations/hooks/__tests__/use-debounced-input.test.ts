/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { useDebouncedInput } from "../use-debounced-input";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedInput", () => {
  test("初期値がexternalValueと同期される", () => {
    const { result } = renderHook(() => useDebouncedInput("initial", vi.fn()));

    expect(result.current.inputValue).toBe("initial");
  });

  test("handleChangeで入力値が即座に更新される", () => {
    const { result } = renderHook(() => useDebouncedInput("", vi.fn()));

    act(() => {
      result.current.handleChange({
        target: { value: "typed" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue).toBe("typed");
  });

  test("300ms後にonCommitが呼ばれる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "search" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(onCommit).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onCommit).toHaveBeenCalledWith("search");
  });

  test("連続入力ではデバウンスで最後の値のみコミットされる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("", onCommit));

    act(() => {
      result.current.handleChange({
        target: { value: "a" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    act(() => {
      result.current.handleChange({
        target: { value: "ab" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith("ab");
  });

  test("handleClearで入力値がリセットされonCommitが即座に呼ばれる", () => {
    const onCommit = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("initial", onCommit));

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.inputValue).toBe("");
    expect(onCommit).toHaveBeenCalledWith("");
  });
});
