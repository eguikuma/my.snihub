import { describe, expect, test } from "vitest";
import { Slug, Token } from "../brand";

describe("Slug", () => {
  test("from()で文字列をSlug型に変換する", () => {
    const slug = Slug.from("abc-123");

    expect(slug).toBe("abc-123");
  });

  test("schemaで文字列をSlug型にパースする", () => {
    const result = Slug.schema.safeParse("abc-123");

    expect(result.success).toBe(true);
    expect(result.data).toBe("abc-123");
  });
});

describe("Token", () => {
  test("from()で文字列をToken型に変換する", () => {
    const token = Token.from("secret-token");

    expect(token).toBe("secret-token");
  });

  test("schemaで文字列をToken型にパースする", () => {
    const result = Token.schema.safeParse("secret-token");

    expect(result.success).toBe(true);
    expect(result.data).toBe("secret-token");
  });
});
