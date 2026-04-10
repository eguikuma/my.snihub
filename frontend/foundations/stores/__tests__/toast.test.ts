import { beforeEach, describe, expect, test } from "vitest";
import { useToastStore } from "../toast";

beforeEach(() => {
  useToastStore.setState({ message: null });
});

describe("useToastStore", () => {
  test("初期状態でmessageがnull", () => {
    expect(useToastStore.getState().message).toBeNull();
  });

  test("notify()でメッセージを設定する", () => {
    useToastStore.getState().notify("コピーしました");

    expect(useToastStore.getState().message).toBe("コピーしました");
  });

  test("hide()でメッセージをクリアする", () => {
    useToastStore.getState().notify("コピーしました");

    useToastStore.getState().hide();

    expect(useToastStore.getState().message).toBeNull();
  });
});
