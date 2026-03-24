import { describe, expect, test } from "vitest";
import { BackendFailure, BackendUnreadable } from "../../errors";
import { toMessage, toOutcomeError } from "../outcome";

describe("toOutcomeError", () => {
  test("404エラーをnot_foundに変換する", () => {
    const error = new BackendFailure("Not Found", 404);

    expect(toOutcomeError(error)).toEqual({ kind: "not_found" });
  });

  test("401エラーをunauthorizedに変換する", () => {
    const error = new BackendFailure("Unauthorized", 401);

    expect(toOutcomeError(error)).toEqual({ kind: "unauthorized" });
  });

  test("422エラーをvalidationに変換する", () => {
    const fields = { title: ["タイトルは必須です"] };
    const error = new BackendFailure("Validation Error", 422, fields);

    expect(toOutcomeError(error)).toEqual({ kind: "validation", fields });
  });

  test("500エラーをserverに変換する", () => {
    const error = new BackendFailure("Internal Server Error", 500);
    const result = toOutcomeError(error);

    expect(result.kind).toBe("server");
  });

  test("BackendUnreadableをnetworkに変換する", () => {
    const error = new BackendUnreadable();
    const result = toOutcomeError(error);

    expect(result.kind).toBe("network");
  });

  test("未知のエラーをserverに変換する", () => {
    const result = toOutcomeError(new Error("unknown"));

    expect(result).toEqual({
      kind: "server",
      message: "予期しないエラーが発生しました",
    });
  });
});

describe("toMessage", () => {
  test("各エラー種別に対応するメッセージを返す", () => {
    expect(toMessage({ kind: "not_found" })).toBe(
      "リソースが見つかりませんでした",
    );
    expect(toMessage({ kind: "unauthorized" })).toBe("認証が必要です");
    expect(toMessage({ kind: "server", message: "" })).toBe(
      "サーバーでエラーが発生しました",
    );
    expect(toMessage({ kind: "network", message: "" })).toBe(
      "ネットワークエラーが発生しました",
    );
    expect(toMessage({ kind: "validation", fields: { title: ["必須"] } })).toBe(
      "入力内容に問題があります",
    );
  });
});
