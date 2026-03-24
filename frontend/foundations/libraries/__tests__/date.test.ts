import { describe, expect, test } from "vitest";
import { toYYYYMMDDHHmm } from "../date";

describe("toYYYYMMDDHHmm", () => {
  test("ISO 8601形式をJSTの「YYYY-MM-DD HH:mm」に変換する", () => {
    /** 2026-01-15T00:00:00Z (UTC) → 2026-01-15 09:00 (JST) */
    expect(toYYYYMMDDHHmm("2026-01-15T00:00:00Z")).toBe("2026-01-15 09:00");
  });

  test("UTC午後の時刻を正しく変換する", () => {
    /** 2026-03-25T15:30:00Z (UTC) → 2026-03-26 00:30 (JST) */
    expect(toYYYYMMDDHHmm("2026-03-25T15:30:00Z")).toBe("2026-03-26 00:30");
  });
});
