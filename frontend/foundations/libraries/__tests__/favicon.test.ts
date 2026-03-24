import { describe, expect, test } from "vitest";
import { favicon } from "../favicon";

describe("favicon.toDataUrl", () => {
  test("SVGのdata URLを生成する", () => {
    const result = favicon.toDataUrl("#ff0000");

    expect(result).toMatch(/^data:image\/svg\+xml,/);
  });

  test("アクセントカラーがSVGに含まれる", () => {
    const result = decodeURIComponent(favicon.toDataUrl("#3b82f6"));

    expect(result).toContain('fill="#3b82f6"');
  });
});
