import { describe, expect, test } from "vitest";
import { SnippetDraft } from "../snippet-draft";

const validDraft = {
  title: "Test Snippet",
  code: "console.log('hello')",
  language: "typescript",
  description: "",
  visibility: "unlisted",
  expiration: null,
  tags: [],
};

describe("SnippetDraft", () => {
  test("有効なデータをパースできる", () => {
    const result = SnippetDraft.safeParse(validDraft);

    expect(result.success).toBe(true);
  });

  test("titleが空文字の場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({ ...validDraft, title: "" });

    expect(result.success).toBe(false);
  });

  test("titleが255文字を超える場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      title: "a".repeat(256),
    });

    expect(result.success).toBe(false);
  });

  test("codeが空文字の場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({ ...validDraft, code: "" });

    expect(result.success).toBe(false);
  });

  test("codeが100,000文字を超える場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      code: "a".repeat(100_001),
    });

    expect(result.success).toBe(false);
  });

  test("descriptionが1,000文字を超える場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      description: "a".repeat(1_001),
    });

    expect(result.success).toBe(false);
  });

  test("無効な言語識別子はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      language: "invalid",
    });

    expect(result.success).toBe(false);
  });

  test("無効な公開範囲はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      visibility: "invalid",
    });

    expect(result.success).toBe(false);
  });

  test("有効な有効期限をパースできる", () => {
    for (const expiration of ["1h", "1d", "1w", null]) {
      const result = SnippetDraft.safeParse({ ...validDraft, expiration });

      expect(result.success).toBe(true);
    }
  });

  test("無効な有効期限はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      expiration: "2h",
    });

    expect(result.success).toBe(false);
  });

  test("タグが10個を超える場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
    });

    expect(result.success).toBe(false);
  });

  test("タグが50文字を超える場合はパースに失敗する", () => {
    const result = SnippetDraft.safeParse({
      ...validDraft,
      tags: ["a".repeat(51)],
    });

    expect(result.success).toBe(false);
  });
});
