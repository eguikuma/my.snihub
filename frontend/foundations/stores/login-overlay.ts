"use client";

import { create } from "zustand";

type LoginOverlayState = {
  isOpen: boolean;
  isForceNonClosing: boolean;
  open: (options?: { isForceNonClosing?: boolean }) => void;
  close: () => void;
};

/**
 * ログインオーバーレイの表示状態を管理する
 */
export const useLoginOverlay = create<LoginOverlayState>((set) => ({
  isOpen: false,
  isForceNonClosing: false,
  open: (options = { isForceNonClosing: false }) =>
    set({ isOpen: true, isForceNonClosing: options.isForceNonClosing }),
  close: () => set({ isOpen: false }),
}));
