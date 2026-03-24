import { describe, expect, test } from "vitest";
import { toShortenedLines, toTruncatedLines } from "../code";

describe("toTruncatedLines", () => {
  test("指定行数で切り詰める", () => {
    const source = "line1\nline2\nline3\nline4\nline5";

    expect(toTruncatedLines(source, 3)).toEqual(["line1", "line2", "line3"]);
  });

  test("行数が足りない場合はそのまま返す", () => {
    const source = "line1\nline2";

    expect(toTruncatedLines(source, 5)).toEqual(["line1", "line2"]);
  });

  test("空文字列は空文字列1要素の配列になる", () => {
    expect(toTruncatedLines("", 3)).toEqual([""]);
  });
});

describe("toShortenedLines", () => {
  test("最大文字数を超えた行に省略記号を付加する", () => {
    const lines = ["short", "this is a very long line"];

    expect(toShortenedLines(lines, 10)).toEqual([
      "short",
      "this is a ...".slice(0, 10) + "...",
    ]);
  });

  test("最大文字数以下の行はそのまま返す", () => {
    const lines = ["abc", "def"];

    expect(toShortenedLines(lines, 10)).toEqual(["abc", "def"]);
  });

  test("ちょうど最大文字数の行はそのまま返す", () => {
    const lines = ["1234567890"];

    expect(toShortenedLines(lines, 10)).toEqual(["1234567890"]);
  });
});
