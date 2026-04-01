"use client";

import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { createStore } from "zustand";
import {
  DEFAULT_THEME_ID,
  THEME_COOKIE_NAME,
  ThemeAccentColors,
  ThemeId,
  Themes,
} from "../definitions";
import { favicon } from "../libraries/favicon";

export type ThemeColorStore = {
  id: ThemeId;
  change: (id: ThemeId) => void;
};

export const ThemeColorContext = createContext<ReturnType<
  typeof createThemeColorStore
> | null>(null);

/**
 * DOMのdata-theme属性からテーマIDを読み取り、無効な値の場合はデフォルトにフォールバックする
 */
const readInitialThemeId = (): ThemeId => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_ID;
  }

  const raw = document.documentElement.getAttribute("data-theme");

  return raw && Themes.some(({ value }) => value === raw)
    ? (raw as ThemeId)
    : DEFAULT_THEME_ID;
};

/**
 * テーマカラーのストアを生成し、配下のコンポーネントへ提供する
 */
export const ThemeColorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createThemeColorStore(readInitialThemeId()));

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
       * data-theme属性とCookieを更新し、次回アクセス時にテーマを維持する
       */
      document.documentElement.setAttribute("data-theme", id);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", ThemeAccentColors[id]);
      document
        .querySelector('link[rel="icon"]')
        ?.setAttribute("href", favicon.toDataUrl(ThemeAccentColors[id]));
      Cookies.set(THEME_COOKIE_NAME, id, {
        path: "/",
        expires: 365,
        sameSite: "Lax",
      });

      set({ id });
    },
  }));
