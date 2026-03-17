"use client";

import { create } from "zustand";

type ToastState = {
  message: string | null;
  notify: (message: string) => void;
  hide: () => void;
};

/**
 * トーストの表示状態を管理する
 */
export const useToast = create<ToastState>((set) => ({
  message: null,
  notify: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
