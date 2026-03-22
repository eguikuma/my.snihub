"use client";

import { create } from "zustand";

type OverlayState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

/**
 * オーバーレイの表示状態を管理する
 */
export const useOverlayStore = create<OverlayState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
