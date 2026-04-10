/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Slug } from "@/foundations/schemas/brand";
import { useViewerMode } from "../use-viewer-mode";

const mockRouter = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

const mockDeleteSnippet = vi.hoisted(() => vi.fn());
vi.mock("@/features/collection/actions/delete-snippet", () => ({
  deleteSnippet: mockDeleteSnippet,
}));

beforeEach(() => {
  vi.resetAllMocks();
});

describe("useViewerMode", () => {
  test("初期状態でisEditing=false, isDeleting=false", () => {
    const { result } = renderHook(() => useViewerMode());

    expect(result.current.isEditing).toBe(false);
    expect(result.current.isDeleting).toBe(false);
  });

  test("startEditingでisEditing=trueになる", () => {
    const { result } = renderHook(() => useViewerMode());

    act(() => {
      result.current.viewerState.startEditing();
    });

    expect(result.current.isEditing).toBe(true);
  });

  test("handleCancelでisEditing=falseに戻る", () => {
    const { result } = renderHook(() => useViewerMode());

    act(() => {
      result.current.viewerState.startEditing();
    });

    act(() => {
      result.current.handleCancel();
    });

    expect(result.current.isEditing).toBe(false);
  });

  test("handleSuccessでrouter.refreshが呼ばれisEditing=falseに戻る", () => {
    const { result } = renderHook(() => useViewerMode());

    act(() => {
      result.current.viewerState.startEditing();
    });

    act(() => {
      result.current.handleSuccess();
    });

    expect(mockRouter.refresh).toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  test("startDeletingでisDeleting=trueになる", () => {
    const { result } = renderHook(() => useViewerMode());

    act(() => {
      result.current.viewerState.startDeleting();
    });

    expect(result.current.isDeleting).toBe(true);
  });

  test("closeDeletingでisDeleting=falseに戻る", () => {
    const { result } = renderHook(() => useViewerMode());

    act(() => {
      result.current.viewerState.startDeleting();
    });

    act(() => {
      result.current.closeDeleting();
    });

    expect(result.current.isDeleting).toBe(false);
  });

  test("handleDelete成功時にコレクションへ遷移する", async () => {
    mockDeleteSnippet.mockResolvedValue({ success: true });
    const { result } = renderHook(() => useViewerMode());

    await act(async () => {
      await result.current.handleDelete(Slug.from("test-slug"));
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/snippets/mine");
  });

  test("handleDelete失敗時は遷移しない", async () => {
    mockDeleteSnippet.mockResolvedValue({ success: false, errors: null });
    const { result } = renderHook(() => useViewerMode());

    await act(async () => {
      await result.current.handleDelete(Slug.from("test-slug"));
    });

    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
