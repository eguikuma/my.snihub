import { describe, expect, test } from "vitest";
import { toSafeRedirectPath } from "../path";

describe("toSafeRedirectPath", () => {
  test("有効なURLからパスを抽出する", () => {
    expect(toSafeRedirectPath("https://example.com/snippets/abc")).toBe(
      "/snippets/abc",
    );
  });

  test("nullの場合はルートを返す", () => {
    expect(toSafeRedirectPath(null)).toBe("/");
  });

  test("不正な文字列の場合はルートを返す", () => {
    expect(toSafeRedirectPath("not-a-url")).toBe("/");
  });

  test("クエリパラメータは含めない", () => {
    expect(toSafeRedirectPath("https://example.com/page?foo=bar")).toBe(
      "/page",
    );
  });

  test("ルートURLの場合はスラッシュを返す", () => {
    expect(toSafeRedirectPath("https://example.com")).toBe("/");
  });
});
