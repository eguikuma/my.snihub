/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useTagInput } from "../use-tag-input";

describe("useTagInput", () => {
  test("初期状態でinputが空文字", () => {
    const { result } = renderHook(() =>
      useTagInput({ tags: [], onChange: vi.fn() }),
    );

    expect(result.current.input).toBe("");
    expect(result.current.isAtLimit).toBe(false);
  });

  test("addTagでトリムされたタグが追加される", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useTagInput({ tags: ["existing"], onChange }),
    );

    act(() => {
      result.current.setInput("  newTag  ");
    });

    act(() => {
      result.current.addTag();
    });

    expect(onChange).toHaveBeenCalledWith(["existing", "newTag"]);
    expect(result.current.input).toBe("");
  });

  test("空文字のタグは追加されない", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useTagInput({ tags: [], onChange }));

    act(() => {
      result.current.setInput("   ");
    });

    act(() => {
      result.current.addTag();
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test("重複するタグは追加されない", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useTagInput({ tags: ["react"], onChange }),
    );

    act(() => {
      result.current.setInput("react");
    });

    act(() => {
      result.current.addTag();
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test("50文字を超えるタグは追加されない", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useTagInput({ tags: [], onChange }));

    act(() => {
      result.current.setInput("a".repeat(51));
    });

    act(() => {
      result.current.addTag();
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test("タグが10個の場合はisAtLimit=trueで追加不可", () => {
    const tags = Array.from({ length: 10 }, (_, i) => `tag${i}`);
    const onChange = vi.fn();
    const { result } = renderHook(() => useTagInput({ tags, onChange }));

    expect(result.current.isAtLimit).toBe(true);

    act(() => {
      result.current.setInput("newTag");
    });

    act(() => {
      result.current.addTag();
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test("removeTagで指定インデックスのタグが削除される", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useTagInput({ tags: ["a", "b", "c"], onChange }),
    );

    act(() => {
      result.current.removeTag(1);
    });

    expect(onChange).toHaveBeenCalledWith(["a", "c"]);
  });
});
