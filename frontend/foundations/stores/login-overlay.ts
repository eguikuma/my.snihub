"use client";

import { create } from "zustand";

type LoginOverlayState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

/**
 * ログインオーバーレイの表示状態を管理する
 */
export const useLoginOverlay = create<LoginOverlayState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
