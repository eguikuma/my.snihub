import { describe, expect, test } from "vitest";
import { Snippet, SnippetSummary } from "../snippet";

const validSnippetData = {
  slug: "abc123",
  title: "テストスニペット",
  language: "typescript",
  description: "説明文",
  visibility: "public",
  expires_at: null,
  expires_in: null,
  tags: ["react", "hooks"],
  user: { name: "testuser", avatar_url: "https://example.com/avatar.png" },
  is_owner: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("Snippet", () => {
  test("有効なデータをパースできる", () => {
    const data = { ...validSnippetData, code: "console.log('hello');" };
    const result = Snippet.safeParse(data);

    expect(result.success).toBe(true);
  });

  test("codeが欠けている場合はパースに失敗する", () => {
    const result = Snippet.safeParse(validSnippetData);

    expect(result.success).toBe(false);
  });

  test("無効な言語識別子はパースに失敗する", () => {
    const data = {
      ...validSnippetData,
      code: "test",
      language: "invalid_lang",
    };
    const result = Snippet.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("無効な公開範囲はパースに失敗する", () => {
    const data = {
      ...validSnippetData,
      code: "test",
      visibility: "secret",
    };
    const result = Snippet.safeParse(data);

    expect(result.success).toBe(false);
  });

  test("descriptionとexpires_atがnullでもパースできる", () => {
    const data = {
      ...validSnippetData,
      code: "test",
      description: null,
      expires_at: null,
    };
    const result = Snippet.safeParse(data);

    expect(result.success).toBe(true);
  });
});

describe("SnippetSummary", () => {
  test("code_previewフィールドでパースできる", () => {
    const data = {
      ...validSnippetData,
      code_preview: "console.log(...",
    };
    const result = SnippetSummary.safeParse(data);

    expect(result.success).toBe(true);
  });

  test("codeフィールドではパースに失敗する", () => {
    const data = {
      ...validSnippetData,
      code: "console.log('hello');",
    };
    const result = SnippetSummary.safeParse(data);

    expect(result.success).toBe(false);
  });
});
