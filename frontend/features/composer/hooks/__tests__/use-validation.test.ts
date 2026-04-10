/* @vitest-environment jsdom */
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { useValidation } from "../use-validation";

const TestSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(10, "10文字以内です"),
  code: z.string().min(1, "コードは必須です"),
});

describe("useValidation", () => {
  test("初期状態でエラーがない", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    expect(result.current.mergedErrors).toEqual({});
    expect(result.current.hasErrors).toBe(false);
    expect(result.current.errorCount).toBe(0);
  });

  test("validateAllで全フィールドを検証しエラーを返す", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    let errors: Record<string, string | undefined>;
    act(() => {
      errors = result.current.validateAll({ title: "", code: "" });
    });

    expect(errors!.title).toBe("タイトルは必須です");
    expect(errors!.code).toBe("コードは必須です");
    expect(result.current.hasErrors).toBe(true);
  });

  test("validateAllで有効なデータの場合は空オブジェクトを返す", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    let errors: Record<string, string | undefined>;
    act(() => {
      errors = result.current.validateAll({ title: "ok", code: "ok" });
    });

    expect(errors!).toEqual({});
    expect(result.current.hasErrors).toBe(false);
  });

  test("validateFieldは初回submit前にはエラーを表示しない", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.validateField("title", "");
    });

    expect(result.current.mergedErrors.title).toBeUndefined();
  });

  test("validateFieldは初回submit後にエラーを表示する", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.validateAll({ title: "", code: "" });
    });

    act(() => {
      result.current.validateField("title", "");
    });

    expect(result.current.mergedErrors.title).toBe("タイトルは必須です");
  });

  test("validateFieldでエラーが解消されるとクリアされる", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.validateAll({ title: "", code: "" });
    });

    act(() => {
      result.current.validateField("title", "valid");
    });

    expect(result.current.mergedErrors.title).toBeUndefined();
  });

  test("setServerErrorsでサーバーエラーを反映する", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.setServerErrors({
        title: ["サーバーエラー"],
        code: ["コードが不正です", "2番目のエラー"],
      });
    });

    expect(result.current.mergedErrors.title).toBe("サーバーエラー");
    expect(result.current.mergedErrors.code).toBe("コードが不正です");
  });

  test("クライアントエラーがサーバーエラーより優先される", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.setServerErrors({ title: ["サーバーエラー"] });
    });

    act(() => {
      result.current.validateAll({ title: "", code: "ok" });
    });

    expect(result.current.mergedErrors.title).toBe("タイトルは必須です");
  });

  test("clearServerErrorで指定フィールドのサーバーエラーをクリアする", () => {
    const { result } = renderHook(() => useValidation(TestSchema));

    act(() => {
      result.current.setServerErrors({ title: ["サーバーエラー"] });
    });

    act(() => {
      result.current.clearServerError("title");
    });

    expect(result.current.mergedErrors.title).toBeUndefined();
  });
});
