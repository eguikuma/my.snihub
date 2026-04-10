import { describe, expect, test } from "vitest";
import { buildPageNumbers } from "../page-numbers";

describe("buildPageNumbers", () => {
  test("ページが1つしかない場合は[1]を返す", () => {
    expect(buildPageNumbers(1, 1)).toEqual([1]);
  });

  test("ページが2つの場合は[1, 2]を返す", () => {
    expect(buildPageNumbers(1, 2)).toEqual([1, 2]);
  });

  test("先頭ページが現在の場合は先頭付近を表示する", () => {
    expect(buildPageNumbers(1, 10)).toEqual([1, 2, 3, null, 10]);
  });

  test("末尾ページが現在の場合は末尾付近を表示する", () => {
    expect(buildPageNumbers(10, 10)).toEqual([1, null, 8, 9, 10]);
  });

  test("中間ページが現在の場合は前後2ページを表示する", () => {
    expect(buildPageNumbers(5, 10)).toEqual([1, null, 3, 4, 5, 6, 7, null, 10]);
  });

  test("先頭と表示範囲が隣接する場合は省略記号を挿入しない", () => {
    expect(buildPageNumbers(3, 10)).toEqual([1, 2, 3, 4, 5, null, 10]);
  });

  test("末尾と表示範囲が隣接する場合は省略記号を挿入しない", () => {
    expect(buildPageNumbers(8, 10)).toEqual([1, null, 6, 7, 8, 9, 10]);
  });

  test("ページ数が少なく省略不要な場合は全ページを返す", () => {
    expect(buildPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  test("ページが3つの場合は省略なしで返す", () => {
    expect(buildPageNumbers(2, 3)).toEqual([1, 2, 3]);
  });
});
