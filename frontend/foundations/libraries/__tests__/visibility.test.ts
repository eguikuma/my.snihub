import { describe, expect, test } from "vitest";
import { toVisibility } from "../visibility";

describe("toVisibility", () => {
  test("有効な公開範囲をVisibility型として返す", () => {
    expect(toVisibility("public")).toBe("public");
    expect(toVisibility("unlisted")).toBe("unlisted");
    expect(toVisibility("private")).toBe("private");
  });

  test("無効な文字列はundefinedを返す", () => {
    expect(toVisibility("invalid")).toBeUndefined();
    expect(toVisibility("")).toBeUndefined();
    expect(toVisibility("Public")).toBeUndefined();
  });
});
