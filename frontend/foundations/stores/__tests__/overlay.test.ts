import { beforeEach, describe, expect, test } from "vitest";
import { useOverlayStore } from "../overlay";

beforeEach(() => {
  useOverlayStore.setState({ isOpen: false });
});

describe("useOverlayStore", () => {
  test("初期状態でisOpenがfalse", () => {
    expect(useOverlayStore.getState().isOpen).toBe(false);
  });

  test("open()でisOpenをtrueにする", () => {
    useOverlayStore.getState().open();

    expect(useOverlayStore.getState().isOpen).toBe(true);
  });

  test("close()でisOpenをfalseにする", () => {
    useOverlayStore.getState().open();

    useOverlayStore.getState().close();

    expect(useOverlayStore.getState().isOpen).toBe(false);
  });
});
