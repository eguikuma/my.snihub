import { describe, expect, test } from "vitest";
import { toLanguage, toLanguageLabel } from "../language";

describe("toLanguage", () => {
  test("有効な言語識別子をLanguage型として返す", () => {
    expect(toLanguage("typescript")).toBe("typescript");
    expect(toLanguage("python")).toBe("python");
    expect(toLanguage("go")).toBe("go");
  });

  test("無効な文字列はundefinedを返す", () => {
    expect(toLanguage("invalid")).toBeUndefined();
    expect(toLanguage("")).toBeUndefined();
    expect(toLanguage("TypeScript")).toBeUndefined();
  });
});

describe("toLanguageLabel", () => {
  test("言語識別子をUIラベルに変換する", () => {
    expect(toLanguageLabel("typescript")).toBe("TypeScript");
    expect(toLanguageLabel("javascript")).toBe("JavaScript");
    expect(toLanguageLabel("cpp")).toBe("C++");
    expect(toLanguageLabel("csharp")).toBe("C#");
    expect(toLanguageLabel("plaintext")).toBe("Plain Text");
  });
});
