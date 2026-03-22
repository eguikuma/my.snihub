"use client";

import { create } from "zustand";
import type { User } from "../schemas";

type SessionState = {
  /**
   * ログイン中のユーザー情報
   */
  user: User | null;
  /**
   * サーバー側で取得したユーザー情報をクライアントのストアに同期する
   */
  hydrate: (user: User | null) => void;
  /**
   * ユーザー情報を破棄する
   */
  clear: () => void;
};

/**
 * 認証セッションの状態を管理する
 */
export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  hydrate: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
