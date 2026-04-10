import { describe, expect, test } from "vitest";
import { User } from "../user";

const validUser = {
  name: "testuser",
  email: "test@example.com",
  avatar_url: "https://example.com/avatar.png",
  owner_hash: "hash123",
  providers: ["github"],
  created_at: "2025-01-01T00:00:00Z",
};

describe("User", () => {
  test("有効なデータをパースできる", () => {
    const result = User.safeParse(validUser);

    expect(result.success).toBe(true);
  });

  test("emailがnullでもパースできる", () => {
    const result = User.safeParse({ ...validUser, email: null });

    expect(result.success).toBe(true);
  });

  test("avatar_urlがnullでもパースできる", () => {
    const result = User.safeParse({ ...validUser, avatar_url: null });

    expect(result.success).toBe(true);
  });

  test("owner_hashが省略されてもパースできる", () => {
    const { owner_hash: _owner_hash, ...withoutOwnerHash } = validUser;
    const result = User.safeParse(withoutOwnerHash);

    expect(result.success).toBe(true);
    expect(result.data?.owner_hash).toBeUndefined();
  });

  test("nameが欠けている場合はパースに失敗する", () => {
    const { name: _name, ...withoutName } = validUser;
    const result = User.safeParse(withoutName);

    expect(result.success).toBe(false);
  });

  test("providersが配列でない場合はパースに失敗する", () => {
    const result = User.safeParse({ ...validUser, providers: "github" });

    expect(result.success).toBe(false);
  });
});
