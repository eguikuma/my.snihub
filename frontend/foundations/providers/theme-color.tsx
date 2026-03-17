"use client";

import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { createStore } from "zustand";
import { THEME_COOKIE_NAME, ThemeId } from "../definitions";

export type ThemeColorStore = {
  id: ThemeId;
  change: (id: ThemeId) => void;
};

export const ThemeColorContext = createContext<ReturnType<
  typeof createThemeColorStore
> | null>(null);

/**
 * テーマカラーのストアを生成し、配下のコンポーネントへ提供する
 */
export const ThemeColorProvider = ({
  id,
  children,
}: {
  id: ThemeId;
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createThemeColorStore(id));

  return (
    <ThemeColorContext.Provider value={store}>
      {children}
    </ThemeColorContext.Provider>
  );
};

const createThemeColorStore = (initialThemeId: ThemeId) =>
  createStore<ThemeColorStore>((set) => ({
    id: initialThemeId,
    change: (id) => {
      /**
       * data-theme属性とCookieを更新し、次回アクセス時にサーバーとクライアントのテーマを一致させる
       */
      document.documentElement.setAttribute("data-theme", id);
      Cookies.set(THEME_COOKIE_NAME, id, {
        path: "/",
        expires: 365,
        sameSite: "Lax",
      });

      set({ id });
    },
  }));
