import { beforeEach, describe, expect, test } from "vitest";
import type { User } from "../../schemas";
import { useSessionStore } from "../session";

const validUser: User = {
  name: "testuser",
  email: "test@example.com",
  avatar_url: "https://example.com/avatar.png",
  providers: ["github"],
  created_at: "2025-01-01T00:00:00Z",
};

beforeEach(() => {
  useSessionStore.setState({ user: null });
});

describe("useSessionStore", () => {
  test("初期状態でuserがnull", () => {
    expect(useSessionStore.getState().user).toBeNull();
  });

  test("hydrate()でユーザー情報を設定する", () => {
    useSessionStore.getState().hydrate(validUser);

    expect(useSessionStore.getState().user).toEqual(validUser);
  });

  test("hydrate(null)でユーザー情報をnullにする", () => {
    useSessionStore.getState().hydrate(validUser);

    useSessionStore.getState().hydrate(null);

    expect(useSessionStore.getState().user).toBeNull();
  });

  test("clear()でユーザー情報を破棄する", () => {
    useSessionStore.getState().hydrate(validUser);

    useSessionStore.getState().clear();

    expect(useSessionStore.getState().user).toBeNull();
  });
});
